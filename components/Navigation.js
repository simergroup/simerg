"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../utils/data";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import { oxanium } from "../utils/fonts";
import UserCard from "./UserCard";
import { useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Navigation = () => {
  const pathname = usePathname();
  const [isActive, setActive] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { data: session } = useSession();

  const toggleNavbar = () => {
    setActive(!isActive);
    setOpenDropdown(null);
  };

  const closeNavbar = () => {
    setActive(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Recursively check if a path is in the children tree
  const isPathInChildren = (children, targetPath) => {
    if (!children) return false;
    return children.some((child) => {
      if (child.path === targetPath) return true;
      if (child.children) {
        return isPathInChildren(child.children, targetPath);
      }
      return false;
    });
  };

  // Check if current path is child of a parent link (including all nested levels)
  const isChildPath = (link) => {
    if (!link.children) return false;
    return isPathInChildren(link.children, pathname);
  };

  // Check if link should be highlighted
  const isActiveLink = (link) => {
    return pathname === link.path || isChildPath(link);
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-900">
      {/* Logo Section - Always visible and clickable */}
      <div className="relative z-50 flex items-center justify-between w-full px-4 py-2 lg:justify-center">
        <Link href="/" className="text-neutral-300" onClick={closeNavbar}>
          <Image
            src="/Logos/SIMERG.png"
            alt="SIMERG Logo"
            width={300}
            height={100}
            className="sm:w-auto"
            priority={true}
            quality={100}
          />
        </Link>
        {session?.user && (
          <div className="absolute hidden md:block right-4">
            <UserCard user={session.user} />
          </div>
        )}
        <button aria-label="Toggle menu" onClick={toggleNavbar} className="text-neutral-300 lg:hidden">
          {isActive ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <div
        className={`${oxanium.className} w-full ${
          isActive
            ? "fixed top-10 left-0 z-40 h-screen w-full bg-neutral-900/95 backdrop-blur-sm flex flex-col items-center pt-24 overflow-y-auto"
            : "hidden lg:block"
        }`}
      >
        <div
          className={`flex ${
            isActive ? "flex-col space-y-8 items-center w-full px-4" : "lg:justify-center lg:items-center lg:space-x-8"
          }`}
        >
          {NAV_LINKS.map((link, index) => (
            <div key={link.path} className="relative group">
              <div className="inline-flex items-center group-hover:text-yellow-600">
                <Link
                  href={link.path}
                  className={`px-3 py-2 ${
                    isActiveLink(link) ? "text-yellow-600" : "text-neutral-300"
                  } font-bold uppercase md:text-lg transition-colors`}
                  onClick={closeNavbar}
                >
                  {link.name}
                </Link>

                {link.children && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(index);
                    }}
                    className={`p-2 ${isActiveLink(link) ? "text-yellow-600" : "text-neutral-300"} transition-colors`}
                  >
                    <ChevronDownIcon
                      className={`h-5 w-5 transform transition-transform duration-200 ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {link.children && (
                <div
                  className={`${
                    isActive
                      ? openDropdown === index
                        ? "block w-full md:w-auto"
                        : "hidden"
                      : "absolute hidden group-hover:block hover:block right-0 pt-2"
                  }`}
                >
                  <div className="rounded-md shadow-lg bg-neutral-800/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 md:w-auto">
                    <div className="py-1 min-w-fit max-w-min md:max-w-52">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className={`${
                            pathname === child.path || (child.children && isPathInChildren(child.children, pathname))
                              ? "bg-neutral-700 text-yellow-600"
                              : "text-neutral-300"
                          } block px-4 py-2 text-sm uppercase font-bold hover:bg-neutral-700 hover:text-yellow-600`}
                          onClick={closeNavbar}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Show UserCard in mobile menu */}
          {isActive && session?.user && (
            <div className="md:hidden">
              <UserCard user={session.user} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
