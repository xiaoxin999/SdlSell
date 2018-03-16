<template>
    <section class='selectList' @click='open'>
        <div class='left'>
            {{fristValue }}
        </div>
        <div class='right'>
            <span></span>
        </div>
        <transition name='fade'>
            <ul class='list' v-if='show'>
                <li  v-for = '(item,index) in lists' :key='index'>{{item}}</li>
            </ul>
        </transition>

    </section>
</template>


<script>
    
    export default{
        props:{
            lists:{
                type:[Array],
                default:[]
            }
        },
        data(){
            return{
                show:false,
                fristValue:""
            }
        },
        methods:{
            open(e){
                
                
                if(/li/gi.test(e.target.tagName)){
                    let index = [...e.target.parentNode.children].indexOf(e.target)
                    this.$emit('index',index);
                    this.fristValue = this.lists[index];
                }
                
                this.show = !this.show;
            }
        },
        mounted(){
            this.fristValue = this.lists[0];
        }
    }
</script>


<style lang='less' scoped>
    .selectList{
        height:0.77rem;
        &>div{
            border: 1px solid #999999;
            height:100%;
            display: inline-block;
        }
        .left{
            width: 3.57rem;
            vertical-align: middle;
            font-size: 0.35rem;
            color: #303030;
            height: 0.77rem;
            line-height: 0.77rem;
            text-align: center;
            white-space:nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-indent: 0.2rem;
        }
        .right{
            vertical-align: middle;
            width:0.69rem;
            span{
                
                display: inline-block;
                position: relative;
                top:50%;
                left:50%;
                transform: translate(-50%,-40%);
                width: 0;
                height:0;
                border-top:0.25rem solid black;
                border-right:0.16rem solid  rgba(0,0,0,0);
                border-bottom:0.1rem solid rgba(0,0,0,0);
                border-left:0.16rem solid  rgba(0,0,0,0);
            }
        }
        ul{
            width:3.57rem;
            position: absolute;
            z-index:1;
            border: 1px solid #ccc;
            li{
                height:1rem;
                background-color: white;
                line-height: 1rem;
                font-size: 0.35rem;
                color: #303030;
                text-indent: 0.2rem;
                white-space:nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                border-bottom: 1px solid #ccc;
            }
            li:last-child{
                border:none;
            }
        }
    }
</style>
