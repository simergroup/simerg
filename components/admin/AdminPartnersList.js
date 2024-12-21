"use client";

import { useState, useEffect, useRef } from "react";
import { usePartners } from "../../hooks/usePartners";
import { Button } from "../ui/Button";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Image from "next/image";
import Link from "next/link";
import FileUpload from "../ui/FileUpload";
import ImagePreview from "../ui/ImagePreview"; // Import ImagePreview component
import { useRouter } from "next/navigation";

export default function AdminPartnersList() {
	const router = useRouter();
	const { partners, loading, error, createPartner, updatePartner, deletePartner, refreshPartners } =
		usePartners();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [partnerToDelete, setPartnerToDelete] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		image: null,
		website: "",
	});
	const [filters, setFilters] = useState({
		search: "",
	});
	const fileUploadRef = useRef(null); // Create a ref for FileUpload

	const filteredPartners = partners?.filter((partner) => {
		const matchesSearch =
			!filters.search ||
			partner.name.toLowerCase().includes(filters.search.toLowerCase()) ||
			partner.description.toLowerCase().includes(filters.search.toLowerCase());

		return matchesSearch;
	});

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name?.trim() || !formData.description?.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		const submitToast = toast.loading(editingId ? "Updating partner..." : "Creating partner...");

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("name", formData.name);
			formDataToSend.append("description", formData.description);
			if (formData.image) {
				formDataToSend.append("image", formData.image);
			}
			if (formData.website) {
				formDataToSend.append("website", formData.website);
			}

			if (editingId) {
				await updatePartner(editingId, formDataToSend);
				toast.success("Partner updated successfully", { id: submitToast });
				setEditingId(null);
			} else {
				await createPartner(formDataToSend);
				toast.success("Partner created successfully", { id: submitToast });
			}
			setFormData({
				name: "",
				description: "",
				image: null,
				website: "",
			});
		} catch (error) {
			console.error("Error handling partner:", error);
			toast.error(error.message || "Failed to handle partner", { id: submitToast });
		}
	};

	const handleEdit = (partner) => {
		setEditingId(partner._id);
		setFormData({
			name: partner.name,
			description: partner.description,
			image: partner.image || null,
			website: partner.website || "",
		});
	};

	const confirmDelete = async () => {
		if (!partnerToDelete) return;

		const loadingToast = toast.loading("Deleting partner...");

		try {
			await deletePartner(partnerToDelete._id);
			toast.success("Partner deleted successfully", { id: loadingToast });
		} catch (error) {
			console.error("Error deleting partner:", error);
			toast.error("Failed to delete partner", { id: loadingToast });
		} finally {
			setIsDeleteModalOpen(false);
			setPartnerToDelete(null);
		}
	};

	const handleFileSelect = (filePath) => {
		setFormData((prev) => ({ ...prev, image: filePath }));
	};

	const handleCardClick = (partnerId) => {
		const partnerIndex = partners.findIndex((partner) => partner._id === partnerId);
		router.push(`/partners?partner=${partnerIndex}`);
	};

	return (
		<div className="grid grid-cols-2 gap-6 h-full">
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setPartnerToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Delete Partner"
				message={`Are you sure you want to delete ${partnerToDelete?.name}? This action cannot be undone.`}
			/>

			{/* Partner Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<h2 className="mb-4 text-xl font-semibold text-neutral-300">
						{editingId ? "Edit Partner" : "Add New Partner"}
					</h2>

					<div className="space-y-4">
						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Name</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
								placeholder="Enter partner name"
								className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Description</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								required
								placeholder="Enter partner description"
								className="min-h-[100px] w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Image</label>
							<FileUpload
								ref={fileUploadRef}
								acceptedTypes=".jpg,.jpeg,.png"
								maxSizeMB={5}
								onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
								onReset={() => setFormData({ ...formData, image: "" })}
							/>
							<ImagePreview
								src={formData.image}
								onRemove={() => {
									setFormData({ ...formData, image: "" });
									fileUploadRef.current?.clearInput();
								}}
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">Website</label>
							<input
								type="url"
								value={formData.website || ""}
								onChange={(e) => setFormData({ ...formData, website: e.target.value })}
								placeholder="https://example.com"
								className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>
					</div>

					<div className="flex gap-2 mt-6">
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700 disabled:opacity-50"
						>
							{editingId ? "Update" : "Create"}
						</button>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setFormData({
										name: "",
										description: "",
										image: null,
										website: "",
									});
								}}
								className="px-4 py-2 rounded bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			</div>

			{/* Partners List */}
			<div className="overflow-y-auto pr-3">
				<div className="mb-4 space-y-3">
					<h2 className="text-xl font-bold text-neutral-300">Partners</h2>
					<div className="w-full">
						<input
							type="text"
							placeholder="Search partners..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>

				{error && (
					<div className="p-4 mb-4 text-red-300 rounded bg-red-900/50">
						Error loading partners: {error}
					</div>
				)}

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="w-16 h-16 rounded-full border-4 border-yellow-600 animate-spin border-t-transparent"></div>
					</div>
				) : (
					<div className="grid gap-3">
						{filteredPartners?.map((partner) => (
							<div
								key={partner._id}
								onClick={() => handleCardClick(partner._id)}
								className="flex relative justify-between items-center p-3 rounded-lg border transition-all cursor-pointer group border-neutral-700 bg-neutral-800/50 hover:border-yellow-600 hover:bg-neutral-800"
							>
								<div className="flex gap-4 items-center">
									<div className="overflow-hidden relative w-16 h-16 rounded-lg bg-neutral-900/50">
										<Image
											src={
												partner.image ||
												"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
											}
											alt={partner.name}
											width={64}
											height={64}
											className="object-contain w-full h-full"
										/>
									</div>
									<div>
										<h3 className="font-medium text-neutral-200 group-hover:text-yellow-600">
											{partner.name}
										</h3>
									</div>
								</div>
								<div className="flex items-center space-x-1.5 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											setEditingId(partner._id);
											setFormData(partner);
										}}
										className="px-2 py-1 text-sm text-yellow-600 rounded hover:bg-neutral-700"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											setPartnerToDelete(partner);
											setIsDeleteModalOpen(true);
										}}
										className="px-2 py-1 text-sm text-red-500 rounded hover:bg-neutral-700"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
