import React, { useState } from 'react';
import Navigation from '../components/navigation/Navigation.component';
import {
  auth,
  createUserProfileDocument,
  signInWithGoogle,
} from '../firebase-utils';
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      await createUserProfileDocument(user, { displayName });
      setDisplayName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navigation />
      <IonContent className="mw6">
        <IonCard className="pr3 card">
          <IonCardHeader>
            <IonCardTitle className="fw3">Register</IonCardTitle>
          </IonCardHeader>
          <IonItem>
            <IonLabel className="fw2" position="floating">
              Username
            </IonLabel>
            <IonInput
              clearOnEdit
              required
              type="text"
              defaultValue={displayName}
              onIonChange={(e) => setDisplayName(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel className="fw2" position="floating">
              Email
            </IonLabel>
            <IonInput
              clearOnEdit
              required
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
          <IonItem>
            <IonLabel className="fw2" position="floating">
              Confirm password
            </IonLabel>
            <IonInput
              required
              type="password"
              defaultValue={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value)}
            ></IonInput>
          </IonItem>
          <IonGrid className="mt3">
            <IonRow>
              <IonCol>
                <IonButton
                  shape="round"
                  fill="outline"
                  className="fw4 signin-btn ion-activatable ripple-parent"
                  onSubmit={handleSubmit}
                >
                  Register
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
                  Register with Google
                  <IonRippleEffect type="unbounded"></IonRippleEffect>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonText color="medium mb2">
            Already registered?{' '}
            <IonRouterLink color="dark" href="/signin">
              Sign in
            </IonRouterLink>
          </IonText>
        </IonCard>
      </IonContent>
    </>
  );
};

export default Register;
