import React, { memo, useCallback } from 'react'
import { Layer, Feature } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';
import { selectList } from './housesSlice'

const queryUrl = 'https://www.google.com/maps/search/'

const Houses = () => {
    const list = useSelector(selectList)
    return (
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'rocket-15', 'icon-size': 1.2 }}>
            {
                (list ?? []).map(({ id, coordinates, address }) => (
                    <Feature key={id} coordinates={coordinates} onClick={() => {
                        window.open(queryUrl + encodeURI(address));
                    }} />
                ))
            }
        </Layer>
    )
}

export default memo(Houses)