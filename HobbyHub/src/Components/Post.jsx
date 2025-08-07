// src/components/PostCard.jsx
import React, { useState } from 'react'
import './Post.css'
import { supabase } from '../client'

const PostCard = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)

    const handleUpvote = async () => {
    const newUpvotes = upvotes + 1
    setUpvotes(newUpvotes)
    await supabase.from('posts').update({ upvotes: newUpvotes }).eq('id', post.id)
    }


  return (
    <div className="post-card">
      {post.image_url && (
        <img src={post.image_url} alt="post" className="post-image" />
      )}
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        {post.description && <p className="post-text">{post.description}</p>}
        
        <span className="post-time">
            {post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown time'}
        </span>

      </div>
        <button className="upvote-button" onClick={handleUpvote}>
          👍 {upvotes}
        </button>
    </div>
  )
}

export default PostCard
