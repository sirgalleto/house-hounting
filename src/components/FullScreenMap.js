import { memo } from 'react'
import ReactMapboxGl from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

import config from '../config'

const MapboxMap = ReactMapboxGl({
    accessToken: config.mapboxAccessToken
});

const FullScreenMap = (props) => (
    <MapboxMap
        {...props}
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
            height: '100vh',
            width: '100vw'
        }} >
    </MapboxMap>
)

export default memo(FullScreenMap)

