# notice
notice组件用于在页面中创建一个居中的提示层，通常用于反馈提示。
## 使用方法
```javascript
maple.notice(options)
```
### options

|属性名称|类型|默认值|说明
|---|---|---|---|
|content|String|''|弹出的内容
|className|String|''|内容区域的class
|timeout|Number|3000|展示时间设置为0则不展示
|closeFn|Function|''|关闭时的回调
|targetClass|String|''|整体的class
## 简洁用法
通常情况下我们只需要弹出提示，一定时间后自动消失，那么使用下面的代码就可以，time的默认值为300毫秒。
```javascript
maple.notice(content,[time])
```
有些时候我们需要手动控制提示框。这时我们可以将运行结果保存起来，并且在必要的时候调用cancel方法。
```javascript
let vm=maple.notice('some content',0)//设置时间为0，即一直显示
vm.content='other content'//修改弹窗内容
vm.cancel()//必要的时候手动关闭。
```
## 样式接口
```scss
// notice
.cmui-notice.cmui-popup{
    .cmui-popup__mask{}
    &.cmui-notice__container{
        .cmui-notice__warp{
            .cmui-notice__body{}
        }
    }
}
// 平行样式接口
.cmui-notice .cmui-popup__mask{}
.cmui-notice__container{}
.cmui-notice__warp{}
.cmui-notice__body{}
```