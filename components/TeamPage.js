"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { oxanium } from "../utils/fonts";
import { useSearchParams } from "next/navigation";

export default function TeamPage({ team }) {
	return (
		<div className="mx-auto flex max-w-4xl flex-col space-y-8 p-4">
			<span
				className={`${oxanium.className} text-2xl font-bold uppercase tracking-wide text-yellow-600`}
			>
				Our Team
			</span>

			<div className="space-y-2 text-neutral-300">
				<p>Meet our dedicated team members who are the driving force behind our projects.</p>
			</div>

			<Carousel members={team} />
		</div>
	);
}

function Carousel({ members }) {
	const searchParams = useSearchParams();
	const memberParam = searchParams.get("member");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (memberParam !== null) {
			const index = parseInt(memberParam);
			if (!isNaN(index) && index >= 0 && index < members.length) {
				setCurrentIndex(index);
			}
		}
	}, [memberParam, members.length]);

	const handlePrev = () => {
		setCurrentIndex((prevIndex) => (prevIndex === 0 ? members.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex === members.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<div className="relative w-full overflow-hidden">
			<div
				className="flex transition-transform duration-500"
				style={{ transform: `translateX(-${currentIndex * 100}%)` }}
			>
				{members.map((member) => (
					<div key={member._id} className="min-w-full rounded-lg bg-neutral-800 p-4">
						<div className="mx-auto flex max-w-4xl items-center space-x-4 break-words">
							<div className="flex max-w-md flex-col space-y-4">
								<h3 className="mb-2 text-lg font-semibold text-yellow-400">{member.name}</h3>
								<p className="text-neutral-300">{member.role}</p>
								<p className="text-sm text-neutral-300">{member.description}</p>
							</div>
							<Image
								src={
									member.image ||
									"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
								}
								alt={member.name}
								width={320}
								height={320}
								className="rounded-full"
							/>
						</div>
					</div>
				))}
			</div>
			<button
				onClick={handlePrev}
				className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full bg-neutral-700 p-2 text-yellow-500 hover:bg-neutral-600"
			>
				<FaAngleLeft />
			</button>
			<button
				onClick={handleNext}
				className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-neutral-700 p-2 text-yellow-500 hover:bg-neutral-600"
			>
				<FaAngleRight />
			</button>
		</div>
	);
}
