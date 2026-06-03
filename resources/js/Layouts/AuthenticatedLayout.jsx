import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import DHLogo from '@/Components/DHLogo'; // add your logo component

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav
                className="navbar flex items-center justify-between px-6 py-4 text-white shadow"
                style={{ backgroundColor: '#0a3d62' }}
                >
                {/* Logo */}
                <div className="logo">
                    <DHLogo size={40} />
                </div>

                {/* Nav links */}
                <ul className="nav-links flex items-center gap-6">
                    {/* Example: <li><NavLink href={route('dashboard')}>Dashboard</NavLink></li> */}
                </ul>

                {/* User dropdown (kept intact, just styled inline) */}
                <div className="nav-actions">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 hover:text-gray-900 transition"
                                >
                                    {user.name}
                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>

                            {user.is_admin && (
                                <Dropdown.Link href={route('register')}>
                                    Create New Account
                                </Dropdown.Link>
                            )}

                            <Dropdown.Link href={route('landing')}>
                                Back to Landing
                            </Dropdown.Link>

                            <Dropdown.Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Main layout */}
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    {header && (
                        <header className="bg-white shadow">
                            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    <main>{children}</main>
                </div>
            </div>
        </div>
    );
}
