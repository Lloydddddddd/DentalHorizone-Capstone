<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ArchivedPatientController;
use App\Http\Controllers\PatientVisitHistoryController;
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

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('patients', PatientController::class);
    Route::resource('archived-patients', ArchivedPatientController::class);
    Route::resource('visit-histories', PatientVisitHistoryController::class);

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
