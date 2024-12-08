import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Initiative) {
	delete mongoose.models.Initiative;
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
		category: {
			type: String,
			required: true,
			enum: ["Research", "Education", "Community", "Other"],
		},
		image: {
			type: String,
			trim: true,
		},
		goals: {
			type: String,
			required: true,
			trim: true,
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
			enum: ["Active", "Completed", "On Hold", "Planned"],
			default: "Active",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Initiative || mongoose.model("Initiative", InitiativeSchema);
