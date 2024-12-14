"use client";

import { useState } from "react";
import { useInitiatives } from "../../hooks/useInitiatives";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";

export default function AdminInitiativesList() {
	const { initiatives, createInitiative, updateInitiative, deleteInitiative } = useInitiatives();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [initiativeToDelete, setInitiativeToDelete] = useState(null);
	const [newKeyword, setNewKeyword] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		image: "",
		website: "",
	});
	const [filters, setFilters] = useState({
		search: "",
		category: "",
	});
	const router = useRouter();

	const categories = ["Research", "Education", "Community", "Other"];
	const statuses = ["Active", "Completed", "On Hold", "Planned"];

	const filteredInitiatives = initiatives?.filter((initiative) => {
		const matchesSearch =
			!filters.search ||
			initiative.title.toLowerCase().includes(filters.search.toLowerCase()) ||
			initiative.description.toLowerCase().includes(filters.search.toLowerCase());

		const matchesCategory = !filters.category || initiative.category === filters.category;

		return matchesSearch && matchesCategory;
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const formDataToSend = new FormData();
			for (const [key, value] of Object.entries(formData)) {
				formDataToSend.append(key, value);
			}

			if (editingId) {
				await updateInitiative(editingId, formDataToSend);
				toast.success("Initiative updated successfully!");
				setEditingId(null);
			} else {
				await createInitiative(formDataToSend);
				toast.success("Initiative created successfully!");
			}
			setFormData({
				title: "",
				description: "",
				image: "",
				website: "",
			});
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleEdit = (initiative) => {
		setEditingId(initiative._id);
		setFormData({
			title: initiative.title,
			description: initiative.description,
			image: initiative.image || "",
			website: initiative.website || "",
		});
	};

	const handleDelete = async (id) => {
		try {
			await deleteInitiative(id);
			toast.success("Initiative deleted successfully!");
			setIsDeleteModalOpen(false);
			setInitiativeToDelete(null);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleCardClick = (id) => {
		router.push(`/initiatives/${id}`);
	};

	return (
		<div className="grid grid-cols-2 gap-6 h-full">
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setInitiativeToDelete(null);
				}}
				onConfirm={() => handleDelete(initiativeToDelete?._id)}
				title="Delete Initiative"
				message={`Are you sure you want to delete "${initiativeToDelete?.title}"? This action cannot be undone.`}
			/>

			{/* Initiative Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-bold text-neutral-300">
							{editingId ? "Edit Initiative" : "Add New Initiative"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setFormData({
										title: "",
										description: "",
										image: "",
										website: "",
									});
								}}
								className="px-2 py-1 text-sm font-medium rounded transition-colors bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600"
							>
								Cancel Edit
							</button>
						)}
					</div>

					<div className="space-y-4">
						{/* Form fields */}
						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Title</label>
							<Input
								type="text"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								required
								placeholder="Enter initiative title"
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Description</label>
							<Textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Enter initiative description"
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Image</label>
							<FileUpload
								acceptedTypes=".jpg,.jpeg,.png"
								onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Website URL</label>
							<Input
								type="url"
								value={formData.website}
								onChange={(e) => setFormData({ ...formData, website: e.target.value })}
								placeholder="Enter initiative website URL"
							/>
						</div>

						<button
							type="submit"
							className="px-4 py-2 w-full text-sm font-medium text-white bg-yellow-600 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update Initiative" : "Create Initiative"}
						</button>
					</div>
				</form>
			</div>

			{/* Initiatives List */}
			<div className="flex overflow-hidden flex-col h-full">
				{/* Fixed Header */}
				<div>
					{/* Search */}
					<div>
						<input
							type="text"
							placeholder="Search initiatives..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>

				{/* Initiatives Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid gap-2 pb-16 h-fit">
						{filteredInitiatives.map((initiative) => (
							<div
								key={initiative._id}
								onClick={() => router.push(`/initiatives/${initiative.slug}`)}
								className="flex relative justify-between items-center p-3 rounded-lg border transition-all cursor-pointer group border-neutral-700 bg-neutral-800/50 hover:border-yellow-600 hover:bg-neutral-800"
							>
								<div className="flex gap-4 items-center">
									<div className="overflow-hidden relative w-16 h-16 rounded-lg bg-neutral-900/50">
										<Image
											src={
												initiative.image ||
												"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
											}
											alt={initiative.title}
											width={64}
											height={64}
											className="object-contain w-full h-full"
										/>
									</div>
									<div>
										<h3 className="font-medium text-neutral-200 group-hover:text-yellow-600">
											{initiative.title}
										</h3>
									</div>
								</div>
								<div className="flex items-center space-x-1.5 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setEditingId(initiative._id);
											setFormData(initiative);
										}}
										className="px-2 py-1 text-sm text-yellow-600 rounded hover:bg-neutral-700"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setInitiativeToDelete(initiative);
											setIsDeleteModalOpen(true);
										}}
										className="px-2 py-1 text-sm text-red-500 rounded hover:bg-neutral-700"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{filteredInitiatives.length === 0 && (
							<div className="px-3 py-2 text-sm text-center rounded-md border border-neutral-700 bg-neutral-800/50 text-neutral-400">
								No initiatives found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
