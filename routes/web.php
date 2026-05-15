<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ArchivedPatientController;
use App\Http\Controllers\PatientVisitHistoryController;
use App\Http\Controllers\AppointmentTableController;

Route::get('/', function () {
    return Inertia::render('Auth/Login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('patients', PatientController::class);
    Route::resource('archived-patients', ArchivedPatientController::class);
    Route::resource('visit-histories', PatientVisitHistoryController::class);
    
    Route::get('/appointments/upcoming', [AppointmentTableController::class, 'upcoming'])->name('appointments.upcoming');
    Route::get('/appointments/missed', [AppointmentTableController::class, 'missed'])->name('appointments.missed');
    
    Route::get('/patients',     fn () => inertia('Patients/Index'))->name('patients.index');
    Route::get('/appointments', fn () => inertia('Appointments/Index'))->name('appointments.index');
    Route::get('/payments',     fn () => inertia('Payments/Index'))->name('payments.index');
    Route::get('/reports',      fn () => inertia('Reports/Index'))->name('reports.index');
    Route::get('/settings',     fn () => inertia('Settings/Index'))->name('settings.index');
});

// Auth routes provided by Breeze / Fortify
require __DIR__.'/auth.php';