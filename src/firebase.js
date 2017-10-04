import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDA5tCzxNzykHgaSv1640GanShQze3UK-M",
  authDomain: "universalgamemaker.firebaseapp.com",
  databaseURL: "https://universalgamemaker.firebaseio.com",
  projectId: "universalgamemaker",
  storageBucket: "universalgamemaker.appspot.com",
  messagingSenderId: "144595629077"
};
var uiConfig = {
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  recaptchaParameters: {
    'size': 'visible',
  }
};
export const firebaseApp = firebase.initializeApp(config);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebaseApp.auth();
export const db = firebaseApp.database();
export const storageKey = 'GAME_BUILDER_LOCAL_STORAGE_$UID';
export const isAuthenticated = () => {
  return !!auth.currentUser;
}
var firebaseui = require('firebaseui');
var ui = new firebaseui.auth.AuthUI(firebase.auth());
//ui.start('#firebaseui-auth-container', uiConfig);
var connectedRef = null;
var myConnectionsRef = null;
var lastOnlineRef = null;
var connection = null;

ui.start('#firebaseui-auth-container', {
  signInSuccessUrl: 'http://localhost:3000/',
  tosUrl: '<your-tos-url>',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image', // 'audio'
        size: 'normal', // 'invisible' or 'compact'
        badge: 'bottomright' //' bottomright' or 'inline' applies to invisible.
      },
      defaultCountry: 'US' // Set default country to the United Kingdom (+44).
    }
  ]
});

export const addPresenceListeners = () => {
    if(isAuthenticated()){
        const uid = auth.currentUser.uid;
        // stores the timestamp of my last disconnect (the last time I was seen online)
        lastOnlineRef = firebaseApp.database().ref('users/'+uid+'/lastonline');
        myConnectionsRef = firebaseApp.database().ref('users/'+uid+'/connections');

        connectedRef = firebaseApp.database().ref('.info/connected');
        connectedRef.on('value', function(snapshot) {
          if (snapshot.val() === true) {
            // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
            connection = myConnectionsRef.push();

            // When I disconnect, remove this device
            connection.onDisconnect().remove();

            // Add this device to my connections list
            // this value could contain info about the device or a timestamp too
            connection.set(true);

            // When I disconnect, update the last time I was seen online
            lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
          }
        });
    }
}

export const hidePresence = () => {
    if(connection)
        connection.remove();
    if(lastOnlineRef)
        lastOnlineRef.set(firebase.database.ServerValue.TIMESTAMP);
}
