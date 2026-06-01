import React from "react";
import GuestLayout from "../Layouts/GuestLayout";
import "../../css/Landing.css";
import { Link, usePage } from "@inertiajs/react";

const Landing = () => {
  const { auth } = usePage().props;

  return (
    <GuestLayout>
      <div className="landing-page">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="logo">Dental Horizon</div>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
          </ul>
          <div className="nav-actions">
            {auth.user ? (
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="logout"
              >
                Logout
              </Link>
            ) : (
              <Link
                href={route("login")}
                className="login"
              >
                Login
              </Link>
            )}
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
              {auth.user ? (
                <Link href="/dashboard" className="btn primary">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href={route("login")} className="btn primary">
                  Login to Continue
                </Link>
              )}
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
