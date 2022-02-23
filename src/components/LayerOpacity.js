import { useEffect, useState } from 'react';
import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    MousePosition,
    ZoomSlider,
} from 'ol/control';
import 'ol/ol.css';
import { createStringXY } from 'ol/coordinate';
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import Slider from '@mui/material/Slider';

import GeoJsonObject from './object.json';

const LayerOpacity = () => {
    const [opacity1, setOpacity1] = useState(0.3);

    function get_random_rgb(opacity) {
        const rgb = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ];
        return 'rgb(' + rgb.join(', ') + ', ' + opacity + ')';
    }

    var xxx = get_random_rgb(0.5);

    const styles = {
        glory1: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'red',
            }),
        }),
        glory2: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(7, 1, 255, 1)',
            }),
        }),
        glory3: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(18, 2, 12, 1)',
            }),
        }),
        glory4: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(9, 42, 56, 1)',
            }),
        }),
        MultiPolygon: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
        }),
        Polygon: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'blue',
                lineDash: [50],
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
            // 주석
            text: new Text({
                font: '20px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(100, 0, 0, 0.7)',
                }),
                scale: [1, 1],
                padding: [5, 5, 5, 5],
                offsetX: 0,
                offsetY: 0,
                text: '텍스트',
            }),
        }),
    };

    const styleFunction = (feature) => {
        return styles[feature.id_];
    };

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject1),
        }),
        style: styleFunction,
        opacity: opacity1,
    });

    const vectorLayer1 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject2),
        }),
        style: styleFunction,
        opacity: opacity1,
    });

    const vectorLayer2 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject3),
        }),
        style: styleFunction,
    });

    const vectorLayer3 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject4),
        }),
        style: styleFunction,
    });

    const select = new Select();

    const translate = new Translate({
        features: select.getFeatures(),
    });
    let opacityValue;
    const handleSliderChange = (event, newValue) => {
        opacityValue = newValue;
        vectorLayer.setOpacity(newValue);
        vectorLayer1.setOpacity(newValue);
        console.log('vectorLayer.opacity', vectorLayer.getOpacity());
        console.log('vectorLayer1.opacity', vectorLayer1.getOpacity());
        console.log('aaaaaaaaaa', vectorLayer);
        console.log('bbbbbbbbbb', vectorLayer1);
        setOpacity1(newValue);
    };

    const map = new Map({
        interactions: defaultInteractions().extend([select, translate]),
        controls: defaultControls({
            attribution: false,
        }).extend([
            new FullScreen({}),
            new ZoomSlider(),
            new Attribution({
                collapsible: true,
            }),
        ]),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer,
            vectorLayer1,
            vectorLayer2,
            vectorLayer3,
            // vectorLayer4,
        ],
        target: 'map1',
        view: new View({
            center: [4.22175695, 51.26939306],
            zoom: 16,
            projection: 'EPSG:4326',
        }),
    });

    const mousePosition = new MousePosition({
        coordinateFormat: createStringXY(5),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
    });

    // const projectionSelect = document.getElementById('projection');
    // projectionSelect.addEventListener('change', function (event) {
    //     mousePosition.setProjection(event.target.value);
    // });

    // const precisionInput = document.getElementById('precision');
    // precisionInput.addEventListener('change', function (event) {
    //     const format = createStringXY(event.target.valueAsNumber);
    //     mousePosition.setCoordinateFormat(format);
    // });

    map.controls.push(mousePosition);

    console.log('mapppppppp', map);

    return (
        <>
            <form style={{ position: 'relative' }}>
                <label htmlFor='projection'>Projection </label>
                <select id='projection'>
                    <option value='EPSG:4326'>EPSG:4326</option>
                    <option value='EPSG:3857'>EPSG:3857</option>
                </select>
                <label htmlFor='precision'>Precision</label>
                <input
                    id='precision'
                    type='number'
                    min='0'
                    max='12'
                    defaultValue='4'
                />
            </form>
            <div
                id='map1'
                className='map'
                style={{ width: '98vw', height: '80vh' }}
            >
                <div style={{ marginBottom: 10 }}>
                    <div
                        style={{
                            display: 'flex',
                            width: 400,
                            height: 20,
                            fontSize: 20,
                        }}
                    >
                        <Slider
                            style={{ margin: '0 20px' }}
                            defaultValue={0.3}
                            aria-label='Default'
                            valueLabelDisplay='auto'
                            step={0.01}
                            min={0}
                            max={1}
                            onChange={handleSliderChange}
                        />
                        {opacity1}
                    </div>
                    <div
                        id='mouse-position'
                        style={{
                            position: 'relative',
                            zIndex: 100,
                            width: '100%',
                            height: 30,
                            margin: '0 auto',
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 600,
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default LayerOpacity;
