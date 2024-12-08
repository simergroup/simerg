"use client";

import { useState } from "react";
import { useInitiatives } from "../../hooks/useInitiatives";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminInitiativesList() {
	const { initiatives, createInitiative, updateInitiative, deleteInitiative } = useInitiatives();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [initiativeToDelete, setInitiativeToDelete] = useState(null);
	const [newKeyword, setNewKeyword] = useState("");
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		image: "",
		goals: "",
		startDate: "",
		endDate: "",
		status: "Active",
		website: "", // Add website field
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
			if (editingId) {
				await updateInitiative(editingId, formData);
				toast.success("Initiative updated successfully!");
				setEditingId(null);
			} else {
				await createInitiative(formData);
				toast.success("Initiative created successfully!");
			}
			setFormData({
				title: "",
				description: "",
				category: "",
				image: "",
				goals: "",
				startDate: "",
				endDate: "",
				status: "Active",
				website: "", // Add website field
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
			category: initiative.category,
			image: initiative.image || "",
			goals: initiative.goals,
			startDate: initiative.startDate
				? new Date(initiative.startDate).toISOString().split("T")[0]
				: "",
			endDate: initiative.endDate ? new Date(initiative.endDate).toISOString().split("T")[0] : "",
			status: initiative.status,
			website: initiative.website || "", // Add website field
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

	return (
		<div className="grid h-full grid-cols-2 gap-6">
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
					<div className="flex items-center justify-between">
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
										category: "",
										image: "",
										goals: "",
										startDate: "",
										endDate: "",
										status: "Active",
										website: "", // Add website field
									});
								}}
								className="rounded bg-neutral-700/50 px-2 py-1 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
							>
								Cancel Edit
							</button>
						)}
					</div>

					<div className="space-y-4">
						{/* Form fields */}
						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Title</label>
							<Input
								type="text"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								required
								placeholder="Enter initiative title"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Description</label>
							<Textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								placeholder="Enter initiative description"
								required
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Image URL</label>
							<Input
								type="text"
								value={formData.image}
								onChange={(e) => setFormData({ ...formData, image: e.target.value })}
								placeholder="Enter initiative image"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Website URL</label>
							<Input
								type="url"
								value={formData.website}
								onChange={(e) => setFormData({ ...formData, website: e.target.value })}
								placeholder="Enter initiative website URL"
							/>
						</div>

						<button
							type="submit"
							className="w-full rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update Initiative" : "Create Initiative"}
						</button>
					</div>
				</form>
			</div>

			{/* Initiatives List */}
			<div className="flex h-full flex-col overflow-hidden">
				{/* Fixed Header */}
				<div>
					{/* Search */}
					<div>
						<input
							type="text"
							placeholder="Search initiatives..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>

				{/* Initiatives Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid h-fit gap-2 pb-16">
						{filteredInitiatives.map((initiative) => (
							<div
								key={initiative._id}
								className="group relative flex cursor-pointer items-start justify-between rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 transition-all hover:border-yellow-600 hover:bg-neutral-800"
							>
								<div 
									className="min-w-0 flex-1"
									onClick={() => router.push(`/initiatives/${initiative.slug}`)}
								>
									<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
										{initiative.title}
									</h3>
								</div>

								<div className="absolute right-3 top-2 flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(initiative);
										}}
										className="rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setInitiativeToDelete(initiative);
											setIsDeleteModalOpen(true);
										}}
										className="rounded bg-red-900/30 px-1.5 py-0.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/50"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{filteredInitiatives.length === 0 && (
							<div className="rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-center text-sm text-neutral-400">
								No initiatives found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
