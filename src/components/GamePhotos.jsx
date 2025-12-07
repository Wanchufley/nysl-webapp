import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  ref as dbRef,
  onValue,
  off,
  push,
  serverTimestamp,
} from "firebase/database";
import NavigationBar from "./NavigationBar.jsx";
import { storage, db } from "../firebase.js";

export default function GamePhotos({ user, onSignIn, onSignOut }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [pictures, setPictures] = useState([]);

  // Subscribe to picture metadata for this game from Realtime Database
  useEffect(() => {
    if (!id) return;

    const picturesRef = dbRef(db, `pictures/${id}`);
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.val();
        const list = Object.entries(raw)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setPictures(list);
      } else {
        setPictures([]);
      }
    };

    onValue(picturesRef, callback);
    return () => off(picturesRef, "value", callback);
  }, [id]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      // User canceled the picker; do nothing
      return;
    }
    console.log("Selected file:", file.name);
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile || !id) return;

    try {
      setUploading(true);
      setError(null);

      const fileExt = selectedFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;
      const fileRef = storageRef(storage, `pictures/${id}/${fileName}`);

      await uploadBytes(fileRef, selectedFile);
      const downloadUrl = await getDownloadURL(fileRef);

      const author = user?.email || "anonymous@example.com";
      const picturesRef = dbRef(db, `pictures/${id}`);
      await push(picturesRef, {
        author,
        url: downloadUrl,
        timestamp: serverTimestamp(),
      });

      setSelectedFile(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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

        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Game Photos</h2>
            <button
              type="button"
              className="btn btn-outline-light rounded-pill py-2 px-3 fs-6"
              onClick={() => navigate(`/game-details/${id}`)}
            >
              ← Back to Game
            </button>
          </div>

          <form onSubmit={handleUpload} className="mb-4">
            <div className="mb-3 text-start">
              <label htmlFor="photo-input" className="form-label">
                Add a photo
              </label>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="form-control"
                onChange={handleFileChange}
              />
              <div className="form-text text-muted">
                You can take a new picture or choose one from your gallery.
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4"
              disabled={!selectedFile || uploading || !user}
            >
              {uploading ? "Posting..." : "Post"}
            </button>
            {!user && (
              <div className="small text-warning mt-2">
                Sign in to post photos.
              </div>
            )}
          </form>

          <div className="mt-3 text-start">
            {pictures.length === 0 ? (
              <div className="text-muted">
                No photos yet. Be the first to post!
              </div>
            ) : (
              <div className="row g-3">
                {pictures.map((pic) => (
                  <div
                    key={pic.id}
                    className="col-6 col-md-4 col-lg-3 d-flex"
                  >
                    <div className="card bg-black text-white border border-secondary rounded-4 w-100 h-100">
                      <div className="ratio ratio-4x3">
                        <img
                          src={pic.url}
                          alt={pic.author || "Game photo"}
                          className="img-fluid w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="card-body py-2">
                        <div className="small fw-semibold text-truncate">
                          {pic.author || "Unknown"}
                        </div>
                        {pic.timestamp && (
                          <div className="small text-muted">
                            {new Date(pic.timestamp).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
