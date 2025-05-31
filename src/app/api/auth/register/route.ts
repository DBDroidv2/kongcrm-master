import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

// Define Zod schema for registration input
const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 } // 409 Conflict
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12); // Using 12 salt rounds

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Return success response (excluding password)
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return NextResponse.json(
      { message: 'User registered successfully', user: userResponse },
      { status: 201 } // 201 Created
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    // Check for specific ZodError for better error messages if validation.success was somehow bypassed (should not happen)
    if (error instanceof z.ZodError) {
        return NextResponse.json(
            {
              message: 'Validation error during processing.',
              errors: error.flatten().fieldErrors,
            },
            { status: 400 }
          );
    }
    return NextResponse.json(
      { message: 'An unexpected error occurred', error: error.message },
      { status: 500 }
    );
  }
}
