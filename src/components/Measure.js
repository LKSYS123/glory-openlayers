/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import {
    Circle as CircleStyle,
    Fill,
    RegularShape,
    Stroke,
    Style,
    Text,
} from 'ol/style';
import { Draw, Modify } from 'ol/interaction';
import { LineString, Point } from 'ol/geom';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { getArea, getLength } from 'ol/sphere';
import { fromLonLat } from 'ol/proj';
import {
    Attribution,
    defaults as defaultControls,
    FullScreen,
    MousePosition,
    OverviewMap,
    ZoomSlider,
} from 'ol/control';
import 'ol/ol.css';
import { createStringXY } from 'ol/coordinate';

const Measure = () => {
    const typeSelect = document.getElementById('type');
    const showSegments = document.getElementById('segments');
    const clearPrevious = document.getElementById('clear');

    useEffect(() => {
        // 도형
        const style = new Style({
            fill: new Fill({
                color: 'rgba(25, 255, 255, 0.2)',
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

        // 마지막 지점 글씨
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

        // 그릴때 커서 옆부분
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

        // 각 지점 글씨
        const segmentStyle = new Style({
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: 'rgba(25, 255, 255, 1)',
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

        const raster = new TileLayer({
            source: new OSM(),
        });

        const source = new VectorSource();

        const modify = new Modify({ source: source, style: modifyStyle });

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
                    const segmentPoint = new Point(
                        segment.getCoordinateAt(0.5)
                    );
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

        const vector = new VectorLayer({
            source: source,
            style: function (feature) {
                return styleFunction(feature, showSegments.checked);
            },
        });

        const map = new Map({
            controls: defaultControls({
                zoom: true,
                attribution: false,
            }).extend([
                new FullScreen({}),
                new ZoomSlider({}),
                new OverviewMap({
                    layers: [raster],
                }),
                new Attribution({
                    collapsible: true,
                }),
            ]),
            layers: [raster, vector],
            target: 'map',
            view: new View({
                center: fromLonLat([127.0, 37.55]),
                zoom: 14,
            }),
        });

        map.addInteraction(modify);

        let draw; // global so we can remove it later

        function addDraw() {
            const drawType = typeSelect.value;
            const activeTip =
                'Click to continue drawing the ' +
                (drawType === 'Polygon' ? 'polygon' : 'line');
            const idleTip = 'Click to start measuring';
            let tip = idleTip;
            draw = new Draw({
                source: source,
                type: drawType,
                style: function (feature) {
                    return styleFunction(
                        feature,
                        showSegments.checked,
                        drawType,
                        tip
                    );
                },
            });
            draw.on('drawstart', function () {
                if (clearPrevious.checked) {
                    source.clear();
                }
                modify.setActive(false);
                tip = activeTip;
            });
            draw.on('drawend', function () {
                modifyStyle.setGeometry(tipPoint);
                modify.setActive(true);
                map.once('pointermove', function () {
                    modifyStyle.setGeometry();
                });
                tip = idleTip;
            });
            modify.setActive(true);
            map.addInteraction(draw);
        }

        typeSelect.onchange = function () {
            map.removeInteraction(draw);
            addDraw();
        };

        addDraw();

        showSegments.onchange = function () {
            vector.changed();
            draw.getOverlay().changed();
        };

        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(6),
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
            <div
                id='map'
                className='map'
                style={{ width: '98vw', height: '89vh' }}
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

export default Measure;
