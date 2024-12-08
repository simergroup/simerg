"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useRouter } from "next/navigation";

export default function AdminTeamList() {
	const router = useRouter();
	const [teamMembers, setTeamMembers] = useState([]);
	const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
	const [filters, setFilters] = useState({
		search: "",
		role: "",
	});
	const [formData, setFormData] = useState({
		name: "",
		roles: [],
		description: "",
		image: "",
	});
	const [newRole, setNewRole] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [memberToDelete, setMemberToDelete] = useState(null);

	useEffect(() => {
		fetchTeamMembers();
	}, []);

	useEffect(() => {
		const filtered = teamMembers.filter((member) => {
			const matchesSearch =
				member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				member.roles.some((role) => role.toLowerCase().includes(filters.search.toLowerCase())) ||
				member.description.toLowerCase().includes(filters.search.toLowerCase());

			const matchesRole =
				!filters.role ||
				member.roles.some((role) => role.toLowerCase().includes(filters.role.toLowerCase()));

			return matchesSearch && matchesRole;
		});

		setFilteredTeamMembers(filtered);
	}, [teamMembers, filters]);

	const fetchTeamMembers = async () => {
		try {
			const res = await fetch("/api/team");
			if (!res.ok) throw new Error("Failed to fetch team members");
			const data = await res.json();
			setTeamMembers(data);
			setFilteredTeamMembers(data);
		} catch (error) {
			console.error("Error fetching team members:", error);
			toast.error("Failed to load team members");
		}
	};

	const handleDelete = async (member) => {
		setMemberToDelete(member);
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (!memberToDelete) return;

		setIsLoading(true);
		const loadingToast = toast.loading("Deleting team member...");

		try {
			const response = await fetch(`/api/team/${memberToDelete._id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete team member");
			}

			// Update local state immediately
			setTeamMembers((prev) => prev.filter((m) => m._id !== memberToDelete._id));
			toast.success("Team member deleted successfully", { id: loadingToast });
		} catch (error) {
			console.error("Error deleting team member:", error);
			toast.error("Failed to delete team member", { id: loadingToast });
		} finally {
			setIsLoading(false);
			setDeleteModalOpen(false);
			setMemberToDelete(null);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name?.trim() || formData.roles.length === 0 || !formData.description?.trim()) {
			toast.error("Please fill in all required fields and add at least one role");
			return;
		}

		setIsLoading(true);
		const submitToast = toast.loading(
			editingId ? "Updating team member..." : "Creating team member..."
		);

		try {
			const response = await fetch(editingId ? `/api/team/${editingId}` : "/api/team", {
				method: editingId ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || `Failed to ${editingId ? "update" : "create"} team member`);
			}

			// Reset form and refresh list
			setFormData({
				name: "",
				roles: [],
				description: "",
				image: "",
			});
			setNewRole("");
			setEditingId(null);
			await fetchTeamMembers();

			toast.success(
				editingId ? "Team member updated successfully" : "Team member created successfully",
				{ id: submitToast }
			);
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error(error.message, { id: submitToast });
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (member) => {
		setFormData({
			name: member.name,
			roles: member.roles || [],
			description: member.description,
			image: member.image,
		});
		setEditingId(member._id);
	};

	const handleAddRole = (e) => {
		e.preventDefault();
		if (newRole.trim()) {
			setFormData({
				...formData,
				roles: [...formData.roles, newRole.trim()],
			});
			setNewRole("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddRole(e);
		}
	};

	const removeRole = (index) => {
		setFormData((prev) => ({
			...prev,
			roles: prev.roles.filter((_, i) => i !== index),
		}));
	};

	const handleCardClick = (memberId) => {
		const memberIndex = teamMembers.findIndex((member) => member._id === memberId);
		router.push(`/team?member=${memberIndex}`);
	};

	return (
		<div className="grid h-full grid-cols-2 gap-6">
			<DeleteConfirmationModal
				isOpen={deleteModalOpen}
				onClose={() => {
					setDeleteModalOpen(false);
					setMemberToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Delete Team Member"
				message={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
			/>
			{/* Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<h2 className="mb-4 text-xl font-semibold text-neutral-300">
						{editingId ? "Edit Team Member" : "Add New Team Member"}
					</h2>

					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Name</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								required
								placeholder="Enter member name"
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Roles</label>
							<div className="space-y-2">
								<div className="flex gap-2">
									<input
										type="text"
										value={newRole}
										onChange={(e) => setNewRole(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (newRole.trim()) {
													setFormData((prev) => ({
														...prev,
														roles: [...new Set([...prev.roles, newRole.trim()])],
													}));
													setNewRole("");
												}
											}
										}}
										className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="Press Enter to add"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.roles.map((role, index) => (
										<span
											key={index}
											className="inline-flex items-center rounded bg-neutral-700/50 px-2 py-1 text-xs text-neutral-300"
										>
											{role}
											<button
												type="button"
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														roles: prev.roles.filter((_, i) => i !== index),
													}));
												}}
												className="ml-1.5 text-neutral-400 hover:text-neutral-200"
											>
												×
											</button>
										</span>
									))}
								</div>
							</div>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Description</label>
							<input
								type="text"
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								required
								placeholder="Enter member description"
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Image URL</label>
							<input
								type="url"
								value={formData.image}
								onChange={(e) => setFormData({ ...formData, image: e.target.value })}
								placeholder="Enter image URL"
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<button
							type="submit"
							disabled={isLoading}
							className="rounded bg-yellow-600 px-4 py-2 text-neutral-900 hover:bg-yellow-700 disabled:opacity-50"
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
										roles: [],
										description: "",
										image: "",
									});
									setNewRole("");
								}}
								className="rounded bg-neutral-700 px-4 py-2 text-neutral-300 hover:bg-neutral-600"
							>
								Cancel
							</button>
						)}
					</div>
				</form>
			</div>

			{/* Team Members List */}
			<div className="overflow-y-auto pr-3">
				<div className="mb-4 space-y-3">
					<h2 className="text-xl font-bold text-neutral-300">Team Members</h2>
					<div className="w-full">
						<input
							type="text"
							placeholder="Search team members..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>
				<div className="grid gap-3">
					{filteredTeamMembers.map((member) => (
						<div
							key={member._id}
							onClick={() => handleCardClick(member._id)}
							className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800/50 p-3 transition-all hover:border-yellow-600 hover:bg-neutral-800"
						>
							<div className="flex items-center gap-4">
								<div className="relative h-12 w-12 overflow-hidden rounded-full">
									<Image
										src={
											member.image ||
											"https://pro-bel.com/wp-content/uploads/2019/11/blank-avatar-1-450x450.png"
										}
										alt={member.name}
										width={48}
										height={48}
										className="h-full w-full object-cover transition-transform group-hover:scale-110"
									/>
								</div>
								<div>
									<h3 className="font-medium text-neutral-200 group-hover:text-yellow-600">
										{member.name}
									</h3>
									<div className="mt-1 flex flex-wrap gap-1.5">
										{member.roles.map((role, roleIndex) => (
											<span
												key={roleIndex}
												className="rounded bg-neutral-700/30 px-1.5 py-0.5 text-xs text-neutral-400"
											>
												{role}
											</span>
										))}
									</div>
								</div>
							</div>
							<div className="flex items-center space-x-1.5 opacity-0 transition-opacity group-hover:opacity-100">
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleEdit(member);
									}}
									className="rounded bg-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-600"
								>
									Edit
								</button>
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(member);
									}}
									className="rounded bg-red-900/50 px-2 py-1 text-xs text-red-300 hover:bg-red-900"
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
