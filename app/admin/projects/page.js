import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminProjectsList from '../../../components/admin/AdminProjectsList';

export default async function AdminProjectsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Projects</h1>
        <p className="text-gray-600">Create, edit, and manage research projects.</p>
      </div>
      <AdminProjectsList />
    </div>
  );
}
