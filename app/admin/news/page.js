import { getServerSession } from 'next-auth';
import AdminNewsList from '../../../components/admin/AdminNewsList';
import { redirect } from 'next/navigation';

export default async function AdminNewsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage News</h1>
      <AdminNewsList />
    </div>
  );
}
