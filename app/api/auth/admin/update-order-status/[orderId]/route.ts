import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {


        

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Update status order failed !' }, { status: 500 });
    }
} 