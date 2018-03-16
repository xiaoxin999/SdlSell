<template>
    <div class="code" id="code">
        <div class="goodsName">{{info.gname}}</div>
        <div class="img">
            <img :src="imgUrl"/>
        </div>
        <div class="goodsCode">{{info.code}}</div>
        <div class="goodsTime">有效期</div>
        <div v-if="info.expire != 0">{{info.createTime | transformTime}}至{{info.expire | transformTime}}</div>
        <div v-else>永久</div>
    </div>
</template>

<script>
    import http from 'src/manager/http';
    import global from 'src/manager/global';
    import storage from 'src/verdor/storage';
    import utils from 'src/verdor/utils';
    export default {
        name: 'exchangeCode',
        data(){
            return {
                info: storage.session("mall-code"),
                shopId: 0,
                imgUrl: ''
            }
        },
        methods: {
            async getUrl(){
                let res = await http.getExchangeQR({
                    data: {
                        shopId: this.shopId,
                        code: storage.session("mall-code").code
                    }
                })
                this.imgUrl = res.url;
            }
        },
        filters: {
            transformTime(time){
                return utils.format(new Date(Number(time) * 1000),'yyyy-MM-dd');
            }
        },
        mounted(){
            this.shopId = utils.getQueryString('shopId') || 61;
            this.getUrl()
            utils.setTitle("查看劵码");
        }
    }
</script>

<style lang="less" scoped>
    html,body{
		background-color: #fff;	
	}
	.code{
		width: 100%;
        height: 100%;
        .goodsName{
            margin-top: 2rem;
            font-size: 0.6rem;
        }
        .goodsCode{
            margin-top: 0.5rem;
            font-size: 0.6rem;
        }
        .goodsTime{
            margin-top: 1.5rem;
        }
        div{
            float: left;
            width: 10rem;
            font-size: 0.4rem;
            height: 1rem;
            line-height: 1rem;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        div.img{
            width: 4.8rem;
            height: 4.8rem;
            margin-left: 2.6rem;
            margin-top: 1rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
	}
</style>

