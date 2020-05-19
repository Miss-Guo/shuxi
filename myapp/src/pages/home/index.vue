<template>
  <div class="home">
    <!------------------ search -------------------->
    <div class="search_box">
      <img src="../../imgs/search.png" alt="">
      <input type="text" class="search_btn" placeholder="搜索歌曲、歌手、专辑" v-model="keyword">
      <!-- <span class="cancel" v-show="keyword != ''" @click="keyword = ''">×</span> -->
    </div>

    <!------------------- 轮播图 -------------------->
    <swiper indicator-dots autoplay circular>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <img class="imgs" :src="'http://localhost:4000/'+item.src" :alt="item.text" />
      </swiper-item>
    </swiper>

    <!-------------------- 分类列表 ------------------>
    <ul class="list">
      <li class="listLi" v-for="(item,index) in types" :key="index" @click="toGoodsList(item._id,item.name)">
        <img class="typeImg" :src="'http://localhost:4000/'+item.img" :alt="item.name">
      </li>
    </ul>

    <!---------------------- 广告图 -------------------->
    <img class="imgs" src="http://localhost:4000/banners/center.jpg" >

    <!----------------------- 风格列表 ------------------>
    <!-- <ul class="styleList">
      <li class="styleLi" v-for="(item,index) in goods" :key="index" @click="toGoodsDetail(item._id)">
        <p>{{item.name}}</p>

        <p class="active" v-if="item.status==1">热销</p>
        <p class="active" v-else-if="item.status==2">新品</p>
        <p class="active" v-else>下架</p>

        <img class="styleImg" :src="'http://localhost:4000/'+item.img" :alt="item.name">
      </li>
    </ul> -->

    <div class="likeList">
      <div v-for="(item,index) in goods" :key="index" @click="toGoodsDetail(item._id)">
        <img class="image" :src="'http://localhost:4000/'+item.img" :alt="item.name" />
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
  data () {
    return {
     banners:[],
     types:[],
     goods:[],
     keyword:''
    }
  },

  methods: {
    toGoodsList(id,name) {
      wx.navigateTo({
        url: `../goodlist/main?id=${id}&typename=${name}`
      });
    },
    toGoodsDetail(id) {
      wx.navigateTo({
        url: `../goodDetail/main?id=${id}`
      });
    },
    getBanners() {
      var _this = this;
      // 微信小程序请求数据
      wx.request({
        url: "http://localhost:4000/wxapigetBanners",
        header: {
          "content-type": "application/json"
        },
        success(res) {
          _this.banners = res.data;
        }
      });
    },
     getTypes() {
      var _this = this;
      // 微信小程序请求数据
      wx.request({
        url: "http://localhost:4000/wxapigetTypes",
        header: {
          "content-type": "application/json"
        },
        success(res) {
          _this.types = res.data;
          _this.types.map((item,index)=>{
            item.img = item.img.replace("\\","/")
            return (item.img = item.img.replace("\\","/"))
          })
        }
      });
    },
     getGoods() {
      var _this = this;
      // 微信小程序请求数据
      wx.request({
        url: "http://localhost:4000/wxapigetGoods",
        header: {
          "content-type": "application/json"
        },
        success(res) {
          _this.goods = res.data;
          _this.goods.map((item,index)=>{
            item.img = item.img.replace("\\","/")
            return (item.img = item.img.replace("\\","/"))
          })
        }
      });
    },
  },

  mounted(){
    this.getBanners();
    this.getTypes();
    this.getGoods();
  },

  created () {
  }
}
</script>

<style scoped>
  .search_box{
    width: 94%;
    height: 0.5rem;
    margin-left: 0.23rem;
    position: relative;
    margin-top:0.3rem;
    margin-bottom:0.3rem;
    font-size: 0;
  }
  .search_box img{
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    left: 0.2rem;
    top: 0.12rem;
  }
  .search_btn{
    width: 100%;
    height: 0.5rem;
    outline: none;
    border: none;
    background-color: rgb(235,236,236);
    border-radius: 0.5rem;
    text-indent: 0.6rem;
  }
  .search_box .cancel{
    display: inline-block;
    width: 0.3rem;
    height: 0.3rem;
    background: rgba(0,0,0,0.3);
    border-radius: 50%;
    text-align: center;
    font-size: 0.25rem;
    line-height: 0.3rem;
    color: white;
    position: absolute;
    top: 0.12rem;
    right: 0.2rem;
  }
.imgs {
  width: 100%;
  height: 150px;
}
.list{
  width: 100%;
  height: 160px;
  display: flex;
  flex-wrap: wrap;
}
.listLi{
  width: 20%;
}
.listLi .typeImg{
  width: 75px;
  height: 75px;
}
.styleList{
  width: 100%;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
}
.styleLi{
  width: 33.3%;
  text-align: center;
}
.active{
  color: #963137;
}
.styleLi img{
  width: 85%;
  height: 100px;
}
.likeList {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: #F5F5F5;
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
</style>
