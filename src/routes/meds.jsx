import React from "react";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
function Meds() {
  const protocol = (window.location.protocol === 'https') ? 'https://' : 'http://';
  //creating IP state
  const [ip, setIP] = useState('');
  const [meds, setMed] = useState([]);
  const [messages, setMessages] = useState([]);
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    criteriaMode: "all"
  });
  const onSubmit = (data) => validate(data);

  useEffect(() => {
    //creating function to load ip address from the API
    const getData = async () => {
      //const protocol = (window.location.protocol === 'http') ? 'https://' : 'http://';
      const res = await axios({
        method: 'get',
        url: 'https://medhx.herokuapp.com/controller/ip.php',
        dataType: "JSON",
        //withCredentials: true,
      })
      if ((res.status = 200)) {
        console.log(res.status + " = " + res.statusText);
        console.log(res.data);
        window.addEventListener('offline', (event) => {
          setIP(localStorage.getItem('localhost'))
        });
        window.addEventListener('online', (event) => {
          setIP(res.data)
        });
      }
    }
    getData();
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      const url = 'https://medhx.herokuapp.com/controller/meds.php/'
      const res = await axios.get(url)
      setMed(res.data)
    }
    fetchPost();
  }, []);
 
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
       .catch(function (response) {
         //handle error
         alert('Something went wrong!')
         console.log(response)
       });
}


  const handleFormSubmit = () => {
    var data = JSON.stringify([
      {
        "patient_ref": document.getElementById("patientRef").value,
        "med_name": document.getElementById("medName").value,
        "dose": document.getElementById("dose").value
      }
    ]);
    
    var config = {
      method: 'post',
      url: 'https://medhx.herokuapp.com/controller/meds.php',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
      .then(function (response) {
        //handle success
        alert('New Medicine Successfully Added.');
      })
      .catch(function (response) {
        //handle error
        alert('Something went wrong!')
        console.log(response)
      });
  }

  // At the beginning, posts is an empty array
  const [listMeds, setDrugs] = useState([]);
  const [load, setLoad] = useState(false);
  const [, setError] = useState('');
  // Trigger the fetchData after the initial render by using the useEffect hook
  useEffect(() => {
    // The REST API endpoint
    const API_URL = 'https://rxnav.nlm.nih.gov/REST/allstatus.json?status=active';
    // Define the function that fetches the data from API
    axios.get(API_URL,{
        params: {
          
        }
      })
      .then(result => {
        //.slice(0, 1000)
        setDrugs((result.data.minConceptGroup.minConcept.slice(0, 30)));
        setLoad(true);
      })
      .catch(err => {
        setError(err.message);
        setLoad(true)
      })
  }, []);

  if (load) {
    return (
      <main>
          <ion-tabs class="hydrated">
            <ion-tab tab="music" role="tabpanel" aria-labelledby="tab-button-music" class="ion-page hydrated">
              <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
                <ion-toolbar class="toolbar-title-default ios in-toolbar hydrated">
                  <ion-title class="ios title-default hydrated">Medication(s)</ion-title>
                </ion-toolbar>
              </ion-header>
              <ion-content fullscreen="" class="ion-padding ios hydrated">
                <ion-card>
                  <ion-card-header>
                      <div className="btnWrapper">
                        <ion-button color="tertiary">Reminder <ion-icon name="alarm"></ion-icon></ion-button>
                      </div>
                  </ion-card-header>

                  <ion-card-content>
                    <ion-list>
                      {meds.map(x =>
                        <ion-item key={x.medID}>
                          <ion-label>
                            <ion-card-subtitle>Medicine: {x.med_name}</ion-card-subtitle>
                            <ion-card-subtitle>Next dose: </ion-card-subtitle>
                            <ion-card-subtitle>Dose: {x.dose}</ion-card-subtitle>
                            <div className="btnWrapper">                            
                              <ion-button color="tertiary">Edit <ion-icon name="close"></ion-icon></ion-button>
                              <ion-button color="danger">Remove <ion-icon name="trash"></ion-icon></ion-button>
                            </div>  
                          </ion-label>
                        </ion-item>
                      )}
                    </ion-list>
                  </ion-card-content>
                </ion-card>
              </ion-content>
            </ion-tab>
            
            <ion-tab tab="movies" role="tabpanel" aria-hidden="true" aria-labelledby="tab-button-movies" class="ion-page tab-hidden hydrated">
              <ion-header translucent="" role="banner" class="ios header-ios header-translucent header-collapse-none header-translucent-ios hydrated"><div className="header-background"></div>
                <ion-toolbar class="toolbar-title-default ios in-toolbar hydrated">
                  <ion-title class="ios title-default hydrated">Manage Medicine(s)</ion-title>
                </ion-toolbar>
              </ion-header>
              <ion-content fullscreen="" class="ion-padding ios hydrated">
                <ion-card>
                <form onSubmit={handleSubmit(onSubmit)} id="form">
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="floating">Dose</ion-label>
                        <ion-input {...register("doseErrorInput", {
                          required: "This input is required.",
                          pattern: {
                            value: /^([0-9A-Z.]{1,})$/,
                            message: "Not correct dose!"
                          },
                          minLength: {
                            value: 1,
                            message: "This input must exceed 0 characters"
                          },
                          maxLength: {
                            value: 4,
                            message: "This input must NOT exceed 4 characters"
                          }
                        })} id="dose"></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ErrorMessage
                    errors={errors}
                    name="doseErrorInput"
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
                        })} id="patientRef"></ion-input>
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
                    <ion-col>
                      <ion-item>
                        <div className="searchbar-input-container sc-ion-searchbar-md">
                          <ion-label position="floating">Patient Ref ID</ion-label>
                          <ion-input {...register("medErrorInput", {
                          required: "This input is required.",
                          pattern: {
                            value: /(\[|\]\w)|([A-Z0-9a-z ])\w+/,
                            message: "Not correct medicie input"
                          },
                          minLength: {
                            value: 3,
                            message: "This input must exceed 3 characters"
                          },
                        })} id="medName" animated show-cancel-button="focus" type="text" placeholder="Search Medicine"></ion-input>
                        </div>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ErrorMessage
                    errors={errors}
                    name="medErrorInput"
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
                    <ion-button type="submit" id="submitMed" color="primary">Add Medicine</ion-button>
                    </div>
                  </ion-row>
                  <ion-row>
                  </ion-row>
                  </form>
                  <div className="showcaseDrugs">
                  {listMeds &&
                    listMeds.map((meds) => (
                      <div className="meds" key={meds.rxcui}>
                        {meds.name}
                      </div>
                    ))}
                </div>
                </ion-card>   
              </ion-content>
            </ion-tab>

            <ion-tab-bar slot="top" role="tablist" class="ios hydrated">
              <ion-tab-button tab="music" role="tab" tabindex="0" aria-selected="true" id="tab-button-music" class="ios tab-selected tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
                <ion-label>Medication(s)</ion-label>
                <ion-icon name="heart" aria-label="heart" role="img" class="ios hydrated"></ion-icon>
              </ion-tab-button>
              <ion-tab-button tab="movies" role="tab" tabindex="0" id="tab-button-movies" class="ios tab-has-label tab-has-icon tab-layout-icon-top ion-activatable ion-selectable ion-focusable hydrated">
                <ion-label>Manage Medicine(s)</ion-label>
                <ion-icon name="medkit" aria-label="medkit" role="img" class="ios hydrated"></ion-icon>
              </ion-tab-button>
            </ion-tab-bar>
          </ion-tabs>
        </main>
    )
  } else {
    return (
      <>
        <div id="loader">
          <center><ion-spinner name="crescent"></ion-spinner></center>
        </div>
      </>
    );    
  }
}
// (A) FLAG FOR "ALREADY CLICKED".
var clicked = false;
// (B) FUNCTION - WILL ONLY RUN IF NOT CLICKED
function filterRecords() {
	if (!clicked) {
		// (B1) SET CLICKED TO TRUE
		clicked = true;
		let cards = document.querySelectorAll('.meds')
		// (B2) DO YOUR PROCESSING HE
		function liveSearch() {
			if (searchInput) {
				let search_query = document.getElementById("medName").value;
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
		let searchInput = document.getElementById('medName');
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
		let cards = document.querySelectorAll('.meds');
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
const filterBar = document.getElementById('medName');
if (filterBar) {
	filterRecords()
}
export default Meds;