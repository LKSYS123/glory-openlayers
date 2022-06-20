/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Map as OlMap, View } from 'ol';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    OverviewMap,
} from 'ol/control';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { OSM, Vector as VectorSource } from 'ol/source';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { Fill, Stroke, Style, Text } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';

import GeoJsonObject from './object.json';

import 'ol/ol.css';
import './Map.css';

function StreetLabels({ children }) {
    useEffect(() => {
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

        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new OlMap({
            controls: defaultControls({
                attribution: false,
            }).extend([
                new FullScreen({}),
                new OverviewMap({
                    layers: [
                        new TileLayer({
                            source: new OSM(),
                        }),
                    ],
                }),
                new Attribution({
                    collapsible: true,
                }),
            ]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            target: 'map', // 하위 요소 중 id 가 map 인 element가 있어야함.
            view: new View({
                center: fromLonLat([126.83649, 37.505881]),
                projection: 'EPSG:4326',
                // center: fromLonLat([51.3, 4.2]),
                extent: [126.82649, 37.501881, 126.92649, 37.518881],
                zoom: 1,
            }),
        });

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(
                    GeoJsonObject.sampleObject1
                ),
            }),
            style: styleFunction,
        });

        map.addLayer(vectorLayer);

        // mousePosition
        if (!map) return;
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:3857',
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
    }, []);

    return (
        <>
            <div
                id='map'
                className='map'
                style={{ width: '98vw', height: '89vh' }}
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
        </>
    );
}

export default StreetLabels;
