import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../firebase.js";

export default function GameDetails() {
  const { id } = useParams(); // e.g. "2021_09_01_1"
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase(app);
    const gameRef = ref(db, `games/${id}`);

    const unsubscribe = onValue(
      gameRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setGame(snapshot.val());
          setError(null);
        } else {
          setError("Game not found");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [id]);

  // --- Loading State ---
  if (loading) {
    return (
      <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-white fs-4">Loading game details...</div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body text-center">
            <h2 className="fw-bold mb-3">Error</h2>
            <p className="text-danger">{error}</p>
            <button
              onClick={() => navigate("/schedules")}
              className="btn btn-outline-light rounded-pill mt-3 py-2 fs-5"
            >
              ← Back to Schedules
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Page ---
  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h1 className="mb-5 fw-bold display-5">
            <span className="animated-gradient">Game Details</span>
          </h1>

          <div className="fs-5 mb-5">
            <p className="mb-3">
              <strong>Date:</strong> {game.date}
            </p>
            <p className="mb-3">
              <strong>Time:</strong> {game.time}
            </p>
            <p className="mb-3">
              <strong>Location:</strong> {game.location}
            </p>
            <p className="mb-3">
              <strong>Teams:</strong> {game.teams}
            </p>
          </div>

          <button
            onClick={() => navigate("/schedule")}
            className="btn btn-outline-light rounded-pill py-2 fs-5"
          >
            ← Back to Schedules
          </button>
        </div>
      </div>
    </div>
  );
}

