import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  const [messages, setMessages] = useState([]);


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
  
      setMessages([...messages.slice(0, -1), { message: animalInput, reply: data.result, typing: true }]);
      setTimeout(() => {
        setMessages((messages) =>
          messages.map((message, index) =>
            index === messages.length - 1 ? { ...message, typing: false } : message
          )
        );
      }, data.result.length * 30); // Adjust the delay per character as needed
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  

  return (
    <div>
      <Head>
        <title>Raccoon Gpt</title>
        <link rel="icon" href="/fav.png" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"/>
        
      </Head>

      <main className={styles.main}>
        <img src="/fav.png" className={styles.icon} />
        <h3>kenTom™️</h3>
        <p className={styles.description}>Powered By Raccoon254™️</p>
        <div className={styles.chatContainer}>
        {messages.map((item, index) => (
            <div key={index} className={styles.messageCont}>
              <p className={styles.sentMessage}>{item.message}</p>
              <p className={`${styles.repliedMessage} ${item.typing ? styles.typing : ""}`}>
                {item.reply.split("").map((char, charIndex) => (
                  <span key={charIndex} style={{ animationDelay: `${charIndex * 0.03}s` }}>
                    {char}
                  </span>
                ))}
              </p>
            </div>
          ))}

          </div>
        <form onSubmit={onSubmit}> 
          <input 
            type="text" 
            name="animal" 
            placeholder="Enter a prompt" 
            value={animalInput} 
            onChange={(e) => setAnimalInput(e.target.value)} 
          />
          <input type="submit" value="Reply" /> 
        </form>
        <div className={styles.result}>{result}</div>
        
      </main>
    </div>
  );
}
