import {
    uniqueId,
    assign,
    includes,
    get,
    defer
} from 'lodash';
function ImagePreView(ImageList,index=0,options){
    let vm=this;
	const id=uniqueId('preView_');
	const tpl=`
        <transition name="fade" id="${id}">
		    <div class="fixed-full flex-container cmui-image-preView" v-if="show" @click="preViewListClick($event)" @touchmove.stop.prevent="function(){}">
		        <cmui-slider :watch="preViewList_temp" :page="true" :auto="0" :loop="preViewList_temp.length>1" :options="options">
		            <cmui-slider-item v-for="item in preViewList_temp" >
		                <img :src="item" alt="" style="max-height: 100vh">
		            </cmui-slider-item>
		        </cmui-slider>
		    </div>
	    </transition>
	`;
	let dom=document.createElement('div');
	dom.innerHTML=tpl;
	document.body.appendChild(dom);
    new Vue({
        el:'#'+id,
        data:{
            preViewList_temp:[].concat(ImageList),
            show:false,
            options:assign({initialSlide:index},options)
        },
        methods:{
            preViewListClick:function(event){
                event.stopPropagation();
                if(!includes(get(event,'target.classList'),'swiper-pagination-bullet')&&get(this,'$children[0]')){
                    this.$children[0].$destroy();
                    this.show=false;
                    this.$nextTick(function(){
                        vm.$emit('preview',false);
                        document.body.removeChild(dom)
                	});
                }
            }
        },
        mounted(){
            defer(()=>{
                this.show=true;
                vm.$emit('preview',true);
            });
        }
    });
}
export default ImagePreView;