import React, { useContext, useState } from 'react';
import MapContext from '../map/MapContext';

import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { Feature } from 'ol';
import { LineString, Polygon } from 'ol/geom';
import Map from '../map/Map';

const BasicMap = () => {
    const map = useContext(MapContext);

    console.log(map);

    return <Map></Map>;
};

export default BasicMap;
