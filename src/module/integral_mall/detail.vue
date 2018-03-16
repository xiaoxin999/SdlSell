<template>
	<div id="detail">
		<div class="container"  v-cloak>
		    <div class="comBanner">
		        <img :src="hostImg + imageName" alt="商品banner" />
		    </div>
		    <div class="comDinfo productname">
		        <div class="comTit">产品名称：<span>{{name}}</span></div>
		        <div class="comNums">
		            <div><img src="../../res/images/exintegral.png" alt="兑换所需积分" class="fl" /><span>所需：{{price}}积分</span></div>
		            <div><img src="../../res/images/surplus.png" alt="剩余库存数量" class="fl" /><span>剩余：{{inventory}}份</span></div>
		        </div>
		        <div class="biggestcount" v-if="num > 0">最大兑换数量: {{num}}</div>
		    </div>
		    <div class="comSummary">
		        <div class="comsTits">
		            <h1>商品简介</h1>
		        </div>
		        <div class="conConts" v-html="description" id="conConts"></div>
		    </div>
		    <a href="javascript:void(0);" class="comBnt" @click="exchangeCom" v-if="point >= price && maxExchange">立即兑换</a>
		    <a href="javascript:void(0);" class="ofIntegral" v-else>积分不足,快去赚积分吧!</a>
		    <a href="javascript:void(0);" class="ofIntegral" v-if="inventory == 0 && maxExchange">今天被抢光啦,补货中!</a>
		    <a href="javascript:void(0);" class="ofIntegral" v-if="maxExchange == false">您已兑换</a>
		</div>
	</div>
</template>

<script>
	import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
	var userDate = storage.session("wxInfo");

	export default {
		name: 'detail',
		data(){
			return {
                name: '',
                hostImg: '',
                imageName: '',
                price: null,
                inventory: null,
                num: null,
                point: null,
                maxExchange: true,
                uid: null,
                description: '',
                details: [],
                mid: null
			}
		},
        methods: {
            async detailList(){
            	let data = await http.getDetail({
            		data:{
            			shopId: this.shopId,
                        mid: this.mid,
                        id: this.uid
            		}
            	})
            	this.name = data.name;
                this.price = Number(data.price);
                this.inventory = Number(data.inventory);
                this.imageName = data.imageName;
                this.num = Number(data.limit);   // 最大兑换数量
                if(Number(this.num) != 0) {
                    this.maxExchange = Number(data.count) < this.num;
                }
                this.description = utils.htmlspecialchars_decode(data.description);
			},
            exchangeCom(){
            	if(Number(this.point) >= Number(this.price)){
                    this.$store.commit("setWin",{title:"确认购买",content:`您将消耗${this.price}积分，是否兑换此产品？`,type:"confirm",callBack:(str)=>{
	            		if(str === 'ok'){
							this.addExchange()
	            		}
	            	}});
            	}else{
            		this.$store.commit("setWin",{title:"adssd",content:`提示信息, 积分不足,快去赚积分吧！`,type:"alert"});
            		setTimeout(()=>{
	                	this.$router.push('/intergralMall')
	                },1000)
            	}
            },
            async addExchange(){
                let res = await http.addExchange({
                	data: {
                		shopId: this.shopId,
                        mid: this.mid,
                        gid: this.uid
                	}
                })
                this.$store.commit('setWin',{
					content: '兑换成功,去兑换记录使用吧！',
					type: 'alert',
					showBtn: false
				})
                this.inventory = res.inventory;
                userDate.point = res.point;
                storage.session('wxInfo', userDate);
                setTimeout(()=>{
                	this.$router.push('/intergralMall')
                },1000)
            }
        },

		mounted(){
	        this.shopId = userDate.shopId;
	        this.mid = userDate.mid;
	        this.hostImg = global.getImgUrl();
	        this.point = Number(userDate.point);
	        this.Token = userDate.accessToken;
	        this.uid = this.$route.query.comId;
	        if(this.uid === undefined){
				this.$router.push('/intergralMall')
	        }
	        this.detailList()
            utils.setTitle('商品详情');
		}
	}
</script>

<style lang="less" scoped>
	#detail{
		.container{
			.productname{
                height: auto;
			}
			.biggestcount{
				height: 35px;
				line-height: 35px;
				width: 100%;
				font-size: 14px;
				color: #999;
			}
		}
		.shade{
			position: fixed;
			left:0;top:0;
			z-index: 99;
			background: rgba(0,0,0,0.5);
			height: 100%;
			width: 100%;
			display: none;
			color: #666;
			.success{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				background-color:#f7f7f7;
				width: 80%;
				height: 100px;
				line-height: 100px;
				text-align: center;
				font-size: 14px;
				display: none;
			}
			.error{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
				width: 80%;
				background-color:#f7f7f7;
				height: 100px;
				line-height: 100px;
				text-align: center;
				font-size: 14px;
				display: none;
			}
		}
	}
</style>