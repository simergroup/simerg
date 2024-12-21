import mongoose from "mongoose";

async function dbConnect() {
	const MONGODB_URI = process.env.MONGODB_URI;

	if (!MONGODB_URI) {
		console.error("MONGODB_URI is not defined in environment variables");
		throw new Error("Please add your MONGODB_URI to .env.local");
	}

	// If the connection is already established, return early
	if (mongoose.connections[0].readyState) {
		console.log(
			"MongoDB connection already established, readyState:",
			mongoose.connections[0].readyState
		);
		return;
	}

	try {
		console.log("Attempting to connect to MongoDB...");
		const opts = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			writeConcern: {
				w: "majority",
				j: true,
				wtimeout: 1000,
			},
			retryWrites: true,
		};

		await mongoose.connect(MONGODB_URI, opts);

		// Test the connection with a ping
		await mongoose.connection.db.admin().ping();

		console.log("Successfully connected to MongoDB");
		console.log("Database name:", mongoose.connection.name);
		console.log("Connection state:", mongoose.connection.readyState);
		console.log("Write concern:", mongoose.connection.writeConcern);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		console.error("Connection details:", {
			readyState: mongoose.connection.readyState,
			host: mongoose.connection.host,
			name: mongoose.connection.name,
		});
		throw new Error("Failed to connect to MongoDB");
	}
}

export default dbConnect;
