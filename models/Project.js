import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Project) {
	delete mongoose.models.Project;
}

const ProjectSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		category: {
			type: String,
			required: true,
			enum: ["master", "phd", "research"],
		},
		year: {
			type: Number,
			required: true,
			min: 1900,
			max: new Date().getFullYear() + 1, // Allow current year plus one
		},
		keywords: {
			type: [String], // Array of strings
			required: true,
			validate: {
				validator: function (v) {
					return v && v.length > 0; // Must have at least one keyword
				},
				message: "At least one keyword is required",
			},
		},
		authors: {
			type: [String], // Array of strings
			required: true,
			validate: {
				validator: function (v) {
					return v && v.length > 0; // Must have at least one author
				},
				message: "At least one author is required",
			},
		},
		advisor: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{
		timestamps: true,
		strict: true,
	}
);

// Export as a new model instance
export default mongoose.model("Project", ProjectSchema);
