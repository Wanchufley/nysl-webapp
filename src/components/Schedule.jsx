import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { ref, onValue, off } from 'firebase/database';
import NavigationBar from './NavigationBar.jsx';

const Schedule = () => {
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

  return (
    <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4" style={{ maxWidth: '900px', width: '100%' }}>
        <NavigationBar />
        <div className="card-body text-center">
          <h2 className="mb-5 fw-bold display-5">Game Schedule</h2>
          <div className="table-responsive">
            <table className="table table-dark table-striped table-bordered text-white rounded-4 overflow-hidden">
              <thead className="table-dark text-white">
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Teams</th>
                  <th>Location</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {games && Object.entries(games).length > 0 ? (
                  Object.entries(games).map(([id, game]) => {
                    const locationInfo = locations[game.location];
                    return (
                      <tr key={id}>
                        <td>{game.date || "N/A"}</td>
                        <td>{game.time || "N/A"}</td>
                        <td>{game.teams || "N/A"}</td>
                        <td>
                          {locationInfo ? (
                            <a
                              href={locationInfo.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-info"
                            >
                              {locationInfo.name}
                            </a>
                          ) : (
                            game.location
                          )}
                        </td>
                        <td>{locationInfo?.address || "Unknown"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No games scheduled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
