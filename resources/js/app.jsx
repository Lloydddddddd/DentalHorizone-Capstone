import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import UpcomingAppointments from './pages/Appointments/UpcomingAppointments';
import MissedAppointments from './pages/Appointments/MissedAppointments';

createInertiaApp({
    title: (title) => `${title} — Dental Horizon`,
    resolve: (name) => {
        if (name === 'Appointments/Upcoming') {
            return UpcomingAppointments;
        } else if (name === 'Appointments/Missed') {
            return MissedAppointments;
        }
        return resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#1e3a8a',
    },
});