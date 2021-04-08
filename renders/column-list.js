const pool = require("../secret/sql_pool");
const generatePager = require("../tools/pager")
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  // 该render负责专栏列表
  let {page_size,current_page} = req.query;
  page_size = page_size || 10;
  current_page = current_page||1;//默认第一页
  let sql_count = `select count(id) as count from t_column`;
  let sql_data = `SELECT * from t_column 
  order by postdate desc 
  limit ${(current_page-1)*page_size},${page_size}`;

  pool.query(sql_count,
    (error, count_result, fields) => {
      if (error) throw error;
      pool.query(sql_data,(error, data_result, fields) => {
        if (error) throw error;
        const record_count = count_result[0].count;
        const page_count = Math.ceil(record_count/page_size);
        engineRender(req,res,"main.ejs",{
          columns:data_result,
          pagination:generatePager({
            url_heading:"/column",
            current_page,
            page_count
          })
        })
      })
    },
  );
};
