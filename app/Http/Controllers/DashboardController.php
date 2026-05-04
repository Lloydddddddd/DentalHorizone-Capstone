<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Render the main dashboard page.
     */
    public function index(): Response
    {
        // In a real app, these would come from DB queries.
        $stats = [
            'patients_seen'   => 24,
            'revenue_today'   => 3240,
            'new_patients'    => 5,
            'appointments'    => 32,
        ];

        $appointments = [
            [
                'time'       => '09:00 AM',
                'patient'    => 'Emma Thompson',
                'avatar'     => 'https://storage.googleapis.com/banani-avatars/avatar/female/25-35/European/2',
                'treatment'  => 'Root Canal',
                'doctor'     => 'Dr. Smith',
                'status'     => 'In Progress',
            ],
            [
                'time'       => '10:30 AM',
                'patient'    => 'Michael Chen',
                'avatar'     => 'https://storage.googleapis.com/banani-avatars/avatar/male/25-35/European/3',
                'treatment'  => 'Checkup',
                'doctor'     => 'Dr. Davis',
                'status'     => 'Waiting',
            ],
            [
                'time'       => '11:15 AM',
                'patient'    => 'Sarah Wilson',
                'avatar'     => 'https://storage.googleapis.com/banani-avatars/avatar/female/25-35/European/4',
                'treatment'  => 'Cleaning',
                'doctor'     => 'Dr. Smith',
                'status'     => 'Confirmed',
            ],
            [
                'time'       => '01:00 PM',
                'patient'    => 'James Rodriguez',
                'avatar'     => 'https://storage.googleapis.com/banani-avatars/avatar/male/25-35/European/5',
                'treatment'  => 'Consultation',
                'doctor'     => 'Dr. Davis',
                'status'     => 'Confirmed',
            ],
        ];

        $recentPayments = [
            ['label' => 'Root Canal',   'time' => 'Today, 9:05 AM',  'amount' => 850],
            ['label' => 'Consultation', 'time' => 'Today, 10:45 AM', 'amount' => 150],
            ['label' => 'Cleaning',     'time' => 'Today, 8:30 AM',  'amount' => 120],
        ];

        return Inertia::render('Dashboard', compact('stats', 'appointments', 'recentPayments'));
    }
}
