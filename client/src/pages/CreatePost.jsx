import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { app } from "../FirebaseConfig";
import {CircularProgressbar} from "react-circular-progressbar"
import 'react-circular-progressbar/dist/styles.css';

import {useNavigate} from 'react-router-dom'

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setimageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const [publishError, setPublishError] = useState(null)

  const navigate = useNavigate();

  const url = "https://blog.smarttech.one";

  console.log(formData);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setimageUploadError("Please select an image");
        return;
      }
      setimageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, "postImage/" + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setimageUploadError("Image Upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setimageUploadError(null);
            setFormData({...formData,image: downloadURL});
          });
        }
      );
    } catch (error) {
      setimageUploadError('Image upload failed');
      setImageUploadProgress(null);

      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${url}/api/post/create`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(!res.ok){
        setPublishError(data.message)
        return
      }
      
      if(res.ok){
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
      console.log(error); 
    }
  }

  return (
    <div className=" p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className=" text-center text-3xl my-7 ">Create Post</h1>
      <form action="" className=" flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className=" flex-1"
            onChange={(e) => setFormData({...formData,title: e.target.value})}
          />
          <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className=" flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {
              imageUploadProgress ? (
                <div className=" w-1/6 h-1/6">
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                </div>
              ) : (
                'Upload Image'
              )
            }
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {
          formData.image && (
            <img src={formData.image} alt="upload" className=" w-full h-72 object-cover" />
          )
        }
        <ReactQuill
          theme="snow"
          placeholder="write something..."
          className=" h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({...formData,content: value});
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && <Alert className=" mt-5" color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}
