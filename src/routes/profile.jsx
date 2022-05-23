import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

//import Header from "../header";

//const timestamp = Date.now(); // This would be the timestamp you want to format
/*console.log('Timestamp: ' + new Intl.DateTimeFormat('en-AU', {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
}).format(timestamp));*/
//onClick={()=>{filterRecords()}}
const Profile = () => {
		/**
		 *  states
		 */
		const [report, setReport] = useState('')
		const [title, setTitle] = useState('')
		const [reports, setReports] = useState([]);
		const [profile, setProfile] = useState([]);
		/** Getting profile information */
		useEffect(()=> {
			// Get profile info
			const urlProfile = 'https://medhx.herokuapp.com/controller/profile.php/'
				axios.get(urlProfile)
				.then(result => {
					setProfile((result.data));
				})
		}, []);
		/** Getting reports information */
		useEffect (() => {
			// Get reports info
			const url = 'https://medhx.herokuapp.com/controller/reports.php/'
			axios({
					method: 'get',
					url: url,
				})
				.then(response => response.data)
				.then((data) => {
					setReports(data);
					//console.table(reports)
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
			url: 'https://medhx.herokuapp.com/controller/adminvalidation.php/',
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
				url: 'https://medhx.herokuapp.com/controller/reports.php',
				data : data
			  };
			  
			  axios(config)
				.then(function (response) {
				//handle success
				console.log(response.data)
				alert('New Report Successfully Added.');
				})
				.catch(function (response) {
				  //handle error
				  alert('Something went wrong!')
				  console.log(response)
				});
				/** Display new report */
				axios({
					method: 'get',
					url: 'https://medhx.herokuapp.com/controller/reports.php/',
				})
				.then(response => response.data)
				.then((data) => {
					setReports(data);
				})
		}
		/** Passing value from attribute to input */
		const titleHandler = (event) => {
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
				url: 'https://medhx.herokuapp.com/controller/reports.php',
				headers: { 
				  'Content-Type': 'application/json'
				},
				data : data
			  };

			  axios(config)
			  .then(function (response) {
				console.log(JSON.stringify(response.data));
			  })
			  .catch(function (error) {
				console.log(error);
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
				url: 'https://medhx.herokuapp.com/controller/reports.php',
				headers: { 
				  'Content-Type': 'application/json'
				},
				data : data
			  };
			  
			  axios(config)
			  .then(function (response) {
				console.log(JSON.stringify(response.data));
			  })
			  .catch(function (error) {
				console.log(error);
			  });
		}

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
			{profile.map(prof => 
            <ion-card className="card"  key={prof.userID}>
                <ion-card-header>  
					<div className="btnWrapper">
						<ion-button onClick={change} id="changer" color="tertiary">Edit</ion-button>
						<ion-button onClick={deleteProf} id="delete" color="tertiary">Delete Contact</ion-button>
					</div> 
					<ion-list>
						<ion-label>
							<h2>
								Name:
							</h2>
							<h2 id="name" className="data" key={prof.userID}>{prof.name}</h2>
						</ion-label>
						<ion-label>
							<h2>
								Contact:
							</h2>
							<h2 id="phone" className="data" key={prof.userID}>{prof.contact}</h2>
						</ion-label>
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
			console.log("messages", messages);
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
				console.log("messages", messages);
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
				console.log("messages", messages);
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
            <ion-card>
            <ion-searchbar id="searchbox" show-cancel-button="never" placeholder="Filter Record(s)"></ion-searchbar>
            {/** Reports */}
            {reports.map((report, index) => (
				<ion-item class="box" key={report.repID} id={report.repID}>
                <ion-label>
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
                ))}
            </ion-card>
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

function change() {
	var name = document.getElementById('name');
	var nameValue = document.getElementById('name').innerText;
	//var age = document.getElementById('age');
	//var ageValue = document.getElementById('age').innerText;
	var phone = document.getElementById('phone');
	var phoneValue = document.getElementById('phone').innerText;
	// Create a new elements
	var newNode1 = document.createElement('div');
	//var newNode2 = document.createElement('div');
	var newNode3 = document.createElement('div');
	// Add contents
	//newNode1.innerHTML = '<ion-input id="name" type="text" name="name" value="' + nameValue + '">';
	newNode1.innerHTML = `
	<ion-item>
		<ion-label>Name</ion-label>
		<ion-input id="name" type="text" name="name" value="${nameValue}"></ion-input>
	</ion-item>
	`
	//newNode2.innerHTML='<input type="text" value="'+ageValue+'">';
	newNode3.innerHTML = '<ion-input id="contact" type="text" name="contact" value="' + phoneValue + '"></ion-input>';
	newNode3.innerHTML = `
	<ion-item>
		<ion-label>Contact</ion-label>
		<ion-input id="phone" type="text" name="contact" value="${phoneValue}"></ion-input>
	</ion-item>
	`
	// Replace the current node with the new nodes
	name.parentNode.replaceChild(newNode1, name);
	//age.parentNode.replaceChild(newNode2, age);
	phone.parentNode.replaceChild(newNode3, phone);


	// Create an "li" node:
	//<ion-button onClick={change} id="changer" color="tertiary">Edit</ion-button>
	const node = document.createElement("ion-button");
	node.setAttribute('id', 'return');
	// Create a text node:
	const textnode = document.createTextNode("Save");

	// Append the text node to the "li" node:
	node.appendChild(textnode);

	// Append the "li" node to the list:
	document.querySelector('.save').appendChild(node);
	// cancel
	const cancel = document.createElement("ion-button");
	cancel.setAttribute('id', 'cancel');
	// Create a text node:
	const textCacnel = document.createTextNode("Cancel");

	// Append the text node to the "li" node:
	cancel.appendChild(textCacnel);

	// Append the "li" node to the list:
	document.querySelector('.save').appendChild(cancel);
	
}

document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#cancel')) return;

	// Don't follow the link
	event.preventDefault();


	window.location.reload();

}, false);

document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#return')) return;

	// Don't follow the link
	event.preventDefault();

	//let formData = new FormData();
	var name = document.getElementById("name").value
	var contact = document.getElementById("phone").value
	var data = JSON.stringify([
		{
		  "userID": 1,
		  "name": name,
		  "contact": contact
		}
	  ]);
	  
	  var config = {
		method: 'patch',
		url: 'https://medhx.herokuapp.com/controller/profile.php',
		headers: { 
		  'Content-Type': 'application/json'
		},
		data : data
	  };

	axios(config)
		.then(function (response) {
			window.location.reload();
		})
		.catch(function (error) {
			//console.log(error);
		});

}, false);


function deleteProf(event) {
	// Don't follow the link
	event.preventDefault();

	var data = JSON.stringify([{
		"removeID": "1"
	}]);

	var config = {
		method: 'delete',
		url: 'https://medhx.herokuapp.com/controller/profile.php',
		headers: {
			'Content-Type': 'application/json'
		},
		data: data
	};

	axios(config)
		.then(function (response) {
			window.location.reload();
		})
		.catch(function (error) {
			console.log(error);
		});

}

// (A) FLAG FOR "ALREADY CLICKED".
var clicked = false;
// (B) FUNCTION - WILL ONLY RUN IF NOT CLICKED
function filterRecords() {
	if (!clicked) {
		// (B1) SET CLICKED TO TRUE
		clicked = true;
		let cards = document.querySelectorAll('.box')
		// (B2) DO YOUR PROCESSING HE
		function liveSearch() {
			if (searchInput) {
				let search_query = document.getElementById("searchbox").value;
				//Use innerText if all contents are visible
				//Use textContent for including hidden elements
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].textContent.toLowerCase()
						.includes(search_query.toLowerCase())) {
						cards[i].classList.remove("is-hidden");
					} else {
						cards[i].classList.add("is-hidden");
						cancelSearch()
					}
				}
			}
		}
		//A little delay
		let typingTimer;
		let typeInterval = 300;
		let searchInput = document.getElementById('searchbox');
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
		// (B3) RE-ENABLE AFTER PROCESSING IF YOU WANT
		clicked = false;
	}
}

function cancelSearch() {
	if (!clicked) {
		clicked = true;
		let buttonClose = document.querySelector('.searchbar-clear-icon');
		let cards = document.querySelectorAll('.box');
		if (buttonClose) {
			buttonClose.addEventListener('touchstart', function (e) {
				for (var i = 0; i < cards.length; i++) {
					cards[i].classList.remove("is-hidden");
				}
			});
		}
		clicked = false;
	}
}
// When updating the code
const filterBar = document.getElementById('searchbox');
if (filterBar) {
	filterRecords()
}

filterRecords();
window.onload = (event) => {
	filterRecords();
};

/*function validation() {
	var titleRegex = /^([A-Za-z0-9-_]{1,})$/;
	var fileRegex = /^([A-Z]+[:]+\\[a-z]+\\([\w-_ .':]+.pdf))$/;
	var patientRegex = /^(?=(.*\d+){2})[A-Z0-9]{5,20}$/;
	var title = document.getElementById("reportTitle").value;
	var file = document.getElementById("fileName").value;
	console.log(file);
	var patient_ref = document.getElementById("refID").value;
	var titleMsg = document.getElementById("errorTitle");
	var fileMsg = document.getElementById("errorFile");
	var patientMsg = document.getElementById("errorPatient");
	if (titleRegex.test(title) !== true && title.length > 0) {
		titleMsg.innerHTML = "Not correct title!";
	} else {
		titleMsg.innerHTML = "";
	}
	if (fileRegex.test(file) !== true && file.length > 0) {
		fileMsg.innerHTML = "Not correct file format! Must be a pdf file!";
	} else {
		fileMsg.innerHTML = "";
	}
	if (patientRegex.test(patient_ref) !== true && patient_ref.length > 0) {
		patientMsg.innerHTML = "Make sure it contains min of 5 and max of 20 characters (all capitalised) that includes at least 2 digits anywhere.  <p> E.g.: NUH7YTKJ4 </p>";
	} else {
		patientMsg.innerHTML = "";
	}
	if (titleRegex.test(title) === true && fileRegex.test(file) === true && patientRegex.test(patient_ref) === true) {
		//document.getElementById('submitReport').removeAttribute('disabled');
		//document.getElementById('submitReport').style.cursor = 'default'
	} else {
		//document.getElementById('submitReport').disabled = true;
		//document.getElementById('submitReport').style.cursor = 'not-allowed'
	}
}*/

export default Profile;
