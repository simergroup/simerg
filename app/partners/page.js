import dbConnect from "../../lib/mongodb";
import Partners from "../../models/Partner";
import PartnersPage from "../../components/PartnersPage";

export default async function Page() {
	await dbConnect();
	const partners = await Partners.find({}).sort({ createdAt: -1 }).lean();
	const partnersData = JSON.parse(JSON.stringify(partners));

	return <PartnersPage partners={partnersData} />;
}
