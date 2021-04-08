
const multiparty = require('multiparty');
const Bcrypt = require('bcryptjs');
const secretKey = "QAZWSXEDCRFVTGB!@#$%^";
const username = "admin";
const password = "123";
module.exports = {
  login: (req, res) => {
    console.log('登录状态：：：');
    console.log(res.locals.isLogged);
    const Form = new multiparty.Form();
    Form.parse(req, (err, fields, files) => {
      if (fields.username[0] == username && fields.password[0] == password) {
        //登录成功！,设置cookie;
        res.setHeader(
          "Set-Cookie",
          "Token=" + Bcrypt.hashSync(secretKey, 10) + ";httpOnly;Path=/;Max-Age=36000", //10小时后过期！
        );
        res.send({
          success: true,
        });
      }
    });
  },
  authUser:(req,res,next) =>{
    const Token = req.cookies.Token;
    const checkPass = Token && Bcrypt.compareSync(secretKey, Token);
    if(checkPass){
      res.locals.isLogged = true;
    }else{
      res.locals.isLogged = false;
    }
    next()
  },
};
