import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { app } from "../firebase.js";
import NavigationBar from "./NavigationBar.jsx";

export default function GameDetails({ user, onSignIn, onSignOut }) {
  const { id } = useParams(); // e.g. "2021_09_01_1"
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase(app);
    const gameRef = ref(db, `games/${id}`);

    const unsubscribe = onValue(
      gameRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const gameData = snapshot.val();
          setGame(gameData);
          setError(null);
          if (gameData.location) {
            const locationRef = ref(db, `locations/${gameData.location}`);
            get(locationRef)
              .then((locationSnap) => {
                if (locationSnap.exists()) {
                  setLocationDetails(locationSnap.val());
                } else {
                  setLocationDetails(null);
                }
              })
              .catch(() => {
                setLocationDetails(null);
              });
          } else {
            setLocationDetails(null);
          }
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

  // Shared shell for loading, error, and main content
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-white fs-4 text-center">Loading game details...</div>
      );
    }

    if (error) {
      return (
        <div
          className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body text-center">
            <h2 className="fw-bold mb-3">Error</h2>
            <p className="text-danger">{error}</p>
            <button
              onClick={() => navigate("/schedule")}
              className="btn btn-outline-light rounded-pill mt-3 py-2 fs-5"
            >
              ← Back to Schedules
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <NavigationBar
          user={user}
          onSignIn={onSignIn}
          onSignOut={onSignOut}
          currentGameId={id}
        />
        <div className="card-body">
          <h1 className="mb-5 fw-bold display-5 text-center">
            <span className="animated-gradient">Game Details</span>
          </h1>

          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-6">
              <div className="fs-5 mb-4 text-start">
                <p className="mb-3">
                  <strong>Date:</strong> {game.date}
                </p>
                <p className="mb-3">
                  <strong>Time:</strong> {game.time}
                </p>
                <p className="mb-3">
                  <strong>Teams:</strong> {game.teams}
                </p>
                <p className="mb-3">
                  <strong>Location:</strong>{" "}
                  {locationDetails?.name || game.location}
                </p>
                {locationDetails?.address && (
                  <p className="mb-0">
                    <strong>Address:</strong> {locationDetails.address}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/schedule")}
                className="btn btn-outline-light rounded-pill py-2 px-4 fs-5"
              >
                ← Back to Schedules
              </button>
            </div>
            <div className="col-12 col-lg-6">
              <div className="rounded-4 overflow-hidden bg-black ratio ratio-4x3">
                {locationDetails?.mapUrl ? (
                  <iframe
                    src={locationDetails.mapUrl}
                    title={locationDetails.name || "Game location"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="d-flex justify-content-center align-items-center text-muted fs-6">
                    Map unavailable for this location.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      {renderContent()}
    </div>
  );
}
