"use client";

import { useState } from "react";
import { usePartners } from "../../hooks/usePartners";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Image from "next/image";
import Link from "next/link";

export default function AdminPartnersList() {
	const { partners, createPartner, updatePartner, deletePartner } = usePartners();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [partnerToDelete, setPartnerToDelete] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		logo: "",
	});
	const [filters, setFilters] = useState({
		search: "",
	});

	const filteredPartners = partners?.filter((partner) => {
		const matchesSearch =
			!filters.search ||
			partner.name.toLowerCase().includes(filters.search.toLowerCase()) ||
			partner.description.toLowerCase().includes(filters.search.toLowerCase());

		return matchesSearch;
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				await updatePartner(editingId, formData);
				toast.success("Partner updated successfully");
				setEditingId(null);
			} else {
				await createPartner(formData);
				toast.success("Partner created successfully");
			}
			setFormData({
				name: "",
				description: "",
				logo: "",
			});
		} catch (error) {
			console.error("Error handling partner:", error);
			toast.error("Failed to handle partner");
		}
	};

	const handleEdit = (partner) => {
		setEditingId(partner._id);
		setFormData({
			name: partner.name,
			description: partner.description,
			logo: partner.logo || "",
		});
	};

	const handleDelete = async (partner) => {
		try {
			const response = await fetch(`/api/partners/${partner._id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete partner");
			}

			deletePartner(partner._id);
			toast.success("Partner deleted successfully");
			setIsDeleteModalOpen(false);
			setPartnerToDelete(null);
		} catch (error) {
			console.error("Error deleting partner:", error);
			toast.error("Failed to delete partner");
		}
	};

	return (
		<div className="grid h-full grid-cols-2 gap-6">
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setPartnerToDelete(null);
				}}
				onConfirm={() => handleDelete(partnerToDelete)}
				title="Delete Partner"
				message={`Are you sure you want to delete "${partnerToDelete?.name}"? This action cannot be undone.`}
			/>

			{/* Partner Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-neutral-300">
							{editingId ? "Edit Partner" : "Add New Partner"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setFormData({
										name: "",
										description: "",
										logo: "",
									});
								}}
								className="rounded bg-neutral-700/50 px-2 py-1 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
							>
								Cancel Edit
							</button>
						)}
					</div>

					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Name</label>
							<Input
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Description</label>
							<Textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								required
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Logo URL</label>
							<Input
								type="url"
								value={formData.logo}
								onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
							/>
						</div>

						<button
							type="submit"
							className="w-full rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update Partner" : "Create Partner"}
						</button>
					</div>
				</form>
			</div>

			{/* Partners List */}
			<div className="flex h-full flex-col overflow-hidden">
				<div>
					<h2 className="text-xl font-bold text-neutral-300">Partners</h2>

					<div className="mt-4">
						<input
							type="text"
							placeholder="Search partners..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>

				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid h-fit gap-2 pb-16">
						{filteredPartners?.map((partner) => (
							<div
								key={partner._id}
								className="group relative flex cursor-pointer items-start justify-between rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 transition-all hover:border-yellow-600 hover:bg-neutral-800"
								onClick={() => {
									const index = filteredPartners.findIndex((p) => p._id === partner._id);
									window.location.href = `/partners?partner=${index}`;
								}}
							>
								<div className="min-w-0 flex-1">
									<div className="flex items-center gap-4">
										{partner.logo && (
											<Image
												src={partner.logo}
												alt={partner.name}
												width={48}
												height={48}
												className="h-12 w-12 rounded object-contain"
											/>
										)}
										<div>
											<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
												{partner.name}
											</h3>
											<p className="mt-1 text-sm text-neutral-400 line-clamp-2">
												{partner.description}
											</p>
										</div>
									</div>
								</div>

								<div className="absolute right-3 top-2 flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(partner);
										}}
										className="rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setPartnerToDelete(partner);
											setIsDeleteModalOpen(true);
										}}
										className="rounded bg-red-900/30 px-1.5 py-0.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/50"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{!filteredPartners?.length && (
							<div className="rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-center text-sm text-neutral-400">
								No partners found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
