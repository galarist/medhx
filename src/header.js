import React, { useState }/*, { Component }*/ from 'react';
import medhx from './img/transparent_medhx.png';
import './modal/modal.css';
import './index.css';
import './main.css';
import ModalPortal from './Modal';
import useModal from './useModal';
//import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
// Get the main element
var rootElement = document.querySelector('body');
// Make a function to call later with onClick
function switchTheme() {
  // Inline if elses
  // Checks if element has class (TRUE : FALSE)
  rootElement.classList.contains("darkMode") ? rootElement.classList.remove('darkMode') : rootElement.classList.add('darkMode');
  rootElement.classList.contains("darkMode") ? localStorage.setItem('theme', 'darkMode') : localStorage.removeItem('theme');
}
// Call the item from localStorage when page refreshed and set class accordingly
rootElement.classList.toggle(localStorage.getItem('theme'));
const Header = () => {
  const [admin, setAdmin] = useState(localStorage.getItem('admin'));
  // logout Admin
  const logOut = () => {
    setAdmin('');
    localStorage.removeItem('admin');
    window.location.reload();
  }
  const dashboard = () => {
    window.location.replace("/dashboard");
  }
 const {toggle, visible} = useModal();
  return (
    <div className="App">
        <header>
          <Link id='logo' to="/" replace><img src={medhx} alt='logo'/></Link>
          <div>
            <Link to="/" replace><ion-icon name="home"></ion-icon></Link>
            {/** Checks if admin is logged in */}
            {admin ? (<ion-icon name="log-out" onClick={logOut}></ion-icon>) : (<ion-icon name="log-in" onClick={dashboard}></ion-icon>)}
            <ion-icon className="modal_opener" onClick={switchTheme} name="sunny"></ion-icon>
            <Link to="/" replace><ion-icon name="help-circle"></ion-icon></Link>
            {/** Checks if admin is logged in */}
            {admin ? (<ion-icon className="modal_opener" onClick={toggle} name="menu"></ion-icon>) : ("")}
          </div>
        </header>
      <ModalPortal visible={visible} toggle={toggle} />
    </div>
  );
}
export default Header;