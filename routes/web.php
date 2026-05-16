<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ArchivedPatientController;
use App\Http\Controllers\PatientVisitHistoryController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AppointmentTableController;

Route::get('/', fn () => Inertia::render('Auth/Login'));

Route::get('/landing', fn () => Inertia::render('Landing'));

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // === PATIENTS ===
    Route::resource('patients', PatientController::class);
    Route::post('patients/{patient}/archive', [PatientController::class, 'archive'])->name('patients.archive');
    Route::get('archived-patients', [PatientController::class, 'archivedIndex'])->name('archived-patients.index');
    Route::post('archived-patients/{archived}/restore', [PatientController::class, 'restore'])->name('archived-patients.restore');

    // Other Resources
    Route::resource('visit-histories', PatientVisitHistoryController::class);
    Route::resource('appointments', AppointmentController::class);

    // Custom Appointment Routes
    Route::get('/appointments/upcoming', [AppointmentTableController::class, 'upcoming'])->name('appointments.upcoming');
    Route::get('/appointments/missed', [AppointmentTableController::class, 'missed'])->name('appointments.missed');
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // === PATIENTS ===
    Route::resource('patients', PatientController::class);
    Route::post('patients/{patient}/archive', [PatientController::class, 'archive'])->name('patients.archive');
    Route::get('archived-patients', [PatientController::class, 'archivedIndex'])->name('archived-patients.index');
    Route::post('archived-patients/{archived}/restore', [PatientController::class, 'restore'])->name('archived-patients.restore');

    // Other Resources
    Route::resource('visit-histories', PatientVisitHistoryController::class);
    Route::resource('appointments', AppointmentController::class);

    // Custom Appointment Routes
    Route::get('/appointments/upcoming', [AppointmentTableController::class, 'upcoming'])->name('appointments.upcoming');
    Route::get('/appointments/missed', [AppointmentTableController::class, 'missed'])->name('appointments.missed');

    // Page Routes - Use Controller where possible
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::get('/appointments', fn () => inertia('Appointments/Index'))->name('appointments.index');
    Route::get('/payments', fn () => inertia('Payments/Index'))->name('payments.index');
    Route::get('/reports', fn () => inertia('Reports/Index'))->name('reports.index');
    Route::get('/settings', fn () => inertia('Settings/Index'))->name('settings.index');
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