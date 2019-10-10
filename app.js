var express = require('express');

var app = new express();    /**实例化 */

//保存用户信息
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*30
    },
    rolling: true
}))

// 引入模块
var login = require('./routers/login.js');
var product = require('./routers/product.js');
var user = require('./routers/user.js');

//使用ejs模板引擎，默认找views这个目录
app.set('view engine', 'ejs');

// 配置public目录为我们的静态资源目录
app.use(express.static('public'));
// 虚拟目录
app.use('/upload', express.static('upload'));

app.use(function(req, res, next){
  if(req.url === '/login' || req.url === '/login/doLogin'){ /**判断有没有登录 */
    next();
  }else{
    if(req.session.userinfo && req.session.userinfo.username !== ''){
      req.app.locals['userinfo'] = req.session.userinfo;  /**配置全局变量，可以在任何模板中使用 */
      next();
    }else{
      res.redirect('/login')
    }
  }
})

app.get('/', function(req, res){
  res.redirect('product');
})

app.use('/login', login);
app.use('/product', product);
app.use('/user', user);

app.listen(3001, '127.0.0.1', () => console.log('Example app listening on port 3001!'));