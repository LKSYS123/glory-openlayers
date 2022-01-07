import { Map } from '../map'

import 'ol/ol.css'

function BasicMap() {
  return (
    <>
      <Map>
        <div id="map" className='map' style={{ width: '98vw', height: '89vh' }} >
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
            <div id="mouse-position" style={{ position: 'absolute' , zIndex: 100, width: '100%', margin: '0 auto', textAlign: 'center', fontSize: 20, fontWeight: 600 }}></div>
          </div>
        </div>
      </Map>
    </>
  );
}

export default BasicMap;