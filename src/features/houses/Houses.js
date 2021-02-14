import React, { memo } from 'react'
import { Layer, Feature } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';

import { selectList } from './housesSlice'

const Houses = () => {
    const list = useSelector(selectList)
    return (
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'rocket-15', 'icon-size': 1.2 }}>
            {
                (list ?? []).map(({ id, coordinates }) => (
                    <Feature key={id} coordinates={coordinates} onClick={() => {
                        alert('simon')
                    }} />
                ))
            }
        </Layer>
    )
}

export default memo(Houses)