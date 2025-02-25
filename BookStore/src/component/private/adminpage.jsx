import React, { useState, useEffect } from "react";  
import { useNavigate } from 'react-router-dom';

function Adminpage() {

  return (
    <>
      <div className="header" style={{ position: "fixed", top: "20px", left: "200px", right: "200px", bottom: "100px" }}>
        <div className="left-section">
          <a href="Mainpage"><img className="logo" src="/assets/logo.jpg" alt="Logo"></img></a>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" />
          <button className="search-button">
            <img className="search" src="/assets/search.jpg" alt="Search"></img>
          </button>
        </div>

        <div className="right-section">
          <button className="profile">
            Profile
            <img src="/assets/admin.jpg" className="profileimg" alt="Profile" />
          </button>
          <button className="add">
            Add book
            <img className="cartimg" src="/assets/add.jpg" alt="Add" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Adminpage;
