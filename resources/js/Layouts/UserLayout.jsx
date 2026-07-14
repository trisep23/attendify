import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UserLayout({ user, children }) {
    const [showProfile, setShowProfile] = useState(false);
    const { url } = usePage();

    const currentPath = url.split('?')[0];

    function handleLogout() {
        router.post('/logout');
    }

    function getInitials(name = '') {
        return name
            .trim()
            .split(/\s+/)
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    }

    function isActive(path) {
        return (
            currentPath === path ||
            currentPath.startsWith(`${path}/`)
        );
    }

    function desktopNavClass(path) {
        return [
            'rounded-xl px-4 py-2 text-sm font-semibold transition',
            isActive(path)
                ? 'bg-cyan-500 text-white'
                : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-600',
        ].join(' ');
    }

    function mobileNavClass(path) {
        return [
            'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition',
            isActive(path)
                ? 'text-cyan-600'
                : 'text-slate-400',
        ].join(' ');
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/images/logo.png"
                            alt="Logo Attendify"
                            className="h-9 w-9 object-contain"
                        />

                        <span className="text-lg font-bold text-slate-800 sm:text-xl">
                            Attendify
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* Menu desktop */}
                        <nav className="hidden items-center gap-2 md:flex">
                            {user.role !== 'user' && (
                                <Link
                                    href="/dashboard"
                                    className={desktopNavClass('/dashboard')}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        <div className="hidden h-8 w-px bg-slate-200 md:block" />

                        {/* Profil */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowProfile((value) => !value)
                                }
                                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
                                aria-label="Buka profil"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-600">
                                    {getInitials(user.name)}
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="max-w-28 truncate text-sm font-semibold text-slate-800">
                                        {user.name}
                                    </p>

                                    <p className="text-xs capitalize text-slate-500">
                                        {user.role}
                                    </p>
                                </div>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`hidden text-slate-500 transition sm:block ${
                                        showProfile ? 'rotate-180' : ''
                                    }`}
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {showProfile && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowProfile(false)
                                        }
                                        className="fixed inset-0 z-40 cursor-default"
                                        aria-label="Tutup profil"
                                    />

                                    <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                        <div className="border-b border-slate-100 px-5 py-4">
                                            <p className="font-semibold text-slate-800">
                                                {user.name}
                                            </p>

                                            <p className="mt-1 break-all text-sm text-slate-500">
                                                {user.email}
                                            </p>

                                            <span className="mt-3 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold capitalize text-cyan-700">
                                                {user.role}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full px-5 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Konten */}
            <main className="mx-auto max-w-7xl px-4 py-5 pb-24 sm:px-6 md:pb-8 lg:px-8">
                {children}
            </main>

            {/* Bottom navigation mobile */}
            {user.role !== 'user' && (
                <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(15,23,42,0.08)] md:hidden">
                    <div className="mx-auto flex h-16 max-w-md px-4">
                        <Link
                            href="/dashboard"
                            className={mobileNavClass('/dashboard')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>

                            <span>Dashboard</span>
                        </Link>
                    </div>
                </nav>
            )}
        </div>
    );
}