const Blog = require("../controllers/blog_controller");

module.exports = function (app) {
  /**
   * Blog Post APIs
   */

  app.get("/api/posts", Blog.fetchPosts); // get all posts (read)
  app.post("/api/posts", Blog.createPost); // add a post (create)
  app.get("/api/posts/:id", Blog.fetchPost); // get a specific post by id (read)
  app.get("/api/allow_edit_or_delete/:id", Blog.allowUpdateOrDelete);
  app.put("/api/posts/:id", Blog.updatePost); // update a specific post by id (update)
  app.delete("/api/posts/:id", Blog.deletePost); // delete a specific posts by id (delete)
  app.get("/api/my_posts", Blog.fetchPostsByAuthorId); // get posts by author

  /**
   * Blog Comment APIs
   */

  app.post("/api/comments/:postId", Blog.createComment); // create comments
  app.get("/api/comments/:postId", Blog.fetchCommentsByPostId); // get comments
};

// CRUD:
// - Create: http post request
// - Read: http get request
// - Update: http put request
// - Delete: http delete request
