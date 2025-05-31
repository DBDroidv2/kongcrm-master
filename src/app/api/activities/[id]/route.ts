import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Activity from '@/models/Activity';
import { validateRequest, activitySchema } from '@/lib/validation';

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
    const activity = await Activity.findById(params.id).populate('customer', 'name email company');
    
    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: activity });
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
    // Validate request data
    const validation = await validateRequest(request, activitySchema);
    if (!validation.success) {
      return validation.response;
    }
    
    await connectDB();
    const data = validation.data;
    
    const activity = await Activity.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('customer', 'name email company');

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      );
    }

    // If completing an activity, set completedAt
    if (data.status === 'completed' && !activity.completedAt) {
      activity.completedAt = new Date();
      await activity.save();
    }

    return NextResponse.json({ success: true, data: activity });
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
    
    const activity = await Activity.findByIdAndDelete(params.id);
    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
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
