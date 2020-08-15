import React from 'react';
import { ChatBoard } from '../components/chatboard/chatboard.component';
import { ChatNav } from '../components/chatnav/chatnav.component';
import { IonPage } from '@ionic/react';

class ChatPage extends React.Component {
  render() {
    let { id } = this.props.match.params;

    return (
      <IonPage>
        <ChatNav chatId={id} />
        {/* <ChatBoard chatId={id} /> */}
      </IonPage>
    );
  }
}

export default ChatPage;
