import React from "react";
import { Link } from "@inertiajs/react";
import GuestLayout from "../Layouts/GuestLayout";
import "../../css/Landing.css";

const Landing = () => {
  return (
    <GuestLayout>
      <div className="landing-page">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo">Dental Horizon</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/patients">Patient Management</Link></li>
            <li><Link href="/appointments">Appointment Management</Link></li>
          </ul>
          <div className="nav-actions">
            <Link
              href={route("logout")}
              method="post"
              as="button"
              className="logout"
            >
              Logout
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="hero">
          <div className="hero-text">
            <h1>Streamline Your Dental Clinic with Precision</h1>
            <p>
              High-performance SaaS engineered for modern dentistry. Scale your
              practice with clinical-grade intelligence and automated patient
              lifecycles.
            </p>
            <div className="hero-buttons">
              <Link href="/dashboard" className="btn primary">
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image">
            <img src="/images/dental-dashboard.png" alt="Dental Horizon UI" />
            <span className="badge">Security Rating A+ HIPAA Compliant</span>
          </div>
        </header>
      </div>
    </GuestLayout>
  );
};

export default Landing;
