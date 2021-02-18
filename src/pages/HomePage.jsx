import { IonPage, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import React from 'react';
import Navigation from '../components/navigation/Navigation.component';
import { Welcome } from '../components/welcome/Welcome.component';
import ProfileBox from '../components/profileBox/ProfileBox.component';
import ChatList from '../components/chatlist/chatlist.component';
import { chatboxEllipsesOutline } from 'ionicons/icons';

const Home = ({ currentUser }) =>
  currentUser ? (
    <IonPage>
      <Navigation currentUser={currentUser} />
      <ProfileBox currentUser={currentUser} />
      <ChatList currentUser={currentUser} />
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton fill="clear" color="white" href="/createchat">
          <IonIcon style={{ color: 'pink' }} icon={chatboxEllipsesOutline} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  ) : (
    <IonPage>
      <Navigation currentUser={currentUser} />
      {currentUser ? null : <Welcome currentUser={currentUser} />}
    </IonPage>
  );

export default Home;
