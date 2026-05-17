import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}

