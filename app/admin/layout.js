"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  return (
    <div className="flex overflow-hidden w-screen h-screen bg-neutral-900">
      {/* Sidebar */}
      <div className="p-8">
        <nav className="overflow-hidden w-64 rounded-xl border h-fit border-neutral-700 bg-neutral-800">
          <div className="p-6">
            <h2 className="text-xl font-bold text-neutral-300">Admin Panel</h2>
          </div>
          <div className="py-4">
            <NavLink href="/admin" exact>
              Dashboard
            </NavLink>
            <NavLink href="/admin/initiatives">
              Initiatives
            </NavLink>
            <NavLink href="/admin/team">
              Team
            </NavLink>
            <NavLink href="/admin/projects">
              Projects
            </NavLink>
            <NavLink href="/admin/partners">
              Partners
            </NavLink>
            <NavLink href="/admin/news">
              News
            </NavLink>
            <NavLink href="/admin/settings">
              Settings
            </NavLink>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="overflow-hidden flex-1 p-8">
        <div className="h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800">
          <div className="p-6 h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// Navigation Link Component with active state
function NavLink({ href, children, exact = false }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm ${
        isActive
          ? 'font-medium text-yellow-600 border-r-4 border-yellow-600 bg-yellow-600/10'
          : 'text-neutral-300 hover:bg-neutral-700 hover:text-yellow-600'
      }`}
    >
      {children}
    </Link>
  );
}
