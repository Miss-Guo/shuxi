<template>
  <div>
    <p class="text">支付金额：</p>
    <p class="dollar">￥{{totalPrice}}</p>
    <div class="bottom">
      <div class="carts" @click="payOff(1)" type="warn">支付宝支付</div>     
      <div class="buy" @click="payOff(2)" type="primary">微信支付</div>
      <div class="inCarts" @click="payOff(3)">银联支付</div>
    </div>
    

  </div>
 
</template>

<script>

export default {
  data () {
    return {
     totalPrice:""
    }
  },

  methods: {
    payOff(query){
      wx.showLoading({
        title:"正在跳转支付..."
      })
      var title =''
      var content = ''
      if(query == 1){
        console.log("支付宝支付")
        title="支付宝支付"
        content="欢迎来到支付宝支付"
      }else if(query == 2){
        console.log("微信支付")
        title="微信支付"
        content="欢迎来到微信支付"
      }else{
        console.log("银联支付")
         title="银联支付"
         content="欢迎来到银联支付"
      }
      setTimeout(function() {
            wx.hideLoading();
            wx.showModal({
              title,
              content,
              confirmText:'马上支付',
              cancelText:'稍后支付',
              success(res) {
                
                if (res.confirm) {
                  console.log("支付成功");
                } else if (res.cancel) {
                  console.log("稍后支付");
                }
              }
            });
    },1000)
    }

    
    
  },

  mounted(){
    console.log(this.$root.$mp.query);
    var query = this.$root.$mp.query
    this.totalPrice = query.totalPrice
  },

  created () {
  }
}
</script>

<style scoped>
.text{
  text-align: center;
  font-size: 0.5rem;
  margin: 0.5rem;
}
.dollar{
  font-size: 0.6rem;
  margin: 0.5rem ;
  text-align: center;
  color: #963137;
}
.bottom{
  width: 40%;
  margin: 0 auto;
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
