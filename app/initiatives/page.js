import dbConnect from "../../lib/mongodb";
import Initiative from "../../models/Initiative";
import InitiativesList from "../../components/InitiativesList";

export const dynamic = "force-dynamic";

export default async function Page() {
	try {
		await dbConnect();
		const initiatives = await Initiative.find({}).sort({ createdAt: -1 }).lean();
		const initiativesData = JSON.parse(JSON.stringify(initiatives));

		return <InitiativesList initiatives={initiativesData} />;
	} catch (error) {
		console.error("Error fetching initiatives:", error);
		return <div className="text-center text-neutral-300">Error loading initiatives</div>;
	}
}
