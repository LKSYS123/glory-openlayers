import { useContext, useEffect } from 'react';
import { Rotate } from 'ol/control';
import MapContext from '../map/MapContext';

const RotationControl = () => {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;
        const rotationControl = new Rotate();
        map.controls.push(rotationControl);

        return () => map.controls.remove(rotationControl);
    }, [map]);

    return null;
};

export default RotationControl;
