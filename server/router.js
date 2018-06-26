// 写路由
// /all 查询user的所有数据
// /add 插入一条自己的信息 insert into user(name,age,gender) values(?,?,?)
// /del?id=1 删除id为1
// /update?id=2 修改 这条数据 名字变成  尼古拉斯.赵四
// /notDel   //查询 未删除的数据
const  express=require('express');
const  router=express.Router();
const  mysql=require('mysql');
const  moment=require('moment');

let conn=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'',
        database:'mydb'
    })
// conn.connect()
//查询所有未删除的英雄
router.get('/api/getheros',(req,res)=>{
    // 查询所有数据
    // conn.query(sql,data,回调)
    let sql="select * from heros where isdel=?";
    let data=[0]
    conn.query(sql,data,(err,results)=>{
       if(err) return res.json( {err_code:1,message:'查询错误',affectedRows:0}  )

       res.json( {err_code:0,message:results,affectedRows:0}  )
    })
})
//根据id 更新对应的英雄
router.post('/api/update',(req,res)=>{
    //   获取 id 更新数据库
    // req.body.id
    let { id,username,gender }=req.body
    let sql="update heros set username=?,gender=? where id=?";
    let data=[username,gender,id];
    conn.query(sql,data,(err,results)=>{
        if(err) return res.json(  {err_code:1,message:'更新失败',affectedRows:0} );
        if(results.affectedRows!==1) return  res.json(  {err_code:1,message:'更新的数据不存在',affectedRows:0} );
        res.json(  {err_code:0,message:'更新成功',affectedRows:results.affectedRows} );
    })
})
// 根据id获取指定的英雄信息
// /api/getinfo?id=1
router.get('/api/getinfo',(req,res)=>{
        // 获取id
    let id= req.query.id
    let sql='select * from heros where id=?'
    let data=[id]
    conn.query(sql,data,(err,results)=>{
        if(err) return res.json(  {err_code:1,message:'查询英雄失败',affectedRows:0} );
        if(results.length<=0) return  res.json(  {err_code:1,message:'查询不到数据',affectedRows:0} );
        res.json(  {err_code:0,message:results[0],affectedRows:0} );
    })
})
// 软删除  /api/delhero?id=1  isdel 0->1
router.get('/api/delhero',(req,res)=>{
    // 获取id
    let id= req.query.id
    let sql='update heros set isdel=1 where id=?'
    let data=[id]
    conn.query(sql,data,(err,results)=>{
        if(err) return res.json(  {err_code:1,message:'删除英雄失败',affectedRows:0} );
        if(results.affectedRows!==1) return  res.json(  {err_code:1,message:'删除英雄失败',affectedRows:0} );
        res.json(  {err_code:0,message:'删除成功',affectedRows:results.affectedRows} );
    })
})

// 添加英雄  username gender  日期在服务器格式（ moment().format('YYYY-MM-DD HH:mm:ss')  ）
router.post('/api/addhero',(req,res)=>{
    // 获取id
    let { username,gender }=req.body
    let ctime=moment().format('YYYY-MM-DD HH:mm:ss')
    let sql='insert into heros values(null,?,?,?,?)'
    let data=[username,gender,ctime,0]
    conn.query(sql,data,(err,results)=>{
        console.log(err)
        if(err) return res.json(  {err_code:1,message:'添加英雄失败',affectedRows:0} );
        if(results.affectedRows!==1) return  res.json(  {err_code:1,message:'添加英雄失败',affectedRows:0} );
        res.json(  {err_code:0,message:'添加英雄成功',affectedRows:results.affectedRows} );
    })
})




module.exports=router;