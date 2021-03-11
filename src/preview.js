import React, {useEffect, useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import Cropper from 'react-easy-crop'
import './styles.css'

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const container = {
  minWidth: 300,
  minHeight: 400,
}
const controls = {
  position: 'relative',
  bottom: 0,
  left: '50%',
  width: '50%',
  transform: 'translateX(-50%)',
  height: 80,
  flex: 1,
  alignItems: 'center',
  paddingTop: 22,
}

const readFile = (file) => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
}


const Previews = (props) => {
    const [files, setFiles] = useState([]);
    const [imageSrc, setImageSrc] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log({croppedArea, croppedAreaPixels})
    }, [])

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
      })));
    }
  });
  
  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
        <button type="button" className="btn btn-primary mt-3" data-toggle="modal" data-target="#staticBackdrop" onClick={() => onFileChange(file)}>
            Edit
        </button>
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const onFileChange = async file => {
    let imageData = await readFile(file)
    setImageSrc(imageData)
  }

  const changeZoom = (e) => {
    setZoom(e.target.value)
  }

  return (
      <>
        <section className="container">
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside style={thumbsContainer}>
            {thumbs}
        </aside>
        </section>
        
        <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">Edit Image</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div style={container}>
                      <div>
                      {imageSrc ? (
                        <Cropper
                          image={imageSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={4 / 3}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                        ) : null}
                      </div>
                    </div>
                </div>
                <div style={controls}>
                    <input type="range" min="1" max="3" value={zoom} onChange={(e) => changeZoom(e)} step={0.1}/>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary">Save Image</button>
                </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Previews