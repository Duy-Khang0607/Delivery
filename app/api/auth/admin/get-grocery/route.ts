import connectDB from "@/app/lib/db";
import Grocery from "@/app/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB()

        const groceries = await Grocery?.find({}).lean()

        if (!groceries) {
            return NextResponse.json({ success: false, message: 'Not found groceries items' }, { status: 400 });
        }
        return NextResponse.json(groceries, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Get failed groceries items' }, { status: 500 });
    }
}