"use client";

import { useState, useEffect } from 'react';
import ActivityForm from '@/components/ActivityForm';
import { Activity, ActivityFormData } from '@/types';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityFormData | null>(null); // State to hold activity data for editing

  useEffect(() => {
    fetchActivities();
  }, []);

  // Function to open the form for adding a new activity
  const handleAddActivityClick = () => {
    setEditingActivity(null); // Clear any existing editing data
    setShowForm(true);
  };

  // Function to open the form for editing an activity
  const handleEditActivityClick = (activity: Activity) => {
    // Transform the Activity object to ActivityFormData for the form
    const formData: ActivityFormData = {
      ...activity,
      customer: activity.customer._id, // Use only the customer ID for the form
      // Ensure dueDate is in the correct format for datetime-local input if it exists
      dueDate: activity.dueDate ? new Date(activity.dueDate).toISOString().slice(0, 16) : undefined,
    };
    setEditingActivity(formData); // Set the transformed formData directly
    setShowForm(true);
  };

  // Function to close the form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActivity(null); // Clear editing data when form closes
  };

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

  // Handles the submission for creating a new activity
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
        // If response is not OK, throw an error with the message from the API
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to create activity');
      }

      if (data.success) {
        await fetchActivities(); // Refresh the list after successful creation
      } else {
        // If success is false, throw an error with the message from the API
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to create activity');
      }
    } catch (error) {
      // Catch and re-throw errors for the form to display
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create activity');
    }
  };

  // Handles the submission for updating an existing activity
  const handleUpdateActivity = async (id: string, formData: ActivityFormData): Promise<void> => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If response is not OK, throw an error with the message from the API
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to update activity');
      }

      if (data.success) {
        await fetchActivities(); // Refresh the list after successful update
      } else {
        // If success is false, throw an error with the message from the API
        throw new Error(data.error ? JSON.stringify(data.error) : 'Failed to update activity');
      }
    } catch (error) {
      // Catch and re-throw errors for the form to display
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to update activity');
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
        <button // Button to open the form for adding a new activity with 90's style
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 border-2 border-blue-800 shadow-md active:shadow-inner transition-all duration-150 font-bold"
          onClick={handleAddActivityClick}
        >
          Add Activity
        </button>
      </div>

      {/* Activities List with 90's table styling */}
      <div className="bg-gray-200 rounded-lg shadow-2xl overflow-hidden border-4 border-gray-700">
        <table className="min-w-full divide-y-4 divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider border-r-2 border-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider border-r-2 border-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider border-r-2 border-gray-500">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider border-r-2 border-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider border-r-2 border-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs font-extrabold text-cyan-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 divide-y-2 divide-gray-400">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-600 font-bold">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={activity._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}> {/* Alternating row colors */}
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-400">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border-2
                      ${activity.type === 'call' ? 'bg-blue-400 text-blue-900 border-blue-600' : ''}
                      ${activity.type === 'email' ? 'bg-green-400 text-green-900 border-green-600' : ''}
                      ${activity.type === 'meeting' ? 'bg-purple-400 text-purple-900 border-purple-600' : ''}
                      ${activity.type === 'task' ? 'bg-yellow-400 text-yellow-900 border-yellow-600' : ''}
                      ${activity.type === 'note' ? 'bg-gray-400 text-gray-900 border-gray-600' : ''}
                    `}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-400">
                    <div className="text-sm font-bold text-gray-900">{activity.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-400">
                    <div className="text-sm font-bold text-gray-900">{activity.customer.name}</div>
                    <div className="text-sm text-gray-600">{activity.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-400">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border-2
                      ${activity.status === 'pending' ? 'bg-yellow-400 text-yellow-900 border-yellow-600' : ''}
                      ${activity.status === 'completed' ? 'bg-green-400 text-green-900 border-green-600' : ''}
                      ${activity.status === 'cancelled' ? 'bg-red-400 text-red-900 border-red-600' : ''}
                    `}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800 border-r-2 border-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button // Button to open the form for editing an activity with 90's style
                      onClick={() => handleEditActivityClick(activity)} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md border-2 border-blue-800 shadow-md active:shadow-inner transition-all duration-150 font-bold mr-2"
                    >
                      Edit
                    </button>
                    <button // Button to delete an activity with 90's style
                      onClick={() => handleDeleteActivity(activity._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md border-2 border-red-800 shadow-md active:shadow-inner transition-all duration-150 font-bold"
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
      {/* Activity Form Modal (for both add and edit) */}
      {showForm && (
        <ActivityForm
          // Pass initialData if editing, otherwise null for adding
          initialData={editingActivity} 
          // Choose onSubmit handler based on whether it's an edit or add operation
          // Assert editingActivity._id as string since it will be present in edit mode
          onSubmit={editingActivity ? (formData) => handleUpdateActivity(editingActivity._id as string, formData) : handleCreateActivity}
          onClose={handleCloseForm} // Use the centralized close handler
        />
      )}
    </div>
  );
}
