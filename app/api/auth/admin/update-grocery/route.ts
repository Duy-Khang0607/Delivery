import { auth } from "@/app/auth";
import uploadOnCloudinary from "@/app/lib/cloudinary";
import connectDB from "@/app/lib/db";
import Grocery from "@/app/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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
        const _id = formData.get('_id') as string | undefined;
        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const unit = formData.get('unit') as string;
        const price = formData.get('price') as string;
        const file = formData.get('image') as Blob | null;

        let imageUrls;
        if (file) {
            imageUrls = await uploadOnCloudinary(file);
            if (!imageUrls) {
                return NextResponse.json({ success: false, message: 'Failed to upload image' }, { status: 400 });
            }
        }

        // Update grocery
        const grocery = await Grocery.findByIdAndUpdate(_id?.toString(), { name, category, price, unit, image: imageUrls }, { new: true });
        if (!grocery) {
            return NextResponse.json({ success: false, message: 'Grocery not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Grocery updated successfully', grocery: grocery }, { status: 200 });
    } catch (error) {
        console.error({ error })
        return NextResponse.json({ success: false, message: 'Update grocery failed' }, { status: 500 });
    }
}