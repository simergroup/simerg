"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";
import ImagePreview from "../ui/ImagePreview";

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
	const emptyFormData = {
		title: "",
		description: "",
		category: "master",
		year: new Date().getFullYear(),
		keywords: [],
		authors: [],
		professorAdvisor: "",
		university: "",
		coAdvisor: "",
		authorType: "author",
		website: "",
		book: "",
		image: "",
		pdfFile: "",
	};
	const [formData, setFormData] = useState(emptyFormData);
	const [newKeyword, setNewKeyword] = useState("");
	const [newAuthor, setNewAuthor] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState(null);
	const router = useRouter();
	const fileUploadRef = useRef(null);

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const res = await fetch("/api/projects");
			const data = await res.json();
			setProjects(data);
		} catch (error) {
			console.error("Error fetching projects:", error);
		}
	};

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

	// Get unique years from projects
	const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Validate required fields based on category
			const requiredFields = {
				all: ["title", "description", "category"],
				master: ["year", "professorAdvisor"],
				phd: ["year", "professorAdvisor", "university"],
				research: ["authorType"],
			};

			// Check common required fields
			for (const field of requiredFields.all) {
				if (!formData[field]) {
					throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
				}
			}

			// Check category-specific required fields
			const categoryFields = requiredFields[formData.category];
			if (categoryFields) {
				for (const field of categoryFields) {
					if (!formData[field]) {
						throw new Error(
							`${field.charAt(0).toUpperCase() + field.slice(1)} is required for ${formData.category} projects`
						);
					}
				}
			}

			// Validate arrays
			if (!formData.keywords.length) {
				throw new Error("At least one keyword is required");
			}
			if (!formData.authors.length) {
				throw new Error("At least one author is required");
			}

			// Prepare data for submission based on category
			let projectData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				category: formData.category,
				keywords: formData.keywords.filter((k) => k.trim()),
				authors: formData.authors.filter((a) => a.trim()),
			};

			if (formData.category === "research") {
				projectData = {
					...projectData,
					authorType: formData.authorType,
					// Only include optional fields if they have values
					...(formData.website?.trim() ? { website: formData.website.trim() } : {}),
					...(formData.book?.trim() ? { book: formData.book.trim() } : {}),
					...(formData.image ? { image: formData.image } : {}),
					// Explicitly set these to undefined for research projects
					year: undefined,
					professorAdvisor: undefined,
					university: undefined,
					coAdvisor: undefined,
					pdfFile: undefined,
				};
			} else {
				// For master and phd
				projectData = {
					...projectData,
					year: parseInt(formData.year),
					professorAdvisor: formData.professorAdvisor.trim(),
					// Only include optional fields if they have values
					...(formData.coAdvisor?.trim() ? { coAdvisor: formData.coAdvisor.trim() } : {}),
					...(formData.pdfFile ? { pdfFile: formData.pdfFile } : {}),
					// Explicitly set these to undefined for non-research projects
					website: undefined,
					book: undefined,
					image: undefined,
					authorType: undefined,
				};

				// Additional fields for phd
				if (formData.category === "phd") {
					projectData.university = formData.university.trim();
				}
			}

			console.log("Submitting data:", projectData);

			const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
				method: editingId ? "PUT" : "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(projectData),
			});

			const data = await response.json();

			if (!response.ok) {
				console.error("Server response:", data);
				throw new Error(data.error || "Failed to save project");
			}

			toast.success(editingId ? "Project updated successfully!" : "Project created successfully!");
			setFormData(emptyFormData);
			setEditingId(null);
			fetchProjects();
		} catch (error) {
			console.error("Error submitting project:", error);
			toast.error(error.message || "Error submitting project");
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
			professorAdvisor: project.professorAdvisor || "",
			university: project.university || "",
			coAdvisor: project.coAdvisor || "",
			authorType: project.authorType || "author",
			website: project.website || "",
			book: project.book || "",
			image: project.image || "",
			pdfFile: project.pdfFile || "",
		});
		setEditingId(project._id);

		// Reset the file input but keep the image preview
		if (fileUploadRef.current) {
			fileUploadRef.current.clearInput();
		}
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

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFileChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.files[0] });
	};

	return (
		<div className="grid grid-cols-2 gap-6 h-full">
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
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-bold text-neutral-300">
							{editingId ? "Edit Project" : "Add New Project"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setFormData(emptyFormData);
									setEditingId(null);
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
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
								required
							/>
						</div>

						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								rows={3}
								className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
								required
							/>
						</div>

						{/* Category and Year/Author Type fields */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-sm font-medium text-neutral-300">
									Category <span className="text-red-500">*</span>
								</label>
								<select
									value={formData.category}
									onChange={(e) => {
										const newCategory = e.target.value;
										const baseData = {
											...formData,
											category: newCategory,
										};

										// Reset fields based on category
										if (newCategory === "research") {
											setFormData({
												...baseData,
												year: null,
												professorAdvisor: "",
												university: "",
												coAdvisor: "",
												pdfFile: "",
												authorType: "author",
											});
										} else if (newCategory === "phd") {
											setFormData({
												...baseData,
												website: "",
												book: "",
												image: "",
												authorType: "",
												year: new Date().getFullYear(),
											});
										} else {
											// master
											setFormData({
												...baseData,
												website: "",
												book: "",
												image: "",
												authorType: "",
												university: "",
												year: new Date().getFullYear(),
											});
										}
									}}
									className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									required
								>
									<option value="master">Master</option>
									<option value="phd">PhD</option>
									<option value="research">Research</option>
								</select>
							</div>

							{formData.category === "research" ? (
								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Author Type <span className="text-red-500">*</span>
									</label>
									<select
										value={formData.authorType}
										onChange={(e) =>
											setFormData({
												...formData,
												authorType: e.target.value,
											})
										}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										required
									>
										<option value="author">Author</option>
										<option value="researcher">Researcher</option>
									</select>
								</div>
							) : (
								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Year{" "}
										<span className={formData.category !== "research" ? "text-red-500" : "hidden"}>
											*
										</span>
									</label>
									<input
										type="number"
										min={1900}
										max={new Date().getFullYear() + 1}
										value={formData.year}
										onChange={(e) =>
											setFormData({
												...formData,
												year: parseInt(e.target.value),
											})
										}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										required
									/>
								</div>
							)}
						</div>

						{/* Keywords field */}
						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Keywords <span className="text-red-500">*</span>
							</label>
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
										className="flex-1 px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="Press Enter to add"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.keywords.map((keyword, index) => (
										<span
											key={index}
											className="inline-flex items-center px-2 py-1 text-xs rounded bg-neutral-700/50 text-neutral-300"
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

						{/* Authors */}
						<div>
							<label className="block mb-1 text-sm font-medium text-neutral-300">
								Authors <span className="text-red-500">*</span>
							</label>
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
										className="flex-1 px-3 py-1.5 text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="Press Enter to add"
									/>
								</div>
								<div className="flex flex-wrap gap-2">
									{formData.authors.map((author, index) => (
										<span
											key={index}
											className="inline-flex items-center px-2 py-1 text-xs rounded bg-neutral-700/50 text-neutral-300"
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

						{/* Research specific fields */}
						{formData.category === "research" && (
							<div className="space-y-4">
								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">Website</label>
									<input
										type="url"
										value={formData.website}
										onChange={(e) =>
											setFormData({
												...formData,
												website: e.target.value,
											})
										}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="https://..."
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">Book</label>
									<input
										type="url"
										value={formData.book}
										onChange={(e) =>
											setFormData({
												...formData,
												book: e.target.value,
											})
										}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										placeholder="https://..."
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Project Image
									</label>
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
							</div>
						)}

						{/* Fields for PhD category */}
						{formData.category === "phd" && (
							<div className="space-y-4">
								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Professor Advisor <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={formData.professorAdvisor}
										onChange={(e) => setFormData({ ...formData, professorAdvisor: e.target.value })}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										required
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										University <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={formData.university}
										onChange={(e) => setFormData({ ...formData, university: e.target.value })}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										required
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Co-Advisor
									</label>
									<input
										type="text"
										value={formData.coAdvisor}
										onChange={(e) => setFormData({ ...formData, coAdvisor: e.target.value })}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										PDF File
									</label>
									<FileUpload
										acceptedTypes=".pdf"
										maxSizeMB={10}
										onUploadSuccess={(url) => setFormData({ ...formData, pdfFile: url })}
									/>
									{formData.pdfFile && (
										<div className="mt-2 text-sm text-neutral-400">
											Current file: {formData.pdfFile.split("/").pop()}
										</div>
									)}
								</div>
							</div>
						)}

						{/* Professor Advisor and PDF for Master category */}
						{formData.category === "master" && (
							<div className="space-y-4">
								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Professor Advisor <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={formData.professorAdvisor}
										onChange={(e) => setFormData({ ...formData, professorAdvisor: e.target.value })}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
										required
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										Co-Advisor
									</label>
									<input
										type="text"
										value={formData.coAdvisor}
										onChange={(e) => setFormData({ ...formData, coAdvisor: e.target.value })}
										className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
									/>
								</div>

								<div>
									<label className="block mb-1 text-sm font-medium text-neutral-300">
										PDF File
									</label>
									<FileUpload
										acceptedTypes=".pdf"
										maxSizeMB={10}
										onUploadSuccess={(url) => setFormData({ ...formData, pdfFile: url })}
									/>
									{formData.pdfFile && (
										<div className="mt-2 text-sm text-neutral-400">
											Current file: {formData.pdfFile.split("/").pop()}
										</div>
									)}
								</div>
							</div>
						)}

						<button
							type="submit"
							className="px-4 py-2 w-full text-sm font-medium text-white bg-yellow-600 rounded hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update Project" : "Create Project"}
						</button>
					</div>
				</form>
			</div>

			{/* Projects List */}
			<div className="flex overflow-hidden flex-col h-full">
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
							className="px-3 py-1.5 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>

						<div className="flex gap-4">
							{/* Category Filter */}
							<div className="flex-1">
								<label className="block mb-1.5 text-xs font-medium text-neutral-400">
									Category
								</label>
								<select
									value={filters.category || ""}
									onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
									className="px-3 py-1.5 w-full text-sm rounded border transition-colors outline-none border-neutral-700 bg-neutral-800/50 text-neutral-200 focus:border-yellow-600"
								>
									<option value="">All Categories</option>
									<option value="master">Master</option>
									<option value="phd">PhD</option>
									<option value="research">Research</option>
								</select>
							</div>

							{/* Year Filter */}
							<div className="flex-1">
								<label className="block mb-1.5 text-xs font-medium text-neutral-400">Year</label>
								<select
									value={filters.year || ""}
									onChange={(e) => setFilters({ ...filters, year: e.target.value || null })}
									className="px-3 py-1.5 w-full text-sm rounded border transition-colors outline-none border-neutral-700 bg-neutral-800/50 text-neutral-200 focus:border-yellow-600"
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
					<div className="grid gap-2 pb-16 h-fit">
						{filteredProjects.map((project) => (
							<div
								key={project._id}
								className="flex relative justify-between items-start px-3 py-2 rounded-md border transition-all cursor-pointer group border-neutral-700 bg-neutral-800/50 hover:border-yellow-600 hover:bg-neutral-800"
								onClick={() =>
									router.push(`/projects/${project.category.toLowerCase()}/${project.slug}`)
								}
							>
								<div className="flex-1 min-w-0">
									<h3 className="pr-4 text-base font-medium break-words text-neutral-200 group-hover:text-yellow-600">
										{project.title}
									</h3>
									<div className="flex gap-1 items-center mt-1">
										{project.authors.slice(0, 2).map((author, idx) => (
											<span
												key={idx}
												className="px-1.5 py-0.5 text-xs rounded bg-neutral-700/30 text-neutral-400"
											>
												{author}
											</span>
										))}
										{project.authors.length > 2 && (
											<span className="px-1.5 py-0.5 text-xs rounded bg-neutral-700/30 text-neutral-400">
												+{project.authors.length - 2}
											</span>
										)}
										{project.professorAdvisor && (
											<>
												<span className="text-xs text-neutral-500">•</span>
												<span className="px-1.5 py-0.5 text-xs rounded bg-neutral-700/30 text-neutral-400">
													{project.professorAdvisor}
												</span>
											</>
										)}
									</div>
									<div className="flex gap-1.5 items-center mt-1">
										<span className="px-1.5 py-0.5 text-xs font-medium text-yellow-600 rounded bg-yellow-600/10">
											{project.category}
										</span>
										{project.year && (
											<span className="px-1.5 py-0.5 text-xs font-medium rounded bg-neutral-700/50 text-neutral-300">
												{project.year}
											</span>
										)}
									</div>
								</div>

								<div className="flex absolute top-2 right-3 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleEdit(project);
										}}
										className="px-1.5 py-0.5 text-xs font-medium rounded transition-colors bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600"
									>
										Edit
									</button>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(project);
										}}
										className="px-1.5 py-0.5 text-xs font-medium text-red-300 rounded transition-colors bg-red-900/30 hover:bg-red-900/50"
									>
										Delete
									</button>
								</div>
							</div>
						))}
						{filteredProjects.length === 0 && (
							<div className="px-3 py-2 text-sm text-center rounded-md border border-neutral-700 bg-neutral-800/50 text-neutral-400">
								No projects found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
