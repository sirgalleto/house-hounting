import { createSlice } from '@reduxjs/toolkit';
import Papa from 'papaparse';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding'

import config from '../../config'

const geocodingServcice = mbxGeocoding({ accessToken: config.mapboxAccessToken })

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
    const { Name: name, Direccion: address } = house
    const result = await geocodingServcice
        .forwardGeocode({
            query: address,
            types: ['address', 'place', 'region', 'locality'],
            limit: 1
        })
        .send()

    const { body: { features }} = result 

    return {
        id: name,
        coordinates: features[0]?.center
    }
}

export const readHouseFile = file => dispatch => {
    const reader = new FileReader()

    reader.onabort = () => console.info('file reading was aborted')
    reader.onerror = () => console.error('file reading has failed')
    reader.onload = async () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        const csv = new TextDecoder().decode(binaryStr)
        const { data: houses } = Papa.parse(csv, { header: true })

        const housesList = await Promise.all(houses.map(house => constructHouse(house)))

        dispatch(ingest(housesList))
    }
    reader.readAsArrayBuffer(file)

    dispatch(ingest([]))
}

export const selectList = state => state?.houses?.list ?? []

export default housesSlice.reducer;
