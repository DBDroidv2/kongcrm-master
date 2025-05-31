// Test script for CRM API endpoints
async function testAPI() {
  const BASE_URL = 'http://localhost:3000/api';

  // Helper function for making requests
  async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    return response.json();
  }

  try {
    // 1. Create a customer
    console.log('\n1. Creating a customer...');
    const customerData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: 'Acme Inc',
      status: 'lead',
      tags: ['important', 'new'],
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      }
    };

    const createCustomerResult = await fetchAPI('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    console.log('Create customer result:', createCustomerResult);
    const customerId = createCustomerResult.data._id;

    // 2. Create an activity for the customer
    console.log('\n2. Creating an activity...');
    const activityData = {
      customer: customerId,
      type: 'call',
      title: 'Initial Contact',
      description: 'First call with the customer',
      status: 'completed'
    };

    const createActivityResult = await fetchAPI('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
    console.log('Create activity result:', createActivityResult);

    // 3. Get customer with recent activities
    console.log('\n3. Getting customer details...');
    const customerDetails = await fetchAPI(`/customers/${customerId}`);
    console.log('Customer details:', customerDetails);

    // 4. Search customers
    console.log('\n4. Searching customers...');
    const searchResult = await fetchAPI('/customers?search=john&status=lead');
    console.log('Search results:', searchResult);

    // 5. Update customer
    console.log('\n5. Updating customer...');
    const updateData = {
      ...customerData,
      status: 'prospect',
      tags: [...customerData.tags, 'qualified']
    };

    const updateResult = await fetchAPI(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    console.log('Update result:', updateResult);

    // 6. List activities
    console.log('\n6. Listing activities...');
    const activities = await fetchAPI('/activities?customerId=' + customerId);
    console.log('Activities:', activities);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
testAPI();
