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
import { shiftKeyOnly } from 'ol/events/condition';
import { polygon } from '@turf/turf';
import { Fill, Stroke, Style, Text } from 'ol/style';

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
        console.log('eeeeeeeeee', e);
        const dragcoordinate = dragBox.getGeometry().getCoordinates();
        const dragPolygon = polygon([dragcoordinate[0]]);
        const dragLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(dragPolygon),
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
            <div id='map1' style={{ width: '95vw', height: '85vh' }}></div>
        </>
    );
};

export default MousePolygon;
