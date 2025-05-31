"use client";

import { useState, useEffect } from 'react';
import ActivityForm from '@/components/ActivityForm';
import { Activity, ActivityFormData } from '@/types';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      if (data.success) {
        setActivities(data.data);
      } else {
        setError('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (formData: ActivityFormData): Promise<void> => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create activity');
      }

      if (data.success) {
        await fetchActivities(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to create activity');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create activity');
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchActivities(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete activity');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      setError('Error deleting activity');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Activities</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Add Activity
        </button>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${activity.type === 'call' ? 'bg-blue-100 text-blue-800' : ''}
                      ${activity.type === 'email' ? 'bg-green-100 text-green-800' : ''}
                      ${activity.type === 'meeting' ? 'bg-purple-100 text-purple-800' : ''}
                      ${activity.type === 'task' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${activity.type === 'note' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{activity.customer.name}</div>
                    <div className="text-sm text-gray-500">{activity.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${activity.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {}} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteActivity(activity._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onSubmit={handleCreateActivity}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
