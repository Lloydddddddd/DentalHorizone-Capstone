import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

import React from "react";

export default function GuestLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-clinic-navy">
      {children}
    </div>
  );
}


