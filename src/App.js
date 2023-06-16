import { Route, Link } from 'react-router-dom';

import {
    TestMap,
    CargoMaker,
    CargoMaker1,
    ClosePoint,
    Convex,
    GeoJson,
    LayerOpacity,
    LayerSelect,
    Measure,
    Merge,
    MousePolygon,
    SplitPolygon,
    SplitPolygon1,
    SplitPolygonStyle,
    StreetLabels,
    VectorInfo,
    WMSInfo,
    WMSSample,
    Marker,
    BasicMap,
} from './components';

import './App.css';

function App() {
    return (
        <>
            <div className='list' style={{ margin: 10, lineHeight: 1.5 }}>
                <Link to='/'>Home</Link>
                <Link to='/testMap'>테스트 맵</Link>
                <Link to='/basicMap'>기본 맵(230607)</Link>
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
                <br />
                <Link to='/mousePolygon'>마우스로 폴리곤생성(가운데 구멍)</Link>
                <Link to='/marker'>Marker</Link>
                <Link to='/cargoMaker'>화물정의</Link>
                <Link to='/cargoMaker1'>화물정의1</Link>
                <Link to='/convex'>Convex</Link>
                <Link to='/splitPolygon1'>폴리곤 드래그 생성_1</Link>
                <Link to='/closePoint'>가까운점 찾기</Link>
                <Link to='/layerSelect'>레이어별 Select</Link>
                <hr />
            </div>
            <div style={{ width: '97vw', height: '74vh', marginLeft: '1rem' }}>
                <Route path='/' exact />
                <Route path='/testMap' component={TestMap} />
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
                <Route path='/cargoMaker' component={CargoMaker} />
                <Route path='/cargoMaker1' component={CargoMaker1} />
                <Route path='/convex' component={Convex} />
                <Route path='/splitPolygon1' component={SplitPolygon1} />
                <Route path='/closePoint' component={ClosePoint} />
                <Route path='/basicMap' component={BasicMap} />
            </div>
        </>
    );
}

export default App;
