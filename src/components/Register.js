import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import './css/Login.css';
import Main from './Main';
import {firebaseApp, auth, googleProvider, isAuthenticated, db} from '../firebase';
import firebase from 'firebase';

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export default class Register extends Component {

    createUserIfNotExists = () => {
      if (isAuthenticated()) {
        let user = auth.currentUser;
        // console.log(user);
        let usersRef = db.ref("users");
        let userData = {
          'privateFields': {
            'email': user.email,
            'createdOn': db.ServerValue.TIMESTAMP,
            facebookId: "",
            githubId: "",
            googleId: "",
            phoneNumber: "",
            pushNotificationsToken: "",
            twitterId: "",
          },
          'publicFields': {
                'avatarImageUrl': user.photoURL || 'https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png',
                'displayName': user.displayName || user.email,
                'isConnected': true,
                'lastSeen':db.ServerValue.TIMESTAMP
          }
        };

        usersRef.child(user.uid).transaction(function(currentUserData) {
          if (currentUserData === null || !currentUserData.email) {
            return userData;
          }
        });
      }
    }


  handlesignup = () => {
      var email = document.getElementById('inputEmail').value;
      var password = document.getElementById('inputPassword').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        // [END_EXCLUDE]
      });

        this.createUserIfNotExists();
    }


  render() {
    return (
        <div className="container text-center col-md-3">
          <br />
          <h2 className="form-signin-heading">
            Please sign up
          </h2>
          <label for="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus/>
          <label for="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
          <br />
          <button className="btn btn-md btn-primary btn-block" onClick={this.handlesignup}>Sign up</button>
    </div>
    );
  }
}
