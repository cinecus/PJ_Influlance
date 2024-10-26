const influModel = require('./influModel');
const InfluSchema = require('./influSchema').InfluSchema;
const bcrypt = require('bcrypt');

class InfluController {
    async register(req, res) {
        try {
            console.log('Received data:', req.body);

            const { email, password, firstName, lastName, tiktokLink, category, profileUrl, influInfo } = req.body;

            if (!email || !password || !firstName || !lastName || !Array.isArray(category)|| category.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "ข้อมูลที่จำเป็นไม่ครบถ้วน"
                });
            }

            // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
            const existingInflu = await InfluSchema.findOne({ email });
            if (existingInflu) {
                return res.status(400).json({
                    success: false,
                    message: "อีเมลนี้มีการลงทะเบียนแล้ว"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10); // ใช้ bcrypt เข้ารหัสรหัสผ่าน
            // สร้าง influencer ใหม่
            const newInflu = new InfluSchema({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                tiktokLink,
                category,
                profileUrl,
                influInfo
            });

            // บันทึก influencer ใหม่ในฐานข้อมูล
            await newInflu.save();

            return res.status(200).json({
                success: true,
                message: "ลงทะเบียนผู้ใช้สำเร็จ"
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "ข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }
    async getProfile(req, res) {
        try {
            const { email } = req.query; // ใช้ email ในการค้นหาผู้ใช้
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "โปรดระบุอีเมล"
                });
            }

            const profile = await influModel.getProfile(email);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "ไม่พบข้อมูลโปรไฟล์"
                });
            }

            // ส่งคืนข้อมูลโปรไฟล์
            return res.status(200).json({
                success: true,
                profile: {
                    email: profile.email,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    tiktokLink: profile.tiktokLink,
                    category: profile.category,
                    profileUrl: profile.profileUrl,
                    influInfo: profile.influInfo
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body; // รับข้อมูลจาก body

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "โปรดระบุอีเมลและรหัสผ่าน"
                });
            }

            const influencer = await influModel.login(email, password);

            // ส่งคืนข้อมูลผู้ใช้ที่ล็อกอิน
            return res.status(200).json({
                success: true,
                message: "เข้าสู่ระบบสำเร็จ",
                influencer: {
                    email: influencer.email,
                    firstName: influencer.firstName,
                    lastName: influencer.lastName,
                    tiktokLink: influencer.tiktokLink,
                    category: influencer.category,
                    profileUrl: influencer.profileUrl,
                    influInfo: influencer.influInfo
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                message: error.message // ส่งกลับข้อความที่เกิดข้อผิดพลาด
            });
        }
    }
    async addPortfolio(req, res) {
        try {
            const { email, title, description, imageUrl } = req.body;

            if (!email || !title || !description || !imageUrl) {
                return res.status(400).json({
                    success: false,
                    message: "กรุณาระบุข้อมูลให้ครบถ้วน"
                });
            }

            const portfolioData = { title, description, imageUrl };
            const response = await influModel.addPortfolio(email, portfolioData);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }

    async getPortfolio(req, res) {
        try {
            const { email } = req.query;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "โปรดระบุอีเมล"
                });
            }

            const portfolio = await influModel.getPortfolio(email);
            if (!portfolio) {
                return res.status(404).json({
                    success: false,
                    message: "ไม่พบข้อมูลพอร์ตโฟลิโอ"
                });
            }

            return res.status(200).json({
                success: true,
                data: portfolio
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }

    async getJobs(req, res) {
        try {
            const jobs = await influModel.getJobs();

            if (!jobs.length) {
                return res.status(404).json({
                    success: false,
                    message: "ไม่พบข้อมูลงาน"
                });
            }

            return res.status(200).json({
                success: true,
                data: jobs
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }
    
    async enrollJob(req, res) {
        try {
            const { email, jobID } = req.body;

            if (!email || !jobID) {
                return res.status(400).json({
                    success: false,
                    message: "โปรดระบุอีเมลและรหัสงาน"
                });
            }

            const response = await influModel.enrollJob(email, jobID);

            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์"
            });
        }
    }
}


module.exports = new InfluController();
