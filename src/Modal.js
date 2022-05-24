import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import index from './img/home.svg';
import profile from './img/read.svg';
import meds from './img/meds.svg';
import docs from './img/docs.svg';
import signin from './img/signin.svg';
import signup from './img/signup.svg';
import axios from 'axios';

const ModalPortal = ({ visible, toggle }) => {
	const [user, setUser] = useState()
	useEffect(() => {
		const loggedInUser = localStorage.getItem('admin');
		if (loggedInUser) {
			const foundUser = loggedInUser;
      var data = JSON.stringify([
        {
          "token": loggedInUser
        }
      ]);
      
      var config = {
        method: 'post',
        url: 'https://medhx.herokuapp.com/controller/adminvalidation.php',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        //console.log(response.data);
        setUser(foundUser)
      })
      .catch(function (error) {
      });
		}
	}, []);
  const [, setAdmin] = useState([])
	// logout Admin
	const logOut = () => {
		setAdmin('');
		localStorage.removeItem('admin');
		window.location.reload();
	}
  if (!visible) return null;
  if (user) {
    return ReactDOM.createPortal(
      <div className="modal">
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="modal_content">
            <div className='closeWrapper'>
              <ion-icon id="modalClose" name="close-outline" className="modal_opener" onClick={toggle}></ion-icon>
            </div>
            <nav>
              <Link onClick={toggle} to="/"><img src={index} alt="Home"></img><span>Home</span></Link>
              <Link onClick={toggle} to="/dashboard"><img src={profile} alt="Profile"></img><span>Profile</span></Link>
              <Link onClick={toggle} to="/meds"><img src={meds} alt="Medications"></img><span>Medications</span></Link>
              <Link onClick={toggle} to="/docs"><img src={docs} alt="Doctors"></img><span>Doctors</span></Link>
              <Link onClick={toggle} to="/add"><img src={signup} alt="Sign Up"></img><span>Add Patient</span></Link>
              <Link onClick={logOut} to="/dashboard"><img src={signin} alt="Sign In"></img><span>Sign Out</span></Link>
            </nav>
          </div>
        </div>
      </div>,
      document.body
    );
  }
  if (!user) { }
};
export default ModalPortal;