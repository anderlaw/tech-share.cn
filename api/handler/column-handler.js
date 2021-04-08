const multiparty = require("multiparty");
const pool = require("../../secret/sql_pool");
module.exports = {
  create(req, res, next) {
    //先解析formdata数据
    new multiparty.Form().parse(req, (err, fields, files) => {
      const title = fields.title[0];
      const description = fields.description[0];
      const covername = fields.covername[0];
      //插入数据到article表中
      const articleSql = new Promise((resolve) => {
        pool.query(
          `insert into t_column(title, description,postdate,covername) VALUES(` +
            `"${title}","${description}",CURRENT_TIMESTAMP,${JSON.stringify(covername)})`,
          (error, results, fields) => {
            if (error) throw error;
            res.send({
              success: true,
            });
          },
        );
      });
    });
  },
};
