import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Initiative) {
	delete mongoose.models.Initiative;
}

// Function to generate slug from title
function generateSlug(title) {
	return title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^\w\s-]/g, "") // Remove non-word chars
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

const InitiativeSchema = new mongoose.Schema(
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
		image: {
			type: String,
			trim: true,
		},
		website: {
			type: String,
			trim: true,
		},
		slug: {
			type: String,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

// Pre-save middleware to generate slug
InitiativeSchema.pre("save", async function (next) {
	if (!this.slug || this.isModified("title")) {
		let baseSlug = generateSlug(this.title);
		let slug = baseSlug;
		let counter = 1;

		// Check for existing slugs and append counter if needed
		while (true) {
			const existingDoc = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
			if (!existingDoc) break;
			slug = `${baseSlug}-${counter}`;
			counter++;
		}

		this.slug = slug;
	}
	next();
});

export default mongoose.models.Initiative || mongoose.model("Initiative", InitiativeSchema);
