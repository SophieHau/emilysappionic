import React from 'react';
import { firestore, auth, storageRef } from '../../firebase-utils';
import _ from 'lodash';
import defaultPic from '../../assets/icons/defaultprofilepic.png';
import {
  IonHeader,
  IonToolbar,
  IonImg,
  IonMenuButton,
  IonIcon,
  IonThumbnail,
  IonText,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';

class ChatNav extends React.Component {
  constructor(props) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = firestore.doc(`users/${user.uid}`);
        user = userRef.get().then((user) => {
          this.state['currentUser'] = user.data();
        });
      }
    });

    super(props);

    this.state = {
      chatId: this.props.chatId,
      chatName: '',
      currentUserName: '',
      chatImage: '',
      group: true,
    };
  }

  loadImageUrl = async (imagePath) => {
    const currentImageRef = storageRef.child(imagePath);
    const currentImageUrl = await currentImageRef.getDownloadURL();
    return currentImageUrl;
  };

  componentDidMount = async () => {
    if (window.location.search.includes(',')) {
      const index = window.location.search.indexOf(',');
      try {
        const currentUserRef = firestore.doc(
          `users/${window.location.search.slice(4, index)}`
        );
        const currentUserSnap = await currentUserRef.get();
        const currentUserName = currentUserSnap.data().displayName;
        this.setState({ currentUserName, group: true });
      } catch {
        const currentUserRef = firestore.doc(
          `users/${window.location.search.slice(index)}`
        );
        const currentUserSnap = await currentUserRef.get();
        const currentUserName = currentUserSnap.data().displayName;
        this.setState({ currentUserName });
      }
    }
    try {
      const currentUserRef = firestore.doc(
        `users/${window.location.search.slice(4)}`
      );
      const currentUserSnap = await currentUserRef.get();
      const currentUserName = currentUserSnap.data().displayName;
      this.setState({ currentUserName });
    } catch {
      const currentUserRef = firestore.doc(
        `users/${window.localStorage.getItem('currentUser')}`
      );
      const currentUserSnap = await currentUserRef.get();
      const currentUserName = currentUserSnap.data().displayName;
      this.setState({ currentUserName });
    }

    const currentChatRef = firestore.doc(`chats/${this.state.chatId}`);
    const currentChatSnap = await currentChatRef.get();
    if (currentChatSnap.data().imagePath) {
      const currentChatImagePath = currentChatSnap.data().imagePath;
      const currentChatImage = await this.loadImageUrl(currentChatImagePath);
      this.setState({ chatImage: currentChatImage });
    }

    let chatName = [];
    let images = [];
    firestore
      .collection('chats')
      .doc(`${this.state.chatId}`)
      .onSnapshot((snap) => {
        const participantsRefs = snap.data().participants;
        if (snap.data().name === '') {
          participantsRefs.forEach((participant) => {
            participant.get().then(async (res) => {
              const displayName = await res.data().displayName;
              chatName.push(` ${displayName}`);
              this.setState({ chatName });
              if (participantsRefs.length === 2) {
                if (!res.data().imagePath.includes(auth.currentUser.uid)) {
                  const pic = await this.loadImageUrl(res.data().imagePath);
                  images.push(pic);
                  this.setState({ chatImage: images, group: false });
                }
              }
            });
          });
        }
        this.setState({ chatName: snap.data().name });
      });
  };

  render() {
    let { chatName, currentUserName, chatImage, chatId } = this.state;
    chatName = chatName.toString();
    chatName = chatName.replace(currentUserName, '@You');
    if (chatName.length > 25) {
      chatName = chatName.slice(0, 20);
    }

    return (
      <IonHeader className="home-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton color="medium" defaultHref="/" text="" />
          </IonButtons>
          <IonThumbnail slot="start" className="mt2">
            <IonImg
              style={{ width: '80%', height: '80%' }}
              className="ba b--black-10 br-100 mh1"
              src={chatImage}
            />
          </IonThumbnail>
          <IonText color="medium" slot="start">
            {chatName}
          </IonText>
          <IonMenuButton slot="end" autoHide={false} color="medium" />
        </IonToolbar>
      </IonHeader>
    );
  }
}

export default ChatNav;
