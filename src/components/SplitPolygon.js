import React, { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Map as OlMap, View } from 'ol';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';

import { OSM } from 'ol/source';
import { bbox } from '@turf/turf';
import rectangleGrid from '@turf/rectangle-grid';

import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';

import 'ol/ol.css';

const SplitPolygon = () => {
    const raster = new TileLayer({
        source: new OSM(),
    });

    const sourceDrawnPolygons = new VectorSource({ wrapX: false });

    // function style(feature) {
    //     const style = new Style({
    //         stroke: new Stroke({
    //             color: [0, 0, 255, 0.8],
    //             width: 1,
    //         }),
    //         fill: new Fill({
    //             color: feature.get('color'),
    //         }),
    //         text: new Text({
    //             text: Math.floor(feature.get('percentage') * 100) + '%',
    //         }),
    //     });
    //     return style;
    // }

    function styleFunction(feature) {
        const style = new Style({
            stroke: new Stroke({
                color: 'red',
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(9, 42, 56, 0.3)',
            }),
            text: new Text({
                font: '20px sans-serif',
                text: feature.ol_uid,
            }),
        });

        return style;
    }

    const formatGeoJSON = new GeoJSON();

    const vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: styleFunction,
    });

    const select = new Select();

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const map = new OlMap({
        interactions: defaultInteractions().extend([select, translate]),
        layers: [raster, vectorLayer],
        target: 'map2',
        view: new View({
            center: [14125000, 4511500],
            zoom: 19,
        }),
    });

    /*=================== 마우스 커서 현재 좌표 =======================*/
    useEffect(() => {
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(5),
            projection: 'EPSG:4326',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
        });

        const projectionSelect = document.getElementById('projection');
        projectionSelect.addEventListener('change', function (event) {
            mousePosition.setProjection(event.target.value);
        });

        const precisionInput = document.getElementById('precision');
        precisionInput.addEventListener('change', function (event) {
            const format = createStringXY(event.target.valueAsNumber);
            mousePosition.setCoordinateFormat(format);
        });
        map.controls.push(mousePosition);
    });

    const draw = new Draw({
        source: sourceDrawnPolygons,
        type: 'Circle',
        geometryFunction: createBox(),
    });
    draw.on('drawend', drawEnd);

    function startDraw() {
        map.addInteraction(draw);
        vectorLayer.getSource().clear();
    }

    function drawEnd(e) {
        // 도형 갯수
        // const nDivisions = document.getElementById('nDivisions').value;
        // const colors = [];
        // for (var i = 0; i < nDivisions; i++) {
        //     colors.push(get_random_rgb(0.5));
        // }
        // const dividedPolygonFeatures = polygonDivide(
        //     e.feature,
        //     nDivisions,
        //     colors
        // );

        const dividedPolygonFeatures = polygonDivide(e.feature);

        console.log('Features Features Features', dividedPolygonFeatures);
        vectorLayer.getSource().addFeatures(dividedPolygonFeatures);

        // for (var i = 0; i < 5; i++) {
        //     console.log('iiiii', i);
        //     vectorLayer.getSource().removeFeature(dividedPolygonFeatures[i]);
        // }

        // for (
        //     var i = dividedPolygonFeatures.length - 1;
        //     i > dividedPolygonFeatures.length - 10;
        //     i--
        // ) {
        //     console.log('iiiii', i);
        //     vectorLayer.getSource().removeFeature(dividedPolygonFeatures[i]);
        // }

        map.removeInteraction(draw);
    }

    // function polygonDivide(polygonFeature, nDivisions, colors) {
    function polygonDivide(polygonFeature) {
        const polygon = formatGeoJSON.writeFeatureObject(polygonFeature, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857',
        });
        const polygonBbox = bbox(polygon);

        console.log('polygonBbox', polygonBbox);

        var cellWidth = 500;
        var cellHeight = 1000;
        var options = { units: 'kilometers' };

        var rectangleGridSample = rectangleGrid(
            polygonBbox,
            cellWidth,
            cellHeight,
            options
        );

        // var poly = squareGrid(polygonBbox, 1000, options);
        // console.log('pppoly', poly, options);

        const dividedPolygonFeatures = new GeoJSON().readFeatures(
            // poly
            rectangleGridSample,
            { dataProjection: 'EPSG:3857', featureProjection: 'EPSG:3857' }
        );

        console.log('qqqqqqqqqqqqqqqqqqqq', rectangleGridSample);

        return dividedPolygonFeatures;
    }

    // 도형 색 랜덤 추출
    function get_random_rgb(opacity) {
        const rgb = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ];
        return 'rgb(' + rgb.join(', ') + ', ' + opacity + ')';
    }

    return (
        <>
            <div style={{ marginBottom: 10 }}></div>
            <div style={{ height: 30 }}>
                <div style={{ marginBottom: 2, float: 'left', marginTop: 2 }}>
                    <button
                        value='Polygon'
                        onClick={startDraw()}
                        className='button'
                    >
                        Start polygon draw
                    </button>
                </div>
            </div>
            <div
                id='map2'
                className='map'
                style={{ width: '95vw', height: '80vh', position: 'relative' }}
            >
                <div style={{ marginBottom: 10 }}>
                    <form style={{ position: 'absolute' }}>
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
                        id='mouse-position'
                        style={{
                            zIndex: 100,
                            width: '100%',
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

export default SplitPolygon;
