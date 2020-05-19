<template>
  <div>
    <img class="imgs" src="http://localhost:4000/banners/3.jpg" >
    <div class="list" v-for="(item,index) in list" :key="index"  @click="toGoodDetail(item._id)">
      <div class="fl">{{index+1>9?index+1:'0'+(index+1)}}</div>
      <div class="fr">
        <p class="book_title">
          {{item.name}}
        </p>
        <p class="author">
          作者：{{item.author}}
        </p>
        <p class="tip">
          书兮自营
        </p>
        <p class="price">
          ￥{{item.price}}
        </p>
      </div>
      <div class="info">
          <img :src="'http://localhost:4000/'+item.img" :alt="item.name">
      </div>
    </div>
  </div>
 
</template>

<script>

export default {
  data () {
    return {
     list:[]
    }
  },

  methods: {
    toGoodDetail(id){
      wx.navigateTo({
        url:`../goodDetail/main?id=${id}`
      })
    },
    getGoodList(options){
      // 用post接受数据时，需要在后台引入body-parser插件解决问题
      var _this = this
      wx.request({
        url:'http://localhost:4000/wxapigetGoodList',
        header:{
          'content-type':'application/json'
        },
        method:'POST',
        data:{
          id:options.id
        },
        success(res){
          // console.log(res)
          _this.list = res.data
          _this.list.map((item,index)=>{
            item.img = item.img.replace('\\','\/')
            return item.img = item.img.replace('\\','\/')
          })
          console.log(_this.list)
        }
      })
    }
    
  },

  mounted(){
    //mpvue内置方法this.$root.$mp.query
    console.log(this.$root.$mp.query)
    var options = this.$root.$mp.query
    wx.setNavigationBarTitle({
      title:options.typename
    })

    this.getGoodList(options)
  },

  created () {
  }
}
</script>

<style scoped>
.imgs {
  width: 100%;
  height: 150px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.list{
  height: 130px;
  border-bottom: 1px solid #d8d8d8;
}
.list .fl{
  height: 16px;
  width: 18px;
  background-color: #963137;
  font-size: 13px;
  color: white;
  margin-left: 10px;
  text-align: center;
}
.list .fr{
  width:225px;
  margin-top: 10px;
  margin-right: 10px;
}
.list .fr .book_title{
  overflow: hidden;
  font-size: 15px;
  line-height: 22px;
}
.list .fr .author{
  font-size: 0.25rem;
  line-height: 0.35rem;
  background-color: #F5F5F5;
  color: #9B9B9B;
  height: 0.35rem;
  overflow: hidden;
}
  .list .fr .tip{
  width: 60px;
  color: #963137;
  font-size: 13px;
  border: 1px solid #963137;
  border-radius: 3px;
  text-align: center;
  margin-top: 3px;
  margin-bottom: 3px;
}
.list .fr .price{
  color: #963137;
  font-size: 14px;
  font-weight: bold;
  line-height: 26px;
}
  
.list .info img{
  width: 70px;
  height: 80px;
  margin-top:20px;
  margin-left:15px;
}
</style>
