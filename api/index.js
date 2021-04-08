const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const pool = require("../secret/sql_pool");
// handler
const userLogin = require('./handler/user-handler').login;
const createArticle  = require('./handler/article-handler').create
const createColumn  = require('./handler/column-handler').create
const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve("./static/files"),
    filename: function (req, file, cb) {
      console.log(file);
      // console.log(file);
      var mimeType = file.originalname.split(".").reverse()[0];
      cb(null, file.fieldname + Date.now() + "." + mimeType);
    },
  }),
});
// 用户校验中间件，检查header里的cookie

//分类列表
// article post
router.post("/article",createArticle);
// column post
router.post("/column",createColumn);
//获取专栏下拉框数据
router.get("/column",(req,res,next)=>{
  pool.query(
    `select id,title from t_column`,
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    },
  );
});
//根据专栏id获取详情
router.get("/column/:id",(req,res,next)=>{
  const id = parseInt(req.params.id);
  pool.query(
    `select * from t_column where id = ${id}`,
    (error, results, fields) => {
      if (error) throw error;
      res.send(results[0]);
    },
  );
});
//登录接口
router.post("/login",userLogin)
module.exports = router