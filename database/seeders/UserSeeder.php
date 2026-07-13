<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@attendify.test'],
            [
                'name' => 'admin',
                'password' => 'password',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'trisep@gmail.com'],
            [
                'name' => 'trisep',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['email' => 'tri@attendify.test'],
            [
                'name' => 'Tri Septiani',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['email' => 'iin@attendify.test'],
            [
                'name' => 'IIn Sumarni',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['email' => 'hafiz@attendify.test'],
            [
                'name' => 'Muhammad Hafiz Assyifa',
                'password' => 'password',
                'role' => 'user',
            ]
        );
    }
}