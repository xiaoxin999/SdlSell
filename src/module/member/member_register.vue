<template>
  <div class="member-register join-membership-bg" id="member-register" style="overflow: hidden;">
    <div class="member-register-content">
        <div class="member-register-box">
            <span class="fl">手机号：</span>
            <input type="number" placeholder="请输入手机号" class="fl" maxlength="11" v-model="mobile" />
            <span class="fl sendCode" @click="sendSMS">
                <template v-if="isCode">
                    {{codeTime}}s
                </template>
                <template v-else>
                     发送验证码
                </template>
            </span>
        </div>
        <div class="member-register-box">
            <span class="fl">验证码：</span>
            <input type="number" placeholder="请输入验证码" class="fl" maxlength="4" v-model="code" />
        </div>
        <div class="member-register-box">
            <span class="fl">姓名：</span>
            <input type="text" placeholder="请输入姓名" class="fl" v-model="name" />
        </div>
        <div class="member-register-box">
            <span class="fl">性别：</span>
            <div class="selectSex fl">
                <template v-for="(i,item) in sexList">
                    <span :class="i.isOn  ? 'sexOn' : ''" @click="setSex(item)" :key="item">{{i.name}}</span>
                </template>>
            </div>
        </div>
        <div class="member-register-box">
            <span class="fl">生日：</span>
            <input type="text" placeholder = '选择时间' @click="handleDateShow" class="fl selectTime" readonly="readonly" id="date-selector-input" v-model="birthday"/>
        </div>
    </div>
    <div id="targetContainer"></div>
    <a href="javascript:void(0)" class="submit-Information" @click="registerMember">提交</a>
    <!-- <data-selector
        :type="0"
        :recent_time = "recent_time"
        :param = "param"
        :isShow = "isShow"
        @closeData = "closeData"
    ></data-selector> -->
    <transition name="fade">
        <component
            :recent_time = "recent_time"
            :param = "param"
            :is="dataSelectorComponent"
            :type="0"
            @closeData = "closeData"
        >
        </component>
    </transition>

</div>
</template>
<script>
import storage from "src/verdor/storage";
import utils from "src/verdor/utils";
import http from "src/manager/http";
import global from "src/manager/global";
import timer from "src/verdor/timer";

let code = utils.getQueryString("code")||'test';
let shopId = utils.getQueryString("shopId")||'61';
let reTime = null;
export default {
	data() {
		return {
			sexList: [
				{ name: "男", type: "1", isOn: true },
				{ name: "女", type: "2", isOn: false }
			],
			shopId: "", //shopId
			mobile: "", //手机号码
			code: "", //验证码
			name: "", //姓名
			sexType: "1", //性别
			birthday: "", //生日
			openId: "", //openId
			codeToken: "",
			isShow: false,
			isCode: false,
			codeTime: 60, //发送验证码后等待时间
			isWechatPay:storage.localData("wechatPay") == undefined
				? false
				: storage.localData("wechatPay"), // 是否转跳红桌台结账页面
			recent_time: [2000,1,1],
			param: [],
			dataSelectorComponent: ''
		}
	},
	methods: {
		setDate() {
		const dates = new Date();
		//   dates.setFullYear(dates.getFullYear() - 20);
		this.param = ['1900-' + dates.getFullYear(),'1-12','1-31']
		},
		handleDateShow(){
			this.dataSelectorComponent = 'data-selector';
		},
		closeData(val){
			this.dataSelectorComponent = ''
			if(val.type == 'makeSure'){
				this.birthday = val.data.join('-')
			}
		},
		setSex(i) {
		// 设置性别
			for (var j = 0; j < this.sexList.length; j++) {
				this.sexList[j].isOn = false;
				this.sexList[i].isOn = true;
				this.sexType = this.sexList[i].type;
			}
		},
		async sendSMS() {
		if (this.isCode == false) {
			if (this.mobile != "" && this.mobile.length == 11) {
                timer.clear(reTime);
				reTime = timer.add(() => {
					this.codeTime--;
					if(this.codeTime <= 0){
						timer.clear(reTime);
						this.isCode = false;
						this.codeTime =60;
					}
				},1000,60,false,() => {
					this.isCode = false;
					this.codeTime =60;
				})

				// 发送验证码
				let data = await http.sendSMS({data:{
					shopId: this.shopId,
					mobile: this.mobile,
					openId: this.openId
				}});
				this.isCode = true;
				this.codeToken = data.codeToken;
				if(data.memberData != null){
					this.mobile = data.memberData.mobile;
					this.name = data.memberData.name;
					this.sexType = data.memberData.gender;
					for (var j = 0; j < this.sexList.length; j++) {
						if (this.sexType == "2") {
							this.sexList[0].isOn = false;
							this.sexList[1].isOn = true;
						}
					}
				}
			}
		}
		},
		async registerMember() {
			if(!global.checkData(
				{
				mobile:{
					cond:"$$.trim()!=='' && this.mobile.match(/^[1][3,4,5,7,8][0-9]{9}$/)",
					pro:"请输入正确的手机号"
				},
				code:{
					cond:"$$.trim()!==''",
					pro:"请输入验证码"
				},
				name:{
					cond:"$$.trim()!==''",
					pro:"请输入姓名"
				},
				birthday:{
					cond:"$$.trim() !==''",
					pro:"请输入生日信息"
				}
				},this
			)) {
				return false;
			}
			let data = await http.registerMember({data:{
				shopId: this.shopId,
				mobile: this.mobile,
				openId: this.openId,
				gender: this.sexType,
				birthday: this.birthday,
				name: this.name,
				codeToken: this.codeToken,
				code: this.code
			}});
			if(this.isWechatPay){
				let wechatShop = storage.session("wechatShop");
				wechatShop.member = utils.deepCopy(data);
				storage.session("wechatShop", wechatShop);
				// this.$router.push("/weChatOnlinePay");
			}else{
				let membership =storage.session("membership") == undefined? {} : storage.session("membership");
				membership.member = data;
				storage.session("membership", membership);
				this.$router.push("/memberShipInfo");
			}
		},
		async getUserInfo(){
			let loginInfo = storage.session('login');
			let res = await http.getUserInfo({
				data: {
					shopId: this.shopId,
					type: 3,
					from: 0
				}
			})
			Object.assign(res,loginInfo)
			storage.session('membership',res);
			this.openId = res.openId;
		}
	},
	beforeDestory(){
		//   切换页面清除计时器
		timer.clear(reTime)
	},
	mounted() {
		this.setDate();
		this.shopId = utils.getQueryString('shopId') || 61;
		var userDate  = (storage.session('membership') == undefined) ? storage.session('wechatShop') : storage.session('membership');
		if(userDate){
			this.openId = userDate.openId;
		}else{
			this.getUserInfo()
		}
		utils.setTitle('会员注册');
	},
	components: {
		DataSelector: () => import (/*webpackChunkName: "dateselector" */ 'src/components/dateselector')
	}
};
</script>
<style scoped>
#member-register.join-membership-bg {
    background-image: url(../../res/images/join-membership-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #FFFFFF; }

#member-register {
    width: 100%;
    height: 100%;
    position: relative; }
#member-register.member-register:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); }
#member-register .submit-Information {
    position: fixed;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 1.25333rem;
    line-height: 1.25333rem;
    text-align: center;
    color: #FFFFFF;
    background-color: #000000;
    font-size: 0.42667rem;
    z-index: 6; }
#member-register .member-register-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 7.86667rem;
    height: 9.66667rem;
    background: rgba(0, 0, 0, 0.6);
    padding: 1.06667rem 0.53333rem;
    box-sizing: border-box;
    color: #FFFFFF;
    z-index: 7; }
#member-register .member-register-content .member-register-box {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    float: left;
    margin-bottom: 0.6rem; }
#member-register .member-register-content .member-register-box span:nth-child(1) {
    display: block;
    width: 1.6rem;
    height: 1rem;
    font-size: 0.37333rem;
    text-align: right; }
#member-register .member-register-content .member-register-box input {
    outline: none;
    padding: 0;
    border: none;
    background: transparent;
    border-bottom: 1px solid #FFFFFF;
    color: #FFFFFF;
    width: 3.33333rem;
    height: 1rem;
    box-sizing: border-box;
    font-size: 0.32rem;
    padding-left: 0.13333rem; }
#member-register .member-register-content .member-register-box .sendCode {
    display: block;
    width: 1.86667rem;
    height: 1rem;
    border: 1px solid #FFFFFF;
    text-align: center;
    box-sizing: border-box; }
#member-register .member-register-content .member-register-box .selectTime {
    display: block;
    width: 3.33333rem;
    height: 1rem;
    border: 1px solid #FFFFFF;
    text-align: center;
    color: #FFFFFF;
    font-size: 0.32rem;
    box-sizing: border-box; }
#member-register .member-register-content .member-register-box .selectSex {
    display: block;
    width: 3.33333rem;
    height: 1rem;
    border: 1px solid #FFFFFF;
    text-align: center;
    color: #FFFFFF;
    font-size: 0;
    box-sizing: border-box; }
#member-register .member-register-content .member-register-box .selectSex span {
        display: inline-block;
        width: 50%;
        height: 1rem;
        font-size: 0.32rem;
        text-align: center;
        border-left: 1px solid #FFFFFF;
    box-sizing: border-box; }
#member-register .member-register-content .member-register-box .selectSex span:first-child {
    border-left: none; }
#member-register .member-register-content .member-register-box .selectSex span.sexOn {
    background: url(../../res/images/sexon.png) 1.22667rem 0.57333rem no-repeat;
    background-size: 0.42667rem 0.4rem; }

#member-register .date-selector-locked {
    height: 100% !important;
    overflow: hidden !important;
}


 /* 时间选择样式 */
#member-register .date-selector-bg {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(75, 75, 75, 0);
    height: 100%;
    width: 100%;
    overflow: hidden;
    transition: all .3s ease;
    -webkit-transition: all .3s ease;
    z-index: -1;
}

#member-register .date-selector-bg-up {
    z-index: 999 !important;
    background: rgba(75, 75, 75, 0.65) !important;
}

#member-register .date-selector-container {
    width: 100%;
    height: 250px;
    position: absolute;
    bottom: 0;
    transform: translate3d(0, 250px, 0);
    -webkit-transform: translate3d(0, 250px, 0);
    left: 0;
    background-color: #FFF;
    transition: transform .3s ease;
    z-index: -1;
}

#member-register .date-selector-container-up {
    transform: translate3d(0, 0, 0) !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
}

#member-register .date-selector-btn-box {
    display: block;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: rgb(0,0,0);
    z-index: 10;
}

#member-register .date-selector-btn-box .date-selector-btn {
    position: absolute;
    display: inline-block;
    width: 50%;
    color: #fff;
    right: 0;
}

#member-register .date-selector-btn-box .date-selector-btn:nth-child(1) {
    left: 0;
    border-left: none;
    right: initial;
}

#member-register .date-selector-btn{
    border-left: 1px solid #fff;
    font-size: .42rem;
}

#member-register .date-selector-tab-box {
    display: inline-block;
    border-radius: 10px;
    margin: 9px 0;
    height: 32px;
    box-sizing: border-box;
    line-height: 30px;
    color: rgba(218, 218, 218, .7);
    background: #fff;
    border: 1px solid #fff;
}

#member-register .date-selector-tab-box .date-selector-tab {
    display: inline-block;
    padding: 0 10px;
    transition: all .3s ease;
}

#member-register .date-selector-tab-box .date-selector-tab:first-child {
    border-right: 1px solid #fff;
}

#member-register .date-selector-tab-box .date-selector-tab-active {
    color: #fff;
    border-radius: 10px;
    background: rgba(219, 219, 219, 1);
}

#member-register .date-selector-content-left {
    transform: translate3d(-100%, 0, 0) !important;
    -webkit-transform: translate3d(-100%, 0, 0) !important;
}

#member-register .date-selector-content-right {
    transform: translate3d(100%, 0, 0) !important;
    -webkit-transform: translate3d(100%, 0, 0) !important;
}

#member-register .date-selector-content {
    position: absolute;
    width: 100%;
    background: #fff;
    font-size: 0;
    top: 0;
    z-index: 10;
    transform: translate3d(0, 0, 0);
    transition: transform .3s ease;
}

#member-register .date-selector-content .date-selector {
    display: inline-block;
    height: 200px;
    overflow: hidden;
    position: relative;
    z-index: -1;
    top: 0;
    vertical-align: top;
}

#member-register .date-selector-content .date-selector-left {
    width: 33.33%;
}

#member-register .date-selector-content .date-selector-right {
    width: 50%;
}

#member-register .date-selector-content ul::-webkit-scrollbar {
    display: none;
}

#member-register .date-selector-content li {
    height: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    list-style: none;
}

#member-register .date-selector-content .date-selector-up-shadow, .date-selector-content .date-selector-down-shadow {
    width: 100%;
    height: 80px;
    position: absolute;
    pointer-events: none;
    background-image: linear-gradient(to bottom, #FFF, rgba(255, 255, 255, 0));
    z-index: 50;
}

#member-register .date-selector-content .date-selector-up-shadow {
    top: 0;
}

#member-register .date-selector-content .date-selector-down-shadow {
    bottom: 0;
    z-index: 50;
    background-image: linear-gradient(to top, #FFF, rgba(255, 255, 255, 0));
}

#member-register .date-selector-content .date-selector-line {
    width: 95%;
    height: 40px;
    position: absolute;
    top: 80px;
    left: 50%;
    pointer-events: none;
    box-sizing: border-box;
    /*border-top: 1px solid #DCDCDC;
    border-bottom: 1px solid #DCDCDC;*/
    transform: translate3d(-50%, 0, 0);
}
#member-register .date-selector-content .date-selector-line:after,.date-selector-content .date-selector-line:before{
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, #dbdbdb, #161616 , #dbdbdb); /* 标准的语法（必须放在最后） */
}
#member-register .date-selector-content .date-selector-line:before{
    bottom: 0;
}


</style>
