import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';
import Activity from '@/models/Activity';
import { validateRequest, customerSchema } from '@/lib/validation';

interface MongooseError extends Error {
  name: string;
  errors?: {
    [key: string]: {
      message: string;
    };
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get recent activities for this customer
    const activities = await Activity.find({ customer: params.id })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({ 
      success: true, 
      data: {
        customer,
        recentActivities: activities
      }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const validation = await validateRequest(request, customerSchema);
    if (!validation.success) {
      return validation.response;
    }
    
    const data = validation.data;
    const oldCustomer = await Customer.findById(params.id);
    if (!oldCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = await Customer.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    // Track status change in activities
    if (oldCustomer.status !== customer.status) {
      await Activity.create({
        customer: customer._id,
        type: 'status_change',
        title: 'Status Updated',
        description: `Customer status changed from ${oldCustomer.status} to ${customer.status}`,
        status: 'completed',
        completedAt: new Date()
      });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    const err = error as MongooseError;
    
    if (err.name === 'ValidationError' && err.errors) {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return NextResponse.json(
        { success: false, error: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // First delete all activities associated with this customer
    await Activity.deleteMany({ customer: params.id });
    
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}
