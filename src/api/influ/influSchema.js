const mongoose = require('mongoose')
const moment = require('moment')
const bcrypt = require('bcrypt'); // เพิ่มบรรทัดนี้

// Review : ควรแยก file portfolioSchema ออกมาเป็นอีก file นึง => portfolioSchema.js
const portfolioSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: [String], required: true } // Array ของ string
});

const influSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  tiktokLink: { type: String },
  category: { type: [String], required: true }, 
  profileUrl: { type: String },
  influInfo: { type: String }, // Additional influencer info
  portfolio: { type: [portfolioSchema], default: [] }, // เก็บข้อมูลพอร์ตโฟลิโอของผู้ใช้
  enrolledJobs: { type: [Number], default: [] } // ฟิลด์สำหรับเก็บ jobID ที่ลงทะเบียนแล้ว
})

exports.InfluSchema = mongoose.model('Influencer', influSchema)

// Review : ควรแยก modules job ออกมาเป็นอีก folder นึง
const jobSchema = new mongoose.Schema({
    jobID: { type: Number, required: true, unique: true },
    marketerID: { type: Number, required: true },
    jobTitle: { type: String, required: true },
    jobDetail: { type: String, required: true },
    reward: { type: Number, required: true },
    dueDate: { type: String, required: true },
    pictureURL: { type: String, required: true }
});

exports.JobSchema = mongoose.model('Job', jobSchema)
 