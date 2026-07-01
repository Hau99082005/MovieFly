const Comment = require("../models/comments");

const getAllComments = async (req, res) => {
  try {
    const { movieId, episodeId, userId, status } = req.query;

    const filter = {};
    if (movieId) filter.movieId = movieId;
    if (episodeId) filter.episodeId = episodeId;
    if (userId) filter.userId = userId;
    if (status) filter.status = status;

    const comments = await Comment.find(filter)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber")
      .populate("parentId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: comments,
      total: comments.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getCommentsByMovieId = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { status = "approved" } = req.query;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    const comments = await Comment.find({
      movieId,
      status,
      parentId: null,
    })
      .populate("userId", "username avatar_url")
      .sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id,
          status,
        })
          .populate("userId", "username avatar_url")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      }),
    );

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: commentsWithReplies,
      total: commentsWithReplies.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getCommentsByEpisodeId = async (req, res) => {
  try {
    const { episodeId } = req.params;
    const { status = "approved" } = req.query;

    if (!episodeId) {
      return res.status(400).json({ message: "Episode ID is required" });
    }

    const comments = await Comment.find({
      episodeId,
      status,
      parentId: null,
    })
      .populate("userId", "username avatar_url")
      .sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentId: comment._id,
          status,
        })
          .populate("userId", "username avatar_url")
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      }),
    );

    return res.status(200).json({
      message: "Comments retrieved successfully",
      data: commentsWithReplies,
      total: commentsWithReplies.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber")
      .populate("parentId");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
      message: "Comment retrieved successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { userId, movieId, episodeId, parentId, content } = req.body;

    if (!userId || !movieId || !content) {
      return res.status(400).json({
        message: "userId, movieId and content are required",
      });
    }

    if (content.trim().length === 0) {
      return res.status(400).json({
        message: "Content cannot be empty",
      });
    }

    const commentData = {
      userId,
      movieId,
      content: content.trim(),
      status: "approved",
    };

    if (episodeId) commentData.episodeId = episodeId;
    if (parentId) commentData.parentId = parentId;

    const newComment = new Comment(commentData);
    const savedComment = await newComment.save();

    const populatedComment = await Comment.findById(savedComment._id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber")
      .populate("parentId");

    return res.status(201).json({
      message: "Comment created successfully",
      data: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, status } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const updateData = {};

    if (content !== undefined) {
      if (content.trim().length === 0) {
        return res.status(400).json({
          message: "Content cannot be empty",
        });
      }
      updateData.content = content.trim();
    }

    if (status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }
      updateData.status = status;
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber")
      .populate("parentId");

    return res.status(200).json({
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await Comment.deleteMany({ parentId: id });

    await Comment.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Comment and its replies deleted successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { $inc: { like_count: 1 } },
      { new: true },
    )
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
      message: "Comment liked successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.like_count > 0) {
      comment.like_count -= 1;
      await comment.save();
    }

    const populatedComment = await Comment.findById(id)
      .populate("userId", "username avatar_url")
      .populate("movieId", "title")
      .populate("episodeId", "title episodeNumber");

    return res.status(200).json({
      message: "Comment unliked successfully",
      data: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true },
    )
      .populate("userId", "username avatar_url")
      .populate("movieId", "title");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
      message: "Comment approved successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const rejectComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true },
    )
      .populate("userId", "username avatar_url")
      .populate("movieId", "title");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({
      message: "Comment rejected successfully",
      data: comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
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
};
