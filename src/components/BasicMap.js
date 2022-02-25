import { useContext } from 'react';
import MapContext from '../map/MapContext';

import 'ol/ol.css';

function BasicMap() {
    const { map } = useContext(MapContext);
    console.log('acacacacacacac', map);

    return (
        <>
            <form>
                <label htmlFor='projection'>Projection </label>
                <select id='projection'>
                    <option value='EPSG:4326'>EPSG:4326</option>
                    <option value='EPSG:3857'>EPSG:3857</option>
                </select>
                <label htmlFor='precision'>Precision</label>
                <input
                    id='precision'
                    type='number'
                    min='0'
                    max='12'
                    defaultValue='4'
                />
            </form>
            <div
                id='map'
                className='map'
                style={{ width: '98vw', height: '84vh' }}
            >
                <div style={{ marginBottom: 10 }}>
                    <div
                        id='mouse-position'
                        style={{
                            zIndex: 100,
                            width: '100%',
                            margin: '0 auto',
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 600,
                        }}
                    ></div>
                </div>
            </div>
        </>
    );
}

export default BasicMap;
