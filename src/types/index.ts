export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  notes: string;
  createdAt: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  notes: string;
}

export interface Activity {
  _id: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'status_change';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ActivityFormData {
  customer: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'status_change';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
}
