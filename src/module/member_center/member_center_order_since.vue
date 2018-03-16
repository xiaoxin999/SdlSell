<template>
    <div id="order-since">
			<div class="con" :class="{'opacity':orderDetail.status == 7}">
				<div class="qrcode">
					<img :src="imgSrc"/>
				</div>
				<p>{{orderDetail.oid}}</p>
				<div class="content">
					<div class="detail">所属商家：{{orderDetail.name}}</div>
					<div class="detail">支付时间：{{getTime(orderDetail.createTime)}}</div>
					<div class="detail" v-if="orderDetail.getTime">自提时间：{{orderDetail.getTime}}</div>
					<div class="mark" v-if="orderDetail.status == 7">
						<div class="innermark">
							<div class="innertext">已领取</div>
						</div> 
					</div>
				</div>
			</div>
			<div class="det">
				 <div class="title">
				 	<div class="lidiv"></div><span>商品详情</span>
				 	<span style="float: right;font-size: 0.4rem;margin-right: 0.5rem;color: #d0021b;">¥{{orderDetail.price}}</span>
				 </div>
				<ul>
					<li v-for="(item,index) in goodList" :key='index'><div class="litext">{{item.goodsName}}</div> <span>x{{item.num}}</span></li>
				</ul>
				 <ul>
				 	<template v-for="(item,index1) in packageList">
				 		<li :key='index1'><div class="litext">{{item.packageName}}</div> <span>x{{item.num}}</span></li>
				 		<div v-if="item.goods.length > 0"  :key="index1+'_bot'" style="line-height: 0.6rem;width: 100%;height: auto;background-color: #EFEFEF; overflow: hidden;">
				 			<template v-for="(g,index2) in item.goods">
						 		<div :key="index2+'_bot1'" style="float:left;width: 7rem;height: 0.6rem;margin-left: 1rem;">
						 			{{g.name}}
						 		</div>
						 		<div :key="index2+'_bot2'" style="float:right;width: 1rem">
						 			x{{g.num}}
						 		</div>
				 		</template>
				 	</div>
				 	</template>
				 </ul>
			</div>
		</div>
</template>

<script>
    import utils from "src/verdor/utils";
    import storage from "src/verdor/storage";

    export default{
        data(){
            return{
                goodList:[],
				packageList:[],
				orderDetail:"",
				imgSrc:""
            }
        },
        methods:{
            getTime:function (time) {
					return utils.format(new Date(Number(time) * 1000),'yyyy-MM-dd hh:mm');
            },
            getCode:function () {
                var urls = 'http://zishi.ishandian.com.cn/weixin/weixin/showImg?oid=';
                urls+=this.orderDetail.shopId+"_";
                urls+=this.orderDetail.oid
                this.imgSrc = urls;
            }
        },
        mounted(){
            var info = storage.session("dx-sineDetail");
				
			utils.setTitle("自提单");
            this.goodList = info.goodsData.goods;
            this.packageList = info.goodsData.package;
            this.orderDetail = info;
            this.getCode();
        }
    }
</script>

<style lang='less'>
    #order-since{
        .con{width: 100%;background-color: #FFFFFF;padding-top: 1.34rem;}
        .det{width: 100%;background-color: #fff;margin-top: .6rem;overflow: hidden;}
        .qrcode{width: 4.48rem;height: 4.48rem;margin: auto;margin-bottom: .4rem;}
        .qrcode img{width: 100%;height: 100%;}
        p{text-align: center;font-size: 0.52rem;margin-bottom: .8rem;}
        .content{width: 100%;padding-bottom: 1rem;position: relative; /*background-color: #d7d7d7;*/}
        .detail{margin: .15rem .4rem; font-size: .4rem;}
        .mark{width: 1.86rem;height: 1.86rem;position: absolute;right: .4rem;top: 0rem;border: solid .1rem orange;border-radius: 50%;}
        .innermark{margin: auto; position: absolute;left: 0;right: 0;top: 0;bottom: 0; width: 1.6rem;height: 1.6rem;border: .05rem solid orange;border-radius: 50%;}
        .innertext{width: 1.5rem;height: .6rem;margin: auto; position: absolute;left: 0;right: 0;top: 0;bottom: 0;text-align: center;line-height: .6rem; font-size: .42rem;color: lightsalmon; transform:rotate(-30deg); }
        .title{font-size: .5rem;height: 1.26rem;border-bottom: solid 1px #DCDCDC; }
        .title>span{font-size: .5rem;line-height: 1.26rem;}
        li{width: 92%; margin:.1rem 4%;list-style: none;font-size: .4rem;height: 1.26rem;line-height: 1.26rem; border-bottom: solid 1px #DCDCDC;float: left; }
        .litext{width: 92%; height: 1.26rem;float: left; overflow: hidden; text-overflow: ellipsis;}
        li>span{width: 5%; display: block;float: right;text-align: right;}
        li:last-child{border-bottom: none;}
        .opacity{opacity: 0.5;}
        .lidiv{float: left; width: 0.1rem;height: 0.38rem;background-color: cornflowerblue;margin-top: .46rem; margin-right:.15rem ;margin-left: .4rem;}

    }
    
</style>
