<template>
    <div id="selectDemo">
        <div class="example tag-container padding40">
            <cmui-number
            v-bind="options"
            :target-class="targetClass"
            @max="maxHandle"
            @min="minHandle"
            @input="inputHandle"
            @before-change="demoBefore"
            v-model="options.value">
                <span :class="(options.align==='left')?'marginr20':'marginl20'">
                    数字输入
                </span>
            </cmui-number>
        </div>
<!--         <div class="form tag-container config">
          <div class="flex-container">
          </div>
            <cmui-list :space="10">
                <cmui-list-item>
                    <div class="flex-container">
                        <label>文本显示位置</label>
                        <div class="">
                            <cmui-radio name="align" v-model="options.align" label="left">
                                左侧
                            </cmui-radio>
                            <cmui-radio name="align" v-model="options.align" label="right">
                                右侧
                            </cmui-radio>
                        </div>
                    </div>
                </cmui-list-item>
                <cmui-list-item>
                    <p>target-class</p>
                    <div class="flex-container">
                        <cmui-checkbox :key="key" v-for="(item,key) in targetClassList" v-model="item.value">
                            {{item.text}}
                        </cmui-checkbox>
                    </div>
                </cmui-list-item>
            </cmui-list>
        </div>
        <div class="otherExp tag-container">
            <p>带有延时的按钮，例如点击加减号的时候需要通过ajax的状态判断是否增加，下面的案例用setTimeout来模拟</p>
            <cmui-number @before-change="demoBefore"  v-model="demoValue" :max="22" :min="18">
                <span class="marginr20">异步按钮</span>
            </cmui-number>
        </div> -->
        <div class="fixed-bottom bg-black paddingv25 paddingh50 fs-16" style="z-index:1">
            <div class="btn-group flex-container">
                <span class="text-white left flex2" style="min-width: 55px;">位置</span>
                <div class="flex-container flex3" style="background: rgba(102,102,102,0.60);border-radius: 16px;border-radius: 16px;">
                    <div class="flex1 flex-container center" style="padding:3px;"><div class="badge blue pill" @click="options.align='left'" :class="options.align=='left'?'badgeCurrent':'badgeDefault'">Left</div></div>
                    <div class="flex1 flex-container center" style="padding:3px;"><div class="badge blue pill" @click="options.align='right'" :class="options.align=='right'?'badgeCurrent':'badgeDefault'">Right</div></div>
                </div>
            </div>
            <div class="form NewStyle">
                <div class="flex-container marginv30">
                    <div class="flex1 marginr50">
                        <cmui-checkbox
                        :flex="true"
                        target-class="switch"
                        class="text-white"
                        v-model="options.flex">flex布局</cmui-checkbox>
                    </div>
                    <div class="flex1 marginl50">
                        <cmui-checkbox
                        :flex="true"
                        target-class="switch"
                        class="text-white"
                        v-model="demoBeforeTime">异步操作</cmui-checkbox>
                    </div>
                </div>
            </div>
            <div class="form NewStyle">
                <div class="paddingv20 text-white">Target-Class</div>
                <div class="flex-container paddingv40 formNewStyle" style="margin:0 -2px;">
                    <div class="btn flex1" v-for="(item,key) in targetClassList" :class="item.value && 'current'" @click="item.value = !item.value" v-text="item.text"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
    #selectDemo{
        .form{
            .cmui-list-item-container{
                padding:1px;
            }
        }
    }
</style>
<script>
export default {
  data: function() {
    return {
      options: {
        max:5,
        min:0,
        value:0,
        flex:false,
        align:'left'
      },
      demoBeforeTime:false,
      targetClassList:['small','big','radius','reverse'].map(item=>({text:item,value:false})),
        // demoBefore(newValue,resolve,reject){
        //     _.delay(resolve,1000)
        // },
      demoValue:20
    };

  },
  computed:{
    targetClass(){
      return this.targetClassList.filter(item=>item.value).map(item=>item.text).join(' ');
    }
  },
  methods:{
    maxHandle(value){
        maple.alert('最大值为'+value)
    },
    minHandle(value){
        maple.alert('最小值为'+value)
    },
    inputHandle(name){
        console.log(name)
    },
    demoBefore(newValue,resolve,reject){
        return _.delay(resolve,this.demoBeforeTime ? 1000 : 0)
    }
  }
};
</script>
