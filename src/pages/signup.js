import { supabase } from "../api";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "react-modal";
import Header from "@/components/header";
import styles from "@/styles/signup.module.css";

export default function SignUp() {
  const [em, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  async function signUpWithEmail() {
    if (em == "" || pass == "") {
      alert("One or more fields are empty!");
      return;
    }
    if (pass.length < 6) {
      alert(
        "Password too short. Password length should be minimum6 characters!"
      );
      return;
    }
    let { data, error } = await supabase.auth.signUp({
      email: em,
      password: pass,
      name: name,
    });
    if (error) {
      alert(error);
      return;
    }
    setIsOpen(true);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  function onChange(e) {
    setEmail(e.target.value);
  }

  function onChange2(e) {
    setPass(e.target.value);
  }

  function onChange3(e) {
    setName(e.target.value);
  }

  return (
    <>
      <Header />
      <div className={styles.main}>
        <h1 className={styles.title}>Create Account!</h1>
        <div className={styles.name}>
          Name : <></>
          <input
            onChange={onChange3}
            name="Name"
            placeholder="Your Name"
            value={name}
            className={`border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2 ${styles.nameInput}`}
          />
        </div>
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
            color="primary"
            type="button"
            className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.confBtn}`}
            onClick={signUpWithEmail}
          >
            Send Confirmation Email!
          </button>
          <br />
          <button
            color="primary"
            type="button"
            className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.haveAcc}`}
            onClick={() => router.push("/login")}
          >
            I already have an account!
          </button>
        </div>
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          style={customStyles}
          className={styles.modal}
        >
          <p className={styles.modalText}>
            Thank you for Signing Up!
            <br />
            Please check your registered email for a confirmation mail from
            `noreply@mail.app.supabase.io`. Please confirm your email and log
            in!
          </p>
          <button
            onClick={() => router.push("/login")}
            className={styles.loginBtn}
          >
            Log In
          </button>
          <button onClick={() => setIsOpen(false)} className={styles.close}>
            Close
          </button>
        </Modal>
      </div>
    </>
  );
}
