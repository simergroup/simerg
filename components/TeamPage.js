"use client";

import Image from "next/image";
import { oxanium } from "../utils/fonts";
import Carousel from "./shared/Carousel";

export default function TeamPage({ team }) {
	const renderTeamMember = (member) => (
		<div className="flex items-center mx-auto space-x-4 max-w-4xl break-words">
			<div className="flex flex-col space-y-4 max-w-md">
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
	);

	return (
		<div className="flex flex-col p-4 mx-auto space-y-8 max-w-4xl">
			<span
				className={`${oxanium.className} text-2xl font-bold uppercase tracking-wide text-yellow-600`}
			>
				Our Team
			</span>

			<div className="space-y-2 text-neutral-300">
				<p>Meet our dedicated team members who are the driving force behind our projects.</p>
			</div>

			<Carousel items={team} paramName="member" renderItem={renderTeamMember} />
		</div>
	);
}
