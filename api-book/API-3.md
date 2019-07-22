#API 说明 - 二次封装的第三方API

###ywork.wxAuthLogin(Object)
微信签名方法

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| debug | false | Boolean | 是否开启调试模式 |
| ajaxURL | false | String | 指定要请求的Ajax地址，默认: /yw/app/votebiz/getGroupTicket |
| succ | false | Function | 签名成功回调 |
| fail | false | Function | 签名失败回调 |

#####示例代码:
```
ywork.wxAuthLogin({
    debug: true,
    succ: function(res) {
        // 签名成功
    },
    fail: function(err) {
        // 签名失败
    }
});
```

---

###ywork.setTitle(String)
设置浏览器上显示的标题

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| title | true | String | 标题 |

#####示例代码:
```
ywork.setTitle('leo');
```

---

###ywork.uploadImage(Object)
上传图片

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| max | false | Number | 本次最大图片上传数量，默认为: 9 |
| succ | false | Function | 上传成功回调 |
| fail | false | Function | 上传失败回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| data | Array | （钉钉）网络地址列表 |
| localIds | Array | （微信）本地图片id列表 |
| serverIds | Array | （微信）服务端图片id列表 |


#####示例代码:
```
ywork.uploadImage({
	max: 6,
	succ: function(res) {
		console.log(res);
	}
});
```

*** 注: 解决了微信不能并行上传的问题 ***

---

###ywork.previewImage(Object)
预览图片

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| imgURL | true | String | 当前显示的图片链接 |
| imgList | false | Array | 图片地址列表 |
| succ | false | Function | 请求成功回调 |
| fail | false | Function | 请求失败回调 |

#####示例代码:
```
ywork.previewImage({
	imgURL: 'http://leochan2017.github.io/logo.png',
	imgList: ['http://leochan2017.github.io/logo1.png', 'http://leochan2017.github.io/logo2.png']
});
```

---

###ywork.getLocation(Object)
获取地理位置

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| targetAccuracy | false | Number | 期望定位精度半径（单位米），定位结果尽量满足该参数要求，但是不一定能保证小于该误差，开发者需要读取返回结果的 accuracy 字段校验坐标精度；建议按照业务需求设置定位精度，推荐采用300m，可获得较好的精度和较短的响应时长，默认为: 300 |
| succ | false | Function | 请求成功回调 |
| fail | false | Function | 请求失败回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| latitude | Number | 纬度，浮点数，范围为90 ~ -90 |
| longitude | Number | 经度，浮点数，范围为180 ~ -180 |
| accuracy | Number | 位置精度 |
| speed | String | （微信）速度，以米/每秒计|
| address | String | （钉钉） |
| province | String | （钉钉） |
| city | String | （钉钉） |
| district | String | （钉钉） |
| road | String | （钉钉） |
| netType | String | （钉钉） |
| operatorType | String | （钉钉） |
| errorMessage | String | （钉钉） |
| errorCode | Number | （钉钉） |
| isWifiEnabled | Boolean | （钉钉） |
| isGpsEnabled | Boolean | （钉钉） |
| isFromMock | Boolean | （钉钉） |
| provider | String | （钉钉）wifi、lbs、gps |
| isMobileEnabled | Boolean | （钉钉） |


#####示例代码:
```
ywork.getLocation({
	targetAccuracy: 300,
	succ: function(res) {
		console.log(res);
	}
});
```

---
###ywork.close()
触发关闭

#####示例代码:
```
ywork.close();
```

---

###ywork.getNetworkType(Object)
获取网络状态

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| succ | false | Function | 请求成功回调 |
| fail | false | Function | 请求失败回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| networkType | String | （微信）返回网络类型2g，3g，4g，wifi |
| result | String | （钉钉）wifi 2g 3g 4g unknown none，其中none表示离线 |


#####示例代码:
```
ywork.getNetworkType({
	succ: function(res) {
		console.log(res);
	}
});
```

---
###ywork.share(Object)
分享

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| url | true | String | 分享链接 |
| title | false | String | 分享标题 |
| content | false | String | 分享内容 |
| imageURL | false | String | 分享图标 |
| succ | false | Function | 请求成功回调 |
| fail | false | Function | 请求失败回调 |

#####示例代码:
```
ywork.share({
	url: 'http://leochan2017.github.io/',
	title: '刚刚写的接口，速度转',
	content: '不转不是码农',
	imageURL: 'http://leochan2017.github.io/logo1.png',
});

ywork.shareToWechatFriend();

```

*** 注: 听说微信下和 ywork.shareToWechatFriend 一起使用更配哟 ***

---
###ywork.wxOpenEnterpriseContact(Object)
微信企业号专用组织架构通讯录

** 请求参数 **

| 参数 | 必填 | 类型 | 描述 |
|:-------------|:-------------:|:-------------:|:-------------|
| isSingle | false | Boolean | 是否单选, 默认: false |
| departmentIds | false | Array | 可选部门ID列表（如果ID为0，表示可选管理组权限下所有部门）, 默认: [0] |
| tagIds | false | Array | 可选标签ID列表（如果ID为0，表示可选所有标签），默认: [0] |
| userIds | false | Array | 可选用户ID列表 |
| type | false | Array | 限制选择的类型，默认: ['department', 'tag', 'user'] |
| selectedDepartmentIds | false | Array | 已选部门ID列表 |
| selectedTagIds | false | Array | 已选标签ID列表 |
| selectedUserIds | false | Array | 已选用户ID列表 |
| succ | false | Function | 请求成功回调 |
| fail | false | Function | 请求失败回调 |

** 返回参数 **

| 参数 | 类型 | 描述 |
|:-------------|:-------------:|:-------------|
| userList | Array Object | 已选用户列表 |
| tagList | Array Object | 已选标签列表 |
| departmentList | Array Object | 已选部门列表 |
| selectAll | Boolean | 是否全选 |


#####示例代码:
```
ywork.wxOpenEnterpriseContact({
    type: ['user'],
    succ: function(res) {
        var deptIds = [],
            userIds = [],
            secDeptList = res.departmentList, // 已选的部门
            selcUserList = res.userList; // 已选的人员

        // 部门
        if (secDeptList.length > 0) {
            for (var i = 0; i < secDeptList.length; i++) {
                var department = secDeptList[i],
                    departmentId = department.id, // 已选的单个部门ID
                    departemntName = department.name; // 已选的单个部门名称

                deptIds.push(departmentId);
            }
        }

        // 人员
        if (selcUserList.length > 0) {
            for (var i = 0; i < selcUserList.length; i++) {
                var user = selcUserList[i],
                    userId = user.id, // 已选的单个成员ID
                    avatar = user.photo, // 已选单个成员的头像
                    userName = user.name; // 已选的单个成员名称

                userIds.push(userId);
            }
        }

       	// something
    },
    fail: function(res) {
        console.error('ywork.wxOpenEnterpriseContact error', res);
        ywork.toast(res.errMsg);
    }
});

```

*** 注: 使用此API必须使用ywork.wxAuthLogin进行签名 ***

---

