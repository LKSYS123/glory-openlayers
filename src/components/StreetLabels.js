/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Map as OlMap, View } from 'ol';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    OverviewMap,
    ZoomSlider,
} from 'ol/control';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';

import 'ol/ol.css';
import './Map.css';

function StreetLabels({ children }) {
    const viewExtent = [14105000, 4495000, 14165000, 4535000];

    useEffect(() => {
        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new OlMap({
            controls: defaultControls({
                zoom: true,
                attribution: false,
            }).extend([
                new FullScreen({}),
                new ZoomSlider(),
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
                // center: fromLonLat([126.886490, 37.515881]),
                center: fromLonLat([127.0, 37.55]),
                extent: viewExtent,
                zoom: 13,
            }),
        });

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
