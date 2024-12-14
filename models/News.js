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
		images: {
			type: [String],
			validate: {
				validator: function (v) {
					return v.length <= 4;
				},
				message: "Cannot have more than 4 images",
			},
		},
		publishDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		featured: {
			type: Boolean,
			default: false,
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

const News = mongoose.model("News", NewsSchema);
export default News;
