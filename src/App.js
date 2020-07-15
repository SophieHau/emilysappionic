import React, { useState, useEffect, FC } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import HomePage from "./pages/HomePage";
import SignIn from './pages/SignInPage';
import Register from './pages/RegisterPage';
import { auth, createUserProfileDocument } from "./firebase-utils";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  let unsubscribeFromAuth = null;

  const loadCurrentUser = () => {
    unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        setCurrentUser(userAuth);
      }
    });
  };

  useEffect(() => {
    loadCurrentUser();
  });

  useEffect(() => {
    unsubscribeFromAuth(null);
  });

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/"
            render={(props) => (
              <HomePage {...props} currentUser={currentUser} />
            )}
          />
          <Route
            exact
            path="/signin"
            render={() =>
              currentUser ? <Redirect to="/" /> : <SignIn />
            }
          />
          <Route
            exact
            path="/register"
            render={() =>
              currentUser ? <Redirect to="/" /> : <Register />
            }
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
