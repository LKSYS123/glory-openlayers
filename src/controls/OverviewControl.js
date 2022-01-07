import React, { useContext, useEffect } from "react";
import { OverviewMap } from "ol/control";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import View from 'ol/View';
import MapContext from "../map/MapContext";

const OverviewControl = () => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;
        const OverviewControl = new OverviewMap({
            layers: [
                new TileLayer({
                  source: new OSM()
                })
              ],
        });
        map.controls.push(OverviewControl);
    }, [map]);

    return null;
};

export default OverviewControl;