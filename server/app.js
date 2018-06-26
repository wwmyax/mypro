// 1.引入对应的包
const express=require('express');
const ejs=require('ejs');
const path=require('path')
const fs=require('fs');
const bodyParser=require('body-parser');
const mysql=require('mysql');
const cors=require('cors');

// 创建服务器
const app=express();
// 设置模板引擎
app.set('view engine','ejs')
app.set('views','./view')
// 设置body-parser解析post数据
app.use(  bodyParser.urlencoded({ extended:false }) )
// 设置运行前端浏览器跨域
app.use(  cors() )
// 设置静态资源托管 public
app.use( express.static(  path.join(__dirname,'public') ) )
// 引入 router
const router=require('./router.js')
app.use(router);
// 监听端口
app.listen(5000,()=>{
    console.log('服务器启动成功')
})