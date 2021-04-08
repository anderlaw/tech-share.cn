// 该模块用于处理关键字检索
const pool = require("../secret/sql_pool");
const generatePager = require("../tools/pager")
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  console.log(req.route.path);
  // 该render负责检索页.包括其中的页码参数
  let {keyword,page_size,current_page} = req.query;
  page_size = page_size || 10;///默认每页10条
  current_page = current_page||1;//默认第一页
  keyword = keyword || "";//默认空字符串

  //通过两个sql分别查询总条数、数据记录
  ///需要说明的是 该检索会根据关键字查询文章和专栏。需要使用union all

  sql_count = `
  select sum(num) as count from (SELECT count(id) num from article
  where title like  ${JSON.stringify("%"+ keyword +"%")}
  UNION ALL 
  SELECT count(id) num from t_column
  where title like  ${JSON.stringify("%"+ keyword +"%")}
  ) as temp;`;
  let sql_data = `
    SELECT 
    postdate,
    id,
    null as column_id,
    title,
    description,
    covername,
    viewcount,
    updatedate from article
    where title like  ${JSON.stringify("%"+ keyword +"%")}
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
    where title like  ${JSON.stringify("%"+ keyword +"%")}
    ORDER BY postdate desc
    LIMIT ${(current_page-1)*page_size},${page_size}
    `;
  
  pool.query(sql_count,
    (error, count_result, fields) => {
      if (error) throw error;
      pool.query(sql_data,(error, data_result, fields) => {
        if (error) throw error;
        const record_count = count_result[0].count;
        const page_count = Math.ceil(record_count/page_size);
        engineRender(
          req,res,"main.ejs",{
            articles:data_result,
            pagination:generatePager({
              url_heading:"/search?keyword="+keyword,
              current_page,
              page_count
            })
          }
        )
      })
    },
  );
};
