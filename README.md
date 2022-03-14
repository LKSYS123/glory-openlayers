# Openlayers 기능 구현

## List

#### 1) 이동범위 제한(StreetLabel): 특정범위 밖으로 지도 이동 불가

#### 2) 도형그리기(Measure): 선 혹은 도형을 그려 길이와 넓이 측정

#### 3) 좌표로 도형생성(GeoJson): json 형식으로 좌표에 대한 정보 입력 후 지도에 출력

#### 4) WMS이미지(WMSInfo): geoserver에서 WMS이미지를 받아 지도에 출력

#### 5) WMS샘플(WSMSample): 위 이미지를 선만 출력

#### 6) Vector이미지(VectorInfo): VectorLayer를 이용하여 지도에 출력

#### 7) 폴리곤 드래그 생성(SplitPolygon): 드래그 하여 해당 범위안에 Polygon 생성

#### 8) 레이어 투명도(LayerOpacity): Slider를 이용하여 Polygon의 투명도 조정

#### 9) 레이어별 Select(LayerSelect): Layer선택 후 해당 Layer만 Click 가능

#### 10) 화면 회전후 도형생성(MousePolygon): 화면 회전후 현재 화면에 맞는 도형 생성, 도형이 회전되어 있지 않음

#### 11) 도형 CRUD(FeatureCRUD): WFS-T 이용하여 도형 CRUD(현재 중단.22.03.14)
