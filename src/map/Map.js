import { useState, useEffect } from 'react';
import { Map as OlMap, View } from 'ol';
import { Attribution, defaults as defaultControls } from 'ol/control';
import { Tile as TileLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import { defaults as defaultInteractions } from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import squareGrid from '@turf/square-grid';
import GeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import MapContext from './MapContext';
import {
    FullScreenControl,
    MousePositionControl,
    ZoomSliderControl,
    RotationControl,
} from '../controls';
import 'ol/ol.css';
import '../components/Map.css';

const Map = ({ children, interactions }) => {
    const [mapObj, setMapObj] = useState({});

    const attribution = new Attribution({
        collapsible: true,
    });
    var bbox = [14120000, 4509000, 14130000, 4514000];
    var options = { units: 'kilometers' };
    var poly = squareGrid(bbox, 1000, options);

    var vectorSourcePolygons = new VectorSource({
        features: new GeoJSON().readFeatures(poly),
    });

    const vectorSource = new VectorSource({
        format: new GeoJSON(),
        url: function (extent) {
            var srcUrl =
                'http://192.168.1.47:8088/geoserver/GloryGis/ows?service=WFS&version=1.0.0&request=GetFeature&' +
                'typeName=GloryGis%3Atl_emd._seoul_4326&maxFeatures=100&outputFormat=application/json';
            return srcUrl;
            // 'http://192.168.1.59:8080/geoserver/MyFirstProject/ows?service=WFS&' +
            // 'version=1.0.0&request=GetFeature&typeName=MyFirstProject%' +
            // '3ALand&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857&' +
            // 'bbox=' +
            // extent.join(',') +
            // ',EPSG:3857'
        },
        strategy: bboxStrategy,
    });

    var vectorLayerPolygons = new VectorLayer({
        source: vectorSource,
        style: [
            new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(9, 42, 56, 0.3)',
                }),
            }),
        ],
    });

    // const select = new Select();

    // const translate = new Translate({
    //     features: select.getFeatures(),
    // });

    useEffect(() => {
        // Map 객체 생성 및 OSM 배경지도 추가
        const map = new OlMap({
            interactions: defaultInteractions().extend([]),
            controls: defaultControls({ attribution: false }).extend([
                attribution,
            ]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayerPolygons,
            ],
            target: 'map', // 하위 요소 중 id 가 map 인 element가 있어야함.
            view: new View({
                center: fromLonLat([126.88649, 37.515881]),
                zoom: 12,
                rotation: Math.PI / 180,
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
        setMapObj({ map });
        return () => map.setTarget(undefined);
    }, []);

    // MapContext.Provider 에 객체 저장
    return (
        <MapContext.Provider value={mapObj}>
            {children}
            <FullScreenControl />
            <MousePositionControl />
            <ZoomSliderControl />
            <RotationControl />
        </MapContext.Provider>
    );
};

export default Map;
