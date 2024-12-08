"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useRouter } from "next/navigation";

// Function to normalize text for slug (same as in model)
function generateSlug(text) {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export default function AdminProjectsList() {
	const [projects, setProjects] = useState([]);
	const [filters, setFilters] = useState({
		search: "",
		category: null,
		year: null,
	});
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "master",
		year: new Date().getFullYear(),
		keywords: [],
		authors: [],
		advisor: "",
	});
	const [newKeyword, setNewKeyword] = useState("");
	const [newAuthor, setNewAuthor] = useState("");
	const [slugPreview, setSlugPreview] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState(null);
	const router = useRouter();

	const filteredProjects = useMemo(() => {
		return projects.filter((project) => {
			// Search filter
			if (
				filters.search &&
				!project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
				!project.authors.some((author) =>
					author.toLowerCase().includes(filters.search.toLowerCase())
				)
			) {
				return false;
			}

			// Category filter
			if (filters.category && project.category !== filters.category) {
				return false;
			}

			// Year filter
			if (filters.year && project.year !== parseInt(filters.year)) {
				return false;
			}

			return true;
		});
	}, [projects, filters]);

	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {
		if (formData.title) {
			setSlugPreview(generateSlug(formData.title));
		} else {
			setSlugPreview("");
		}
	}, [formData.title]);

	// Get unique years from projects
	const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

	const fetchProjects = async () => {
		try {
			const res = await fetch("/api/projects");
			const data = await res.json();
			setProjects(data);
		} catch (error) {
			console.error("Error fetching projects:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.title?.trim()) {
			alert("Please enter a title");
			return;
		}

		if (!formData.description?.trim()) {
			alert("Please enter a description");
			return;
		}

		if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
			alert("Please enter a valid year");
			return;
		}

		if (!Array.isArray(formData.keywords) || formData.keywords.length === 0) {
			alert("Please add at least one keyword");
			return;
		}

		if (!Array.isArray(formData.authors) || formData.authors.length === 0) {
			alert("Please add at least one author");
			return;
		}

		try {
			const processedData = {
				...formData,
				year: parseInt(formData.year),
				keywords: formData.keywords.filter((k) => k.trim()),
				authors: formData.authors.filter((a) => a.trim()),
			};

			const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
				method: editingId ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(processedData),
			});

			const data = await response.json();

			if (!response.ok) {
				console.error("Server response:", {
					status: response.status,
					statusText: response.statusText,
					data,
				});
				alert(`Error: ${data.error || "Failed to save project"}`);
				return;
			}

			// Reset form
			setFormData({
				title: "",
				description: "",
				category: "master",
				year: new Date().getFullYear(),
				keywords: [],
				authors: [],
				advisor: "",
			});
			setNewKeyword("");
			setNewAuthor("");
			setSlugPreview("");
			setEditingId(null);

			// Refresh projects list
			fetchProjects();
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("Failed to submit form. Please try again.");
		}
	};

	const handleEdit = (project) => {
		setFormData({
			title: project.title,
			description: project.description,
			category: project.category,
			year: project.year,
			keywords: project.keywords || [],
			authors: project.authors || [],
			advisor: project.advisor || "",
		});
		setEditingId(project._id);
	};

	const handleDelete = async (project) => {
		setProjectToDelete(project);
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await fetch(`/api/projects/${projectToDelete._id}`, { method: "DELETE" });
			fetchProjects();
			setDeleteModalOpen(false);
			setProjectToDelete(null);
		} catch (error) {
			console.error("Error deleting project:", error);
		}
	};

	const addKeyword = () => {
		if (newKeyword.trim()) {
			setFormData((prev) => ({
				...prev,
				keywords: [...new Set([...prev.keywords, newKeyword.trim()])],
			}));
			setNewKeyword("");
		}
	};

	const removeKeyword = (index) => {
		setFormData({
			...formData,
			keywords: formData.keywords.filter((_, i) => i !== index),
		});
	};

	const addAuthor = () => {
		if (newAuthor.trim()) {
			setFormData((prev) => ({
				...prev,
				authors: [...new Set([...prev.authors, newAuthor.trim()])],
			}));
			setNewAuthor("");
		}
	};

	const removeAuthor = (index) => {
		setFormData({
			...formData,
			authors: formData.authors.filter((_, i) => i !== index),
		});
	};

	return (
		<div className="grid h-full grid-cols-2 gap-6">
			<DeleteConfirmationModal
				isOpen={deleteModalOpen}
				onClose={() => {
					setDeleteModalOpen(false);
					setProjectToDelete(null);
				}}
				onConfirm={confirmDelete}
				title="Delete Project"
				message={`Are you sure you want to delete ${projectToDelete?.title}? This action cannot be undone.`}
			/>

			{/* Project Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-neutral-300">
							{editingId ? "Edit Project" : "Add New Project"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setFormData({
										title: "",
										description: "",
										category: "master",
										year: new Date().getFullYear(),
										keywords: [],
										authors: [],
										advisor: "",
									});
									setNewKeyword("");
									setNewAuthor("");
									setSlugPreview("");
									setEditingId(null);
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
							<input
								type="text"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Description</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								rows={3}
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">Category</label>
								<select
									value={formData.category}
									onChange={(e) => setFormData({ ...formData, category: e.target.value })}
									className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
								>
									<option value="master">Master</option>
									<option value="phd">PhD</option>
									<option value="research">Research</option>
								</select>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-neutral-300">Year</label>
								<input
									type="number"
									value={formData.year}
									onChange={(e) => setFormData({ ...formData, year: e.target.value })}
									className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
								/>
							</div>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Keywords</label>
							<div className="space-y-2">
								<div className="flex gap-2">
									<input
										type="text"
										value={newKeyword}
										onChange={(e) => setNewKeyword(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (newKeyword.trim()) {
													setFormData((prev) => ({
														...prev,
														keywords: [...new Set([...prev.keywords, newKeyword.trim()])],
													}));
													setNewKeyword("");
												}
											}
										}}
										className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="Press Enter to add"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.keywords.map((keyword, index) => (
										<span
											key={index}
											className="inline-flex items-center rounded bg-neutral-700/50 px-2 py-1 text-xs text-neutral-300"
										>
											{keyword}
											<button
												type="button"
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														keywords: prev.keywords.filter((_, i) => i !== index),
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
							<label className="mb-1 block text-sm font-medium text-neutral-300">Authors</label>
							<div className="space-y-2">
								<div className="flex gap-2">
									<input
										type="text"
										value={newAuthor}
										onChange={(e) => setNewAuthor(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												if (newAuthor.trim()) {
													setFormData((prev) => ({
														...prev,
														authors: [...new Set([...prev.authors, newAuthor.trim()])],
													}));
													setNewAuthor("");
												}
											}
										}}
										className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="Press Enter to add"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.authors.map((author, index) => (
										<span
											key={index}
											className="inline-flex items-center rounded bg-neutral-700/50 px-2 py-1 text-xs text-neutral-300"
										>
											{author}
											<button
												type="button"
												onClick={() => {
													setFormData((prev) => ({
														...prev,
														authors: prev.authors.filter((_, i) => i !== index),
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
							<label className="mb-1 block text-sm font-medium text-neutral-300">Advisor</label>
							<input
								type="text"
								value={formData.advisor}
								onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<button
							type="submit"
							className="w-full rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update Project" : "Create Project"}
						</button>
					</div>
				</form>
			</div>

			{/* Projects List */}
			<div className="flex h-full flex-col overflow-hidden">
				{/* Fixed Header */}
				<div>
					<h2 className="text-xl font-bold text-neutral-300">Projects</h2>

					{/* Search & Filters */}
					<div className="mt-4 space-y-4">
						<input
							type="text"
							placeholder="Search projects..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>

						<div className="flex gap-4">
							{/* Category Filter */}
							<div className="flex-1">
								<label className="mb-1.5 block text-xs font-medium text-neutral-400">
									Category
								</label>
								<select
									value={filters.category || ""}
									onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
									className="w-full rounded border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-sm text-neutral-200 outline-none transition-colors focus:border-yellow-600"
								>
									<option value="">All Categories</option>
									<option value="master">Master</option>
									<option value="phd">PhD</option>
									<option value="research">Research</option>
								</select>
							</div>

							{/* Year Filter */}
							<div className="flex-1">
								<label className="mb-1.5 block text-xs font-medium text-neutral-400">Year</label>
								<select
									value={filters.year || ""}
									onChange={(e) => setFilters({ ...filters, year: e.target.value || null })}
									className="w-full rounded border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-sm text-neutral-200 outline-none transition-colors focus:border-yellow-600"
								>
									<option value="">All Years</option>
									{years.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Projects Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid h-fit gap-2 pb-16">
						{filteredProjects.map((project) => (
							<div
								key={project._id}
								className="group relative flex cursor-pointer items-start justify-between rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 transition-all hover:border-yellow-600 hover:bg-neutral-800"
								onClick={() =>
									router.push(`/projects/${project.category.toLowerCase()}/${project.slug}`)
								}
							>
								<div className="min-w-0 flex-1">
									<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
										{project.title}
									</h3>
									<div className="mt-1 flex items-center gap-1">
										{project.authors.slice(0, 2).map((author, idx) => (
											<span
												key={idx}
												className="rounded bg-neutral-700/30 px-1.5 py-0.5 text-xs text-neutral-400"
											>
												{author}
											</span>
										))}
										{project.authors.length > 2 && (
											<span className="rounded bg-neutral-700/30 px-1.5 py-0.5 text-xs text-neutral-400">
												+{project.authors.length - 2}
											</span>
										)}
										{project.advisor && (
											<>
												<span className="text-xs text-neutral-500">•</span>
												<span className="rounded bg-neutral-700/30 px-1.5 py-0.5 text-xs text-neutral-400">
													{project.advisor}
												</span>
											</>
										)}
									</div>
									<div className="mt-1 flex items-center gap-1.5">
										<span className="rounded bg-yellow-600/10 px-1.5 py-0.5 text-xs font-medium text-yellow-600">
											{project.category}
										</span>
										<span className="rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs font-medium text-neutral-300">
											{project.year}
										</span>
									</div>
								</div>

								<div className="absolute right-3 top-2 flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(project);
										}}
										className="rounded bg-neutral-700/50 px-1.5 py-0.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(project);
										}}
										className="rounded bg-red-900/30 px-1.5 py-0.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/50"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{filteredProjects.length === 0 && (
							<div className="rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-center text-sm text-neutral-400">
								No projects found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
