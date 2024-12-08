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
		website: {
			type: String,
			required: true,
			trim: true,
		},
		partnershipType: {
			type: String,
			required: true,
			enum: ["Academic", "Industry", "Research", "Funding", "Other"],
		},
		contactPerson: {
			name: {
				type: String,
				required: true,
				trim: true,
			},
			email: {
				type: String,
				required: true,
				trim: true,
			},
			phone: {
				type: String,
				trim: true,
			},
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
		},
		status: {
			type: String,
			required: true,
			enum: ["Active", "Inactive", "Pending"],
			default: "Active",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);
