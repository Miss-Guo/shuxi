var express = require('express')
var app = express()

//引入数据库
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId

//配置url路径
var url = "mongodb://localhost:27017/dangdang"

//配置静态资源banners
app.use('/banners', express.static('banners'))
// 配置静态资源upload
app.use('/upload', express.static('upload'))

//引入body-parser
var bodyParser = require('body-parser')
//配置项
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//利用fs模块来实现清除缓存
var fs = require('fs')


//获取banners轮播图接口
app.get('/wxapigetBanners',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
      db.collection('banners').find().toArray(function(err1,res1){
        // 将数据抛到接口上即可
        res.send(res1)
      })
    })
  })

//获取分类列表
app.get('/wxapigetTypes',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        db.collection('type').find().toArray(function(err1,res1){
            //将数据抛到接口上即可
            res.send(res1)
        })
    })
})

//获取商品列表
app.get('/wxapigetGoods',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        db.collection('goods').find().toArray(function(err1,res1){
            //将数据抛到接口上即可
            res.send(res1)
        })
    })
})

// 获取商品列表
// body-parser用req.body接受数据
app.post('/wxapigetGoodList',(req,res)=>{
    console.log(req.body.id)
    var _id = req.body.id
    MongoClient.connect(url,(err,db)=>{
        db.collection('goods').find({ type:_id }).toArray((err1,res1)=>{
            res.send(res1)
        })
    })
})

// 获取商品详情
app.post('/wxapigetGoodDetail', (req, res) => {
    console.log(req.body.id)
    // res.send('后台服务器')
    var _id = ObjectId(req.body.id)
    MongoClient.connect(url, (err, db) => {
      db.collection('goods').findOne({ _id }, (err1, res1) => {
        res.send(res1)
      })
    })
  })

// 添加购物车
app.post('/wxapiaddCart',(req,res)=>{
  console.log(req.body.id)
  // res.send('后台服务器')
  var _id = ObjectId(req.body.id)
  MongoClient.connect(url,(err,db)=>{
      db.collection('shopping').findOne({ goodsId:_id},(err2,res2)=>{
          if(res2){
              let num = res2.num +1
              db.collection('shopping').update({ goodsId:_id},{$set:{num}},(err3,res3)=>{
                  res.send('更新购物车数据成功')
              })
          }else{
               db.collection('goods').findOne({_id},(err1,res1)=>{
                console.log(res1)
                var img = res1.img
                var name = res1.name
                var price = res1.price 
                var num = 1
                var goodsId = _id
                db.collection('shopping').insertOne({
                    img,name,price,num,goodsId
                },(err2,res2)=>{
                    if(err2){
                    res.send('购物车添加失败')
                    }
                    if(res2){
                    res.send('购物车添加成功')
                    }
                })
                })
          }
      })
   
  })
})

//获取购物车
app.get('/wxapigetCart',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        db.collection('shopping').find().toArray((err1,res1)=>{
            res.send(res1)
        })
    })
})

app.get('/wxapiremoveCart',(req,res)=>{
    var _id = ObjectId(req.body.id)
    console.log(_id,"111")
    var img = req.query.img
    MongoClient.connect(url,(err,db)=>{
      db.collection('shopping').remove({ _id},(err1,res1)=>{
        console.log(res1.result)
        if(res1.result.n==1){
            fs.unlinkSync(img)
            res.send(res1)
        }else{
            res.send(res1) 
        }
          
      })
   
  })
})


app.listen(4000,function(){
    console.log('api listen to 4000.')
})