"use client";

import { useState, useEffect } from 'react';
import { Customer, ActivityFormData } from '@/types';

interface ActivityFormProps {
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onClose: () => void;
  initialData?: ActivityFormData | null; // Add initialData prop for editing
}

export default function ActivityForm({ onSubmit, onClose, initialData }: ActivityFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  // Initialize formData with initialData if provided, otherwise with default values
  const [formData, setFormData] = useState<ActivityFormData>(
    initialData || {
      customer: '',
      type: 'task',
      title: '',
      status: 'pending'
    }
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
        if (data.data.length > 0) {
          setFormData(prev => ({ ...prev, customer: data.data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // If the input is a datetime-local and has a value, format it to ISO string for Zod validation
    if (name === 'dueDate' && value) {
      // datetime-local inputs return YYYY-MM-DDTHH:MM. Zod's datetime expects YYYY-MM-DDTHH:MM:SS.sssZ
      // Append seconds, milliseconds, and Z (UTC) to make it a valid ISO string for Zod
      newValue = `${value}:00.000Z`;
    }

    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        [name]: newValue as ActivityFormData['type']
      }));
    } else if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        [name]: newValue as ActivityFormData['status']
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal container with 90's window styling
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md border-4 border-gray-700 shadow-2xl transform transition-all duration-300 scale-105">
        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-400 pb-2">
          <h2 className="text-xl font-bold text-gray-800 drop-shadow-sm">
            {initialData ? 'Edit Activity' : 'Add New Activity'} {/* Dynamic title */}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-red-600 text-2xl font-bold px-2 py-1 border-2 border-gray-500 bg-gray-300 hover:bg-red-200 shadow-md active:shadow-inner transition-all duration-150"
            title="Close"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded border-2 border-red-700 shadow-inner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Customer *
            </label>
            <select
              name="customer"
              required
              value={formData.customer}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Type *
            </label>
            <select
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              <option value="task">Task</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
              className="mt-1 block w-full border-2 border-gray-500 rounded-md shadow-inner p-2 bg-gray-100 text-gray-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button // Cancel button with 90's style
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-600 rounded-md text-gray-800 bg-gray-300 hover:bg-gray-400 shadow-md active:shadow-inner transition-all duration-150 font-bold"
            >
              Cancel
            </button>
            <button // Submit button with 90's style
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 border-2 border-blue-800 shadow-md active:shadow-inner transition-all duration-150 font-bold
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Activity' : 'Create Activity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
