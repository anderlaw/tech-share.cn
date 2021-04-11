const multiparty = require("multiparty");
const pool = require("../../secret/sql_pool");
module.exports = {
  create(req, res, next) {
    //先解析formdata数据
    new multiparty.Form().parse(req, (err, fields, files) => {
      const title = JSON.stringify(fields.title[0]);
      const description = JSON.stringify(fields.description[0]);
      const content = JSON.stringify(fields.content[0]); //此处再外层添加双引号，同时转义里面的双引号，拼接sql时免引号。
      const category_code = fields.category_code[0];
      const covername = fields.covername[0];
      const labelParam = fields.label[0];
      const columnId = fields.column_id[0];
      //插入数据到article表中
      const articleSql = new Promise((resolve) => {
        pool.query(
          `insert into article ( title, description,content,postdate,covername,category_code) VALUES(` +
            `${title},${description},${content},CURRENT_TIMESTAMP,"${covername}","${category_code}"` +
            `)`,
          (error, results, fields) => {
            if (error) throw error;
            resolve(results);
          },
        );
      });
      // 插入数据到label表中
      const labelSql = new Promise((resolve) => {
        //将标签里的多个连续空白符转换为单个
        const labelStr = labelParam.trim();
        if (!labelStr) {
          resolve();
          return;
        }

        const labelArr = labelStr
          .trim()
          .replace(/\s{2,}/g, " ")
          .split(" ");
        const labelValues = labelArr.map((item) => `("${item}")`);
        pool.query(
          `insert IGNORE into label ( name) VALUES ${labelValues}`,
          (error, results, fields) => {
            if (error) throw error;
            resolve(labelArr);
          },
        );
      });
      //处理关联表
      Promise.all([articleSql, labelSql]).then((result) => {
        //先处理article与t_column地连接表
        if (columnId) {
          pool.query(
            `insert into column_article_relation ( article_id,column_id) VALUES(${
              result[0].insertId
            },${parseInt(columnId)})`,
            (error, results, fields) => {
              if (error) throw error;
              //没有标签直接返回
              if (!labelParam) {
                res.send({
                  success: true,
                  articleId:result[0].insertId
                });
                return;
              }
              //处理label与article地连接表
              const sqlValues = result[1].map(
                (label) => `("${result[0].insertId}","${label}")`,
              );
              pool.query(
                `insert into article_label_relation ( article_id,label_name) VALUES ${sqlValues}`,
                (error, results, fields) => {
                  if (error) throw error;
                  res.send({
                    success: true,
                    
                  articleId:result[0].insertId
                  });
                },
              );
            },
          );
        } else {
          //没有标签直接返回
          if (!labelParam) {
            res.send({
              success: true,
              
              articleId:result[0].insertId
            });
            return;
          }
          //处理label与article地连接表
          const sqlValues = result[1].map(
            (label) => `("${result[0].insertId}","${label}")`,
          );
          pool.query(
            `insert into article_label_relation ( article_id,label_name) VALUES ${sqlValues}`,
            (error, results, fields) => {
              if (error) throw error;
              res.send({
                success: true,
                
                articleId:result[0].insertId
              });
            },
          );
        }
      });
    });
  },
  update(req,res,next){
    //先解析formdata数据
    new multiparty.Form().parse(req, (err, fields, files) => {
      const id = fields.id[0];
      const title = JSON.stringify(fields.title[0]);
      const description = JSON.stringify(fields.description[0]);
      const content = JSON.stringify(fields.content[0]); //此处再外层添加双引号，同时转义里面的双引号，拼接sql时免引号。
      const category_code = fields.category_code[0];
      //插入数据到article表中
      const articleSql = new Promise((resolve) => {
        pool.query(
          `update article set title = ${title},description=${description},content=${content},category_code="${category_code}"
          where id=${id}`,
          (error, results, fields) => {
            if (error) throw error;
            resolve(results);
            res.send({
              success: true,
            });
          },
        );
      });
    });
  }
};
