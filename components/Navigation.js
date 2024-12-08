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
			<div className="relative z-50 flex w-full items-center justify-between px-4 py-2 lg:justify-center">
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
					<div className="absolute right-4 hidden md:block">
						<UserCard user={session.user} />
					</div>
				)}
				<button
					aria-label="Toggle menu"
					onClick={toggleNavbar}
					className="text-neutral-300 lg:hidden"
				>
					{isActive ? <FaTimes size={18} /> : <FaBars size={18} />}
				</button>
			</div>

			{/* Navigation Links */}
			<div
				className={`${oxanium.className} w-full ${
					isActive
						? "fixed left-0 top-10 z-40 flex h-screen w-full flex-col items-center overflow-y-auto bg-neutral-900/95 pt-24 backdrop-blur-sm"
						: "hidden lg:block"
				}`}
			>
				<div
					className={`flex ${
						isActive
							? "w-full flex-col items-center space-y-8 px-4"
							: "lg:items-center lg:justify-center lg:space-x-8"
					}`}
				>
					{NAV_LINKS.map((link, index) => (
						<div key={link.path} className="group relative">
							<div className="inline-flex items-center group-hover:text-yellow-600">
								<Link
									href={link.path}
									className={`px-3 py-2 ${
										isActiveLink(link) ? "text-yellow-600" : "text-neutral-300"
									} font-bold uppercase transition-colors md:text-lg`}
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
											: "absolute right-0 hidden pt-2 hover:block group-hover:block"
									}`}
								>
									<div className="rounded-md bg-neutral-800/95 shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm md:w-auto">
										<div className="min-w-fit max-w-min py-1 md:max-w-52">
											{link.children.map((child) => (
												<Link
													key={child.path}
													href={child.path}
													className={`${
														pathname === child.path ||
														(child.children && isPathInChildren(child.children, pathname))
															? "bg-neutral-700 text-yellow-600"
															: "text-neutral-300"
													} block px-4 py-2 text-sm font-bold uppercase hover:bg-neutral-700 hover:text-yellow-600`}
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
