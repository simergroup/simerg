"use client";

import Image from "next/image";

export default function ImagePreview({ src, onRemove, className = "" }) {
	if (!src) return null;

	return (
		<div className={`mt-2 ${className}`}>
			<div className="overflow-hidden relative w-32 h-24 rounded group">
				<Image src={src} alt="Preview" fill className="object-cover" />
				{onRemove && (
					<button
						onClick={onRemove}
						className="absolute top-1 right-1 p-1 text-white rounded-full transition-colors bg-black/50 hover:bg-black/70"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="w-4 h-4"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				)}
			</div>
		</div>
	);
}
