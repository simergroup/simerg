"use client";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { FaAngleDown } from "react-icons/fa";
import Image from "next/image";
import Logo from "/public/Logos/enhance_branco_v2.png";
import { oxanium } from "./fonts";
import { MASTER_PROJECTS, INITIATIVES } from "./data";

const NavMenu = () => {
  const pathname = usePathname();

  const MenuActive = `${oxanium.className} rounded-lg uppercase text-yellow-600 font-bold text-lg py-2 px-4 flex items-center gap-2`;
  const MenuNotActive = `${oxanium.className} rounded-lg uppercase text-neutral-200 text-lg py-2 px-4 flex items-center gap-2`;

  const SubMenuActive = `${oxanium.className} text-yellow-600 font-bold py-2 px-4 flex items-center hover:scale-105 uppercase`;
  const SubMenuNotActive = `${oxanium.className} text-neutral-200 py-2 px-4 flex items-center hover:scale-105 uppercase`;

  const projectPaths = [
    "/projects",
    "/projects/master",
    "/projects/phd",
    "/projects/research",
  ];

  const initiativesPaths = [
    "/initiatives",
    "/initiatives/post-graduation-in-esports-and-digital-communities",
    "/initiatives/national-laboratory-of-scientific-research-in-esports",
    "/initiatives/empower-giving-back-on-the-move",
  ];

  const project = MASTER_PROJECTS.find((project) => project);
  const initiative = INITIATIVES.find((initiative) => initiative);

  return (
    <nav className="fixed z-50 w-full py-4 space-y-10 bg-neutral-900">
      <div className="flex items-center justify-center">
        <div>
          <Link href="/">
            <Image
              src={Logo}
              alt="Enhance Group Logo"
              className="w-36 md:w-56"
            />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex space-x-5">
          {/* INITIATIVES */}
          <div className="relative group hover:scale-110 group/item">
            <Link
              href="/initiatives"
              className={`${initiativesPaths.includes(pathname) ? MenuActive : MenuNotActive}`}
            >
              Initiatives
              <FaAngleDown
                size={18}
                className="duration-500 group-hover/item:rotate-90 hover:transition-all"
              />
            </Link>
            <div className="absolute hidden pt-2 w-[240px] group-hover:block">
              <ul className="py-2 text-sm border rounded-lg shadow-md border-neutral-700 text-neutral-300 bg-neutral-900">
                <li>
                  <Link
                    href="/initiatives/post-graduation-in-esports-and-digital-communities"
                    className={`${
                      pathname ===
                      "/initiatives/post-graduation-in-esports-and-digital-communities"
                        ? `${SubMenuActive}`
                        : `${SubMenuNotActive}`
                    }`}
                  >
                    Post Graduation in ESports and Digital Communities
                  </Link>
                </li>
                <li>
                  <Link
                    href="/initiatives/national-laboratory-of-scientific-research-in-esports"
                    className={`${
                      pathname ===
                      "/initiatives/national-laboratory-of-scientific-research-in-esports"
                        ? `${SubMenuActive}`
                        : `${SubMenuNotActive}`
                    }`}
                  >
                    National Laboratory of Scientific Research in Esports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/initiatives/empower-giving-back-on-the-move"
                    className={`${
                      pathname ===
                      "/initiatives/empower-giving-back-on-the-move"
                        ? `${SubMenuActive}`
                        : `${SubMenuNotActive}`
                    }`}
                  >
                    Empower - Giving back on the move
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* TEAM */}
          <div className="hover:scale-110">
            <Link
              href="/team"
              className={`${
                pathname === "/team" ? `${MenuActive}` : `${MenuNotActive}`
              }`}
            >
              Team
            </Link>
          </div>

          {/* PROJECTS */}
          <div className="relative group hover:scale-110 group/item">
            <Link
              href="/projects"
              className={`${projectPaths.includes(pathname) ? MenuActive : MenuNotActive}`}
            >
              Projects
              <FaAngleDown
                size={18}
                className="duration-500 group-hover/item:rotate-90 hover:transition-all"
              />
            </Link>
            <div className="absolute hidden pt-2 w-[140px] group-hover:block">
              <ul className="py-2 text-sm border rounded-lg shadow-md indent-1 border-neutral-700 text-neutral-300 bg-neutral-900">
                <li>
                  <Link
                    href="/projects/master"
                    className={`${
                      pathname === "/projects/master" ||
                      pathname === `/projects/master/${project.slug}`
                        ? `${SubMenuActive}`
                        : `${SubMenuNotActive}`
                    }`}
                  >
                    Master
                  </Link>
                </li>
                <Link
                  href="/projects/phd"
                  className={`${pathname === "/projects/phd" ? SubMenuActive : SubMenuNotActive}`}
                >
                  Phd
                </Link>
                <Link
                  href="/projects/research"
                  className={`${pathname === "/projects/research" ? SubMenuActive : SubMenuNotActive}`}
                >
                  Research
                </Link>
              </ul>
            </div>
          </div>

          {/* PARTNERS */}
          <div className="hover:scale-110">
            <Link
              href="/partners"
              className={`link ${
                pathname === "/partners" ? `${MenuActive}` : `${MenuNotActive}`
              }`}
            >
              Partners
            </Link>
          </div>

          {/* CONTACT US */}
          <div className="hover:scale-110">
            <Link
              href="/contact-us"
              className={`link ${
                pathname === "/contact-us"
                  ? `${MenuActive}`
                  : `${MenuNotActive}`
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
