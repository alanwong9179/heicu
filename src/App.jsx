import { useState , useEffect} from 'react'
import './App.css'
import heic2any from "heic2any";


function download(dataurl, filename) {
  const link = document.createElement("a");
  link.href = dataurl;
  link.download = filename;
  link.click();
}

function App() {

  const [uploadImgList, setUploadImgList] = useState([])
  const [readyDownloadImageList, setReadyDownloadImageList] = useState([])

  const onUplaod = (e) => {
    let imagelist = []

    Array.from(e.target.files).forEach((f, i)=> {
      imagelist.push({id: i, name: f.name, file: f, convertedFile: '', covertedDataUrl: ''})
    })
    setUploadImgList(imagelist)
    setReadyDownloadImageList(imagelist)
  }

  useEffect(() => {
    uploadImgList.length > 0 &&
      uploadImgList.forEach((f) => {
        uploadImg(f.id, f.file)
      })
  },[uploadImgList])

  const uploadImg = (id, image) => { 
    heic2any({blob: image, toType: "image/jpeg"})
    .then(blob => {
      let fr = new FileReader()
      fr.onload = (e) => {
        console.log(id)
        console.log(e)
        setReadyDownloadImageList( img =>
          img.map(list => {
            if (list.id === id){
              return {...list, convertedFile:blob, covertedDataUrl: e.currentTarget.result }
            }
            return list
          })
        )
      }
      fr.readAsDataURL(blob)
    }, error => {
      console.log(error)
    })
  }

  return (
    <div>
    <input type={"file"} onChange={onUplaod} multiple accept=".heic"/>

    {
      readyDownloadImageList.map(img => (
        <div>
          <div>{img.name}</div>
          <div>{img.convertedFile !== '' ? 'OK' : 'Loading'}</div>
        </div>
      ))
    }
    </div>

  )
}

export default App
