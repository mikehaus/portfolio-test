import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAPRogPe3UX3et4S-27iNPXz70MxboHt_U",
    authDomain: "mikehaus-63c05.firebaseapp.com",
    databaseURL: "https://mikehaus-63c05.firebaseio.com",
    projectId: "mikehaus-63c05",
    storageBucket: "mikehaus-63c05.appspot.com",
    messagingSenderId: "535361508703",
    appId: "1:535361508703:web:d557134e2b26dd4f5952ea",
    measurementId: "G-JWZLBLHVCY"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;