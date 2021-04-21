
const express = require("express");
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser')
const compression = require('compression');
const userAuth = require('./api/handler/user-handler').authUser;
app.use(express.static('static'))
app.use(cookieParser())
app.use(userAuth)
app.use(compression());//开启gzip压缩

//此处处理老版URL的301
app.use(function forceLiveDomain(req, res, next) {
  const url = req.originalUrl;
  const id = req.query.id;
  if(url.indexOf('/article-content')=== 0){
    //文章内容页
    return res.redirect(301, 'https://www.tech-share.cn/article/'+id);
  }
  next();
});

// render 函数
const renderArticleContent = require('./renders/article-content')
const renderArticleList = require('./renders/article-list')
const renderColumnList = require('./renders/column-list')
const renderSearchContent = require('./renders/search-content')
const renderHomeContent = require('./renders/home')
//专栏内容包括专栏介绍，封面以及包含地文章
const renderColumnContent = require('./renders/column-content')
const apiRouter = require('./api/index')

//首页,选取最新的10篇文章或专栏
app.get('/',renderHomeContent);
//渲染查询的内容
app.get('/search',renderSearchContent);

// 文章发布页面
app.get('/manage/create-post',(req,res)=>{
  if(res.locals.isLogged){
    res.sendFile(path.resolve('./pages/manage.html'))
  }else{
    res.redirect("/login");
  }
})
// 文章修改页面
app.get('/manage/update-post',(req,res)=>{
  if(res.locals.isLogged){
    res.sendFile(path.resolve('./pages/update-post.html'))
  }else{
    res.redirect("/login");
  }
})
// 专栏发布页面
app.get('/manage/create-column',(req,res)=>{
  if(res.locals.isLogged){
    res.sendFile(path.resolve('./pages/create-column.html'))
  }else{
    res.redirect("/login");
  }
})
//登录页面
app.get('/login',(req,res)=>{
  res.sendFile(path.resolve('./pages/login.html'))
})
// 专栏列表
app.get('/column',renderColumnList);
// 专栏页
app.get('/column/:id',renderColumnContent);

// 技术、随笔的文章列表
app.get('/article-list',renderArticleList);
//文章内容页
app.get('/article/:id',renderArticleContent);
app.use('/api',apiRouter)
module.exports = app;

