// import React from 'react';
// import imageCompression from 'browser-image-compression';
// import { firestore, auth, messaging, getProfilePicUrl } from '../../firebase.utils';
// import sendIcon from '../../assets/icons/sendicon.jpg';
// import cameraIcon from '../../assets/icons/cameraicon.png';
// import cancelIcon from '../../assets/icons/cancelicon.png';
// import './chatboard.style.css';

// export class ChatBoard extends React.Component {
//     constructor(props) {
//         auth.onAuthStateChanged(user => {
//             if(user) {
//                 const userRef = firestore.doc(`users/${user.uid}`);
//                 user = userRef.get().then(user => {
//                     this.state['currentUser'] = user.data()
//                 })
//             }
//         })

//         super(props);

//         this.state = {
//             chatId: this.props.chatId,
//             messages: [],
//             messageInput: '',
//             newMessage: {},
//         }
//     }

//     componentDidMount = () => {
//         firestore.collection('chats').doc(this.state.chatId).collection('messages').orderBy('createdAt').limitToLast(20)
//         .onSnapshot(snaphot => {
//             snaphot.docChanges().forEach(change => {
//                 if (change.type === "added") {
//                     const newMessage = {
//                         id: change.doc.id,
//                         content: change.doc.data().content,
//                         createdAt: new Date(change.doc.data().createdAt * 1000).toString(),
//                         author: change.doc.data().author
//                     }
//                     firestore.collection('users').doc(change.doc.data().author.id).get()
//                     .then(author => {
//                     const authorName = author.data().displayName
//                     const authorColor = author.data().color
//                     newMessage['author'] = authorName
//                     newMessage['color'] = authorColor
//                     const messages = this.state.messages
//                     messages.push(newMessage)
//                     this.setState({messages: messages})
//                     })
//                 }
//             })
//         })

//         this.scrollToBottom();
//         this.saveToken();
//     }

//     componentDidUpdate = () => {
//         this.scrollToBottom();
//     }

//     sortArray = (array) => {
//         array.sort((a, b) => {
//             let da = new Date(a.createdAt),
//                 db = new Date(b.createdAt);
//         return da - db;
//         });
//     }

//     saveToken = async () => {
//         try {
//             const uid = auth.currentUser.uid
//             await messaging.requestPermission()
//             const token = await messaging.getToken()
//             const tokenRef = firestore.collection('tokens').where("token", "==", `${token}`);
//             const tokenSnap = await tokenRef.get();
//             if (tokenSnap.empty) {
//                 firestore.collection('tokens').add({
//                     token,
//                     uid: uid
//                 })
//             }
//         }
//         catch(err) {
//             if (err.code === "messaging/token-unsubscribe-failed")
//             this.saveToken();
//         }
//     }

//     sendNotification = async () => {
//         const currentUserRef = firestore.doc(`users/${auth.currentUser.uid}`);
//         const currentUserSnap = await currentUserRef.get();
//         const currentUserImageUrl = await getProfilePicUrl(currentUserSnap.data())
//         const chatRef = firestore.doc(`chats/${this.state.chatId}`)
//         const chatSnap = await chatRef.get();
//         const chatParticipants = chatSnap.data().participants;
//         const otherParticipants = []
//         chatParticipants.forEach(part => {
//             if (part.id !== auth.currentUser.uid){
//                 otherParticipants.push(part.id)
//             }
//         })
//         const tokensRef = firestore.collection('tokens').where("uid", "in", otherParticipants);
//         const tokensSnap = await tokensRef.get();
//         const tokensList = tokensSnap.docs.map(doc=> doc.data().token)
//         const notification = {
//             title: `You have a new message from ${currentUserSnap.data().displayName}`,
//             icon: currentUserImageUrl,
//             click_action: `/chat/${chatRef.id}?id=${otherParticipants.toString()}`,
//         }

//         tokensList.forEach(token => {
//             fetch('https://fcm.googleapis.com/fcm/send', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `key=${process.env.REACT_APP_FIREBASE_MESSAGING_KEY}`
//                 },
//                 body: JSON.stringify({
//                     'to': token,
//                     'notification': notification,
//                 })
//             })
//         })

//     }

//     createMessageDocument = (event) => {
//         event.preventDefault();

//         const authorRef = firestore.doc(`users/${auth.currentUser.uid}`)
//         const newMessage = {
//             author: authorRef,
//             content: this.state.messageInput,
//             createdAt: new Date()
//         }

//         if (newMessage['content'] !== "") {
//             firestore.collection('chats').doc(this.state.chatId).collection('messages')
//             .add(newMessage)
//             this.setState({messageInput: ''})
//             this.sendNotification();
//         }
//     }

//     handleChange = (event) => {
//         const {value, name} = event.target
//         this.setState({ [name]: value})
//     }

//     scrollToBottom = () => {
//         this.messagesEnd.scrollIntoView();
//     }

//     onFocus = (event) => {
//         event.target.setAttribute('autocomplete', 'off');
//     }

//     handleElSelect = () => {
//         const fileInput = document.getElementById("pic");
//         fileInput.click();
//     }

//     handleImageSelect = async (event) => {
//         const imageFile = event.target.files[0];

//         const options = {
//           maxSizeMB: 0.6,
//           maxWidthOrHeight: 1920,
//           useWebWorker: true
//         }
//         try {
//           const compressedFile = await imageCompression(imageFile, options);
//           this.setState({ imagePath: URL.createObjectURL(compressedFile), compressedImage: compressedFile })
//           console.log(this.state.compressedImage)
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     cancelImage = () => {
//         this.setState({compressedImage: false})
//     }

//     sendPic = (event) => {
//         event.preventDefault();
//         // if (this.state.compressedImage !== null) {
//         //     const authorRef = firestore.doc(`users/${auth.currentUser.uid}`)
//         //     const newMessage = {
//         //         author: authorRef,
//         //         content: this.state.compressedImage,
//         //         createdAt: new Date()
//         //     }
//         //     if (newMessage['content'] !== "") {
//         //         firestore.collection('chats').doc(this.state.chatId).collection('messages')
//         //         .add(newMessage)
//         //         this.setState({messageInput: ''})
//         //         this.sendNotification();
//         //     }
//         // }
//     }

//     render () {
//         const { messages, currentUser } = this.state;
//         this.sortArray(messages)

//         return (
//             <>
//             <main className="mw6 wrapper w-90 center mb5-l mb1">
//                     { messages.map(message => {
//                         if (message.author === currentUser.displayName) {
//                                 return (
//                                     <article key={message.id} className="dib w-100">
//                                         <div key={message.id} className="dtc v-mid pl5 tr fr">
//                                         <h1 key={message.id} className="mr2 f6 tl fw4 br4 ph3 pv2 dib bg-washed-green mid-gray shadow-4 fr">{message.content} <p className="tr f7 fw2 mb0 mt1 black-60">{message.createdAt.substring(4,10)} | {message.createdAt.substring(16,21)}</p></h1>
//                                         </div>
//                                     </article>
//                                 );
//                         } else {
//                                 return (
//                                     <article key={message.id} className="w-100 dib">
//                                     <div key={message.id} className="dtc v-mid pr5">
//                                         <h1 key={message.id} className="f6 tl fw4 br4 ph3 pv2 mh2 dib mid-gray shadow-4">{message.content} <p className={`tr f7 fw4 ${message.color} mb0 mt2 black-60`}>{message.author} <span className="f7 fw2 black-60"> {message.createdAt.substring(4,10)} | {message.createdAt.substring(16,21)}</span></p></h1>
//                                         </div>
//                                     </article>
//                                 )
//                         }
//                     })
//                     }
//                     <div style={{ float:"left", clear: "both" }}
//                         ref={(el) => { this.messagesEnd = el; }}>
//                     </div>
//             </main>
//             <form className="circle-form mw6 fn bg-white center dib w-90 mb3" onSubmit={this.createMessageDocument}>
//                     <div className="pb1 pt2 ba b--black-20 br4">
//                         { this.state.compressedImage ?
//                         <>

//                         <button
//                             className="mr1 fr bg-transparent ba b--white-20 outline-transparent v-btm"
//                             type="submit"
//                             onClick={this.sendPic}
//                         >
//                             <img src={sendIcon} alt="paper plane" style={{width: '30px'}}/>
//                         </button>
//                         <img src={this.state.imagePath} alt="" style={{width: '80px'}}/>
//                         <button
//                             className="mr1 fl bg-transparent ba b--white-20 outline-transparent v-mid"
//                             type="submit"
//                             onClick={this.cancelImage}
//                         >
//                             <img src={cancelIcon} alt="paper plane" style={{width: '20px'}}/>
//                         </button>
//                         </>
//                         :
//                         <>
//                         <input
//                             id="messageInput"
//                             name="messageInput"
//                             className="f6 w-50 ml1 pa2 input-reset ba b--white-20 outline-transparent"
//                             type="text"
//                             value={this.state.messageInput}
//                             placeholder="Type a message..."
//                             onChange={this.handleChange}
//                             autoFocus
//                             onFocus={this.onFocus}
//                         />
//                         <button
//                             className="mr1 fr bg-transparent ba b--white-20 outline-transparent v-mid"
//                             type="submit"
//                             onClick={this.handleElSelect}
//                         >
//                             <img src={cameraIcon} alt="paper plane" style={{width: '30px'}}/>
//                         </button>
//                         <input type="file" hidden id="pic" accept="image/*" onChange={this.handleImageSelect} />
//                         <button
//                             className="mr1 fr bg-transparent ba b--white-20 outline-transparent v-mid"
//                             type="submit"
//                             onClick={this.createMessageDocument}
//                         >
//                             <img src={sendIcon} alt="paper plane" style={{width: '30px'}}/>
//                         </button>
//                         </>
//                         }

//                     </div>
//                 </form>

//             </>
//         )
//     }
// }
