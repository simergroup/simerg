import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminTeamList from "../../../components/admin/AdminTeamList";

export default async function AdminTeamPage() {
	const session = await getServerSession();

	if (!session) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="h-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-yellow-600">Manage Team Members</h1>
				<p className="text-neutral-300">Create, edit, and manage team members.</p>
			</div>
			<AdminTeamList />
		</div>
	);
}
