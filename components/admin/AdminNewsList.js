"use client";

import { useState, useEffect, useRef } from "react";
import { useNews } from "../../hooks/useNews";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { toast } from "react-hot-toast";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FileUpload from "../ui/FileUpload";
import ImagePreview from "../ui/ImagePreview";

const initialFormData = {
  title: "",
  content: "",
  publishDate: new Date().toISOString().split("T")[0],
  images: [],
};

export default function AdminNewsList() {
  const { news, createNews, updateNews, deleteNews } = useNews();
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [filters, setFilters] = useState({
    search: "",
  });
  const router = useRouter();
  const fileUploadRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("publishDate", formData.publishDate);

      // Handle images
      formData.images.slice(0, 4).forEach((image) => {
        formDataToSend.append("images", image);
      });

      if (editingId) {
        await updateNews(editingId, formDataToSend);
        toast.success("News updated successfully!");
      } else {
        await createNews(formDataToSend);
        toast.success("News created successfully!");
      }

      setFormData(initialFormData);
      setEditingId(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save news");
    }
  };

  const handleFileUploadSuccess = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, url].slice(0, 4),
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEdit = (newsItem) => {
    setEditingId(newsItem._id);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      publishDate: new Date(newsItem.publishDate).toISOString().split("T")[0],
      images: newsItem.images || [],
    });
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;

    try {
      await deleteNews(newsToDelete._id);
      setIsDeleteModalOpen(false);
      setNewsToDelete(null);
      toast.success("News deleted successfully");
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error(error.response?.data?.error || "Error deleting news");
    }
  };

  const filteredNews = news?.filter((newsItem) => {
    const matchesSearch =
      !filters.search ||
      newsItem.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      newsItem.content.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="grid h-full grid-cols-2 gap-6">
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNewsToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete News"
        message="Are you sure you want to delete this news item? This action cannot be undone."
      />

      {/* News Form */}
      <div className="overflow-y-auto pr-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-300">
              {editingId ? "Edit News" : "Add New News"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormData);
                }}
                className="rounded bg-neutral-700/50 px-2 py-1 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
              placeholder="Enter content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Publish Date</label>
            <input
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300">Images (Max 4)</label>
            {formData.images.length < 4 && (
              <div className="mt-1">
                <FileUpload
                  ref={fileUploadRef}
                  acceptedTypes=".jpg,.jpeg,.png"
                  maxSizeMB={5}
                  onUploadSuccess={(url) => handleFileUploadSuccess(url)}
                  onReset={() => setFormData({ ...formData, images: [] })}
                />
              </div>
            )}
            {formData.images.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormData);
                }}
                className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-500"
            >
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* News List */}
      <div className="flex h-full flex-col overflow-hidden">
        {/* Fixed Header */}
        <div>
          <h2 className="text-xl font-bold text-neutral-300">News</h2>
          <div className="mt-2">
            <Input
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
            {filteredNews?.map((newsItem) => (
              <div
                key={newsItem._id}
                onClick={() => router.push(`/news/${newsItem.slug}`)}
                className="group relative flex cursor-pointer items-center justify-between rounded-lg border border-neutral-700 bg-neutral-800/50 p-3 transition-all hover:border-yellow-600 hover:bg-neutral-800"
              >
                <div className="flex items-center gap-4">
                  {newsItem.images?.[0] && (
                    <img
                      src={newsItem.images[0]}
                      alt={newsItem.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-neutral-200 group-hover:text-yellow-600">
                      {newsItem.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-neutral-400">{newsItem.content}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(newsItem);
                    }}
                    className="rounded px-2 py-1 text-sm text-yellow-600 hover:bg-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewsToDelete(newsItem);
                      setIsDeleteModalOpen(true);
                    }}
                    className="rounded px-2 py-1 text-sm text-red-500 hover:bg-neutral-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
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
