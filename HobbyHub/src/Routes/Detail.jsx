import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../client';
import './Detail.css';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    if (!error) {
      setPost(data);
      setUpvotes(data.upvotes || 0);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    if (!error) setComments(data);
  };

  const handleUpvote = async () => {
    const newUpvotes = upvotes + 1;
    setUpvotes(newUpvotes);
    await supabase.from('posts').update({ upvotes: newUpvotes }).eq('id', id);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const { error } = await supabase.from('comments').insert([
      { post_id: id, content: commentText }
    ]);
    if (!error) {
      setCommentText('');
      fetchComments();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    await supabase.from('posts').delete().eq('id', id);
    navigate('/');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <h2 className="detail-title">{post.title}</h2>

      {post.image_url && (
        <img src={post.image_url} alt="Post" className="detail-image" />
      )}

      <p className="detail-content">{post.content || post.description}</p>

      <button onClick={handleUpvote} className="upvote-btn">
        👍 {upvotes}
      </button>

      <div className="post-buttons">
        <Link to={`/edit/${post.id}`} className="edit-btn">Edit</Link>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>

      <hr />

      <div className="comment-section">
        <h3 className='comment-title'>Comments: </h3>
        {comments.length > 0 ? (
          comments.map((c, i) => <p key={i} className="comment">• {c.content}</p>)
        ) : (
          <p className="no-comments">No comments yet</p>
        )}
        <textarea
          className="comment-input"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment} className="comment-btn">Post Comment</button>
      </div>

      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
};

export default Detail;
