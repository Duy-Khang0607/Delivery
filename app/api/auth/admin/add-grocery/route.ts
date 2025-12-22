import { auth } from "@/app/auth";
import uploadOnCloudinary from "@/app/lib/cloudinary";
import connectDB from "@/app/lib/db";
import Grocery from "@/app/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        // Connect DB
        await connectDB();

        // Check if user is authenticated
        const session = await auth();
        if (!session || session?.user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        // Get body
        const formData = await req.formData();
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const unit = formData.get('unit') as string;
        const price = formData.get('price') as string;
        const file = formData.get('image') as Blob | null;

        let imageUrls;
        if(file){
            imageUrls = await uploadOnCloudinary(file);
            if(!imageUrls){
                return NextResponse.json({ success: false, message: 'Failed to upload image' }, { status: 400 });
            }
        }

        // Create grocery
        const grocery = await Grocery.create({ name, category, price, unit, image: imageUrls });

        return NextResponse.json({ success: true, message: 'Grocery created successfully', grocery }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Add grocery failed' }, { status: 500 });
    }
}