import React from 'react';
import Link from 'next/link';

type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="navbar bg-base-300">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost normal-case text-xl">
                        <div className="flex items-center h-12"> {/*  Control the height here! */}
                            <img
                                src="/images/main-logo.png"
                                alt="didpip Logo"
                                className="h-full object-contain" //  Key changes here
                            />
                        </div>
                    </Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <details>
                                <summary>Resources</summary>
                                <ul className="p-2 bg-base-100 rounded-t-none">
                                    <li><Link href="/pips">All Resources</Link></li>
                                    <li><Link href="/whiteboard">Whiteboard</Link></li>
                                    <li><Link href="/wordcloud">Word Cloud</Link></li>
                                    <li><Link href="/chart">Chart</Link></li>
                                    <li><Link href="/hundreds-square">Hundreds Square</Link></li>
                                    <li><Link href="/number-line">Number Line</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><Link href="/profile">Profile</Link></li>
                    </ul>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>
            <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                <div>
                    <p>Copyright © {new Date().getFullYear()} - Didpip</p>
                </div>
            </footer>
        </div>
    );
}
