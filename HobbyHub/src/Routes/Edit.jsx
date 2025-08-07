import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../client';
import './Edit.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) {
        setTitle(data.title);
        setContent(data.description);
      }
    }
    fetchPost();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title.trim() || !content.trim()) {
    alert("Title and content cannot be empty.");
    return;
  }

  const { error } = await supabase
    .from('posts')
    .update({ title: title.trim(), description: content.trim() })
    .eq('id', id);

  if (error) {
    console.error("Update failed:", error.message);
    alert("Failed to update post.");
  } else {
    navigate(`/post/${id}`);
  }
};


  return (
    <div className="edit-post-container">
      <form className="edit-post-form" onSubmit={handleSubmit}>
        <h2>Edit Post</h2>
        <span className="edit-label">Title:</span>

        <input
          className="edit-title-input"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <span className="edit-label">Description:</span>
        <textarea
          className="edit-content-textarea"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
        />
        <button className="save-btn" type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPost;
