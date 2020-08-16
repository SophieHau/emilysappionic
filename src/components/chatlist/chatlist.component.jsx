import React from 'react';
import { firestore, auth, storageRef } from '../../firebase-utils';
import _ from 'lodash';
import {
  IonList,
  IonItem,
  IonContent,
  IonAvatar,
  IonText,
  IonImg,
} from '@ionic/react';

class ChatList extends React.Component {
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
      chats: [],
    };
  }

  loadImageUrl = async (imagePath) => {
    const currentImageRef = storageRef.child(imagePath);
    const currentImageUrl = await currentImageRef.getDownloadURL();
    return currentImageUrl;
  };

  loadChats = (list, id, images, groupName) => {
    if (images.length === 1) {
      let chat = {
        id,
        name: list.toString(),
        image: images,
      };
      if (groupName) {
        chat = {
          id,
          name: groupName,
          image: images,
        };
      }
      return chat;
    }

    let chat = {
      id,
      name: list.toString(),
    };
    return chat;
  };

  componentDidMount = async () => {
    const participantDocRef = firestore
      .collection('users')
      .doc(`${auth.currentUser.uid}`);
    const currentUserName = await participantDocRef.get().then((res) => {
      return res.data().displayName;
    });
    this.setState({ currentUserName });
    let chats = [];
    const chatsRef = firestore
      .collection('chats')
      .where('participants', 'array-contains', participantDocRef);
    chatsRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === 'added') {
          const participantsRef = change.doc.data().participants;
          const groupChatName = change.doc.data().name;

          let displayNameList = [];
          let images = [];
          if (change.doc.data().imagePath !== undefined) {
            const groupChatImagePath = await this.loadImageUrl(
              change.doc.data().imagePath.toString()
            );
            images.push(groupChatImagePath);
          }

          participantsRef.forEach((ref) => {
            ref
              .get()
              .then(async (res) => {
                if (participantsRef.length === 2) {
                  if (
                    !res.data().imagePath.includes(`${auth.currentUser.uid}`)
                  ) {
                    const path = await this.loadImageUrl(
                      res.data().imagePath.toString()
                    );
                    images.push(path);
                  }
                }

                displayNameList.push(` ${res.data().displayName}`);
              })
              .then(() => {
                if (displayNameList.length === participantsRef.length) {
                  const newchat = this.loadChats(
                    displayNameList,
                    change.doc.id,
                    images,
                    groupChatName
                  );
                  chats.push(newchat);
                  this.setState({ chats });
                }
              });
          });
        }
      });
    });
  };

  render() {
    const { chats, currentUserName } = this.state;

    return (
      <IonContent className="mw6">
        <IonList className="no-padding ion-justify-content-start">
          {chats.map((chat) => {
            if (chat.name.includes(currentUserName)) {
              chat.name = chat.name.replace(currentUserName, '');
              chat.name = _.trim(chat.name, ' , ');
            }
            return (
              <IonItem
                key={chat.id}
                href={`/chat/${chat.id}`}
                detail={false}
                className="mr3"
              >
                <IonAvatar className="no-padding" slot="start">
                  <IonImg className="no-padding " src={chat.image} />
                </IonAvatar>
                <IonText className="fw3">{chat.name}</IonText>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    );
  }
}

export default ChatList;
