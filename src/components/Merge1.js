import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import {
    Circle as CircleStyle,
    Fill,
    RegularShape,
    Stroke,
    Style,
    Text,
} from 'ol/style';
import { getArea, getLength } from 'ol/sphere';
import React, { useEffect } from 'react';
import { Feature, View } from 'ol';
import { Attribution, defaults as defaultControls } from 'ol/control';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import 'ol/ol.css';
import { Overlay } from 'ol';
import { LineString, Point, Polygon } from 'ol/geom';
import { Select, Translate, defaults as defaultInteractions, Draw, Modify } from 'ol/interaction';
import OL3Parser, { io } from 'jsts';


const Merge = () => {
    const clearPrevious = document.getElementById('clear');
    const showSegments = document.getElementById('segments');

    let draw;

    useEffect(() => {

        const style = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
            }),
            stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        });

        const regularStyle = new Style({
            fill: new Fill({
                color: 'rgba(0, 0, 0, 0.2)',
            }),
            stroke: new Stroke({
                color: '#0e97fa',
                width: 3,
            })
        });

        const highlightStyle = new Style({
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, 0.6)',
                width: 3
            }),
            fill: new Fill({
                color: 'rgba(255, 0, 0, 0.2)'
            }),
            zIndex: 1
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

        const segmentStyle = new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
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
        });

        const labelStyle = new Style({
            text: new Text({
                font: '14px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                padding: [3, 3, 3, 3],
                textBaseline: 'bottom',
                offsetY: -15,
            }),
            image: new RegularShape({
                radius: 8,
                points: 3,
                angle: Math.PI,
                displacement: [0, 10],
                fill: new Fill({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
            }),
        });

        const tipStyle = new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(255, 255, 255, 1)',
                }),
                backgroundFill: new Fill({
                    color: 'rgba(0, 0, 0, 0.4)',
                }),
                padding: [2, 2, 2, 2],
                textAlign: 'left',
                offsetX: 15,
            }),
        });

        const segmentStyles = [segmentStyle];

        const formatLength = function (line) {
            const length = getLength(line);
            let output;
            if (length > 100) {
                output = Math.round((length / 1000) * 100) / 100 + ' km';
            } else {
                output = Math.round(length * 100) / 100 + ' m';
            }
            return output;
        };

        const formatArea = function (polygon) {
            const area = getArea(polygon);
            let output;
            if (area > 10000) {
                output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
            } else {
                output = Math.round(area * 100) / 100 + ' m\xB2';
            }
            return output;
        };

        let tipPoint;

        function styleFunction(feature, segments, drawType, tip) {
            const styles = [style];
            const geometry = feature.getGeometry();
            const type = geometry.getType();
            let point, label, line;
            if (!drawType || drawType === type) {
                if (type === 'Polygon') {
                    point = geometry.getInteriorPoint();
                    label = formatArea(geometry);
                    line = new LineString(geometry.getCoordinates()[0]);
                } else if (type === 'LineString') {
                    point = new Point(geometry.getLastCoordinate());
                    label = formatLength(geometry);
                    line = geometry;
                }
            }
            if (segments && line) {
                let count = 0;
                line.forEachSegment(function (a, b) {
                    const segment = new LineString([a, b]);
                    const label = formatLength(segment);
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
            if (label) {
                labelStyle.setGeometry(point);
                labelStyle.getText().setText(label);
                styles.push(labelStyle);
            }
            if (
                tip &&
                type === 'Point' &&
                !modify.getOverlay().getSource().getFeatures().length
            ) {
                tipPoint = geometry;
                tipStyle.getText().setText(tip);
                styles.push(tipStyle);
            }
            return styles;
        }

        const overlay = new Overlay({
            element: document.getElementById("popupContainer"),
            offset: [0, -15],
            positioning: 'bottom-center',
            className: 'ol-tooltip-measure ol-tooltip ol-tooltip-static'
        });

        const attribution = new Attribution({
            collapsible: true,
        });

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const select = new Select();

        const translate = new Translate({
            features: select.getFeatures(),
        });

        const map = new Map({
            interactions: defaultInteractions().extend([select, translate]),
            controls: defaultControls({ attribution: false }).extend([attribution]),
            layers: [osmLayer],
            target: 'map',
            view: new View({
                center: [1851716.2622, 4813000.4846],
                zoom: 14,
            })
        });

        const source = new VectorSource({
            projection: map.getView().projection
        });

        const vectorLayer = new VectorLayer({
            source: source,
            style: regularStyle,
        });

        const modify = new Modify({ source: source, style: modifyStyle });
        
        function addInteraction() {
            const idleTip = 'Click to start measuring';
            let tip = idleTip;
            const drawType = 'Polygon';
            draw = new Draw({
                source: source,
                type: drawType,
                stopClick: true,
                style: function (feature) {
                    return styleFunction(feature, showSegments.checked, drawType, tip);
                },
            });
            draw.on('drawstart', function () {
                if (clearPrevious.checked) {
                    source.clear();
                }
                modify.setActive(false);
            });
            draw.on('drawend', function () {
                modifyStyle.setGeometry(tipPoint);
                modify.setActive(true);
                map.once('pointermove', function () {
                    modifyStyle.setGeometry();
                });
            });
            modify.setActive(true);
            map.addInteraction(draw);
        }
        addInteraction();

        showSegments.onchange = function () {
            vectorLayer.changed();
            draw.getOverlay().changed();
        };

        map.addLayer(vectorLayer);
        map.addInteraction(modify);
        map.addOverlay(overlay);

        const drawPolygon = () => {
            removeInteractions();

            map.addInteraction(draw);
        }

        const mergePolygon = (e) => {
            /*
                This function is applicable to merge only two polygons
                This function will merge or perform union on two adjacent polygons. For the merge function to work, the polygons should atleast intersect each other.
            */

            //Create jsts parser to read openlayers geometry
            const parser = new io.OL3Parser();

            //Parse Polygons geometry to jsts type
            const a = parser.read(vectorLayer.getSource().getFeatures()[0].getGeometry());
            const b = parser.read(vectorLayer.getSource().getFeatures()[1].getGeometry());

            //Perform union of Polygons. The union function below will merge two polygon together
            const union = a.union(b);
            const merged_polygon = new Feature({
                geometry: new Polygon(parser.write(union).getCoordinates())
            });
            vectorLayer.getSource().clear();
            vectorLayer.getSource().addFeature(merged_polygon);
            vectorLayer.setStyle(highlightStyle);
        };

        //Remove map interactions except default interactions
        const removeInteractions = () => {
            map.getInteractions().getArray().forEach((interaction, i) => {
                if (i > 7) {
                    map.removeInteraction(interaction);
                }
            });
        }

        //Drag feature
        const moveFeature = () => {
            removeInteractions();
            map.addInteraction(new Translate());
        }


        //Clear vector features and overlays and remove any interaction
        const clearGraphics = () => {
            removeInteractions();
            map.getOverlays().clear();
            vectorLayer.getSource().clear();
            vectorLayer.setStyle(regularStyle);
        };

        document.getElementById("btn1").onclick = drawPolygon;

        document.getElementById("btn2").onclick = mergePolygon;

        document.getElementById("btn3").onclick = moveFeature;

        document.getElementById("btn4").onclick = clearGraphics;
    }, []);

    return (
        <>
            <div class="toolbar" style={{ marginBottom: 20 }}>
                <button id="btn1" style={{ marginLeft: 10 }}>Draw Polygon</button>
                <button id="btn2" style={{ marginLeft: 10 }}>Merge Polygons</button>
                <button id="btn3" style={{ marginLeft: 10 }}>Move Feature</button>
                <button id="btn4" style={{ marginLeft: 10 }}>Clear Graphics</button>
            </div>
            <div id="map" class="map" style={{ width: '98vw', height: '85vh', margin: 10, border: '1px solid' }}>
            </div>
        </>
    );
};

export default Merge;