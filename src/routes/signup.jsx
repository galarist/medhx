import React from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import globeEndpointPath from "../GlobalVar";
function NewPatient() {
  async function successToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'New Data Has Been Set.';
		toast.duration = 2000;
		document.body.appendChild(toast);
		return toast.present();
	}
  async function failedToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'Patient already exists! \nCheck either Reference number or email!';
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

  const handleFormSubmit = (event) => {
    var data = JSON.stringify([
      {
        "role": "p",
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value,
        "patient_ref": document.getElementById("patient_ref").value,
      }
    ]);
    axios({
      method: 'post',
      url: globeEndpointPath+'signup.php',
      data: data,
      config: { headers: { 'Content-Type': 'application/json' } }
    })
      .then(function (response) {
        //handle success
        if (response.status === 201) {
          successToats();
        } else if (response.status === 200) {
          failedToats();
        }
      })
      .catch(function (response) {
        //handle error
        failedToats();
      });
  }

  return (
  <main>
    <center><h2>Add Patient</h2></center>
    <form onSubmit={handleSubmit(onSubmit)}>
    <ion-grid>
    <ion-row>
      <ion-col>
        <ion-item>
          <ion-label position="floating">Name</ion-label>
            <ion-input {...register("nameErrorInput", {
                required: "This input is required.",
                pattern: {
                  value: /^([A-Z][a-z]{1,}) ([A-Z][a-z]{1,})$/,
                  message: "Not correct name E.g.: John Doe"
                },
                minLength: {
                  value: 1,
                  message: "This input must exceed 1 characters"
                }
              })} id="name" type="text"></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
    <ErrorMessage
      errors={errors}
      name="nameErrorInput"
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
          <ion-label position="floating">Email</ion-label>
            <ion-input {...register("emailErrorInput", {
                required: "This input is required.",
                pattern: {
                  value: /^[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                  message: "Not correct email!"
                },
                minLength: {
                  value: 2,
                  message: "This input must exceed 2 characters"
                }
              })} id="email" type="text"></ion-input>
        </ion-item>
      </ion-col>
    </ion-row>
    <ErrorMessage
      errors={errors}
      name="emailErrorInput"
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
              })} id="patient_ref"></ion-input>
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
      <ion-button type="submit" color="primary">Add Patient</ion-button>
    </div>
    </ion-row>
    </ion-grid>
    </form>
  </main>
  );
  
}
export default NewPatient;