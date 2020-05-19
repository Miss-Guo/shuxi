<template>
  <div>
    <div class="goodlist">
      <div class="list" v-for="(item,index) in carts" :key="index" >
        <div class="fl">
          <checkbox :checked="item.flag" @click="item.flag = !item.flag"></checkbox>
        </div>
        <div class="fr">
          <p class="book_title">
            {{item.name}}
          </p>
          <p class="price">
            ￥{{item.price}}
          </p>
          <p class="num">
            <span class="minus"  @click="minus(index)">-</span>
            <span class="nums">{{item.num}}</span>
            <span class="add" @click="add(index)">+</span>
            
          </p>
          <!-- <span @click="del(index)">删除</span> -->
        </div>
        <div class="info">
            <img :src="'http://localhost:4000/'+item.img" :alt="item.name">
        </div>
      </div>
    </div>
      <div class="bottom">
        <checkbox class="fl" :checked="selectAll" @click="selected(selectAll)">全选</checkbox>
        <div class="fr">
          <span class="allsum">总计：</span>
          <span class="totalPrice">￥{{totalPrice}}</span>
          <span class="pay" @click="toPay(totalPrice)">结算</span>
        </div>
      </div>
      
    
  </div>
 
</template>

<script>

export default {
  data () {
    return {
     carts:[],
    }
  },

  computed:{
    // 商品状态决定全选状态
    selectAll(){
      return this.carts.every((item,index)=>{
        return item.flag
      })
    },
    totalPrice(){
      // 筛选flag为true的选项，返回新数组，并计算数值
      return this.carts.filter((item,index)=>{
        return item.flag
      }).reduce((prev,next)=>{
        return prev+Number(next.price*next.num)
      },0)
    }
  },

  methods: {
    add(i){
      if(this.carts[i].num<99){
        this.carts[i].num ++;
      }
    },
    minus(i){
      if(this.carts[i].num >1){
        this.carts[i].num --;
      }
    },
    // del(j){
    //   var _this = this
    //   wx.request({
    //     url:'http://localhost:4000/wxapiremoveCart',
    //     header:{
    //       'content-type':'application/json'
    //     },
    //     success(res){
    //       console.log(res)
    //       _this.carts.splice(j,1)
    //     }
        
    //   })
    // },
    toPay(totalPrice){
      var nickName = wx.getStorageSync("nickName")
      if(nickName){
        wx.navigateTo({
        url:`/pages/pay/main?totalPrice=${totalPrice}`
      })
      }else{
        wx.showModal({
          title:'登录提示',
          content:'您还没登录...',
          success(res){
            if(res.confirm){
              wx.switchTab({
                url:'/pages/user/main'
              })
            }
          }

        })
      }
      
    },
    // 全选状态决定商品状态
    selected(selectAll){
      var flag = selectAll
      this.carts.map((item,index)=>{
        return item.flag = !flag
      })
      flag = !flag
    },
    getCart(){
      var _this = this
      wx.request({
        url:'http://localhost:4000/wxapigetCart',
        header:{
          'content-type':'application/json'
        },
        success(res){
          console.log(res)
          _this.carts=res.data
          _this.carts.map((item,index)=>{
            item.img = item.img.replace('\\','\/')
            return  item.img = item.img.replace('\\','\/')
          })
          // vue的方法为每一项新增一个属性flag
          _this.carts.map((item,index)=>{
            _this.$set(item,'flag',true)
          })
          console.log(_this.carts)
        }
      })
    }
  },
  
  mounted(){
    this.getCart()
  },

  created () {
  }
}
</script>

<style scoped>
.fl{
  float: left;
}
.fr{
  float: right;
}
.goodlist{
  margin: 10px;
  border: 1px solid #F5F5F5;
  border-radius: 20px;
  box-shadow: 1px 1px 2px 2px #F5F5F5;
}
.list{
  height: 130px;
  border-bottom: 1px solid #F5F5F5;
}
.list .fl{
  height: 120px;
  line-height: 120px;
  font-size: 13px;
  color: white;
  margin-left: 10px;
  text-align: center;
}
.list .fr{
  width:210px;
  margin-top: 10px;
  margin-right: 10px;
}
.list .fr .book_title{
  overflow: hidden;
  font-size: 14px;
  line-height: 22px;
}
.list .fr .num span{
  width: 0.6rem;
  height: 0.5rem;
  display: inline-block;
  border: 0.01rem solid #d8d8d8;
  text-align: center;
  line-height: 0.5rem;
  font-size: 0.4rem;
}
.list .fr .num .nums{
  width: 1.2rem;
  font-size: 0.25rem;
  position: relative;
  bottom:0.07rem;
}
.list .fr .num .minus{
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.list .fr .num .add{
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
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
  line-height: 30px;
}
  
.list .info img{
  width: 70px;
  height: 80px;
  margin-top:20px;
  margin-left:15px;
}
.bottom{
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
}
.bottom .fl{
  margin-left: 2%;
  font-size: 13px;
  font-weight: bold;
}
.bottom .fr{
  float: right;
  margin-right: 10px;
  font-size: 14px;
}
.bottom .fr .allsum{
  color: #9B9B9B;
  display: inline-block;
  line-height: 40px;
}
.bottom .fr .totalPrice{
  color: #963137;
  display: inline-block;
  margin-right: 20px;
  line-height: 40px;
}
.bottom .fr .pay{
  width: 80px;
  height: 30px;
  display: inline-block;
  background-color: #963137;
  border-radius: 20px;
  color: white;
  text-align: center;
  line-height: 30px;
}
        
        
    
</style>
