import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import FullScreenMap from './components/FullScreenMap'
import { Houses, readHouseFile, hydrateLocalStorage, selectCenter } from './features/houses'

function App() {
  const dispatch = useDispatch()
  const center = useSelector(selectCenter, shallowEqual)

  useEffect(() => {
    dispatch(hydrateLocalStorage())
  })
  
  const onDrop = useCallback(acceptedFiles => {
    dispatch(readHouseFile(acceptedFiles[0]))
  }, [])


  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div  {...getRootProps({
      onClick: event => event.stopPropagation()
    })}>
      <input {...getInputProps()} />
      <FullScreenMap center={center} zoom={[12]}>
        <Houses />
      </FullScreenMap>
    </div>
  );
}

export default App;
