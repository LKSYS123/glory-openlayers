import { useState, useEffect, useRef } from 'react';
import { Map as OlMap, View } from 'ol';
import { VectorTile as VectorTileLayer } from 'ol/layer';
import { VectorTile as VectorTileSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { defaults as defaultInteractions } from 'ol/interaction';
import { Stroke, Style } from 'ol/style';
import {
    FullScreenControl,
    MousePositionControl,
    ZoomSliderControl,
    RotationControl,
} from '../controls';
import MapContext from './MapContext';

import 'ol/ol.css';
import '../components/Map.css';

const CargoMap = ({ children }) => {
    const [mapObj, setMapObj] = useState({});
    const mapRef = useRef();

    mapRef.current = mapObj;

    // const select = new Select();

    // const translate = new Translate({
    //     features: select.getFeatures(),
    // });

    useEffect(() => {
        let mapLayer = new VectorTileLayer({
            source: new VectorTileSource({
                maxZoom: 25,
                format: new GeoJSON(),
                // OpenLayers VectorTiles use WMS tile numbering by default.
                url: 'https://grid.plus.codes/grid/wms/{z}/{x}/{y}.json?zoomadjust=2',
            }),
            style: new Style({
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new Map({
            layers: [mapLayer],
            target: 'map2',
            view: new View({
                // projection: 'EPSG:4326',
                // center: fromLonLat([0, 0]),
                center: [0, 0],
                zoom: 23,
                extent: [0, 0, 0, 0],
                enableRotation: false, // 맵 회전금지
                constrainOnlyCenter: true,
            }),
        });

        map.setTarget(mapRef.current);

        setMapObj({ map });
        return () => map.setTarget(undefined);
    }, []);
    return (
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
                <MousePositionControl />
            </div>
        </MapContext.Provider>
    );
};

export default CargoMap;
