import React from 'react';
import { getProfilePicUrl } from '../../firebase-utils';
import {
  IonImg,
  IonCard,
  IonRow,
  IonCol,
  IonButton,
  IonThumbnail,
  IonText,
  IonGrid,
  IonIcon,
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';

class ProfileBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser,
      imagePath: '',
    };
  }

  componentDidMount = async () => {
    const currentImageUrl = await getProfilePicUrl(this.state.currentUser);
    this.setState({ imagePath: currentImageUrl });
  };

  render() {
    return (
      <IonCard className="mw6">
        <IonGrid>
          <IonRow className="no-padding ion-justify-content-space-between ion-align-items-center">
            <IonCol className="no-padding">
              <IonThumbnail>
                <IonImg
                  src={this.state.imagePath}
                  className="ba b--black-10 db br-100"
                />
              </IonThumbnail>
            </IonCol>
            <IonCol size="6" className="no-padding ion-align-items-center">
              <IonText className="fw3 f4">
                Hi {this.state.currentUser.displayName}!
              </IonText>
            </IonCol>
            <IonCol className="no-padding ion-justify-content-start ion-align-items-center">
              <IonButton fill="clear" color="medium" href="/picture">
                <IonIcon icon={createOutline} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    );
  }
}

export default ProfileBox;
