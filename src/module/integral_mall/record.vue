<template>
	<div>
		<div class="container" id="record" v-cloak>
		    <div class="recerdTit">
		        <div class="comHead comHeadHig">
		            <span>已兑换商品记录</span>
		        </div>
		    </div>
		    <div class="comList" v-for="(com,i) in recordList" :key="i">
		        <span>
		            <div class="conListImg conListImgWid" @click="onUse(com)">
		            <img :src="hostImg + com.gimage" alt="兑换商品" />
		        </div>
		        <div class="conListContr conListContent">
		            <div class="comTits comGname" @click="onUse(com)">{{com.gname}}</div>
		            <div class="fl comTitsPrice" @click="onUse(com)">
		                <div class="cominte">
		                    <p class="fl">所需积分：{{com.price}}</p>
		                    <img src="../../res/images/exintegral.png" alt="所需积分" height="17" width="17" class="fl" />
		                </div>
		                <div :class="com.status == 1 ? 'comCode uCode' : 'comCode aCode'">劵码：{{com.code}}</div><br />
		            </div>
		            <div class="fl textSty">
		                <div class="conListInfo textInfo" @click="onUse(com)">
		                    <span class="noused" v-if="com.status == 0 && com.compare == false"></span>
		                    <span class="aused" v-if="com.status == 1"></span>
		                    <span class="expired" v-if="com.compare == true && com.status != 1"></span>
		                </div>
		                <a href="javascript:void(0);" class="moreDet fl" @click="openCom(com.gid)"></a>
		            </div>
		            <div class="comExpired textexpired" v-if="com.expire == 0" @click="onUse(com)">过期时间：永久</div>
		            <div class="comExpired textexpiredTime" v-else @click="onUse(com)">过期时间：{{com.expire}}</div>
		        </div>
		        </span>
		    </div>
		</div>
		<transition name="fade">
			<component
			    @winEvent = "winEvent"
				:height="'auto'"
				:width="70 + '%'"
				:is="showComponent"
			>
				<!-- <p slot="title">使用券码</p> -->
				<div class="recordForm recordFormContent" slot="content">
					<div class="fl fImg">
			            <img :src="codeUrl"/>
				    </div>
				    <p>{{codeStatus}}</p>
				    <p>{{showText}}</p>
				</div>
			    <!-- <span class="expired"></span> -->
			</component>
		</transition>
			
	</div>
</template>

<script>
    import Timer from 'src/verdor/timer'
	import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';

	export default {
		name: 'record',
		data(){
			return{
                recordList: [],
                code: '',
                showText: '',
                hostImg: '',
                codeUrl: '',
                codeStatus: null,
				datas: null,
				shopId:null,
				timer: null,
				gid: null,
				showComponent: ''
			}
		},
		methods: {
			winEvent(){   //  监听win组件的事件
				this.showComponent = '';
				Timer.clear(this.timer)
				this.timer = null;
				this.$store.commit("setOverHide",false)
			},
			onUse(com){    // 点击显示confirm弹框
				this.gid = com;
				this.getStatus()
				let code;
				for(var i = 0; i < this.recordList.length; i++) {
					if(this.recordList[i].id == com.id) {
						code = this.recordList[i].code;
					}
				}
				if(com.compare == false && com.status != 1){
                    this.showText = ''
					this.showComponent = 'win';
					this.$store.commit("setOverHide",true)
					this.codeStatus = com.code;
					this.getExchangeQR(code)
				}else{
					if(com.status == 1) {
						this.showWinError('该商品已兑换！')
					}
					if(com.compare == true) {
						this.showWinError('该商品已过期！')
					}
				}
			},
			getStatus(){
                this.timer = Timer.add(()=>{
                    http.getStatus({
						data:{
                            shopId: this.shopId,
                            exchangeId: this.gid.id
						}
					}).then((data)=>{
						if(data && data.status) {
							this.status = data.status;
							if(this.status == 2) {
								this.showText = "兑换成功";
								this.$store.commit('setWin',{
									content: '兑换成功!'
								})
								this.gainRecord();
							} else if(this.status == 1) {
								this.showText = "管理员已扫";
							} else if(this.status == 3) {
								this.deleteStatus();
							}
						}
					}).catch(err=>{
						this.$store.commit('setWin',{
							content: '接口报错了'
						})
						Timer.clear(this.timer)
						this.timer = null;						
					})
					
				},3000,0,true)
			},
			async deleteStatus(){
                let res = await http.deleteStatus({
					data: {
						shopId: this.shopId,
						exchangeId: this.gid.id
					}
				})
			},
			showWinError(content){   //  弹框类型判断方法
                this.$store.commit('setWin',{
					content: content,
					type: "alert"
				})
			},
			openCom(id){   //  进入详细页面
                storage.session('comId','');
                // storage.session('rComId', id);
                this.$router.push({path: '/detail',query:{'comId':id}})
			},
			async getUserInfo(shopId) {   //  获取登录信息
			    let loginInfo = storage.session('login');
                this.hostImg = global.getImgUrl();
                
                let res = await http.getUserInfo({
                	data: {
                		shopId: shopId,
	                    type: 3,
	                    from: 0
                	}
                	
                })
			    Object.assign(res,loginInfo)
                storage.session('wxInfo',res);
                this.gainRecord();
			},
			async gainRecord(){
                let res = await http.getListByMid({   //  获取列表展示数据
                	data: {
                		shopId: this.shopId,
                        page: 1,
                        num: 20
                	}
                },false,true)
                this.recordList = res.data.list;
                this.datas = utils.format(new Date(Number(res.time) * 1000),'yyyy-MM-dd');
                for(let i = 0;i < this.recordList.length; i++){
                    if(this.recordList[i].expire != 0) {
                        this.recordList[i].expire = utils.format((new Date(Number(this.recordList[i].expire) * 1000)),'yyyy-MM-dd');
                        this.recordList[i].compare = new Date(this.recordList[i].expire) < new Date(this.dates);
                    } else {
                        this.recordList[i].compare = false;
                    }
				}
				// Timer.clear(this.timer)
			},
			async getExchangeQR(code){   //  获取弹框img  url 地址
				let res = await http.getExchangeQR({
					data:{
						shopId: this.shopId,
						code: code
					}
				})
				this.codeUrl = res.url;
			}
		},
	    mounted() {
			let userDate = storage.session('wxInfo');
			let shopId = utils.getQueryString('shopId')||61;
			let code = utils.getQueryString('code');
			this.shopId = shopId;
            if(!userDate) {
                this.getUserInfo(shopId,code)
            }else{
                this.hostImg = global.getImgUrl();
	            this.fid = userDate.fid;
	            this.Token = userDate.accessToken;
	            this.gainRecord()
			}

			utils.setTitle('已换商品');
		},
		destroyed(){
			Timer.clear(this.timer)
			this.timer = null;
			
		},
	    components: {
	    	win: () => import ( /* webpackChunkName: "win" */ 'src/components/phone/win' ),
		}
	}
</script>

<style lang="less" scoped>
    .whiteSpace(){
    	white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
    }
    .texttype{
    	text-align: center;
		height: 30px;
		line-height: 30px;
		font-size: 24px;
		float: left;
		width: 100%;
    }
	.container{
		.recerdTit{
			.comHeadHig{
				top:24px;
			}
		}
		.comList{
            .conListImgWid{
            	width: 35%;
            }
            .conListContent{
            	width: 65%;
            	.comGname{
            		font-size: 14px;
            		color: #737373;
            		height: 25%;
            		width: 100%;
            		.whiteSpace;
            	}
            	.comTitsPrice{
            		height: 50%;
            		width: 50%;
            	}
            	.textSty{
            		height: 50%;
            		width: 50%;
            		.textInfo{
                        width: 70%;
            		}
            		a{
            			width: 30%;
            			height: 100%;
            		}
            	}
            	.textexpired{
            		color: #737373;
            		height: 25%;
            	}
            	.textexpiredTime{
            		color: #737373;
            	}
            }
		}
	}
	.recordFormContent{
		display: flex;
		flex-direction: column;
		padding-top: 27px;
		align-items: center;
		width: 70%;
		margin: 0 auto;
		text-align: center;
		font-size: 24px;
		.fImg{
			width: 100%;
			height: 140px;
			img{
                height: 100%;
			} 
		}
		p:nth-child(1){
			.texttype;
			color: green;			
		}
		p:nth-child(2){
			.texttype;
		}
	}
</style>