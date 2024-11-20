import { getServerSession } from 'next-auth';
import AdminInitiativesList from '../../../components/admin/AdminInitiativesList';
import { redirect } from 'next/navigation';

export default async function AdminInitiativesPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Initiatives</h1>
      <AdminInitiativesList />
    </div>
  );
}
