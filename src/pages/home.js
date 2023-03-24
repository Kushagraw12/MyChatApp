import styles from "@/styles/Homescreen.module.css";
import { useState, useRef, useEffect } from "react";
import { supabase } from "../api";
import { useRouter } from "next/router";
import Header from "@/components/header";

export default function Homescreen() {
  const router = useRouter();
  const [userEmail, setUserEm] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthor, setAuthor] = useState(false);

  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  function onChange(e) {
    setMessage(e.target.value);
  }

  function reverseString(str) {
    return str.split("-").reverse().join("/");
  }

  function format_date(d) {
    const txt = d.toString();
    const date = txt.split("T")[0];
    const tmp = txt.split("T")[1];
    const t1 = tmp.split(":")[0];
    const t2 = tmp.split(":")[1];
    return "on " + reverseString(date) + " at " + t1 + ":" + t2;
  }

  async function getData() {
    const td = await supabase.from("messages").select("*");
    setData(td["data"]);
  }

  const chatWindowRef = useRef(null);

  // Scroll to bottom of chat window
  function scrollToBottom() {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }

  useEffect(() => {
    getData();

    const myChannel = supabase
      .channel("any")
      .on("postgres_changes", { event: "*", schema: "*" }, (payload) => {
        console.log("Change received!", payload.new);
        setData(data.concat(payload.new));
      })
      .subscribe();
    // return () => {
    //   supabase.removeChannel(myChannel);
    // };

    scrollToBottom();
    const userid_from_local = localStorage.getItem("supabase_user_id");
    const userem_from_local = localStorage.getItem("supabase_user_email");
    if (userid_from_local == null) {
      router.push("/login");
    } else {
      setUserEm(userem_from_local);
      setUserId(userid_from_local);
    }
  }, [router, data]);

  async function createNewMessage() {
    if (message == "") {
      alert("Please enter message!");
      return;
    }
    console.log(message, userEmail, userId);
    const { data } = await supabase
      .from("messages")
      .insert([
        {
          content: message,
          user_id: userId,
          user_email: userEmail,
        },
      ])
      .single();
    setMessage("");
    getData();
  }

  return (
    <>
      <div className={styles.mainBody} ref={chatWindowRef}>
        {data == null
          ? "Loading . . ."
          : data.map((d) => {
              return (
                <div key={d.id}>
                  <div className={`${styles.message}`} key={d.id}>
                    {d.user_id == userId ? (
                      <p
                        className={`${styles.messageText} ${styles.sent}`}
                        key={d.id}
                      >
                        {d.content}
                        <br />
                        <cite className={styles.messageTime}>
                          <>Sent: {format_date(d.created_at)}</>
                        </cite>
                      </p>
                    ) : (
                      <p
                        className={`${styles.messageText} ${styles.received}`}
                        key={d.id}
                      >
                        {d.content}
                        <br />
                        <cite className={styles.messageTime}>
                          <>Sent: {format_date(d.created_at)}</>
                        </cite>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      <div className={styles.form}>
        <input
          onChange={onChange}
          name="message"
          placeholder="Your Message"
          value={message}
          className={`border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2 ${styles.mesInput}`}
        />
        <button
          type="button"
          className={`mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg ${styles.sendBtn}`}
          onClick={createNewMessage}
        >
          Send Message
        </button>
      </div>
    </>
  );
}
