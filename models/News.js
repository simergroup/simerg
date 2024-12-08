import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.News) {
	delete mongoose.models.News;
}

const NewsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		author: {
			type: String,
			required: true,
			trim: true,
		},
		image: {
			type: String,
			trim: true,
		},
		publishDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		tags: {
			type: [String],
			validate: {
				validator: function (v) {
					return v && v.length > 0;
				},
				message: "At least one tag is required",
			},
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);
