import React, { useState } from 'react'

function Form() {

    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState('')

    

  return (
    <div className="w-3/4 bg-white p-11 rounded-3xl h-3/4 shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 ">
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="Name"
        className="p-4 mt-4 shadow-lg rounded-lg "
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        type="file"
        name="Image"
        className="p-2 mt-4 shadow-lg rounded-lg"
        onChange={bannerSetting}
      />
      <textarea
        type="text"
        placeholder="Description"
        className="p-2 mt-4 shadow-lg h-1/3 rounded-lg"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <button
        className="p-2 mt-4 bg-sky-400 w-2/4 rounded-3xl mx-auto"
        onClick={handleSubmit}
      >
        Upload
      </button>
    </div>
    <div className="flex flex-col md:col-span-2 ">
      <div className="flex flex-col text-center justify-center border-2 mx-20 h-72 px-10 py-6 ">
      {banner && <img
        className="w-full h-full    rounded-lg  "
        src={image ? URL.createObjectURL(image) : ""}
        alt=""
      />}
    {!banner &&
    (<>
      <p>preview</p>
    <img
        className="w-full h-full    rounded-lg  "
        src={bannerPreview}
        alt=""
      /></>)}
      </div>
     
    </div>
  </div>
  )
}

export default Form
