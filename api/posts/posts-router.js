// implement your posts router here
const express = require("express");
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

router.post("/", async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    try {
      const { id } = await Posts.insert(req.body);
      const post = await Posts.findById(id);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({
        message: "There was an error while saving the post to the database",
      });
    }
  }
});

router.put("/:id", async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    try {
      const post = await Posts.findById(req.params.id);
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        await Posts.update(req.params.id, req.body);
        const post = await Posts.findById(req.params.id);
        res.status(200).json(post);
        // res.status(200).json({id: req.params.id, ...req.body});
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "The post information could not be modified" });
    }
  }
});

module.exports = router;
