// 本模块对res.render方法作一层代理
// 向ejs模板 运送公共变量


const imgBaseUrl = require('./cosBaseUrl')
const globalDataForEjs = {
  imgBaseUrl,
  //后续添加
}
module.exports = function(req,res,ejs_path,data){ 
  res.render(ejs_path,Object.assign({
    route_path:req.route.path,
    isLogged:res.locals.isLogged,
  },globalDataForEjs,data))
}