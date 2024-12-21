"use client";

import Image from "next/image";
import Link from "next/link";
import { oxanium } from "../utils/fonts";
import { useEffect, useState } from "react";

export default function InitiativesList({ slug, initiatives }) {
	// If initiatives are provided, render the list view
	if (initiatives) {
		return (
			<div className="container px-4 py-8 mx-auto">
				<div className="mx-auto max-w-4xl">
					<h1
						className={`${oxanium.className} mb-6 text-center text-3xl font-bold text-yellow-600`}
					>
						Our Initiatives
					</h1>

					<div className="mb-8 text-lg text-center text-neutral-300">
						<p>
							Discover our impactful initiatives that drive innovation and progress in esports
							research. From pioneering educational programs to groundbreaking research facilities,
							explore how we{"'"}re shaping the future of esports and digital communities.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{initiatives.map((initiative) => (
							<Link
								key={initiative._id}
								href={`/initiatives/${initiative.slug}`}
								className="overflow-hidden rounded-lg border transition-all group border-neutral-700 bg-neutral-800/50 hover:border-yellow-600"
							>
								<div className="overflow-hidden relative w-full h-48">
									<Image
										src={
											initiative.image ||
											"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
										}
										alt={initiative.title}
										fill
										className="object-cover transition-transform group-hover:scale-105"
									/>
								</div>
								<div className="p-4">
									<h2 className="mb-2 text-xl font-medium text-neutral-200 group-hover:text-yellow-600">
										{initiative.title}
									</h2>
									<p className="text-sm line-clamp-2 text-neutral-400">{initiative.description}</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		);
	}

	// If slug is provided, render the detail view
	const [initiative, setInitiative] = useState(null);
	const [loading, setLoading] = useState(slug ? true : false);

	useEffect(() => {
		async function fetchInitiative() {
			try {
				const response = await fetch(`/api/initiatives/${slug}`);
				if (!response.ok) throw new Error("Initiative not found");
				const data = await response.json();
				setInitiative(data);
			} catch (error) {
				console.error("Error fetching initiative:", error);
			} finally {
				setLoading(false);
			}
		}

		if (slug) {
			fetchInitiative();
		}
	}, [slug]);

	if (loading) {
		return <div className="text-center text-neutral-300">Loading...</div>;
	}

	if (!initiative && slug) {
		return <div className="text-center text-neutral-300">Initiative not found</div>;
	}

	return (
		<div className="container px-4 py-8 mx-auto">
			<div className="mx-auto max-w-4xl">
				<h1 className={`${oxanium.className} mb-6 text-center text-3xl font-bold text-yellow-600`}>
					{initiative.title}
				</h1>

				<div className="overflow-hidden relative mb-8 w-full h-64 rounded-lg">
					<Image
						src={
							initiative.image ||
							"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
						}
						alt={initiative.title}
						fill
						className="object-cover"
					/>
				</div>

				<div className="max-w-none prose prose-invert">
					<div className="text-lg leading-relaxed whitespace-pre-wrap text-neutral-300">
						{initiative.description}
					</div>

					{initiative.website && (
						<div className="mt-8">
							<a
								href={initiative.website}
								target="_blank"
								rel="noopener noreferrer"
								className="text-yellow-600 underline hover:text-yellow-500"
							>
								Visit Initiative Website
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
