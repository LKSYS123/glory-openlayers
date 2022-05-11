import React, { useEffect } from 'react';
import GeoJSON from 'ol/format/GeoJSON';
import { Feature, Map as OlMap, View } from 'ol';
import { getCenter } from 'ol/extent';
import { Vector as VectorSource, OSM } from 'ol/source';
import { Vector as VectorLayer, Tile as TileLayer } from 'ol/layer';
import { Fill, Stroke, Style, Text, Icon } from 'ol/style';
import { Draw } from 'ol/interaction';
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
import { getLength } from 'ol/sphere';
import { LineString, Circle } from 'ol/geom';

import {
    polygon as turfPolygon,
    lineString,
    lineToPolygon,
    difference,
    multiPolygon as turfMultiPolygon,
    lineOffset,
    lineIntersect,
    along,
    toMercator,
} from '@turf/turf';

import 'ol/ol.css';

const SplitPolygon = () => {
    /*
     * ================= Sources & Layers ====================
     */
    const sourceDrawnPolygons = new VectorSource({ wrapX: false });
    const vectorSource = new VectorSource({});

    const osmLayer = new TileLayer({
        source: new OSM(),
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: styleFunction0,
    });
    /*=============================================== */

    // function style(feature) {
    //     const style = new Style({
    //         stroke: new Stroke({
    //             color: [0, 0, 255, 0.8],
    //             width: 1,
    //         }),
    //         fill: new Fill({
    //             color: feature.get('color'),
    //         }),
    //         text: new Text({
    //             text: Math.floor(feature.get('percentage') * 100) + '%',
    //         }),
    //     });
    //     return style;
    // }
    // })

    function styleFunction0(feature) {
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
        layers: [osmLayer, vectorLayer],
        target: 'map2',
        view: new View({
            center: [470450, 6669945],
            zoom: 20,
        }),
    });

    /*
     * ===================================맵 회전 각도 출력 =======================================
     */
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
        console.log('회전각', nowDegree);
    });

    /*
     * ============================= 마우스 이동방향 인식 ===============================
     */
    let startCoord = [0, 0];
    let middleCoord = [0, 0];
    let endCoord = [0, 0];
    let dragging = false;
    let mouseList = [];
    let dragDirection;

    window.addEventListener('mousedown', (e) => {
        mouseList = [];
        startCoord = [e.clientX, e.clientY];
        dragging = true;
    });

    window.addEventListener('mousemove', (e) => {
        if (dragging) {
            mouseList.push([e.clientX, e.clientY]);
        }
    });

    window.addEventListener('mouseup', (e) => {
        dragging = false;
        middleCoord = mouseList[parseInt(mouseList.length / 2)];
        endCoord = [e.clientX, e.clientY];
        const diffX = endCoord[0] - startCoord[0];
        const diffY = endCoord[1] - startCoord[1];

        if (middleCoord === undefined) {
            return;
        } else {
            dragDirection =
                (endCoord[0] - startCoord[0]) *
                    (middleCoord[1] - startCoord[1]) -
                (middleCoord[0] - startCoord[0]) *
                    (endCoord[1] - startCoord[1]);

            console.log(dragDirection);
        }

        if (
            (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) ||
            (diffX < 0 && Math.abs(diffX) < Math.abs(diffY))
        ) {
            if (diffY > 10) {
                if (dragDirection < 0) {
                    console.log('DownLeft DownLeft DownLeft DownLeft');
                } else if (dragDirection > 0) {
                    console.log('LeftDown LeftDown LeftDown LeftDown');
                }
            } else if (diffY < -10) {
                if (dragDirection < 0) {
                    console.log('LeftUp LeftUp LeftUp LeftUp');
                } else if (dragDirection > 0) {
                    console.log('UpLeft UpLeft UpLeft UpLeft');
                }
            } else if (diffY <= 0 && diffY >= -10) {
                console.log('left left left left');
            }
        } else if (
            (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) ||
            (diffX > 0 && Math.abs(diffX) < Math.abs(diffY))
        ) {
            if (diffY > 10) {
                if (dragDirection < 0) {
                    console.log('RightDown RightDown RightDown RightDown');
                } else if (dragDirection > 0) {
                    console.log('DownRight DownRight DownRight DownRight');
                }
            } else if (diffY < -10) {
                if (dragDirection < 0) {
                    console.log('UpRight UpRight UpRight UpRight');
                } else if (dragDirection > 0) {
                    console.log('RightUp RightUp RightUp RightUp');
                }
            } else if (diffY <= 0 && diffY >= -10) {
                console.log('right right right right');
            }
        }

        //  else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
        //     console.log('down down down down down');
        // } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
        //     console.log('up up up up up up');
        // }
    });

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

    const geometryStyles = {
        Sonata: [
            new Style({
                stroke: new Stroke({
                    color: 'yellow',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(92, 203, 255, 0.4)',
                }),
                text: new Text({
                    font: '15px sans-serif',
                    text: 'Sonata',
                }),
            }),
            new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'white',
                }),
                geometry: (feature) => {
                    const cutPolygon = {
                        coordinates: feature.getGeometry().getCoordinates(),
                        type: 'Polygon',
                    };

                    const cutProjection = formatGeoJSON.readFeatures(
                        cutPolygon,
                        {
                            dataProjection: 'EPSG:3857',
                            featureProjection: 'EPSG:4326',
                        }
                    );

                    var featureCoor = cutProjection[0]
                        .getGeometry()
                        .getCoordinates();

                    var leftLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][3], featureCoor[0][0]],
                    };

                    var rightLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][2], featureCoor[0][1]],
                    };

                    var leftAlong = along(leftLine, 0.01, {
                        units: 'kilometers',
                    });

                    const leftAlongProjection = formatGeoJSON.readFeatures(
                        leftAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var rightAlong = along(rightLine, 0.01, {
                        units: 'kilometers',
                    });

                    const rightAlongProjection = formatGeoJSON.readFeatures(
                        rightAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var middleLine = new LineString([
                        leftAlongProjection[0].getGeometry().getCoordinates(),
                        rightAlongProjection[0].getGeometry().getCoordinates(),
                    ]);

                    var upperCenter = getCenter(middleLine.getExtent());

                    const middleCircle = new Feature({
                        geometry: new Circle(upperCenter, 10),
                    });

                    return middleCircle.getGeometry();
                },
            }),
        ],
        Avante: [
            new Style({
                stroke: new Stroke({
                    color: 'yellow',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(92, 203, 255, 0.4)',
                }),
                text: new Text({
                    font: '15px sans-serif',
                    text: 'Avante',
                }),
            }),
            new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'purple',
                }),
                geometry: (feature) => {
                    const cutPolygon = {
                        coordinates: feature.getGeometry().getCoordinates(),
                        type: 'Polygon',
                    };

                    const cutProjection = formatGeoJSON.readFeatures(
                        cutPolygon,
                        {
                            dataProjection: 'EPSG:3857',
                            featureProjection: 'EPSG:4326',
                        }
                    );

                    var featureCoor = cutProjection[0]
                        .getGeometry()
                        .getCoordinates();

                    var leftLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][3], featureCoor[0][0]],
                    };

                    var rightLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][2], featureCoor[0][1]],
                    };

                    var leftAlong = along(leftLine, 0.01, {
                        units: 'kilometers',
                    });

                    const leftAlongProjection = formatGeoJSON.readFeatures(
                        leftAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var rightAlong = along(rightLine, 0.01, {
                        units: 'kilometers',
                    });

                    const rightAlongProjection = formatGeoJSON.readFeatures(
                        rightAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var middleLine = new LineString([
                        leftAlongProjection[0].getGeometry().getCoordinates(),
                        rightAlongProjection[0].getGeometry().getCoordinates(),
                    ]);

                    var upperCenter = getCenter(middleLine.getExtent());

                    const middleCircle = new Feature({
                        geometry: new Circle(upperCenter, 10),
                    });

                    return middleCircle.getGeometry();
                },
            }),
        ],
        Tesla: [
            new Style({
                stroke: new Stroke({
                    color: 'yellow',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'rgba(92, 203, 255, 0.4)',
                }),
                text: new Text({
                    font: '15px sans-serif',
                    text: 'Tesla',
                }),
            }),
            new Style({
                stroke: new Stroke({
                    color: 'black',
                    width: 3,
                }),
                fill: new Fill({
                    color: 'gray',
                }),
                geometry: (feature) => {
                    const cutPolygon = {
                        coordinates: feature.getGeometry().getCoordinates(),
                        type: 'Polygon',
                    };

                    const cutProjection = formatGeoJSON.readFeatures(
                        cutPolygon,
                        {
                            dataProjection: 'EPSG:3857',
                            featureProjection: 'EPSG:4326',
                        }
                    );

                    var featureCoor = cutProjection[0]
                        .getGeometry()
                        .getCoordinates();

                    var leftLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][3], featureCoor[0][0]],
                    };

                    var rightLine = {
                        type: 'LineString',
                        coordinates: [featureCoor[0][2], featureCoor[0][1]],
                    };

                    var leftAlong = along(leftLine, 0.01, {
                        units: 'kilometers',
                    });

                    const leftAlongProjection = formatGeoJSON.readFeatures(
                        leftAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var rightAlong = along(rightLine, 0.01, {
                        units: 'kilometers',
                    });

                    const rightAlongProjection = formatGeoJSON.readFeatures(
                        rightAlong,
                        {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857',
                        }
                    );

                    var middleLine = new LineString([
                        leftAlongProjection[0].getGeometry().getCoordinates(),
                        rightAlongProjection[0].getGeometry().getCoordinates(),
                    ]);

                    var upperCenter = getCenter(middleLine.getExtent());

                    const middleCircle = new Feature({
                        geometry: new Circle(upperCenter, 10),
                    });

                    return middleCircle.getGeometry();
                },
            }),
        ],
    };

    const geometryFunction = (feature) => {
        return geometryStyles[feature.values_.car];
    };

    let carType;
    const carChange = (e) => {
        carType = e.target.value;
    };

    /*
     * ================================== 도형자르기2 ==================================
     */
    function cutPolygon(polygon, line, direction, id) {
        try {
            var i;
            var j;
            var k;
            var l;
            var polyCoords = [];
            var cutPolyGeoms = [];
            var retVal = null;

            const cutFeatures = {
                type: 'Collection',
                features: [],
            };

            const cutLayer = new VectorLayer({
                source: new VectorSource({}),
                style: geometryFunction,
            });

            if (polygon.type !== 'Polygon' || line[0].type !== 'LineString') {
                console.log('notPolygon or notLineString');
                return retVal;
            }

            for (i = 0; i < line.length; i++) {
                var offsetLine = lineOffset(line[i], 0.01 * direction, {
                    units: 'kilometers',
                });
                for (j = 0; j < line[i].coordinates.length; j++) {
                    polyCoords.push(line[i].coordinates[j]);
                }
                for (
                    k = offsetLine.geometry.coordinates.length - 1;
                    k >= 0;
                    k--
                ) {
                    polyCoords.push(offsetLine.geometry.coordinates[k]);
                }

                var thickLineString = lineString(polyCoords);
                var thickLinePolygon = lineToPolygon(thickLineString);
            }

            var clipped = difference(polygon, thickLinePolygon);
            for (l = 0; l < clipped.geometry.coordinates.length; l++) {
                const cutFeature = new Feature({
                    geometry: new Polygon(clipped.geometry.coordinates[l]),
                });

                // cutFeature.set('number', l + 1);
                cutFeature.set('car', carType);
                // if (l < 5) {
                //     cutFeature.set('car', 'Sonata');
                // } else if (l >= 5 && l < 10) {
                //     cutFeature.set('car', 'Avante');
                // } else if (l >= 10) {
                //     cutFeature.set('car', 'Tesla');
                // }

                cutFeatures.features.push(cutFeature);
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
        try {
            const dragBoxCoordinate = dragBox.getGeometry().getCoordinates();
            console.log('dragCoordinate dragCoordinate', dragBoxCoordinate);

            const redStyle = new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 4,
                }),
            });

            // 드래그 영역
            const gloryFeature = new Feature({
                geometry: new Polygon(dragBoxCoordinate),
                style: redStyle,
            });

            const dragPolygon = {
                coordinates: dragBoxCoordinate,
                type: 'Polygon',
            };

            /*
             * ==============================================================================
             */

            const dragProjection = formatGeoJSON.readFeatures(dragPolygon, {
                dataProjection: 'EPSG:3857',
                featureProjection: 'EPSG:4326',
            });
            const dragCoordinate = dragProjection[0]
                .getGeometry()
                .getCoordinates();

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
             * ==================== 가로 세로 길이 나누기 4326 ==============================
             */
            var i;
            var j;
            var k;
            var l;
            var m;
            var n;
            var x;
            let upperList = [];
            const upperPoint = 0.02;
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
            const leftPoint = 0.05;
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

            for (var v = 1; v < leftList.length; v++) {
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

            const dragFeature = {
                coordinates: dragProjection[0].getGeometry().getCoordinates(),
                type: 'Polygon',
            };

            cutPolygon(toMercator(dragFeature), splitLines, 0.001, 'split');

            // const gloryFeatures = {
            //     type: 'FeatureCollection',
            //     features: [
            //         // gloryFeature,
            //         // splitFeature0,
            //         // splitFeature1,
            //         // splitFeature2,
            //         // splitFeature3,
            //         // splitFeature4,
            //         // splitFeature5,
            //         // splitFeature,
            //         // marker,
            //     ],
            // };

            const dragLayer = new VectorLayer({
                source: new VectorSource({}),
            });

            // dragLayer.getSource().addFeatures(gloryFeatures.features);
            map.addLayer(dragLayer);
        } catch (err) {
            console.warn(err);
            alert('에러 발생');
        }
    });

    /*
     * ================================= drawEnd ==============================================
     */

    function drawEnd(e) {
        const drawPolygon = {
            type: 'Polygon',
            coordinates: e.feature.getGeometry().getCoordinates(),
        };

        const drawProjection = formatGeoJSON.readFeatures(drawPolygon, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:4326',
        });

        const drawCoordinate = drawProjection[0].getGeometry().getCoordinates();

        console.log('eeeeeeeeeeeeeee', e);
        console.log('dragCoordinate dragCoordinate', drawCoordinate);

        const redStyle = new Style({
            stroke: new Stroke({
                color: 'red',
                width: 4,
            }),
        });

        const upperWidth = new LineString([
            drawCoordinate[0][0],
            drawCoordinate[0][3],
        ]);

        const lowWidth = new LineString([
            drawCoordinate[0][1],
            drawCoordinate[0][2],
        ]);

        const leftHeight = new LineString([
            drawCoordinate[0][0],
            drawCoordinate[0][1],
        ]);

        const rightHeight = new LineString([
            drawCoordinate[0][3],
            drawCoordinate[0][2],
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
        var i;
        var j;
        var k;
        var l;
        var m;
        var n;
        var x;
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

        for (var v = 1; v < leftList.length; v++) {
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

        const drawFeature = {
            coordinates: drawProjection[0].getGeometry().getCoordinates(),
            type: 'Polygon',
        };

        cutPolygon(toMercator(drawFeature), splitLines, 0.001, 'split');

        // for (var j = 0; j < 5; j++) {
        //     console.log('iiiii', j);
        //     vectorLayer.getSource().removeFeature(dividedPolygonFeatures[j]);
        // }

        // for (
        //     var i = dividedPolygonFeatures.length - 1;
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
            <div
                style={{
                    width: 200,
                    height: 30,
                    marginBottom: 10,
                    fontSize: 20,
                }}
            >
                <form style={{ position: 'absolute' }}>
                    <label htmlFor='carType'> Car Type </label>
                    <select
                        id='projection'
                        onChange={carChange}
                        style={{ fontSize: 20 }}
                    >
                        <option value=''>차종선택</option>
                        <option value='Sonata'>Sonata</option>
                        <option value='Avante'>Avante</option>
                        <option value='Tesla'>Tesla</option>
                    </select>
                </form>
            </div>
            <div
                id='map2'
                className='map'
                style={{ width: '95vw', height: '74vh', position: 'relative' }}
            >
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
            </div>
        </>
    );
};

export default SplitPolygon;
