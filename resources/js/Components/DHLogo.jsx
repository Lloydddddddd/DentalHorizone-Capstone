import React from "react";

export default function DHLogo({ className = "", width = 120 }) {
  return (
    <img
      src="/images/DHLOGO.png"   // make sure DHLOGO.png is inside public/images
      alt="Dental Horizon Logo"
      className={className}
      style={{ width: width, height: "auto" }} // keep aspect ratio
    />
  );
}
