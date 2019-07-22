#API 说明 - 功能型

---

###ywork.includeJs(Object)
按需加载JS

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| url | true | String | 传入需要加载的URL |
| succ | false | Function | JS加载成功执行回调 |

#####示例代码:
```
ywork.includeJs({
	url: 'http://leochan2017.github.io//leojs.js',
	succ: function() {
		console.log('加载成功');
	}
});
```

---

###ywork.log(Anything, Anything)
* 加强console.log显示
* 移动端调试不方便时可以转为alert弹出log内容
* 允许传入参数为1~2个

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| window.leoType | true | Number | 调试显示的类型，只需整个程序中声明一次即可，0为alert，1为console |
| Param1 | false | Anything | 需要打印的内容 |
| Param2 | false | Anything | 需要打印的内容 |

#####示例代码:
```
window.leoType = 0; // 只需声明一次
ywork.log('XXX接口返回', res);
```

---

###ywork.ajax()
链式调用的ajax

** 调用参数 **

| 方法 | 参数 | 必填 | 类型 | 描述 |
|:-------------||:-------------:|:-------------:|:-------------|
| get | url, data | true | String, Object | 请求URL, 请求参数， Get请求可以在URL上带上参数，那么第二个参数就可以不传了 |
| post | url, data | true | String, Object | 请求URL, 请求参数 |
| before | Function | false | Function | 请求前置处理回调 |
| succ | Function | false | Function | 请求成功回调 |
| fail | Function | false | Function | 请求失败回调 |


#####示例代码:
```
ywork.ajax().before([Function]).get|post(url, data).always([Function]).succ([Function]).fail([Function])
```

*** 注: always、succ、fail可连续调用多次，即succ().succ().succ()... ***

---

###ywork.avatar(Object)
根据名字生成用户头像

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| name | true | String | 用户名字，默认截取最后2个字符 |
| size | false | Number | 生成的图像的大小, 默认为: 90 |
| font | false | String | 图片上显示的字体, 默认为: 36px 微软雅黑 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| DataURL | Base64 String | 可放到img标签的src处使用 |


#####示例代码:
```
ywork.avatar({
	name: '雷奥'
});
```

---

###ywork.complexChoose(Object)
选人 选部门组件

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| ajaxURL | true | String | 请求Ajax地址，当debug为false时，此参数必传 |
| id | false | String | 初始请求指定部门的id，默认为空 |
| onlyDepartment | false | Boolean | 是否只能选择部门（部门选择器），默认为: false |
| onlyUser | false | Boolean | 是否只能选择人员（人员选择器），默认为: false |
| debug | false | Boolean | Debug模式，默认为: false |
| succ | false | Function | 点击确定按钮的回调 |
| fail | false | Function | 点击取消按钮的回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| deptList | Array | 已选部门列表 |
| userList | Array | 已选用户列表 |


#####示例代码:
```
ywork.complexChoose({
    debug: true,
    onlyDepartment: false,
    onlyUser: false,
    succ: function(res) {
        console.log(res);
    }
});
```

---

###ywork.shareToWechatFriend()
引导分享弹层

#####示例代码:
```
ywork.shareToWechatFriend()
```

*** 注: 听说微信下和 ywork.share 一起使用更配哟 ***

---

###ywork.clock(Object)
提醒控件

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| list | true | Array | 候选值, 传入毫秒 |
| selectList | false | String | 预选值, 传入毫秒，默认为空 |
| succ | false | Function | 点击确定按钮的回调 |
| fail | false | Function | 点击取消按钮的回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Array | 已选项数组 |


#####示例代码:
```
var list = [],
    arr = [0, 5, 15, 25, 35, 60, 120];

// 转换成毫秒
for (var i = 0; i < arr.length; i++) {
    list.push(arr[i] * 60 * 1000);
}

ywork.clock({
    list: list,
    succ: function(res) {
        console.log('你选中的是' + res);
    }
});
```

---

###ywork.getUrlParam(String)
获取浏览器参数

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| Param | true | String | 需要获取的浏览器参数的Key |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | String | 获取的浏览器参数的Value |


#####示例代码:
```
var id = ywork.getUrlParam('id');
```

---

###ywork.isAndroid()
判断当前运行是否安卓环境

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Boolean | true: 安卓, false: 非安卓 |


#####示例代码:
```
if (ywork.isAndroid()) {
	console.log('当前是安卓环境');
}
```

---

###ywork.indexOfArray()
检测数组是否存在某个值

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| array | true | Array | 待检测数组 |
| value | true | String | 要检测的值 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Number | 如存在，返回下标；如不存在，返回-1 |


#####示例代码:
```
ywork.indexOfArray({
    array: ['leo', 'jack', 'tom'],
    value: 'tom'
});
```

---


###ywork.friendChoose(Object)
选好友组件

** 调用参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| resList | true | Object Array | 传入可选的列表 |
| primaryList | false | Object Array | 预选用户 |
| title | false | String | 标题 |
| succ | false | Function | 点击确定按钮的回调 |
| fail | false | Function | 点击取消按钮的回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Object Array | 已选用户列表 |


#####示例代码:
** 默认 **

```
ywork.friendChoose({
    title: '默认演示',
    succ: function(res) {
        ywork.log(res);
    }
});

```

** 预选用户 **

```
var arr = [{
    'uid': 'p0' // ID必须
}, {
    'uid': 'p2'
}, {
    'uid': 'p7'
}];

ywork.friendChoose({
    title: '预选用户演示',
    primaryList: arr,
    succ: function(res) {
        console.log(res);
    }
});
```

** 可选范围 **

```
var arr = [{
    'uid': 'p2', // ID必须
    'n': '曹丕' // name必须 , 头像可选
}, {
    'uid': 'p7',
    'n': '曹熊'
}];

ywork.friendChoose({
    title: '可选范围演示',
    resList: arr,
    succ: function(res) {
        console.log(res);
    }
});

```

** 在可选范围内预选用户 **

```
var arr1 = [{
    'uid': 'p7' // ID必须
}];

var arr2 = [{
    'uid': 'p2', // ID必须
    'n': '曹丕' // name必须 , 头像可选
}, {
    'uid': 'p7',
    'n': '曹熊'
}];

ywork.friendChoose({
    title: '在可选范围内预选用户演示',
    primaryList: arr1,
    resList: arr2,
    succ: function(res) {
        console.log(res);
    }
});

```

---