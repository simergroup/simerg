import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Partner) {
	delete mongoose.models.Partner;
}

const PartnerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		logo: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

// Drop the existing index on slug if it exists
PartnerSchema.pre("save", async function (next) {
	try {
		await mongoose.connection.collections.partners.dropIndex("slug_1");
	} catch (error) {
		// Index might not exist, which is fine
	}
	next();
});

export default mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);
