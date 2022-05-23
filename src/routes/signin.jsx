import React from "react";
import { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import Header from "../header";
import axios from "axios";

if (document.getElementById('signIn')) {
	document.getElementById('signIn').disabled = true;
	document.getElementById('signIn').style.cursor = 'not-allowed'
}
const SignIn = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState()
	const handleSubmit = () => {
		let formData = new FormData();
		formData.append('patient_ref', document.getElementById("patient_ref").value)
		formData.append('password', document.getElementById("password").value)
		axios({
			method: 'post',
			url: 'https://medhx.herokuapp.com/controller/signin.php/',
			data: formData,
			config: { headers: { 'Content-Type': 'multipart/form-data' } }
		})
			.then(function (response) {
				//handle success
				if (response.status === 202) {
					// set the state of the user
					setUser(response.data)
					localStorage.setItem('user', response.data);
				}
			})
			.catch(function (response) {
				//handle error
				console.log(response)
			});
	}

	useEffect(() => {
		const loggedInUser = localStorage.getItem('user');
		if (loggedInUser) {
			const foundUser = loggedInUser;
			// axios post fetch userLogginDetails

			//Check against eachother
			//If correct set User
			setUser(foundUser);
			//Remove any user data
		}
	}, []);
	
	if (user) {
		return (
			<Navigate to="/profile" replace={true} />
		)
	}
	return (
		<main>
			<Header />
			<center>
				<h2>Sign In</h2>
				<form onSubmit={validation}>
					<ion-row>
						<ion-col>
							<ion-item>
								<ion-label position="floating">My Patient Reference Number</ion-label>
								<ion-input onInput={validation} onChange={({ target }) => setUsername(target.value)} value={username} id="patient_ref"></ion-input>
							</ion-item>
						</ion-col>
					</ion-row>
					<div id="errorPatient"></div>
					<ion-row>
						<ion-col>
							<ion-item>
								<ion-label position="floating">Password</ion-label>
								<ion-input onInput={validation} onChange={({ target }) => setPassword(target.value)} value={password} id="password" type="password"></ion-input>
							</ion-item>
						</ion-col>
					</ion-row>
					<div id="errorPassword"></div>
					<ion-row>
						<ion-button onClick={handleSubmit} id="signIn" expand="full" color=""
							class="ion-color ion-color-secondary ios button button-full button-solid ion-activatable ion-focusable hydrated">
							Sign In
						</ion-button>
					</ion-row>
				</form>
			</center>
		</main>
	);
	function validation() {
		var patientRegex = /^(?=(.*\d+){2})[A-Z0-9]{5,20}$/;
		var fileRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		var patient_ref = document.getElementById("patient_ref").value;
		var password = document.getElementById("password").value;
		var fileMsg = document.getElementById("errorPassword");
		var patientMsg = document.getElementById("errorPatient");
		if (fileRegex.test(password) !== true && password.length > 0) {
			fileMsg.innerHTML = "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters";
		} else {
			fileMsg.innerHTML = "";
		}
		if (patientRegex.test(patient_ref) !== true && patient_ref.length > 0) {
			patientMsg.innerHTML = "Make sure it contains min of 5 and max of 20 characters (all capitalised) that includes at least 2 digits anywhere.  <p> E.g.: NUH7YTKJ4 </p>";
		} else {
			patientMsg.innerHTML = "";
		}
		if (fileRegex.test(password) === true && patientRegex.test(patient_ref) === true) {
			document.getElementById('signIn').removeAttribute('disabled');
			document.getElementById('signIn').style.cursor = 'default'
		} else {
			document.getElementById('signIn').disabled = true;
			document.getElementById('signIn').style.cursor = 'not-allowed'
		}
	}
}
export default SignIn;

