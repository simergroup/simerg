"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function Carousel({ items, paramName, renderItem }) {
	const searchParams = useSearchParams();
	const itemParam = searchParams.get(paramName);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (itemParam !== null) {
			const index = parseInt(itemParam);
			if (!isNaN(index) && index >= 0 && index < items.length) {
				setCurrentIndex(index);
			}
		}
	}, [itemParam, items.length]);

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<div className="overflow-hidden relative w-full">
			<div
				className="flex transition-transform duration-500"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{items.map((item, index) => (
					<div key={item._id} className="p-4 min-w-full rounded-lg bg-neutral-800">
						{renderItem(item)}
					</div>
				))}
			</div>
			<button
				onClick={handlePrev}
				className="absolute left-0 top-1/2 p-2 text-yellow-500 rounded-full transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600"
			>
				<FaAngleLeft />
			</button>
			<button
				onClick={handleNext}
				className="absolute right-0 top-1/2 p-2 text-yellow-500 rounded-full transform -translate-y-1/2 bg-neutral-700 hover:bg-neutral-600"
			>
				<FaAngleRight />
			</button>
		</div>
	);
}
