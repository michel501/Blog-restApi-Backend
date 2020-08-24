const Post = require("../models/post_model");
const Comment = require("../models/comment_model");

/**
 * ------- Post APIs -------
 */

/**
 * Get - avoir toutes les posts
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPosts = function (req, res, next) {
  Post.find({})
    .select({})
    .limit(100)
    .sort({
      time: -1,
    }) // command mongo pour tout
    .exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve posts.",
        });
      } // handle error 
      res.json(posts); // nous retourne ceux dont nous avons besoin
    });
};

/**
 * Create - nouvel post
 *
 * @param req
 * @param res
 * @param next
 */
exports.createPost = function (req, res, next) {

  const title = req.body.title;
  const categories = req.body.categories;
  const content = req.body.content;
  const time = Date.now();

  // Make sure title, categories and content are not empty
  if (!title || !categories || !content) {
    return res.status(422).json({
      message: "Title, categories and content are all required.",
    });
  }

  // Créer nouvel post
  const post = new Post({
    title: title,
    categories: categories.split(",").map((item) => item.trim()), // remove leading and trailing spaces, remove duplicate categories
    content: content,
    time: time,
  });

  // Save the post
  post.save(function (err, post) {
    // callback function
    if (err) {
      return next(err);
    }
    res.json(post); // return the created post
  });
};

/**
 * Fetch a single post by post ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPost = function (req, res, next) {
  Post.findById(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve the post with the given post ID.",
        });
      }
      if (!post) {
        return res.status(404).json({
          message: "Error! The post with the given ID is not exist.",
        });
      }
      res.json(post); // return the single blog post
    }
  );
};

/**
 * Check if current post can be updated or deleted by the authenticated user: The author can only make change to his/her own posts
 *
 * @param req
 * @param res
 * @param next
 */
exports.allowUpdateOrDelete = function (req, res, next) {

  // Find the post by post ID
  Post.findById(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve the post with the given post ID.",
        });
      }

      // Check if the post exist
      if (!post) {
        return res.status(404).json({
          message: "Error! The post with the given ID is not exist.",
        });
      }

      console.log(user._id);
      console.log(post.authorId);

      // Check if the user ID is equal to the author ID
      if (!user._id.equals(post.authorId)) {
        return res.send({ allowChange: false });
      }
      res.send({ allowChange: true });
    }
  );
};

/**
 * Edit/Update a post
 *
 * @param req
 * @param res
 * @param next
 */
exports.updatePost = function (req, res, next) {

  // Find the post by post ID
  Post.findById(
    {
      _id: req.params.id,
    },
    function (err, post) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve the post with the given post ID.",
        });
      }

      // Check if the post exist
      if (!post) {
        return res.status(404).json({
          message: "Error! The post with the given ID is not exist.",
        });
      }

      // Make sure the user ID is equal to the author ID (Cause only the author can edit the post)
      if (!user._id.equals(post.authorId)) {
        return res.status(422).json({
          message: "Error! You have no authority to modify this post.",
        });
      }

      // Make sure title, categories and content are not empty
      const title = req.body.title;
      const categories = req.body.categories;
      const content = req.body.content;

      if (!title || !categories || !content) {
        return res.status(422).json({
          message: "Title, categories and content are all required.",
        });
      }

      // Update user
      post.title = title;
      (post.categories = categories.split(",").map((item) => item.trim())), // remove leading and trailing spaces, remove duplicate categories;
        (post.content = content);

      // Save user
      post.save(function (err, post) {
        if (err) {
          return next(err);
        }
        res.json(post); // return the updated post
      });
    }
  );
};

/**
 * Delete un post par post ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.deletePost = function (req, res, next) {
 
  // Delete post
  Post.findByIdAndRemove(req.params.id, function (err, post) {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res.status(422).json({
        message: "Error! The post with the given ID is not exist.",
      });
    }

    // Delete comments correspond to this post
    Comment.remove({ postId: post._id }, function (err) {
      if (err) {
        return next(err);
      }
    });

    // Return a success message
    res.json({
      message: "The post has been deleted successfully!",
    });
  });
};

/**
 * Fetch posts par author ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchPostsByAuthorId = function (req, res, next) {

  // Fetch posts par author ID
  Post.find({
    authorId: user._id,
  })
    .select({})
    .limit(100)
    .sort({
      time: -1,
    })
    .exec(function (err, posts) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve posts.",
        });
      }
      res.json(posts);
    });
};

/**
 * ------- Comment APIs -------
 */

/**
 * Create nouveau commentaire (besoin : post ID et user ID)
 *
 * @param req
 * @param res
 * @param next
 */
exports.createComment = function (req, res, next) {
  if (!user) {
    return res.status(422).json({
      message: "You must sign in before you can post new comment.",
    });
  }

  // Get post ID
  const postId = req.params.postId;

  // Get content et verifie si elle n'est pas vide
  const content = req.body.content;
  if (!content) {
    return res.status(422).json({
      message: "Comment cannot be empty.",
    });
  }

  // Create un nouveau comment
  const comment = new Comment({
    content: content,
    authorId: user._id,
    authorName: user.firstName + " " + user.lastName,
    postId: postId,
    time: Date.now(),
  });

  // Save comment
  comment.save(function (err, comment) {
    if (err) {
      return next(err);
    }
    res.json(comment); // return le commentaire créeé
  });
};

/**
 * Fetch commentaire pour un specifique blog post (post ID is needed)
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchCommentsByPostId = function (req, res, next) {
  Comment.find({
    postId: req.params.postId,
  })
    .select({})
    .limit(100)
    .sort({
      time: 1,
    }) // command mongo
    .exec(function (err, comments) {
      if (err) {
        console.log(err);
        return res.status(422).json({
          message: "Error! Could not retrieve comments.",
        });
      }
      res.json(comments);
    });
};
