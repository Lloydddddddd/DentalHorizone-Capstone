<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'name' => 'Admin',
            'username' => 'Admin',
            'email' => 'Admin@DentalHorizone.com',
            'password' => Hash::make('Admin123'),
            'is_admin' => true,
        ]);
    }
}
