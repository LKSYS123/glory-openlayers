import React, { useEffect, useRef, useState } from 'react';
import {
    ChangeHistory,
    CropPortraitOutlined,
    CircleOutlined,
    PentagonOutlined,
    StorefrontOutlined,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { Feature, Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { XYZ, Vector as VectorSource, OSM } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import { Circle, LineString, Polygon } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { Draw, Modify } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

import './CargoMaker.css';
import 'ol/ol.css';
import MapContext from '../map/MapContext';

const CargoMaker1 = ({ children }) => {
    // ============================= State & Ref ==========================
    const [nowDrawing, setNowDrawing] = useState(false);
    const [mapObj, setMapObj] = useState({});
    const mapRef = useRef();

    const [featureLength, setFeatureLength] = useState(0);
    const [featureWidth, setFeatureWidth] = useState(0);

    mapRef.current = mapObj;

    let nowSelect;
    let nowModify;
    let nowLayer;
    // ========================== MAP ================================
    useEffect(() => {
        const map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                new TileLayer({
                    source: new XYZ({
                        url: 'https://grid.plus.codes/grid/wms/{z}/{x}/{y}.png?col=black',
                    }),
                }),
            ],
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

        setMapObj(map);
        return () => map.setTarget(undefined);
    }, []);

    const formatGeoJSON = new GeoJSON();

    // ==================================== Interactions =========================================

    const draw = new Draw({
        source: new VectorSource({}),
        type: 'Polygon',
    });

    // ================================== line 길이 구하기 ==================================

    const formatLength = (line, inProjection) => {
        const length = getLength(line, {
            projection: 'EPSG:' + inProjection,
        });
        let output;
        // if (length > 100) {
        // 'KM'
        // output = Math.round((length / 1000) * 100) / 100;

        // mm를 km으로 표현, 1mm => 0.000001km
        output = ((length / 1000) * 100) / 100;

        // } else {
        //     // 'M'
        // output = Math.round(length * 100) / 100;
        // }
        return output.toFixed(6);
    };

    // ===================== 맵 중앙으로 이동 ===========================

    const moveToCenter = () => {
        mapObj.getView().setCenter([0, 0]);
    };

    // =================== 버튼 클릭시 도형 생성 ==========================

    let triangleLayer;
    let squareLayer;
    let pentagonLayer;
    let circleLayer;
    let elephantLayer;
    let customLayer;

    const removeLayers = () => {
        mapObj.removeLayer(triangleLayer);
        mapObj.removeLayer(squareLayer);
        mapObj.removeLayer(pentagonLayer);
        mapObj.removeLayer(circleLayer);
        mapObj.removeLayer(elephantLayer);
        mapObj.removeLayer(customLayer);
        console.log(mapObj.getLayers());
    };

    // useEffect(() => {
    //     if (mapObj !== undefined) {
    //         removeLayers();
    //     }
    // }, [mapObj]);

    // 삼각형
    const makeTriangle = () => {
        removeLayers();
        triangleLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 91, 77, 0.7)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        const triangleFeature = new Feature({
            geometry: new Polygon([
                [
                    [0, 2.3275],
                    [0.9385, -2.3275],
                    [-0.9385, -2.3275],
                    [0, 2.3275],
                ],
            ]),
        });

        // const triangleFeature = turfCircle([0, 0], 10, { steps: 10 });

        // const turfTurf = formatGeoJSON.readFeatures(triangleFeature, {
        //     dataProjection: 'EPSG:3857',
        //     featureProjection: 'EPSG:3857',
        // });

        // const triangleFeatures = {
        //     type: 'Feature',
        //     features: [turfTurf[0]],
        // };

        const triangleCoord = triangleFeature.getGeometry().getCoordinates();
        const triangleWidth = new LineString([
            triangleCoord[0][1],
            triangleCoord[0][2],
        ]);

        setFeatureWidth(1);
        setFeatureLength(1);

        const triangleFeatures = {
            type: 'Feature',
            features: [triangleFeature],
        };

        triangleLayer.getSource().addFeatures(triangleFeatures.features);
        nowLayer = triangleLayer;
        mapObj.addLayer(triangleLayer);
    };

    // 사각형
    const makeSquare = () => {
        removeLayers();
        squareLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(0, 112, 15, 0.7)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        const squareFeature = new Feature({
            geometry: new Polygon([
                [
                    [-0.9385, 2.3275],
                    [0.9385, 2.3275],
                    [0.9385, -2.3275],
                    [-0.9385, -2.3275],
                    [-0.9385, 2.3275],
                ],
            ]),
        });

        const squareCoord = squareFeature.getGeometry().getCoordinates();
        const squareWidth = new LineString([
            squareCoord[0][0],
            squareCoord[0][1],
        ]);

        const squareLength = new LineString([
            squareCoord[0][1],
            squareCoord[0][2],
        ]);

        setFeatureLength(formatLength(squareLength, 3857));
        setFeatureWidth(formatLength(squareWidth, 3857));

        console.log('width ====> ', formatLength(squareWidth, 3857));
        console.log('Length ====> ', formatLength(squareLength, 3857));

        const squareFeatures = {
            type: 'Feature',
            features: [squareFeature],
        };

        squareLayer.getSource().addFeatures(squareFeatures.features);
        nowLayer = squareLayer;
        mapObj.addLayer(squareLayer);
    };

    // 오각형
    const makePentagon = () => {
        removeLayers();
        pentagonLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(0, 42, 255, 0.5)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        const pentagonFeature = new Feature({
            geometry: new Polygon([
                [
                    [0, 2.3275],
                    [2, 0.7],
                    [0.9385, -2.3275],
                    [-0.9385, -2.3275],
                    [-2, 0.7],
                    [0, 2.3275],
                ],
            ]),
        });

        const pentagonCoord = pentagonFeature.getGeometry().getCoordinates();
        const pentagonWidth = new LineString([
            pentagonCoord[0][4],
            pentagonCoord[0][1],
        ]);

        const pentagonLength = new LineString([
            pentagonCoord[0][1],
            pentagonCoord[0][2],
        ]);

        setFeatureWidth(2);
        setFeatureLength(2);

        console.log('width ====> ', formatLength(pentagonWidth, 3857));
        console.log('Length ====> ', formatLength(pentagonLength, 3857));

        const pentagonFeatures = {
            type: 'Feature',
            features: [pentagonFeature],
        };

        pentagonLayer.getSource().addFeatures(pentagonFeatures.features);
        nowLayer = pentagonLayer;
        mapObj.addLayer(pentagonLayer);
    };

    // 원
    const makeCircle = () => {
        removeLayers();
        circleLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 242, 0, 0.7)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        const circleFeature = new Feature({
            geometry: new Circle([0, 0], 1),
        });

        // const pentagonCoord = circleFeature.getGeometry().getCoordinates();
        // const pentagonWidth = new LineString([
        //     pentagonCoord[0][4],
        //     pentagonCoord[0][1],
        // ]);

        // const pentagonLength = new LineString([
        //     pentagonCoord[0][1],
        //     pentagonCoord[0][2],
        // ]);

        // console.log('width ====> ', formatLength(pentagonWidth, 3857));
        // console.log('Length ====> ', formatLength(pentagonLength, 3857));

        setFeatureWidth(3);
        setFeatureLength(3);

        const circleFeatures = {
            type: 'Feature',
            features: [circleFeature],
        };

        circleLayer.getSource().addFeatures(circleFeatures.features);
        nowLayer = circleLayer;
        mapObj.addLayer(circleLayer);
    };
    // 다각형?
    const makeElephant = () => {
        removeLayers();
        elephantLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(162, 0, 255, 0.6)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        const elephantFeature = new Feature({
            geometry: new Polygon([
                [
                    [-1, 0.9385],
                    [1, 0.9385],
                    [1, 0.2385],
                    [2.3275, 0.2385],
                    [2.3275, -0.9385],
                    [-2.3275, -0.9385],
                    [-2.3275, 0.2385],
                    [-1, 0.2385],
                    [-1, 0.9385],
                ],
            ]),
        });

        const elephantCoord = elephantFeature.getGeometry().getCoordinates();
        const elephantWidth = new LineString([
            elephantCoord[0][4],
            elephantCoord[0][1],
        ]);

        const elephantLength = new LineString([
            elephantCoord[0][1],
            elephantCoord[0][2],
        ]);

        console.log('width ====> ', formatLength(elephantWidth, 3857));
        console.log('Length ====> ', formatLength(elephantLength, 3857));

        setFeatureWidth(formatLength(elephantLength, 3857));
        setFeatureLength(formatLength(elephantWidth, 3857));

        const elephantFeatures = {
            type: 'Feature',
            features: [elephantFeature],
        };

        elephantLayer.getSource().addFeatures(elephantFeatures.features);
        nowLayer = elephantLayer;
        mapObj.addLayer(elephantLayer);
    };

    // 커스텀
    const makeCustom = () => {
        removeLayers();
        setNowDrawing(true);
        mapObj.addInteraction(draw);
    };

    const drawEnd = (e) => {
        const drawFeature = new Feature({
            geometry: new Polygon([
                e.feature.getGeometry().getCoordinates()[0],
            ]),
        });

        setFeatureWidth(4);
        setFeatureLength(4);

        const drawFeatures = {
            type: 'Feature',
            features: [drawFeature],
        };

        customLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                fill: new Fill({
                    color: 'rgba(255, 162, 0, 0.6)',
                }),
                stroke: new Stroke({
                    color: 'black',
                    width: 1,
                }),
            }),
        });

        customLayer.getSource().addFeatures(drawFeatures.features);
        mapObj.addLayer(customLayer);
        setNowDrawing(false);
        nowLayer = customLayer;
        mapObj.removeInteraction(draw);
    };

    draw.on('drawend', drawEnd);

    const onModify = () => {
        const modifyFeature = nowLayer.getSource();
        const modify = new Modify({
            source: modifyFeature,
        });
        mapObj.addInteraction(modify);
    };

    return (
        <div className='container'>
            <div className='menuBar'>
                <div className='features'>
                    <IconButton onClick={makeTriangle}>
                        <ChangeHistory />
                    </IconButton>
                    <IconButton onClick={makeSquare}>
                        <CropPortraitOutlined />
                    </IconButton>
                    <IconButton onClick={makePentagon}>
                        <PentagonOutlined />
                    </IconButton>
                    <IconButton onClick={makeCircle}>
                        <CircleOutlined />
                    </IconButton>
                    <IconButton onClick={makeElephant}>
                        <StorefrontOutlined />
                    </IconButton>
                    <Button
                        className='customBut'
                        variant='outlined'
                        onClick={makeCustom}
                    >
                        Custom
                    </Button>
                </div>
                <div className='buttons' style={{ textAlign: 'center' }}>
                    {nowDrawing ? (
                        <div
                            style={{
                                width: 102,
                                height: 36,
                                margin: 'auto',
                                background: 'aquamarine',
                                border: '2px solid black',
                                borderRadius: 4,
                                lineHeight: 2,
                                fontWeight: 600,
                            }}
                        >
                            Drawing
                        </div>
                    ) : (
                        <div
                            style={{
                                width: 102,
                                height: 36,
                                margin: 'auto',
                                background: '#eee',
                                border: '2px solid black',
                                borderRadius: 4,
                                lineHeight: 2,
                                fontWeight: 600,
                            }}
                        >
                            Drawing
                        </div>
                    )}
                    <Button variant='outlined' onClick={onModify}>
                        Modify
                    </Button>
                    <Button variant='outlined'>Heading</Button>
                    <Button variant='outlined' onClick={moveToCenter}>
                        Move To Center
                    </Button>
                </div>
            </div>
            <div style={{ height: '80%' }}>
                <div style={{ height: '100%' }}>
                    <h3 style={{ margin: 0, textAlign: 'center' }}>
                        Length: {featureLength}
                    </h3>
                    <MapContext.Provider value={mapObj}>
                        <div
                            ref={mapRef}
                            style={{ width: '100%', height: '90%' }}
                        >
                            {children}
                        </div>
                    </MapContext.Provider>
                    <h3 style={{ margin: 0, textAlign: 'center' }}>
                        Width: {featureWidth}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default CargoMaker1;
