<template>
<div class="container" id="app" v-cloak>
    <header>
        <span>
            <div class="items">
                <img src="../../res/images/icno1.png" class="fl" alt="积分" />
                <span class="fl"><span class="labels">{{point}}</span>&nbsp;积分</span>
            </div>
        </span>
        <span>
            <div class="items" @click="openRecord">
               <img src="../../res/images/icon3.png" class="fl" alt="兑换记录" />
               <span class="fl">兑换记录</span>
            </div>
        </span>
    </header>
	<div class="contenr">
	    <div class="swiper-container" v-show="bannberList.length >= 1">
	        <div class="swiper-wrapper">
	            <div class="swiper-slide" v-for="(item,index) in bannberList" :key="index"><img :src="hostImg + bannber.fileName" :alt="item.bannerName" /></div>
	        </div>
	    </div>
	    <div class="affiche helpsb">
	        <!--<p>每邀请一个好友就会增加<b class="labels">{{spreader}}</b>积分哦</p>-->
	        <p id="js-shopNotice"></p>
	    </div>
	    <div class="comBox">
	        <div class="comHead">
	            <span>积分商品兑换</span>
	        </div>
	        <div class="comConter">
	            <div v-for="(goods,i) in goodLists" @click="openDet(goods.id)" :key="i">
	                <div class="imgBox">
	                    <img v-bind:src="hostImg + goods.imageName" />
	                </div>
	                <div class="comInfo">
	                    <div class="comTitle">{{goods.name}}</div>
	                    <div class="comNum">
	                        <div>
	                            <p class="fl">所需积分：{{goods.price}}</p>
	                            <img src="../../res/images/exintegral.png" class="fr" />
	                        </div>
	                    </div>
	                    <div class="comNum otherlist">
	                        <div>
	                            <p class="fl">剩余数量：{{goods.inventory}}</p>
	                            <img src="../../res/images/surplus.png" class="fr" />
	                        </div>
	                    </div>
						<div class="comFooter" v-if="Number(goods.inventory) == 0">
	                        <p >商品数量不足！</p>
	                    </div>
						<div class="comFooter" v-if=" Number(goods.inventory) > 0 && point <= Number(goods.price)">
	                        <p>现有积分不足,快去赚吧！</p>
	                    </div>
	                    <div class="comFooter" v-if="point >= Number(goods.price) && Number(goods.inventory) > 0 ">
	                        <a href="javascript:void(0);" class="fr">去兑换>></a>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	    <!--<p>{{version}}</p>-->
	</div>
</div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';

	export default {
		name: 'mainbody',
		data() {
			return {
                goodLists: [],
                hostImg: [],
                point: null,
                spreader: [],
                loaddding: true,
                bannberList: [],
                shopNotice: [],
                version:'',
                shopId: 0
			}
		},
		methods: {
			openRecord(){
                this.$router.push('/record')
			},
			openDet(id){
                this.$router.push({path:'/detail',query: {'comId':id}})
			},
			async get(shopId) {
				let loginInfo = storage.session('login');
                
                let res = await http.getUserInfo({
                	data: {
                		shopId: shopId,
	                    type: 3,
	                    from: 0
                	}
				})
				Object.assign(res,loginInfo);
				this.point = res.point;
                storage.session('wxInfo',res);
                this.comList();
			},
			async comList(){
				let data = await http.getListByWeixin
				({
					data:{
						shopId: this.shopId,
                        page: 1,
                        num: 20
					}
				})
				this.goodLists = data.list;
			}
		},
		mounted(){
			let userDate = storage.session('wxInfo');
			let shopId = utils.getQueryString('shopId')||61;
			this.shopId = shopId;
			this.hostImg = global.getImgUrl();
			
            if(userDate) {
                
				this.point = userDate.point;
				this.spreader = userDate.spreader;
				if (userDate.shopNotice != null) {
					this.shopNotice = utils.line2br(userDate.shopNotice);
				}
				this.comList()
            }else{
                this.get(shopId)
			}
			utils.setTitle('积分商城');
		}
	}
</script>

<style lang="less" scoped>
	.container{
        padding-top: 50px;
        .contenr{
            .helpsb{
            	height: auto;
            	p{
            		height: auto;
					padding: 0 20px;
            	}
            }
            .otherlist{
				margin-bottom: 5px;
				
            }
        }
	}
</style>