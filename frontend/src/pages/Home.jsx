import React, { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import Error from "../components/Error";
import IntroSection from "../components/IntroSection";
import Loading from "../components/Loading";
import NavContent from "../components/NavContent";
import "../Home.css";

const Home = ({apiEndPoint}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatLogEndRef = useRef(null);

  const generateBotResponse = async (prompt) => {
    try {
      console.log("API Endpoint:", apiEndPoint);
  
      const response = await fetch(apiEndPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      });
  

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      console.log("Data received from API:", data);

      // Check if 'data' has the expected properties
      if (data.botMessage) {
        return data.botMessage;
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from the API");
      }
    } catch (error) {
      console.error("Error in generateBotResponse:", error);
      throw error; // Re-throw the error to be handled in handleSubmit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputPrompt = e.target.inputPrompt.value;
    if (inputPrompt.trim() === "") return;

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { chatPrompt: inputPrompt, botMessage: null },
    ]);
    setInputPrompt("");

    setIsLoading(true);
    setError(null);

    try {
      // Call generateBotResponse to get the bot's response
      const botMessage = await generateBotResponse(inputPrompt);

      setChatLog((prevChatLog) => {
        const lastMessage = prevChatLog[prevChatLog.length - 1];
        const updatedChatLog = prevChatLog.slice(0, -1);
        updatedChatLog.push({ ...lastMessage, botMessage: botMessage });
        return updatedChatLog;
      });

    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatLogEndRef.current) {
      chatLogEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatLog]);

  return (
    <div className="home-container"> {/* Added a container */}
      <header className="header"> 
        <div className="menu-icon">
          <button onClick={() => setShowMenu(true)}>
            {/* ... menu icon SVG ... */}
          </button>
        </div>
        <h1 className="app-title">TalkBot</h1> 
      </header>

      {showMenu && (
        <nav className="sidebar"> {/* Added a sidebar class */}
          <div className="nav-items">
            <NavContent
              chatLog={chatLog}
              setChatLog={setChatLog}
              setShowMenu={setShowMenu}
            />
          </div>
          <div className="close-icon">
            {/* ... close icon SVG ... */}
          </div>
        </nav>
      )}

      <aside className="sidebar"> 
        <NavContent
          chatLog={chatLog}
          setChatLog={setChatLog}
          setShowMenu={setShowMenu}
        />
      </aside>

      <section className="chat-container"> 
        <div className="chat-log-wrapper">
          {chatLog.map((chat, idx) => (
            <div className="chat-message" key={idx}> 
              <div className="user-message">
                <Avatar bg="#5437DB" className="user-avatar" />
                <p className="message-text">{chat.chatPrompt}</p> 
              </div>
              <div className="bot-message">
                <Avatar bg="#11a27f" className="bot-avatar" />
                {chat.botMessage === null ? ( 
                  <Loading />
                ) : (
                  <p className="message-text">{chat.botMessage}</p> 
                )}
              </div>
            </div>
          ))}
          <div ref={chatLogEndRef} />
        </div>

        {isLoading && <Loading />}
        {error && <Error err={error} />}

        <form onSubmit={handleSubmit} className="input-form"> 
          <div className="input-wrapper">
            <input
              name="inputPrompt"
              className="input-field" 
              type="text"
              placeholder="Type your message..." 
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              autoFocus
            />
            {/* ... submit button SVG ... */}
          </div>
        </form>
      </section>
    </div>
  );
};

export default Home;