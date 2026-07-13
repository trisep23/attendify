<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function checkIn(Request $request): RedirectResponse
    {
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