<template>
  <div style="background:#eee">
    <div class="bg">
      <button class="btn" v-if="!nickName" open-type="getUserInfo" @getuserinfo="getUser">登录/注册</button>
      <block v-else>
        <h1 style="color:white">{{nickName}}</h1>
        <button class="btn" @click="clearUser">注销</button>
      </block>
    </div>
    <div class="box">
      <div>
        <p>0</p>
        <p>收藏的商品</p>
      </div>
      <div>
        <p>0</p>
        <p>关注的店铺</p>
      </div>
      <div>
        <p>0</p>
        <p>我的足迹</p>
      </div>
    </div>
    <div style="border:1px solid #ccc;overflow:hidden;background:white">
      <div class="le">
        <img src="../../imgs/dingdan.png" alt />
        <span>我的订单</span>
      </div>
      <p class="rg find">查看全部购买商品 ></p>
    </div>
    <div class="box">
      <div>
        <img src="../../imgs/fukuan.png" alt />
        <p>待付款</p>
      </div>
      <div>
        <img src="../../imgs/shouhuo.png" alt />
        <p>待收货</p>
      </div>
      <div>
        <img src="../../imgs/huanhuo.png" alt />
        <p>退换货</p>
      </div>
    </div>
    <div class="fe m10">
      <div class="le">
        <img src="../../imgs/huiyuan.png" alt />
        <span>会员中心</span>
      </div>
    </div>
    <div class="fe">
      <div class="le">
        <img src="../../imgs/cts-200108192215072.png" alt />
        <span>我的礼券</span>
      </div>
      <p class="rg">＞</p>
    </div>
    <div class="fe">
      <div class="le">
        <img src="../../imgs/cts-200108192215024.png" alt />
        <span>积分抵现</span>
      </div>
      <p class="rg">＞</p>
    </div>
    <div class="fe">
      <div class="le">
        <img src="../../imgs/cts-200108192214684.png" alt />
        <span>我的电子书</span>
      </div>
      <p class="rg">＞</p>
    </div>
    <div class="fe">
      <div class="le">
        <img src="../../imgs/cts-200108192214981.png" alt />
        <span>我的礼品卡</span>
      </div>
      <p class="rg">＞</p>
    </div>
    <div class="fe m10">
      <div class="le">
        <img src="../../imgs/cts-200108192214867.png" alt />
        <span>客服反馈</span>
      </div>
      <p class="rg">＞</p>
    </div>
    <div class="m10 like">
      ————
      <img src="../../imgs/cts-200108192214863.png" alt />
      <span>根据您的偏好猜您可能喜欢</span> ————
    </div>
    <div class="likeList">
      <div v-for="(item,index) in books" :key="index">
        <img class="image" :src="'http://127.0.0.1:4000/'+item.img" alt />
        <span class="redbor">{{item.name}}</span>
        <span class="redback" v-if="item.status==1">热卖</span>
        <span class="redback" v-else-if="item.status==2">新品</span>
        <span class="redback" v-else>下架</span>
        <span class="price">￥{{item.price}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      books: [],
      nickName: null
    };
  },
  methods: {
    // 登录注册
    getUser(e) {
      console.log(e);
      var nickName = e.mp.detail.userInfo.nickName;
      var _this = this
      wx.login({
        success(res){
          //登录成功
          if(res.code){
            wx.setStorageSync('nickName',nickName)
            wx.showToast({
              title:'登录成功',
              icon:'success'
            })
            _this.nickName = wx.getStorageSync('nickName')
          }else{//登录失败
            wx.showToast({
              title:'登录失败'
            })
          }
        }
      })
    },
    // 注销登录
    clearUser() {
      var _this = this
      wx.showModal({
        title:'注销登录',
        success(res){
          if(res.confirm){
            wx.removeStorageSync('nickName')
            _this.nickName = null
          }
        }
      })
    },
    getBooks() {
      var _this = this;
      // 微信小程序请求数据
      wx.request({
        url: "http://127.0.0.1:4000/wxapigetGoods",
        header: {
          "content-type": "application/json"
        },
        success(res) {
          _this.books = res.data;
          _this.books.map((item, index) => {
            // item.img = item.img.replace("\\", "/");
            return (item.img = item.img.replace(/\\/g, "/"));
          });
        }
      });
    }
  },
  mounted() {
    this.getBooks();
    var nickName = wx.getStorageSync('nickName')
    if(nickName){
      this.nickName = nickName
    }
  }
};
</script>
<style scoped>
.bg {
  padding: 40px;
  text-align: center;
  background-image: url("http://img61.ddimg.cn/upload_img/00610/home/user-bg.jpg");
  background-size: cover;
}

.btn {
  width: 150px;
  height: 40px;
  line-height: 40px;
  border-radius: 40px;
  background: none;
  border: 1px solid white;
  color: white;
}

.box {
  display: flex;
  padding: 10px 0;
  text-align: center;
  justify-content: space-between;
  background: white;
}

.box div {
  width: 30%;
  border-right: 1px solid #ccc;
}

.box div:last-child {
  border: none;
}

.box img {
  width: 25px;
  height: 25px;
}

.le {
  float: left;
  height: 60px;
  line-height: 60px;
}

.le img {
  margin: 0 5px 0 5px;
  width: 25px;
  height: 25px;
  vertical-align: middle;
}

.rg {
  float: right;
  color: #F5F5F5;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.fe {
  border: 1px solid #F5F5F5;
  overflow: hidden;
  height: 60px;
  vertical-align: middle;
  background: white;
}

.m10 {
  margin: 10px 0;
}

.like {
  font-size: 14px;
  text-align: center;
  color: #888;
}

.like img {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  margin: 0 5px;
}

.likeList {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.likeList > div {
  width: 48%;
  margin-right: 5px;
  margin-top: 5px;
  background: white;
}

.image {
  width: 100%;
  height: 120px;
}

.redbor {
  /* color: #963137; */
  font-size: 14px;
  margin: 0 5px;
  display: block;
}

.redback {
  display: inline-block;
  background: #963137;
  border: 1px solid #963137;
  color: white;
  font-size: 13px;
  padding: 0 2px;
  margin: 2px 5px 8px;
}

.price {
  color: #963137;
  margin: 5px 0;
}

.text {
  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;
  margin: 5px 0;
}

.find {
  height: 60px !important;
  line-height: 60px !important;
}
</style>