import { supabase } from "../api";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Navbar, NavbarBrand, Nav } from "reactstrap";
import styles from "../styles/header.module.css";

export default function Header() {
  const [txt, setTxt] = useState("Sign Out");
  const router = useRouter();
  useEffect(() => {
    const userid_from_local = localStorage.getItem("supabase_user_id");
    if (userid_from_local == null) {
      setTxt("Welcome!");
    }
  }, [router]);
  async function signOut() {
    let { error } = await supabase.auth.signOut();
    localStorage.removeItem("supabase_user_email");
    localStorage.removeItem("supabase_user_id");
    router.push("/login");
  }
  return (
    <>
      <div>
        <Navbar>
          <div className={styles.main}>
            <NavbarBrand href="/" className={styles.brand}>
              Chat App
            </NavbarBrand>
            <button onClick={() => signOut()} className={styles.signoutBtn}>
              {txt}
            </button>
          </div>
        </Navbar>
      </div>
    </>
  );
}
