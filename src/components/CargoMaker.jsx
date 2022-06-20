import React, { useState } from 'react';
import {
    ChangeHistory,
    CropPortraitOutlined,
    CircleOutlined,
    PentagonOutlined,
    StorefrontOutlined,
    LocalHospitalOutlined,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { Feature, Map, View } from 'ol';
import { Vector as VectorLayer, VectorTile as VectorTileLayer } from 'ol/layer';
import {
    Vector as VectorSource,
    VectorTile as VectorTileSource,
} from 'ol/source';
import {
    Fill,
    RegularShape,
    Stroke,
    Style,
    Text,
    Circle as CircleStyle,
} from 'ol/style';
import { Circle, LineString, Point, Polygon } from 'ol/geom';
import { getArea, getLength } from 'ol/sphere';
import { Draw, Modify, Select } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';

import './CargoMaker.css';
import 'ol/ol.css';
import MapContext from '../map/MapContext';

const CargoMaker = ({ children }) => {
    // ============================= State & Ref ==========================
    const [nowDrawing, setNowDrawing] = useState(false);
    let nowSelect, nowModify, nowLayer;
    let headingPoint = document.getElementsByClassName('headingPoint')[0];
    const showSegments = document.getElementById('segments');

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
        output = length / 1000;

        // // mm로 변환
        // output = length * 1000;

        // } else {
        //     // 'M'
        // output = Math.round(length * 100) / 100;
        // }
        return output.toFixed(6);
    };

    const formatArea = function (polygon, inProjection) {
        const area = getArea(polygon, {
            projection: 'EPSG:' + inProjection,
        });
        let output;
        if (area > 10000) {
            output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
        } else {
            output = Math.round(area * 100) / 100 + ' m\xB2';
        }
        return output;
    };

    // =============================== Layers ===============================

    const vertexLayer = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
            fill: new Fill({
                color: 'rgba(0, 0, 0)',
            }),
            stroke: new Stroke({
                color: 'rgba(255, 237, 36)',
                width: 5,
            }),
        }),
    });

    // ============================= Styles ==========================
    // 화물 스타일
    const cargoStyles = {
        triangle: new Style({
            fill: new Fill({
                color: 'rgba(255, 98, 87, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
            zIndex: -1,
        }),
        square: new Style({
            fill: new Fill({
                color: 'rgba(144, 255, 110, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        pentagon: new Style({
            fill: new Fill({
                color: 'rgba(110, 255, 238, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        circle: new Style({
            fill: new Fill({
                color: 'rgba(89, 156, 255, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        elephant: new Style({
            fill: new Fill({
                color: 'rgba(125, 89, 255, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        cross: new Style({
            fill: new Fill({
                color: 'rgba(255, 175, 56, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        custom: new Style({
            fill: new Fill({
                color: 'rgba(219, 76, 245, 0.7)',
            }),
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
        extent: new Style({
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
    };

    // 각 Line 글씨
    const segmentStyle = new Style({
        text: new Text({
            font: '20px Calibri,sans-serif',
            fill: new Fill({
                color: 'rgba(255, 255, 255, 1)',
            }),
            backgroundFill: new Fill({
                color: 'rgba(0, 0, 0, 0.4)',
            }),
            padding: [2, 2, 2, 2],
            textBaseline: 'bottom',
            offsetY: -12,
        }),
        image: new RegularShape({
            radius: 6,
            points: 3,
            angle: Math.PI,
            displacement: [0, 8],
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0.4)',
            }),
        }),
        zIndex: 10,
    });

    // 면적 글씨
    const labelStyle = new Style({
        text: new Text({
            font: '18px Calibri,sans-serif',
            fill: new Fill({
                color: 'rgba(25, 255, 255, 1)',
            }),
            backgroundFill: new Fill({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            padding: [3, 3, 3, 3],
            textBaseline: 'bottom',
            offsetY: 30,
        }),
        // image: new RegularShape({
        //     radius: 8,
        //     points: 3,
        //     angle: Math.PI,
        //     displacement: [0, 10],
        //     fill: new Fill({
        //         color: 'rgba(0, 0, 0, 0.7)',
        //     }),
        // }),
    });

    const modifyStyle = new Style({
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0.4)',
            }),
        }),
        text: new Text({
            text: 'Drag to modify',
            font: '12px Calibri,sans-serif',
            fill: new Fill({
                color: 'rgba(255, 255, 255, 1)',
            }),
            backgroundFill: new Fill({
                color: 'rgba(0, 0, 0, 0.7)',
            }),
            padding: [2, 2, 2, 2],
            textAlign: 'left',
            offsetX: 15,
        }),
    });

    const segmentStyles = [segmentStyle];

    function styleFunction(feature, layer, segments) {
        let styles;
        let point, line, label;
        switch (layer) {
            case 'triangle':
                styles = [cargoStyles.triangle];
                break;
            case 'square':
                styles = [cargoStyles.square];
                break;
            case 'pentagon':
                styles = [cargoStyles.pentagon];
                break;
            case 'circle':
                styles = [cargoStyles.circle];
                break;
            case 'elephant':
                styles = [cargoStyles.elephant];
                break;
            case 'cross':
                styles = [cargoStyles.cross];
                break;
            case 'custom':
                styles = [cargoStyles.custom];
                break;
            case 'extent':
                styles = [cargoStyles.extent];
                break;
            default:
                break;
        }

        const geometry = feature.getGeometry();
        const drawType = geometry.getType();

        if (drawType === 'Polygon') {
            point = geometry.getInteriorPoint();
            label = formatArea(geometry, 3857);
            line = new LineString(geometry.getCoordinates()[0]);

            // 면적
            if (segments && label) {
                labelStyle.setGeometry(point);
                labelStyle.getText().setText(label);
                styles.push(labelStyle);
            }
        } else if (drawType === 'LineString') {
            // 길이
            if (segments) {
                point = new Point(geometry.getLastCoordinate());
                label = formatLength(geometry, 3857);
                line = geometry;

                // let count = 0;
                // line.forEachSegment(function (a, b) {
                //     const segment = new LineString([a, b]);
                //     const label =
                //         (formatLength(segment, 3857) * 1000).toFixed(3) + 'm';
                //     if (segmentStyles.length - 1 < count) {
                //         segmentStyles.push(segmentStyle.clone());
                //     }
                //     const segmentPoint = new Point(
                //         segment.getCoordinateAt(0.5)
                //     );
                //     segmentStyles[count].setGeometry(segmentPoint);
                //     segmentStyles[count].getText().setText(label);
                //     styles.push(segmentStyles[count]);
                //     count++;
                // });
            }
        }

        if (segments && line) {
            let count = 0;
            line.forEachSegment(function (a, b) {
                const segment = new LineString([a, b]);
                const label =
                    (formatLength(segment, 3857) * 1000).toFixed(3) + 'm';
                if (segmentStyles.length - 1 < count) {
                    segmentStyles.push(segmentStyle.clone());
                }
                const segmentPoint = new Point(segment.getCoordinateAt(0.5));
                segmentStyles[count].setGeometry(segmentPoint);
                segmentStyles[count].getText().setText(label);
                styles.push(segmentStyles[count]);
                count++;
            });
        }

        return styles;
    }

    // ==================================== Interactions =========================================

    const draw = new Draw({
        source: new VectorSource({}),
        type: 'Polygon',
        style: function (feature) {
            return styleFunction(feature, 'custom', showSegments.checked);
        },
    });

    console.log(draw);

    const select = new Select({
        layers: [vertexLayer],
    });

    let modify = new Modify({
        source: new VectorSource(),
    });

    // ========================== MAP ================================
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
    const map = new Map({
        layers: [
            // new TileLayer({
            //     source: new OSM(),
            // }),
            // new TileLayer({
            //     source: new XYZ({
            //         url: 'https://grid.plus.codes/grid/wms/{z}/{x}/{y}.png?col=black',
            //     }),
            // }),
            mapLayer,
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

    // =================== 버튼 클릭시 도형 생성 ==========================

    let triangleLayer,
        squareLayer,
        pentagonLayer,
        circleLayer,
        elephantLayer,
        crossLayer,
        customLayer,
        extentLayer,
        featureExtent;

    const removeLayers = () => {
        map.removeLayer(triangleLayer);
        map.removeLayer(squareLayer);
        map.removeLayer(pentagonLayer);
        map.removeLayer(circleLayer);
        map.removeLayer(elephantLayer);
        map.removeLayer(crossLayer);
        map.removeLayer(customLayer);
        map.removeLayer(vertexLayer);
        map.removeLayer(extentLayer);
        map.removeInteraction(modify);
        if (headingPoint !== undefined) {
            headingPoint.innerHTML = '';
        }
    };

    // ================== 화물의 전체적인 Length / Width 출력
    const makeExtent = (feature) => {
        map.removeLayer(extentLayer);
        extentLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'extent', showSegments.checked);
            },
        });

        featureExtent = feature.getGeometry().getExtent();

        const extentLength = new Feature({
            geometry: new LineString([
                [featureExtent[0], featureExtent[1]],
                [featureExtent[0], featureExtent[3]],
            ]),
        });

        const extentWidth = new Feature({
            geometry: new LineString([
                [featureExtent[0], featureExtent[3]],
                [featureExtent[2], featureExtent[3]],
            ]),
        });

        const extentFeatures = {
            type: 'Feature',
            features: [extentWidth, extentLength],
        };

        extentLayer.getSource().addFeatures(extentFeatures.features);
        map.addLayer(extentLayer);
    };

    // ========== Show segment 클릭 시 길이 정보 on / off
    showSegments.onchange = function () {
        nowLayer.changed();
        draw.getOverlay().changed();
    };

    // ========== 삼각형
    const makeTriangle = () => {
        removeLayers();
        triangleLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'triangle', showSegments.checked);
            },
        });

        const triangleFeature = new Feature({
            geometry: new Polygon([
                [
                    [0, 2.3275],
                    [0.9135, -2.3275],
                    [-0.9135, -2.3275],
                    [0, 2.3275],
                ],
            ]),
        });

        const triangleFeatures = {
            type: 'Feature',
            features: [triangleFeature],
        };

        makeExtent(triangleFeature);

        triangleLayer.getSource().addFeatures(triangleFeatures.features);
        nowLayer = triangleLayer;
        map.addLayer(triangleLayer);
    };

    // 사각형
    const makeSquare = () => {
        removeLayers();
        squareLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'square', showSegments.checked);
            },
        });

        const squareFeature = new Feature({
            geometry: new Polygon([
                [
                    [-0.9135, 2.3275],
                    [0.9135, 2.3275],
                    [0.9135, -2.3275],
                    [-0.9135, -2.3275],
                    [-0.9135, 2.3275],
                ],
            ]),
        });

        const squareFeatures = {
            type: 'Feature',
            features: [squareFeature],
        };

        makeExtent(squareFeature);

        squareLayer.getSource().addFeatures(squareFeatures.features);
        nowLayer = squareLayer;
        map.addLayer(squareLayer);
    };

    // 오각형
    const makePentagon = () => {
        removeLayers();
        pentagonLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'pentagon', showSegments.checked);
            },
        });

        const pentagonFeature = new Feature({
            geometry: new Polygon([
                [
                    [0, 2.3275],
                    [2, 0.7],
                    [0.9135, -2.3275],
                    [-0.9135, -2.3275],
                    [-2, 0.7],
                    [0, 2.3275],
                ],
            ]),
        });

        const pentagonFeatures = {
            type: 'Feature',
            features: [pentagonFeature],
        };

        makeExtent(pentagonFeature);

        pentagonLayer.getSource().addFeatures(pentagonFeatures.features);
        nowLayer = pentagonLayer;
        map.addLayer(pentagonLayer);
    };

    // 원
    const makeCircle = () => {
        removeLayers();
        circleLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'circle', showSegments.checked);
            },
        });

        const circleFeature = new Feature({
            geometry: new Circle([0, 0], 1),
        });

        const circleFeatures = {
            type: 'Feature',
            features: [circleFeature],
        };

        makeExtent(circleFeature);

        circleLayer.getSource().addFeatures(circleFeatures.features);
        nowLayer = circleLayer;
        map.addLayer(circleLayer);
    };
    // 다각형?
    const makeElephant = () => {
        removeLayers();
        elephantLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'elephant', showSegments.checked);
            },
        });

        const elephantFeature = new Feature({
            geometry: new Polygon([
                [
                    [-1, 0.9135],
                    [1, 0.9135],
                    [1, 0.2385],
                    [2.3275, 0.2385],
                    [2.3275, -0.9135],
                    [-2.3275, -0.9135],
                    [-2.3275, 0.2385],
                    [-1, 0.2385],
                    [-1, 0.9135],
                ],
            ]),
        });

        const elephantFeatures = {
            type: 'Feature',
            features: [elephantFeature],
        };

        makeExtent(elephantFeature);

        elephantLayer.getSource().addFeatures(elephantFeatures.features);
        nowLayer = elephantLayer;
        map.addLayer(elephantLayer);
    };

    // 십자가
    const makeCross = () => {
        removeLayers();
        crossLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'cross', showSegments.checked);
            },
        });

        const crossFeature = new Feature({
            geometry: new Polygon([
                [
                    [-0.7, 2.0135],
                    [0.7, 2.0135],
                    [0.7, 0.6385],
                    [1.8275, 0.6385],
                    [1.8275, -0.6385],
                    [0.7, -0.6385],
                    [0.7, -2.0135],
                    [-0.7, -2.0135],
                    [-0.7, -0.6385],
                    [-1.8275, -0.6385],
                    [-1.8275, 0.6385],
                    [-0.7, 0.6385],
                    [-0.7, 2.0135],
                ],
            ]),
        });

        const crossFeatures = {
            type: 'Feature',
            features: [crossFeature],
        };

        makeExtent(crossFeature);

        crossLayer.getSource().addFeatures(crossFeatures.features);
        nowLayer = crossLayer;
        map.addLayer(crossLayer);
    };

    // 커스텀
    const makeCustom = () => {
        removeLayers();
        // setNowDrawing(true);
        map.addInteraction(draw);
    };

    const drawEnd = (e) => {
        customLayer = new VectorLayer({
            source: new VectorSource({}),
            style: function (feature) {
                return styleFunction(feature, 'custom', showSegments.checked);
            },
        });

        const drawFeature = new Feature({
            geometry: new Polygon([
                e.feature.getGeometry().getCoordinates()[0],
            ]),
        });

        const drawFeatures = {
            type: 'Feature',
            features: [drawFeature],
        };

        makeExtent(drawFeature);

        customLayer.getSource().addFeatures(drawFeatures.features);
        map.addLayer(customLayer);
        // setNowDrawing(false);
        nowLayer = customLayer;
        map.removeInteraction(draw);
    };

    draw.on('drawend', drawEnd);

    const onModify = () => {
        map.removeLayer(vertexLayer);
        if (nowLayer === undefined) return;
        const modifySource = nowLayer.getSource();
        modify = new Modify({
            source: modifySource,
            style: modifyStyle,
        });

        map.addInteraction(modify);

        modify.on('modifyend', function () {
            const modifyFeature = modify.source_.getFeatures()[0];
            makeExtent(modifyFeature);
        });
    };

    const selectHead = () => {
        vertexLayer.getSource().clear();
        map.removeLayer(vertexLayer);
        map.removeInteraction(select);
        map.removeInteraction(modify);
        const nowFeature = nowLayer.getSource().getFeatures()[0];
        const nowFeatureCoord = nowFeature.getGeometry().getCoordinates();

        const vertexFeatures = {
            type: 'Feature',
            features: [],
        };

        if (nowLayer === circleLayer) {
            console.log(nowFeature.getGeometry().getExtent());
            const circleExtent = nowFeature.getGeometry().getExtent();
            const circleVertex = [
                [0, circleExtent[3]],
                [circleExtent[2], 0],
                [0, circleExtent[1]],
                [circleExtent[0], 0],
            ];

            for (let i = 0; i < circleVertex.length; i++) {
                const vertexFeature = new Feature({
                    geometry: new Circle(circleVertex[i], 0.1),
                });

                vertexFeature.set('Cood', i);
                vertexFeatures.features.push(vertexFeature);
            }
            console.log(vertexFeatures);
        } else {
            if ((nowFeatureCoord[0].length - 1) % 2 !== 0) {
                for (let i = 0; i < nowFeatureCoord[0].length - 1; i++) {
                    const vertexFeature = new Feature({
                        geometry: new Circle(nowFeatureCoord[0][i], 0.1),
                    });
                    vertexFeature.set('Cood', i);
                    vertexFeatures.features.push(vertexFeature);
                }
            } else {
                for (let i = 0; i < nowFeatureCoord[0].length - 1; i++) {
                    const lineFeature = new Feature({
                        geometry: new LineString([
                            nowFeatureCoord[0][i],
                            nowFeatureCoord[0][i + 1],
                        ]),
                    });

                    lineFeature.set('Cood', [i, i + 1]);

                    vertexFeatures.features.push(lineFeature);
                }
            }
        }
        vertexLayer.getSource().addFeatures(vertexFeatures.features);
        map.addLayer(vertexLayer);
        map.addInteraction(select);
    };

    // HeadingPoint 선택
    const selectedFeature = select.getFeatures();
    selectedFeature.on('add', function () {
        if (selectedFeature.getArray()[0].values_.Cood.length === 2) {
            headingPoint.innerHTML =
                'Line [' + selectedFeature.getArray()[0].values_.Cood + ']';
        } else {
            headingPoint.innerHTML =
                'Point [' + selectedFeature.getArray()[0].values_.Cood + ']';
        }
    });
    selectedFeature.on('remove', function () {
        headingPoint.innerHTML = '';
    });

    // =================== 썸네일로 저장 ==========================

    let year = new Date().getFullYear().toString();
    let month = (new Date().getMonth() + 1).toString();
    let date = new Date().getDate().toString() + '_';
    let hours = new Date().getHours().toString();
    let minutes = new Date().getMinutes().toString();
    let seconds = new Date().getSeconds();

    if (month < 10) {
        month = '0' + month + 1;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    const filename = year + month + date + hours + minutes + seconds;

    const saveAsPng = () => {
        map.removeLayer(mapLayer);
        map.removeLayer(extentLayer);
        map.once('rendercomplete', function () {
            const mapCanvas = document.createElement('canvas');
            const size = map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            const mapContext = mapCanvas.getContext('2d');
            Array.prototype.forEach.call(
                map
                    .getViewport()
                    .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
                function (canvas) {
                    if (canvas.width > 0) {
                        const opacity =
                            canvas.parentNode.style.opacity ||
                            canvas.style.opacity;
                        mapContext.globalAlpha =
                            opacity === '' ? 1 : Number(opacity);

                        const backgroundColor =
                            canvas.parentNode.style.backgroundColor;
                        if (backgroundColor) {
                            mapContext.fillStyle = backgroundColor;
                            mapContext.fillRect(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );
                        }

                        let matrix;
                        const transform = canvas.style.transform;
                        if (transform) {
                            // Get the transform parameters from the style's transform matrix
                            matrix = transform
                                .match(/^matrix\(([^\(]*)\)$/)[1]
                                .split(',')
                                .map(Number);
                        } else {
                            matrix = [
                                parseFloat(canvas.style.width) / canvas.width,
                                0,
                                0,
                                parseFloat(canvas.style.height) / canvas.height,
                                0,
                                0,
                            ];
                        }
                        // Apply the transform to the export map context
                        CanvasRenderingContext2D.prototype.setTransform.apply(
                            mapContext,
                            matrix
                        );
                        mapContext.drawImage(canvas, 0, 0);
                    }
                }
            );
            mapContext.globalAlpha = 1;
            if (navigator.msSaveBlob) {
                // link download attribute does not work on MS browsers
                navigator.msSaveBlob(mapCanvas.msToBlob(), filename);
            } else {
                const link = document.getElementById('image-download');
                link.href = mapCanvas.toDataURL();
                link.download = filename;
                link.click();
            }
        });
        map.renderSync();
        map.addLayer(mapLayer);
        map.addLayer(extentLayer);
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
                    <IconButton onClick={makeCross}>
                        <LocalHospitalOutlined />
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
                                margin: 'auto 10px',
                                background: 'aquamarine',
                                border: '1px solid black',
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
                                margin: 'auto 10px',
                                background: '#eee',
                                border: '1px solid black',
                                borderRadius: 4,
                                lineHeight: 2,
                                fontWeight: 600,
                            }}
                        >
                            Drawing
                        </div>
                    )}
                    {nowLayer === customLayer ? (
                        <Button variant='outlined' onClick={onModify}>
                            Modify
                        </Button>
                    ) : (
                        <Button variant='outlined' onClick={onModify} disabled>
                            Modify
                        </Button>
                    )}
                    <Button variant='outlined' onClick={selectHead}>
                        Heading
                    </Button>
                    <Button variant='outlined' onClick={saveAsPng}>
                        Save
                    </Button>
                </div>
            </div>
            <div style={{ display: 'flex', width: '100%', height: '82%' }}>
                <div
                    style={{
                        position: 'relative',
                        width: '90%',
                        height: '100%',
                        marginRight: '1rem',
                    }}
                >
                    <div id='map2'></div>
                    <a id='image-download' download='map.png'></a>
                </div>
                <div style={{ width: '9%', paddingTop: '1rem' }}>
                    <p
                        style={{
                            marginBottom: '0.5rem',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                        }}
                    >
                        Height :
                    </p>
                    <div style={{ display: 'flex' }}>
                        <input
                            style={{
                                width: '60%',
                                fontSize: '1.5rem',
                                marginRight: '0.5rem',
                            }}
                        ></input>
                        <span
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                            }}
                        >
                            M
                        </span>
                    </div>

                    <div
                        style={{
                            marginTop: '3rem',
                            fontSize: '1.5rem',
                            fontWeight: 600,
                        }}
                    >
                        Heading :
                        <p
                            className='headingPoint'
                            style={{
                                margin: 0,
                                fontSize: '1.3rem',
                                fontWeight: 600,
                            }}
                        ></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CargoMaker;
