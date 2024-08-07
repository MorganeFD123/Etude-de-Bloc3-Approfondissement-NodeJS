const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User not authenticated");
      }
      const articleData = {
        ...req.body,
        user: req.user._id,
      };
      const article = await articlesService.create(articleData);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError("User not authorized");
      }
      const id = req.params.id;
      const article = await articlesService.update(id, req.body);
      req.io.emit("article:update", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError("User not authorized");
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
