import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import { useSelector, useDispatch } from 'react-redux';

import FullScreenMap from './components/FullScreenMap'
import { Houses, readHouseFile } from './features/houses'

function App() {
  const dispatch = useDispatch()
  const onDrop = useCallback(acceptedFiles => {
    dispatch(readHouseFile(acceptedFiles[0]))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div  {...getRootProps({
      onClick: event => event.stopPropagation()
    })}>
      <input {...getInputProps()} />
      <FullScreenMap center={[-103.37110564112663, 20.669135907924424]} zoom={[20]}>
        <Houses />
      </FullScreenMap>
    </div>
  );
}

export default App;
