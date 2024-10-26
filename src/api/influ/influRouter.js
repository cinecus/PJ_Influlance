const { Router } = require('express')
const influController = require('./influController')
const influRouter = Router()

influRouter.post('/register', influController.register)
influRouter.post('/login', influController.login);
influRouter.get('/get_profile', influController.getProfile)
influRouter.post('/add_portfolio', influController.addPortfolio)
influRouter.get('/get_portfolio', influController.getPortfolio);//ถ้าไม่มมีข้อมูลจะโชว์แบบนี้ไม่แน่ใจว่่าถูกไหม{"success":true,"data":[]}
influRouter.get('/jobs', influController.getJobs);
influRouter.post('/enroll_job', influController.enrollJob);

module.exports = influRouter