import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default async function AdminPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const adminSections = [
    {
      title: 'Initiatives',
      description: 'Manage research and educational initiatives',
      href: '/admin/initiatives',
    },
    {
      title: 'Team',
      description: 'Manage team members and collaborators',
      href: '/admin/team',
    },
    {
      title: 'Projects',
      description: 'Manage research, master, and PhD projects',
      href: '/admin/projects',
    },
    {
      title: 'Partners',
      description: 'Manage academic and industry partnerships',
      href: '/admin/partners',
    },
    {
      title: 'News',
      description: 'Manage news articles and updates',
      href: '/admin/news',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-600">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Signed in as: {session.user?.email}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminSections.map((section) => (
          <Card key={section.href} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-4">{section.description}</p>
            <Link href={section.href}>
              <Button>
                Manage {section.title}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
