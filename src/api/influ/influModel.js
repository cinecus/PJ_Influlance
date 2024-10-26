const { InfluSchema } = require('./influSchema')
const { JobSchema } = require('./influSchema');
const Influencer = require('./influSchema');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt'); // เพิ่มบรรทัดนี้


const ObjectId = mongoose.Types.ObjectId

class InfluModel {
    async findOneInflu(obj) {
        const result = await InfluSchema.findOne(obj)
        return result
    }

    async insertInflu(obj) {
        const result = await InfluSchema.create(obj)
        return result
    }
    async getProfile(email) {
        try {
            const profile = await InfluSchema.findOne({ email });
            return profile;
        } catch (error) {
            throw new Error("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
        }
    }

    async login(email, password) {
        try {
            const influencer = await InfluSchema.findOne({ email });
            if (!influencer) {
                throw new Error("ไม่พบผู้ใช้งาน");
            }

            // ตรวจสอบรหัสผ่าน
            const isMatch = await bcrypt.compare(password, influencer.password);
            if (!isMatch) {
                throw new Error("รหัสผ่านไม่ถูกต้อง");
            }

            return influencer; // ส่งคืนข้อมูล influencer หากล็อกอินสำเร็จ
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async addPortfolio(email, portfolioData) {
        try {
            const influencer = await InfluSchema.findOne({ email });
            if (!influencer) {
                throw new Error("ไม่พบผู้ใช้");
            }

            // เพิ่มข้อมูลพอร์ตโฟลิโอใหม่เข้าไปในฟิลด์ portfolio
            influencer.portfolio.push(portfolioData);
            await influencer.save();

            return { success: true, message: "เพิ่มพอร์ตโฟลิโอสำเร็จ" };
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async getPortfolio(email) {
        try {
            const influencer = await InfluSchema.findOne({ email }).select('portfolio');
            return influencer ? influencer.portfolio : null;
        } catch (error) {
            throw new Error("ไม่สามารถดึงข้อมูลพอร์ตโฟลิโอได้");
        }
    }

    async getJobs() {
        try {
            const jobs = await JobSchema.find({});
            return jobs;
        } catch (error) {
            console.error("Error in getJobs:", error.message); // แสดงข้อความของข้อผิดพลาด
            console.error(error); 
            throw new Error("ไม่สามารถดึงข้อมูลงานได้");
        }
    }
    async enrollJob(email, jobID) {
        try {
            const influencer = await InfluSchema.findOne({ email });

            if (!influencer) {
                throw new Error("ไม่พบผู้ใช้");
            }

            // ตรวจสอบว่า jobID นี้มีอยู่ใน enrolledJobs หรือยัง
            if (influencer.enrolledJobs.includes(jobID)) {
                throw new Error("ลงทะเบียนงานนี้แล้ว");
            }

            // เพิ่ม jobID ใน enrolledJobs
            influencer.enrolledJobs.push(jobID);
            await influencer.save();

            return { success: true, message: "ลงทะเบียนสำเร็จ" };
        } catch (error) {
            throw new Error(error.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
        }
    }
}


module.exports = new InfluModel()

