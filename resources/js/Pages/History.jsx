import { Head } from '@inertiajs/react';
import UserLayout from '../Layouts/UserLayout';

export default function History({ user }) {
    return (
        <>
            <Head title="Riwayat - Attendify" />

            <UserLayout user={user}>
                <section className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Riwayat Absensi
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Daftar seluruh absensi kerja praktik kamu.
                    </p>
                </section>

                <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
                    <p className="font-medium text-slate-600">
                        Belum ada riwayat absensi
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                        Data absensi akan ditampilkan di halaman ini.
                    </p>
                </section>
            </UserLayout>
        </>
    );
}