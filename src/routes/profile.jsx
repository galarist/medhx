import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import globeEndpointPath from "../GlobalVar";
const Profile = () => {
	async function successToats() {
		const toast = document.createElement('ion-toast');
		toast.message = 'New Data Has Been Set.';
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

		/**
		 *  states
		 */
		const [report, setReport] = useState('')
		const [title, setTitle] = useState('')
		const [user, setUser] = useState('')
		const [userName, setUserName] = useState('')
		const [reports, setReports] = useState([]);
		const [profile, setProfile] = useState([]);
		/** Getting profile information */
		useEffect(()=> {
			// Get profile info
			const urlProfile = globeEndpointPath+'profile.php'
				axios.get(urlProfile)
				.then(result => {
					setProfile((result.data));
				})
		}, []);
		/** Getting reports information */
		useEffect (() => {
			// Get reports info
			const url = globeEndpointPath+'reports.php'
			axios({
					method: 'get',
					url: url,
				})
				.then(response => response.data)
				.then((data) => {
					setReports(data);
				})
				.catch(function (error) {
					/*if (error.response) {
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					}*/
				});
		// eslint-disable-next-line
		}, [])
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
}


		/** New Report */
		const handleFormSubmit = (event) => {
			var data = JSON.stringify([
				{
					"report_title": document.getElementById('reportTitle').value,
				  	"patient_ref": document.getElementById("refID").value,
				  	"report": document.getElementById("fileName").value
				}
			  ]);
			  
			  var config = {
				method: 'post',
				url: globeEndpointPath+'reports.php',
				data : data
			  };
			  
			  axios(config)
				.then(function (response) {
				//handle success
				successToats();
				})
				.catch(function (response) {
				  //handle error
				  failedToats();
				});
				/** Display new report */
				axios({
					method: 'get',
					url: globeEndpointPath+'reports.php',
				})
				.then(response => response.data)
				.then((data) => {
					setReports(data);
				})
		}
		/** Passing value from attribute to input */
		const titleHandler = (event) => {
			const scrollTo = document.querySelector("#reportTitle");
			scrollTo.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"})
			setTitle((prevState) => ({...prevState, title:event.target.title}));
			//console.log(event.target.title);
			setReport((prevState) => ({...prevState, report:event.target.id}));
			//console.log(event.target.id);
		}
		const handleFormUpdate = (event) => {
			var titleValue = document.getElementById('reportTitle').value
			event.preventDefault();			  
			  var data = JSON.stringify([
				{
				  "updateID": report.report,
				  "title": titleValue
				}
			  ]);
			  
			  var config = {
				method: 'patch',
				url: globeEndpointPath+'reports.php',
				headers: { 
				  'Content-Type': 'application/json'
				},
				data : data
			  };

			  axios(config)
			  	.then(function (response) {
					successToats();
			  	})
			  .catch(function (error) {
					failedToats();
			  });
		}

		const handleFormDelete = (event) => {
			var data = JSON.stringify([
				{
				  "removeID": event
				}
			  ]);
			  
			  var config = {
				method: 'delete',
				url: globeEndpointPath+'reports.php',
				headers: { 
				  'Content-Type': 'application/json'
				},
				data : data
			  };
			  
				axios(config)
				.then(function (response) {
					successToats();
				})
			  .catch(function (error) {
					failedToats();
			  });
		}

	const userHandlerRemove = (event) => {
		// Don't follow the link
		event.preventDefault();
		
		var data = JSON.stringify([{
			"removeID": event.target.id
		}]);
	
		var config = {
			method: 'delete',
			url: globeEndpointPath+'profile.php',
			headers: {
				'Content-Type': 'application/json'
			},
			data: data
		};
	
		axios(config)
			.then(function (response) {
				successToats();
			})
			.catch(function (error) {
				failedToats();
			});
	}

	const confirmUpdate = (event) => {
		event.preventDefault();
		var name = document.getElementById("fullName").value
		var contact = document.getElementById("contactNumber").value;
		var userID = event.target.getAttribute('value');
		var data = JSON.stringify([
			{
			"userID": userID,
			"name": name,
			"contact": contact
			}
	  	]);
	  
	  var config = {
		method: 'patch',
		url: globeEndpointPath+'profile.php',
		headers: { 
		  'Content-Type': 'application/json'
		},
		data : data
	  };

		axios(config)
		.then(function (response) {
			successToats();
		})
		.catch(function (error) {
			failedToats();
		});
	}

	const userHandlerUpdate = (event) => {
		event.preventDefault();
		document.getElementById('fullName').value = event.target.title;
		document.getElementById('contactNumber').value = event.target.getAttribute('number');
		document.getElementById('updateProfile').setAttribute('value', event.target.id);
		const scrollTo = document.querySelector("#fullName");
		scrollTo.scrollIntoView({behavior: "auto", block: "end", inline: "nearest"})
	}

		// Filter users
		useEffect(()=> {
			function filterRecords() {
				let cards = document.querySelectorAll('.userList .userName')
				let cardsWrap = document.querySelectorAll('.userList')
				function liveSearch() {
					if (searchInput) {
						let search_query = document.getElementById("searchboxUsers").value;
						//Use innerText if all contents are visible
						//Use textContent for including hidden elements
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].textContent.toLowerCase()
								.includes(search_query.toLowerCase())) {
								cardsWrap[i].classList.remove("is-hidden");
							} else {
								cardsWrap[i].classList.add("is-hidden");
								cancelSearch()
							}
						}
					}
				}
				//A little delay
				let typingTimer;
				let typeInterval = 300;
				let searchInput = document.getElementById('searchboxUsers');
				// Check if input exists
				if (searchInput) {
					searchInput.addEventListener('input', () => {
						clearTimeout(typingTimer);
						typingTimer = setTimeout(liveSearch, typeInterval);
					});
				}
				setTimeout(function () {
					liveSearch()
				}, 300);
			}

			function cancelSearch() {
				let buttonClose = document.querySelector('.searchbar-clear-icon');
				let cards = document.querySelectorAll('.userList');
				if (buttonClose) {
					buttonClose.addEventListener('touchend', function (e) {
						for (var i = 0; i < cards.length; i++) {
							cards[i].classList.remove("is-hidden");
						}
					});
					buttonClose.addEventListener('click', function (e) {
						for (var i = 0; i < cards.length; i++) {
							cards[i].classList.remove("is-hidden");
						}
					});
				}
			}
			filterRecords();
		})
		// Filter reports
		useEffect(()=> {
			function filterRecords() {
				let cards = document.querySelectorAll('.box span')
				let cardsWrap = document.querySelectorAll('.box')
				function liveSearch() {
					if (searchInput) {
						let search_query = document.getElementById("searchboxReports").value;
						//Use innerText if all contents are visible
						//Use textContent for including hidden elements
						for (var i = 0; i < cards.length; i++) {
							if (cards[i].textContent.toLowerCase()
								.includes(search_query.toLowerCase())) {
								cardsWrap[i].classList.remove("is-hidden");
							} else {
								cardsWrap[i].classList.add("is-hidden");
								cancelSearch()
							}
						}
					}
				}
				//A little delay
				let typingTimer;
				let typeInterval = 300;
				let searchInput = document.getElementById('searchboxReports');
				// Check if input exists
				if (searchInput) {
					searchInput.addEventListener('input', () => {
						clearTimeout(typingTimer);
						typingTimer = setTimeout(liveSearch, typeInterval);
					});
				}
				setTimeout(function () {
					liveSearch()
				}, 300);
			}

			function cancelSearch() {
				let buttonClose = document.querySelector('#searchboxReports .searchbar-clear-icon');
				let cards = document.querySelectorAll('.box');
				if (buttonClose) {
					buttonClose.addEventListener('touchend', function (e) {
						for (var i = 0; i < cards.length; i++) {
							cards[i].classList.remove("is-hidden");
						}
					});
					buttonClose.addEventListener('click', function (e) {
						for (var i = 0; i < cards.length; i++) {
							cards[i].classList.remove("is-hidden");
						}
					});
				}
			}
			filterRecords();
		})

    return (
    <main>
        <ion-tabs class="hydrated">
        <ion-tab tab="music" role="tabpanel" aria-labelledby="tab-button-music" class="ion-page hydrated">
          <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
            <ion-toolbar class="toolbar-title-default ios in-toolbar hydrated">
              <ion-title class="ios title-default hydrated">Profile Details</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen="" class="ion-padding ios hydrated">  
		  	{/** Profile Information */}
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="floating">Full Name</ion-label>
                  <ion-input id="fullName"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>            
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="floating">Contact</ion-label>
                  <ion-input id="contactNumber"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
            <ion-row>
              <div className="btnWrapper">
              <ion-button onClick={confirmUpdate} id="updateProfile" type="submit" color="primary">Update</ion-button>
			  </div>
            </ion-row>
			
			<ion-searchbar id="searchboxUsers" show-cancel-button="never" placeholder="Filter User(s)"></ion-searchbar>
			{profile.map((prof, index) => 
            <ion-card class="userList card" key={index}>
                <ion-card-header>  
					<ion-list>
						<ion-label>
							<h2>
								Name:
							</h2>
							<h2 id="name" className="userName data" key={prof.userID}>{prof.name}</h2>
						</ion-label>
						<ion-label>
							<h2>
								Contact:
							</h2>
							<h2 id="phone" className="data" key={prof.userID}>{prof.contact}</h2>
						</ion-label>
					<div className="btnWrapper">
						<ion-button onClick={e => userHandlerUpdate(e)} id={prof.userID} title={prof.name} number={prof.contact} color="tertiary" class="button-small">Edit</ion-button>
						<ion-button onClick={e => userHandlerRemove(e)} id={prof.userID} color="danger" class="button-small">Remove Contact</ion-button>
					</div> 
					</ion-list>
					<div className="btnWrapper"><div className="save"></div></div>
                </ion-card-header>
            </ion-card>
			)}
          </ion-content>
        </ion-tab>

        <ion-tab tab="movies" role="tabpanel" aria-hidden="true" aria-labelledby="tab-button-movies" class="ion-page tab-hidden hydrated">
          <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
            <ion-toolbar class="toolbar-title-default ios in-toolbar hydrated">
              <ion-title class="ios title-default hydrated">Reports</ion-title>
            </ion-toolbar>
          </ion-header>

          <ion-content fullscreen="" class="ion-padding ios hydrated">
			  {/** Input Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
            <ion-row>
              <ion-col>
                <ion-item>
                  <ion-label position="floating">Report Title</ion-label>
                  <ion-input  {...register("titleErrorInput", {
						required: "This input is required.",
						pattern: {
						value: /^([A-Za-z0-9-_]{1,})$/,
						message: "Not correct title!"
						},
						minLength: {
						value: 1,
						message: "This input must exceed 1 characters"
						}
					})} id="reportTitle" value={title.title}></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
            
        <ErrorMessage
			errors={errors}
			name="titleErrorInput"
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
                  <ion-label position="fixed">Report</ion-label>
                  <ion-input {...register("fileErrorInput", {
						required: "This input is required.",
						pattern: {
						value: /^([A-Z]+[:]+\\[a-z]+\\([\w-_ .':]+.pdf))$/,
						message: "Not correct file format or name file! Must be a pdf file!"
						},
						minLength: {
						value: 5,
						message: "This input must exceed 4 characters"
						}
					})} id="fileName" type="file"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>
			<ErrorMessage
				errors={errors}
				name="fileErrorInput"
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
			  <ion-button type="submit" onClick={handleFormSubmit} id="submitReport" color="primary">Upload</ion-button>
              <ion-button type="submit" onClick={handleFormUpdate} id="updateReport" color="primary" value={report.report}>Update</ion-button>
			  </div>
            </ion-row>
            </form>
            <ion-searchbar id="searchboxReports" show-cancel-button="never" placeholder="Filter Record(s)"></ion-searchbar>
            {/** Reports */}
            {reports.map((report, index) => (
            <ion-card class="box" key={report.repID} id={report.repID}>
				<ion-item>
                <ion-label className="reportContent">
					<h2>Subject: <br /><span>{report.report_title}</span></h2>
					<h2>Date: {report.reportDate}</h2>
					<div className="btnWrapper">
						<ion-button onClick={titleHandler} title={report.report_title} id={report.repID} color="tertiary">Edit</ion-button>
						{/*<ion-button onClick={reportHandler} title={report.repID} id={report.repID} color="tertiary">Remove</ion-button>*/}
						{/*<ion-button onClick={e => (setReport(e.target.id) console.log(e.target.id))} id={report.repID} color="tertiary">Remove</ion-button>*/}						
						{/*<ion-button onClick={e => (setReport(e.target.id), handleFormDelete(e.target.id))} id={report.repID} color="tertiary">Remove</ion-button>*/}
						<ion-button onClick={(e) => {setReport(e.target.id);handleFormDelete(e.target.id);}} id={report.repID} color="danger">Remove</ion-button>
					</div>      
                </ion-label><br/>
				</ion-item>
            </ion-card>
                ))}
          </ion-content>
        </ion-tab>

        <ion-tab-bar slot="top" role="tablist" class="ios hydrated">
          <ion-tab-button tab="music" role="tab" tabindex="0" aria-selected="true" id="tab-button-music" class="ios tab-selected tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
            <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated">Profile</ion-label>
            <ion-icon name="person-circle" aria-label="person-circle" role="img" class="ios hydrated"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="movies" role="tab" tabindex="0" id="tab-button-movies" class="ios tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
            <ion-label class="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated">Reports</ion-label>
            <ion-icon name="document-text" aria-label="document-text" role="img" class="ios hydrated"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </main>
    );
}

export default Profile;
