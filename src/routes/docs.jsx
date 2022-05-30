import React, {useEffect, useState} from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import globeEndpointPath from "../GlobalVar";

var clicked;
function hhFunction(e) {  
  
  if (!clicked) {
    clicked = true;
    var calendar = document.querySelector('ion-datetime');
    if (calendar) {
    }
    clicked = false;
  }
}

window.onclick = (event) => {
  if (document.getElementById("submitAppt")) {
    document.getElementById("submitAppt").addEventListener("click", hhFunction);
  }
};

hhFunction();
window.onload = (event) => {
  hhFunction();
};

export default function MyDocs () {
  async function successToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'New Data Has Been Set.';
		toast.duration = 2000;
		document.body.appendChild(toast);
		return toast.present();
	}

  async function emptyToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'Please fill all input!';
		toast.duration = 2000;
		document.body.appendChild(toast);
		return toast.present();
	}

	async function failedToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'Something Went Wrong.';
		toast.duration = 5000;
		document.body.appendChild(toast);
		return toast.present();
	}
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    criteriaMode: "all"
  });
  const onSubmit = (data) => validate(data);

  const [docs, setDocs] = useState([])

// Token validation
const validate = () => {
  var data = JSON.stringify([
      {
        "token": localStorage.getItem('admin')
      }
  ]);
  axios({
          method: 'post',
          url: globeEndpointPath+'adminvalidation.php',
          data: data,
          config: {
              headers: {
                  'Content-Type': 'application/json'
              }
          }
        })
        .then(function (response) {
          //handle success
          if (response.status === 202) {
            handleFormSubmit();
          } if (response.status === 200) {
              localStorage.removeItem('admin');
              window.location.replace("/");
          }
       })
       .catch(function (response) {
         //handle error
        failedToats();
       });
}

  useEffect(() => {
    const url = globeEndpointPath+'appt.php'
    axios.get(url).then(response => response.data)
    .then((data) => {
      //setState({ docs: data })
      setDocs(data)
     })
  },[]) 

  const handleFormSubmit = (event) => {
    //event.preventDefault();
    var data = JSON.stringify([
      {
        "docID": 1,
        "patient_ref": document.getElementById("refID").value,
        "location": document.getElementById("location").value,
        "date": document.querySelector('ion-datetime').value
      }
    ]);
    
    var config = {
      method: 'post',
      url: globeEndpointPath+'appt.php',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    axios(config)
      .then(function (response) {
        //handle success
        if (response.status === 201) {
          successToats();
        } 
        if (response.status === 500) {
          emptyToats()
        }
      })
      .catch(function (response) {
        //handle error
        failedToats()
      });
  }

  
  return (
  <main>    
      <ion-tabs class="hydrated">
      <ion-tab tab="music" role="tabpanel" aria-labelledby="tab-button-music" class="ion-page hydrated">
        <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
          <ion-toolbar class="toolbar-time-default ios in-toolbar hydrated">
            <ion-title class="ios time-default hydrated">Doctors</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content fullscreen="" class="ion-padding ios hydrated">  
        <ion-item-group>
          <ion-searchbar id="search" animated show-cancel-button="focus"></ion-searchbar>
          {docs.map((appt, index) => (
          <ion-card key={index}>
            <ion-item class="box" href="#">
                <ion-label>{appt.name}</ion-label><br/>
                <ion-card-subtitle>{appt.date}</ion-card-subtitle>
            </ion-item>
          </ion-card>
          ))}
        </ion-item-group>
        </ion-content>
      </ion-tab>

      <ion-tab tab="movies" role="tabpanel" aria-hidden="true" aria-labelledby="tab-button-movies" class="ion-page tab-hidden hydrated">
        <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
          <ion-toolbar class="toolbar-time-default ios in-toolbar hydrated">
            <ion-title class="ios time-default hydrated">Appointments</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content fullscreen="" class="ion-padding ios hydrated">
        <center><h2>Book Appointment</h2></center>
        <form onSubmit={handleSubmit(onSubmit)}>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-datetime id="time" presentation="time-date" size="cover"></ion-datetime>
            </ion-item>
          </ion-col>
        </ion-row>
        <div id="errorTime"></div>
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Location</ion-label>
              <ion-input {...register("multipleErrorInput", {
                required: "This input is required.",
                pattern: {
                  value: /(\b(?:(?!\s{2,}).)*)\b(VIC|NSW|ACT|QLD|NT|SA|TAS|WA).?\s*(\b\d{4})/,
                  message: "Not corrrect location!"
                },
                minLength: {
                  value: 11,
                  message: "This input must exceed 10 characters"
                }
              })} id="location"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        <ErrorMessage
        errors={errors}
        name="multipleErrorInput"
        render={({ messages }) => {
          return messages
            ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
            : null;
        }}
      />
        <ion-row>
          <ion-col>
            <ion-item>
              <ion-label position="floating">Patient Ref ID</ion-label>
              <ion-input {...register("patientErrorInput", {
                required: "This input is required.",
                pattern: {
                  value: /^(?=(.*\d+){2})[A-Z0-9]{5,20}$/,
                  message: "Make sure it contains min of 5 and max of 20 characters (all capitalised) that includes at least 2 digits anywhere."
                },
                minLength: {
                  value: 5,
                  message: "This input must exceed 4 characters"
                },
                maxLength: {
                  value: 20,
                  message: "This input must NOT exceed 20 characters"
                }
              })} id="refID"></ion-input>
            </ion-item>
          </ion-col>
        </ion-row>
        
        <ErrorMessage
        errors={errors}
        name="patientErrorInput"
        render={({ messages }) => {
          return messages
            ? Object.entries(messages).map(([type, message]) => (
                <p key={type}>{message}</p>
              ))
            : null;
        }}
      />
        <ion-row>
          <div className="btnWrapper">
          <ion-button type="submit" id="submitAppt" color="primary">Add Appointment</ion-button>
          </div>
        </ion-row>
        </form>
        <center><h2>Appointments</h2></center>
          <ion-item-group>
          <ion-searchbar id="search" animated show-cancel-button="focus"></ion-searchbar>
          {docs.map((doc, index) => (
            <ion-card key={index}>
            <ion-label>
              <ion-card-subtitle>Location: <h3>{doc.location}</h3></ion-card-subtitle>
              <ion-card-subtitle>Date: <h3>{doc.date}</h3></ion-card-subtitle>     
            </ion-label>             
              <div className="btnWrapper">
                <ion-button color="danger" size="small">Cancel <ion-icon name="close"></ion-icon></ion-button> 
              </div> 
          </ion-card>
          ))}
          </ion-item-group>
        </ion-content>
      </ion-tab>

      <ion-tab-bar slot="top" role="tablist" class="ios hydrated">
        <ion-tab-button tab="music" role="tab" tabindex="0" aria-selected="true" id="tab-button-music" class="ios tab-selected tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
          <ion-label>Doctors</ion-label>
          <ion-icon name="fitness" aria-label="fitness" role="img" class="ios hydrated"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="movies" role="tab" tabindex="0" id="tab-button-movies" class="ios tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
          <ion-label>Appointments</ion-label>
          <ion-icon name="calendar" aria-label="calendar" role="img" class="ios hydrated"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </main>
  );
  
}   