"use client";

import { useState, useEffect } from 'react';
import CustomerForm from '@/components/CustomerForm';
import EditCustomerForm from '@/components/EditCustomerForm';
import { Customer, CustomerFormData } from '@/types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (formData: CustomerFormData) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }

      if (data.success) {
        await fetchCustomers(); // Refresh the list
        return data;
      } else {
        throw new Error(data.error || 'Failed to create customer');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create customer');
    }
  };

  const handleUpdateCustomer = async (formData: CustomerFormData) => {
    if (!editingCustomer) return;

    try {
      const response = await fetch(`/api/customers/${editingCustomer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }

      if (data.success) {
        await fetchCustomers(); // Refresh the list
        setEditingCustomer(null);
        return data;
      } else {
        throw new Error(data.error || 'Failed to update customer');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchCustomers(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Error deleting customer');
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
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => setShowForm(true)}
        >
          Add Customer
        </button>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{customer.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${customer.status === 'lead' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${customer.status === 'prospect' ? 'bg-blue-100 text-blue-800' : ''}
                      ${customer.status === 'customer' ? 'bg-green-100 text-green-800' : ''}
                      ${customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingCustomer(customer)} 
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomer(customer._id)} 
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

      {/* Add Customer Modal */}
      {showForm && (
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <EditCustomerForm
          customer={editingCustomer}
          onSubmit={handleUpdateCustomer}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
}
