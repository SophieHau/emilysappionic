import React from "react";
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonRippleEffect,
  IonText,
} from "@ionic/react";
import Logo from "../../assets/icons/logo2.png";
import "./welcome.style.css";

export const Welcome = () => {
  return (
    <IonContent fullscreen>
      <IonCard className="card">
        <div>
          <IonImg src={Logo} alt="logo" className="logo" />
        </div>
        <IonText>
          <h1 className="fw3 f3">
            Welcome to <span className="pink">Emily's App</span>
          </h1>
        </IonText>
        <IonCardContent>
          {" "}
          A simple chat application for the whole family.
        </IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                shape="round"
                fill="outline"
                className="signin-btn ion-activatable ripple-parent"
              >
                Sign in
                <IonRippleEffect type="unbounded"></IonRippleEffect>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                shape="round"
                fill="outline"
                className="register-btn ion-activatable ripple-parent"
              >
                Register
                <IonRippleEffect type="unbounded"></IonRippleEffect>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    </IonContent>
  );
};
