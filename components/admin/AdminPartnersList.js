'use client';

import { useState } from 'react';
import { usePartners } from '../../hooks/usePartners';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function AdminPartnersList() {
  const { partners, loading, error, createPartner, updatePartner, deletePartner } = usePartners();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    partnershipType: '',
  });

  const partnershipTypes = ['Academic', 'Industry', 'Research', 'Funding', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePartner(editingId, formData);
        setEditingId(null);
      } else {
        await createPartner(formData);
      }
      setFormData({ name: '', description: '', logo: '', website: '', partnershipType: '' });
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const handleEdit = (partner) => {
    setEditingId(partner._id);
    setFormData({
      name: partner.name,
      description: partner.description,
      logo: partner.logo,
      website: partner.website,
      partnershipType: partner.partnershipType,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
      } catch (error) {
        console.error('Error deleting partner:', error);
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
          placeholder="Partner Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          placeholder="Logo URL"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
        />
        <Input
          type="url"
          placeholder="Website URL"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          required
        />
        <Select
          value={formData.partnershipType}
          onValueChange={(value) => setFormData({ ...formData, partnershipType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select partnership type" />
          </SelectTrigger>
          <SelectContent>
            {partnershipTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">
          {editingId ? 'Update Partner' : 'Add Partner'}
        </Button>
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', description: '', logo: '', website: '', partnershipType: '' });
            }}
          >
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="space-y-4">
        {partners.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-start gap-4">
              {item.logo && (
                <img
                  src={item.logo}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  Partnership Type: {item.partnershipType}
                </p>
                <p className="mt-2">{item.description}</p>
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Visit Website
                </a>
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
