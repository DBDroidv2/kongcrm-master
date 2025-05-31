"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Customer {
  _id: string;
  status: string;
}

interface Activity {
  _id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  tasksToday: number;
  recentActivities: Array<Activity>;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeLeads: 0,
    tasksToday: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [customersResponse, activitiesResponse] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/activities')
      ]);

      const customersData = await customersResponse.json();
      const activitiesData = await activitiesResponse.json();

      if (customersData.success && customersData.data) {
        const customers = customersData.data as Customer[];
        const activities = activitiesData.data as Activity[];
        
        setStats({
          totalCustomers: customers.length,
          activeLeads: customers.filter((c: Customer) => c.status === 'lead').length,
          tasksToday: activities.filter(
            (a: Activity) => a.type === 'task' && a.status === 'pending'
          ).length,
          recentActivities: activities.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
          <p className="text-2xl font-semibold mt-2">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Leads</h3>
          <p className="text-2xl font-semibold mt-2">{stats.activeLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Tasks Due Today</h3>
          <p className="text-2xl font-semibold mt-2">{stats.tasksToday}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-6">
            {stats.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full 
                        ${activity.type === 'call' ? 'bg-blue-100 text-blue-500' : ''}
                        ${activity.type === 'email' ? 'bg-green-100 text-green-500' : ''}
                        ${activity.type === 'meeting' ? 'bg-purple-100 text-purple-500' : ''}
                        ${activity.type === 'task' ? 'bg-yellow-100 text-yellow-500' : ''}
                      `}>
                        {activity.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/customers')} 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add New Customer
            </button>
            <button 
              onClick={() => router.push('/activities')} 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Task
            </button>
            <button 
              onClick={() => router.push('/activities')} 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
