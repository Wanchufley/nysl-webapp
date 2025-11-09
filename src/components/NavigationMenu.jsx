import React from 'react'

const NavigationMenu = () => {
  return (
     <div className="container-fluid bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark text-white border-0 p-4 p-md-5 rounded-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body text-center">
          <h1 className="mb-5 fw-bold display-5">
            <span className="animated-gradient">NYSL APP</span>
          </h1>


          <nav className="d-flex flex-column gap-4">
            <a href="#" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Schedule
            </a>
            <a href="#" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Team / Profile
            </a>
            <a href="#" className="btn btn-outline-light rounded-pill py-2 fs-5">
              Contact / Help
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default NavigationMenu
