import Footer from "../footer";
//import landing from "../img/landing.svg";
import one from "../img/one.svg";
import doc from "../img/doc.svg";
import accept from "../img/accept.svg";
import React from "react";
const LandingPage = () => {
    return (
      <main>
        <ion-tabs>
          <ion-tab tab="tab-schedule">
            <ion-content fullscreen="" class="ion-padding ios hydrated">
            {/*<img src={landing} alt="Landing"></img>*/}
            <center><h2>Welcome to medHX</h2></center>
            <ion-slides pager="true">
              <ion-slide>
                <img src={one} alt=""/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus voluptatum optio repellat, ducimus cumque, quas cum sit culpa non natus labore ea, quae nostrum magni sint asperiores provident aperiam et.</p>
              </ion-slide>

              <ion-slide>
                <img src={doc} alt=""/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus voluptatum optio repellat, ducimus cumque, quas cum sit culpa non natus labore ea, quae nostrum magni sint asperiores provident aperiam et.</p>
              </ion-slide>

              <ion-slide>
                <img src={accept} alt=""/>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus voluptatum optio repellat, ducimus cumque, quas cum sit culpa non natus labore ea, quae nostrum magni sint asperiores provident aperiam et.</p>
              </ion-slide>
            </ion-slides>
            </ion-content>
          </ion-tab>
        </ion-tabs>
        <Footer/>
      </main>
    );
}
export default LandingPage;