import { getServerSession } from 'next-auth';
import AdminPartnersList from '../../../components/admin/AdminPartnersList';
import { redirect } from 'next/navigation';

export default async function AdminPartnersPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Partners</h1>
      <AdminPartnersList />
    </div>
  );
}
