const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.service");

describe("Tester API articles", () => {
  let token;
  const USER_ID = "fakeUserId";
  const ADMIN_ID = "fakeAdminId";
  const ARTICLE_ID = "fakeArticleId";
  const MOCK_USER = {
    _id: USER_ID,
    name: "morgane",
    email: "morgane@gmail.com",
    password: "azerty123",
    role: "member"
  };
  const MOCK_ADMIN = {
    _id: ADMIN_ID,
    name: "antoine",
    email: "antoine@gmail.com",
    password: "qsdf456",
    role: "admin"
  };
  const MOCK_ARTICLES = [
    {
      _id: ARTICLE_ID,
      title: "Mon Article",
      content: "Contenu de mon article",
      user: USER_ID,
      status: "published"
    }
  ];
  const MOCK_ARTICLE_CREATED = {
    title: "Mon Nouvel Article",
    content: "Contenu de mon nouvel article",
    user: USER_ID,
    status: "draft"
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    const adminToken = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);

    mockingoose(Article).toReturn(MOCK_ARTICLES, "find");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findOneAndUpdate");
    mockingoose(Article).toReturn({}, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const adminToken = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({ title: "Updated Article Title" })
      .set("x-access-token", adminToken);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Article Title");
  });

  test("[Articles] Delete Article", async () => {
    const adminToken = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", adminToken);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
