import { Route, Link } from 'react-router-dom';
import BasicMap from './components/BasicMap';
import StreetLabels from './components/StreetLabels';
import Measure from './components/Measure';
import GeoJson from './components/GeoJson';
import WMSInfo from './components/WMSInfo';
import WMSSample from './components/WMSSample';
import VectorInfo from './components/VectorInfo';
import Merge from './components/Merge';

function App() {
  return (
    <>
      <div className='list' style={{ margin: '10px 0' }}>
        <Link to='/'>Home</Link>
        <Link to='/basicMap'>기본 맵</Link>
        <Link to='/streetLabels'>이동범위 제한</Link>
        <Link to='/measure'>도형그리기(거리측정)</Link>
        <Link to='/geoJson'>좌표로 도형생성</Link>
        <Link to='/wmsInfo'>WMS 이미지</Link>
        <Link to='/wmsSample'>WMS 샘플</Link>
        <Link to='/vectorInfo'>Vector 이미지</Link>
        <Link to='/merge'>폴리곤 병합</Link>
      </div>
        <Route path='/basicMap' component={BasicMap} />
        <Route path='/streetLabels' component={StreetLabels} />
        <Route path='/measure' component={Measure} />
        <Route path='/geoJson' component={GeoJson} />
        <Route path='/wmsInfo' component={WMSInfo} />
        <Route path='/wmsSample' component={WMSSample} />
        <Route path='/vectorInfo' component={VectorInfo} />
        <Route path='/merge' component={Merge} />
    </>
  );
}

export default App;