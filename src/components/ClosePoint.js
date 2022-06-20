import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { Fill, Stroke, Style } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { defaults as defaultControls, MousePosition } from 'ol/control';
import 'ol/ol.css';
import { createStringXY } from 'ol/coordinate';
import {
    Select,
    Translate,
    defaults as defaultInteractions,
} from 'ol/interaction';

import { Circle, LineString } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON';

import {
    nearestPointOnLine,
    lineString as turfLineString,
    point as turfPoint,
} from '@turf/turf';

const ClosePoint = () => {
    const formatGeoJSON = new GeoJSON();

    const vectorLayer = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
            stroke: new Stroke({
                color: 'black',
                width: 3,
            }),
        }),
    });

    const vectorLayer1 = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
            stroke: new Stroke({
                color: 'black',
                width: 20,
            }),
        }),
    });

    const vectorLayer2 = new VectorLayer({
        source: new VectorSource({}),
        style: new Style({
            stroke: new Stroke({
                color: 'blue',
                width: 20,
            }),
        }),
    });

    const lineFeature = new Feature({
        geometry: new LineString([
            [-77.031669, 38.878605],
            [-77.029609, 38.881946],
            [-77.020339, 38.884084],
            [-77.025661, 38.885821],
            [-77.021884, 38.889563],
            [-77.019824, 38.892368],
        ]),
    });

    const pointFeature = new Feature({
        geometry: new Circle([-77.037076, 38.884017]),
    });

    const turfLine = turfLineString([
        [-77.031669, 38.878605],
        [-77.029609, 38.881946],
        // [-77.020339, 38.884084],
        // [-77.025661, 38.885821],
        // [-77.021884, 38.889563],
        // [-77.019824, 38.892368],
    ]);

    const turfPoint0 = turfPoint([-77.037076, 38.884017]);

    const turfLineFeature = new Feature({
        geometry: new LineString(turfLine.geometry.coordinates),
    });

    const snapped0 = nearestPointOnLine(turfLine, turfPoint0);

    console.log(snapped0);

    const lineline = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: lineFeature.getGeometry().getCoordinates(),
        },
    };

    const pointpoint = {
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: pointFeature.getGeometry().getCenter(),
        },
    };

    const snapped = nearestPointOnLine(lineline, pointpoint);
    const snappedFeature = formatGeoJSON.readFeature(snapped);
    const snappedFeature1 = formatGeoJSON.readFeature(snapped0);
    console.log(snappedFeature1.getGeometry().getCoordinates());

    const snappedPoint = new Feature({
        geometry: new Circle(snappedFeature.getGeometry().getCoordinates()),
    });

    const snappedPoint1 = new Feature({
        geometry: new Circle(snappedFeature1.getGeometry().getCoordinates()),
    });

    const features = {
        type: 'features',
        features: [turfLineFeature],
    };

    const features1 = {
        type: 'features',
        features: [pointFeature],
    };

    const features2 = {
        type: 'features',
        features: [snappedPoint1],
    };

    vectorLayer.getSource().addFeatures(features.features);
    vectorLayer1.getSource().addFeatures(features1.features);
    vectorLayer2.getSource().addFeatures(features2.features);

    const select = new Select();

    const translate = new Translate({
        features: select.getFeatures(),
    });

    const map = new Map({
        interactions: defaultInteractions().extend([select, translate]),
        controls: defaultControls({}).extend([]),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            vectorLayer,
            vectorLayer1,
            vectorLayer2,
        ],
        target: 'map1',
        view: new View({
            center: [-77.03, 38.88],
            zoom: 15,
            projection: 'EPSG:4326',
        }),
    });

    const mousePosition = new MousePosition({
        coordinateFormat: createStringXY(5),
        projection: 'EPSG:4326',
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

    console.log('mapppppppp', map);

    return (
        <>
            <form style={{ position: 'relative' }}>
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
                id='map1'
                className='map'
                style={{ width: '98vw', height: '80vh' }}
            >
                <div style={{ marginBottom: 10 }}>
                    <div
                        id='mouse-position'
                        style={{
                            position: 'relative',
                            zIndex: 100,
                            width: '100%',
                            height: 30,
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

export default ClosePoint;
