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

        $user1 = User::updateOrCreate(
            ['email' => 'trisep@gmail.com'],
            [
                'name' => 'Tri Septiani',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        $user2 = User::updateOrCreate(
            ['email' => 'iin@gmail.com'],
            [
                'name' => 'Iin Sumarni',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        $user3 = User::updateOrCreate(
            ['email' => 'hafiz@gmail.com'],
            [
                'name' => 'Muhammad Hafiz Assyifa',
                'password' => 'password',
                'role' => 'user',
            ]
        );

        // Hapus user dengan email domain lama agar bersih
        User::whereIn('email', [
            'tri@attendify.test',
            'iin@attendify.test',
            'hafiz@attendify.test'
        ])->delete();

        // Seed data absensi tanggal 6 s.d 14 Juli 2026
        $startDate = new \DateTime('2026-07-06');
        $endDate = new \DateTime('2026-07-14');
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod($startDate, $interval, $endDate->modify('+1 day'));

        $users = [$user1, $user2, $user3];

        foreach ($users as $u) {
            foreach ($dateRange as $date) {
                $dayOfWeek = (int) $date->format('N'); // 1 (Senin) s.d 7 (Minggu)

                // Absensi hanya di hari kerja (Senin s.d Jumat)
                if ($dayOfWeek <= 5) {
                    // Membuat jam masuk acak antara 07:30 s.d 08:15
                    $checkInHour = rand(0, 1) === 0 ? '07' : '08';
                    $checkInMin = $checkInHour === '07' ? str_pad(rand(30, 59), 2, '0', STR_PAD_LEFT) : str_pad(rand(0, 15), 2, '0', STR_PAD_LEFT);
                    $checkInSec = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);

                    // Membuat jam pulang acak antara 17:00 s.d 17:45
                    $checkOutHour = '17';
                    $checkOutMin = str_pad(rand(0, 45), 2, '0', STR_PAD_LEFT);
                    $checkOutSec = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);

                    $u->attendances()->updateOrCreate(
                        ['date' => $date->format('Y-m-d')],
                        [
                            'check_in_time' => "$checkInHour:$checkInMin:$checkInSec",
                            'check_out_time' => "$checkOutHour:$checkOutMin:$checkOutSec",
                            'status' => 'hadir',
                        ]
                    );
                }
            }
        }
    }
}