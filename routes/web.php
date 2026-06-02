<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ArchivedPatientController;
use App\Http\Controllers\PatientVisitHistoryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\DashboardController;
use App\Models\Service;

Route::get('/', function () {
    return Inertia::render('Landing', [
        'services' => Service::all(),
    ]);
})->name('landing');

// Public booking route (patients can book without login)
Route::post('/appointments/public-store', [AppointmentController::class, 'publicStore'])->name('appointments.publicStore');

Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Patients
    Route::resource('patients', PatientController::class);
    Route::post('patients/{patient}/archive', [PatientController::class, 'archive'])->name('patients.archive');
    Route::get('archived-patients', [PatientController::class, 'archivedIndex'])->name('archived-patients.index');
    Route::post('archived-patients/{archived}/restore', [PatientController::class, 'restore'])->name('archived-patients.restore');

    // Other Resources
    Route::resource('visit-histories', PatientVisitHistoryController::class);
    Route::resource('appointments', AppointmentController::class);

    //JSON endpoint for services
    Route::get('/services/list', [ServiceController::class, 'list'])->name('services.list');
    // ✅ Dental Services
    Route::resource('services', ServiceController::class);

    // Page Routes
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');

    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments.index');

    // Upcoming & Missed Appointments
    Route::get('/Appointments/Upcoming', [AppointmentController::class, 'upcoming'])->name('appointments.upcoming');
    Route::get('/Appointments/Missed', [AppointmentController::class, 'missed'])->name('appointments.missed');

    Route::get('/payments', fn () => Inertia::render('Payments/Index'))->name('payments.index');
    Route::get('/reports', fn () => Inertia::render('Reports/Index'))->name('reports.index');
    Route::get('/settings', fn () => Inertia::render('Settings/Index'))->name('settings.index');
});

require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');