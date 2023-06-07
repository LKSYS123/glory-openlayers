import { useState, useEffect, useRef } from 'react';
import { Map as OlMap, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { defaults as defaultInteractions } from 'ol/interaction';
import {
    FullScreenControl,
    MousePositionControl,
    ZoomSliderControl,
    RotationControl,
} from '../controls';
import MapContext from './MapContext';

import 'ol/ol.css';
import '../components/Map.css';

const Map = ({ children }) => {
    const [mapObj, setMapObj] = useState({});
    const mapRef = useRef();

    mapRef.current = mapObj;

    // const select = new Select();

    // const translate = new Translate({
    //     features: select.getFeatures(),
    // });

    useEffect(() => {
        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new OlMap({
            interactions: defaultInteractions().extend([]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            // target: 'map', // 하위 요소 중 id 가 map 인 element가 있어야함.
            view: new View({
                center: fromLonLat([126.91, 37.515881]),
                zoom: 12,
            }),
        });

        // 각도 구현
        map.on('moveend', function () {
            const view = map.getView();
            const RAD_TO_DEG = 180 / Math.PI;
            const rotation = view.getRotation();
            var nowDegree = rotation * RAD_TO_DEG;
            nowDegree = nowDegree % 360;

            if (nowDegree < 0) {
                // degree가 -일때 (좌로 회전)
                nowDegree = 360 - Math.abs(nowDegree);
                if (nowDegree > 359.994) {
                    // 359.995 이상일 때 반올림 되어 360.00이 되므로
                    nowDegree = 0.0;
                }
            } else {
                // degree가 +일때 (우로 회전)
                if (nowDegree > 359.994) {
                    nowDegree = 0.0;
                }
            }
            nowDegree = nowDegree.toFixed(2);
            console.log('rorororororo', nowDegree);
        });

        map.setTarget(mapRef.current);

        setMapObj({ map });
        return () => map.setTarget(undefined);
    }, []);

    // MapContext.Provider 에 객체 저장
    return (
        <>
            <MapContext.Provider value={mapObj}>
                <form>
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
                <div ref={mapRef} style={{ width: '100%', height: '100%' }}>
                    {children}
                    <FullScreenControl />
                    <MousePositionControl />
                    <ZoomSliderControl />
                    <RotationControl />
                </div>
            </MapContext.Provider>
        </>
    );
};

export default Map;
