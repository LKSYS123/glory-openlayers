import { useContext } from 'react';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import MapContext from '../map/MapContext';
import 'ol/ol.css';

const Popup = () => {
    const { map } = useContext(MapContext);
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    map.on('click', function (e) {
        const coordinate = e.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
        overlay.setPosition(coordinate);
    });

    const overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    map.addOverlay(overlay);
};

export default Popup;
