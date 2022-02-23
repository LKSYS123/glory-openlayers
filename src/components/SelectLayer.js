/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    MousePosition,
    ZoomSlider,
} from 'ol/control';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Fill, Stroke, Style } from 'ol/style';
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import GeoJsonObject from './object.json';
import { createStringXY } from 'ol/coordinate';

// import VectorLayer from '../layers/VectorLayer';
// import Layers from '../layers/Layers';

const SelectLayer = () => {
    const styles = {
        glory1: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'black',
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
                color: 'black',
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
                color: 'black',
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
                color: 'black',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(184, 33, 11, 1)',
            }),
        }),
        glory5: new Style({
            // 테두리
            stroke: new Stroke({
                color: 'black',
                width: 2,
            }),
            // 내부 색상
            fill: new Fill({
                color: 'rgba(93, 157, 11, 1)',
            }),
        }),
    };

    const styleFunction = (feature) => {
        return styles[feature.id_];
    };

    // const translateFunction = ({ selectLayer, map }) => {
    //     let translate = new Translate({
    //         features: selectLayer.getFeatures(),
    //     });

    //     map.addInteraction(translate);
    // };

    const osmLayer = new TileLayer({
        source: new OSM(),
    });

    const vectorLayer1 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject1),
        }),
        style: styleFunction,
    });

    const vectorLayer2 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject2),
        }),
        style: styleFunction,
    });

    const vectorLayer3 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject3),
        }),
        style: styleFunction,
    });

    const vectorLayer4 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject4),
        }),
        style: styleFunction,
    });

    const selectedLayer1 = new Select({
        layers: [vectorLayer1],
        style: new Style({
            fill: new Fill({
                color: 'green',
            }),
        }),
    });
    const selectedLayer2 = new Select({
        layers: [vectorLayer2],
        style: new Style({
            fill: new Fill({
                color: 'yellow',
            }),
        }),
    });
    const selectedLayer3 = new Select({
        layers: [vectorLayer3],
        style: new Style({
            fill: new Fill({
                color: 'purple',
            }),
        }),
    });
    const selectedLayer4 = new Select({
        layers: [vectorLayer4],
        style: new Style({
            fill: new Fill({
                color: 'orange',
            }),
        }),
    });

    let selectLayer = new Select({});

    function translateFunction(selectLayer) {
        let translate = new Translate({
            features: selectLayer.getFeatures(),
        });
        return translate;
    }

    function layerChange(event) {
        map.removeInteraction(selectLayer);
        map.removeInteraction(translateFunction(selectLayer));

        if (event.target.value === 'vectorLayer1') {
            selectLayer = selectedLayer1;
        } else if (event.target.value === 'vectorLayer2') {
            selectLayer = selectedLayer2;
        } else if (event.target.value === 'vectorLayer3') {
            selectLayer = selectedLayer3;
        } else {
            selectLayer = selectedLayer4;
        }

        map.addInteraction(translateFunction(selectLayer));
        map.addInteraction(selectLayer);

        console.log('map Interactions', map.getInteractions());

        return selectLayer;
    }

    // useEffect(() => {
    //     console.log('inter inter', map.getInteractions());
    //     console.log('selectLayer selectLayer', selectLayer);
    //     console.log('select select', select);
    //     map.addInteraction(select);
    // }, [selectLayer]);

    const map = new Map({
        interactions: defaultInteractions().extend([]),
        controls: defaultControls({
            zoom: true,
            attribution: false,
        }).extend([
            new FullScreen({}),
            new ZoomSlider(),
            new Attribution({
                collapsible: true,
            }),
        ]),
        layers: [
            osmLayer,
            vectorLayer1,
            vectorLayer2,
            vectorLayer3,
            vectorLayer4,
        ],
        target: 'map1',
        view: new View({
            center: [4.22175695, 51.26939306],
            zoom: 16,
            projection: 'EPSG:4326',
        }),
    });

    console.log('map Interaions', map.getInteractions());

    const glory = document.getElementById('map1');

    // glory.addEventListener('mousedown', (e) => {
    //     console.log('mousedown mousedown mousedown mousedown');
    // });

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

    return (
        <>
            <div style={{ margin: 15 }}>
                <div
                    className='layersOption'
                    style={{ marginBottom: 10, border: '2px solid black' }}
                >
                    <span
                        style={{
                            margin: 20,
                            width: 300,
                            fontSize: 30,
                            fontWeight: 700,
                        }}
                    >
                        레이어 선택
                    </span>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby='demo-row-radio-buttons-group-label'
                            name='row-radio-buttons-group'
                            onChange={layerChange}
                            defaultChecked
                        >
                            <FormControlLabel
                                value='vectorLayer1'
                                control={<Radio />}
                                label='vectorLayer1'
                            />
                            <FormControlLabel
                                value='vectorLayer2'
                                control={<Radio />}
                                label='vectorLayer2'
                            />
                            <FormControlLabel
                                value='vectorLayer3'
                                control={<Radio />}
                                label='vectorLayer3'
                            />
                            <FormControlLabel
                                value='vectorLayer4'
                                control={<Radio />}
                                label='vectorLayer4'
                            />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div
                    id='map1'
                    className='map'
                    style={{ width: '96vw', height: '80vh' }}
                >
                    {/* <Layers>
                        <VectorLayer
                            source={vectorSource1}
                            style={styleFunction}
                        />
                    </Layers> */}
                </div>
            </div>
        </>
    );
};

export default SelectLayer;
