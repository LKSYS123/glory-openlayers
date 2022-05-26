import React, { useEffect, useState } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature, Map as OlMap, View } from 'ol';
import { Vector as VectorSource, OSM } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Fill, Stroke, Style, Text, Icon } from 'ol/style';
import { Draw } from 'ol/interaction';
import { createBox } from 'ol/interaction/Draw';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import {
    DragBox,
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import { getLength } from 'ol/sphere';
import { Circle, LineString } from 'ol/geom';

import {
    bbox,
    polygon as turfPolygon,
    mask,
    bboxPolygon,
    centerOfMass,
    lineString,
    lineToPolygon,
    difference,
    multiPolygon as turfMultiPolygon,
    lineOffset,
    lineIntersect,
    lineDistance,
    along,
    toMercator,
    lineOverlap,
} from '@turf/turf';
import rectangleGrid from '@turf/rectangle-grid';

import 'ol/ol.css';

const SplitPolygon = () => {
    const [dragDirection, setDragDirection] = useState('');
    /*
     * ================= Sources & Layers ====================
     */
    const sourceDrawnPolygons = new VectorSource({ wrapX: false });
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
    /*=============================================== */

    function styleFunction(feature) {
        const style = new Style({
            stroke: new Stroke({
                color: 'red',
                width: 3,
            }),
        });

        return style;
    }

    const iconStyle = new Style({
        image: new Icon({
            src: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FKsUKw%2FbtrygZ2yOZL%2F55B5hdAvbGbA7G8qX0XhU1%2Fimg.png',
            scale: 0.3,
            opacity: 1,
        }),
    });

    const formatGeoJSON = new GeoJSON();

    /*
     * ====================== Interactions ======================
     */
    const select = new Select({});

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const dragBox = new DragBox({
        condition: shiftKeyOnly,
    });

    /*
     * =========================== Map ==============================
     */

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
            // center: fromLonLat([126.88718, 37.518]),
            // center: [4.228, 51.2675],
            // center: [470608, 6668836],
            center: [470450, 6669945],
            // center: [0, 0],
            // center: [6049229, 11594166],
            zoom: 21,
        }),
    });

    /*
     * ===================================맵 회전 각도 출력 =======================================
     */
    map.on('moveend', function () {
        const view = map.getView();
        const RAD_TO_DEG = 180 / Math.PI;
        const rotation = view.getRotation();
        let nowDegree = rotation * RAD_TO_DEG;
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
        console.log('회전각', nowDegree);
    });

    /*
     * ============================= 마우스 이동방향 인식 ===============================
     */
    window.onload = function () {
        const mapDiv = document.getElementById('map2');
        let startCoord = [0, 0];
        let middleCoord = [0, 0];
        let endCoord = [0, 0];
        let dragging = false;
        let mouseList = [];
        let dragDegree;

        mapDiv.addEventListener('mousedown', (e) => {
            mouseList = [];
            startCoord = [e.clientX, e.clientY];
            dragging = true;
        });

        mapDiv.addEventListener('mousemove', (e) => {
            if (dragging) {
                mouseList.push([e.clientX, e.clientY]);
            }
        });

        mapDiv.addEventListener('mouseup', (e) => {
            dragging = false;
            middleCoord = mouseList[parseInt(mouseList.length / 2)];
            endCoord = [e.clientX, e.clientY];
            const diffX = endCoord[0] - startCoord[0];
            const diffY = endCoord[1] - startCoord[1];

            if (middleCoord === undefined) {
                return;
            } else {
                dragDegree =
                    (endCoord[0] - startCoord[0]) *
                        (middleCoord[1] - startCoord[1]) -
                    (middleCoord[0] - startCoord[0]) *
                        (endCoord[1] - startCoord[1]);
            }

            if (
                (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) ||
                (diffX < 0 && Math.abs(diffX) < Math.abs(diffY))
            ) {
                if (diffY > 10) {
                    if (dragDegree < 0) {
                        // setDragDirection('DownLeft');
                        // return dragDirection;
                    } else if (dragDegree > 0) {
                        // setDragDirection('LeftDown');
                        // return dragDirection;
                    }
                } else if (diffY < -10) {
                    if (dragDegree < 0) {
                        // setDragDirection('LeftUp');
                        // return dragDirection;
                    } else if (dragDegree > 0) {
                        // setDragDirection('UpLeft');
                        // return dragDirection;
                    }
                } else if (diffY <= 0 && diffY >= -10) {
                    // console.log('left left left left');
                    // return dragDirection;
                }
            } else if (
                (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) ||
                (diffX > 0 && Math.abs(diffX) < Math.abs(diffY))
            ) {
                if (diffY > 10) {
                    if (dragDegree < 0) {
                        // setDragDirection('RightDown');
                        // return dragDirection;
                    } else if (dragDegree > 0) {
                        // setDragDirection('DownRight');
                        // return dragDirection;
                    }
                } else if (diffY < -10) {
                    if (dragDegree < 0) {
                        // setDragDirection('UpRight');
                        // return dragDirection;
                    } else if (dragDegree > 0) {
                        // setDragDirection('RightUp');
                        // return dragDirection;
                    }
                } else if (diffY <= 0 && diffY >= -10) {
                    // return dragDirection;
                }
            }

            //  else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
            //     console.log('down down down down down');
            // } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
            //     console.log('up up up up up up');
            // }
        });
    };

    console.log('dragDirection dragDirection', dragDirection);

    /*
     * ========================== 마우스 현재 좌표 ==============================
     */
    useEffect(() => {
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(8),
            projection: 'EPSG:3857',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
        });

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
    });

    function startDraw() {
        vectorLayer.getSource().clear();
        map.addInteraction(draw);
    }

    const draw = new Draw({
        source: vectorSource,
        type: 'Polygon',
        // geometryFunction: createBox(),
    });

    /*
     * ============================= 도형 자르기 ==================================
     */
    function polygonDivide(polygonFeature) {
        const polygon = formatGeoJSON.writeFeatureObject(polygonFeature, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
        });

        /*================회전시 그려지는 영역(초록색 테두리)=============== */
        const polygonBbox = bbox(polygon);
        const gloryBbox = [
            polygon.geometry.coordinates[0][0][0],
            polygon.geometry.coordinates[0][1][1],
            polygon.geometry.coordinates[0][2][0],
            polygon.geometry.coordinates[0][3][1],
        ];

        const gloryBboxPolygon = bboxPolygon(gloryBbox);

        const lkFeature = new Feature({
            geometry: new Polygon(gloryBboxPolygon.geometry.coordinates),
        });

        const lkFeatures = {
            type: 'Feature',
            features: [lkFeature],
        };

        const lkLayer = new VectorLayer({
            source: new VectorSource({}),
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 4,
                }),
            }),
        });

        lkLayer.getSource().addFeatures(lkFeatures.features);
        map.addLayer(lkLayer);

        /*====================================================================== */

        // let cellWidth = 0.001825;
        // let cellHeight = 0.00465;
        let cellWidth = 0.1;
        let cellHeight = 0.3;
        let options = { units: 'kilometers' };

        let rectangleGridSample = rectangleGrid(
            polygonBbox,
            cellWidth,
            cellHeight,
            options
        );

        let maskFeatures = { type: 'FeatureCollection', features: [] };

        for (let i = 0; i < rectangleGridSample.features.length; i++) {
            const maskCood =
                rectangleGridSample.features[i].geometry.coordinates;
            const maskPolygon = turfPolygon([maskCood[0]]);
            const iconPoint = centerOfMass(maskPolygon);
            const iconFeature = new Feature({
                geometry: new Point(iconPoint.geometry.coordinates),
            });

            const glorymask = turfPolygon([
                [
                    [
                        maskCood[0][0][0] + 0.000005,
                        maskCood[0][0][1] + 0.000025,
                    ],
                    [
                        maskCood[0][1][0] + 0.000005,
                        maskCood[0][1][1] - 0.000005,
                    ],
                    [maskCood[0][2][0] - 0.00001, maskCood[0][2][1] - 0.000005],
                    [maskCood[0][3][0] - 0.00001, maskCood[0][3][1] + 0.000025],
                    [
                        maskCood[0][0][0] + 0.000005,
                        maskCood[0][0][1] + 0.000025,
                    ],
                ],
            ]);

            const masked = mask(maskPolygon, glorymask);
            maskFeatures.features.push(masked);
            console.log('masked masked', masked);

            iconFeature.setStyle(iconStyle);
            maskFeatures.features.push(maskPolygon);

            const iconSource = new VectorSource({
                features: [iconFeature],
            });

            const iconLayer = new VectorLayer({
                source: iconSource,
            });

            // map.addLayer(iconLayer);
        }

        const dividedPolygonFeatures = formatGeoJSON.readFeatures(
            maskFeatures,
            { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:4326' }
        );

        return dividedPolygonFeatures;
    }

    /*
     * ================================== line 길이 구하기 ==================================
     */
    const formatLength = (line, inProjection) => {
        const length = getLength(line, { projection: 'EPSG:' + inProjection });
        // const length = getLength(line);
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
    /*================================================================================== */

    /*
     * ==================================== 재배치 스타일 ===================================
     */

    var Drag_Style = [
        new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: 'blue',
                width: 1,
            }),
        }),

        // 첫번째 점========================
        new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2,
            }),

            text: new Text({
                font: '20px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(100, 0, 0, 0.7)',
                }),
                scale: [1, 1],
                padding: [5, 5, 5, 5],
                offsetX: 0,
                offsetY: 0,
                text: '0',
            }),

            geometry: function (feature) {
                var geom = feature.getGeometry();
                var coordinates = geom.getCoordinates()[0];
                // var startCoord = coordinates[0]
                // var endCoord = coordinates[0];
                var Circle1 = new Circle(coordinates[0], 1);
                return Circle1;
            },
        }),

        // 두번째 점========================
        new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2,
            }),

            text: new Text({
                font: '20px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(100, 0, 0, 0.7)',
                }),
                scale: [1, 1],
                padding: [5, 5, 5, 5],
                offsetX: 0,
                offsetY: 0,
                text: '1',
            }),

            geometry: function (feature) {
                var geom = feature.getGeometry();
                // var coordinates = geom.getCoordinates(false)[0];
                var coordinates = geom.getCoordinates()[0];
                var Circle1 = new Circle(coordinates[1], 1);
                return Circle1;
            },
        }),

        // 세번쩨 점========================
        new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2,
            }),

            text: new Text({
                font: '20px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(100, 0, 0, 0.7)',
                }),
                scale: [1, 1],
                padding: [5, 5, 5, 5],
                offsetX: 0,
                offsetY: 0,
                text: '2',
            }),

            geometry: function (feature) {
                var geom = feature.getGeometry();
                // var coordinates = geom.getCoordinates(false)[0];
                var coordinates = geom.getCoordinates()[0];
                var Circle1 = new Circle(coordinates[2], 1);
                return Circle1;
            },
        }),

        // 네번째 점========================
        new Style({
            stroke: new Stroke({
                color: 'red',
                width: 2,
            }),

            text: new Text({
                font: '20px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(100, 0, 0, 0.7)',
                }),
                scale: [1, 1],
                padding: [5, 5, 5, 5],
                offsetX: 0,
                offsetY: 0,
                text: '3',
            }),
            geometry: function (feature) {
                var geom = feature.getGeometry();
                // var coordinates = geom.getCoordinates(false)[0];
                var coordinates = geom.getCoordinates()[0];
                var Circle1 = new Circle(coordinates[3], 1);
                return Circle1;
            },
        }),
    ];

    /*
     * ======================= 폴리곤 좌표 순서 재배치 =========================
     */

    //방위나 위치에 상관없이  Screen 좌표 기준으로 Feature 생성하여 리턴 0 1 2 3 =====================
    function get_DragBoxCoordToScreenOrder(dragCoordinate, tml_Map) {
        // console.log('dragCoordinate3857', dragCoordinate);
        // console.log('dragCoordinate8257_0', dragCoordinate[0][0]);
        // console.log('dragCoordinate8357_1', dragCoordinate[0][1]);
        // console.log('dragCoordinate8357_2', dragCoordinate[0][2]);
        // console.log('dragCoordinate8357_3', dragCoordinate[0][3]);}

        let pixel_0 = tml_Map.getPixelFromCoordinate(dragCoordinate[0][0]);
        let pixel_1 = tml_Map.getPixelFromCoordinate(dragCoordinate[0][1]);
        let pixel_2 = tml_Map.getPixelFromCoordinate(dragCoordinate[0][2]);
        let pixel_3 = tml_Map.getPixelFromCoordinate(dragCoordinate[0][3]);

        pixel_0 = [
            Number(pixel_0[0].toFixed(0)),
            Number(pixel_0[1].toFixed(0)),
        ];
        pixel_1 = [
            Number(pixel_1[0].toFixed(0)),
            Number(pixel_1[1].toFixed(0)),
        ];
        pixel_2 = [
            Number(pixel_2[0].toFixed(0)),
            Number(pixel_2[1].toFixed(0)),
        ];
        pixel_3 = [
            Number(pixel_3[0].toFixed(0)),
            Number(pixel_3[1].toFixed(0)),
        ];

        let pixArray = [];

        pixArray.push(pixel_0);
        pixArray.push(pixel_1);
        pixArray.push(pixel_2);
        pixArray.push(pixel_3);

        let topLeft_X = 100000000000;
        let topLeft_Y = 100000000000;

        let BottomRight_X = 0;
        let BottomRight_Y = 0;

        for (let i = 0; i < pixArray.length; i++) {
            // for TopLeft=================
            if (topLeft_X > pixArray[i][0]) {
                topLeft_X = pixArray[i][0];
            }
            if (topLeft_Y > pixArray[i][1]) {
                topLeft_Y = pixArray[i][1];
            }
            // for BottomRight=================
            if (BottomRight_X < pixArray[i][0]) {
                BottomRight_X = pixArray[i][0];
            }
            if (BottomRight_Y < pixArray[i][1]) {
                BottomRight_Y = pixArray[i][1];
            }
        }

        let RealSeqArray = [];

        //decide Seq (ClickWise)
        for (let i = 0; i < pixArray.length; i++) {
            // for TopLeft=================
            if (topLeft_X === pixArray[i][0] && topLeft_Y === pixArray[i][1])
                RealSeqArray[0] = i;

            if (
                BottomRight_X === pixArray[i][0] &&
                topLeft_Y === pixArray[i][1]
            )
                RealSeqArray[1] = i;

            if (
                BottomRight_X === pixArray[i][0] &&
                BottomRight_Y === pixArray[i][1]
            )
                RealSeqArray[2] = i;

            if (
                topLeft_X === pixArray[i][0] &&
                BottomRight_Y === pixArray[i][1]
            )
                RealSeqArray[3] = i;
        }

        //새로운 폴리건 도형 만들기...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        let newPolygon_Coordinate = [];
        for (let i = 0; i < RealSeqArray.length; i++) {
            newPolygon_Coordinate.push(dragCoordinate[0][RealSeqArray[i]]);
        }

        newPolygon_Coordinate.push(dragCoordinate[0][RealSeqArray[0]]);

        let RealSeqArrayOut = [];

        RealSeqArrayOut.push(newPolygon_Coordinate);

        // 드래그 영역
        const ScreenasdfafasdgloryFeature = new Feature({
            geometry: new Polygon(RealSeqArrayOut),
            type: 'Polygon',
        });

        return ScreenasdfafasdgloryFeature;
    }

    map.on('click', function (event) {
        console.log([
            map.getPixelFromCoordinate(event.coordinate)[0].toFixed(1),
            map.getPixelFromCoordinate(event.coordinate)[1].toFixed(1),
        ]);

        console.log([
            map.getCoordinateFromPixel(event.coordinate)[0],
            map.getCoordinateFromPixel(event.coordinate)[1],
        ]);
    });

    /*
     * ================================== 도형자르기2 ==================================
     */

    function cutPolygon(polygon, line, direction, id) {
        try {
            let polyCoords = [];
            let cutPolyGeoms = [];
            let retVal = null;
            let clippedList = [];
            let cutMiddleList = [];

            const cutFeatures = {
                type: 'Collection',
                features: [],
            };

            const cutLayer = new VectorLayer({
                source: new VectorSource({}),
            });

            for (let i = 0; i < line.length; i++) {
                let intersectPoints = lineIntersect(polygon, line[i]);
                let nPoints = intersectPoints.features.length;

                let offsetLine = lineOffset(line[i], 0.01 * direction, {
                    units: 'kilometers',
                });
                for (let j = 0; j < line[i].coordinates.length; j++) {
                    polyCoords.push(line[i].coordinates[j]);
                }
                for (
                    let k = offsetLine.geometry.coordinates.length - 1;
                    k >= 0;
                    k--
                ) {
                    polyCoords.push(offsetLine.geometry.coordinates[k]);
                }

                let thickLineString = lineString(polyCoords);
                var thickLinePolygon = lineToPolygon(thickLineString);
            }

            let clipped = difference(polygon, thickLinePolygon);
            console.log(clipped);
            // let polyg = turfPolygon(clipped.geometry.coordinates[j]);
            // let overlap = lineOverlap(polyg, line, { tolerance: 0.005 });
            // if (overlap.features.length > 0) {
            //     cutPolyGeoms.push(polyg.geometry.coordinates);
            // }

            /*
             * 좌표 5개가 아닌 Polygon 제거
             */
            for (let q = 0; q < clipped.geometry.coordinates.length; q++) {
                if (clipped.geometry.coordinates[q][0].length === 5) {
                    clippedList.push(clipped.geometry.coordinates[q]);
                }
            }

            console.log(clippedList);
            console.log(dragDirection);

            /*
             * 좌표 재정의
             */
            if (dragDirection === 'DownRight') {
                for (let l = 0; l < clippedList.length - 1; l++) {
                    // const cutCoordinate = get_DragBoxCoordToScreenOrder(
                    //     clippedList[l],
                    //     map
                    // )
                    const beforeTopLeft = map.getPixelFromCoordinate(
                        clippedList[l][0][0]
                    );

                    const beforeTopLeft_X = beforeTopLeft[0].toFixed(1);
                    const beforeTopLeft_Y = beforeTopLeft[1].toFixed(1);

                    // console.log(cutCoordinate);
                    // cutMiddleList.push(cutCoordinate);
                    for (let q = l + 1; q < clippedList.length; q++) {
                        const afterTopLeft = map.getPixelFromCoordinate(
                            clippedList[q][0][0]
                        );

                        const afterTopLeft_X = afterTopLeft[0].toFixed(1);
                        const afterTopLeft_Y = afterTopLeft[1].toFixed(1);
                        if (beforeTopLeft_X === afterTopLeft_X) {
                            if (beforeTopLeft_Y > afterTopLeft_Y) {
                                let tmp = clippedList[l];
                                clippedList[l] = clippedList[q];
                                clippedList[q] = tmp;
                            }
                        }
                    }
                }

                console.log(cutMiddleList);
                console.log('clippedList clippedList', clippedList);

                for (let i = 0; i < clippedList.length; i++) {
                    const cutCoordinate = get_DragBoxCoordToScreenOrder(
                        clippedList[i],
                        map
                    )
                        .getGeometry()
                        .getCoordinates();
                    const cutFeature = new Feature({
                        geometry: new Polygon(cutCoordinate),
                    });

                    cutFeature.setStyle(
                        new Style({
                            stroke: new Stroke({
                                color: 'yellow',
                                width: 0.1,
                            }),
                            fill: new Fill({
                                color: 'rgba(92, 203, 255, 0.4)',
                            }),
                            text: new Text({
                                font: '20px sans-serif',
                                text: (i + 1).toString(),
                            }),
                        })
                    );
                    // const cutCoordinates = cutFeature
                    //     .getGeometry()`
                    //     .getCoordinates();
                    // console.log(cutCoordinates);

                    // const cutWidth = new LineString([
                    //     cutCoordinates[0][0],
                    //     cutCoordinates[0][1],
                    // ]);

                    // const cutHeight = new LineString([
                    //     cutCoordinates[0][1],
                    //     cutCoordinates[0][2],
                    // ]);

                    // const cutWidthMeasure = formatLength(cutWidth, 3857);
                    // const cutHeightMeasure = formatLength(cutHeight, 3857);

                    // console.log(cutWidthMeasure);
                    // console.log(cutHeightMeasure);

                    // if (
                    //     // (cutWidthMeasure === '0.001875' &&
                    //     //     cutHeightMeasure === '0.004990') ||
                    //     // (cutWidthMeasure === '0.004990' &&
                    //     //     cutHeightMeasure === '0.001875')
                    //     (cutWidthMeasure === '0.020000' &&
                    //         cutHeightMeasure === '0.050000') ||
                    //     (cutWidthMeasure === '0.050000' &&
                    //         cutHeightMeasure === '0.020000')
                    // ) {
                    //     cutFeatures.features.push(cutFeature);
                    // }
                    cutFeatures.features.push(cutFeature);
                }
            } else {
                for (let l = 0; l < clippedList.length; l++) {
                    const cutFeature = new Feature({
                        geometry: new Polygon(clippedList[l]),
                    });

                    cutFeature.setStyle(
                        new Style({
                            stroke: new Stroke({
                                color: 'yellow',
                                width: 0.1,
                            }),
                            fill: new Fill({
                                color: 'rgba(92, 203, 255, 0.4)',
                            }),
                            text: new Text({
                                font: '20px sans-serif',
                                text: (l + 1).toString(),
                            }),
                        })
                    );

                    cutFeatures.features.push(cutFeature);
                }
            }

            if (cutPolyGeoms.length === 1)
                retVal = turfPolygon(cutPolyGeoms[0], { id: id });
            else if (cutPolyGeoms.length > 1) {
                retVal = turfMultiPolygon(cutPolyGeoms, { id: id });
            }

            cutLayer.getSource().addFeatures(cutFeatures.features);

            map.addLayer(cutLayer);

            return retVal;
        } catch (err) {
            console.warn(err);
            alert('에러 발생');
        }
    }

    /*
     * =========================Shift + Drag==================================
     */

    dragBox.on('boxend', (e) => {
        const dragBoxCoordinate = dragBox.getGeometry().getCoordinates();
        console.log(dragBoxCoordinate);

        const newDragCoordinate = get_DragBoxCoordToScreenOrder(
            dragBoxCoordinate,
            map
        )
            .getGeometry()
            .getCoordinates();

        const redStyle = new Style({
            stroke: new Stroke({
                color: 'red',
                width: 4,
            }),
        });

        const newDragFeature = new Feature({
            geometry: new Polygon(newDragCoordinate),
        });

        const newDragLayer = new VectorLayer({
            source: vectorSource,
            style: Drag_Style,
            minZoom: 15,
            maxZoom: 20,
        });

        newDragLayer.getSource().addFeature(newDragFeature);

        map.addLayer(newDragLayer);

        // 드래그 영역
        const gloryFeature = new Feature({
            geometry: new Polygon(dragBoxCoordinate),
            style: redStyle,
        });

        const dragFeature = {
            coordinates: newDragCoordinate,
            type: 'Polygon',
        };

        const dragProjection = formatGeoJSON.readFeatures(dragFeature, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:4326',
        });
        const dragCoordinate = dragProjection[0].getGeometry().getCoordinates();

        const upperWidth = new LineString([
            dragCoordinate[0][0],
            dragCoordinate[0][1],
        ]);

        const lowWidth = new LineString([
            dragCoordinate[0][3],
            dragCoordinate[0][2],
        ]);

        const leftHeight = new LineString([
            dragCoordinate[0][0],
            dragCoordinate[0][3],
        ]);

        const rightHeight = new LineString([
            dragCoordinate[0][1],
            dragCoordinate[0][2],
        ]);

        console.log(
            '넓이 =====> ',
            (formatLength(upperWidth, 4326) * 1000).toFixed(3) + 'm'
        );
        console.log(
            '높이 =====> ',
            (formatLength(leftHeight, 4326) * 1000).toFixed(3) + 'm'
        );

        const upperLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: upperWidth.getCoordinates(),
            },
        };

        const lowLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: lowWidth.getCoordinates(),
            },
        };

        const leftLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: leftHeight.getCoordinates(),
            },
        };

        const rightLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: rightHeight.getCoordinates(),
            },
        };

        /*
         * ==================== 가로 세로 길이 나누기 ==============================
         */
        let i;
        let j;
        let k;
        let l;
        let m;
        let n;
        let x;
        let upperList = [];
        const upperPoint = 0.001875;
        // const upperPoint = 0.001;
        const upperDistance = formatLength(upperWidth, 4326);
        if (upperDistance < upperPoint) {
            alert('드래그한 넓이가 최소 길이보다 짧습니다.');
        }
        for (i = 0; i <= upperDistance / upperPoint; i++) {
            const options = { units: 'kilometers' };
            const upperAlong = along(upperLine, i * upperPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(upperAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            upperList.push(alongProjection[0].getGeometry());
        }

        let lowList = [];
        const lowPoint = 0.001875;
        // const lowPoint = 0.001;
        const lowDistance = formatLength(lowWidth, 4326);
        if (lowDistance < lowPoint) {
            return;
        }
        for (j = 0; j <= lowDistance / lowPoint; j++) {
            const options = { units: 'kilometers' };
            const lowAlong = along(lowLine, j * lowPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(lowAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            lowList.push(alongProjection[0].getGeometry());
        }

        let leftList = [];
        const leftPoint = 0.00465;
        // const leftPoint = 0.01;
        const leftDistance = formatLength(leftHeight, 4326);
        if (leftDistance < leftPoint) {
            alert('드래그한 높이가 최소 높이보다 짧습니다.');
        }
        for (k = 0; k <= leftDistance / leftPoint; k++) {
            const options = { units: 'kilometers' };
            const leftAlong = along(leftLine, k * leftPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(leftAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            leftList.push(alongProjection[0].getGeometry());
        }

        let rightList = [];
        const rightPoint = 0.00465;
        // const rightPoint = 0.01;
        const rightDistance = formatLength(rightHeight, 4326);
        if (rightDistance < rightPoint) {
            return;
        }
        for (l = 0; l <= rightDistance / rightPoint; l++) {
            const options = { units: 'kilometers' };
            const rightAlong = along(rightLine, l * rightPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(rightAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            rightList.push(alongProjection[0].getGeometry());
        }

        let splitLines = [];
        let splitWidths = [
            [
                {
                    coordinates: [
                        upperList[0].flatCoordinates,
                        lowList[0].flatCoordinates,
                    ],
                    type: 'LineString',
                },
            ],
        ];
        let splitHeights = [
            [
                {
                    coordinates: [
                        leftList[0].flatCoordinates,
                        rightList[0].flatCoordinates,
                    ],
                    type: 'LineString',
                },
            ],
        ];

        for (m = 1; m < upperList.length; m++) {
            const splitWidth = [
                {
                    coordinates: [
                        [
                            upperList[m].flatCoordinates[0],
                            upperList[m].flatCoordinates[1],
                        ],
                        [
                            lowList[m].flatCoordinates[0],
                            lowList[m].flatCoordinates[1],
                        ],
                    ],
                    type: 'LineString',
                },
            ];
            splitWidths.push(splitWidth);
        }

        for (let v = 1; v < leftList.length; v++) {
            const splitHeight = [
                {
                    coordinates: [
                        [
                            leftList[v].flatCoordinates[0],
                            leftList[v].flatCoordinates[1],
                        ],
                        [
                            rightList[v].flatCoordinates[0],
                            rightList[v].flatCoordinates[1],
                        ],
                    ],
                    type: 'LineString',
                },
            ];

            splitHeights.push(splitHeight);
        }

        for (n = 0; n < splitWidths.length; n++) {
            splitLines.push(splitWidths[n][0]);
        }
        for (x = 0; x < splitHeights.length; x++) {
            splitLines.push(splitHeights[x][0]);
        }

        const dragPolygon = {
            coordinates: dragProjection[0].getGeometry().getCoordinates(),
            type: 'Polygon',
        };

        cutPolygon(toMercator(dragPolygon), splitLines, 0.001, 'split');

        // const marker = formatGeoJSON.readFeature(gloryAlong);
        // marker.getGeometry().transform('EPSG:4326', 'EPSG:3857');
        //   source.addFeature(marker);

        const gloryFeatures = {
            type: 'FeatureCollection',
            features: [
                gloryFeature,
                // splitFeature0,
                // splitFeature1,
                // splitFeature2,
                // splitFeature3,
                // splitFeature4,
                // splitFeature5,
                // splitFeature,
                // marker,
            ],
        };
        // const dividedPolygonFeatures = polygonDivide(gloryFeature);
        // const lengths = dividedPolygonFeatures.length;

        // for (let a = 0; a < lengths; a++) {
        //     dividedPolygonFeatures[a].set('number', a + 1);
        //     // dividedPolygonFeatures[i].set('number', lengths - i);
        //     const featureNumber =
        //         dividedPolygonFeatures[a].values_.number.toString();
        //     dividedPolygonFeatures[a].setStyle(
        //         new Style({
        //             stroke: new Stroke({
        //                 color: 'red',
        //                 width: 3,
        //             }),
        //             fill: new Fill({
        //                 color: 'rgba(9, 42, 56, 0.3)',
        //             }),
        //             text: new Text({
        //                 font: '20px sans-serif',
        //                 text: featureNumber,
        //             }),
        //         })
        //     );
        // }
        // console.log(
        //     'dividedPolygonFeatures dividedPolygonFeatures',
        //     dividedPolygonFeatures
        // );

        // const dragLayer = new VectorLayer({
        //     source: new VectorSource({
        //         features: dividedPolygonFeatures,
        //     }),
        // });

        const dragLayer = new VectorLayer({
            source: vectorSource,
        });

        // dragLayer.getSource().addFeatures(gloryFeatures.features);
        // map.addLayer(dragLayer);
    });

    /*===================================================================== */

    function drawEnd(e) {
        // 도형 갯수
        // const nDivisions = document.getElementById('nDivisions').value;
        // const colors = [];
        // for (let i = 0; i < nDivisions; i++) {
        //     colors.push(get_random_rgb(0.5));
        // }
        // const dividedPolygonFeatures = polygonDivide(
        //     e.feature,
        //     nDivisions,
        //     colors
        // );
        // const dividedPolygonFeatures = polygonDivide(e.feature);

        // const polygon = formatGeoJSON.writeFeatureObject(e.feature, {
        //     dataProjection: 'EPSG:3857',
        //     featureProjection: 'EPSG:4326',
        // });

        const drawPolygon = {
            type: 'Polygon',
            coordinates: e.feature.getGeometry().getCoordinates(),
        };

        const dragProjection = formatGeoJSON.readFeatures(drawPolygon, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:4326',
        });

        const dragCoordinate = dragProjection[0].getGeometry().getCoordinates();

        const upperWidth = new LineString([
            dragCoordinate[0][0],
            dragCoordinate[0][3],
        ]);

        const lowWidth = new LineString([
            dragCoordinate[0][1],
            dragCoordinate[0][2],
        ]);

        const leftHeight = new LineString([
            dragCoordinate[0][0],
            dragCoordinate[0][1],
        ]);

        const rightHeight = new LineString([
            dragCoordinate[0][3],
            dragCoordinate[0][2],
        ]);

        console.log('넓이 =====> ', formatLength(upperWidth, 4326));
        console.log('높이 =====> ', formatLength(leftHeight, 4326));

        const upperLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: upperWidth.getCoordinates(),
            },
        };

        const lowLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: lowWidth.getCoordinates(),
            },
        };

        const leftLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: leftHeight.getCoordinates(),
            },
        };

        const rightLine = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: rightHeight.getCoordinates(),
            },
        };

        /*
         * ==================== 가로 세로 길이 나누기 ==============================
         */
        let i;
        let j;
        let k;
        let l;
        let m;
        let n;
        let x;
        let upperList = [];
        // const upperPoint = 0.001875;
        const upperPoint = 0.02;
        const upperDistance = formatLength(upperWidth, 4326);
        if (upperDistance < upperPoint) {
            return;
        }
        for (i = 0; i <= upperDistance / upperPoint; i++) {
            const options = { units: 'kilometers' };
            const upperAlong = along(upperLine, i * upperPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(upperAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            upperList.push(alongProjection[0].getGeometry());
        }
        console.log('upperList upperList', upperList);

        let lowList = [];
        // const lowPoint = 0.001875;
        const lowPoint = 0.02;
        const lowDistance = formatLength(lowWidth, 4326);
        if (lowDistance < lowPoint) {
            return;
        }
        for (j = 0; j <= lowDistance / lowPoint; j++) {
            const options = { units: 'kilometers' };
            const lowAlong = along(lowLine, j * lowPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(lowAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            lowList.push(alongProjection[0].getGeometry());
        }

        let leftList = [];
        // const leftPoint = 0.00499;
        const leftPoint = 0.05;
        const leftDistance = formatLength(leftHeight, 4326);
        if (leftDistance < leftPoint) {
            return;
        }
        for (k = 0; k <= leftDistance / leftPoint; k++) {
            const options = { units: 'kilometers' };
            const leftAlong = along(leftLine, k * leftPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(leftAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            leftList.push(alongProjection[0].getGeometry());
        }
        console.log('leftList leftList', leftList);

        let rightList = [];
        // const rightPoint = 0.00499;
        const rightPoint = 0.05;
        const rightDistance = formatLength(rightHeight, 4326);
        if (rightDistance < rightPoint) {
            return;
        }
        for (l = 0; l <= rightDistance / rightPoint; l++) {
            const options = { units: 'kilometers' };
            const rightAlong = along(rightLine, l * rightPoint, options);
            const alongProjection = formatGeoJSON.readFeatures(rightAlong, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857',
            });
            rightList.push(alongProjection[0].getGeometry());
        }

        let splitLines = [];
        let splitWidths = [
            [
                {
                    coordinates: [
                        upperList[0].flatCoordinates,
                        lowList[0].flatCoordinates,
                    ],
                    type: 'LineString',
                },
            ],
        ];
        let splitHeights = [
            [
                {
                    coordinates: [
                        leftList[0].flatCoordinates,
                        rightList[0].flatCoordinates,
                    ],
                    type: 'LineString',
                },
            ],
        ];

        for (m = 1; m < upperList.length; m++) {
            const splitWidth = [
                {
                    coordinates: [
                        [
                            upperList[m].flatCoordinates[0],
                            upperList[m].flatCoordinates[1],
                        ],
                        [
                            lowList[m].flatCoordinates[0],
                            lowList[m].flatCoordinates[1],
                        ],
                    ],
                    type: 'LineString',
                },
            ];
            splitWidths.push(splitWidth);
        }

        for (let v = 1; v < leftList.length; v++) {
            const splitHeight = [
                {
                    coordinates: [
                        [
                            leftList[v].flatCoordinates[0],
                            leftList[v].flatCoordinates[1],
                        ],
                        [
                            rightList[v].flatCoordinates[0],
                            rightList[v].flatCoordinates[1],
                        ],
                    ],
                    type: 'LineString',
                },
            ];

            splitHeights.push(splitHeight);
        }

        for (n = 0; n < splitWidths.length; n++) {
            splitLines.push(splitWidths[n][0]);
        }
        for (x = 0; x < splitHeights.length; x++) {
            splitLines.push(splitHeights[x][0]);
        }

        const dragFeature4326 = {
            coordinates: dragProjection[0].getGeometry().getCoordinates(),
            type: 'Polygon',
        };

        cutPolygon(toMercator(dragFeature4326), splitLines, 0.001, 'split');

        // cutPolygon(polygon, splitLines, -0.00001, 'split');

        // const lengths = dividedPolygonFeatures.length;

        // for (let i = 0; i < lengths; i++) {
        //     dividedPolygonFeatures[i].set('number', i + 1);
        //     // dividedPolygonFeatures[i].set('number', lengths - i);
        //     const featureNumber =
        //         dividedPolygonFeatures[i].values_.number.toString();
        //     dividedPolygonFeatures[i].setStyle(
        //         new Style({
        //             stroke: new Stroke({
        //                 color: 'red',
        //                 width: 3,
        //             }),
        //             fill: new Fill({
        //                 color: 'rgba(9, 42, 56, 0.3)',
        //             }),
        //             text: new Text({
        //                 font: '20px sans-serif',
        //                 text: featureNumber,
        //             }),
        //         })
        //     );
        // }

        // vectorLayer.getSource().addFeatures(dividedPolygonFeatures);

        // for (let j = 0; j < 5; j++) {
        //     console.log('iiiii', j);
        //     vectorLayer.getSource().removeFeature(dividedPolygonFeatures[j]);
        // }

        // for (
        //     let i = dividedPolygonFeatures.length - 1;
        //     i > dividedPolygonFeatures.length - 10;
        //     i--
        // ) {
        //     console.log('iiiii', i);
        //     vectorLayer.getSource().removeFeature(dividedPolygonFeatures[i]);
        // }

        map.removeInteraction(draw);
    }

    draw.on('drawend', drawEnd);

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

export default SplitPolygon;
