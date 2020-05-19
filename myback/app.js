//引入express
var express = require('express')
//调用express
var app = express()
//配置ejs模板
var ejs = require('ejs')
//使用ejs模板
// app.set('view engine','ejs')

//实现模板后缀名的更改
app.engine('.html',ejs.__express)
app.set('view engine','html')

//ejs模板引擎默认位置在views文件夹下
//更改模板位置
// app.set('views','public')

//ejs配置静态资源目录static文件夹
app.use(express.static('static'))
//为了和上面的路径做区分
app.use('/upload',express.static('upload'))

//引用mongodb数据库插件
var MongoClient = require('mongodb').MongoClient

//配置url路径
var url = "mongodb://localhost:27017/dangdang"

//引入multiparty插件来实现表单数据的获取
var multiparty = require('multiparty')

//利用fs模块来实现清除缓存
var fs = require('fs')

//使用ObjectId的方法来实现数据转化
var ObjectId = require('mongodb').ObjectId


//----------------  分类管理  -----------------
//启动路由页面
app.get('/',function(req,res){
    // res.send('hello world')
    //在这里请求数据库抛数据传递给页面
    MongoClient.connect(url,(err,db)=>{
        if(err){
            console.log(err)
            res.send('数据库连接失败')
            return
        }else{
            db.collection('type').find().toArray((err1,res1)=>{
                res.render('types/index',{data:res1})
            })
        }
    })
    
})

//分类添加页面
app.get('/add',(req,res)=>{
    res.render('types/add',{})
})

//分类添加-提交页面
app.post('/doAdd', (req, res) => {
    //因为提交的内容有文本+文件，所以需要借助插件multiparty
    // 1.form表单提交时，要修改提交的类型enctype="multipart/form-data" 
    // 2.初始化multiparty,并接受相关参数
    // 2.1配置默认上传文件缓存的路径uploadDir :'upload'  
    // 2.2搭配express框架配置静态资源目录
    //   3.form.parse表单数据解析，根据提交的信息获取有效值
    //   3.1 err:报错 fields:文本域 files:文件域
    var form = new multiparty.Form({ uploadDir: 'upload/types' })
    form.parse(req, (err, fields, files) => {
      console.log(fields, '文本域')
      console.log(files, '文件域')
      // 拿到数据===>存储数据库===>渲染页面
      var name = fields.name[0]
      var img = files.img[0].path
      MongoClient.connect(url, function (err, db) {
        if (err) {
          console.log(err)
          res.send('数据库连接失败')
          //当上传失败时，我们需要删除缓存 
          fs.unlinkSync(img)
        } else {
          //1.如果对应文本没有内容|| 文本域没有内容，不去提交数据库
          //2.有内容提交数据库
          if (files.img[0].size == 0 || fields.name[0] == '') {
            fs.unlinkSync(img)
            res.send(`<script>alert('部分内容为空，分类添加失败');history.back();location.reload()</script>`)
          } else {
            db.collection('type').insertOne({ name, img }, function (err1, res1) {
              if (err1) {
                fs.unlinkSync(img)
                res.send(`<script>alert('数据库添加失败');location.href="/"</script>`)
              } else {
                res.send(`<script>alert('分类添加成功');location.href="/"</script>`)
              }
            })
          }
        }
      })
    })
  })

  //分类删除
  app.get('/del', (req, res) => {
    //req.query拿到地址栏传递的参数
    // 拿到的参数为字符串，需要进行ObjectId转化
    console.log(req.query.id)
    var _id = ObjectId(req.query.id)
    var img = req.query.img
    MongoClient.connect(url, (err, db) => {
      if (err) {
        console.log(err)
        return
      } else {
        //删除数据库某项
        db.collection('type').remove({ _id }, function (err1, res1) {
          if (err1) {
            res.send('删除失败')
          } else {
            fs.unlinkSync(img)
            res.send(`<script>alert('删除成功');location.href='/'</script>`)
          }
        })
      }
    })
  })

  //分类修改页面
  app.get('/edit',(req,res)=>{
      var _id = ObjectId(req.query.id)
      //请求数据库并返回_id后的数据内容
      MongoClient.connect(url,(err,db)=>{
          if(err){
              res.send('数据库连接失败')
          }else{
              db.collection('type').findOne({ _id },function(err,res1){
                  console.log(res1)
                  res.render('types/edit',{types:res1})
              })
          }
      })
  })

  //分类修改-提交页
  app.post('/doEdit',(req,res)=>{
    // 判断当前图片是否被修改
    // 1.如果图片被修改了，更新数据库(name，img)，提交新的缓存，删除本地缓存
    // 2.没有被修改，就考虑文本是否被修改，文本被修改，更新数据库(name) ，文本未被修改，则什么也不操作
    // 依旧通过multiparty来获取数据
    var form = new multiparty.Form({'uploadDir':'upload/types'})
    form.parse(req,function(err,fields,files){
        console.log(fields,'文本域')
        console.log(files,'文件域')
        var name = fields.name[0]
        var _id = ObjectId(fields.id[0])
        //代表新上传的img
        var img = files.img[0].path
        if(files.img[0].size == 0){
            console.log('未修改图片状态')
            fs.unlinkSync(img)
            MongoClient.connect(url,(err,db) =>{
                //查询数据库
                db.collection('type').findOne({ _id },(err1,res1) =>{
                    db.collection('type').updateOne({ _id },{ $set:{ name }},(err2,res2)=>{
                        //更新数据库
                        res.send(`<script>location.href='/'</script>`)
                    })
                })
            })
        }else{
            console.log('修改图片状态')
            MongoClient.connect(url,(err,db) =>{
                //查询数据库
                db.collection('type').findOne({ _id },(err1,res1) =>{
                    console.log(res1)
                    fs.unlinkSync(res1.img)
                    db.collection('type').updateOne({ _id },{ $set:{ img,name }},(err2,res2)=>{
                        //更新数据库
                        res.send(`<script>location.href='/'</script>`)
                    })
                })
            })
        }
    })

  })

  //-------------------- 分类管理 end -----------------


  //--------------------- 商品管理  -------------------
  //商品展示
  app.get('/goods',(req,res) =>{
      //请求数据库，返回数据
      MongoClient.connect(url,(err,db) =>{
          db.collection('goods').find().toArray(function(err1,res1){
            //   console.log(res1)
            // 我们要通过循环遍历的形式操作res1返回的商品结果
            res1.forEach((item,index)=>{
                db.collection('type').findOne({_id:ObjectId(item.type)},function(err2,res2){
                    console.log(res2.name)
                    // 此时拿到了对应的res2.name====>res1.item.type
                    res1[index]['type'] = res2.name

                })
            })
            // 那是因为在上面进行的遍历请求数据库比较耗时间，所以我们使用setTimeout来实现
            // 延时调用
            setTimeout(()=>{
                res.render('goods/index',{data:res1})
            },500)
              
          })
      })
  })

  //商品添加
  app.get('/goods/add',(req,res) =>{
      //请求对应的分类列表，并展示在分类选择框上
      MongoClient.connect(url,(err,db)=>{
          db.collection('type').find().toArray(function(err1,res1){
              console.log(res1)
              res.render('goods/add',{data:res1})
          })
      })
  })

  //商品添加-提交页
  app.post('/goods/doAdd',(req,res)=>{
      var form = new multiparty.Form({uploadDir:'upload/goods'})
      form.parse(req,function(err,fields,files){
          console.log(fields,'文本域')
          console.log(files,'文件域')
          var name = fields.name[0]
          var author = fields.author[0]
          var num = fields.num[0]
          var price = fields.price[0]
          var type = fields.type[0]
          var status = fields.status[0]
          var desc = fields.desc[0]
          var img = files.img[0].path

          MongoClient.connect(url, function (err, db) {
            if (err) {
              console.log(err)
              res.send('数据库连接失败')
              //当上传失败时，我们需要删除缓存 
              fs.unlinkSync(img)
            } else {
              //1.如果对应文本没有内容|| 文本域没有内容，不去提交数据库
              //2.有内容提交数据库
              if (files.img[0].size == 0 || name == '' || author == '' || num == '' || price == '' || type == '' || status == '' || desc == '') {
                fs.unlinkSync(img)
                res.send(`<script>alert('部分内容为空，商品添加失败');location.href="/goods"</script>`)
              } else {
                db.collection('goods').insertOne(
                    { name,author,num,price,type,status,desc,img }, 
                    function (err1, res1) {
                  if (err1) {
                    fs.unlinkSync(img)
                    res.send(`<script>location.href="/goods"</script>`)
                  } else {
                    res.send(`<script>location.href="/goods"</script>`)
                  }
                })
              }
            }
          })
      })
  })

  //商品删除
  app.get('/goods/del',(req,res)=>{
      console.log(req.query.id,req.query.img)
      var _id = ObjectId(req.query.id)
      var img = req.query.img
      //通过请求数据库实现删除
      MongoClient.connect(url,(err,db)=>{
          db.collection('goods').remove({_id},function(err1,res1){
              console.log(res1.result.n)
              if(res1.result.n==1){
                  fs.unlinkSync(img)
                  res.send(`<script>location.href='/goods'</script>`)
              }else{
                res.send(`<script>location.href='/goods'</script>`) 
              }
          })
      })

  })

  //商品修改
  app.get('/goods/edit',(req,res)=>{
      var _id = ObjectId(req.query.id)
      console.log(_id)
      MongoClient.connect(url,(err,db)=>{
          db.collection('goods').findOne({_id},(err1,res1)=>{
            //   console.log(res1)
            db.collection('type').find().toArray(function(err2,res2){
                res.render('goods/edit',{goods:res1,types:res2})
            })
          })
      })

  })
 
  //商品修改-提交页
  app.post('/goods/doEdit',(req,res)=>{
      //调用form表单的插件multiparty
      var form = new multiparty.Form({uploadDir:'upload/goods'})
      // 判断当前图片是否被修改
      // 1.如果图片被修改了，更新数据库(name，img.....)，提交新的缓存，删除本地缓存
      // 2.没有被修改，就考虑文本是否被修改，文本被修改，更新数据库(name....) ，文本未被修改，则什么也不操作
      form.parse(req, function (err, fields, files) {
        console.log(fields, '文本域')
        console.log(files, '文件域')
        var _id = ObjectId(fields.id[0])
        var name = fields.name[0]
        var author = fields.author[0]
        var num = fields.num[0]
        var price = fields.price[0]
        var type = fields.type[0]
        var status = fields.status[0]
        var desc = fields.desc[0]
        
        // 代表新上传的img
        var img = files.img[0].path
    
        if (files.img[0].size == 0) {
          console.log('未修改图片状态')
          fs.unlinkSync(img)
          MongoClient.connect(url, (err, db) => {
              db.collection('goods').updateOne({ _id }, { $set: { name,author,num,price,type,status,desc } }, (err2, res2) => {
                // 更新数据库
                res.send(`<script>location.href='/goods'</script>`)
              })
          })
        } else {
          console.log('修改图片状态')
          MongoClient.connect(url, (err, db) => {
            // 查询数据库
            db.collection('goods').findOne({ _id }, (err1, res1) => {
              fs.unlinkSync(res1.img)
              db.collection('goods').updateOne({ _id }, { $set: { img,name,author,num,price,type,status,desc } }, (err2, res2) => {
                // 更新数据库
                res.send(`<script>location.href='/goods'</script>`)
              })
            })
          })
        }
      })
  })

  //--------------------- 商品管理 end -----------------

  //--------------------- 购物车 -----------------
  app.get('/shopping',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
      db.collection('shopping').find().toArray((err1,res1)=>{
        res.render('shopping/index',{data:res1})
      })
    })
  })

app.listen(3000,function(){
    console.log('app listen to 3000.')
})