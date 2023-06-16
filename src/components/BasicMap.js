/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Feature, Map as OlMap, View } from 'ol';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import { DragBox, Draw, Modify, Select, Translate } from 'ol/interaction';
import { Button, makeStyles } from '@material-ui/core';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { Circle, LineString, Point, Polygon } from 'ol/geom';
import { transform } from 'ol/proj';

import { polygon as turfPolygon } from '@turf/turf';

import GeoJsonObject from './object.json';

import 'ol/ol.css';
import './Map.css';

const useStyles = makeStyles((theme) => ({
    container: {
        // CREATE, UPDATE, DELETE 버튼
        '& .MuiButton-outlinedPrimary': {
            minWidth: 80,
            height: 30,
            padding: 0,
            color: 'white',
            lineHeight: 1.5,
            border: '1px solid #0ab8ec',
            background: '#005ca7',
            '&:hover': {
                background: '#0ab8ec',
                color: 'white',
                fontWeight: 500,
            },
            '& .MuiButton-label': {
                height: 'inherit',
                borderRadius: 4,
            },
        },
    },
}));

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

const BasicMap = () => {
    const classes = useStyles();
    const mapRef = useRef();
    const [state, setState] = useState('');
    const styleFunction = (feature) => {
        return styles[feature.id_];
    };

    const aa = turfPolygon([
        [
            [-81, 41],
            [-81, 47],
            [-72, 47],
            [-72, 41],
            [-81, 41],
        ],
    ]);

    console.log(aa);

    const vectorLayer1 = new VectorLayer({
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject1),
        }),
        style: styleFunction,
    });

    const vectorLayer = new VectorLayer({
        className: '{class명}', // default는 'ol-layer'
        source: new VectorSource({
            features: new GeoJSON().readFeatures(GeoJsonObject.sampleObject1),
        }),
        // style: new Style({
        //     // 테두리
        //     stroke: new Stroke({
        //         color: 'black',
        //         // lineDash: [20],
        //         width: 2,
        //     }),
        //     // 내부 색상
        //     fill: new Fill({
        //         color: 'rgba(0, 255, 0, 0.1)',
        //     }),
        //     // // 내부TEXT
        //     // text: new Text({
        //     //     font: '20px Calibri,sans-serif',
        //     //     fill: new Fill({
        //     //         color: 'rgba(255, 255, 255, 1)',
        //     //     }),
        //     //     backgroundFill: new Fill({
        //     //         color: 'rgba(100, 0, 0, 0.7)',
        //     //     }),
        //     //     scale: [1, 1],
        //     //     padding: [5, 5, 5, 5],
        //     //     offsetX: 0,
        //     //     offsetY: 0,
        //     //     text: '텍스트',
        //     // }),
        // }),
        style: styleFunction,
    });

    // Map 객체 생성 및 OSM 배경지도 추가
    const map = new OlMap({
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer,
        ],
        target: 'map', // 하위 요소 중 id 가 map 인 element가 있어야함.
        view: new View({
            center: [126.88899, 37.514881],
            // center: [127.67898487386401, 34.91269180101893],
            projection: 'EPSG:4326',
            // extent: [126.82649, 37.501881, 126.92649, 37.518881],
            zoom: 18,
        }),
    });

    // Features =====================================================
    const lineString = new LineString([
        [126.88899, 37.512881],
        [126.88899, 37.514881],
    ]);

    const point = new Point([126.88899, 37.512881]);

    const polygon = new Polygon([
        [
            [126.88649, 37.515881],
            [126.89149, 37.515881],
            [126.89149, 37.513881],
            [126.88649, 37.513881],
            [126.88649, 37.515881],
        ],
    ]);
    const beforeCord = [
        [-52.49999999999999, -182.30389217063725],
        [-52.49999999999999, 1150.2727818249282],
        [-52.49999999999999, 1150.2685657024624],
        [-52.49999999999999, 192.48259181663462],
        [-52.49999999999999, 1.850798276088958],
        [-52.49999999999999, 1.8507990115639028],
        [-52.49999999999999, -182.30370343409814],
        [-52.49999999999999, -182.30389217063725],
    ];
    let afterCord = [];
    beforeCord.map((record) => {
        const result = transform(record, 'EPSG:3857', 'EPSG:4326');
        afterCord.push(result);
    });
    console.log(afterCord);
    const polygon1 = new Polygon([
        [
            [127.67867760242724, 34.91254616875249],
            [127.67867872785033, 34.91306557833056],
            [127.67898568415438, 34.91306512664243],
            [127.67898487386401, 34.91269180101893],
            [127.67879773736979, 34.91261777181701],
            [127.67876445840751, 34.91261782077294],
            [127.67876430280654, 34.91254604125255],
            [127.67867760242724, 34.91254616875249],
        ],
    ]);
    const polygon2 = new Polygon([afterCord]);
    const qwe = transform(
        [127.67867760242724, 34.91254616875249],
        'EPSG:4326',
        'EPSG:3857'
    );
    console.log(transform(qwe, 'EPSG:3857', 'EPSG:4326'));
    console.log(
        transform(
            [127.67867760242724, 34.91254616875249],
            'EPSG:4326',
            'EPSG:3857'
        )
    );

    const circle = new Circle([126.88649, 37.515881], 0.1);

    const lineFeature = new Feature({
        geometry: lineString,
        name: 'lineString',
    });

    const pointFeature = new Feature({
        geometry: point,
    });

    const polygonFeature = new Feature({
        geometry: polygon,
    });
    const polygonFeature2 = new Feature({
        geometry: polygon2,
    });

    const circleFeature = new Feature({
        geometry: circle,
    });

    // vectorLayer.getSource().addFeatures([
    //     lineFeature,
    //     pointFeature,
    //     polygonFeature,
    //     // polygonFeature2,
    //     // circleFeature,
    // ]);

    // Interactions =======================================================
    const select = new Select();

    const modify = new Modify({
        features: select.getFeatures(),
    });

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const draw = new Draw({
        source: new VectorSource({ wrapX: false }),
        type: 'Polygon',
    });

    draw.on('drawend', (e) => {
        console.log(e);
        vectorLayer.getSource().addFeatures([e.feature]);
        map.removeInteraction(draw);
    });

    const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
    });

    // map.addControl(new FullScreen());

    // map.addLayer(vectorLayer);

    const onClickBut = (e) => {
        const { textContent } = e.target;
        if (textContent === 'MODIFY') {
            map.removeInteraction(translate);
            map.removeInteraction(draw);
            map.removeInteraction(dragBox);
            map.addInteraction(select);
            map.addInteraction(modify);
        } else if (textContent === 'TRANSLATE') {
            map.removeInteraction(modify);
            map.removeInteraction(draw);
            map.removeInteraction(dragBox);
            map.addInteraction(select);
            map.addInteraction(translate);
        } else if (textContent === 'DRAW') {
            map.removeInteraction(modify);
            map.removeInteraction(translate);
            map.removeInteraction(dragBox);
            map.removeInteraction(select);
            map.addInteraction(draw);
        } else if (textContent === 'DRAGBOX') {
            map.removeInteraction(translate);
            map.removeInteraction(draw);
            map.removeInteraction(modify);
            map.addInteraction(dragBox);
        }
    };

    useEffect(() => {
        map.setTarget(mapRef.current);
    }, []);

    // mousePosition
    // if (!map) return;
    // const mousePosition = new MousePosition({
    //     coordinateFormat: createStringXY(4),
    //     projection: 'EPSG:3857',
    //     className: 'custom-mouse-position',
    //     target: document.getElementById('mouse-position'),
    // });

    // const projectionSelect = document.getElementById('projection');
    // projectionSelect.addEventListener('change', function (event) {
    //     mousePosition.setProjection(event.target.value);
    // });

    // const precisionInput = document.getElementById('precision');
    // precisionInput.addEventListener('change', function (event) {
    //     const format = createStringXY(event.target.valueAsNumber);
    //     mousePosition.setCoordinateFormat(format);
    // });
    // map.controls.push(mousePosition);

    return (
        <div className={classes.container} style={{ height: '85vh' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 50,
                    border: '2px solid gray',
                    borderRadius: 4,
                    paddingLeft: 10,
                }}
            >
                <Button
                    variant='outlined'
                    color='primary'
                    style={{ width: 100, marginRight: 20, fontWeight: 550 }}
                    onClick={onClickBut}
                >
                    MODIFY
                </Button>
                <Button
                    variant='outlined'
                    color='primary'
                    style={{ width: 100, marginRight: 20, fontWeight: 550 }}
                    onClick={onClickBut}
                >
                    TRANSLATE
                </Button>
                <Button
                    variant='outlined'
                    color='primary'
                    style={{ width: 100, marginRight: 20, fontWeight: 550 }}
                    onClick={onClickBut}
                >
                    DRAW
                </Button>
                <Button
                    variant='outlined'
                    color='primary'
                    style={{ width: 100, marginRight: 20, fontWeight: 550 }}
                    onClick={onClickBut}
                >
                    DRAGBOX
                </Button>
            </div>
            <div
                id='map'
                className='map'
                ref={mapRef}
                style={{ width: '98vw', height: '90%' }}
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
                            position: 'absolute',
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
        </div>
    );
};

export default BasicMap;
