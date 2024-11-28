const express = require("express");
const commentsRouter = express.Router();

const { deleteComment } = require("../controllers/delete-controllers");
const { patchComment } = require("../controllers/patch-controllers");

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
