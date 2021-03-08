const express = require("express");
const postsRouter = express.Router();
const { getAllPosts, createPost } = require("../db");
const { requireUser } = require('./utils');
postsRouter.use((req, res, next) => {
	console.log("A request is being made to /users");

	next();
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData = {};
    const { user:{id,name,username} } = req; 
    // only send the tags if there are some to send
    if (tagArr.length) {
      postData.tags = tagArr;
    }
  
    try {
        if(title && content){
            postData.authorId = id;
            postData.title = title;
            postData.content = content;
            const post = await createPost(postData);
            if(post.title){
               res.send(post); 
            }
        } else {
            next({name:'InsuffianctDataError',message:'please ensure that both the title and content contain data'});
        }
    } catch ({ name, message }) {
      next({ name, message });
    }
});

postsRouter.get("/", async (req, res) => {
	const posts = await getAllPosts();

	res.send({
		posts,
	});
});

module.exports = {
	postsRouter,
};
