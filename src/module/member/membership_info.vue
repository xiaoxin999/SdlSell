<template>
<div class="membership-info" id="membership-info" v-cloak style="overflow: hidden;">
    <div class="membership-info-header">
        <div class="membership-info-sculpture">
            <div class="membership-info-icon" @click="openPersonal()">
                <div class="head-sculpture">
                    <img :src="headSculpture" />
                </div>
            </div>
        </div>
        <div class="membership-info-content">
            <div class="membership-content-name"><span>{{memberInfo.name}}</span><i @click="openPersonal()"></i></div>
            <div class="membership-content-wel">
                <p>您好，{{shopName}}会员！</p>
            </div>
        </div>
        <!-- <div class="integral-presentation" v-if="isMembership && type == '1' && highestRank == false">
            <p v-if="pointConfig.status == '1'">消费{{pointConfig.cash}}元可以获得{{pointConfig.point}}积分</p>
            <p>您距离{{nextLeveName}}还需消费{{nextLevePrice}}元</p>
        </div>
        <div class="integral-presentation" v-if="highestRank">
            <p v-if="membership.length >= 1">注册时间:{{membership.createTime}}</p>
            <p>消费{{pointConfig.cash}}元可以获得{{pointConfig.point}}积分</p>
            <p v-if="membership.length >= 1">您已是最高等级</p>
        </div>
        <div class="integral-presentation" v-if="type == '2' && highestRank == false">
            <p>在这里可以看到您的会员消费记录哦~</p>
        </div> -->
    </div>

    <div class="membership-options">
        <span @click="openIntegralAndBalance('1')">我的积分：<b>{{memberInfo.point}}</b></span>
        <!-- <span @click="openIntegralAndBalance('2')">余额：<b>{{memberInfo.totalAmount}}</b></span> -->
        <span @click="openMemberCards()">我的卡包：<b>{{memberInfo.cardTotal}}</b></span>

    </div>
    <div class="membership-qrcode">
        <img :src="qrcodeUrl" />
    </div>
    <div class="membership-cue">
        <p>注册时间:{{memberInfo.createTime}}</p>
        <p>请在结账前扫描您的专属会员卡二维码</p>
        <p>每次消费均可积分哦～</p>
        <a href="javascript:void(0)" class="refurbish" @click="getMemberQrCode">刷新二维码</a>
    </div>
</div>
</template>
<script>
import stroage from "src/verdor/storage";
import utils from "src/verdor/utils";
import http from "src/manager/http";
import global from "src/manager/global";

let shopId = utils.getQueryString("shopId") || "61";

export default {
	data() {
		return {
			memberInfo: {}, //会员信息
			level: {}, //会员等级
			uploadUrl: "", //url
			levelImg: {}, //会员背景url
			qrcodeUrl: "", //二维码url
			levelName: "", //会员等级
			cardsLenth: '', //卡数量
			openId: '', //openId
			memberCardsInfo: "", ///会员卡信息
            headSculpture: '', //头像
            shopName: ''
		};
	},
	computed:{
		setImg(){
			return {background:"url(" + this.levelImg + ")"}
		}
	},
	methods: {
		transFormData(t) {
		// 转换时间
			var d = new Date(Number(t + "000"));
			return utils.format(d, "yyyy-MM-dd");
		},
		openIntegralAndBalance(type) {
			// 跳转至积分 and 余额页面 根据type判断 1为积分 2为余额
			stroage.session('type',type);
			this.$router.push("/memberIntegral");
		},
		openMemberCards() {
            this.$router.push('/memberCards');
        },
		async getMemberQrCode() {
			let datas = stroage.session("membership")
			let data = await http.getMemberQrCode({
				data: {
					shopId: datas.shopId,
					mobile: datas.member.mobile,
					openId: datas.member.openId,
					mid: datas.member.memberId
				}
			});
			this.qrcodeUrl =global.host +"common/qrcode?format=json&text=" + data + "&" + "size=10";
		},
		openPersonal: function() {
			this.$router.push('/personalInfo');
		},
	},
	mounted() {
		let datas = stroage.session("membership");
		this.memberInfo = datas.member; //取出session中的信息
        this.level = this.memberInfo.level;
        this.shopName= datas.shopName;
		this.uploadUrl = global.getImgUrl();
		this.headSculpture = datas.imageUrl;
		this.memberInfo.createTime = this.transFormData(this.memberInfo.createTime)
		if (this.level != undefined) {
			this.levelImg = this.uploadUrl  + this.level.imgName;
			this.levelName = this.level.name;
		}
		this.getMemberQrCode();
		utils.setTitle("会员信息");
	}
};
</script>
<style scoped>

.membership-info-header {
    width: 100%;
    background-image: url(../../res/images/member-integral-bg.png);
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    overflow: hidden;
}

.membership-info-header:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.membership-info-header .membership-info-sculpture {
    width: 100%;
    height: 3.37334rem;
    box-sizing: border-box;
    z-index: 2;
    position: absolute;
}

.membership-info-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
}

.membership-info-icon>.head-sculpture {
    box-sizing: border-box;
    width: 2.973334rem;
    height: 2.973334rem;
    border: 2px solid #b0b0b0;
    border-radius: 50%;
    padding: 0.173334rem;
    position: relative;
}

.membership-info-icon>.head-sculpture img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    -webkit-border-radius: 50%;
}

.membership-info-icon>.head-sculpture:after {
    content: "";
    position: absolute;
    right: -0.64rem;
    top: 0;
    background: url(../../res/images/member-integral.icon.png) no-repeat;
    background-size: 0.92rem 0.82667rem;
    width: 1rem;
    height: 0.93333rem;
}

.membership-info-content {
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient:vertical;
    -webkit-box-direction:normal;
    -moz-box-orient:vertical;
    -moz-box-direction:normal;
    flex-direction:column;
    -webkit-flex-direction:column;
    -webkit-justify-content:flex-start;
    justify-content:flex-start;
    -moz-box-pack:flex-start;
    -webkit--moz-box-pack:flex-start;
    box-pack:flex-start;
    align-items:center;
    -webkit-align-items:center;
    box-align:center;
    -moz-box-align:center;
    -webkit-box-align:center;
    width: 100%;
    height: 2.32rem;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 3;
}

.membership-info-content>div {
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content:center;
    justify-content:center;
    -moz-box-pack:center;
    -webkit--moz-box-pack:center;
    box-pack:center;
    align-items:flex-end;
    -webkit-align-items:flex-end;
    box-align:flex-end;
    -moz-box-align:flex-end;
    -webkit-box-align:flex-end;
}

.membership-info-content .membership-content-name {
    font-size: .5066667rem;
    color: #fff;
    height: .693334rem;
    line-height: .693334rem;
}

.membership-info-content .membership-content-name span {
    line-height: 1em;
}

.membership-info-content .membership-content-name i {
    width: .426667rem;
    height: .426667rem;
    background: url("../../res/index/icon_14.gif") no-repeat center center / cover;
    margin: 0 0 .04rem .09333rem;
}

.membership-info-content .membership-content-wel {
    font-size: .32rem;
    color: #d7d3d0;
    margin-top: .4rem;
}


/*  */

.membership-info {
    width: 100%;
    height: 100%;
}

.membership-info .membership-info-header {
    width: 100%;
    height: 5.70667rem;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center center !important;
    position: relative;
}

.membership-info .membership-info-header:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.membership-info .membership-info-header .membership-info-header-content {
    width: 7.06667rem;
    height: 4rem;
    border: 2px solid #adacab;
    padding: 0.10667rem;
    box-sizing: border-box;
    z-index: 3;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
}

.membership-info .membership-info-header .membership-info-header-content .membership-card {
    width: 100%;
    height: 100%;
    border: 0.06667rem solid #FFFFFF;
    border-radius: 8px;
    box-sizing: border-box;
    background: url(../../res/images/membership-vip.png) 1.86667rem 1.33333rem no-repeat;
    background-size: 1.2rem 0.61333rem;
}

.membership-level {
    position: absolute;
    left: 3.46667rem;
    top: 1.73333rem;
    font-size: 0.37333rem;
    color: #FFFFFF;
}

.member-card-number {
    position: absolute;
    right: 0.46667rem;
    bottom: 0.46667rem;
    font-size: 0.37333rem;
    color: #FFFFFF;
}

.membership-info .membership-options {
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    font-size: 0;
    border-bottom: 1px solid #000;
}

.membership-info .membership-options span {
    display: inline-block;
    width: 50%;
    height: 100%;
    color: #191919;
    font-size: 0.34667rem;
    box-sizing: border-box;
}

.membership-info .membership-options span:nth-child(2) {
    border-left: 1px solid #000;
}

.membership-info .membership-qrcode {
    width: 100%;
    height: 5.6rem;
    overflow: hidden;
    position: relative;
}

.membership-info .membership-qrcode img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    height: 80%;
}

.membership-info .membership-cue {
    width: 100%;
    height: 100%;
    color: #191919;
    line-height: 0.6rem;
    text-align: center;
    font-size: 0.32rem;
}

.refurbish {
    color: #bababa;
    width: 2rem;
    height: 1.6rem;
    line-height: 2.26667rem;
    background: url(../../res/images/refurbish.png) center 0.26667rem no-repeat;
    background-size: 0.66667rem 0.6rem;
}
</style>