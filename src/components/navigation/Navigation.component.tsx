import React from 'react';
import {IonHeader, IonToolbar, IonMenuButton, IonImg} from '@ionic/react';
import Logo from '../../assets/icons/logo2.png';
import './navigation.style.css';

interface NavigationProps { }

const Navigation: React.FC<NavigationProps> = () => {
  return (
      <IonHeader className="home-header">
        <IonToolbar>
          <IonImg src={Logo} className="h2 w2"></IonImg>
          <IonMenuButton slot="end" autoHide={false} color="medium"></IonMenuButton>
        </IonToolbar>
      </IonHeader>
  );
};

export default Navigation;
