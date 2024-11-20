'use client';

import { useState } from 'react';
import { useInitiatives } from '../../hooks/useInitiatives';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function AdminInitiativesList() {
  const { initiatives, loading, error, createInitiative, updateInitiative, deleteInitiative } = useInitiatives();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    goals: '',
  });

  const categories = ['Research', 'Education', 'Community', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInitiative(editingId, formData);
        setEditingId(null);
      } else {
        await createInitiative(formData);
      }
      setFormData({ title: '', description: '', image: '', category: '', goals: '' });
    } catch (error) {
      console.error('Error saving initiative:', error);
    }
  };

  const handleEdit = (initiative) => {
    setEditingId(initiative._id);
    setFormData({
      title: initiative.title,
      description: initiative.description,
      image: initiative.image,
      category: initiative.category,
      goals: initiative.goals,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this initiative?')) {
      try {
        await deleteInitiative(id);
      } catch (error) {
        console.error('Error deleting initiative:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <Textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Goals (one per line)"
          value={formData.goals}
          onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          required
        />
        <Button type="submit">
          {editingId ? 'Update Initiative' : 'Add Initiative'}
        </Button>
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', description: '', image: '', category: '', goals: '' });
            }}
          >
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="space-y-4">
        {initiatives.map((item) => (
          <Card key={item._id} className="p-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">Category: {item.category}</p>
            <p className="mt-2">{item.description}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="mt-2 max-w-xs rounded"
              />
            )}
            <div className="mt-2">
              <h4 className="font-semibold">Goals:</h4>
              <ul className="list-disc list-inside">
                {item.goals.split('\n').map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(item)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
