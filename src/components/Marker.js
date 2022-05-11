import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Icon, Style } from 'ol/style';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Polygon from 'ol/geom/Polygon';
import { transformRotate, polygon as turfPolygon } from '@turf/turf';

const Marker = () => {
    const iconFeature = new Feature({
        // geometry: new Polygon([
        //     [0, 0],
        //     [0, 1],
        //     [1, 1],
        //     [1, 0],
        //     [0, 0],
        // ]),
        geometry: new Point([0, 0]),
        name: 'Null Island',
    });

    console.log('iconFeature iconFeature', iconFeature);

    const iconStyle = new Style({
        image: new Icon({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'https://cdn1.iconfinder.com/data/icons/ios-11-glyphs/30/car-256.png',
        }),
    });

    iconFeature.setStyle(iconStyle);
    const vectorSource = new VectorSource({
        features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    const rasterLayer = new TileLayer({
        source: new TileJSON({
            url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
            crossOrigin: '',
        }),
    });

    const map = new Map({
        layers: [rasterLayer, vectorLayer],
        target: 'map2',
        view: new View({
            center: [0, 0],
            zoom: 3,
        }),
    });

    return (
        <>
            <div id='map2' style={{ width: '98vw', height: '88vh' }}></div>
        </>
    );
};

export default Marker;
