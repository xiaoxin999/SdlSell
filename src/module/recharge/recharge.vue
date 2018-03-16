<template>
  <div id="membership">
	<div class="head">
		<span>会员储值权益</span>
		<img src="../../res/images/crown.png"/>
	</div>
	<!-- 券 -->
	<div class="coupon" v-if = "!loading">
		<div class="list" v-for ="(item,index) in storedList" :key="index">
			<div class="list_t">
				<div class="list_l">
					<span v-if="item.payment.length < 7 ">￥{{item.payment}}</span>
					<span style="font-size: 0.5rem;" v-if="item.payment.length > 6 && item.payment.length < 10 ">￥{{item.payment}}</span>
					<span style="font-size: 0.4rem;" v-if="item.payment.length > 9 && item.payment.length < 12 ">￥{{item.payment}}</span>
				</div>
				<div class="list_r">
					<p>{{item.name}}</p>
					<a href="javascript:;" @click="pay(item)">立即购买</a>
				</div>
			</div>
			<div class="list_b" @click = "openSchemeDetail(item)">
				<span class="disc"></span>
				<div class="sp">
					<span>包含{{item.payment}}+{{item.giftPoint}}积分{{getcoupon(item.couponIds)}}</span>	
				</div>
				<img src="../../res/images/more.png"/>
			</div>
		</div>
		<!-- 无方案的情况下 -->
		<div class="noList" v-if="storedList.length == 0">
			-暂无充值方案-
		</div>
	</div>
	<!-- loading -->
	<div class="spinner" v-if="loading">
		<div class="double-bounce1"></div>
		<div class="double-bounce2"></div>
	</div>
</div>
</template>
<script>
import storage from "src/verdor/storage";
import utils from "src/verdor/utils";
import http from "src/manager/http";
import global from "src/manager/global";

let code = utils.getQueryString("code") || "test";
let shopId = utils.getQueryString("shopId") || "61";

export default {
  data() {
    return {
      token: " ", //token
      shopId: "", //店铺id
      shopName: "",
      code: "", //全局的code 只能用一次
      storedList: "",
      openId: "",
      payType: "", //支付方式
      infoData: "", //支付信息
      loading: true
    };
  },
  methods: {
    async getUserInfo() {
      //获取用户的信息
		let data = await http.getUserInfo({data: {
				shopId: shopId,
				from: 0,
				type: 3
		}});
		if (!data.member) {
				this.$store.commit("setWin",{title:"操作提示",content:"您还不是会员,确认后跳转至会员注册",type:"alert",callBack:()=>{
				this.$router.push("/memberRegister");
			}});
			return false;
		}
		this.shopName = data.shopName;
		storage.session("shopName", data.shopName);
		storage.session("shopList", data.shopList);

    },
    async getList() {
      
        let data = await http.getRechargeConfig({data: {
            shopId: shopId
        }});
        this.storedList = data; //获取储值的类表内容
        this.loading = false;
    },
    getcoupon(arr) {
		let couponDetail = "";
		if (arr.length == 0) {
			couponDetail = "";
		} else {
            for (var i = 0; i < arr.length; i++) {
                couponDetail += "+" + arr[i].name + arr[i].num + "张";
            }
		}
		return couponDetail;
    },
    openSchemeDetail(scheme) {
      // 点击对应的方案查看详情
        storage.session("schemeDetail", scheme);
        this.$router.push("/rechargeDetail");
    },
    async pay(item) {
        //调起支付
        
        let data = await http.wechatRecharge({data: {
            planId: item.id,
            payType: this.payType,
            openId: this.openId||"",
            shopId: this.shopId
        }});
        this.infoData = data
        this.callpay();
    },
    jsApiCall() {
        setTimeout(() => {
            WeixinJSBridge.invoke("getBrandWCPayRequest", this.infoData, (res) => {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    //关闭微信游览器
                    WeixinJSBridge.invoke("closeWindow", {}, function(res) {});
                } else {
                    this.$store.commit('setWin',{content: "支付失败"});
                }
            });
        }, 1000);
    },
    callpay(data) {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener("WeixinJSBridgeReady",this.jsApiCall,false);
            } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", this.jsApiCall);
                document.attachEvent("onWeixinJSBridgeReady", this.jsApiCall);
            }
        } else {
            this.jsApiCall();
        }
    },
    async getZxcode() {
        
        let res = await http.payUrl({data: {
            shopId: this.shopId,
            type: 4
        }});
        
        if (res == "wx") {
            this.payType = "wx"; //给paytype赋值
            storage.session("payType", "wx");
            return false
        } else {
            window.location.href = res; //跳转到支付链接
        }
    },
    async getOpenId() {
        let res = await http.getOpenId({data: {
            code: code,
            shopId: this.shopId,
            payType: this.payType
        }});
        this.openId = res;
        storage.session("openId", res);
    }
  },
   mounted() {
    this.code = code;
    this.shopId = shopId;
    this.openId = storage.session("openId");
    this.payType = utils.getQueryString('payType');
    if(!storage.session("shopName") && storage.session("shopList")){
        this.getUserInfo()
    }
    if(!this.payType){
        this.getZxcode();
        
    }else{
        if (this.payType == "zx" && !this.openId) {
            this.getOpenId();
        }
    }
    this.getList();
    utils.setTitle("购买会员权益"); 
  }
};
</script>
<style lang="less" scoped>
@import '../../res/css/base.less';
#membership {
    width:100%;
    height:100%;
    .head {
        width:100%;
    height:1.52rem;
        background: url("../../res/images/saoma-bg.jpg") left top;
        line-height: 1.52rem;
        span {
            padding-left: 0.75rem;
            font-size: 0.4rem;
            color: #fff;
            margin-right: 0.18rem;
        }
        img {
            display: inline-block;
            width:0.43rem;
            height:0.3rem;
        }
    }
    .coupon {
        width:100%;
    height:100%;        
        position: relative;
        .noList {
            width:100%;
    height:1.52rem;         
            font-size: 0.48rem;
            color: #6c6c6c;
            text-align: center;
            line-height: 1.52rem;
            font-weight: bold;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
        .list {
            width:9.17rem;
    height:3.3rem;
            border-radius: 0.13rem;
            margin: 0.29rem 0.4rem 0 0.4rem;
            border: 1px solid #e4e4e4;
            .list_t {
                    width:9.17rem;
                    height:2.18rem;
                .list_l {
                    width:3.38rem;
                    height:2.18rem;
                    text-align: center;
                    line-height: 2.18rem;
                    float: left;
                    span {
                        font-size: 0.8rem;
                        color: #febe33;
                    }
                }
                .list_r{
                    width: 5.76rem;
                    height: 2.18rem;
                    float: right;
                    box-sizing: border-box;
                    p {
                        width: 100%;
                        height: 0.5rem;
                        font-size: 0.41rem;
                        color: #000;
                        width: 100%;
                    height: 0.5rem;
                        .text-overflow();
                        margin: 0.4rem 0 0.38rem 0;
                    }
                    a {
                        width: 2.26rem;
                        height: 0.68rem;
                        display: block;
                        background: #febe33;
                        border-radius: 0.05rem;
                        text-align: center;
                        line-height: 0.68rem;
                        color: #fff;
                        font-size: 0.32rem;
                    }
                }
            }
            .list_b {
                 width: 9.17rem;
                        height: 1.15rem;
                background: #e4e4e4;
                line-height: 1.15rem;
                padding: 0 0.38rem 0 0.5rem;
                box-sizing: border-box;
                border-radius: 0 0 0.13rem 0.13rem;
                .sp {
                    line-height: 1.15rem;
                    float: left;
                }
                .disc {
                    width: 0.1rem;
                        height: 0.1rem;
                    display: block;
                    background: #767676;
                    border-radius: 100%;
                    float: left;
                    margin: 0.55rem 0;
                }
                span {
                    display: block;
                     width: 7.38rem;
                        height: 1.15rem;
                    .text-overflow();
                    font-size: 0.26rem;
                    color: #767676;
                }
                img {
                    width: 0.17rem;
                    height: 0.3rem;
                    float: right;
                    margin: 0.41rem 0;
                }
            }
        }
    }
    .spinner {
        width: 1.5rem;
        height: 1.5rem;
        position: relative;
        margin: 6.5rem auto;
        .double-bounce1,
        .double-bounce2 {
            width:100%;
            height:100%;
            border-radius: 50%;
            background-color: #67cf22;
            opacity: 0.6;
            position: absolute;
            top: 0;
            left: 0;
            -webkit-animation: bounce 2s infinite ease-in-out;
            animation: bounce 2s infinite ease-in-out;
        }
        .double-bounce2 {
            -webkit-animation-delay: -1s;
            animation-delay: -1s;
        }
    }
}
@-webkit-keyframes bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}
@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
