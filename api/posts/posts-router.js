// implement your posts router here
const express = require("express");
const { useStore } = require("react-redux");
const Posts = require("./posts-model");
const router = express.Router();

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    !post
      ? res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" })
      : res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be retrieved" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    !post
      ? res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" })
      : await Posts.remove(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

module.exports = router;
