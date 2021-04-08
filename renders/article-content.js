const pool = require("../secret/sql_pool");
const engineRender = require("../tools/engine-render")
module.exports = (req, res,next) => {
  const id = req.params.id;
  console.log(id)
  pool.query(
    `select * from article where id = ${id}`,
    (error, results, fields) => {
      if (error) throw error;
      engineRender(req,res,"main.ejs",{
        article:results[0]
      })
    },
  );
};
