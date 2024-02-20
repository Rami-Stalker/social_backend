const meetingController = require("../controllers/meeting.controller");

const express = require("express");
const router = express.Router();

router.post("/start", meetingController.startMeeting);
router.get("/join", meetingController.checkMeetingExists);

router.get("/get", meetingController.getAllMeetingUsers);

module.exports = router;
