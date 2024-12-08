"use client";

import { useState } from "react";
import { useNews } from "../../hooks/useNews";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

export default function AdminNewsList() {
	const { news, createNews, updateNews, deleteNews } = useNews();
	const [editingId, setEditingId] = useState(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newsToDelete, setNewsToDelete] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		content: "",
		author: "",
		image: "",
		publishDate: new Date().toISOString().split("T")[0],
		tags: "",
		featured: false,
	});
	const [filters, setFilters] = useState({
		search: "",
	});

	const filteredNews = news?.filter((item) => {
		const matchesSearch =
			!filters.search ||
			item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
			item.content.toLowerCase().includes(filters.search.toLowerCase()) ||
			item.author.toLowerCase().includes(filters.search.toLowerCase());

		return matchesSearch;
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const newsData = {
				...formData,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
			};

			if (editingId) {
				await updateNews(editingId, newsData);
				toast.success("News updated successfully!");
				setEditingId(null);
			} else {
				await createNews(newsData);
				toast.success("News created successfully!");
			}
			setFormData({
				title: "",
				content: "",
				author: "",
				image: "",
				publishDate: new Date().toISOString().split("T")[0],
				tags: "",
				featured: false,
			});
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		}
	};

	const handleEdit = (item) => {
		setEditingId(item._id);
		setFormData({
			title: item.title,
			content: item.content,
			author: item.author,
			image: item.image || "",
			publishDate: new Date(item.publishDate).toISOString().split("T")[0],
			tags: item.tags?.join(", ") || "",
			featured: item.featured || false,
		});
	};

	const handleDelete = async (id) => {
		try {
			await deleteNews(id);
			toast.success("News deleted successfully!");
			setIsDeleteModalOpen(false);
			setNewsToDelete(null);
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
					setNewsToDelete(null);
				}}
				onConfirm={() => handleDelete(newsToDelete?._id)}
				title="Delete News"
				message={`Are you sure you want to delete "${newsToDelete?.title}"? This action cannot be undone.`}
			/>

			{/* News Form */}
			<div className="overflow-y-auto pr-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold text-neutral-300">
							{editingId ? "Edit News" : "Add New News"}
						</h2>
						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setFormData({
										title: "",
										content: "",
										author: "",
										image: "",
										publishDate: new Date().toISOString().split("T")[0],
										tags: "",
										featured: false,
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
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Content</label>
							<Textarea
								value={formData.content}
								onChange={(e) => setFormData({ ...formData, content: e.target.value })}
								required
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Author</label>
							<Input
								type="text"
								value={formData.author}
								onChange={(e) => setFormData({ ...formData, author: e.target.value })}
								required
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Image URL</label>
							<Input
								type="url"
								value={formData.image}
								onChange={(e) => setFormData({ ...formData, image: e.target.value })}
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">
								Publish Date
							</label>
							<Input
								type="date"
								value={formData.publishDate}
								onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
								required
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium text-neutral-300">Tags</label>
							<Input
								type="text"
								value={formData.tags}
								onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
								placeholder="Enter tags separated by commas"
								required
								className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
							/>
						</div>

						<button
							type="submit"
							className="w-full rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
						>
							{editingId ? "Update News" : "Create News"}
						</button>
					</div>
				</form>
			</div>

			{/* News List */}
			<div className="flex h-full flex-col overflow-hidden">
				{/* Fixed Header */}
				<div>
					<h2 className="text-xl font-bold text-neutral-300">News</h2>
					<div className="mt-4 space-y-4">
						<Input
							type="text"
							placeholder="Search news..."
							value={filters.search}
							onChange={(e) => setFilters({ ...filters, search: e.target.value })}
							className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-300 placeholder-neutral-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
						/>
					</div>
				</div>

				{/* News Grid - Scrollable */}
				<div className="mt-6 flex-1 overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-800 [&::-webkit-scrollbar]:w-1.5">
					<div className="grid h-fit gap-2 pb-16">
						{filteredNews?.map((news) => (
							<Card key={news._id} className="p-4">
								<div className="flex gap-4">
									{news.image && (
										<img
											src={news.image}
											alt={news.title}
											className="h-24 w-24 rounded object-contain"
										/>
									)}
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between">
											<div>
												<h3 className="break-words pr-4 text-base font-medium text-neutral-200 group-hover:text-yellow-600">
													{news.title}
												</h3>
												<p className="text-sm text-neutral-400">{news.author}</p>
											</div>
											<div className="flex gap-2">
												<Button variant="outline" size="sm" onClick={() => handleEdit(news)}>
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => {
														setNewsToDelete(news);
														setIsDeleteModalOpen(true);
													}}
												>
													Delete
												</Button>
											</div>
										</div>
										<p className="mt-2 text-sm text-neutral-300">{news.content}</p>
										{news.tags?.length > 0 && (
											<div className="mt-2 grid gap-1 text-sm text-neutral-400">
												{news.tags.map((tag, index) => (
													<span
														key={index}
														className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300"
													>
														{tag}
													</span>
												))}
											</div>
										)}
										<p className="mt-2 text-sm text-neutral-400">
											Published: {new Date(news.publishDate).toLocaleDateString()}
										</p>
									</div>
								</div>
							</Card>
						))}
						{filteredNews?.length === 0 && (
							<div className="rounded-md border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-center text-sm text-neutral-400">
								No news found
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
