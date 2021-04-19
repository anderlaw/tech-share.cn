const pool = require("../../secret/sql_pool");
module.exports = {
  recordVisit(req, res, next) {
    /**
       测试发现req.socket.localAddress是本地Ip或者商用服务器的内网IP
       而req.socket.remoteAddress则是远程IP(连接该服务的客户端IP地址)
       */
    const remoteIP = req.socket.remoteAddress;
    const articleId = req.query.articleId;
    const article_id_visitor_ip = articleId + "_" + remoteIP;
    /**
     * 1.insert 记录到t_visitor表里
     * 2.insert 记录到关联表 article_visitor_join表里
     */
    const visitorSql = new Promise((resolve) => {
      pool.query(
        `insert IGNORE INTO t_visitor (ip) values("${remoteIP}")`,
        (error, results, fields) => {
          if (error) throw error;
          resolve(results);
        },
      );
    });
    const viewSql = new Promise((resolve) => {
      pool.query(
        `insert IGNORE INTO article_visitor_connect(article_id_visitor_ip) values("${article_id_visitor_ip}")`,
        (error, results, fields) => {
          if (error) throw error;
          resolve(results);
        },
      );
    });
    Promise.all([visitorSql, viewSql]).then(([visitorRes, viewRes]) => {
      if (viewRes.affectedRows == 1) {
        //新增了一条
        //增加文章的阅读数
        pool.query(
          `update article set viewcount=viewcount+1 where id = ${articleId}`,
          (error, results, fields) => {
            if (error) throw error;
            res.send({
              success: true,
            });
          },
        );
      }else if(viewRes.affectedRows == 0){
        res.send({
          success: true,
        });
      }
    });
  },
};
