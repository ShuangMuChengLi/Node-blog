var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/content.jsp", function(req, res, next) {
    res.render("content", { title: "Express" });
});

module.exports = router;
