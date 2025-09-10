/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; 
import CustomerModel from '@/models/customer';
import { customerSchema } from '@/lib/validations';
import { auth } from '@/auth';


export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect(); // Ensure database connection

    const body = await request.json();
    const validation = customerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, totalSpends, visitCount, lastActiveDate } = validation.data;

    // Check if customer with this email already exists
    const existingCustomer = await CustomerModel.findOne({ email });
    if (existingCustomer) {
      return NextResponse.json(
        { message: `Customer with email ${email} already exists.` },
        { status: 409 } // 409 Conflict
      );
    }

    // Create new customer
    const newCustomer = new CustomerModel({
      name,
      email,
      totalSpends,
      visitCount,
      lastActiveDate,
    });

    await newCustomer.save();

    return NextResponse.json(
      { message: "Customer created successfully", customer: newCustomer },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating customer:", error);
    // Handle specific Mongoose errors, e.g., duplicate key if unique index fails unexpectedly
    if (error.code === 11000) { // MongoDB duplicate key error
        return NextResponse.json(
            { message: `Customer with email ${error.keyValue.email} already exists (duplicate key).` },
            { status: 409 }
        );
    }
    return NextResponse.json(
      { message: "Failed to create customer", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    await dbConnect();

    // Get all customers
    const customers = await CustomerModel.find({}).sort({ createdAt: -1 });
    
    // Calculate some statistics
    const stats = {
      totalCustomers: customers.length,
      spendStats: {
        min: Math.min(...customers.map(c => c.totalSpends)),
        max: Math.max(...customers.map(c => c.totalSpends)),
        avg: customers.reduce((acc, c) => acc + c.totalSpends, 0) / customers.length
      },
      visitStats: {
        min: Math.min(...customers.map(c => c.visitCount)),
        max: Math.max(...customers.map(c => c.visitCount)),
        avg: customers.reduce((acc, c) => acc + c.visitCount, 0) / customers.length
      },
      spendDistribution: {
        under100: customers.filter(c => c.totalSpends < 100).length,
        under500: customers.filter(c => c.totalSpends >= 100 && c.totalSpends < 500).length,
        under1000: customers.filter(c => c.totalSpends >= 500 && c.totalSpends < 1000).length,
        over1000: customers.filter(c => c.totalSpends >= 1000).length
      }
    };

    return NextResponse.json({ customers, stats }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const deletedCustomer = await CustomerModel.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Customer deleted successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { message: "Failed to delete customer", error: error.message },
      { status: 500 }
    );
  }
}
