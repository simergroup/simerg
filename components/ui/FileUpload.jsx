"use client";

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { toast } from "react-hot-toast";

const FileUpload = forwardRef(
	({ onUploadSuccess, onReset, acceptedTypes = ".jpg,.jpeg,.png,.pdf", maxSizeMB = 5 }, ref) => {
		const [isUploading, setIsUploading] = useState(false);
		const [lastUploadedFile, setLastUploadedFile] = useState(null);
		const fileInputRef = useRef(null);

		useImperativeHandle(ref, () => ({
			clearInput: () => {
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
					setLastUploadedFile(null);
				}
			},
		}));

		const clearFileInput = () => {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
				setLastUploadedFile(null);
				if (onReset) onReset();
			}
		};

		const handleFileChange = async (e) => {
			const file = e.target.files?.[0];
			// If no file is selected (user cancelled), keep the last uploaded file state
			if (!file) {
				if (fileInputRef.current && lastUploadedFile) {
					// Restore the last uploaded file name in the input
					const dataTransfer = new DataTransfer();
					dataTransfer.items.add(lastUploadedFile);
					fileInputRef.current.files = dataTransfer.files;
				}
				return;
			}

			console.log("File selected:", {
				name: file.name,
				type: file.type,
				size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
			});

			// Validate file size
			if (file.size > maxSizeMB * 1024 * 1024) {
				console.log("File size validation failed:", {
					fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
					maxSize: `${maxSizeMB}MB`,
				});
				toast.error(`File size must be less than ${maxSizeMB}MB`);
				clearFileInput();
				return;
			}

			// Validate file type
			const fileType = file.type;
			const isValidType = acceptedTypes
				.split(",")
				.some((type) => file.name.toLowerCase().endsWith(type.toLowerCase()));

			if (!isValidType) {
				console.log("File type validation failed:", {
					fileType,
					acceptedTypes,
				});
				toast.error(`Please upload only ${acceptedTypes} files`);
				clearFileInput();
				return;
			}

			try {
				console.log("Starting file upload...");
				setIsUploading(true);
				const formData = new FormData();
				formData.append("file", file);

				console.log("Sending file to /api/upload endpoint");

				const uploadResponse = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				console.log("Upload response status:", uploadResponse.status);

				if (!uploadResponse.ok) {
					const errorData = await uploadResponse.json();
					console.error("Upload error details:", errorData);
					throw new Error(errorData.error || "Upload failed");
				}

				const data = await uploadResponse.json();
				console.log("Upload successful:", {
					url: data.url,
					fileName: file.name,
				});

				onUploadSuccess(data.url);
				setLastUploadedFile(file);
				toast.success("File uploaded successfully!");
			} catch (error) {
				console.error("Upload error:", {
					message: error.message,
					stack: error.stack,
				});
				toast.error("Failed to upload file. Please try again.");
				clearFileInput();
			} finally {
				setIsUploading(false);
				console.log("Upload process completed");
			}
		};

		return (
			<div className="w-full">
				<label className="block">
					<span className="sr-only">Choose file</span>
					<input
						ref={fileInputRef}
						type="file"
						onChange={handleFileChange}
						accept={acceptedTypes}
						disabled={isUploading}
						className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</label>
				{isUploading && <div className="mt-2 text-sm text-gray-600">Uploading...</div>}
			</div>
		);
	}
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
