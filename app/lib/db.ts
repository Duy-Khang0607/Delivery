import mongoose from 'mongoose';

const MONGOOSE_CONNECTION = process.env.MONGOOSE_CONNECTION;

if (!MONGOOSE_CONNECTION) {
  throw new Error('Vui lòng định nghĩa biến môi trường MONGOOSE_CONNECTION trong file .env');
}

/**
 * Global được sử dụng để cache connection trong development mode.
 * Điều này ngăn chặn việc tạo nhiều kết nối do hot reloading.
 */
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGOOSE_CONNECTION as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Lỗi kết nối MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;

