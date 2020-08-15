import React, { useState } from 'react';
import Navigation from '../components/navigation/Navigation.component';
import { auth, signInWithGoogle } from '../firebase-utils';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonInput,
  IonLabel,
  IonItem,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonRippleEffect,
  IonText,
  IonRouterLink,
} from '@ionic/react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log(auth);

      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <Navigation />
      <IonContent className="mw6">
        <IonCard className="pr3 card">
          <IonCardHeader>
            <IonCardTitle className="fw3">Sign In</IonCardTitle>
          </IonCardHeader>
          <IonItem>
            <IonLabel className="fw2" position="floating">
              Email
            </IonLabel>
            <IonInput
              required
              clearOnEdit
              type="email"
              defaultValue={email}
              onIonChange={(e) => setEmail(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel className="fw2" position="floating">
              Password
            </IonLabel>
            <IonInput
              required
              type="password"
              defaultValue={email}
              onIonChange={(e) => setPassword(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonGrid className="mt4">
            <IonRow>
              <IonCol>
                <IonButton
                  shape="round"
                  fill="outline"
                  className="fw4 signin-btn ion-activatable ripple-parent"
                  onSubmit={handleSubmit}
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
                  className="google-sign-in-btn fw4 blue pointer ion-activatable ripple-parent"
                  onClick={signInWithGoogle}
                >
                  Sign in with Google
                  <IonRippleEffect type="unbounded"></IonRippleEffect>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonText color="medium">
            Don't have an account yet?{' '}
            <IonRouterLink color="dark" href="/register">
              Register
            </IonRouterLink>
          </IonText>
        </IonCard>
      </IonContent>
    </>
  );
};

export default SignIn;
