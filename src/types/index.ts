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
  _id?: string; // Add optional _id for editing existing activities
  customer: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'status_change';
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  dueDate?: string;
}

// Interface for activity data as it's prepared for the database (after date conversion)
export interface ActivityDataForDb extends Omit<ActivityFormData, 'dueDate'> {
  dueDate?: Date;
}
