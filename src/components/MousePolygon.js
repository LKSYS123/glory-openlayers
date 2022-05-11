import React from 'react';
import { Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { createStringXY } from 'ol/coordinate';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import {
    defaults as defaultInteractions,
    DragBox,
    Select,
    Translate,
} from 'ol/interaction';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    MousePosition,
    ZoomSlider,
} from 'ol/control';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { shiftKeyOnly } from 'ol/events/condition';

import { polygon } from '@turf/turf';
import mask from '@turf/mask';

const MousePolygon = () => {
    const osmLayer = new TileLayer({
        source: new OSM(),
    });

    const dragBox = new DragBox({
        condition: shiftKeyOnly,
    });

    const select = new Select({});

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const map = new Map({
        interactions: defaultInteractions().extend([
            dragBox,
            select,
            translate,
        ]),
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
        layers: [osmLayer],
        target: 'map1',
        view: new View({
            center: [126.8867, 37.5158],
            zoom: 16,
            projection: 'EPSG:4326',
        }),
    });

    /*==========================마우스 드래그해서 도형 생성==========================================*/
    dragBox.on('boxend', (e) => {
        console.log('dragBox dragBox', dragBox);
        console.log(
            'dragBox coordinate',
            dragBox.box_.geometry_.flatCoordinates
        );

        // Axios.post('http://192.168.1.13:4000/api/addPolygon', {
        //     headers: {
        //         Accept: 'application/json',
        //     },
        //     title: 'Polygon',
        //     body: dragBox.box_.geometry_.flatCoordinates,
        // }).then((request) => console.log('request request', request));

        const dragCoordinate = dragBox.getGeometry().getCoordinates();
        const dragPolygon = polygon([dragCoordinate[0]]);
        const gloryMask = polygon([
            [
                [126.887, 37.5193],
                [126.888, 37.5192],
                [126.88786, 37.51825],
                [126.8868, 37.51842],
                [126.887, 37.5193],
            ],
        ]);
        const masked = mask(gloryMask, dragPolygon);
        const dragLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(masked),
            }),
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'black',
                }),
                text: new Text({}),
            }),
        });
        map.addLayer(dragLayer);
    });

    const mousePosition = new MousePosition({
        coordinateFormat: createStringXY(5),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
    });
    /*===============================================================================================*/

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
            <div id='map1' style={{ width: '95vw', height: '83vh' }}></div>
        </>
    );
};

export default MousePolygon;
