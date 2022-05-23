import React, { Component } from 'react';
import './modal/modal.css';
import './index.css';
import './main.css';

class Footer extends Component {
  
    render() {
      return (
        <div className="app">
            <ion-footer>
            <ion-toolbar>
                <b>Copyright</b>
            </ion-toolbar>
            </ion-footer>
        </div>
      );
    }
  }
  
  export default Footer;
  