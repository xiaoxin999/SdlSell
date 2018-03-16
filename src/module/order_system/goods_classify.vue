<template>
    <div id="goods-classify" class="goods-classify">
        <div ref="navList" class="navList">
            <div v-for="(navs,index) in navsList" v-bind:key="navs.name" class="navs" :class="(firstNavIndex == index) ? 'navs-select' : ''" @click="clickNavs('1',index,navs)">
                {{navs.name}}
            </div>
        </div>
        <div class="navChild" v-show="childNav && childNav.length >= 1">
            <span v-for="(child,index) in childNav" v-bind:key="child.name" :class="(childNavIndex == index) ? 'child-select' : ''"  @click="clickNavs('2',index,child)">{{child.name}}</span>
        </div>
        <div class="sreach-btn" @click = 'search'>

        </div>
    </div>
</template>

<script>
    import storage from 'src/verdor/storage';


    export default {
        data(){
            return {
                firstNavIndex : 0, // 选中的一级分类下标
                childNavIndex : 0, // 选中的二级分类下标
                childNav : [], // 二级分类
                parentItem:[],
                // scroll: this.scrollPack
            };
        },
        props : ['navsList'],
        methods : {
            clickNavs : function(type,index,item){
                // 选择分类
                console.log();
                if(type === '1'){
                    this.firstNavIndex = index;
                    this.childNav = item.child;
                    this.childNavIndex = 0;
                    this.parentItem = item;
                }else{
                    this.childNavIndex = index;
                    if(item.name == '全部'){
                        item = this.parentItem;
                    }
                }
                item.type = type;       
                this.$emit('navs',item);
            },
            search(){
                this.$emit('navs',{name:"search"});
            }
        },
        updated(){

            if(this.firstCom){
                let p = storage.session('packagePage');
                if(!p){
                    this.clickNavs('1',0,this.navsList[0]);
                }
                else{
                    this.$nextTick(()=>{
                        let dom = this.$refs.navList;
                        dom.scrollLeft = dom.scrollWidth - dom.offsetWidth;
                        this.firstNavIndex = this.navsList.length-1;
                        storage.session('packagePage',null);
                        this.clickNavs('1',this.firstNavIndex,this.navsList[this.firstNavIndex]);
                    });
                }
                this.firstCom = false;
            }
        },
        mounted : function(){
            this.firstCom = true;
            // vue2.0版本使用mounted替代ready
            // this.$emit('io',{name:'sung'});
        },
    }
</script>

<style lang="less" scoped>
@import '../../res/css/base.less';
.goods-classify{
    position : fixed;
    left : 0;
    top : 0;
    font-size : 0;
    background-color : #f7f7f7;
    border-bottom : 1px solid #ddd;
    .px2rem(width,750);
    .px2rem(height,94);
    // .box(px2rem(750px),px2rem(94px));
    z-index : 9;
    .navList{   
        .px2rem(width,656);
        .px2rem(height,94);
        // .box(calc(#{px2rem(750px)} - #{px2rem(94px)}),px2rem(94px));

        color: #888;
        font-size : 0;
        float : left;
        overflow-x : scroll;
        overflow-y : hidden;
        white-space : nowrap;
        -webkit-overflow-scrolling : touch;
        div.navs{
            // padding : 0 px2rem(24px);
            .px2rem(padding-top,0);            
            .px2rem(padding-left,24);            
            .px2rem(padding-bottom,0);            
            .px2rem(padding-right,24);            
            .px2rem(font-size,32);            
            // font-size : px2rem(32px);
            display : inline-block;
            // .box(auto,px2rem(94px));
            // .px2rem(width,auto);
            width: auto;            
            .px2rem(height,94);            
            
            // line-height : px2rem(94px);
            .px2rem(line-height,94);            
            
            position : relative;
        }
        .navs-select{
            color : #f6a623;
            &:after{
                content : '';
                position : absolute;
                left : 50%;
                transform : translate(-50%,0);
                // bottom : px2rem(10px);
                .px2rem(bottom,10);
                // .box(px2rem(56px),px2rem(6px));
                .px2rem(width,56);
                .px2rem(height,6);
                background-color : #f6a623;
            }
        }
    }
    .navChild{
        // .box(px2rem(750px),px2rem(94px));
        .px2rem(width,750);
        .px2rem(height,94);
        // font-size : px2rem(26px);
        .px2rem(font-size,26);        
        color : #888888;
        background-color : #fbfbfb;
        position : fixed;
        // top : px2rem(94px);
        .px2rem(top,94);                
        left : 0;
        z-index : 66;
        overflow-x : scroll;
        overflow-y : hidden;
        white-space : nowrap;
        -webkit-overflow-scrolling : touch;
        >span{
            padding : 0 0.32rem;
            font-size : 0.42267;
            display : inline-block;
            // .box(auto,px2rem(94px));
            width: auto;
            height: 1.253rem;
            line-height :1.253rem;
            position : relative;
            font-size : 0.3466rem;
        }
        .child-select{
            color : #f6a623;
        }
    }
    .sreach-btn{

        .px2rem(width,94);
        .px2rem(height,94);
        background : url(../../res/images/nav-icon-search.png) center center no-repeat #f6a623;
        background-size : .8rem .8rem;
        float : left;
    }
}
</style>