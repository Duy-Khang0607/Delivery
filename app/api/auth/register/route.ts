import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/models/user.model';
import connectDB from '@/app/lib/db';
import bcrypt from 'bcryptjs';



// API Register
export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();
        // Connect DB
        await connectDB();

        // Kiểm tra name hoặc email đã tồn tại (trùng) thì trả về 400
        const existUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existUser) {
            return NextResponse.json({ success: false, message: 'Name or Email already exists' }, { status: 400 });
        }

        // Check if password is at least 6 characters long
        if (password?.length < 6) {
            return NextResponse.json({ success: false, message: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return NextResponse.json({ success: false, message: 'Failed to hash password' }, { status: 400 });
        }

        // Create new user
        const newUser = await User.create({ name, email, password: hashedPassword, role: "user" });
        if (!newUser) {
            return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: "User created successfully",user: newUser }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}