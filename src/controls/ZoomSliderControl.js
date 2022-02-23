import { useContext, useEffect } from 'react';
import { ZoomSlider } from 'ol/control';
import MapContext from '../map/MapContext';

const ZoomSliderControl = () => {
    const { map } = useContext(MapContext);

    useEffect(() => {
        if (!map) return;
        const zoomsliderControl = new ZoomSlider();
        map.controls.push(zoomsliderControl);
    }, [map]);

    return null;
};

export default ZoomSliderControl;
