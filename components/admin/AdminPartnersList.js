"use client";

import { useState } from "react";
import { usePartners } from "../../hooks/usePartners";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

export default function AdminPartnersList() {
	const { partners, createPartner, updatePartner, deletePartner } = usePartners();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [partnerToDelete, setPartnerToDelete] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		logo: "",
		website: "",
		partnershipType: "",
		contactPerson: {
			name: "",
			email: "",
			phone: "",
		},
		startDate: "",
		endDate: "",
		status: "Active",
	});
	const [filters, setFilters] = useState({
		search: "",
		type: "",
	});

	const partnerTypes = ["Academic", "Industry", "Research", "Funding", "Other"];
	const statuses = ["Active", "Inactive", "Pending"];

	const filteredPartners = partners?.filter((partner) => {
		const matchesSearch =
			!filters.search ||
			partner.name.toLowerCase().includes(filters.search.toLowerCase()) ||
			partner.description.toLowerCase().includes(filters.search.toLowerCase());

		const matchesType = !filters.type || partner.partnershipType === filters.type;

		return matchesSearch && matchesType;
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				await updatePartner(editingId, formData);
				toast.success("Partner updated successfully!");
				setEditingId(null);
			} else {
				await createPartner(formData);
				toast.success("Partner created successfully!");
			}
			setFormData({
				name: "",
				description: "",
				logo: "",
				website: "",
				partnershipType: "",
				contactPerson: {
					name: "",
					email: "",
					phone: "",
				},
				startDate: "",
				endDate: "",
				status: "Active",
			});
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleEdit = (partner) => {
		setEditingId(partner._id);
		setFormData({
			name: partner.name,
			description: partner.description,
			logo: partner.logo || "",
			website: partner.website,
			partnershipType: partner.partnershipType,
			contactPerson: {
				name: partner.contactPerson?.name || "",
				email: partner.contactPerson?.email || "",
				phone: partner.contactPerson?.phone || "",
			},
			startDate: partner.startDate ? new Date(partner.startDate).toISOString().split("T")[0] : "",
			endDate: partner.endDate ? new Date(partner.endDate).toISOString().split("T")[0] : "",
			status: partner.status,
		});
	};

	const handleDelete = async (id) => {
		try {
			await deletePartner(id);
			toast.success("Partner deleted successfully!");
			setIsDeleteModalOpen(false);
			setPartnerToDelete(null);
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	return (
		<div className="grid grid-cols-2 gap-6 h-full">
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setPartnerToDelete(null);
				}}
				onConfirm={() => handleDelete(partnerToDelete?._id)}
				title="Delete Partner"
				message={`Are you sure you want to delete "${partnerToDelete?.name}"? This action cannot be undone.`}
			/>

			{/* Partner Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex justify-between items-center">
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
										website: "",
										partnershipType: "",
										contactPerson: {
											name: "",
											email: "",
											phone: "",
										},
										startDate: "",
										endDate: "",
										status: "Active",
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
							<label className="block mb-1 text-sm font-medium text-neutral-300">Name</label>
							<Input
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Description</label>
							<Textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-sm font-medium text-neutral-300">
									Partnership Type
								</label>
								<select
									value={formData.partnershipType}
									onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
									className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									required
								>
									<option value="">Select Type</option>
									{partnerTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block mb-1 text-sm font-medium text-neutral-300">Status</label>
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
							<label className="block mb-1 text-sm font-medium text-neutral-300">Logo URL</label>
							<Input
								type="url"
								value={formData.logo}
								onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Website</label>
							<Input
								type="url"
								value={formData.website}
								onChange={(e) => setFormData({ ...formData, website: e.target.value })}
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Contact Person Name
							</label>
							<Input
								type="text"
								value={formData.contactPerson.name}
								onChange={(e) =>
									setFormData({
										...formData,
										contactPerson: { ...formData.contactPerson, name: e.target.value },
									})
								}
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Contact Person Email
							</label>
							<Input
								type="email"
								value={formData.contactPerson.email}
								onChange={(e) =>
									setFormData({
										...formData,
										contactPerson: { ...formData.contactPerson, email: e.target.value },
									})
								}
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Contact Person Phone
							</label>
							<Input
								type="tel"
								value={formData.contactPerson.phone}
								onChange={(e) =>
									setFormData({
										...formData,
										contactPerson: { ...formData.contactPerson, phone: e.target.value },
									})
								}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-sm font-medium text-neutral-300">Start Date</label>
								<Input
									type="date"
									value={formData.startDate}
									onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
									required
								/>
							</div>

							<div>
								<label className="block mb-1 text-sm font-medium text-neutral-300">End Date</label>
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
							{editingId ? "Update Partner" : "Create Partner"}
						</button>
					</div>
				</form>
			</div>

			{/* Partners List */}
			<div className="flex overflow-hidden flex-col h-full">
				{/* Fixed Header */}
				<div>
					<h2 className="text-xl font-bold text-neutral-300">Partners</h2>
					<div className="mt-4 space-y-4">
						<Input
							type="text"
							placeholder="Search partners..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>

						<div className="flex gap-4">
							<div className="flex-1">
								<label className="block mb-1.5 text-xs font-medium text-neutral-400">Type</label>
								<select
									value={filters.type || ""}
									onChange={(e) => setFilters({ ...filters, type: e.target.value || null })}
									className="w-full rounded border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-sm text-neutral-200 outline-none transition-colors focus:border-yellow-600"
								>
									<option value="">All Types</option>
									{partnerTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Partners Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid gap-2 pb-16 h-fit">
						{filteredPartners?.map((partner) => (
							<Card key={partner._id} className="p-4">
								<div className="flex gap-4">
									{partner.logo && (
										<img
											src={partner.logo}
											alt={partner.name}
											className="h-24 w-24 rounded object-contain"
										/>
									)}
									<div className="flex-1">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
													{partner.name}
												</h3>
												<div className="mt-1 flex flex-wrap gap-1.5">
													<span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
														{partner.partnershipType}
													</span>
													<span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
														{partner.status}
													</span>
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEdit(partner)}
												>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => {
														setPartnerToDelete(partner);
														setIsDeleteModalOpen(true);
													}}
												>
													Delete
												</Button>
											</div>
										</div>
										<p className="mt-2 text-sm text-neutral-300">{partner.description}</p>
										<div className="mt-2 grid gap-1 text-sm text-neutral-400">
											<p>
												Contact: {partner.contactPerson?.name} ({partner.contactPerson?.email})
												{partner.contactPerson?.phone && ` • ${partner.contactPerson.phone}`}
											</p>
											<p>
												<a
													href={partner.website}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													Visit Website
												</a>
											</p>
											<p>
												Started: {new Date(partner.startDate).toLocaleDateString()}
												{partner.endDate && (
													<span>
														{" "}
														• Ends: {new Date(partner.endDate).toLocaleDateString()}
													</span>
												)}
											</p>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
