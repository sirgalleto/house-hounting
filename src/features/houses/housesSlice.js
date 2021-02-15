import { createSlice } from '@reduxjs/toolkit';
import Papa from 'papaparse';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'
import camelcase from 'camelcase'
import { points, center } from '@turf/turf'

import config from '../../config'

const geocodingService = mbxGeocoding({ accessToken: config.mapboxAccessToken })

export const housesSlice = createSlice({
    name: 'houses',
    initialState: {
        list: [
            {
                id:'first',
                coordinates: [-103.37110564112663, 20.669135907924424]
            }
        ]
    },
    reducers: {
        ingest: (state, action) => {
            state.list = action.payload
        }
    },
});

export const { ingest } = housesSlice.actions;

async function constructHouse(house) {
    const { address} = house
    const result = await geocodingService
        .forwardGeocode({
            query: address,
            types: ['address', 'place'],
            limit: 1,
            countries: ['MX']
        })
        .send()

    const { body: { features }} = result 

    return {    
        coordinates: features[0]?.center,
        ...house
    }
}

export const hydrateLocalStorage = () => async dispatch => {
    const csv = localStorage.getItem('csv')

    if (!csv) return 

    const { data: houses } = Papa.parse(csv, {
        header: true, transformHeader: (header) => {
            return camelcase(header)
        }
    })

    try {
        const housesList = await Promise.all(houses.map((house, index) => constructHouse({ id: index, ...house})))
        
        dispatch(ingest(housesList))
    } catch(e) {
        console.error(e)
    }


}

export const readHouseFile = file => dispatch => {
    const reader = new FileReader()

    reader.onabort = () => console.info('file reading was aborted')
    reader.onerror = () => console.error('file reading has failed')
    reader.onload = async () => {
        const binaryStr = reader.result
        const csv = new TextDecoder().decode(binaryStr)

        localStorage.setItem('csv', csv)
        
        const { data: houses } = Papa.parse(csv, {
            header: true, transformHeader: (header) => {
                return camelcase(header)
            }
        })

        const housesList = await Promise.all(houses.map((house, index) => constructHouse({ ...house, id: index})))

        dispatch(ingest(housesList))
    }
    reader.readAsArrayBuffer(file)

    dispatch(ingest([]))
}

export const selectList = state => state?.houses?.list ?? []
export const selectCenter = state => {
    if (state?.houses?.list.length === 0) {
        return [0,0]
    }
    
    return center(
        points(state?.houses?.list.map(({ coordinates }) => coordinates))
    )?.geometry?.coordinates
}

export default housesSlice.reducer;
