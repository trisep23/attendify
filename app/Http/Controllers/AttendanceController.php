<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    private function isValidWifi(string $ip): bool
    {
        // Izinkan localhost untuk mempermudah development lokal
        if (app()->environment('local') && ($ip === '127.0.0.1' || $ip === '::1')) {
            return true;
        }

        $ipLong = ip2long($ip);
        if ($ipLong === false) {
            return false;
        }

        $minLong = ip2long(env('WIFI_IP_MIN', '10.36.102.0'));
        $maxLong = ip2long(env('WIFI_IP_MAX', '10.36.102.254'));

        return $ipLong >= $minLong && $ipLong <= $maxLong;
    }

    public function checkIn(Request $request): RedirectResponse
    {
        if (! $this->isValidWifi($request->ip())) {
            return back()->withErrors([
                'attendance' => 'Kamu harus terhubung ke WiFi kantor (10.36.102.0-254) untuk melakukan absensi.',
            ]);
        }

        $user = $request->user();

        // Hanya role user yang boleh melakukan absensi.
        abort_if($user->role !== 'user', 403);

        $attendance = $user
            ->attendances()
            ->whereDate('date', today())
            ->first();

        if ($attendance?->check_in_time) {
            return back()->withErrors([
                'attendance' => 'Kamu sudah melakukan absen masuk hari ini.',
            ]);
        }

        if ($attendance) {
            $attendance->update([
                'check_in_time' => now()->format('H:i:s'),
                'status' => 'hadir',
            ]);
        } else {
            $user->attendances()->create([
                'date' => today()->toDateString(),
                'check_in_time' => now()->format('H:i:s'),
                'status' => 'hadir',
            ]);
        }

        return back();
    }

    public function checkOut(Request $request): RedirectResponse
    {
        if (! $this->isValidWifi($request->ip())) {
            return back()->withErrors([
                'attendance' => 'Kamu harus terhubung ke WiFi kantor (10.36.102.0-254) untuk melakukan absensi.',
            ]);
        }

        $user = $request->user();

        abort_if($user->role !== 'user', 403);

        $attendance = $user
            ->attendances()
            ->whereDate('date', today())
            ->first();

        if (! $attendance || ! $attendance->check_in_time) {
            return back()->withErrors([
                'attendance' => 'Kamu harus absen masuk terlebih dahulu.',
            ]);
        }

        if ($attendance->check_out_time) {
            return back()->withErrors([
                'attendance' => 'Kamu sudah melakukan absen pulang hari ini.',
            ]);
        }

        $attendance->update([
            'check_out_time' => now()->format('H:i:s'),
        ]);

        return back();
    }
}