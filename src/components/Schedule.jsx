import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase.js';
import { ref, onValue, off } from 'firebase/database';
import NavigationBar from './NavigationBar.jsx';

const Schedule = ({ user, onSignIn, onSignOut }) => {
  const [data, setData] = useState({ locations: {}, games: {} });

  useEffect(() => {
    const dbRef = ref(db);
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        console.log("No data available");
      }
    };
    onValue(dbRef, callback);

    return () => off(dbRef, 'value', callback);
  }, []);

  const { games, locations } = data;
  const gameEntries = games ? Object.entries(games) : [];

  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4" style={{ maxWidth: '1100px', width: '100%' }}>
        <NavigationBar user={user} onSignIn={onSignIn} onSignOut={onSignOut} />
        <div className="card-body text-center">
          <h2 className="mb-5 fw-bold display-5">Game Schedule</h2>
          {gameEntries.length > 0 ? (
            <div className="row g-3 text-start">
              {gameEntries.map(([id, game]) => {
                const locationInfo = locations[game.location];
                return (
                  <div
                    key={id}
                    className="col-12 col-md-4 col-lg-3 d-flex"
                  >
                    <div className="card bg-black text-white border border-secondary rounded-4 w-100 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-baseline mb-2">
                          <div className="fw-semibold small text-wrap text-break">
                            {game.date || 'Date TBA'}
                          </div>
                          <div className="text-end">
                            <div className="small fw-semibold text-info">
                              Time
                            </div>
                            <div className="small text-light">
                              {game.time || 'Time TBA'}
                            </div>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="small fw-semibold text-info">Teams</div>
                          <div className="small text-wrap text-break">
                            {game.teams || 'TBA'}
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="small fw-semibold text-info">Location</div>
                          {locationInfo ? (
                            <>
                              <a
                                href={locationInfo.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-info text-decoration-underline small d-inline-block text-wrap text-break"
                              >
                                {locationInfo.name}
                              </a>
                              {locationInfo.address && (
                                <div className="mt-2">
                                  <div className="small fw-semibold text-info">
                                    Address
                                  </div>
                                  <div className="small text-wrap text-break">
                                    {locationInfo.address}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="small text-wrap text-break">
                              {game.location || 'TBA'}
                            </div>
                          )}
                        </div>
                        <div className="mt-auto pt-2">
                          <Link
                            to={`/game-details/${id}`}
                            className="btn btn-outline-light btn-sm rounded-pill w-100"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted">
              No games scheduled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
