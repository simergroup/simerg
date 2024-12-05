"use client";

import { useState } from "react";
import Link from "next/link";
import { NEWS } from "../utils/data";
import Pagination from "./Pagination";

export default function NewsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  const sortedNews = [...NEWS].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
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
            key={item.id}
            href={`/news/${item.slug}`}
            className="flex flex-col overflow-hidden transition-transform duration-300 bg-white rounded-lg shadow-md dark:bg-neutral-800 hover:scale-105 hover:shadow-lg aspect-square"
          >
            <div className="flex flex-col h-full p-6">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {item.title}
              </h2>
              <p className="flex-grow mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 md:hidden">
                {typeof item.content === "string"
                  ? item.content
                  : item.content.paragraph1}
              </p>
              <div className="mt-auto">
                <span className="block mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm font-semibold text-yellow-600">
                  Read more →
                </span>
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
