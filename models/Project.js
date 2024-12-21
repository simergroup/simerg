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
			required: function () {
				return this.category === "master" || this.category === "phd";
			},
			min: 1900,
			max: new Date().getFullYear() + 1,
		},
		keywords: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return v && v.length > 0;
				},
				message: "At least one keyword is required",
			},
		},
		authors: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return v && v.length > 0;
				},
				message: "At least one author is required",
			},
		},
		professorAdvisor: {
			type: String,
			required: function () {
				return this.category === "master" || this.category === "phd";
			},
			trim: true,
		},
		university: {
			type: String,
			required: function () {
				return this.category === "phd";
			},
			trim: true,
		},
		coAdvisor: {
			type: String,
			trim: true,
		},
		authorType: {
			type: String,
			required: function () {
				return this.category === "research";
			},
			enum: ["author", "researcher"],
			default: "author",
		},
		website: {
			type: String,
			trim: true,
		},
		book: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
			trim: true,
		},
		pdfFile: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Create indexes
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ year: 1 });
ProjectSchema.index({ createdAt: -1 });

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
