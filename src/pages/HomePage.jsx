import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import Navigation from "../components/navigation/Navigation.component";
import { Welcome } from "../components/welcome/Welcome.component";

const Home = ({ currentUser }) => {
  return (
    <IonPage>
      <Navigation currentUser={currentUser} />
      {currentUser ? null : <Welcome currentUser={currentUser} />}
    </IonPage>
  );
};

export default Home;
