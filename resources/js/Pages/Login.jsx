import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    function handleSubmit(event) {
        event.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
        });
    }

    return (
        <>
            <Head title="Login - Attendify" />

            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
                <section className="w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-xl">
                    <div className="mb-8 text-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo Attendify"
                            className="mx-auto -mb-4 h-28 w-28 scale-125 object-contain"
                        />

                        <h1 className="text-3xl font-bold text-slate-800">
                            Attendify
                        </h1>

                        <p className="mt-1 text-lg text-slate-600">
                            Absensi kerja praktik
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block font-medium text-slate-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                                placeholder="Masukkan email"
                                autoComplete="email"
                                required
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block font-medium text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={
                                        showPassword ? 'text' : 'password'
                                    }
                                    name="password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Sembunyikan password'
                                            : 'Tampilkan password'
                                    }
                                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition hover:text-cyan-500"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m2 2 20 20" />
                                            <path d="M6.7 6.7C4.8 8 3.3 9.8 2.5 12c1.6 4.1 5.3 7 9.5 7 1.5 0 2.9-.4 4.2-1" />
                                            <path d="M10.7 10.7a2 2 0 0 0 2.6 2.6" />
                                            <path d="M9.9 5.1A9 9 0 0 1 12 5c4.2 0 7.9 2.9 9.5 7a11 11 0 0 1-2 3.2" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2.5 12S5.5 5 12 5s9.5 7 9.5 7-3 7-9.5 7-9.5-7-9.5-7Z" />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Tombol Login */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}