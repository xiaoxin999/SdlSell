<template>
    <div id="add-address">
        <div class="add-ress">
            <div class="list-box">
                <div class="list-title required fl">姓名</div>
                <input required type="text" class="fl" placeholder="请输入姓名" v-model.trim="name" />
                <div class="fl sexLists">
                    <span v-for="(item,index) in sexTypeLists" :key="index" @click="choseType('sex',index)" :class="item.isOn ? 'active' : ''">{{item.sexName}}</span>
                </div>
            </div>
            <div class="list-box">
                <div class="fl list-title require">手机号</div>
                <input required type="text" class="fl" placeholder="请输入手机号" v-model.number="mobile" maxlength="11"/>
            </div>
            <div class="list-box">
                <div class="fl list-title required">地区</div>
                <input @click="showPickBar" required type="text" class="fl" placeholder="请选择省市区" v-model="area" readonly="readonly" id="inpArea" />
                <div class="fl sexLists">
                    <img src="../../res/images/moretable.png" class="fr sexImg"/>
                </div>
            </div>
            <div class="address-text">
                <div class="address-detail">
                    <input type="text" placeholder="请输入详细地址" v-model="address" maxlength="50" />
                </div>
            </div>
            <div class="list-box label-box">
                <div class="fl list-title">选择标签</div>
                <div class="fr label">
                    <span v-for="(item,index) in tagTypeLists" :key="index" @click="choseType('',index)" :class="item.isOn ? 'active' : ''">{{item.tagName}}</span>
                </div>
            </div>
            <div class="list-box last-box">
                <div class="fl list-title">设为默认</div>
                <div class="fr switch">
                    <span class="integral-icon" :class="status ? 'integral-on' : 'integral-off'" @click="defAddress"></span>
                </div>
            </div>
        </div>	
        <button v-on:click="setAddress">保存</button>
        <div id="targetContainer" class="multi">
            
        </div>
		<transition name="fade">
			<component 
			    :is="showComponent"
			    @closePicker = "closePicker"
				:type="'addressPicker'"
			></component>
		</transition>
    </div>
</template>

<script>

    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    export default {
        name: 'addAddress',
        data(){
            return {
                // shopId : storage.session('select-shop').id || 61,// true number 店铺id
                name : '',// true string 用户名
                sex : 1,// true number 性别 1:男 2:女 3:未知
                mobile : '',// true string 手机号码
                area : '',// true string 地区
                address : '',// true string 详细地址
                tag : 1,// false number 标签 1:家 2:公司 3:学校
                status : false,// false number 状态 1:默认地址
                sexTypeLists : [{sexName:'先生',type:1,isOn:true},{sexName:'女士',type:2,isOn:false}],//存性别类型的数组
                tagTypeLists : [{tagName:'家',type:1,isOn:true},{tagName:'公司',type:2,isOn:false},{tagName:'学校',type:3,isOn:false}],//存储标签类型的数组
                isEdit : false,
				payUrl : '',
				showComponent: ''
            }
        },
        methods: {
			showPickBar(){
                this.showComponent = 'multi-picker';
			},
			closePicker(val){
				this.showComponent = '';
				if(val.type === 'sure'){
                    this.area = val.payload.join('');
				}
			},
            choseType(type,index){
                if(type == 'sex'){
    				for(var i = 0; i < this.sexTypeLists.length; i++){
						this.sexTypeLists[i].isOn = false;
    				}
    				this.sexTypeLists[index].isOn = true;
    				this.sex = 	this.sexTypeLists[index].type;
    			}else{
    				for(var i = 0; i < this.tagTypeLists.length; i++){
						this.tagTypeLists[i].isOn = false;
    				}
    				this.tagTypeLists[index].isOn = true;
    				this.tag = 	this.tagTypeLists[index].type;
    			}
            },
            defAddress(){
                //设置默认地址
    			this.status = !this.status;
            },
            async setAddress(){
                if(!global.checkData({
                    name: {cond: "$$.length > 0",pro: "请输入您的姓名"},
                    mobile: {reg: /^1\d{10}$/,pro:"请输入正确的手机格式"},
                    area: {cond: "$$.length > 5",pro:"请选择地区"},
                    address: {cond: "$$.length > 5",pro:"请输入具体地址"}
                },this)){
                    return false
                }
                let obj = {
                    id : storage.session('addressLists') ? storage.session('addressLists').id : '',
					name : this.name,//用户名
					sex : this.sex,//性别
					mobile : this.mobile,//手机号
					area : this.area,//地区
					address : this.address,//具体地址
					tag : this.tag,//标签
    				status : Number(this.status),//0:默认 1:默认选
    				shopId : this.shopId
                }
                let res;
                if(this.isEdit){
                    res = await http.editAddress({
                        data: obj
                    })
                }else{
                    res = await http.addAddress({
                        data: obj
                    })
                }
                if(res){
                    storage.session('addressDetail',res);
					if(!process.env.ASSET_PATH){
						// 存在则为开发坏境
						window.location.href = this.payUrl;
					}else{
						this.$router.push('/pay'); // 跳转本地链接
					}
                }
            },
            async getPayUrl(){
                let res = await http.payUrl({
                    data: {
						shopId : this.shopId,
                        type : 1
                    }
                })
                this.payUrl = res;
			},
			async getAddress(){
                let res = await http.getAddressDetail({
					data: {
						id : storage.session('addressLists').id,
						shopId : this.shopId,
					}
				})
				this.isEdit = true;
				this.name = res.name;
				this.sex = res.sex;
				this.mobile = res.mobile;
				this.area = res.area;
				this.address = res.address;
				this.tag = res.tag;
				this.status = Boolean(Number(res.status));
				//判断性别和标签
				for(var i = 0; i < this.sexTypeLists.length; i++){
					//清除掉原来的选中状态
					this.sexTypeLists[i].isOn = false;
					if(this.sex == this.sexTypeLists[i].type){								
						this.sexTypeLists[i].isOn = true;
					}
				}
				for(var i = 0; i < this.tagTypeLists.length; i++){
					this.tagTypeLists[i].isOn = false;
					if(this.tag == this.tagTypeLists[i].type){
						this.tagTypeLists[i].isOn = true;
					}
				}
			}
        },
        computed: {

        },
        mounted(){
			this.shopId = utils.getQueryString('shopId') || 61;
			this.getPayUrl();
			if(storage.session('addressLists')){
  				this.getAddress();
  			} 
            utils.setTitle("添加地址");
		},
		components: {
			MultiPicker:()=> import (/* webpackChunkName: "multipicker"*/ 'src/components/multipicker/index')
		},
		destroyed(){
			storage.session('addressLists','');
		}
    }
</script>

<style lang="less" scoped>

#add-address {
	width: 100%;
	height: 100%;
	font-size: 0.37333rem
}

#add-address .add-ress {
	background: #fff
}

#add-address .add-ress .list-box {
	width: calc(100% - 0.4rem);
	height: 1.2rem;
	line-height: 1.2rem;
	border-bottom: 1px solid #E5E5E5;
	margin-left: 0.4rem;
	box-sizing: border-box;
	overflow: hidden
}

#add-address .add-ress .list-box .list-title {
	width: 2rem;
	height: 100%
}

#add-address .add-ress .list-box .required {
	position: relative
}

#add-address .add-ress .list-box .required:after {
	content: '*';
	position: absolute;
	right: 1.06667rem;
	top: 0.06667rem;
	color: red
}

#add-address .add-ress .list-box .require {
	position: relative
}

#add-address .add-ress .list-box .require:after {
	content: '*';
	position: absolute;
	right: 0.66667rem;
	top: 0.06667rem;
	color: red
}

#add-address .add-ress .list-box input {
	width: 4.34667rem;
	height: 100%;
	text-indent: 0.26667rem;
	box-sizing: border-box;
	border: none
}

#add-address .add-ress .list-box input::-webkit-input-placeholder {
	color: #999;
	font-size: 0.37333rem
}

#add-address .add-ress .list-box .sexLists {
	position: relative;
	width: 3.25333rem;
	height: 100%;
	font-size: 0
}

#add-address .add-ress .list-box .sexLists span {
	display: inline-block;
	width: 1.62667rem;
	height: 100%;
	background-color: #F7F7F7;
	color: #999;
	font-size: 0.37333rem;
	text-align: center
}

#add-address .add-ress .list-box .sexLists .active {
	background: #EBEBEB;
	color: #F5A623
}

#add-address .add-ress .list-box .sexLists .sexImg {
	width: 0.21333rem;
	height: 0.34667rem;
	position: absolute;
	right: 0.48rem;
	top: 50%;
	margin-top: -0.17333rem
}

#add-address .add-ress .list-box .label {
	position: relative;
	width: 5.26667rem;
	height: 100%;
	font-size: 0
}

#add-address .add-ress .list-box .label span {
	display: inline-block;
	box-sizing: border-box;
	width: 1.74667rem;
	height: 100%;
	background-color: #F7F7F7;
	color: #999;
	font-size: 0.37333rem;
	text-align: center;
	border-left: 1px solid #ddd;
	border-bottom: 1px solid #ddd
}

#add-address .add-ress .list-box .label .active {
	background-color: #EBEBEB;
	color: #F5A623
}

#add-address .add-ress .list-box .switch {
	width: 1.02667rem;
	height: 0.49333rem;
	margin-right: 0.34667rem;
	position: relative;
	overflow: hidden
}

#add-address .add-ress .list-box .switch img {
	position: absolute;
	top: 0;
	left: 0
}

#add-address .add-ress .last-box {
	border-bottom: none;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-align-items: center;
	-webkit-justify-content: space-between;
	-webkit-box-pack: justify;
	-ms-flex-pack: justify;
	justify-content: space-between
}

#add-address .add-ress .label-box {
	width: 100%;
	margin-left: 0;
	border-bottom: none;
	border-bottom: 0.25333rem solid #F7F7F7;
	box-sizing: content-box !important
}

#add-address .add-ress .label-box .list-title {
	margin-left: 0.4rem
}

#add-address .add-ress .address-text {
	width: 100%;
	height: 2.4rem;
	padding: 0.4rem 0rem;
	border-bottom: 1px solid #E5E5E5;
	box-sizing: border-box;
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-align-items: center;
	-webkit-justify-content: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center
}

#add-address .add-ress .address-text .address-detail {
	width: 9.2rem;
	height: 1.6rem;
	line-height: 0.66667rem;
	background-color: #F1F1F1;
	padding: 0.26667rem;
	box-sizing: border-box
}

#add-address .add-ress .address-text .address-detail input {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	border: none;
	background-color: #F1F1F1
}

#add-address .add-ress .address-text .address-detail input::-webkit-input-placeholder {
	color: #999
}

#add-address button {
	border: none;
	display: block;
	width: 8.93333rem;
	height: 1.06667rem;
	color: #fff;
	font-size: 0.48rem;
	border-radius: 0.10667rem;
	background-color: #F5BF4F;
	border-radius: 0.10667rem;
	margin: 0.53333rem auto
}

#add-address .integral-icon {
	display: block;
	width: 0.42667rem;
	height: 100%;
	background: url(../../res/images/integral-icon.png) center center no-repeat;
	background-size: 0.42667rem 0.42667rem
}

#add-address .integral-off {
	display: block;
	width: 1.02667rem;
	height: 0.52rem;
	cursor: pointer;
	background: url(../../res/images/on-off.png) no-repeat;
	background-position: 0 0;
	background-size: 2.06667rem, 0.77333rem;
	-webkit-transition: background-position 0.25s ease-in;
	transition: background-position 0.25s ease-in;
	overflow: hidden
}

#add-address .integral-on {
	display: block;
	width: 1.02667rem;
	height: 0.52rem;
	cursor: pointer;
	background: url(../../res/images/on-off.png) no-repeat;
	background-size: 2.06667rem, 0.77333rem;
	-webkit-transition: background-position 0.25s ease-in;
	transition: background-position 0.25s ease-in;
	background-position: -1.04rem 0;
	overflow: hidden
}

#add-address .multi .multi-picker-locked {
	height: 100% !important;
	overflow: hidden !important
}

#add-address .multi .multi-picker-bg {
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(75, 75, 75, 0);
	height: 100%;
	width: 100%;
	overflow: hidden;
	transition: all .3s ease;
	-webkit-transition: all .3s ease;
	z-index: -1
}

#add-address .multi .multi-picker-bg-up {
	z-index: 999 !important;
	background: rgba(75, 75, 75, 0.65) !important
}

#add-address .multi .multi-picker-container {
	width: 100%;
	height: 6rem;
	position: absolute;
	bottom: 0;
	transform: translate3d(0, 6rem, 0);
	-webkit-transform: translate3d(0, 6rem, 0);
	left: 0;
	background-color: #FFF;
	transition: transform .3s ease;
	-webkit-transition: -webkit-transform .3s ease;
	z-index: -1
}

#add-address .multi .multi-picker-container-up {
	transform: translate3d(0, 0, 0) !important;
	-webkit-transform: translate3d(0, 0, 0) !important
}

#add-address .multi .multi-picker-btn-box {
	display: block;
	position: absolute;
	text-align: center;
	width: 100%;
	height: 1.25333rem;
	line-height: 1.25333rem;
	background: rgba(218, 218, 218, 0.7);
	z-index: 10
}

#add-address .multi .multi-picker-btn-box .multi-picker-btn {
	display: inline-block;
	right: 0;
	font-size: 0.34667rem;
	color: #333;
	width: 1.6rem;
	height: px2(94px)
}

#add-address .multi .multi-picker-btn-box .multi-picker-btn:nth-child(1) {
	left: 0;
	right: initial;
	color: #333
}

#add-address .multi .multi-picker-title {
	width: calc(100% - 3.2rem);
	height: 1.25333rem;
	font-size: 0.34667rem;
	color: #999;
	text-align: center
}

#add-address .multi .multi-picker-content {
	position: absolute;
	width: 100%;
	background: #fff;
	font-size: 0;
	top: 1.25333rem;
	z-index: 10;
	transform: translate3d(0, 0, 0);
	-webkit-transform: translate3d(0, 0, 0);
	transition: transform .3s ease;
	-webkit-transition: -webkit-transform .3s ease
}

#add-address .multi .multi-picker-content .multi-picker {
	display: inline-block;
	height: 4.53333rem;
	overflow: hidden;
	position: relative;
	z-index: -1;
	-webkit-transition: width .3s ease;
	transition: width .3s ease;
	vertical-align: top
}

#add-address .multi .multi-picker-content ul::-webkit-scrollbar {
	display: none
}

#add-address .multi .multi-picker-content li {
	height: 1.06667rem;
	text-align: center;
	font-size: 0.32rem;
	line-height: 1.06667rem;
	list-style: none;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap
}

#add-address .multi .multi-picker-content .multi-picker-up-shadow,
#add-address .multi .multi-picker-content .multi-picker-down-shadow {
	position: absolute;
	width: 100%;
	height: 80px;
	pointer-events: none
}

#add-address .multi .multi-picker-content .multi-picker-up-shadow {
	top: 0;
	background-image: -webkit-linear-gradient(top, #FFF, rgba(255, 255, 255, 0));
	background-image: linear-gradient(to bottom, #FFF, rgba(255, 255, 255, 0));
	z-index: 50
}

#add-address .multi .multi-picker-content .multi-picker-down-shadow {
	bottom: -200px;
	z-index: 50;
	background-image: -webkit-linear-gradient(bottom, #FFF, rgba(255, 255, 255, 0));
	background-image: linear-gradient(to top, #FFF, rgba(255, 255, 255, 0))
}

#add-address .multi .multi-picker-content .multi-picker-line {
	width: 95%;
	height: 1.06667rem;
	position: absolute;
	top: 2rem;
	left: 50%;
	pointer-events: none;
	box-sizing: border-box;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	transform: translate3d(-50%, 0, 0);
	-webkit-transform: translate3d(-50%, 0, 0)
}


/*# sourceMappingURL=add-address.css.map */
</style>

