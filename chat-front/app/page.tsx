"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import LanguageForm from './../components/LanguageForm';
import VerifyMessage from '../components/VerifyMessage';
import SuggestedMessages from './../components/SuggestedMessages';
import InsertAudio from './../components/InsertAudio';

const socket = io("http://localhost:3000");

export default function Home() {
  const suggestedMessagesRef = useRef();
  const verifyMessageRef = useRef();
  const langageFormRef = useRef();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<
    {
      username: string;
      content: string;
      timeSent: string;
    }[]
  >([]);

  const [username, setUsername] = useState("");
  const [exists, setExists] = useState(true);
  const [validate, setValidate] = useState("none");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("message", (data) => {
      console.log({ data });
      setMessages((prev) => {
        let messages = [...prev, data]
        if (messages.length > 1) {
          suggestedMessagesRef?.current?.getSuggestions(messages)
        }
        return messages
      });
      if (validate != "none") {
        document.querySelector(".chat:last-child .chat-bubble")?.prepend(validate == "true" ? "✅" : "❌")
      }
    });

    socket.on("user-exist", (data) => {
      setExists(data);
    });

    socket.on("transcription", (data) => {
      document.getElementById("inputPrompt").value = data
    })
  }, []);

  const messageToServer = (content) => {
    socket.emit("message", {
      username,
      content,
      timeSent: new Date().toUTCString(),
    });
    setContent("");
  }

  const traduceMessage = (language, message) => {
    langageFormRef?.current?.traduceMessage(language, message)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let prompt = document.getElementById("inputPrompt")?.value
    let selectedLanguageElement = document.getElementById("language-select").value;

    verifyMessageRef?.current?.messageVerified(prompt).then(function (verification) {
      setValidate(verification)
      if (selectedLanguageElement == "none") {
        messageToServer(prompt)
      } else {
        traduceMessage(selectedLanguageElement, prompt)
      }
    })
  };

  const handleUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!exists) socket.emit("user-take", username);
  };

  const getSuggestedMessage = (childSuggestedMessage) => {
    window.document.getElementById("inputPrompt").value = childSuggestedMessage
  }

  useEffect(() => {
    socket.emit("user-check", username);
  }, [username]);

  return (
    <main className="flex min-h-screen flex-col justify-center items-center">
      <form onSubmit={handleUsername}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`input ${exists ? "input-error" : ""}`}
        />
        <button type="submit" className="btn btn-primary">
          Join
        </button>
      </form>
      <div className="card w-96 h-96 shadow-xl">
        <div className="card-body w-full overflow-y-scroll">
          {messages.map((message) => {
            if (message.username === username) {
              return (
                <div
                  className="chat chat-end chat-bubble-secondary"
                  key={message.timeSent}
                >
                  <div className="chat-header">{message.username}</div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            } else {
              return (
                <div className="chat chat-start" key={message.timeSent}>
                  <div className="chat-header">{message.username}</div>
                  <div className="chat-bubble">{message.content}</div>
                </div>
              );
            }
          })}
        </div>
        <form onSubmit={handleSubmit} className="justify-self-end">
          <input
            id="inputPrompt"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
        <InsertAudio socket={socket} />
      </div>
      {messages.length > 1 ? <SuggestedMessages getSuggestedMessage={getSuggestedMessage} ref={suggestedMessagesRef} /> : null}
      <div className="flex mt-8 gap-x-4">
        <VerifyMessage ref={verifyMessageRef} />
        <LanguageForm ref={langageFormRef} messageToServer={messageToServer} />
      </div>
    </main>
  );
}
