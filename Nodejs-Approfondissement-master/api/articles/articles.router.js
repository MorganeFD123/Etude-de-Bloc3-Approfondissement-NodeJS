const express = require("express");
const articlesController = require("./articles.controller");
const router = express.Router();

router.post("/", articlesController.create);
router.put("/:id", articlesController.update);
router.delete("/:id", articlesController.delete);
router.get("/users/:userId", articlesController.getByUser);

module.exports = router;
