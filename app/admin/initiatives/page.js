import { getServerSession } from "next-auth";
import AdminInitiativesList from "../../../components/admin/AdminInitiativesList";
import { redirect } from "next/navigation";

export default async function AdminInitiativesPage() {
	const session = await getServerSession();

	if (!session) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="h-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-yellow-600">Manage Initiatives</h1>
				<p className="text-gray-300">Create, edit, and manage initiatives.</p>
			</div>
			<AdminInitiativesList />
		</div>
	);
}
