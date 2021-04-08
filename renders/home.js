// 该模块用于处理关键字检索
const pool = require("../secret/sql_pool");
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  console.log(req.route.path);
  // 该render负责首页

  //该检索会最近10篇文章或专栏。需要使用union all
  let sql = `
    SELECT 
    postdate,
    id,
    null as column_id,
    title,
    description,
    covername,
    viewcount,
    updatedate from article
    UNION ALL
    SELECT 
    postdate,
    id,
    id as column_id,
    title,
    description,
    covername,
    viewcount,
    updatedate from t_column
    ORDER BY postdate desc
    LIMIT 0,10`;
    pool.query(sql,(error, data_result, fields) => {
      if (error) throw error;
      engineRender(
        req,res,"main.ejs",{
          articles:data_result
        }
      )
    })
};
