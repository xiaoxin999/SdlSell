
<template>
    <section class='list'>
        <header>
            <ul>
                <li>全部 <span class='t s'></span><span class='b'></span></li>
                <li>吸粉<span class='t s'></span><span class='b'></span></li>
                <li>转化<span class='t s'></span><span class='b'></span></li>
                <li>收益<span class='t s'></span><span class='b'></span></li>
            </ul>
        </header>
        <section class='select'> 
            <div class='left'>共计：4人</div>
            <div class='right'>
                <list @index='selectIndex' :lists='lists'></list>
            </div>
        </section>
        <section class='bottom'>
            <section class ='card'>
                    <div class='content'>
                        <img src="../../../res/images/face.png" alt="">
                        <div class='right'>
                            <div class='n'>
                                <span class='name'>中年某某某</span>
                                <span class='tag'>店员</span>
                            </div>
                            <div class='callCard'>
                                查看详情
                            </div>
                            <div class='star'>
                                ⭐⭐⭐⭐⭐
                            </div>
                            <div class='info'>
                                <span>关注：<em>5</em></span>
                                <span style='padding-left:1.2rem'>消费：<em>0000</em></span>
                            </div>
                        </div>
                    </div>
            </section>
            <section class ='card'>
                    <div class='content'>
                        <img src="../../../res/images/face.png" alt="">
                        <div class='right'>
                            <div class='n'>
                                <span class='name'>中年某某某</span>
                                <span class='tag'>店员</span>
                            </div>
                            <div class='callCard'>
                                查看详情
                            </div>
                            <div class='star'>
                                ⭐⭐⭐⭐⭐
                            </div>
                            <div class='info'>
                                <span>关注：<em>5</em></span>
                                <span style='padding-left:1.2rem'>消费：<em>0000</em></span>
                            </div>
                        </div>
                    </div>
            </section>
        </section>
    </section>
</template>

<script>
    export default{
        data(){
            return{
                lists:["一个",'二哥']
            }
        },
        methods:{
            selectIndex(i){
                console.log(i);
            }
        },
        components:{
            list:()=>import(/* webpackChunkName:"select_list" */"./select_list.vue")
        },
        mounted(){

        }
    }
</script>
<style lang='less' scoped>
    .list{

        header{
            height:2rem;
            background-color: rgb(25,25,25);
            font-size: 0.4rem;
            color: #FFFFFF; 
            border-bottom: white solid 0.2rem;
            ul{
                display: flex;
                align-items:center;
                text-align: center;
                height: 100%;
                li{
                    flex:1;
                    vertical-align: middle;
                    span{
                        
                        width: 0;
                        height:0;
                        position: absolute;
                        border-top:0.25rem solid white;
                        border-right:0.16rem solid  rgba(0,0,0,0);
                        border-bottom:0.1rem solid rgba(0,0,0,0);
                        border-left:0.16rem solid  rgba(0,0,0,0);
                        margin-left: 0.1rem;
                        &.t{
                            transform: rotate(180deg);
                            margin-top: -0.15rem;
                        }
                        &.b{
                            margin-top: 0.35rem;
                            
                        }
                        &.s{
                            opacity:0.42;
                        }
                    }
                    
                }
            }
        }
        .select{
            height:1.2rem;
            display: flex;
            align-items: center;
            &>div{
                flex:1;
            }
            .left{
                font-size: 0.35rem;
                color: #303030;
                text-indent: 0.3rem;
            }
            .right{

            }
        }
        .bottom{
            
            background-color: white;
            
            position: absolute;
            top: 3.4rem;
            bottom: 0px;
            left: 0px;
            width:100%;


            .card{
                width: 9.28rem;
                height:3rem;
                margin: 0 auto;
                border-radius: 0.1rem;
                border:#999 solid 1px;
                margin-top: 0.3rem;
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
                        .star{
                            width: 50%;
                            margin-top: -0.2rem;
                            margin-bottom: 0.2rem;
                        }
                        .info{
                            margin-top:0.1rem;
                            font-size:0.26rem;
                            span{
                                em{
                                    color:rgb(234,192,71);
                                }
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
