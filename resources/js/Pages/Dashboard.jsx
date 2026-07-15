import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '../Layouts/UserLayout';

const defaultStatistics = {
    hadir: 0,
    izin: 0,
    alpha: 0,
};

export default function Dashboard({
    user,
    statistics = defaultStatistics,
    todayAttendance = null,
    recentAttendances = [],
}) {
    const currentDate = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    const currentHour = new Date().getHours();

    const greeting =
        currentHour < 11
            ? 'Selamat pagi'
            : currentHour < 15
              ? 'Selamat siang'
              : currentHour < 18
                ? 'Selamat sore'
                : 'Selamat malam';

    const hasCheckedIn = Boolean(todayAttendance?.check_in_time);
    const hasCheckedOut = Boolean(todayAttendance?.check_out_time);

    const todayStatus = todayAttendance?.status ?? 'Belum absen';

    function handleAttendance(type) {
        const endpoint =
            type === 'check-in'
                ? '/attendance/check-in'
                : '/attendance/check-out';

        const successMessage =
            type === 'check-in'
                ? 'Absen masuk berhasil.'
                : 'Absen pulang berhasil.';

        router.post(
            endpoint,
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    alert(successMessage);
                },

                onError: (errors) => {
                    if (errors.attendance) {
                        alert(errors.attendance);
                    }
                },
            },
        );
    }

    return (
        <>
            <Head title="Dashboard - Attendify" />

            <UserLayout user={user}>
                {/* Sapaan dan tanggal */}
                <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            {greeting}, {user.name} 👋
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Berikut ringkasan absensi kerja praktik kamu hari
                            ini.
                        </p>
                    </div>

                    <div className="w-fit rounded-xl bg-white px-4 py-2 shadow-sm">
                        <p className="text-sm font-medium text-slate-600">
                            {currentDate}
                        </p>
                    </div>
                </section>

                {/* Statistik */}
                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <StatisticCard
                        title="Total Hadir"
                        value={statistics.hadir}
                        description="Hari kehadiran"
                        variant="green"
                    />

                    <StatisticCard
                        title="Total Izin"
                        value={statistics.izin}
                        description="Hari izin"
                        variant="yellow"
                    />

                    <StatisticCard
                        title="Total Alpha"
                        value={statistics.alpha}
                        description="Tidak hadir"
                        variant="red"
                    />
                </section>

                {/* Status dan tombol absensi */}
                <section className="mb-6 grid gap-6 lg:grid-cols-2">
                    {/* Status hari ini */}
                    <article className="rounded-3xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Status Hari Ini
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Informasi absensi hari ini.
                                </p>
                            </div>

                            <StatusBadge status={todayStatus} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Jam masuk
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                    {formatTime(
                                        todayAttendance?.check_in_time,
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5">
                                <p className="text-sm text-slate-500">
                                    Jam pulang
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-800">
                                    {formatTime(
                                        todayAttendance?.check_out_time,
                                    )}
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Tombol absensi */}
                    <article className="rounded-3xl bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">
                                Absensi
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Silakan catat waktu absensi masuk dan pulang Anda.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="button"
                                disabled={hasCheckedIn}
                                onClick={() =>
                                    handleAttendance('check-in')
                                }
                                className="w-full rounded-2xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {hasCheckedIn
                                    ? 'Sudah Absen Masuk'
                                    : 'Absen Masuk'}
                            </button>

                            <button
                                type="button"
                                disabled={!hasCheckedIn || hasCheckedOut}
                                onClick={() =>
                                    handleAttendance('check-out')
                                }
                                className="w-full rounded-2xl border-2 border-cyan-500 px-6 py-4 font-semibold text-cyan-600 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                            >
                                {hasCheckedOut
                                    ? 'Sudah Absen Pulang'
                                    : 'Absen Pulang'}
                            </button>
                        </div>
                    </article>
                </section>

                {/* Riwayat terbaru */}
                <section className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                Riwayat Terbaru
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Lima data absensi terakhir.
                            </p>
                        </div>

                        <Link
                            href="/history"
                            className="text-left text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                        >
                            Lihat semua riwayat
                        </Link>
                    </div>

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
                                {recentAttendances.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-3 py-12 text-center"
                                        >
                                            <p className="font-medium text-slate-600">
                                                Belum ada riwayat absensi
                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Data akan muncul setelah kamu
                                                melakukan absensi.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentAttendances.map((attendance) => (
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

function StatisticCard({ title, value, description, variant }) {
    const variants = {
        green: {
            background: 'bg-emerald-100',
            text: 'text-emerald-600',
            icon: 'check',
        },
        yellow: {
            background: 'bg-amber-100',
            text: 'text-amber-600',
            icon: 'warning',
        },
        red: {
            background: 'bg-red-100',
            text: 'text-red-600',
            icon: 'close',
        },
    };

    const style = variants[variant];

    return (
        <article className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-800">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.background} ${style.text}`}
                >
                    <StatisticIcon type={style.icon} />
                </div>
            </div>
        </article>
    );
}

function StatisticIcon({ type }) {
    const commonProps = {
        xmlns: 'http://www.w3.org/2000/svg',
        width: 23,
        height: 23,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    if (type === 'check') {
        return (
            <svg {...commonProps}>
                <path d="m5 12 4 4L19 6" />
            </svg>
        );
    }

    if (type === 'warning') {
        return (
            <svg {...commonProps}>
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.8 3h16a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
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
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                styles[normalizedStatus] ??
                'bg-slate-100 text-slate-600'
            }`}
        >
            {status}
        </span>
    );
}

function formatTime(time) {
    if (!time) {
        return '-';
    }

    return time.slice(0, 5);
}

function formatDate(date) {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}