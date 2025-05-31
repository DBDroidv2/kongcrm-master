import { z } from 'zod';
import { NextResponse } from 'next/server';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['lead', 'prospect', 'customer', 'inactive']),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string()).optional(),
  nextFollowUp: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const activitySchema = z.object({
  customer: z.string().min(1, 'Customer ID is required'),
  type: z.enum(['note', 'call', 'email', 'meeting', 'task', 'status_change']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']),
  dueDate: z.string().datetime().optional(),
});

type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  response: NextResponse;
};

export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await request.clone().json();
    const validatedData = await schema.parseAsync(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err: z.ZodError['errors'][number]) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return { 
        success: false, 
        response: NextResponse.json(
          { success: false, error: errors },
          { status: 400 }
        )
      };
    }
    return { 
      success: false, 
      response: NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    };
  }
}
