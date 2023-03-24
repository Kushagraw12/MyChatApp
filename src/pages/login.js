import { supabase } from "../api";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/header";
import styles from "@/styles/login.module.css";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

export default function SignIn() {
  const router = useRouter();
  const [em, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function signInWithEmail() {
    if (em == "" || pass == "") {
      alert("One or more fields are missing!");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: em,
      password: pass,
    });
    if (error != null) {
      if (error == "AuthApiError: Email not confirmed") {
        alert(
          `Please confirm your email first! You must have recieved an email from 'noreply@mail.app.supabase.io' at '${em}', please open it, and click on 'Confirm your mail'!`
        );
      } else if (error == "AuthApiError: Invalid login credentials") {
        alert(`Invalid Email/Password! Please check your email and password.`);
      } else {
        alert(error);
      }
      return;
    }
    console.log("data: ", data);
    console.log(data["user"]);
    if (data != null) {
      localStorage.setItem("supabase_user_email", data["user"]["email"]);
      localStorage.setItem("supabase_user_id", data["user"]["id"]);
      router.push("/");
    }
  }

  async function signOut() {
    let { error } = await supabase.auth.signOut();
    localStorage.removeItem("supabase_user_email");
  }

  async function forgotPassword() {
    if (em == "") {
      alert("Please enter your email first!");
      return;
    }
    let { data, error } = await supabase.auth.resetPasswordForEmail(em);
  }

  function onChange(e) {
    setEmail(e.target.value);
  }

  function onChange2(e) {
    setPass(e.target.value);
  }

  return (
    <>
      <Header />
      <div className={styles.form}>
        <div className={styles.email}>
          Email: <></>
          <input
            onChange={onChange}
            name="email"
            placeholder="example@example.com"
            value={em}
            className={`border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2 ${styles.emailInput}`}
          />
        </div>
        <br />
        <div className={styles.pass}>
          Passw: <></>
          <input
            onChange={onChange2}
            name="password"
            placeholder="Your secret Password"
            value={pass}
            type="password"
            className={`border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2 ${styles.passInput}`}
          />
        </div>
        <div className={styles.btns}>
          <button
            type="button"
            className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.loginBtn}`}
            onClick={signInWithEmail}
          >
            Log In
          </button>
          <button
            type="button"
            className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.forgotPas}`}
            onClick={forgotPassword}
          >
            Forgot Password
          </button>
          <br />
          <button
            type="button"
            className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.create}`}
            onClick={() => router.push("/signup")}
          >
            Create Account
          </button>
        </div>
      </div>
    </>
  );
}
