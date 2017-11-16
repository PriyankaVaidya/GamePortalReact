import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import './css/Login.css';
import {firebaseApp, auth, googleProvider, facebookProvider, twitterProvider, githubProvider, isAuthenticated, db} from '../firebase';
import firebase from 'firebase';
import PhoneAuth from './PhoneAuth';
import Main from './Main';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

export default class Login extends Component {

  handleSubmit = () => {
      if (auth.currentUser) {
        // [START signout]
        auth.signOut();
        // [END signout]
      } else {
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
        // [START authwithemail]
        var loginPromise = auth.signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('signin').disabled = false;
          // [END_EXCLUDE]
      });
        // [END authwithemail]
      }
  }


  loginWithGoogle = ()=>{
    // console.log('signin with google');
    auth.signInWithPopup(googleProvider).then(function (result) {
    //   this.setState({redirectToReferrer: true});
    }.bind(this));
  }

  loginWithFacebook(){
      auth.signInWithPopup(facebookProvider).then(function (result) {
      //   this.setState({redirectToReferrer: true});
      }.bind(this));
  }

  loginWithTwitter(){
      auth.signInWithPopup(twitterProvider).then(function (result) {
      //   this.setState({redirectToReferrer: true});
      }.bind(this));
  }

  loginWithGithub(){
      auth.signInWithPopup(githubProvider).then(function (result) {
      //   this.setState({redirectToReferrer: true});
      }.bind(this));
  }

  // If the user logs in successfully using this API,
  // onAuthStateChanged will be called which is registered in App.js
  // User_id for anonymous user will be received there.
  loginAnonymous(){
      var loginPromise = auth.signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.error(errorCode, errorMessage);
      });
  }

  state = {
    redirectToReferrer: false
  }

  loginWithPhone = ()=>{
      window.location.reload();
  }

  render() {
    return (
        <div className="signin-super-container">
            <div className="container col-md-6 col-xs-12 signin-root">
                <h2 className="form-signin-heading">
                    Sign In
                </h2>
                <div className="login-container">
                    <div className="signin-container col-md-6 col-xs-12">
                        <label htmlFor="inputEmail" className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus/>
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
                        <br />
                        <button id = "signin" className="btn btn-md btn-primary btn-block" onClick={this.handleSubmit} >Log In</button>
                    </div>
                    <div className="login-options-container col-md-6 col-xs-12">
                        <div className='login-button-container'>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginWithGoogle} >Google</button>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginWithFacebook} >Facebook</button>
                        </div>
                        <div className='login-button-container middle-button-container'>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginWithPhone} > {<Link to='/PhoneAuth' style={{decoration: 'none', color: 'white'}}>With Phone</Link>}</button>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginWithTwitter} >Twitter</button>
                        </div>
                        <div className='login-button-container'>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginWithGithub} >Github</button>
                            <button className="btn btn-md btn-primary login-button" onClick={this.loginAnonymous.bind(this)}>Anonymous</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}
