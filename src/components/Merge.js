import { Tile as TileLayer, Vector as VectorLayers } from 'ol/layer';
import { OSM } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import React, { useEffect } from 'react';
import { Feature, View } from 'ol';
import { Attribution, defaults as defaultControls } from 'ol/control';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import 'ol/ol.css';
import { Polygon } from 'ol/geom';
import { Translate, defaults as defaultInteractions, Draw } from 'ol/interaction';
import { io } from 'jsts';
import { fromLonLat } from 'ol/proj';


const Merge = () => {

    useEffect(() => {
        let regularStyle = new Style({        
            stroke: new Stroke({
                color: '#0e97fa',
                width:3
            }),
            fill: new Fill({
                color: [0,0,0,0.2]
            }),
        });
        
        let highlightStyle = new Style({
            stroke: new Stroke({
                color: [255,0,0,0.6],
                width: 3
            }),
            fill: new Fill({
                color: [255,0,0,0.2]
            }),
            zIndex: 1
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
        
        class OLMap {
            //Constructor accepts html div id, zoom level and center coordinaes
            constructor(map_div, zoom, center) {
                this.map = new Map({
                    interactions: defaultInteractions().extend({
                        doubleClickZoom: false
                    }),
                    target: map_div,
                    layers: [
                        new TileLayer({
                            source: new OSM()
                        })
                    ],
                    view: new View({
                        center: fromLonLat(center),
                        zoom: zoom
                    })
                });
            }
        }
        
        
        /*
        Create Vector Layer
        */
        class VectorLayer{
            //Constructor accepts title of vector layer and map object
            constructor(title, map) {
                this.layer = new VectorLayers({
                    source: new VectorSource({
                        projection:'EPSG:3857'
                    }),
                    style: regularStyle
                });
            }
        }
        
        
        /*
        Create overlay
        */
        class Overlay {
            //Contrctor accepts map object, overlay html element, overlay offset, overlay positioning and overlay class
            constructor(map, element = document.getElementById("popup"), offset = [0, -15], positioning = 'bottom-center',   className = 'ol-tooltip-measure ol-tooltip ol-tooltip-static') {
                this.map = map;
                this.overlay = new Overlay({
                    element: element,
                    offset: offset,
                    positioning: positioning,
                    className: className
                });
                this.overlay.setPosition([0,0]);
                this.overlay.element.style.display = 'block';      
                this.map.addOverlay(this.overlay);          
            }
        }
        
        
        class Draws {
            //Constructor accepts geometry type, map object and vector layer
            constructor(type, map, vector_layer) {
                this.type = type;
                this.vector_layer = vector_layer
                this.map = map;        
                this.interaction = new Draw({
                    type: type,
                    stopClick: true
                });                
                this.interaction.on('drawend', this.onDrawEnd);
                this.map.addInteraction(this.interaction);
            }
        
            onDrawEnd = (e) => {
                if(this.vector_layer.getSource().getFeatures().length <= 1) {
                    this.vector_layer.getSource().addFeature(e.feature);        
                } else {
                    alert("Only two features are allowed to merge. At present, merge functionality only supports merging of two adjacent features.")
                    this.map.removeInteraction(this.interaction);
                }
        
            }
        }
        
        
        //Create map and vector layer
        let map = new OLMap('map', 9, [-96.6345990807462, 32.81890764151014]).map;
        let vector_layer = new VectorLayers('Temp Layer', map).layer
        // map.addLayer(vector_layer);
        
        //Add draw Polygon Interaction to map
        let drawPolygon = (e) => {  
            removeInteractions();    
        
            //Create Polygon Draw interaction    
            new Draw({
                type: "Polygon",
                map, 
                features: vector_layer
            });
        }
        
        let mergePolygon = (e) => {
            /*
                This function is applicable to merge only two polygons
                This function will merge or perform union on two adjacent polygons. For the merge function to work, the polygons should atleast intersect each other.
            */
            
            //Create jsts parser to read openlayers geometry
            let parser = new io.OL3Parser();       
            
            //Parse Polygons geometry to jsts type
            let a = parser.read(vector_layer.getSource().getFeatures()[0].getGeometry());
            let b = parser.read(vector_layer.getSource().getFeatures()[1].getGeometry());
            
            //Perform union of Polygons. The union function below will merge two polygon together
            let union = a.union(b);    
            let merged_polygon = new Feature({    
                geometry: new Polygon(parser.write(union).getCoordinates())
            });     
            vector_layer.getSource().clear();
            vector_layer.getSource().addFeature(merged_polygon);
            vector_layer.setStyle(highlightStyle);
        };
        
        
        //Remove map interactions except default interactions
        let removeInteractions = () => {  
            map.getInteractions().getArray().forEach((interaction, i) => {
                if(i > 7) {
                    map.removeInteraction(interaction);
                }
            });
        }
        
        //Drag feature
        let dragFeature = () => {
            removeInteractions();
            map.addInteraction(new Translate());
        } 
        
        
        //Clear vector features and overlays and remove any interaction
        let clearGraphics = () => {
            removeInteractions();
            map.getOverlays().clear();
            vector_layer.getSource().clear();
            vector_layer.setStyle(regularStyle);
        };
        
        //Bind methods to click events of buttons
        document.getElementById("btn1").onclick = drawPolygon;
        
        document.getElementById("btn2").onclick = mergePolygon;
        
        document.getElementById("btn3").onclick = dragFeature;
        
        document.getElementById("btn4").onclick = clearGraphics;
    }, []);

    return (
        <>
            <div className="toolbar" style={{ marginBottom: 20 }}>
                <button id="btn1" style={{ marginLeft: 10 }}>Draw Polygon</button>
                <button id="btn2" style={{ marginLeft: 10 }}>Merge Polygons</button>
                <button id="btn3" style={{ marginLeft: 10 }}>Move Feature</button>
                <button id="btn4" style={{ marginLeft: 10 }}>Clear Graphics</button>
            </div>
            <div id="map" className="map" style={{ width: '98vw', height: '85vh', margin: 10, border: '1px solid' }}>
            </div>
        </>
    );
};

export default Merge;