import React from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './main.css'
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
var rootElement = document.getElementById("root");
render(
  <Router>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </Router>,
  rootElement
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
/*window.onoffline = (event) => {
    console.log("Connection Lost")
};*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
//module.hot.accept();