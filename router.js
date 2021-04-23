const express = require("express");
const router = express.Router();
const YouTube = require("youtube-sr").default;

router.get("/", (req, res) => {
  res.send({ response: "Server is up and running." }).status(200);
});

router.post("/search", (req, res) => {
    const { query } = req.body

    YouTube.search( query )
    .then( x => {
        return res.json({ success: true, result: x });
    })
    .catch( err => {
        return res.status(404).json({ success: false, err: err })
    });

})

router.get('/try', (req,res) => {
    return res.json({"asdf": "adsfsdf"})
})

module.exports = router;