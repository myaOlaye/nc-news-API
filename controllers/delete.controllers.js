const {
  removeComment,
  checkCommentExists,
} = require("../models/delete-models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [checkCommentExists(comment_id), removeComment(comment_id)];

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
