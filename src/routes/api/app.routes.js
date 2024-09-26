const express = require('express');
const { createTender, getTenders, getActiveTenders } = require('../../controller/tenderManagement/tenderManagement');
const { getBidsByTender, submitBid } = require('../../controller/bidsManagement/bidsManagement');
const validateAccessToken = require('../../middleware/validation');
const roleCheck = require("../../middleware/roleCheck")
const router = express.Router();


// User controller imports

const loginUser = require("../../controller/userManagement/login");
const logoutUser = require('../../controller/userManagement/logout');

// User routes

router.post("/auth/login",loginUser);
router.delete("/auth/logout",validateAccessToken,logoutUser)



// Tender routes by /admin this are the admin routes

router.post('/admin/tender', validateAccessToken,(req,res,next)=>roleCheck(req, res, next, ["admin"]), createTender); 
router.get('/admin/tenders', validateAccessToken,(req,res,next)=>roleCheck(req, res, next, ["admin"]),getTenders); // All tender can see admin
router.get('/user/tenders/active',validateAccessToken, getActiveTenders); // for users

// Bids routes /user means user routes

router.post("/user/bid",validateAccessToken, submitBid) 
router.get('/admin/bids/:tenderId', validateAccessToken, (req, res, next) => roleCheck(req, res, next, ["admin"]),getBidsByTender); 






module.exports = router;
