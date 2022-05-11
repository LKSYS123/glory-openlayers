import { Route, Link } from 'react-router-dom';

import {
    BasicMap,
    GeoJson,
    LayerOpacity,
    LayerSelect,
    Measure,
    Merge,
    MousePolygon,
    SplitPolygon,
    SplitPolygonStyle,
    StreetLabels,
    VectorInfo,
    WMSInfo,
    WMSSample,
    Marker,
} from './components';

import Map from './map';
import './App.css';

function App() {
    return (
        <>
            <div className='list' style={{ margin: 10, lineHeight: 1.5 }}>
                <Link to='/'>Home</Link>
                <Link to='/basicMap'>기본 맵</Link>
                <Link to='/streetLabels'>이동범위 제한</Link>
                <Link to='/measure'>도형그리기(거리측정)</Link>
                <Link to='/geoJson'>좌표로 도형생성</Link>
                <Link to='/wmsInfo'>WMS 이미지</Link>
                <Link to='/wmsSample'>WMS 샘플</Link>
                <Link to='/vectorInfo'>Vector 이미지</Link>
                <Link to='/merge'>폴리곤 병합</Link>
                <Link to='/splitPolygon'>폴리곤 드래그 생성</Link>
                <Link to='/splitPolygonStyle'>폴리곤 드래그 스타일</Link>
                <Link to='/layerOpacity'>레이어 투명도</Link>
                <Link to='/layerSelect'>레이어별 Select</Link>
                <Link to='/mousePolygon'>마우스로 폴리곤생성(가운데 구멍)</Link>
                <br />
                <Link to='/marker'>Marker</Link>
                <hr />
            </div>
            <div style={{ width: '90vw', height: '75vh', marginLeft: 30 }}>
                <Map>
                    <Route path='/basicMap' component={BasicMap} />
                    <Route path='/streetLabels' component={StreetLabels} />
                    <Route path='/measure' component={Measure} />
                    <Route path='/geoJson' component={GeoJson} />
                    <Route path='/wmsInfo' component={WMSInfo} />
                    <Route path='/wmsSample' component={WMSSample} />
                    <Route path='/vectorInfo' component={VectorInfo} />
                    <Route path='/merge' component={Merge} />
                    <Route path='/splitPolygon' component={SplitPolygon} />
                    <Route
                        path='/splitPolygonStyle'
                        component={SplitPolygonStyle}
                    />
                    <Route path='/layerOpacity' component={LayerOpacity} />
                    <Route path='/layerSelect' component={LayerSelect} />
                    <Route path='/mousePolygon' component={MousePolygon} />
                    <Route path='/marker' component={Marker} />
                </Map>
            </div>
        </>
    );
}

export default App;
