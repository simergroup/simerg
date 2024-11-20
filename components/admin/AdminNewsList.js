'use client';

import { useState } from 'react';
import { useNews } from '../../hooks/useNews';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';

export default function AdminNewsList() {
  const { news, loading, error, createNews, updateNews, deleteNews } = useNews();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateNews(editingId, formData);
        setEditingId(null);
      } else {
        await createNews(formData);
      }
      setFormData({ title: '', content: '', image: '', author: '' });
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingId(newsItem._id);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      image: newsItem.image,
      author: newsItem.author,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await deleteNews(id);
      } catch (error) {
        console.error('Error deleting news:', error);
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
          placeholder="Content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <Input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          required
        />
        <Button type="submit">
          {editingId ? 'Update News' : 'Add News'}
        </Button>
        {editingId && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingId(null);
              setFormData({ title: '', content: '', image: '', author: '' });
            }}
          >
            Cancel Edit
          </Button>
        )}
      </form>

      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item._id} className="p-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600">By {item.author}</p>
            <p className="mt-2">{item.content}</p>
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="mt-2 max-w-xs rounded"
              />
            )}
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
