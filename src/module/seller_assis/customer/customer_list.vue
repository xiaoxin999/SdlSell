<template>
    <section class='customerList'>
        <header>
            <div>
                <span class='left'>共计10人</span>
                <span class='right'>已消费<img src='../../../res/images/face.png'/></span>
            </div>
        </header>
        <section style='height:calc(100% - 2rem);' class='bottom'>
            <section class ='guide_card'>
                    <div class='content'>
                        <img src="../../../res/images/face.png" alt="">
                        <div class='right'>
                            <div class='n'>
                                <span class='name'>中年某某某</span>
                                <span class='tag'>VIP</span>
                                <img src="../../../res/images/face.png" alt="">
                                
                            </div>
                            <div class='callCard'>
                                查看信息
                            </div>
                            <div class='info' style='font-size:0.26rem'>
                                    <span>券：<em>5</em></span>
                                    <span>礼：<em>18</em></span>
                                    <span>积分：<em>3000</em></span>
                            </div>
                            <div style='margin-top:0.1rem;font-size:0.26rem;'>
                                <span>关注：2018-02-28</span>
                                <span style='padding-left:0.2rem'>消费：2018-03-01</span>
                            </div>
                        </div>
                    </div>
            </section>
        </section>
    </section>
</template>


<script>
    import utils from 'src/verdor/utils';
    
    export default{
        mounted(){

        }
    }
</script>

<style lang='less' scoped>

    .customerList{
        height:100%;
        header{
            height:2rem;
            background-color: rgb(24,24,24);
            &>div{
                width: 90%;
                margin: 0 auto;
                height: 2rem;
                font-size: 0.4rem;
                color: #FFFFFF;
                line-height: 2rem;
                span{
                    height: 2rem;
                    width: 48%;
                    display: inline-block;
                    img{
                        width:0.44rem;
                        height:0.44rem;
                        vertical-align: middle;
                        margin-left: 0.1rem;
                    }
                }
                span.right{
                    text-align: right;
                    vertical-align: middle;
                }
            }
        }
        .bottom{
            
            padding-top: 0.5rem;
            background-color: white;
            


            .guide_card{
                width: 9.28rem;
                height:3rem;
                margin: 0 auto;
                border-radius: 0.1rem;
                border:#999 solid 1px;
                margin-bottom: 0.3rem;
                display: table;
                
                .content{
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    img{
                        width:1.7rem;
                        height:1.7rem;
                    }
                    div.right{
                        display: inline-block;
                        height:1.7rem;
                        vertical-align: top;
                        width:71%;
                        text-align: left;
                        margin-left: 0.2rem;
                        div.n{
                            display: inline-block;
                            vertical-align: top;
                            span.name{
                                font-size: 0.4rem;
                                font-weight: bold;
                            }
                            span.tag{
                                display: inline-block;
                                width:0.82rem;
                                height:0.38rem;
                                line-height: 0.38rem;
                                border: 1px solid #D0021B;
                                border-radius: 0.1rem;
                                text-align: center;
                                color:#D0021B;
                                margin-left: 0.1rem;
                            }
                            img{
                                width:0.36rem;
                                height:0.36rem;
                                vertical-align: middle;
                            }
                        }
                        .info{
                            span{
                                padding-left:0.2rem;
                            }
                            span:nth-child(1){
                                padding-left: 0;
                            }
                            em{
                                color: rgb(234,192,71);
                            }
                        }
                        .callCard{
                            display: inline-block;
                            width:2.18rem;
                            height:0.84rem;
                            background-color: rgb(234,192,71);
                            border-radius: 1.33rem;
                            margin-left: 0.6rem;
                            line-height: 0.8rem;
                            text-align: center;
                            color:white;
                        }


                    }
                }
            }
        }
    }

</style>


