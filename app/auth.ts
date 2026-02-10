/**
 * FILE AUTH.TS - CẤU HÌNH NEXTAUTH CHO ỨNG DỤNG
 * 
 * LUỒNG HOẠT ĐỘNG KHI USER ĐĂNG NHẬP:
 * 1. User nhập email/password → submit form
 * 2. NextAuth gọi authorize() để xác thực
 * 3. authorize() kiểm tra user trong DB → return user object
 * 4. jwt callback được gọi → thêm data vào JWT token
 * 5. Token được mã hóa và lưu vào cookie
 * 6. Khi client gọi useSession() → session callback được gọi
 * 7. session callback lấy data từ token → trả về session object
 * 
 * CÁCH SỬ DỤNG:
 * - Server Component: const session = await auth()
 * - Client Component: const { data: session } = useSession()
 * - API Route: const session = await auth()
 * - Đăng nhập: await signIn("credentials", { email, password })
 * - Đăng xuất: await signOut()
 */

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db";
import bcrypt from "bcryptjs";
import User from "./models/user.model";
import Google from "next-auth/providers/google";

// Cấu hình NextAuth với các hàm handlers, signIn, signOut, auth
export const { handlers, signIn, signOut, auth } = NextAuth({
    // PROVIDERS: Định nghĩa các phương thức đăng nhập (Google, Facebook, Credentials...)
    providers: [
        // Credentials Provider: Đăng nhập bằng email/password tự quản lý
        Credentials({
            // Định nghĩa các trường input sẽ hiển thị trên form đăng nhập
            credentials: {
                email: {
                    type: "email",
                    label: "Email"
                },
                password: {
                    type: "password",
                    label: "Password",
                },
            },
            // authorize: Hàm xác thực user khi đăng nhập
            // - Được gọi khi user submit form login
            // - Return user object nếu đăng nhập thành công, null nếu thất bại
            authorize: async (credentials) => {
                try {
                    // 1. Kết nối database
                    await connectDB();

                    // 2. Lấy email và password từ form
                    const { email, password } = credentials as { email: string, password: string };

                    // 3. Tìm user trong database theo email
                    const user = await User.findOne({ email });
                    if (!user) {
                        return null; // Return null thay vì throw error
                    }

                    // 4. So sánh password với password đã hash trong database
                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) {
                        return null; // Return null thay vì throw error
                    }

                    // 5. Return user nếu đăng nhập thành công
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    // Chỉ log lỗi hệ thống thực sự (DB error, etc.)
                    console.error("❌ Auth error:", error);
                    return null;
                }
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    // CALLBACKS: Các hàm được gọi tự động tại các thời điểm khác nhau trong quá trình authentication
    callbacks: {
        // Signin
        async signIn({ user, account }) {
            if (account?.provider == 'google') {
                // Connect DB
                await connectDB();
                // find email in database
                let dbUser = await User.findOne({ email: user.email });
                if (!dbUser) {
                    // create user
                    dbUser = await User.create({ email: user.email, name: user.name, image: user.image });
                }

                user.id = dbUser._id.toString();
                user.role = dbUser.role;
            }
            return true;
        },

        // jwt callback: Được gọi KHI TẠO hoặc CẬP NHẬT JWT token
        // - Chạy ngay sau khi user đăng nhập thành công (authorize return user)
        // - Mục đích: Thêm thông tin custom vào JWT token (id, role, ...)
        // - Token này được mã hóa và lưu trên client (cookie)
        jwt: ({ token, user }) => {
            // Chỉ khi đăng nhập lần đầu (user có giá trị)
            if (user) {
                token.id = user.id as string;
                token.name = user.name as string;
                token.email = user.email as string;
                token.role = user.role as string; // Thêm role để phân quyền
            }
            return token;
        },

        // session callback: Được gọi KHI LẤY SESSION từ client
        // - Chạy mỗi khi gọi useSession() hoặc getSession()
        // - Mục đích: Đưa data từ JWT token vào session object
        // - Session này được trả về cho client để sử dụng trong components
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string; // Client có thể truy cập session.user.role
            }
            return session;
        }
    },
    // PAGES: Custom URL cho các trang authentication
    pages: {
        signIn: "/login",  // Redirect đến trang /login khi cần đăng nhập
        error: "/login"    // Redirect đến trang /login khi có lỗi xảy ra
    },

    // SESSION: Cấu hình session
    session: {
        strategy: "jwt",  // Sử dụng JWT thay vì database sessions (nhẹ hơn, không cần query DB)
        maxAge: 30 * 24 * 60 * 60, // Thời gian sống của session: 30 ngày (tính bằng giây)
    },

    // SECRET: Key bí mật để mã hóa JWT token (BẮT BUỘC phải có trong .env)
    secret: process.env.NEXTAUTH_SECRET,
}) 