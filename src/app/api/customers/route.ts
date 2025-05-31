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

interface CustomerQuery {
  $or?: Array<{[key: string]: RegExp}>;
  status?: string;
  company?: string;
  tags?: { $in: string[] };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const company = searchParams.get('company');
    const tags = searchParams.get('tags');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    await connectDB();

    // Build query
    const query: CustomerQuery = {};
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') }
      ];
    }
    
    if (status) query.status = status;
    if (company) query.company = company;
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (page - 1) * limit;
    const total = await Customer.countDocuments(query);
    
    const sortOptions: { [key: string]: 1 | -1 } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };

    const customers = await Customer.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: customers,
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
    await connectDB();
    const validation = await validateRequest(request, customerSchema);
    if (!validation.success) {
      return validation.response;
    }
    
    const data = validation.data;
    const customer = await Customer.create(data);

    // Create an initial activity for the new customer
    await Activity.create({
      customer: customer._id,
      type: 'status_change',
      title: 'Customer Created',
      description: `Customer status set to ${customer.status}`,
      status: 'completed',
      completedAt: new Date()
    });

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
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
