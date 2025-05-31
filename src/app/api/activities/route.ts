import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import Customer from '@/models/Customer';
import { validateRequest, activitySchema } from '@/lib/validation';
import { ActivityDataForDb } from '@/types'; // Import the new interface

interface ActivityQuery {
  customer?: string;
  type?: string;
  status?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();

    const query: ActivityQuery = {};
    if (customerId) query.customer = customerId;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await Activity.countDocuments(query);
    
    const activities = await Activity.find(query)
      .populate('customer', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Validate request data
    const validation = await validateRequest(request, activitySchema);
    if (!validation.success) {
      return validation.response;
    }

    await connectDB();
    const validatedData = validation.data;

    // Prepare activity data, converting dueDate to a Date object if it exists
    const activityData: ActivityDataForDb = {
      ...validatedData, // Copy all properties from validatedData
      dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined, // Explicitly convert dueDate
    };

    // Verify customer exists
    const customer = await Customer.findById(activityData.customer);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Create activity
    const activity = await Activity.create(activityData);
    await activity.populate('customer', 'name email company');

    // Update customer's lastInteraction
    if (activityData.type !== 'status_change') { // Use activityData.type
      await Customer.findByIdAndUpdate(activityData.customer, { // Use activityData.customer
        lastInteraction: new Date(),
      });
    }

    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Server Error' },
      { status: 500 }
    );
  }
}
