import mongoose from "mongoose";

// Delete the model if it exists to prevent cached schemas
if (mongoose.models.Team) {
	delete mongoose.models.Team;
}

const TeamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		roles: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return v && v.length > 0;
				},
				message: "At least one role is required",
			},
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
	},
	{
		timestamps: true,
		strict: true,
		collection: "team", // Explicitly set collection name
		writeConcern: {
			w: "majority",
			j: true,
			wtimeout: 1000,
		},
		// Add an index on name for better query performance
		indexes: [{ name: 1 }],
	}
);

// Export as a new model instance
export default mongoose.model("Team", TeamSchema);
