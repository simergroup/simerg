import { getServerSession } from "next-auth";
import AdminNewsList from "../../../components/admin/AdminNewsList";
import { redirect } from "next/navigation";

export default async function AdminNewsPage() {
	const session = await getServerSession();

	if (!session) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="h-full">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-yellow-600">Manage News</h1>
				<p className="text-neutral-300">Create, edit, and manage news.</p>
			</div>
			<AdminNewsList />
		</div>
	);
}
