<template>
  <section class='userCenter'>
      
      <div>
            <div class='user_info'>
                    <div class='photo'>
                        <img src="../../../res/images/face.png" alt="">
                        <div class='name'>1111</div>
                    </div>
                    <div class='other'>
                        <div><img src='../../../res/icon/6_03.png'>积分：3000</div>
                        <div><img src='../../../res/icon/6_03.png'>已兑换：15</div>
                    </div>
                    <div class='sign'>签到+5积分</div>
            </div>
            <section class ='nav'>
                    <ul>
                        <li>
                            <img src="../../../res/images/face.png" alt="">
                            <div>疯抢</div>
                        </li>
                        <li>
                            <img src="../../../res/images/face.png" alt="">
                            <div>积分商城</div>
                        </li>
                        <li>
                            <img src="../../../res/images/face.png" alt="">
                            <div>专属导购</div>
                        </li>
                        <li>
                            <img src="../../../res/images/face.png" alt="">
                            <div>用户中心</div>
                        </li>
                    </ul>
            </section>
      </div>
      
  </section>
</template>
<script>
import utils from 'src/verdor/utils';
export default{
    data(){
        return {
            
        }
    },
    methods : {
    },
    mounted(){
        utils.setTitle('用户中心');
    }
}
</script>
<style lang="less" scoped>
@import '../../../res/css/base.less';
.userCenter{
    
    &>div{
        background-color: #fff;
        
        .user_info{
            height:6.21rem;
            width: 100%;
            padding-top:1rem;
            background: url(../../../res/icon/6_03.png) no-repeat ;
            .photo{
                width: 2.24rem;
                margin: 0 auto;
                text-align: center;
                img{
                    width:2.24rem;
                    height:2.24rem;
                }
                .name{
                    font-size: 0.37rem;
                    color: #FFFFFF;
                }
            }
            .other{
                margin-top: 0.5rem;
                width: 100%;
                &>div{
                    text-align: center;
                    display: inline-block;
                    width: 49%;
                    font-size: 0.35rem;
                    color: #FFFFFF;

                    img{
                        width: 0.35rem;
                        height:0.35rem;
                        position: relative;
                        top:0.05rem;
                        left:-0.1rem;
                    }
                }
                
            }
            .sign{
                margin: 0 auto;
                text-align: center;
                width:2.69rem;
                height:0.84rem;
                line-height: 0.84rem;
                margin-top:0.51rem;
                background-color: #EAC048;
                border-radius: 1.25rem;
            }
            &>div{
                vertical-align: middle;
            }
        }
        .nav{
                height:3.5rem;
                padding: 0 0.8rem;
                ul{
                    height:100%;
                    text-align: center;
                    display: table;
                    width: 100%;
                    font-size: 0.32rem;
                    font-family: PingFang-SC-Medium;
                    color: #303030;
                    li{
                        display: table-cell;
                        height:100%;
                        vertical-align: middle;

                        img{
                            width: 1.173rem;
                            height: 1.173rem;
                            padding-top: 10%;
                        }
                        div{
                            margin-top: 0.1rem;
                        }
                    }
                }
            }
    }
    
}
</style>
