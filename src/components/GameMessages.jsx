import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, onValue, off, set } from "firebase/database";
import NavigationBar from "./NavigationBar.jsx";
import { db } from "../firebase.js";

export default function GameMessages({ user, onSignIn, onSignOut }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [draft, setDraft] = useState("");

  // Subscribe to messages for this game from Realtime Database
  useEffect(() => {
    const messagesRef = ref(db, `messages/${id}`);
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const list = Object.entries(raw)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(list);
      } else {
        setMessages([]);
      }
    };

    onValue(messagesRef, callback);
    return () => off(messagesRef, "value", callback);
  }, [id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const now = Date.now();
    const author = user?.email || "anonymous@example.com";

    // Generate a simple sequential key like "message-13"
    const nextNumber =
      messages.reduce((max, msg) => {
        const match = /^message-(\d+)$/i.exec(msg.id);
        if (!match) return max;
        const num = parseInt(match[1], 10);
        return Number.isNaN(num) ? max : Math.max(max, num);
      }, 0) + 1;

    const messageKey = `message-${nextNumber}`;

    try {
      const messageRef = ref(db, `messages/${id}/${messageKey}`);
      await set(messageRef, {
        author,
        text,
        timestamp: now,
      });
      setDraft("");
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const avatarFor = useMemo(
    () => (author) => {
      if (!author) return "?";
      const base = author.split("@")[0] || author;
      return base
        .split(".")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join("");
    },
    []
  );

  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4"
        style={{ maxWidth: "900px", width: "100%" }}
      >
        <NavigationBar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          currentGameId={id}
        />

        <div className="card-body d-flex flex-column" style={{ minHeight: "500px" }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Game Messages</h2>
            <button
              type="button"
              className="btn btn-outline-light rounded-pill py-2 px-3 fs-6"
              onClick={() => navigate(`/game-details/${id}`)}
            >
              ← Back to Game
            </button>
          </div>

          <div
            className="flex-grow-1 mb-3 p-3 rounded-4 bg-black border border-secondary overflow-auto"
            style={{ maxHeight: "400px" }}
          >
            {messages.length === 0 ? (
              <div className="text-muted text-center mt-3">
                No messages yet. Be the first to post!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="d-flex align-items-start mb-3"
                >
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px", fontSize: "0.8rem" }}
                  >
                    {avatarFor(msg.author)}
                  </div>
                  <div className="flex-grow-1">
                    <div className="bg-secondary bg-opacity-75 rounded-4 px-3 py-2">
                      <div className="d-flex justify-content-between align-items-baseline mb-1">
                        <div className="fw-semibold small">
                          {msg.author || "Unknown"}
                        </div>
                        <div className="text-muted small">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                      <div className="small">{msg.text}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Write a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!draft.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
