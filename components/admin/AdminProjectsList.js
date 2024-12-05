'use client';

import { useState, useEffect } from 'react';

// Function to normalize text for slug (same as in model)
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminProjectsList() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    category: '',
    author: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'master',
    year: new Date().getFullYear(),
    keywords: [],
    authors: [],
    advisor: ''
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [slugPreview, setSlugPreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (formData.title) {
      setSlugPreview(generateSlug(formData.title));
    } else {
      setSlugPreview('');
    }
  }, [formData.title]);

  useEffect(() => {
    const filterProjects = () => {
      let filtered = [...projects];

      // Text search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm)
        );
      }

      // Year filter
      if (filters.year) {
        filtered = filtered.filter(project => 
          project.year.toString() === filters.year
        );
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(project => 
          project.category === filters.category
        );
      }

      // Author filter
      if (filters.author) {
        const authorTerm = filters.author.toLowerCase();
        filtered = filtered.filter(project =>
          project.authors.some(author => 
            author.toLowerCase().includes(authorTerm)
          )
        );
      }

      setFilteredProjects(filtered);
    };

    filterProjects();
  }, [filters, projects]);

  // Get unique years from projects
  const years = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!formData.description?.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      alert('Please enter a valid year');
      return;
    }
    
    if (!Array.isArray(formData.keywords) || formData.keywords.length === 0) {
      alert('Please add at least one keyword');
      return;
    }
    
    if (!Array.isArray(formData.authors) || formData.authors.length === 0) {
      alert('Please add at least one author');
      return;
    }

    try {
      const processedData = {
        ...formData,
        year: parseInt(formData.year),
        keywords: formData.keywords.filter(k => k.trim()),
        authors: formData.authors.filter(a => a.trim())
      };

      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : '/api/projects',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedData),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        alert(`Error: ${data.error || 'Failed to save project'}`);
        return;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'master',
        year: new Date().getFullYear(),
        keywords: [],
        authors: [],
        advisor: ''
      });
      setNewKeyword('');
      setNewAuthor('');
      setSlugPreview('');
      setEditingId(null);
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      year: project.year,
      keywords: project.keywords || [],
      authors: project.authors || [],
      advisor: project.advisor || ''
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...new Set([...prev.keywords, newKeyword.trim()])]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  const addAuthor = () => {
    if (newAuthor.trim()) {
      setFormData(prev => ({
        ...prev,
        authors: [...new Set([...prev.authors, newAuthor.trim()])]
      }));
      setNewAuthor('');
    }
  };

  const removeAuthor = (index) => {
    setFormData({
      ...formData,
      authors: formData.authors.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Form */}
      <div className="overflow-y-auto pr-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-4 text-xl font-semibold text-neutral-300">
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                required
              />
              {slugPreview && (
                <div className="mt-1 text-sm text-neutral-400">
                  URL slug: {slugPreview}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                rows="4"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-neutral-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  required
                >
                  <option value="master">Master</option>
                  <option value="phd">PhD</option>
                  <option value="research">Research</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-neutral-300">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="p-2 w-full rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Keywords</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="flex-1 p-2 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  placeholder="Enter a keyword"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="flex gap-1 items-center px-2 py-1 text-sm rounded-full bg-neutral-700 text-neutral-300"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">Authors</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="flex-1 p-2 rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  placeholder="Enter an author name"
                />
                <button
                  type="button"
                  onClick={addAuthor}
                  className="px-4 py-2 bg-yellow-600 rounded text-neutral-900 hover:bg-yellow-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.authors.map((author, index) => (
                  <span
                    key={index}
                    className="flex gap-1 items-center px-2 py-1 text-sm rounded-full bg-neutral-700 text-neutral-300"
                  >
                    {author}
                    <button
                      type="button"
                      onClick={() => removeAuthor(index)}
                      className="text-neutral-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-neutral-300">
                Professor Advisor (Optional)
              </label>
              <input
                type="text"
                value={formData.advisor}
                onChange={(e) => setFormData({ ...formData, advisor: e.target.value })}
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
                    title: '',
                    description: '',
                    category: 'master',
                    year: new Date().getFullYear(),
                    keywords: [],
                    authors: [],
                    advisor: ''
                  });
                  setNewKeyword('');
                  setNewAuthor('');
                  setSlugPreview('');
                }}
                className="px-4 py-2 rounded text-neutral-300 bg-neutral-700 hover:bg-neutral-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="flex flex-col h-full">
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-300">Projects</h2>
              <input
                type="text"
                placeholder="Search projects..."
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
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                  className="px-3 py-1 w-full text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.year}
                  onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                  className="px-3 py-1 w-32 text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-1 w-48 text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-300 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="master">Master</option>
                  <option value="phd">PhD</option>
                  <option value="research">Research</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.map((project) => (
                <div key={project._id} className="flex justify-between items-start p-4 rounded-lg border bg-neutral-800 border-neutral-700">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-neutral-300">{project.title}</h3>
                    <p className="mt-1 text-sm text-neutral-400 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs rounded bg-neutral-700 text-neutral-300">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-neutral-700 text-neutral-300">
                        {project.year}
                      </span>
                      {project.authors && project.authors.length > 0 && (
                        <span className="px-2 py-1 text-xs rounded bg-neutral-700 text-neutral-300">
                          {project.authors[0]}{project.authors.length > 1 ? ` +${project.authors.length - 1}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1 text-yellow-600 hover:text-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
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
