import React from "react";
import Footer from "../footer";


export default function Guide () { 
    return (
        <main>
        <div id="guide">
        <center><h1>A Walkthrough Guide</h1></center>
            <h2>Introduction - MEDHX</h2>
            <p>
                A medical based PWA where the doctors and patients can interact with eachother online.
                With this application the users will be able to send and receive important information such as
                appointments, medical records, and medications (including dose). Doctors can manage their
                patients medcation(s), appointment(s) and medical report(s). Patients can view their medical history
                follow medications and see the upcoming and past appointments.
            </p>
            <h2>Guide</h2>
            <h3>/dashboard</h3>
            <p>
                <ion-icon name="person-circle"></ion-icon><br/>
                Under the Profile section as an admin you are able to filter and manage existing users.
                Delete their emergency contact and update their personal name (if needed).
                The filter will filter by the title of the report.
            </p>
            <p>
                <ion-icon name="document-text"></ion-icon><br/>
                Under the Reports tab, the admin (currently) can add new document (only in pdf format) for a 
                selected patient and remove or edit extisting reports from the database. The filder will filter
                by the name of the user.
            </p>
            <h3>/meds</h3>
            <p>
                <ion-icon name="heart"></ion-icon><br/>
                Medication(s): <br/>
                Edit or remove the medication from a patient as a doctor or admin (currently).
                The patient can see their medication list from the doctor.
            </p>
            <p>
                <ion-icon name="medkit"></ion-icon><br/>
                Manage Medication(s): <br/>
                A doctor is able to add a medication for a patient. 
                There is a built-in filter function for the listed medications.
            </p>
            <h3>/docs</h3>
            <p>
                <ion-icon name="fitness"></ion-icon><br/>
                Doctors:<br/>
                Listed doctors with appointments being listed here.
            </p>
            <p>
                <ion-icon name="calendar"></ion-icon><br/>
                Appointments:<br/>
                Appointments can be added here for a patients and below will be shown. 
                Date must have to be selected.
            </p>
            <h3>/add</h3>
            <p>
                New patient can be added on this sesction.
            </p>
        </div>
        <footer>
            <Footer/>
        </footer>
        </main>
    );
}