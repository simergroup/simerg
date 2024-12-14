"use client";

import React, { useState, useEffect } from "react";
import { oxanium } from "../utils/fonts";
import Image from "next/image";

export default function NewsCard({ slug }) {
	const [newsItem, setNewsItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [selectedImage, setSelectedImage] = useState(0);

	useEffect(() => {
		const fetchNews = async () => {
			try {
				const res = await fetch(`/api/news/${slug}`);
				if (!res.ok) throw new Error("Failed to fetch news");
				const data = await res.json();
				setNewsItem(data);
			} catch (error) {
				console.error("Error fetching news:", error);
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchNews();
		}
	}, [slug]);

	if (loading) {
		return <div className="text-center text-neutral-300">Loading...</div>;
	}

	if (!newsItem) {
		return <div className="text-center text-neutral-300">News item not found</div>;
	}

	return (
		<div className="mx-auto max-w-3xl p-4">
			<h1
				className={`${oxanium.className} mb-4 text-center text-3xl font-bold uppercase tracking-wide text-yellow-600`}
			>
				{newsItem.title}
			</h1>
			<div className="mb-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
				{new Date(newsItem.publishDate).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</div>

			{newsItem.images && newsItem.images.length > 0 && (
				<div className="mb-8">
					<div className="relative aspect-video w-full overflow-hidden rounded-lg">
						<Image
							src={newsItem.images[selectedImage]}
							alt={`Image ${selectedImage + 1} for ${newsItem.title}`}
							fill
							className="object-contain"
							priority
						/>
					</div>
					{newsItem.images.length > 1 && (
						<div className="mt-4 flex justify-center gap-2">
							{newsItem.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
										selectedImage === index
											? "border-yellow-600"
											: "border-neutral-700 hover:border-yellow-500"
									}`}
								>
									<Image
										src={image}
										alt={`Thumbnail ${index + 1}`}
										fill
										className="object-cover"
									/>
								</button>
							))}
						</div>
					)}
				</div>
			)}

			<div className="prose prose-invert mx-auto max-w-none">
				<div className="whitespace-pre-wrap text-justify text-neutral-300">
					{newsItem.content}
				</div>
			</div>
		</div>
	);
}
