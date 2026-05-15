<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ArchivedPatientController;
use App\Http\Controllers\PatientVisitHistoryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentTableController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Root shows login form
Route::get('/', fn () => Inertia::render('Auth/Login'));

// Landing page (after login redirect)
Route::get('/landing', fn () => Inertia::render('Landing'));

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dental-services', [ServiceController::class, 'index'])->name('services.index');
    Route::post('/services', [ServiceController::class, 'store'])->name('services.store');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('services.update');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('patients', PatientController::class);
    //Archive and restore routes for patients
    Route::post('patients/{patient}/archive', [PatientController::class, 'archive'])->name('patients.archive');
    // Archived patients listing + restore (handled by PatientController)
    Route::get('archived-patients', [PatientController::class, 'archivedIndex'])->name('archived-patients.index');
    Route::post('archived-patients/{archived}/restore', [PatientController::class, 'restore'])->name('archived-patients.restore');
    Route::resource('visit-histories', PatientVisitHistoryController::class);
    // Appointments
    Route::resource('appointments', AppointmentController::class);
});

require __DIR__.'/auth.php';
// Additional application routes are defined above. Avoid duplicate route stubs
// that can shadow controller resource routes (kept intentionally minimal).
    
    Route::get('/appointments/upcoming', [AppointmentTableController::class, 'upcoming'])->name('appointments.upcoming');
    Route::get('/appointments/missed', [AppointmentTableController::class, 'missed'])->name('appointments.missed');
    
    Route::get('/patients',     fn () => inertia('Patients/Index'))->name('patients.index');
    Route::get('/appointments', fn () => inertia('Appointments/Index'))->name('appointments.index');
    Route::get('/payments',     fn () => inertia('Payments/Index'))->name('payments.index');
    Route::get('/reports',      fn () => inertia('Reports/Index'))->name('reports.index');
    Route::get('/settings',     fn () => inertia('Settings/Index'))->name('settings.index');


// Auth routes provided by Breeze / Fortify

    // Stub routes
    Route::get('/appointments', fn () => inertia('Appointments/Index'))->name('appointments.index');
    Route::get('/payments', fn () => inertia('Payments/Index'))->name('payments.index');
    Route::get('/reports', fn () => inertia('Reports/Index'))->name('reports.index');
});

/*
|--------------------------------------------------------------------------
| Logout Route
|--------------------------------------------------------------------------
*/
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/'); // send user back to login or landing
})->name('logout');

/*
|--------------------------------------------------------------------------
| Auth routes provided by Breeze / Fortify
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
