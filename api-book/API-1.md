#API 说明 - 操作反馈

---

###ywork.alert(Object)
消息提示弹窗

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| title | false | String | 提示弹窗标题, 默认为空 |
| text | false | String | 提示文字内容, 默认为: 系统繁忙，请稍候再试 |

#####示例代码:
```
ywork.alert({
    title: '这是标题',
    text: '这是内容这是内容这是内容这是内容'
});
```

*** 注: 内容太长的话建议使用ywork.alert ***

---

###ywork.confirm(Object)
提示选择弹窗

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| title | false | String | 提示弹窗标题, 默认为空 |
| text | false | String | 提示文字内容, 默认为空 |
| confirmText | false | String | 确定按钮的文字，默认为：确定 |
| cancelText | false | String | 忽略按钮的文字，默认为：忽略 |
| confirmColor | false | HexColor | 确定按钮的文字颜色，默认为: #0BB20C |
| cancelColor | false | HexColor | 取消按钮的文字颜色，默认为: #353535 |
| succ | false | Function | 点击确定按钮回调 |
| fail | false | Function | 点击取消按钮回调 |

#####示例代码:
```
ywork.confirm({
    title: '提示',
    text: '你要启动自爆装置？',
    confirmText: '我想好了',
    cancelText: '那个，我手滑了',
    confirmColor: '#e64340',
    cancelColor: '#999',
    succ: function() {
        ywork.toast({
            text: '你点了确定',
            icon: true
        })
    },
    fail: function() {
        ywork.toast({
            text: '你点了取消'
        })
    }
});
```

---

###ywork.toast(Object)
消息提示弹窗(900毫秒消失)

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| text | false | String | 提示文字内容 |
| icon | false | Boolean | 图标, true: 成功图标; 默认为false: 失败图标 |
| duration | false | Number | 多少秒关闭，默认为900毫秒 |

#####示例代码:
```
ywork.toast({
    text: '请求成功',
    icon: true,
    duration: 1500
});
```

---

###ywork.showLoading(Object)
页面加载提示弹窗

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| text | false | String | 提示文字内容，默认为: 数据加载中 |

#####示例代码:
```
ywork.showLoading({
    text: '使劲加载中'
});
```

---

###ywork.hideLoading()
关闭页面加载提示弹窗

#####示例代码:
```
ywork.hideLoading()
```

---

###ywork.actionSheet(Object)
底部弹出选项弹窗

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| itemList | true | String Array | 待选项的文字数组 |
| succ | false | Function | 点击确定按钮回调 |
| fail | false | Function | 点击取消按钮回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Number | 所选项的下标，什么都没选择返回: -1 |

#####示例代码:
```
var arr = ['leo', 'jack', 'tom', 'wang'];

ywork.actionSheet({
    itemList: arr,
    succ: function(index) {
        console.log('你选择的是第' + index + '项');
    },
    fail: function(res) {
        console.log(res)
    }
});
```

---

###ywork.updateShow(Object)
更新历史弹窗

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| title | false | String | 标题，默认为空 |
| text | false | String | 内容，支持`<br />`换行，默认为空 |
| image | false | String | 图片URL，默认为空 |
| buttonText | false | String | 按钮上的文字，默认为: 我知道了 |

#####示例代码:
```
ywork.updateShow({
    title: '钉钉短视频，更大更清晰',
    text: '1，大画面全屏播放没有看潮<br>2，别人说要等到下午点<br>3，就回去了，后面看到潮水虽然没有电视播放的那么壮<br>4，但是感觉也不虚此行',
    image: 'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=2959746299,705519044&fm=96&s=6DF40FC2176634AC3005000B030080D2',
    buttonText: '我知道啦'
});
```

---