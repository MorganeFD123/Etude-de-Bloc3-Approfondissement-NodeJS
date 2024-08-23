const express = require("express");
const articlesController = require("./articles.controller");
const usersController = require("../users/users.controller");
const router = express.Router();

router.post("/", articlesController.create);
router.put("/:id", articlesController.update);
router.delete("/:id", articlesController.delete);
router.get("/users/:userId", usersController.getArticleByUser);

module.exports = router;
