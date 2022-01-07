import { useEffect } from 'react';
import Circle from 'ol/geom/Circle';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Attribution, defaults as defaultControls, FullScreen, MousePosition, OverviewMap, ZoomSlider } from 'ol/control';
import 'ol/ol.css';
import { createStringXY } from 'ol/coordinate';
import { Select, Translate, defaults as defaultInteractions } from 'ol/interaction';

const GeoJson = () => {
    useEffect(() => {
        const image = new CircleStyle({
            radius: 5,
            fill: null,
            stroke: new Stroke({ color: 'red', width: 1 }),
        });

        const styles = {
            'Point': new Style({
                image: image,
            }),
            'LineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiLineString': new Style({
                stroke: new Stroke({
                    color: 'green',
                    width: 1,
                }),
            }),
            'MultiPoint': new Style({
                image: image,
                width: 20,
            }),
            'MultiPolygon': new Style({
                // 테두리
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                // 내부 색상
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
            }),
            'Polygon': new Style({
                // 테두리
                stroke: new Stroke({
                    color: 'blue',
                    lineDash: [50],
                    width: 2,
                }),
                // 내부 색상
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.1)',
                }),
                // 주석
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
                    text: '텍스트',
                }),
            }),
            'GeometryCollection': new Style({
                stroke: new Stroke({
                    color: 'magenta',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'magenta',
                }),
                image: new CircleStyle({
                    radius: 10,
                    fill: null,
                    stroke: new Stroke({
                        color: 'magenta',
                    }),
                }),
            }),
            'Circle': new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2,
                }),
                fill: new Fill({
                    color: 'rgba(255,0,0,0.2)',
                }),
            }),
        };
        // const styleFunction = function (feature) {
        //     const styles = [styles];
        //     const geometry = feature.getGeometry();
        //     const type = geometry.getType();
        //     let point;

        //     point = geometry.getInteriorPoint;
        //     labelStyle.setGeometry(point);
        //     labelStyle.setText('가나다라마바사');
        //     styles.push(labelStyle);

        //     return styles[type];
        //     // return styles;
        // };

        const styleFunction = function (feature) {
            return styles[feature.getGeometry().getType()];
        };

        const geojsonObject4 = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:3857',
                },
            },
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            [
                                [4.22249471, 51.27002804], [4.2244457, 51.26941461], [4.22440914, 51.26925315], [4.22345456, 51.26947193]
                            ],
                        ],
                    },
                },
            ]
        };

        const geojsonObject5 = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:3857',
                },
            },
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            [
                                [4.22219471, 51.27002804], [4.2240457, 51.26941461], [4.22410914, 51.26925315], [4.22345456, 51.26947193]
                            ],
                        ],
                    },
                },
            ],
        };

        const geojsonObject = {
            "type": "FeatureCollection",
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326',
                },
            },
            "features": [
                {
                    "type": "Feature", "id": "Block_ICO.1", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.22569524, 51.27428872], [4.22354358, 51.27500112], [4.22358116, 51.27503051], [4.22362305, 51.27505383], [4.22366878, 51.27507146], [4.22374144, 51.27509184], [4.2238022, 51.2750985], [4.22383916, 51.27509654], [4.22387925, 51.27509262], [4.22396569, 51.27506637], [4.22434027, 51.27494097], [4.2258267, 51.27445271], [4.22569524, 51.27428872]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.2", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.2260082, 51.27438658], [4.2297617, 51.27313524], [4.22963454, 51.27298241], [4.22828122, 51.27342699], [4.22802378, 51.27351134], [4.22794501, 51.2735376], [4.22788064, 51.27355915], [4.22780845, 51.27358296], [4.22775709, 51.2736003], [4.22770384, 51.27361774], [4.22762649, 51.27364419], [4.22754302, 51.27367211], [4.22749244, 51.27368886], [4.22744186, 51.2737061], [4.22735839, 51.27373373], [4.22726741, 51.27376351], [4.22714855, 51.27380495], [4.22650759, 51.27401519], [4.22638748, 51.27405506], [4.22628146, 51.27409121], [4.22587478, 51.27422631], [4.22585786, 51.27425746], [4.22595871, 51.27437796], [4.2260082, 51.27438658]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A2", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.3", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22959282, 51.2729325], [4.22945871, 51.27277263], [4.22833916, 51.27314327], [4.22750919, 51.27341935], [4.22719631, 51.2735232], [4.22685994, 51.27363508], [4.22655927, 51.27373461], [4.22594384, 51.27393995], [4.22569986, 51.27401989], [4.22568733, 51.27405379], [4.22578614, 51.27417125], [4.22583641, 51.2741786], [4.22892829, 51.27315131], [4.22959282, 51.2729325]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.4", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22566024, 51.27397297], [4.22941922, 51.27272426], [4.22928705, 51.27256633], [4.22552619, 51.27381289], [4.22551084, 51.273846], [4.22561263, 51.27396474], [4.22566024, 51.27397297]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "SA4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.5", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22548673, 51.27376665], [4.22924383, 51.27251793], [4.22911229, 51.27236275], [4.22535456, 51.273605], [4.22533577, 51.27363674], [4.22543818, 51.27375881], [4.22548673, 51.27376665]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.6", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22531416, 51.27355817], [4.22906938, 51.27231219], [4.22893439, 51.27215172], [4.22517885, 51.27340064], [4.22516413, 51.27343375], [4.22526404, 51.27355053], [4.22531416, 51.27355817]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A6", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.7", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22513783, 51.27335244], [4.22889869, 51.27211135], [4.22876401, 51.27194676], [4.22500315, 51.27319608], [4.22499125, 51.27322939], [4.22508584, 51.27334303], [4.22513783, 51.27335244]]]] },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.8", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22496306, 51.27314592], [4.2287233, 51.27189895], [4.22859019, 51.27174161], [4.22483058, 51.27298799], [4.22481523, 51.27301895], [4.22491514, 51.27313808], [4.22496306, 51.27314592]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A8", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.9", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22477702, 51.27292431], [4.22853413, 51.27167616], [4.22840321, 51.27151784], [4.22464266, 51.27276599], [4.22462732, 51.27279695], [4.2247291, 51.27291608], [4.22477702, 51.27292431]]]] },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A9", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.10", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22460383, 51.27271779], [4.2283614, 51.27146846], [4.22822751, 51.2713118], [4.22446821, 51.27255947], [4.2244538, 51.27259259], [4.2245534, 51.27270858], [4.22460383, 51.27271779]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.11", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.22442859, 51.27251108], [4.22818632, 51.27126331], [4.22805416, 51.27110341], [4.22429423, 51.27235256], [4.2242792, 51.2723845], [4.22438036, 51.27250245], [4.22442859, 51.27251108]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q2", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.12", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22425461, 51.27230524], [4.22801414, 51.27105492], [4.22787947, 51.27089796], [4.22412143, 51.27214496], [4.22410545, 51.27217729], [4.22420787, 51.27229721], [4.22425461, 51.27230524]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.13", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22404125, 51.27211517], [4.22783969, 51.27084976], [4.22770596, 51.27069006], [4.22390563, 51.27195411], [4.22404125, 51.27211517]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.14", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.2238668, 51.27190454], [4.22766556, 51.27064303], [4.22753213, 51.27048412], [4.2237315, 51.27174641], [4.2238668, 51.27190454]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.15", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22369329, 51.2716984], [4.22748985, 51.27043533], [4.22735706, 51.27027778], [4.22355924, 51.27154008], [4.22369329, 51.2716984]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q6", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.16", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22352228, 51.27149384], [4.22731697, 51.27022919], [4.22717509, 51.27006557], [4.22338573, 51.27133277], [4.22352228, 51.27149384]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.17", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22333374, 51.27127046], [4.22713109, 51.27000884], [4.22699626, 51.26985031], [4.22319906, 51.27111174], [4.22333374, 51.27127046]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q8", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.18", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22315976, 51.27106422], [4.22695476, 51.26980015], [4.22682165, 51.269643], [4.2230232, 51.27090433], [4.22315976, 51.27106422]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q9", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.19", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22298499, 51.27085691], [4.22678062, 51.2695942], [4.22664814, 51.26943489], [4.22285126, 51.27069839], [4.22298499, 51.27085691]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.20", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22285282, 51.27063588], [4.22660742, 51.26938786], [4.22647525, 51.26922797], [4.22271784, 51.27047657], [4.22270374, 51.27050949], [4.22280271, 51.27062746], [4.22285282, 51.27063588]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W2", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.21", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22263672, 51.27044209], [4.22643328, 51.26918133], [4.22638568, 51.26912058], [4.22630237, 51.26902104], [4.22250142, 51.27028376], [4.22263672, 51.27044209]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.22", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22247135, 51.27023791], [4.22432171, 51.26962076], [4.22418579, 51.26945694], [4.2223348, 51.27007566], [4.22247135, 51.27023791]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.23", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22229471, 51.27002804], [4.2241457, 51.26941461], [4.22400914, 51.26925315], [4.22335456, 51.26947193], [4.2231466, 51.2695413], [4.2229662, 51.26960126], [4.2228237, 51.26964829], [4.22250455, 51.26975489], [4.22216035, 51.2698703], [4.22229471, 51.27002804]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.24", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22211979, 51.2698219], [4.22397438, 51.26920533], [4.22384002, 51.26904661], [4.22371349, 51.26908776], [4.22357693, 51.26913342], [4.22342535, 51.26918417], [4.22326937, 51.26923551], [4.22311841, 51.26928607], [4.22290857, 51.26935622], [4.22278361, 51.26939796], [4.22267242, 51.26943421], [4.22239086, 51.26952807], [4.22206388, 51.26963741], [4.22198464, 51.26966308], [4.22211979, 51.2698219]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W6", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.25", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22196679, 51.26958744], [4.22374293, 51.26899723], [4.22375984, 51.26896411], [4.22365899, 51.26884654], [4.22361076, 51.26883635], [4.22183149, 51.26942833], [4.22181646, 51.26946125], [4.22191824, 51.26957961], [4.22196679, 51.26958744]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.26", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22175695, 51.26939306], [4.22361295, 51.26877599], [4.22347765, 51.26861707], [4.22162447, 51.26923414], [4.22175695, 51.26939306]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W8", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.27", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22158469, 51.26918809], [4.22343975, 51.26856945], [4.22330633, 51.26841034], [4.22144939, 51.2690278], [4.22158469, 51.26918809]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W9", "tml_bl_rmk": "" }
                }, { "type": "Feature", "id": "Block_ICO.28", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22127682, 51.26882185], [4.22141087, 51.26898136], [4.22326749, 51.26836331], [4.22312906, 51.26820438], [4.22127682, 51.26882185]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.29", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22123767, 51.26877345], [4.22308835, 51.26815755], [4.22294365, 51.26800196], [4.22110205, 51.26861394], [4.22123767, 51.26877345]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.30", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22106259, 51.26856651], [4.2229117, 51.26795277], [4.22277922, 51.26779287], [4.22092854, 51.26840857], [4.22106259, 51.26856651]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.31", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22087561, 51.26834449], [4.2227266, 51.26772977], [4.22259256, 51.26757143], [4.22074188, 51.26818577], [4.22087561, 51.26834449]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.32", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22070304, 51.26813834], [4.22255121, 51.26752342], [4.22241967, 51.26736469], [4.22056711, 51.26797883], [4.22067391, 51.26810464], [4.22068519, 51.26812208], [4.22070304, 51.26813834]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E5", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.33", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22052734, 51.26793024], [4.22237896, 51.26731629], [4.22224553, 51.26715795], [4.22039298, 51.26777249], [4.22052734, 51.26793024]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E6", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.34", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22035445, 51.2677235], [4.22220482, 51.26711072], [4.22206827, 51.26695258], [4.2202179, 51.26756712], [4.22035445, 51.2677235]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E7", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.35", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22018094, 51.26751754], [4.22174881, 51.26699471], [4.22203507, 51.26690104], [4.22203068, 51.26689477], [4.22202692, 51.26689673], [4.22198182, 51.26690535], [4.22191793, 51.26691711], [4.2218127, 51.26693788], [4.22171561, 51.26695748], [4.22159033, 51.26698138], [4.22152831, 51.26699353], [4.2214638, 51.26701039], [4.22139928, 51.26702606], [4.22108546, 51.26710092], [4.22099964, 51.26712248], [4.22097521, 51.26712875], [4.22094765, 51.26713737], [4.2209157, 51.26714756], [4.22087311, 51.26716128], [4.22084492, 51.26717069], [4.2207898, 51.26718911], [4.22073593, 51.26720674], [4.22070398, 51.26721772], [4.22067141, 51.26722712], [4.22064573, 51.26723575], [4.22062443, 51.26724162], [4.22058497, 51.26725025], [4.22054237, 51.26725965], [4.22040081, 51.26729257], [4.2201634, 51.26734509], [4.22017092, 51.26739408], [4.22017719, 51.26743994], [4.22018094, 51.26751754]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E8", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.36", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22008135, 51.26709387], [4.22005191, 51.26710798], [4.22003687, 51.26712444], [4.22002497, 51.26714835], [4.22002184, 51.26717029], [4.22002873, 51.26718832], [4.22004126, 51.26720126], [4.22005817, 51.26720988], [4.22007508, 51.2672138], [4.22009951, 51.26721458], [4.22015526, 51.26720831], [4.22023293, 51.26720165], [4.22038264, 51.26718675], [4.22047911, 51.26717892], [4.22056931, 51.26716873], [4.22060376, 51.26716481], [4.22065199, 51.2671507], [4.22087937, 51.26707623], [4.22098648, 51.26704409], [4.22108483, 51.26702019], [4.22110957, 51.26701391], [4.22114559, 51.26700529], [4.22120259, 51.26699099], [4.22125646, 51.26697864], [4.22132254, 51.26696296], [4.22137203, 51.26695003], [4.22141525, 51.26693925], [4.22149136, 51.26692103], [4.22155869, 51.26690417], [4.22163605, 51.26688595], [4.22174974, 51.26685832], [4.2218578, 51.26683128], [4.2220097, 51.26679522], [4.2221071, 51.26677307], [4.22223332, 51.26674819], [4.22234137, 51.26673074], [4.22243752, 51.26671644], [4.22257189, 51.26669527], [4.22266678, 51.26668019], [4.22273725, 51.26666882], [4.22282432, 51.26665589], [4.22284374, 51.26665275], [4.2228951, 51.26663472], [4.22300347, 51.26659906], [4.22310745, 51.26656496], [4.22313188, 51.26655869], [4.22316571, 51.26654673], [4.22323555, 51.26652302], [4.22333796, 51.2664901], [4.22362266, 51.26639584], [4.22367277, 51.26637742], [4.22374543, 51.2663539], [4.22389827, 51.26630373], [4.22421523, 51.26619791], [4.22439939, 51.26613716], [4.22446265, 51.26611482], [4.22453344, 51.26608582], [4.22461299, 51.26604819], [4.22467751, 51.26601135], [4.22471133, 51.26599018], [4.22474202, 51.26596824], [4.2247746, 51.26594158], [4.2247984, 51.26591768], [4.22481469, 51.26589416], [4.22477397, 51.2659067], [4.22477068, 51.26590896], [4.22472918, 51.26585849], [4.2246418, 51.2657562], [4.22454628, 51.26567036], [4.22450932, 51.26563078], [4.22008135, 51.26709387]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E9", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.37", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21832244, 51.26787105], [4.21956614, 51.26745954], [4.21953983, 51.26743014], [4.21951415, 51.26739761], [4.21949849, 51.26738154], [4.2194797, 51.26736743], [4.21946404, 51.26736195], [4.21944337, 51.26735685], [4.21942708, 51.2673643], [4.21941455, 51.26735097], [4.21935254, 51.26737057], [4.21928739, 51.26739644], [4.21926077, 51.2673643], [4.21818526, 51.26772056], [4.21832244, 51.26787105]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.38", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21846431, 51.26808818], [4.21990126, 51.26761082], [4.21979665, 51.26748344], [4.21977723, 51.26748266], [4.21975782, 51.26748344], [4.21972399, 51.26748344], [4.21968703, 51.26747992], [4.21833277, 51.26792828], [4.21846431, 51.26808818]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.39", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21864597, 51.26829276], [4.22012591, 51.26780046], [4.21999327, 51.26764223], [4.21851004, 51.26813403], [4.21864597, 51.26829276]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.40", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21803336, 51.26855574], [4.2181555, 51.26871877], [4.22030184, 51.26801058], [4.22016528, 51.2678493], [4.21803336, 51.26855574]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.41", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21824007, 51.2687513], [4.21837912, 51.26891042], [4.22047237, 51.26821477], [4.2203402, 51.26805604], [4.21865286, 51.26861413], [4.21824007, 51.2687513]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R5", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.42", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21838132, 51.26896911], [4.21851803, 51.26912754], [4.22064933, 51.26842288], [4.22051278, 51.26826239], [4.21838132, 51.26896911]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R6", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.43", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21856626, 51.2691922], [4.2186978, 51.26935054], [4.22083568, 51.26864509], [4.22070069, 51.2684848], [4.21871973, 51.26914126], [4.21856626, 51.2691922]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R7", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.44", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21887758, 51.26955629], [4.22100841, 51.26885016], [4.22087389, 51.26869193], [4.21873789, 51.26939835], [4.21887758, 51.26955629]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R8", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.45", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21905312, 51.26976547], [4.2211838, 51.26905729], [4.2210485, 51.26889719], [4.21891594, 51.26960361], [4.21905312, 51.26976547]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R9", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.46", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21922695, 51.26997024], [4.22135512, 51.26926245], [4.22122201, 51.26910393], [4.21909133, 51.26981093], [4.21922695, 51.26997024]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.47", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22009356, 51.26994614], [4.22153019, 51.26947017], [4.22139583, 51.26931105], [4.21996014, 51.2697882], [4.22009356, 51.26994614]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.48", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22026645, 51.27015306], [4.22170277, 51.26967631], [4.22156872, 51.26951759], [4.22013177, 51.26999454], [4.22026645, 51.27015306]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.49", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22043996, 51.270359], [4.22187753, 51.26988265], [4.22174317, 51.26972353], [4.22030591, 51.27020068], [4.22043996, 51.270359]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.50", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21991786, 51.27081772], [4.22206513, 51.27010427], [4.22193077, 51.26994594], [4.21978506, 51.27066057], [4.21991786, 51.27081772]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T5", "tml_bl_rmk": "" } }], "totalFeatures": 234, "numberMatched": 234, "numberReturned": 50, "timeStamp": "2021-12-20T05:16:19.423Z", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4326" } }
        }

        const geojsonObject3 = {
            "type": "FeatureCollection",
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326',
                },
            },
            "features": [
                {
                    "type": "Feature", "id": "Block_ICO.1", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.22569524, 51.27428872], [4.22354358, 51.27500112], [4.22358116, 51.27503051], [4.22362305, 51.27505383], [4.22366878, 51.27507146], [4.22374144, 51.27509184], [4.2238022, 51.2750985], [4.22383916, 51.27509654], [4.22387925, 51.27509262], [4.22396569, 51.27506637], [4.22434027, 51.27494097], [4.2258267, 51.27445271], [4.22569524, 51.27428872]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.2", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.2260082, 51.27438658], [4.2297617, 51.27313524], [4.22963454, 51.27298241], [4.22828122, 51.27342699], [4.22802378, 51.27351134], [4.22794501, 51.2735376], [4.22788064, 51.27355915], [4.22780845, 51.27358296], [4.22775709, 51.2736003], [4.22770384, 51.27361774], [4.22762649, 51.27364419], [4.22754302, 51.27367211], [4.22749244, 51.27368886], [4.22744186, 51.2737061], [4.22735839, 51.27373373], [4.22726741, 51.27376351], [4.22714855, 51.27380495], [4.22650759, 51.27401519], [4.22638748, 51.27405506], [4.22628146, 51.27409121], [4.22587478, 51.27422631], [4.22585786, 51.27425746], [4.22595871, 51.27437796], [4.2260082, 51.27438658]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A2", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.3", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22959282, 51.2729325], [4.22945871, 51.27277263], [4.22833916, 51.27314327], [4.22750919, 51.27341935], [4.22719631, 51.2735232], [4.22685994, 51.27363508], [4.22655927, 51.27373461], [4.22594384, 51.27393995], [4.22569986, 51.27401989], [4.22568733, 51.27405379], [4.22578614, 51.27417125], [4.22583641, 51.2741786], [4.22892829, 51.27315131], [4.22959282, 51.2729325]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.4", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22566024, 51.27397297], [4.22941922, 51.27272426], [4.22928705, 51.27256633], [4.22552619, 51.27381289], [4.22551084, 51.273846], [4.22561263, 51.27396474], [4.22566024, 51.27397297]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "SA4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.5", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22548673, 51.27376665], [4.22924383, 51.27251793], [4.22911229, 51.27236275], [4.22535456, 51.273605], [4.22533577, 51.27363674], [4.22543818, 51.27375881], [4.22548673, 51.27376665]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.6", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22531416, 51.27355817], [4.22906938, 51.27231219], [4.22893439, 51.27215172], [4.22517885, 51.27340064], [4.22516413, 51.27343375], [4.22526404, 51.27355053], [4.22531416, 51.27355817]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A6", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.7", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22513783, 51.27335244], [4.22889869, 51.27211135], [4.22876401, 51.27194676], [4.22500315, 51.27319608], [4.22499125, 51.27322939], [4.22508584, 51.27334303], [4.22513783, 51.27335244]]]] },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.8", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22496306, 51.27314592], [4.2287233, 51.27189895], [4.22859019, 51.27174161], [4.22483058, 51.27298799], [4.22481523, 51.27301895], [4.22491514, 51.27313808], [4.22496306, 51.27314592]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A8", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.9", "geometry":
                        { "type": "MultiPolygon", "coordinates": [[[[4.22477702, 51.27292431], [4.22853413, 51.27167616], [4.22840321, 51.27151784], [4.22464266, 51.27276599], [4.22462732, 51.27279695], [4.2247291, 51.27291608], [4.22477702, 51.27292431]]]] },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "A9", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.10", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22460383, 51.27271779], [4.2283614, 51.27146846], [4.22822751, 51.2713118], [4.22446821, 51.27255947], [4.2244538, 51.27259259], [4.2245534, 51.27270858], [4.22460383, 51.27271779]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.11", "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [[[[4.22442859, 51.27251108], [4.22818632, 51.27126331], [4.22805416, 51.27110341], [4.22429423, 51.27235256], [4.2242792, 51.2723845], [4.22438036, 51.27250245], [4.22442859, 51.27251108]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q2", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.12", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22425461, 51.27230524], [4.22801414, 51.27105492], [4.22787947, 51.27089796], [4.22412143, 51.27214496], [4.22410545, 51.27217729], [4.22420787, 51.27229721], [4.22425461, 51.27230524]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.13", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22404125, 51.27211517], [4.22783969, 51.27084976], [4.22770596, 51.27069006], [4.22390563, 51.27195411], [4.22404125, 51.27211517]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.14", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.2238668, 51.27190454], [4.22766556, 51.27064303], [4.22753213, 51.27048412], [4.2237315, 51.27174641], [4.2238668, 51.27190454]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.15", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22369329, 51.2716984], [4.22748985, 51.27043533], [4.22735706, 51.27027778], [4.22355924, 51.27154008], [4.22369329, 51.2716984]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q6", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.16", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22352228, 51.27149384], [4.22731697, 51.27022919], [4.22717509, 51.27006557], [4.22338573, 51.27133277], [4.22352228, 51.27149384]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.17", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22333374, 51.27127046], [4.22713109, 51.27000884], [4.22699626, 51.26985031], [4.22319906, 51.27111174], [4.22333374, 51.27127046]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q8", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.18", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22315976, 51.27106422], [4.22695476, 51.26980015], [4.22682165, 51.269643], [4.2230232, 51.27090433], [4.22315976, 51.27106422]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "Q9", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.19", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22298499, 51.27085691], [4.22678062, 51.2695942], [4.22664814, 51.26943489], [4.22285126, 51.27069839], [4.22298499, 51.27085691]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W1", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.20", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22285282, 51.27063588], [4.22660742, 51.26938786], [4.22647525, 51.26922797], [4.22271784, 51.27047657], [4.22270374, 51.27050949], [4.22280271, 51.27062746], [4.22285282, 51.27063588]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W2", "tml_bl_rmk": "" }
                }, {
                    "type": "Feature", "id": "Block_ICO.21", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22263672, 51.27044209], [4.22643328, 51.26918133], [4.22638568, 51.26912058], [4.22630237, 51.26902104], [4.22250142, 51.27028376], [4.22263672, 51.27044209]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W3", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.22", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22247135, 51.27023791], [4.22432171, 51.26962076], [4.22418579, 51.26945694], [4.2223348, 51.27007566], [4.22247135, 51.27023791]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W4", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.23", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22229471, 51.27002804], [4.2241457, 51.26941461], [4.22400914, 51.26925315], [4.22335456, 51.26947193], [4.2231466, 51.2695413], [4.2229662, 51.26960126], [4.2228237, 51.26964829], [4.22250455, 51.26975489], [4.22216035, 51.2698703], [4.22229471, 51.27002804]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W5", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.24", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22211979, 51.2698219], [4.22397438, 51.26920533], [4.22384002, 51.26904661], [4.22371349, 51.26908776], [4.22357693, 51.26913342], [4.22342535, 51.26918417], [4.22326937, 51.26923551], [4.22311841, 51.26928607], [4.22290857, 51.26935622], [4.22278361, 51.26939796], [4.22267242, 51.26943421], [4.22239086, 51.26952807], [4.22206388, 51.26963741], [4.22198464, 51.26966308], [4.22211979, 51.2698219]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W6", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.25", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22196679, 51.26958744], [4.22374293, 51.26899723], [4.22375984, 51.26896411], [4.22365899, 51.26884654], [4.22361076, 51.26883635], [4.22183149, 51.26942833], [4.22181646, 51.26946125], [4.22191824, 51.26957961], [4.22196679, 51.26958744]]]]
                    },
                    "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W7", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.26", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22175695, 51.26939306], [4.22361295, 51.26877599], [4.22347765, 51.26861707], [4.22162447, 51.26923414], [4.22175695, 51.26939306]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W8", "tml_bl_rmk": "" }
                },
                {
                    "type": "Feature", "id": "Block_ICO.27", "geometry": {
                        "type": "MultiPolygon", "coordinates": [[[[4.22158469, 51.26918809], [4.22343975, 51.26856945], [4.22330633, 51.26841034], [4.22144939, 51.2690278], [4.22158469, 51.26918809]]]]
                    }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "W9", "tml_bl_rmk": "" }
                }, { "type": "Feature", "id": "Block_ICO.28", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22127682, 51.26882185], [4.22141087, 51.26898136], [4.22326749, 51.26836331], [4.22312906, 51.26820438], [4.22127682, 51.26882185]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.29", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22123767, 51.26877345], [4.22308835, 51.26815755], [4.22294365, 51.26800196], [4.22110205, 51.26861394], [4.22123767, 51.26877345]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.30", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22106259, 51.26856651], [4.2229117, 51.26795277], [4.22277922, 51.26779287], [4.22092854, 51.26840857], [4.22106259, 51.26856651]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.31", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22087561, 51.26834449], [4.2227266, 51.26772977], [4.22259256, 51.26757143], [4.22074188, 51.26818577], [4.22087561, 51.26834449]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.32", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22070304, 51.26813834], [4.22255121, 51.26752342], [4.22241967, 51.26736469], [4.22056711, 51.26797883], [4.22067391, 51.26810464], [4.22068519, 51.26812208], [4.22070304, 51.26813834]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E5", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.33", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22052734, 51.26793024], [4.22237896, 51.26731629], [4.22224553, 51.26715795], [4.22039298, 51.26777249], [4.22052734, 51.26793024]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E6", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.34", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22035445, 51.2677235], [4.22220482, 51.26711072], [4.22206827, 51.26695258], [4.2202179, 51.26756712], [4.22035445, 51.2677235]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E7", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.35", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22018094, 51.26751754], [4.22174881, 51.26699471], [4.22203507, 51.26690104], [4.22203068, 51.26689477], [4.22202692, 51.26689673], [4.22198182, 51.26690535], [4.22191793, 51.26691711], [4.2218127, 51.26693788], [4.22171561, 51.26695748], [4.22159033, 51.26698138], [4.22152831, 51.26699353], [4.2214638, 51.26701039], [4.22139928, 51.26702606], [4.22108546, 51.26710092], [4.22099964, 51.26712248], [4.22097521, 51.26712875], [4.22094765, 51.26713737], [4.2209157, 51.26714756], [4.22087311, 51.26716128], [4.22084492, 51.26717069], [4.2207898, 51.26718911], [4.22073593, 51.26720674], [4.22070398, 51.26721772], [4.22067141, 51.26722712], [4.22064573, 51.26723575], [4.22062443, 51.26724162], [4.22058497, 51.26725025], [4.22054237, 51.26725965], [4.22040081, 51.26729257], [4.2201634, 51.26734509], [4.22017092, 51.26739408], [4.22017719, 51.26743994], [4.22018094, 51.26751754]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E8", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.36", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22008135, 51.26709387], [4.22005191, 51.26710798], [4.22003687, 51.26712444], [4.22002497, 51.26714835], [4.22002184, 51.26717029], [4.22002873, 51.26718832], [4.22004126, 51.26720126], [4.22005817, 51.26720988], [4.22007508, 51.2672138], [4.22009951, 51.26721458], [4.22015526, 51.26720831], [4.22023293, 51.26720165], [4.22038264, 51.26718675], [4.22047911, 51.26717892], [4.22056931, 51.26716873], [4.22060376, 51.26716481], [4.22065199, 51.2671507], [4.22087937, 51.26707623], [4.22098648, 51.26704409], [4.22108483, 51.26702019], [4.22110957, 51.26701391], [4.22114559, 51.26700529], [4.22120259, 51.26699099], [4.22125646, 51.26697864], [4.22132254, 51.26696296], [4.22137203, 51.26695003], [4.22141525, 51.26693925], [4.22149136, 51.26692103], [4.22155869, 51.26690417], [4.22163605, 51.26688595], [4.22174974, 51.26685832], [4.2218578, 51.26683128], [4.2220097, 51.26679522], [4.2221071, 51.26677307], [4.22223332, 51.26674819], [4.22234137, 51.26673074], [4.22243752, 51.26671644], [4.22257189, 51.26669527], [4.22266678, 51.26668019], [4.22273725, 51.26666882], [4.22282432, 51.26665589], [4.22284374, 51.26665275], [4.2228951, 51.26663472], [4.22300347, 51.26659906], [4.22310745, 51.26656496], [4.22313188, 51.26655869], [4.22316571, 51.26654673], [4.22323555, 51.26652302], [4.22333796, 51.2664901], [4.22362266, 51.26639584], [4.22367277, 51.26637742], [4.22374543, 51.2663539], [4.22389827, 51.26630373], [4.22421523, 51.26619791], [4.22439939, 51.26613716], [4.22446265, 51.26611482], [4.22453344, 51.26608582], [4.22461299, 51.26604819], [4.22467751, 51.26601135], [4.22471133, 51.26599018], [4.22474202, 51.26596824], [4.2247746, 51.26594158], [4.2247984, 51.26591768], [4.22481469, 51.26589416], [4.22477397, 51.2659067], [4.22477068, 51.26590896], [4.22472918, 51.26585849], [4.2246418, 51.2657562], [4.22454628, 51.26567036], [4.22450932, 51.26563078], [4.22008135, 51.26709387]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "E9", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.37", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21832244, 51.26787105], [4.21956614, 51.26745954], [4.21953983, 51.26743014], [4.21951415, 51.26739761], [4.21949849, 51.26738154], [4.2194797, 51.26736743], [4.21946404, 51.26736195], [4.21944337, 51.26735685], [4.21942708, 51.2673643], [4.21941455, 51.26735097], [4.21935254, 51.26737057], [4.21928739, 51.26739644], [4.21926077, 51.2673643], [4.21818526, 51.26772056], [4.21832244, 51.26787105]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.38", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21846431, 51.26808818], [4.21990126, 51.26761082], [4.21979665, 51.26748344], [4.21977723, 51.26748266], [4.21975782, 51.26748344], [4.21972399, 51.26748344], [4.21968703, 51.26747992], [4.21833277, 51.26792828], [4.21846431, 51.26808818]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.39", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21864597, 51.26829276], [4.22012591, 51.26780046], [4.21999327, 51.26764223], [4.21851004, 51.26813403], [4.21864597, 51.26829276]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.40", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21803336, 51.26855574], [4.2181555, 51.26871877], [4.22030184, 51.26801058], [4.22016528, 51.2678493], [4.21803336, 51.26855574]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.41", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21824007, 51.2687513], [4.21837912, 51.26891042], [4.22047237, 51.26821477], [4.2203402, 51.26805604], [4.21865286, 51.26861413], [4.21824007, 51.2687513]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R5", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.42", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21838132, 51.26896911], [4.21851803, 51.26912754], [4.22064933, 51.26842288], [4.22051278, 51.26826239], [4.21838132, 51.26896911]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R6", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.43", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21856626, 51.2691922], [4.2186978, 51.26935054], [4.22083568, 51.26864509], [4.22070069, 51.2684848], [4.21871973, 51.26914126], [4.21856626, 51.2691922]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R7", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.44", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21887758, 51.26955629], [4.22100841, 51.26885016], [4.22087389, 51.26869193], [4.21873789, 51.26939835], [4.21887758, 51.26955629]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R8", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.45", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21905312, 51.26976547], [4.2211838, 51.26905729], [4.2210485, 51.26889719], [4.21891594, 51.26960361], [4.21905312, 51.26976547]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "R9", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.46", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21922695, 51.26997024], [4.22135512, 51.26926245], [4.22122201, 51.26910393], [4.21909133, 51.26981093], [4.21922695, 51.26997024]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T1", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.47", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22009356, 51.26994614], [4.22153019, 51.26947017], [4.22139583, 51.26931105], [4.21996014, 51.2697882], [4.22009356, 51.26994614]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T2", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.48", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22026645, 51.27015306], [4.22170277, 51.26967631], [4.22156872, 51.26951759], [4.22013177, 51.26999454], [4.22026645, 51.27015306]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T3", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.49", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.22043996, 51.270359], [4.22187753, 51.26988265], [4.22174317, 51.26972353], [4.22030591, 51.27020068], [4.22043996, 51.270359]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T4", "tml_bl_rmk": "" } }, { "type": "Feature", "id": "Block_ICO.50", "geometry": { "type": "MultiPolygon", "coordinates": [[[[4.21991786, 51.27081772], [4.22206513, 51.27010427], [4.22193077, 51.26994594], [4.21978506, 51.27066057], [4.21991786, 51.27081772]]]] }, "geometry_name": "the_geom", "properties": { "tml_cd_bl": "ICO", "tml_bl_cd": "T5", "tml_bl_rmk": "" } }], "totalFeatures": 234, "numberMatched": 234, "numberReturned": 50, "timeStamp": "2021-12-20T05:16:19.423Z", "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::4326" } }
        }

        const vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject),
        });

        const vectorSource1 = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject3),
        });

        const vectorSource2 = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject4),
        });

        const vectorSource3 = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject5),
        });

        // 빨간 원형
        vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: styleFunction,
            name: 'glory',
        });

        const vectorLayer1 = new VectorLayer({
            source: vectorSource1,
            style: styleFunction,
            name: 'glory',
        });

        const vectorLayer2 = new VectorLayer({
            source: vectorSource2,
            style: styleFunction,
            name: 'glory',
        });

        const vectorLayer3 = new VectorLayer({
            source: vectorSource3,
            style: styleFunction,
            name: 'glory',
        });

        const select = new Select();

        const translate = new Translate({
            features: select.getFeatures(),
        });

        const map = new Map({
            interactions: defaultInteractions().extend([select, translate]),
            controls: defaultControls({ zoom: true, attribution: false }).extend([
                new FullScreen({}),
                new ZoomSlider(),
                new OverviewMap({
                    layers: [
                        new TileLayer({
                            source: new OSM()
                        })
                    ],
                }),
                new Attribution({
                    collapsible: true,
                })
            ]),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer,
                vectorLayer1,
                vectorLayer2,
                vectorLayer3,
            ],
            target: 'map',
            view: new View({
                center: [4.22175695, 51.26939306],
                zoom: 16,
                projection: 'EPSG:4326',
            }),
        });

        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
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

    }, [])
    return (
        <>
            <div id="map" className='map' style={{ width: '98vw', height: '89vh' }}>
                <div style={{ marginBottom: 10 }}>
                    <form style={{ position: 'absolute' }}>
                        <label for="projection">Projection </label>
                        <select id="projection">
                            <option value="EPSG:4326">EPSG:4326</option>
                            <option value="EPSG:3857">EPSG:3857</option>
                        </select>
                        <label for="precision">Precision</label>
                        <input id="precision" type="number" min="0" max="12" value="4" />
                    </form>
                    <div id="mouse-position" style={{ position: 'absolute', zIndex: 100, width: '100%', margin: '0 auto', textAlign: 'center', fontSize: 20, fontWeight: 600 }}></div>
                </div>
            </div>
        </>
    );
};

export default GeoJson;

