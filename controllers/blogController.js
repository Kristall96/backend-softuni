import Blog from "../models/Blog.js";

// Create a blog post
export const createBlog = async (req, res) => {
  const { title, content, image, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const blog = new Blog({
      title,
      content,
      image,
      tags,
      author: req.user._id,
    });

    await blog.save();
    res.status(201).json({ message: "Blog created", blog });
  } catch (error) {
    console.error("Blog create error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
