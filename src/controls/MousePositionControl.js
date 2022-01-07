import React, { useContext, useEffect } from 'react';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import MapContext from '../map/MapContext';

const MousePositionControl = () => {
    const { map } = useContext(MapContext);
    useEffect(() => {
        if (!map) return;
        const mousePosition = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:3857',
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
    }, [map]);

    return null;
};

export default MousePositionControl;