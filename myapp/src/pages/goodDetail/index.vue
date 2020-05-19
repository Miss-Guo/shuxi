<template>
  <div class="detail">
    <div class="msg">
      <div class="imgs">
        <img :src="goodDetail.img" :alt="goodDetail.name">
        <span>免费在线读</span>
      </div>
      <div class="text">
        <p class="price">
          ￥{{goodDetail.price}} 
          <span class="tip">每满100减40</span>
        </p>
        <p class="discount">定价：<span>￥25.00</span> &nbsp;&nbsp; 7折</p>
        <p class="name">
          <span class="mine">书兮自营</span>
          {{goodDetail.name}}
        </p>
        <p class="desc">{{goodDetail.desc}}</p>
        <p class="dec">
          <span class="author">{{goodDetail.author}}</span>
          <span>湖南文艺出版社</span>
        </p>
      </div>
      <div class="wrap">
        <p>
          领券：<span>200减30</span><span>99减10</span>
        </p>
      </div>
      
      
    </div>
    <!---------- 底部加入购物车功能 ------------->
    <div class="bottom">
      <div class="carts" @click="toCart">购物车</div>
      <div class="buy" @click="toPay(goodDetail.price)">立即购买</div>
      <div class="inCarts" @click="addCart(goodDetail._id)" >加入购物车</div>
    </div>
  </div>
  
 
</template>

<script>

export default {
  data () {
    return {
     goodDetail:[]
    }
  },

  methods: {
    toPay(price){
      wx.navigateTo({
        url:`/pages/pay/main?totalPrice=${price}`
      })
    },
    toCart(){
       //跳转购物车属于tabBar页面
      wx.switchTab({
        url:'/pages/shopping/main'
      })
    },
    // 加入购物车
    addCart(id){
      // console.log(id)
      wx.request({
        url:"http://localhost:4000/wxapiaddCart",
        method:"POST",
        data:{
          id
        },
        header:{
          "content-type":"application/json"
        },
        success(res){
          console.log(res)
        }
      })
    },
    // 获取商品详情
    getGoodDetail(options) {
      var _this = this;
      wx.request({
        url: "http://localhost:4000/wxapigetGoodDetail",
        method: "POST",
        data: {
          id: options.id
        },
        success(res) {
          console.log(res);
          _this.goodDetail = res.data;
          //  console.log(_this.goodDetail.img);
          var result = _this.goodDetail.img.replace("\\","/");
          _this.goodDetail.img = "http://localhost:4000/"+result.replace("\\","/");
        }
      });
    }
  },

  mounted(){
    console.log(this.$root.$mp.query)
    var options = this.$root.$mp.query
    this.getGoodDetail(options);
    wx.setNavigationBarTitle({
      title:"商品详情"
    })
  },

  created () {
  }
}
</script>

<style scoped>
.detail{
  width: 100vw;
  height: 100vh;
}
.detail .msg .imgs{
  width: 100%;
  text-align: center;
  position: relative;
}
.detail .msg img{
  width: 6.5rem;
  height: 7rem;
}
.detail .msg .imgs span{
  color: #963137;
  font-size: 0.27rem;
  display: inline-block;
  border: 0.01rem solid #963137;
  border-radius: 0.5rem;
  padding: 0.16rem 0.26rem;
  position: absolute;
  right: 0.35rem;
  bottom: 0.8rem;
  background-color: white;
  opacity: 0.7;
}
.detail .text{
  margin: 0.3rem;
}
.detail .msg .price{
  font-weight: bold;
  font-size: 0.45rem;
  color: #963137;
  line-height: 0.5rem;
  position: relative;
}
.detail .msg .price .tip{
  font-size: 0.25rem;
  line-height: 0.3rem;
  display: inline-block;
  border: 0.01rem solid #963137;
  padding: 0rem 0.07rem;
  margin-left: 0.15rem;
  position: absolute;
  bottom: 0.09rem;
}
.detail .text .discount{
  color: #878787;
  font-size: 0.27rem;
  line-height: 0.45rem;
  margin-bottom: 0.1rem;
}
.detail .text .discount span{
  text-decoration: line-through;
}
.detail .msg .name{
  font-weight: bold;
  font-size: 0.4rem;
  font-family: PingFangSC-Semibold;
  color: #222;
  margin-bottom: 0.2rem;
}
.detail .msg .name span{
  font-size: 0.25rem;
  display: inline-block;
  color: white;
  background-color: #963137;
  font-family: "微软雅黑";
  padding: 0rem 0.08rem;
  border-radius: 0.05rem;
  position: relative;
  bottom: 0.05rem;
}
.detail .text .desc{
  color: #878787;
  font-size: 0.27rem;
  line-height: 0.35rem;
}
.detail .text .dec{
  color: #5a5a5a;
  font-size: 0.27rem;
  margin-top: 0.15rem;
}
.detail .text .dec .author{
  width: 2.5rem;
  display: inline-block;
  border-right: 1px solid #878787;
  padding-right: 0.2rem;
  margin-right: 0.2rem;
}
.detail .wrap{
  height: 1rem;
  background-color: #ebebeb;
  overflow: hidden;
}
.detail .wrap p{
  height: 0.6rem;
  background-color: white;
  color: #963137;
  font-size: 0.3rem;
  margin-top:0.15rem;
  line-height: 0.6rem;
  padding-left: 0.3rem;
}
.detail .wrap p span{
  display: inline-block;
  background-color: #963137;
  color: white;
  font-size: 0.25rem;
  line-height: 0.35rem;
  padding: 0 0.1rem;
  margin: 0 0.1rem;
  position: relative;
  bottom: 0.02rem;
}
.detail .bottom{
  width: 100%;
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0px;
}
.bottom div{
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center; 
  background-color: white;
  color: #963137;
}
.bottom .buy{
  background-color: #F8E8D8;
  color: #963137;
}
.bottom .inCarts{
  background-color: #963137;
  color: white;
}
</style>
