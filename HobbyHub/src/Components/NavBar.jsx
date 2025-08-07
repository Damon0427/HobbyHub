// src/components/NavBar.jsx
import { Link } from 'react-router-dom'
import React from 'react'
import './NavBar.css' 

const NavBar = () => {


  return (
    <nav className="navbar">
      <div className="nav-title">
        <Link to="/" className="title-link">HobbyHub</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/create" className="nav-link">Create Post</Link>
      </div>
    </nav>
  )
}

export default NavBar
