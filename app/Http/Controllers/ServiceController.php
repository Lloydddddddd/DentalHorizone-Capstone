<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        return Inertia::render('DentalServices', [
            'services' => Service::all(),
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|string',
        ]);

       Service::create($request->only('name', 'description', 'price'));

        return redirect()->route('services.index');
    }

    public function update(Request $request, Service $service)
    {
         $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|string|max:255',
        ]);

        $service->update($request->only('name', 'description', 'price'));

        return redirect()->route('services.index');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return redirect()->route('services.index');
    }
}


