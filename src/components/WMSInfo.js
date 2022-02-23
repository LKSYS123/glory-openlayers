import React, { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileWMS } from 'ol/source';
import { createStringXY } from 'ol/coordinate';
import {
    defaults as defaultControls,
    Attribution,
    MousePosition,
} from 'ol/control';

const WmsInfo = () => {
    useEffect(() => {
        const wmsSource = new TileWMS({
            url: 'http://192.168.1.59:8080/geoserver/MyFirstProject/wms',
            params: { LAYERS: 'Land', TILED: true },
            serverType: 'geoserver',
            // Countries have transparency, so do not fade tiles:
            transition: 0,
        });

        const wmsLayer = new TileLayer({
            source: wmsSource,
        });

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const view = new View({
            center: [1851716.2622, 4813000.4846],
            zoom: 13,
        });

        const map = new Map({
            controls: defaultControls({ attribution: false }).extend([
                new Attribution({
                    collapsible: true,
                }),
            ]),
            layers: [osmLayer, wmsLayer],
            target: 'map',
            view: view,
        });

        map.on('click', function (evt) {
            document.getElementById('info').innerHTML = '';
            const viewResolution = /** @type {number} */ (view.getResolution());
            // let evt1 = {};
            // for (evt1 in evt) {
            //     console.log('evt ======== ' + evt1);
            // }
            const url = wmsSource.getFeatureInfoUrl(
                evt.coordinate,
                viewResolution,
                'EPSG:3857',
                { INFO_FORMAT: 'text/html' }
            );
            if (url) {
                fetch(url)
                    .then((response) => response.text())
                    .then((html) => {
                        document.getElementById('info').innerHTML = html;
                    });
            }
            console.log(wmsLayer.getSource());
            // console.log(wmsLayer.getSource().getTileCoordForTileUrlFunction('ol_uid'));
        });

        // map.on('pointermove', function (evt) {
        //     if (evt.dragging) {
        //         return;
        //     }
        //     const pixel = map.getEventPixel(evt.originalEvent);
        //     const hit = map.forEachLayerAtPixel(pixel, function () {
        //         return true;
        //     });
        //     map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        // });

        // mousePosition
        if (!map) return;
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(8),
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
            <div id='info'>인포인포인포인포인포인포인포인포인포인포</div>
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
                id='map'
                className='map'
                style={{ width: '98vw', height: '89vh' }}
            >
                <div style={{ marginBottom: 10 }}>
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
};

export default WmsInfo;
