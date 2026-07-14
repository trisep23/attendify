<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    private function isValidLocation(?float $lat, ?float $lon): bool
    {
        // Izinkan localhost/bypass untuk mempermudah development lokal jika koordinat kosong
        if (app()->environment('local') && (is_null($lat) || is_null($lon))) {
            return true;
        }

        if (is_null($lat) || is_null($lon)) {
            return false;
        }

        $officeLat = (float) env('OFFICE_LATITUDE', -5.3658690);
        $officeLon = (float) env('OFFICE_LONGITUDE', 105.2192606);
        $allowedRadius = (float) env('OFFICE_RADIUS_METERS', 25);

        $distance = $this->calculateDistance($lat, $lon, $officeLat, $officeLon);

        return $distance <= $allowedRadius;
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // in meters

        $latFrom = deg2rad($lat1);
        $lonFrom = deg2rad($lon1);
        $latTo = deg2rad($lat2);
        $lonTo = deg2rad($lon2);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }

    public function checkIn(Request $request): RedirectResponse
    {
        $request->validate([
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);

        if (! $this->isValidLocation($request->input('latitude'), $request->input('longitude'))) {
            return back()->withErrors([
                'attendance' => 'Kamu berada di luar radius kantor yang ditentukan (25 meter) atau GPS tidak aktif.',
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
        $request->validate([
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
        ]);

        if (! $this->isValidLocation($request->input('latitude'), $request->input('longitude'))) {
            return back()->withErrors([
                'attendance' => 'Kamu berada di luar radius kantor yang ditentukan (25 meter) atau GPS tidak aktif.',
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