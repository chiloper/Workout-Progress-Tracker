import * as dotenv from 'dotenv';
import * as path from 'path';

// ชี้ไปยังไฟล์ env ที่คุณต้องการใช้ทดสอบ
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
