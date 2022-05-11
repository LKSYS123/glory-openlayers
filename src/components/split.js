import GeoJSON from 'ol/format/GeoJSON';
import { Feature } from 'ol';
import { getCenter } from 'ol/extent';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { LineString, Circle, Polygon } from 'ol/geom';
import { getLength } from 'ol/sphere';
import { DragBox } from 'ol/interaction';
import { shiftKeyOnly } from 'ol/events/condition';

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

const formatGeoJSON = new GeoJSON();
const vectorSource = new VectorSource({});
const dragBox = new DragBox({
    condition: shiftKeyOnly,
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

const geometryStyleFunction = (feature) => {
    var geom = feature.get('number');
    if (geom % 2 !== 0) {
        const cutPolygon = {
            coordinates: feature.getGeometry().getCoordinates(),
            type: 'Polygon',
        };

        const cutProjection = formatGeoJSON.readFeatures(cutPolygon, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:4326',
        });

        var featureCoor = cutProjection[0].getGeometry().getCoordinates();

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

        const leftAlongProjection = formatGeoJSON.readFeatures(leftAlong, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });

        var rightAlong = along(rightLine, 0.01, {
            units: 'kilometers',
        });

        const rightAlongProjection = formatGeoJSON.readFeatures(rightAlong, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });

        var middleLine = new LineString([
            leftAlongProjection[0].getGeometry().getCoordinates(),
            rightAlongProjection[0].getGeometry().getCoordinates(),
        ]);

        var upperCenter = getCenter(middleLine.getExtent());

        const middleCircle = new Feature({
            geometry: new Circle(upperCenter, 10),
        });

        return middleCircle.getGeometry();
    }
};

/*
 * ================================== 도형자르기 ==================================
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
            source: vectorSource,
        });

        if (polygon.type !== 'Polygon' || line[0].type !== 'LineString') {
            console.log('notPolygon or notLineString');
            return retVal;
        }

        for (i = 0; i < line.length; i++) {
            var intersectPoints = lineIntersect(polygon, line[i]);
            var nPoints = intersectPoints.features.length;
            // if (nPoints === 0 || nPoints % 2 !== 0) {
            //     alert('nPoints is 0 or even number');
            //     return retVal;
            // }

            var offsetLine = lineOffset(line[i], 0.01 * direction, {
                units: 'kilometers',
            });
            for (j = 0; j < line[i].coordinates.length; j++) {
                polyCoords.push(line[i].coordinates[j]);
            }
            for (k = offsetLine.geometry.coordinates.length - 1; k >= 0; k--) {
                polyCoords.push(offsetLine.geometry.coordinates[k]);
            }

            var thickLineString = lineString(polyCoords);
            var thickLinePolygon = lineToPolygon(thickLineString);
        }

        var clipped = difference(polygon, thickLinePolygon);
        for (l = 0; l < clipped.geometry.coordinates.length; l++) {
            // var polyg = turfPolygon(clipped.geometry.coordinates[j]);
            // var overlap = lineOverlap(polyg, line, { tolerance: 0.005 });
            // if (overlap.features.length > 0) {
            //     cutPolyGeoms.push(polyg.geometry.coordinates);
            // }

            const cutFeature = new Feature({
                geometry: new Polygon(clipped.geometry.coordinates[l]),
            });

            cutFeature.set('number', l + 1);

            cutFeature.setStyle([
                new Style({
                    stroke: new Stroke({
                        color: 'yellow',
                        width: 3,
                    }),
                    fill: new Fill({
                        color: 'rgba(92, 203, 255, 0.4)',
                    }),
                    text: new Text({
                        font: '20px sans-serif',
                        text: (l + 1).toString(),
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
                    geometry: function (feature) {
                        var geom = feature.get('number');
                        if (geom % 2 === 0) {
                            const cutPolygon = {
                                coordinates: feature
                                    .getGeometry()
                                    .getCoordinates(),
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
                                coordinates: [
                                    featureCoor[0][3],
                                    featureCoor[0][0],
                                ],
                            };

                            var rightLine = {
                                type: 'LineString',
                                coordinates: [
                                    featureCoor[0][2],
                                    featureCoor[0][1],
                                ],
                            };

                            var leftAlong = along(leftLine, 0.01, {
                                units: 'kilometers',
                            });

                            const leftAlongProjection =
                                formatGeoJSON.readFeatures(leftAlong, {
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: 'EPSG:3857',
                                });

                            var rightAlong = along(rightLine, 0.01, {
                                units: 'kilometers',
                            });

                            const rightAlongProjection =
                                formatGeoJSON.readFeatures(rightAlong, {
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: 'EPSG:3857',
                                });

                            var middleLine = new LineString([
                                leftAlongProjection[0]
                                    .getGeometry()
                                    .getCoordinates(),
                                rightAlongProjection[0]
                                    .getGeometry()
                                    .getCoordinates(),
                            ]);

                            var upperCenter = getCenter(middleLine.getExtent());

                            const middleCircle = new Feature({
                                geometry: new Circle(upperCenter, 10),
                            });

                            return middleCircle.getGeometry();
                        }
                    },
                }),
                new Style({
                    stroke: new Stroke({
                        color: 'black',
                        width: 3,
                    }),
                    fill: new Fill({
                        color: 'rgba(1, 80, 25, 0.4)',
                    }),
                    geometry: function (feature) {
                        var geom = feature.get('number');
                        if (geom % 2 !== 0) {
                            const cutPolygon = {
                                coordinates: feature
                                    .getGeometry()
                                    .getCoordinates(),
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
                                coordinates: [
                                    featureCoor[0][3],
                                    featureCoor[0][0],
                                ],
                            };

                            var rightLine = {
                                type: 'LineString',
                                coordinates: [
                                    featureCoor[0][2],
                                    featureCoor[0][1],
                                ],
                            };

                            var leftAlong = along(leftLine, 0.01, {
                                units: 'kilometers',
                            });

                            const leftAlongProjection =
                                formatGeoJSON.readFeatures(leftAlong, {
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: 'EPSG:3857',
                                });

                            var rightAlong = along(rightLine, 0.01, {
                                units: 'kilometers',
                            });

                            const rightAlongProjection =
                                formatGeoJSON.readFeatures(rightAlong, {
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: 'EPSG:3857',
                                });

                            var middleLine = new LineString([
                                leftAlongProjection[0]
                                    .getGeometry()
                                    .getCoordinates(),
                                rightAlongProjection[0]
                                    .getGeometry()
                                    .getCoordinates(),
                            ]);

                            var upperCenter = getCenter(middleLine.getExtent());

                            const middleCircle = new Feature({
                                geometry: new Circle(upperCenter, 10),
                            });

                            return middleCircle.getGeometry();
                        }
                    },
                }),
            ]);

            cutFeatures.features.push(cutFeature);
        }

        if (cutPolyGeoms.length === 1)
            retVal = turfPolygon(cutPolyGeoms[0], { id: id });
        else if (cutPolyGeoms.length > 1) {
            retVal = turfMultiPolygon(cutPolyGeoms, { id: id });
        }

        cutLayer.getSource().addFeatures(cutFeatures.features);
        console.log('cutFeatures cutFeatures', cutFeatures.features);
        // console.log(cutFeatures.features[3].getGeometry().getCoordinates());

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
    const dragCoordinate = dragBox.getGeometry().getCoordinates();
    console.log('dragCoordinate dragCoordinate', dragCoordinate);

    const redStyle = new Style({
        stroke: new Stroke({
            color: 'red',
            width: 4,
        }),
    });

    // 드래그 영역
    const gloryFeature = new Feature({
        geometry: new Polygon(dragCoordinate),
        style: redStyle,
    });

    const dragFeature = {
        coordinates: dragCoordinate,
        type: 'Polygon',
    };

    /*
     * ==============================================================================
     */

    const dragProjection = formatGeoJSON.readFeatures(dragFeature, {
        dataProjection: 'EPSG:3857',
        featureProjection: 'EPSG:4326',
    });
    const dragProjection4326 = dragProjection[0].getGeometry().getCoordinates();

    const upperWidth4326 = new LineString([
        dragProjection4326[0][0],
        dragProjection4326[0][3],
    ]);

    const lowWidth4326 = new LineString([
        dragProjection4326[0][1],
        dragProjection4326[0][2],
    ]);

    const leftHeight4326 = new LineString([
        dragProjection4326[0][0],
        dragProjection4326[0][1],
    ]);

    const rightHeight4326 = new LineString([
        dragProjection4326[0][3],
        dragProjection4326[0][2],
    ]);

    console.log('넓이 =====> ', formatLength(upperWidth4326, 4326));
    console.log('높이 =====> ', formatLength(leftHeight4326, 4326));

    const upperLine4326 = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: upperWidth4326.getCoordinates(),
        },
    };

    const lowLine4326 = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: lowWidth4326.getCoordinates(),
        },
    };

    const leftLine4326 = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: leftHeight4326.getCoordinates(),
        },
    };

    const rightLine4326 = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: rightHeight4326.getCoordinates(),
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
    const upperDistance = formatLength(upperWidth4326, 4326);
    if (upperDistance < upperPoint) {
        alert('드래그한 넓이가 최소 길이보다 짧습니다.');
    }
    for (i = 0; i <= upperDistance / upperPoint; i++) {
        const options = { units: 'kilometers' };
        const upperAlong = along(upperLine4326, i * upperPoint, options);
        const alongProjection = formatGeoJSON.readFeatures(upperAlong, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });
        upperList.push(alongProjection[0].getGeometry());
    }
    console.log('upperList upperList', upperList);

    let lowList = [];
    const lowPoint = 0.02;
    const lowDistance = formatLength(lowWidth4326, 4326);
    if (lowDistance < lowPoint) {
        return;
    }
    for (j = 0; j <= lowDistance / lowPoint; j++) {
        const options = { units: 'kilometers' };
        const lowAlong = along(lowLine4326, j * lowPoint, options);
        const alongProjection = formatGeoJSON.readFeatures(lowAlong, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });
        lowList.push(alongProjection[0].getGeometry());
    }

    let leftList = [];
    const leftPoint = 0.05;
    const leftDistance = formatLength(leftHeight4326, 4326);
    if (leftDistance < leftPoint) {
        alert('드래그한 높이가 최소 높이보다 짧습니다.');
    }
    for (k = 0; k <= leftDistance / leftPoint; k++) {
        const options = { units: 'kilometers' };
        const leftAlong = along(leftLine4326, k * leftPoint, options);
        const alongProjection = formatGeoJSON.readFeatures(leftAlong, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });
        leftList.push(alongProjection[0].getGeometry());
    }
    console.log('leftList leftList', leftList);

    let rightList = [];
    const rightPoint = 0.05;
    const rightDistance = formatLength(rightHeight4326, 4326);
    if (rightDistance < rightPoint) {
        return;
    }
    for (l = 0; l <= rightDistance / rightPoint; l++) {
        const options = { units: 'kilometers' };
        const rightAlong = along(rightLine4326, l * rightPoint, options);
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

    const dragFeature4326 = {
        coordinates: dragProjection[0].getGeometry().getCoordinates(),
        type: 'Polygon',
    };

    cutPolygon(toMercator(dragFeature4326), splitLines, 0.001, 'split');

    const dragLayer = new VectorLayer({
        source: vectorSource,
    });

    map.addLayer(dragLayer);
});
