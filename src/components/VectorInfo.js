import React, { useEffect } from 'react';
import Map from 'ol/Map';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { OSM } from 'ol/source';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import GeoJSON from 'ol/format/GeoJSON';
import { Select, Translate, defaults as defaultInteractions, Modify, } from 'ol/interaction';
import 'ol/ol.css';

const VectorInfo = () => {
    useEffect(() => {
        const style = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.6)',
            }),
            stroke: new Stroke({
                color: '#319FD3',
                width: 1,
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: '#000',
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 3,
                }),
            }),
        });

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const vectorSource = new VectorSource({
            format: new GeoJSON(),
            url: function (extent) {
                return (
                    'http://192.168.1.59:8080/geoserver/MyFirstProject/ows?service=WFS&' +
                    'version=1.0.0&request=GetFeature&typeName=MyFirstProject%' +
                    '3ALand&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857&' +
                    'bbox=' +
                    extent.join(',') +
                    ',EPSG:3857'
                );
            },
            strategy: bboxStrategy,
        });

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2,
                }),
            }),
        });

        const select = new Select();

        const translate = new Translate({
            features: select.getFeatures(),
        });

        const modify = new Modify({
            features: select.getFeatures(),
        });

        const map = new Map({
            interactions: defaultInteractions().extend([select, translate]),
            layers: [osmLayer, vectorLayer],
            target: 'map',
            view: new View({
                center: [1851716.2622, 4813000.4846],
                zoom: 13,
            }),
        });

        const highlightStyle = new Style({
            stroke: new Stroke({
                color: '#f00',
                width: 1,
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.1)',
            }),
            text: new Text({
                font: '12px Calibri,sans-serif',
                fill: new Fill({
                    color: '#000',
                }),
                stroke: new Stroke({
                    color: '#f00',
                    width: 3,
                }),
            }),
        });

        const labelStyle = new Style({
            text: new Text({
              font: '20px Calibri,sans-serif',
              fill: new Fill({
                color: 'rgba(255, 255, 255, 1)',
              }),
              backgroundFill: new Fill({
                color: 'rgba(100, 0, 0, 0.7)',
              }),
              padding: [3, 3, 3, 3],
              textBaseline: 'bottom',
              offsetY: -15,
            }),
          });

        const featureOverlay = new VectorLayer({
            source: new VectorSource(),
            map: map,
            style: function (feature) {
                highlightStyle.getText().setText(feature.get('name'));
                return highlightStyle;
            },
        });

        let highlight;
        const displayFeatureInfo = function (pixel) {
            const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
                return feature;
            });

            const info = document.getElementById('info');
            if (feature) {
                info.innerHTML = feature.getId() + ': ' + feature.get('name');
            } else {
                info.innerHTML = '&nbsp;';
            }

            if (feature !== highlight) {
                if (highlight) {
                    featureOverlay.getSource().removeFeature(highlight);
                }
                if (feature) {
                    featureOverlay.getSource().addFeature(feature);
                }
                highlight = feature;
            }
        };

        map.on('pointermove', function (evt) {
            if (evt.dragging) {
                return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            displayFeatureInfo(pixel);
        });

        map.on('click', function (evt) {
            displayFeatureInfo(evt.pixel)
            // console.log(vectorLayer.getSource());
            // console.log(vectorSource.getFeaturesAtCoordinate(evt.coordinate).[0].values_.geometry.flatCoordinates);
        });
    }, []);

    return (
        <>
            <div id="info" >인포인포인포인포인포인포인포인포인포인포</div>
            <div id='map' className='map' style={{ width: '98vw', height: '87vh' }}>
            </div>
        </>
    );
};

export default VectorInfo;