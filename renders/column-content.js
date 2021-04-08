const pool = require("../secret/sql_pool");
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  const columnId = parseInt(req.params.id);
  let sqlColumn = `SELECT *  FROM t_column where id=${columnId}`;
  let sqlArticle = `
  SELECT *  FROM article 
  RIGHT JOIN column_article_relation on  
  column_article_relation.article_id = article.id 
  WHERE column_article_relation.column_id = ${columnId};
  `;

  pool.query(sqlColumn,
    (error, column_result, fields) => {
      if (error) throw error;
      pool.query(sqlArticle,(error, article_result, fields) => {
        if (error) throw error;
        engineRender(req,res,"main.ejs",{
          articles:article_result,
          column:column_result[0]
        })
      })
    },
  );
};
