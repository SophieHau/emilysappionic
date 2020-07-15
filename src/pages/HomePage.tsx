import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import Navigation from "../components/navigation/Navigation.component";
import { Welcome } from "../components/welcome/Welcome.component";

const Home: React.FC = () => {
  return (
    <IonPage>
      <Navigation />
      <Welcome />
    </IonPage>
  );
};

export default Home;
