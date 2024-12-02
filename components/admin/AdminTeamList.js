'use client';

import { useState, useEffect } from 'react';

export default function AdminTeamList() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredTeamMembers, setFilteredTeamMembers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name?.trim()) {
      alert('Please enter a name');
      return;
    }

    if (!formData.role?.trim()) {
      alert('Please enter a role');
      return;
    }

    if (!formData.description?.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      const response = await fetch(
        editingId ? `/api/team/${editingId}` : '/api/team',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        alert(`Error: ${data.error || 'Failed to save team member'}`);
        return;
      }

      // Reset form
      setFormData({
        name: '',
        role: '',
        description: '',
        image: ''
      });
      setEditingId(null);
      
      // Refresh team members list
      fetchTeamMembers();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      image: member.image
    });
    setEditingId(member._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Form */}
      <div className="overflow-y-auto pr-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-4 text-xl font-semibold text-neutral-300">
            {editingId ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    role: '',
                    description: '',
                    image: ''
                  });
                }}
                className="px-4 py-2 rounded text-neutral-300 bg-neutral-700 hover:bg-neutral-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Team Members List */}
      <div className="flex flex-col h-full">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-300">Team Members</h2>
              <input
                type="text"
                placeholder="Search team members..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="px-3 py-1 w-full max-w-xl text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium whitespace-nowrap text-neutral-400">Filter by:</span>
                <input
                  type="text"
                  placeholder="Filter by role..."
                  value={filters.role}
                  onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="px-3 py-1 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 gap-4">
              {filteredTeamMembers.map((member) => (
                <div key={member._id} className="flex justify-between items-start p-4 rounded-lg border bg-neutral-800 border-neutral-700">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-neutral-300">{member.name}</h3>
                    <p className="mt-1 text-sm text-neutral-400">{member.role}</p>
                    <p className="mt-1 text-sm text-neutral-400">{member.description}</p>
                    {member.image && (
                      <img src={member.image} alt={member.name} className="mt-2 w-16 h-16 rounded-full" />
                    )}
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-3 py-1 text-yellow-600 hover:text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="px-3 py-1 text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}