const pool = require("../secret/sql_pool");
const generatePager = require("../tools/pager")
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  console.log(req.route.path);
  // 该render负责技术页、随笔页.包括其中的页码参数
  let {category_code,page_size,current_page} = req.query;
  page_size = page_size || 10;///默认每页10条
  current_page = current_page||1;//默认第一页

  //通过两个sql分别查询总条数、数据记录
  //第二个sql使用left join 将关联表article_label_relation中对应article_id的label提取出来
  //并group_concat出来
  let sql_count = "";
  let sql_data = `
    SELECT 
    article.id AS id,
    article.title AS title,
    article.description AS description,
    article.covername AS covername,
    article.postdate AS postdate,
    article.updatedate AS updatedate,
    article.viewcount AS viewcount,
    GROUP_CONCAT(article_label_relation.label_name) AS label
    FROM article
    LEFT JOIN article_label_relation ON article_label_relation.article_id = id
    `;
  //传参了文章类型（技术、随笔页面）
  if(category_code != undefined){
    sql_count = `select count(id) as count from article where category_code = ${category_code}`;
    sql_data += `
    where category_code = ${category_code} 
    GROUP BY  id
    order by postdate desc 
    limit ${(current_page-1)*page_size},${page_size}
    `;
  }else{
    //没有指定文章类型，查询所有文章（该项 为兜底方案，项目里暂时没有用到）
    sql_count = `select count(id) as count from article`;
    sql_data += `
    GROUP BY  id
    order by postdate desc 
    limit ${(current_page-1)*page_size},${page_size}`;
  }

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
              url_heading:"/article-list?category_code="+category_code,
              current_page,
              page_count
            })
          }
        )
      })
    },
  );
};
