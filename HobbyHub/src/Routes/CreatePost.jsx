import React, { useState } from 'react'
import { supabase } from '../client'
import { useNavigate } from 'react-router-dom'
import NavBar from '../Components/NavBar'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [description, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const navigate = useNavigate()

  const handleImageUpload = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('post-images') 
      .upload(fileName, file)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      return null
    }

    const { data } = await supabase.storage
      .from('post-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return alert('Title is required.')

    let imageUrl = ''
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile)
      if (!imageUrl) return 
    }

    const { error } = await supabase
      .from('posts')
      .insert([
      { title: title, description: description, image_url: imageUrl, upvotes: 0 }
      ]);

    if (error) alert('Post failed: ' + error.message)
    else navigate('/')
  }

  return (
    <div> 
    <NavBar />
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setContent(e.target.value)}
      />
      <label for="upload" class="upload-label">Choose File: </label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setImageFile(e.target.files[0])}
      />
      <button type="submit">Post</button>
    </form>
    </div>

  )
}

export default CreatePost
