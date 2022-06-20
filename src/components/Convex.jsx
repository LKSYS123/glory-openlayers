import React, { useEffect } from 'react';
import { Feature, Map as OlMap, View } from 'ol';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Polygon } from 'ol/geom';
import { Fill, Stroke, Style } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource, OSM } from 'ol/source';
import {
    DragBox,
    Draw,
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';

import { convex } from '@turf/turf';

import 'ol/ol.css';

const Convex = () => {
    function styleFunction(feature) {
        const style = new Style({
            stroke: new Stroke({
                color: 'red',
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(148, 189, 255, 0.6)',
            }),
        });

        return style;
    }

    // ================= Sources & Layers ====================
    const vectorSource = new VectorSource({});

    const osmLayer = new TileLayer({
        source: new OSM({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        }),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction,
    });

    const gloryLayer = new VectorLayer({
        source: new VectorSource({}),
        style: styleFunction,
    });

    const formatGeoJSON = new GeoJSON();

    // ====================== Interactions ======================
    const select = new Select({});

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const dragBox = new DragBox({
        condition: shiftKeyOnly,
    });

    const draw = new Draw({
        source: vectorSource,
        type: 'Polygon',
        // geometryFunction: createBox(),
    });

    // =========================== Map ==============================

    const map = new OlMap({
        interactions: defaultInteractions().extend([
            select,
            translate,
            dragBox,
        ]),
        // layers: [osmLayer, vectorLayer],
        layers: [osmLayer],
        target: 'map2',
        view: new View({
            center: [470450, 6669945],
            zoom: 16,
        }),
    });

    // =========================== 도형도형 ==============================

    const gloryFeature0 = new Feature({
        geometry: new Polygon([
            [
                [470000, 6670640],
                [470400, 6670640],
                [470400, 6670308],
                [470000, 6670308],
                [470000, 6670640],
            ],
        ]),
    });

    const gloryFeature1 = new Feature({
        geometry: new Polygon([
            [
                [470500, 6670700],
                [470900, 6670700],
                [470900, 6670200],
                [470500, 6670200],
                [470500, 6670700],
            ],
        ]),
    });

    const gloryFeature2 = new Feature({
        geometry: new Polygon([
            [
                [470000, 6669900],
                [470400, 6669900],
                [470400, 6669500],
                [470000, 6669500],
                [470000, 6669900],
            ],
        ]),
    });

    const gloryFeature3 = new Feature({
        geometry: new Polygon([
            [
                [470500, 6670000],
                [470900, 6670000],
                [470900, 6669400],
                [470500, 6669400],
                [470500, 6670000],
            ],
        ]),
    });

    const polygon0 = formatGeoJSON.writeFeatureObject(gloryFeature0, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857',
    });

    const polygon1 = formatGeoJSON.writeFeatureObject(gloryFeature1, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857',
    });

    const polygon2 = formatGeoJSON.writeFeatureObject(gloryFeature2, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857',
    });

    const polygon3 = formatGeoJSON.writeFeatureObject(gloryFeature3, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:3857',
    });

    const gloryFeatures0 = {
        type: 'FeatureCollection',
        features: [polygon1, polygon2, polygon3],
    };

    const hull = convex(gloryFeatures0);

    const convexFeature = new Feature({
        geometry: new Polygon(hull.geometry.coordinates),
    });

    const gloryFeatures1 = {
        type: 'FeatureCollection',
        features: [
            gloryFeature0,
            gloryFeature1,
            gloryFeature2,
            gloryFeature3,
            convexFeature,
        ],
    };

    gloryLayer.getSource().addFeatures(gloryFeatures1.features);
    map.addLayer(gloryLayer);

    // ========================== 마우스 현재 좌표 ==============================

    useEffect(() => {
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(8),
            projection: 'EPSG:3857',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
        });

        map.controls.push(mousePosition);
    });

    function startDraw() {
        vectorLayer.getSource().clear();
        map.addInteraction(draw);
    }

    return (
        <>
            <div style={{ height: 30 }}>
                <button
                    onClick={startDraw}
                    style={{
                        background: '#3b86ff',
                        font: '600 15px sans-serif',
                        color: 'white',
                    }}
                >
                    도형 그리기
                </button>
            </div>
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
            <div
                id='map2'
                className='map'
                style={{ width: '95vw', height: '74vh', position: 'relative' }}
            ></div>
        </>
    );
};

export default Convex;
