"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../utils/data";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import Image from "next/image";
import { oxanium } from "../utils/fonts";

const Navigation = () => {
  const pathname = usePathname();
  const [isActive, setActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const toggleNavbar = () => {
    setActive(!isActive);
  };

  const closeNavbar = () => {
    setActive(false);
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-900">
      <div className="flex justify-between px-2 py-4 md:mx-auto md:w-fit">
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
        <button aria-label="Aria menu button" onClick={toggleNavbar} className="text-neutral-300 md:hidden">
          {isActive ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>
      <div className="flex justify-end">
        <div
          className={`${oxanium.className} && ${
            isActive
              ? "flex flex-col z-50 py-4 w-full fixed min-h-svh overflow-hidden space-y-10 items-center justify-center bg-neutral-900 text-xl"
              : "hidden md:flex md:w-fit md:mx-auto md:space-x-8"
          } `}
        >
          {NAV_LINKS.map((link, index) => (
            <div key={link.path} className="group group/item">
              <div className="flex gap-1 mx-auto w-fit">
                <Link
                  key={link.path}
                  href={link.path}
                  className={`${
                    pathname === link.path
                      ? "text-yellow-600 font-bold uppercase md:text-lg"
                      : "text-neutral-300 font-bold uppercase md:text-lg"
                  }`}
                  onClick={closeNavbar}
                >
                  {link.name}
                </Link>

                {link.children && (
                  <button
                    aria-label="Aria dropdown button"
                    className={`${
                      pathname === link.path
                        ? "text-yellow-600 text-base uppercase"
                        : "text-neutral-300 text-base uppercase"
                    }`}
                    onClick={() => handleDropdownToggle(index)}
                  >
                    {activeDropdown === index ? (
                      <FaTimes className="" />
                    ) : (
                      <FaAngleDown className="duration-500 group-hover/item:rotate-90 hover:transition-all" />
                    )}
                  </button>
                )}
              </div>
              {link.children && (
                <div
                  className={`${
                    activeDropdown === index
                      ? "md:absolute md:pt-2"
                      : "hidden md:absolute md:hidden md:pt-2 md:group-hover:block"
                  }`}
                >
                  <ul className="max-w-xs px-4 py-2 space-y-2 text-sm border rounded-lg shadow-md border-neutral-700 text-neutral-300 bg-neutral-900">
                    {link.children.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className={`${
                            pathname === child.path
                              ? "text-yellow-600 font-bold text-base uppercase"
                              : "text-neutral-300 font-bold text-base uppercase"
                          }`}
                          onClick={() => {
                            closeNavbar();
                            setActiveDropdown(null);
                          }}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
