const router = require("express").Router();
const {
  getAllComments,
  getCommentsByMovieId,
  getCommentsByEpisodeId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
  approveComment,
  rejectComment,
} = require("../controllers/comments");

router.get("/", getAllComments);
router.get("/movie/:movieId", getCommentsByMovieId);
router.get("/episode/:episodeId", getCommentsByEpisodeId);
router.get("/:id", getCommentById);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);
router.patch("/:id/like", likeComment);
router.patch("/:id/unlike", unlikeComment);
router.patch("/:id/approve", approveComment);
router.patch("/:id/reject", rejectComment);

module.exports = router;
