import React, { useState, useContext, useEffect } from 'react';
import { Map, View } from 'ol';
import { Attribution, defaults as defaultControls } from 'ol/control';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import {
    Select,
    Translate,
    defaults as defaultInteractions,
    Draw,
} from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { WFS, GML } from 'ol/format';

import Button from '@mui/material/Button';
import Axios from 'axios';

import MapContext from '../map/MapContext';
import 'ol/ol.css';

const FeatureCRUD = () => {
    const { map } = useContext(MapContext);

    const [click, setClick] = useState(false);
    const [create, setCreate] = useState(false);
    const [modify, setModify] = useState(false);
    const [remove, setRemove] = useState(false);
    const [select, setSelect] = useState(null);

    const osmLayer = new TileLayer({
        source: new OSM(),
    });

    const vectorSource = new VectorSource({
        format: new GeoJSON(),
        url: function (extent) {
            var srcUrl =
                'http://192.168.1.47:8088/geoserver/GloryGis/ows?service=WFS&version=1.0.0&request=GetFeature&' +
                'typeName=GloryGis%3Atl_emd._seoul_4326&maxFeatures=50&outputFormat=application/json';
            // 'http://192.168.1.47:8088/geoserver/all_Tml_blk_StoreName/ows?service=WFS&version=1.0.0&' +
            // 'request=GetFeature&typeName=all_Tml_blk_StoreName%3Atl_scco_sig&maxFeatures=50&outputFormat=application/json&srsname=EPSG:4326&' +
            // 'bbox=' +
            // extent.join(',') +
            // ',EPSG:4326';
            return srcUrl;
            // 'http://192.168.1.59:8080/geoserver/MyFirstProject/ows?service=WFS&' +
            // 'version=1.0.0&request=GetFeature&typeName=MyFirstProject%' +
            // '3ALand&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:3857&' +
            // 'bbox=' +
            // extent.join(',') +
            // ',EPSG:3857'
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
            fill: new Fill({
                color: 'red',
            }),
        }),
    });

    // const translate = new Translate({
    //     features: click.getFeatures(),
    // });

    // function interactionsReset() {
    //     map.removeInteraction(select);
    // }
    const selectFunction = new Select({
        style: new Style({
            stroke: new Stroke({
                color: 'green',
                width: 2,
            }),
            fill: new Fill({
                color: 'rgba(255, 0, 38, 0.3)',
            }),
        }),
    });

    const onSelect = () => {
        if (click !== false) {
            return;
        }
        if (create) {
            map.removeInteraction(create);
            setCreate(false);
        } else if (modify) {
            map.removeInteraction(modify);
            setModify(false);
            map.removeInteraction();
        } else if (remove) {
            map.removeInteraction(select);
            setRemove(false);
        }

        // 선택 기능 추가
        setClick(true);
        setSelect(selectFunction);
        map.addInteraction(selectFunction);

        console.log(map.getInteractions());
    };
    const infoBox = document.getElementById('info');

    const selectFeatures = selectFunction.getFeatures();
    selectFeatures.on(['add', 'remove'], function () {
        const names = selectFeatures.getArray().map(function (feature) {
            // return JSON.stringify(feature);
            return feature.id_;
        });
        if (names.length > 0) {
            infoBox.innerHTML = names.join(', ');
        } else {
            infoBox.innerHTML = 'None';
        }
        console.log('selectFeatures selectFeatures', selectFeatures);
    });

    const onCreate = () => {
        if (create !== false) {
            return;
        }

        if (click) {
            map.removeInteraction(select);
            setClick(false);
        } else if (modify) {
            setModify(false);
            map.removeInteraction();
        } else if (remove) {
            map.removeInteraction(select);
            setRemove(false);
        }

        const draw = new Draw({
            source: new VectorSource({}),
            type: 'Polygon',
        });

        setCreate(draw);
        map.addInteraction(draw);

        console.log(map.getInteractions());
    };

    const onModify = () => {
        if (modify !== false) {
            return;
        }

        if (click) {
            map.removeInteraction(select);
            setClick(false);
        } else if (create) {
            map.removeInteraction(create);
            setCreate(false);
        } else if (remove) {
            map.removeInteraction(select);
            setRemove(false);
        }

        setModify(true);

        console.log(map.getInteractions());
    };

    const onRemove = () => {
        // if (remove !== false) {
        //     return;
        // }
        if (click) {
            setClick(false);
            map.removeInteraction(select);
        } else if (create) {
            map.removeInteraction(create);
            setCreate(false);
        } else if (modify) {
            setModify(false);
            map.removeInteraction();
        }

        // 선택 기능 추가
        const selectFunction = new Select({});
        setSelect(selectFunction);
        map.addInteraction(selectFunction);
        setRemove(true);

        const formatWFS = new WFS();
        const formatGML = new GML({
            featureNS: 'http://192.168.1.47:8088/geoserver/GloryGis/',
            featureType: 'GloryGis:tl_emd._seoul_4326',
            srsName: 'EPSG:4326',
        });

        const selectFeatures = selectFunction.getFeatures();

        selectFeatures.on('add', async function () {
            console.log('select select select');
            console.log(
                'selectFeatures selectFeatures',
                selectFeatures.getArray()[0].values_
            );
            const node = formatWFS.writeTransaction(
                null,
                null,
                selectFeatures.getArray()[0],
                formatGML
            );

            const s = new XMLSerializer();
            const str = s.serializeToString(node);
            console.log('str str str', str);

            const url = 'http://192.168.1.47:8088/geoserver/wfs';

            const options = {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                },
            };

            const postData_del = `<wfs:Transaction service="WFS" version="1.0.0"
                xmlns:cdf="http://www.opengis.net/cite/data"
                xmlns:ogc="http://www.opengis.net/ogc"
                xmlns:wfs="http://www.opengis.net/wfs"
                xmlns:topp="http://www.openplans.org/topp">
                <wfs:Delete typeName="GloryGis:tl_emd._seoul_4326">
                <ogc:Filter>
                <ogc:FeatureId fid="tl_emd._seoul_4326.74"/>
                </ogc:Filter>
                </wfs:Delete>
                </wfs:Transaction>`;

            Axios.post(url, postData_del, options)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        });

        console.log(map.getInteractions());

        // selectFeatures.on('add', async function () {
        //     console.log('select select select');
        //     console.log(
        //         'selectFeatures selectFeatures',
        //         selectFeatures.getArray()[0].values_
        //     );
        //     const node = formatWFS.writeTransaction(
        //         null,
        //         null,
        //         selectFeatures.getArray()[0].values_,
        //         formatGML
        //     );

        //     const s = new XMLSerializer();
        //     const str = s.serializeToString(node);

        //     const url = 'http://192.168.1.47:8088/geoserver/wfs';

        //     const options = {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/xml;charset=UTF-8',
        //         },
        //         body: str,
        //     };

        //     try {
        //         const response = await fetch(url, options);
        //         const result = await response.json();
        //         console.log('result =========>', JSON.stringify(result));
        //     } catch (e) {
        //         console.log('error =======>', e);
        //     }
        // });

        // console.log(map.getInteractions());
    };

    const removeTest = () => {
        console.log('removeTest removeTest removeTest');
        const postData_del =
            '<wfs:Transaction service="WFS" version="1.0.0"\n' +
            'xmlns:cdf="http://www.opengis.net/cite/data"\n ' +
            'xmlns:ogc="http://www.opengis.net/ogc"\n' +
            'xmlns:wfs="http://www.opengis.net/wfs"\n' +
            'xmlns:topp="http://www.openplans.org/topp">\n' +
            '<wfs:Delete typeName="GloryGis:tl_emd._seoul_4326">\n' +
            '<ogc:Filter>\n' +
            '<ogc:PropertyIsEqualTo>\n' +
            '<ogc:PropertyName>topp:emd_eng_nm</ogc:PropertyName>\n' +
            '<ogc:Literal>Yeouido-dong</ogc:Literal>\n' +
            '</ogc:PropertyIsEqualTo>\n' +
            '</ogc:Filter>\n' +
            '</wfs:Delete>\n' +
            '</wfs:Transaction>\n';

        var req_del = new XMLHttpRequest();
        req_del.open('POST', 'http://192.168.1.47:8088/geoserver/wfs', true);
        // req_del.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req_del.setRequestHeader('Content-type', 'text/xml');
        console.log('req_del req_del', req_del);
        req_del.onreadystatechange = () => {
            console.log(req_del.status);
            if (req_del.readyState !== 4) {
                console.log('error1 error1 error1');
                return;
            }
            if (req_del.status !== 200 && req_del.status !== 304) {
                alert('HTTP Error' + req_del.status);
                return;
            }
            if (req_del.status === 4) {
                return;
            }
            req_del.send(postData_del);

            alert('Polygon이 정상적으로 삭제되었습니다.');
        };
        console.log('removeTest removeTest removeTest22222');
    };

    // const map = new Map({
    //     interactions: defaultInteractions().extend([]),
    //     layers: [osmLayer, vectorLayer],
    //     target: 'map1',
    //     view: new View({
    //         projection: 'EPSG:4326',
    //         center: [126.886942, 37.515848],
    //         zoom: 8,
    //     }),
    // });

    return (
        <>
            <div id='info' style={{ marginLeft: 30, fontWeight: 600 }}></div>
            <div
                id='map'
                style={{ width: '95vw', height: '82vh', marginLeft: 20 }}
            >
                <div
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        marginLeft: '10rem',
                        color: 'black',
                    }}
                >
                    <Button
                        className='clickBut'
                        style={{
                            width: '6rem',
                            background: click ? 'orange' : 'white',
                            color: 'black',
                            fontWeight: 700,
                        }}
                        variant='outlined'
                        onClick={onSelect}
                    >
                        Select
                    </Button>
                    <Button
                        className='createBut'
                        style={{
                            width: '6rem',
                            marginLeft: '3rem',
                            background: create ? 'orange' : 'white',
                            color: 'black',
                            fontWeight: 700,
                        }}
                        variant='outlined'
                        onClick={onCreate}
                    >
                        Create
                    </Button>
                    <Button
                        className='modifyBut'
                        variant='outlined'
                        style={{
                            width: '6rem',
                            marginLeft: '3rem',
                            background: modify ? 'orange' : 'white',
                            color: 'black',
                            fontWeight: 700,
                        }}
                        onClick={onModify}
                    >
                        Modify
                    </Button>
                    <Button
                        className='removeBut'
                        style={{
                            width: '6rem',
                            marginLeft: '3rem',
                            background: remove ? 'orange' : 'white',
                            color: 'black',
                            fontWeight: 700,
                        }}
                        variant='outlined'
                        onClick={onRemove}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FeatureCRUD;
