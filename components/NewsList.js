"use client";

import { useState } from "react";
import Link from "next/link";
import Pagination from "./Pagination";

export default function NewsList({ news = [] }) {
	const [currentPage, setCurrentPage] = useState(1);
	const newsPerPage = 6;

	const sortedNews = [...news].sort(
		(a, b) => new Date(b.publishDate) - new Date(a.publishDate)
	);

	const indexOfLastNews = currentPage * newsPerPage;
	const indexOfFirstNews = indexOfLastNews - newsPerPage;
	const currentNews = sortedNews.slice(indexOfFirstNews, indexOfLastNews);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-3">
				{currentNews.map((item) => (
					<Link
						key={item._id}
						href={`/news/${item.slug}`}
						className="flex aspect-square flex-col overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-neutral-800"
					>
						<div className="flex h-full flex-col p-6">
							<h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
								{item.title}
							</h2>
							<p className="mb-4 line-clamp-3 flex-grow text-sm text-neutral-600 dark:text-neutral-300">
								{item.content}
							</p>
							<div className="mt-auto">
								<span className="mb-2 block text-sm text-neutral-500 dark:text-neutral-400">
									{new Date(item.publishDate).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
								<span className="text-sm font-semibold text-yellow-600">Read more →</span>
							</div>
						</div>
					</Link>
				))}
			</div>
			<Pagination
				newsPerPage={newsPerPage}
				totalNews={sortedNews.length}
				paginate={paginate}
				currentPage={currentPage}
			/>
		</>
	);
}
