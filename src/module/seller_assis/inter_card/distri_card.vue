<template>
    <section class='inter_card'> 
        <header>
            <ul @click='clickMenu'>
                <li>
                    <span class='down' ref='s'>
                        全部
                    </span>
                </li>
                <li>
                    <span>
                        可用
                    </span>
                </li>
                <li>
                    <span>
                        过期
                    </span>
                </li>
            </ul>
        </header> 
        <section class='content'>
            <section class='item'>
                <div class='left'>
                        <span class='title'>圣诞节专享积分卡</span>
                        <div class='time'>有效期至：2018-03-01 12：00</div>
                        
                        <div class='info'>
                            <span class='point'>数量：<em>20</em></span>
                            <span class='point'>分配：<em>20</em></span>
                            <span class='point'>发放：<em>20</em></span>
                        </div>
                </div>
                <div class='right'>
                    <span>分配</span>
                    <!-- <span>已过期</span> -->
                </div>
            </section>
        </section>
        <div class='button'>
            新增关联
        </div>
    </section>
</template>


<script>
    
    import utils from 'src/verdor/utils';

    export default{
        data(){
            return{
                _tempTar:null
            }
        },
        methods:{
            clickMenu(e){
                let target = e.target;
                if(!/span/gi.test(target.tagName)){
                    target = target.children[0];
                }
                target.className += 'down';
                this._tempTar&&(this._tempTar.className = '');
                this._tempTar = target;
            }
        },
        mounted(){
            this._tempTar = this.$refs.s;
            utils.setTitle('积分卡');
        }
    }
</script>

<style lang='less' scoped>

    .inter_card{
        height:2rem;
        background-color: rgb(32,32,32);
        
        header{
            height: 100%;
            ul{
                color:#FFFFFF;
                font-size: .4rem;
                display: table;
                width:100%;
                height:100%;
                li{
                    height:100%;
                    display: table-cell;
                    text-align: center;
                    vertical-align: middle;
                    span{
                        display: inline-block;
                        width:1.4133rem;
                        height:0.7rem;
                    }
                    span.down{
                        border-bottom: 2px solid #FFFFFF;
                    }
                }
            }
        }
        section.content{
            width: 9.2933rem;
            margin: .2667rem auto 0;
            .item{
                width: 100%;
                height:2.5067rem;
                background: #F8F8F8;
                border: 1px solid #DDDDDD;
                margin-bottom: .2933rem;
                display: table;
                .left{
                    width:65%;
                    display:inline-block;
                    height: 100%;
                    display: table-cell;
                    vertical-align: middle;
                    text-align: left;
                    padding-left: .2667rem;
                    .title{
                        font-size: .4rem;
                        color: #303030;
                    }
                    .time{
                        margin-top: 0.3rem;
                    }
                    .time,.point{
                        font-family: PingFang-SC-Medium;
                        font-size: .3467rem;
                        color: #999999;
                    }
                    .info{
                        span{
                            padding-left: 0.5rem;
                            em{
                                color: #EAC048;
                            }
                        }
                        span:nth-child(1){
                            padding: 0;
                        }
                    }
                }
                .right{
                    font-family: PingFang-SC-Medium;
                    display:inline-block;
                    font-size: .3467rem;
                    color: #FFFFFF;
                    vertical-align: top;
                    margin: .3rem 0 0 0.3rem;
                    span{
                        display: inline-block;
                        width: 2.1867rem;
                        height: .84rem;
                        line-height: 0.84rem;
                        background: #EAC048;
                        border-radius: 1.3333rem;
                        text-align: center;
                        vertical-align: middle;
                    }
                }
            }
        }
        .button{
            background: #EAC048;
            border-radius: 1.25rem;
            height:0.84rem;
            line-height: 0.84rem;
            width:4.50rem;
            position: absolute;
            bottom:0.3rem;
            left:0;
            right:0;
            margin: 0 auto;
            text-align: center;
            font-size: 0.35rem;
            color: #FFFFFF;
        }
    }

</style>
