const express = require('express');
const apiRouter = express.Router();
const {postsRouter} = require('./posts');
const {usersRouter} = require('./users');
const {tagsRouter} = require('./tags');
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
module.exports = {
    apiRouter
};