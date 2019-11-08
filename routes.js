const express = require("express");
const router = express.Router();
const db = require("./db/index.js");

router.get("/test", (req, res) => {
	console.log("test controler!");
	db.testFunction();
});

router.get("/:product_id/list", (req, res) => {
	res.send(req.params.product_id);
});

router.get("/:product_id/meta", (req, res) => {});

router.post("/:product_id", (req, res) => {});

router.put("/helpful/:review_id", (req, res) => {});

router.put("/report/:review_id", (req, res) => {});

module.exports = router;
