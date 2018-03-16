<template>
	<div @touchstart.prevent="touch($event)" @touchmove.prevent="touch($event)" @touchend.prevent="touch($event)" class="date-selector date-selector-left">
        <ul ref="arrIdx">
            <li></li>
            <li></li>
            <li :key="index" v-for="(item,index) in len">
                {{list[0] + item -1 }}{{ String(item)?timeType: '' | filterType  }}
            </li>
            <li></li>
            <li></li>
        </ul>
    </div>
</template>

<script>
	export default {
		name:"select-list",
		data(){
			return {
                currentPosition: null,
				liHeight: 40,
                start: {
                    Y: 0,
                    time: ''
                },
                move: {
                    Y: 0,
                    speed: []
                },
                end: {
                    Y: 0,
                    index: 0
                },
                displacement: [],   // 位移距离
                displacementTime: [],  // 位移时间
                stopClick: true,
			}
		},
		props: {
            timeType: {
                type: String
            },
            list: {
            	type: Array
            },
            distance: {
            	type: Number
            },
            param: {
            	type: Array
            }
		},
		mounted(){
        	this.$nextTick().then(()=>{
                this.currentPosition = this.distance
                let $selector = this.$refs.arrIdx;
                this.setTransform($selector,-this.currentPosition)
            })
		},
        computed: {
            len(){
                return this.list[1] - this.list[0] + 1;
            },
            maxHeight(){
                return (this.list[1] - this.list[0])*this.liHeight;
            }
        },
        updated(){
            let $selector = this.$refs.arrIdx;
            // if(this.timeType === this.changeType){
            //     // console.log(this.distance)
            //     return false
            // }
            this.currentPosition = Math.floor(this.distance)
            console.log('disance',this.distance)
            this.setTransform($selector,-this.distance);
            this.setTransition($selector,.3);
        },
		// watch:{
        //     distance(newVal,oldVal){
        //         if(newVal !== oldVal){
        //             let $selector = this.$refs.arrIdx;
        //             this.currentPosition = Math.floor(this.distance)
        //             this.setTransform($selector,-this.currentPosition);
        //             this.setTransition($selector,.3);
        //             console.log(this.timeType,newVal,oldVal)
        //         }
                
        //     }
		// },
		methods: {
			touch(event) { // event, vm, $selector, array, idx
                event = event || window.event;
                event.preventDefault();
                let $selector  = this.$refs.arrIdx;
                switch (event.type) {
                    case "touchstart":
                        event.preventDefault();
                        this.move.speed = [];
                        this.start.Y    = event.touches[0].clientY;
                        this.start.time = Date.now();
                        break;
                    case "touchend":
                        event.preventDefault();
                        this.end.Y         = event.changedTouches[0].clientY;
                        var tempDis        = this.currentPosition + (this.start.Y - this.end.Y);
                        this.currentPosition = tempDis < 0 ? 0 : (tempDis < this.maxHeight ? tempDis : this.maxHeight);
                        this.initSpeed(this.move.speed,this.start.Y-this.end.Y,this.maxHeight);
                        // if(this.start.Y-this.end.Y >= 0){
                        //     this.setTransform($selector,-this.currentPosition);
                        // }else{
                        //     this.setTransform($selector,this.currentPosition);
                        // }
                        this.setTransform($selector,-this.currentPosition);
                        this.setTransition($selector,this.move.speed[0]);
                        if(Math.abs(this.start.Y-this.end.Y)>=20){
                            this.getDateArr(this.currentPosition)
                        }
                        break;
                    case "touchmove":
                        event.preventDefault();
                        this.move.Y = event.touches[0].clientY;
                        var offset  = this.start.Y - this.move.Y;
                        if (this.currentPosition == 0 && offset < 0) {
                            this.setTransform($selector,1.5 * this.liHeight);
                            this.setTransition($selector,0.3);
                        } else {
                            this.setTransform($selector,'-' + (offset + this.currentPosition));
                        }
                        if (this.currentPosition <= -this.maxHeight) {
                            this.setTransform($selector,'-' + this.liHeight);
                            this.setTransition($selector,0.3);
                        }
                        if (Math.abs(offset).toFixed(0) % 5 === 0) {
                            var time = Date.now();
                            this.move.speed.push((Math.abs(offset) / (time - this.start.time)).toFixed(2));
                        }
                        console.log('speed',this.move.speed)
                        console.log('scroll',1.5 * this.liHeight)
                        console.log('currentposition',offset + this.currentPosition)
                        break;
                }
            },
            setTransform($selector,val = 0){
                $selector.style.transform        = `translate3d(0,${val}px, 0)`;
                $selector.style.webkitTransform  = `translate3d(0,${val}px, 0)`;
            },
            setTransition($selector,val = 0){
                $selector.style.transition       = `transform ${val}s ease-out`;
                $selector.style.webkitTransition = `-webkit-transform ${val}s ease-out`;
            },
            initPosition(dis, max) {
                dis     = dis < 0 ? 0 : dis;
                dis     = dis > max ? max : dis;
                var sub = dis % this.liHeight;
                if (sub < this.liHeight / 2) {
                    this.currentPosition = dis - sub;
                } else {
                    this.currentPosition = dis + (this.liHeight - sub);
                }
                return this;
            },
            initSpeed(arr,dir, max) {
            	// let len = this.displacement.length;
                // let sumV = 0;
                // for(let i = 0; i < len-1; i++){
                //     sumV += ((this.displacement[i+1] - 0)-(this.displacement[i]-0))/(this.displacementTime[i+1] - this.displacementTime[i])
                // }
                // const v0 = sumV/len
                // if(dir>0){
                //     if (v0.toFixed(2) > .2) {
                //         //    v^2 - v0^2 = 2ax
                //         let xLen = 2*(v0*v0)/(2*.02);          // x = v0^2/2a
                //         this.initPosition(this.currentPosition + xLen, max);   // s = v0*t + 1/2at^2
                //         this.move.speed[0] = v0/4;          //      t = v0/a
                //     } else {
                //         this.initPosition(this.currentPosition, max);
                //         this.move.speed[0] = this.move.speed[0] > 0.2 ? .2 : this.move.speed[0];
                //     }
                // }else{
                //     if (v0.toFixed(2) > .2) {
                //         // rate = max > this.liHeight * 15 ? dir * 2 : 0;   v^2 - v0^2 = 2ax
                //         let xLen = 2*(v0*v0)/(2*.02);          // x = v0^2/2a
                //         this.initPosition(this.currentPosition - xLen, max);   // s = v0*t + 1/2at^2
                //         this.move.speed[0] = v0/5;          //      t = v0/a
                //     } else {
                //         this.initPosition(this.currentPosition, max);
                //         this.move.speed[0] = this.move.speed[0] > 0.2 ? .2 : this.move.speed[0];
                //     }
                // }

                var variance = 0;
                var sum      = 0;
                for ( var i in arr ) {
                    sum += arr[i] - 0;
                }
                for ( var j in arr ) {
                    variance += (arr[j] - (sum / arr.length)) * (arr[j] - (sum / arr.length));
                }
                var rate = 0;
                if ((variance / arr.length).toFixed(2) > .1) {
                    rate = max > this.liHeight * 15 ? dir * 2 : 0;
                    this.initPosition(this.currentPosition + rate, max);
                    this.move.speed[0] = .2;
                } else {
                    this.initPosition(this.currentPosition, max);
                    this.move.speed[0] = this.move.speed[0] > 0.2 ? .2 : this.move.speed[0];
                }
            
                return this;
            },
            getDateArr(dis){
                switch(this.timeType){
                    case 'year':
                        this.$emit('changeResult',{
                        	id: 0,
                            type: 'year',
                        	data: dis/40 + this.list[0]
                        });
                        break;
                    case 'mouth':
                        this.$emit('changeResult',{
                        	id: 1,
                            type: 'mouth',
                        	data: dis/40 + this.list[0]
                        });
                        break;
                    case 'day':
                        this.$emit('changeResult',{
                        	id: 2,
                            type: 'day',
                        	data: dis/40 + this.list[0]
                        });
                        break;
                    case 'hour':
                        this.$emit('changeResult',{
                        	id: 3,
                            type: 'hour',
                        	data: dis/40 + this.list[0]
                        });
                        break;
                    case 'minute':
                        this.$emit('changeResult',{
                        	id: 4,
                            type: 'minute',
                        	data: dis/40 + this.list[0]
                        });
                }
            },
		},
        filters: {
            filterType(val){
                let types = {'year':'年','mouth':'月','day':'日','hour':'时','minute':'分'}
                if(val === '')return ;
                return types[val]
            }
        }
	}
</script>

<style lang="less" scoped>
.date-selector {
    display: inline-block;
    height: 200px;
    overflow: hidden;
    position: relative;
    z-index: -1;
    top: 0;
    vertical-align: top;
}

.date-selector .date-selector-left {
    width: 33.33%;
}

.date-selector .date-selector-right {
    width: 50%;
}

.date-selector ul::-webkit-scrollbar {
    display: none;
}

.date-selector li {
    height: 40px;
    text-align: center;
    font-size: 16px;
    line-height: 40px;
    list-style: none;
}
</style>