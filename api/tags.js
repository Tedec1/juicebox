const express = require("express");
const tagsRouter = express.Router();
const { getAllTags,getPostsByTagName } = require("../db");
tagsRouter.use((req, res, next) => {
	console.log("A request is being made to /users");

	next();
});

tagsRouter.get("/", async (req, res) => {
	const tags = await getAllTags();

	res.send({
		tags,
	});
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
	const {tagName} = req.params;
	console.log(tagName);
	if(!tagName){
		next({message:'no tag name'})
	}
	try {
		let posts = await getPostsByTagName(tagName);
		posts = posts.filter(post => post.active || (req.user && post.author.id === req.user.id));
	  // use our method to get posts by tag name from the db
	  res.send({
		  posts
	})
	  // send out an object to the client { posts: // the posts }
	} catch ({ name, message }) {
	  next({name,message})
		// forward the name and message to the error handler
	}
  });

module.exports = {
	tagsRouter,
};
