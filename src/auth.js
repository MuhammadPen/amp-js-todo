import Amplify, { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

//mutation

//query

//subscription

const signup_button = document.getElementById("sign_up_button");
const signin_button = document.getElementById("sign_in_button");
const signout_button = document.getElementById("sign_out_button");
const verify_button = document.getElementById("verify_button");

//sign up button click
signup_button.addEventListener("click", async function () {
  var username = document.getElementById("email_signup").value.toLowerCase();
  var password = document.getElementById("password_signup").value;
  try {
    const { user } = await Auth.signUp({
      username,
      password,
    });
    const verify_field = document.getElementById("verify_code");
    verify_field.disabled = false;
    document.getElementById("updates").innerHTML =
      "Check for verification code on your email";
    console.log(user);
  } catch (error) {
    document.getElementById("errors").innerHTML = Object.values(error);
    console.log("error signing up:", error);
  }
});

//sign in button click
signin_button.addEventListener("click", async function signIn() {
  var username = document.getElementById("email_signin").value.toLowerCase();
  var password = document.getElementById("password_signin").value;
  try {
    const user = await Auth.signIn(username, password);
    console.log(user);
    document.getElementById("updates").innerHTML = "Sign in successful";
    window.location.replace("index.html");
  } catch (error) {
    document.getElementById("errors").innerHTML = Object.values(error);
    console.log("error signing in", error);
  }
});

//verify button click
verify_button.addEventListener("click", async function confirmSignUp() {
  var username = document.getElementById("email_signup").value;
  var code = document.getElementById("verify_code").value;
  try {
    await Auth.confirmSignUp(username, code);
    document.getElementById("updates").innerHTML =
      "Email verified. Please login below";
  } catch (error) {
    document.getElementById("errors").innerHTML = Object.values(error);
    console.log("error confirming sign up", error);
  }
});

//sign out button click
signout_button.addEventListener("click", async function signOut() {
  try {
    await Auth.signOut();
    console.log("user signed out");
    window.location.replace("auth.html");
  } catch (error) {
    console.log("error signing out: ", error);
  }
});

Auth.currentSession()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.log(err));
