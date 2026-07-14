import { Head, Link } from '@inertiajs/react';
import UserLayout from '../Layouts/UserLayout';

export default function History({ user, attendances = [] }) {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateString));
    };

    const formatTime = (timeString) => {
        if (!timeString) return '-';
        return timeString.slice(0, 5);
    };

    return (
        <>
            <Head title="Riwayat - Attendify" />

            <UserLayout user={user}>
                <section className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
                            aria-label="Kembali"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </Link>

                        <h1 className="text-2xl font-bold text-slate-800">
                            Riwayat Absensi
                        </h1>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead>
                                <tr className="border-b border-slate-200 text-sm text-slate-500">
                                    <th className="px-3 py-4 font-medium">
                                        Tanggal
                                    </th>

                                    <th className="px-3 py-4 font-medium">
                                        Jam masuk
                                    </th>

                                    <th className="px-3 py-4 font-medium">
                                        Jam pulang
                                    </th>

                                    <th className="px-3 py-4 font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendances.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-3 py-12 text-center"
                                        >
                                            <p className="font-medium text-slate-600">
                                                Belum ada riwayat absensi
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Data absensi kamu akan muncul di sini.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    attendances.map((attendance) => (
                                        <tr
                                            key={attendance.id}
                                            className="border-b border-slate-100 last:border-none"
                                        >
                                            <td className="px-3 py-4 font-medium text-slate-700">
                                                {formatDate(
                                                    attendance.date,
                                                )}
                                            </td>

                                            <td className="px-3 py-4 text-slate-600">
                                                {formatTime(
                                                    attendance.check_in_time,
                                                )}
                                            </td>

                                            <td className="px-3 py-4 text-slate-600">
                                                {formatTime(
                                                    attendance.check_out_time,
                                                )}
                                            </td>

                                            <td className="px-3 py-4">
                                                <StatusBadge
                                                    status={
                                                        attendance.status
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </UserLayout>
        </>
    );
}

function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase();

    const styles = {
        hadir: 'bg-emerald-100 text-emerald-700',
        izin: 'bg-amber-100 text-amber-700',
        alpha: 'bg-red-100 text-red-700',
        'belum absen': 'bg-slate-100 text-slate-600',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                styles[normalizedStatus] ?? styles['belum absen']
            }`}
        >
            {status}
        </span>
    );
}