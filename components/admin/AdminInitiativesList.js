"use client";

import { useState } from "react";
import { useInitiatives } from "../../hooks/useInitiatives";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

export default function AdminInitiativesList() {
	const { initiatives, createInitiative, updateInitiative, deleteInitiative } = useInitiatives();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [initiativeToDelete, setInitiativeToDelete] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		image: "",
		goals: "",
		startDate: "",
		endDate: "",
		status: "Active",
	});
	const [filters, setFilters] = useState({
		search: "",
		category: "",
	});

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

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">Category</label>
								<select
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									required
								>
									<option value="">Select Category</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">Status</label>
								<select
									value={formData.status}
									onChange={(e) => setFormData({ ...formData, status: e.target.value })}
									className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									required
								>
									{statuses.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Image URL</label>
							<Input
								type="url"
								value={formData.image}
								onChange={(e) => setFormData({ ...formData, image: e.target.value })}
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Goals</label>
							<Textarea
								value={formData.goals}
								onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
								required
								placeholder="Enter goals, one per line"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">Start Date</label>
								<Input
									type="date"
									value={formData.startDate}
									onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
									required
								/>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">End Date</label>
								<Input
									type="date"
									value={formData.endDate}
									onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								/>
							</div>
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
					<h2 className="text-lg font-bold text-neutral-300">Initiatives</h2>
					<div className="mt-4 space-y-4">
						<Input
							type="text"
							placeholder="Search initiatives..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>

						<div className="flex gap-4">
							<div className="flex-1">
								<label className="mb-1.5 block text-xs font-medium text-neutral-400">Category</label>
								<select
									value={filters.category || ""}
									onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
									className="w-full rounded border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-sm text-neutral-200 outline-none transition-colors focus:border-yellow-600"
								>
									<option value="">All Categories</option>
									{categories.map((category) => (
										<option key={category} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Initiatives Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid h-fit gap-2 pb-16">
						{filteredInitiatives?.map((initiative) => (
							<Card key={initiative._id} className="p-4">
								<div className="flex gap-4">
									{initiative.image && (
										<img
											src={initiative.image}
											alt={initiative.title}
											className="h-24 w-24 rounded object-contain"
										/>
									)}
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
													{initiative.title}
												</h3>
												<p className="text-sm text-neutral-400">
													{initiative.category} • {initiative.status}
												</p>
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEdit(initiative)}
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => {
														setInitiativeToDelete(initiative);
														setIsDeleteModalOpen(true);
													}}
												>
													Delete
												</Button>
											</div>
										</div>
										<p className="mt-2 text-sm text-neutral-300">{initiative.description}</p>
										{initiative.tags?.length > 0 && (
											<div className="mt-1 flex flex-wrap gap-1.5">
												{initiative.tags.map((tag, index) => (
													<span
														key={index}
														className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300"
													>
														{tag}
													</span>
												))}
											</div>
										)}
										<div className="mt-2 grid gap-1 text-sm text-neutral-400">
											<p>
												Started: {new Date(initiative.startDate).toLocaleDateString()}
												{initiative.endDate && (
													<span>
														{" "}
														• Ends: {new Date(initiative.endDate).toLocaleDateString()}
													</span>
												)}
											</p>
										</div>
									</div>
								</div>
							</Card>
						))}
						{filteredInitiatives?.length === 0 && (
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
