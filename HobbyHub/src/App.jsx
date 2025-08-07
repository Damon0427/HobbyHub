import Navbar from './Components/NavBar'
import './App.css'
import { useEffect, useState } from 'react'
import PostCard from './Components/Post'
import { supabase } from './client'
import { Link } from 'react-router-dom';

function App() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      let query = supabase
        .from('posts')
        .select('*')
        .order(sortBy, { ascending: sortBy === 'created_at' ? false : false }); // 默认倒序

      if (searchQuery.trim() !== '') {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (!error) setPosts(data);
    }
    fetchPosts();
  }, [sortBy, searchQuery]);

  return (
    <>
      <main className='main-container'>
        <Navbar />

        <h1>Hobby Hub~</h1>
        <p>Welcome to the Hobby Hub, a place to share and discover new hobbies!</p>

        
        <input
          type="text"
          placeholder="Search posts by title..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
        />

        
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          <option value="created_at">Sort by Creation Time</option>
          <option value="upvotes">Sort by Upvotes</option>
        </select>

        {posts.length > 0 ? (
          posts.map(post => (
            <Link key={post.id} to={`/post/${post.id}`}>
              <PostCard post={post} />
            </Link>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </main>
    </>
  );
}

export default App;
