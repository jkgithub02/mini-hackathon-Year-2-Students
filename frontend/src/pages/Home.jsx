import React, { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import Error from "../components/Error";
import IntroSection from "../components/IntroSection";
import Loading from "../components/Loading";
import NavContent from "../components/NavContent";
// import "../Home.css";

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
    <>
      <header>
        <div className="menu">
          <button onClick={() => setShowMenu(true)}>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#d9d9e3"
              strokeLinecap="round"
            >
              <path d="M21 18H3M21 12H3M21 6H3" />
            </svg>
          </button>
        </div>
        <h1>TalkBot</h1>
      </header>

      {showMenu && (
        <nav>
          <div className="navItems">
            <NavContent
              chatLog={chatLog}
              setChatLog={setChatLog}
              setShowMenu={setShowMenu}
            />
          </div>
          <div className="navCloseIcon">
            {/* ... close icon SVG ... */}
          </div>
        </nav>
      )}

      <aside className="sideMenu">
        <NavContent
          chatLog={chatLog}
          setChatLog={setChatLog}
          setShowMenu={setShowMenu}
        />
      </aside>

      <section className="chatBox">
        {chatLog.length > 0 ? (
          <div className="chatLogWrapper">
            {chatLog.map((chat, idx) => (
              <div className="chatLog" key={idx}>
                <div className="chatPromptMainContainer">
                  <div className="chatPromptWrapper">
                    <Avatar bg="#5437DB" className="userSVG" />
                    <div id="chatPrompt">{chat.chatPrompt}</div>
                  </div>
                </div>
                <div className="botMessageMainContainer">
                  <div className="botMessageWrapper">
                    <Avatar bg="#11a27f" className="openaiSVG" />
                    {chat.botMessage === null ? ( // Check if botMessage is null
                      <Loading />
                    ) : (
                      <div id="botMessage">{chat.botMessage}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatLogEndRef} />
          </div>
        ) : (
          <IntroSection />
        )}

        {isLoading && <Loading />}
        {error && <Error err={error} />}

        <form onSubmit={handleSubmit}>
          <div className="inputPromptWrapper">
            <input
              name="inputPrompt"
              className="inputPrompttTextarea"
              type="text"
              rows="1"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              autoFocus
            />
            {/* ... submit button SVG ... */}
          </div>
        </form>
      </section>
    </>
  );
};

export default Home;