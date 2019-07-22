// ywork JSAPI 2.0
// by leo 20161117
//
//
//                                  _oo8oo_
//                                 o8888888o
//                                 88" . "88
//                                 (| -_- |)
//                                 0\  =  /0
//                               ___/'==='\___
//                             .' \\|     |// '.
//                            / \\|||  :  |||// \
//                           / _||||| -:- |||||_ \
//                          |   | \\\  -  /// |   |
//                          | \_|  ''\---/''  |_/ |
//                          \  .-\__  '-'  __/-.  /
//                        ___'. .'  /--.--\  '. .'___
//                     ."" '<  '.___\_<|>_/___.'  >' "".
//                    | | :  `- \`.:`\ _ /`:.`/ -`  : | |
//                    \  \ `-.   \_ __\ /__ _/   .-` /  /
//                =====`-.____`.___ \_____/ ___.`____.-`=====
//                                  `=---=`
//
//
//               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//                          田神保佑          不要有bug
//
(function(w) {
    var ywork = ywork || {},
        api = false,
        __FILEPATH__ = '',
        groupData; // 微信免登后存储的groupData

    if (typeof dd == 'object') {
        api = 'dd';
    } else if (typeof wx == 'object') {
        api = 'wx';
    }

    // 内部用 检测并自动加载CSS
    var _checkCSS = function() {
        var hrefs = '',
            linkSum = 0,
            jsName = 'ywork.js',
            cssName = '../css/ywork.css',
            linkTag = document.getElementsByTagName('link'),
            scriptTags = document.getElementsByTagName('script');

        __FILEPATH__ = scriptTags[scriptTags.length - 1].getAttribute('src');

        // 如果找不到 则使用比较保险的方法
        if (__FILEPATH__.indexOf(jsName) == -1) {
            for (var i = 0; i < scriptTags.length; i++) {
                var _src = scriptTags[i].src;
                if (typeof _src != 'undefined' && _src.indexOf(jsName) != -1) {
                    _src = _src.substring(0, _src.indexOf(jsName));
                    __FILEPATH__ = _src;
                    break;
                }
            }
        }

        __FILEPATH__ = __FILEPATH__.substring(0, __FILEPATH__.indexOf(jsName));

        var cssURL = __FILEPATH__ + cssName;

        // console.log('cssURL', cssURL);

        // 检查是否有加载css
        for (var i = 0; i < linkTag.length; i++) {
            hrefs = linkTag[i].getAttribute('href');
            if (hrefs.indexOf(cssURL) != -1) {
                linkSum++;
                break;
            }
        }

        if (linkSum == 0) {
            headTag = document.getElementsByTagName('head')[0];
            linkTag = document.createElement('link');
            linkTag.setAttribute('rel', 'stylesheet');
            linkTag.setAttribute('href', cssURL);
            headTag.appendChild(linkTag);
        }
    };

    _checkCSS();

    /**
     * [_createDiv description]
     * @param  {[type]} name     [description]
     * @param  {[type]} strHtml  [description]
     * @param  {[type]} callBack [description]
     * @return {[type]}          [description]
     */
    var _createDiv = function(name, strHtml, callBack) {
        if (document.getElementById(name) == undefined) {
            var div = document.createElement('div');

            div.innerHTML = strHtml;

            div.setAttribute('id', name);

            document.getElementsByTagName('body')[0].appendChild(div);

            if (typeof callBack == 'function') {
                callBack(div);
            }
        }
    };

    ywork.includeJs = function(options) {
        var options = options || {},
            url = options.url,
            script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];

        script.type = 'text/javascript';

        script.src = url;

        head.appendChild(script);

        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    if (typeof options.succ == 'function') {
                        options.succ();
                    }
                }
            };
        } else { // 标准浏览器
            script.onload = function() {
                if (typeof options.succ == 'function') {
                    options.succ();
                }
            };
        }
    };

    ywork.log = function() {
        if (typeof window.leoType == 'undefined') {
            return;
        }

        var param = arguments[0];

        if (window.leoType == 0) {
            var json = arguments[1];

            if (typeof json != 'undefined') {
                alert(param + ':' + JSON.stringify(json));
                return;
            }

            if (typeof param == 'object') {
                alert(JSON.stringify(param));
            } else {
                alert(param);
            }
            return;
        }

        if (arguments.length == 2) {

            var obj = arguments[1];

            console.group && console.group(param);

            console.info(obj);

            console.groupEnd && console.groupEnd();
        }

        if (arguments.length == 1) {

            if (typeof param == 'object') {
                console.info(param);
                return;
            }

            if (param == '') {
                console.error('传入参数为空');
                return;
            }

            console.log('%c' + param, 'color:red');
        }

    };

    /**
     * [ajax 可链式调用的ajax]
     * @param  {[object]} options [初始化参数对象，传入后会替换掉原参数，一般不用传]
     * 链式调用方式：ywork.ajax().before([Function]).get|post(url, data).always([Function]).succ([Function]).fail([Function])
     * 注：always、succ、fail可连续调用多次，即succ().succ().succ()...
     */
    ywork.ajax = function(options) {
        // 默认初始化参数对象，可悲options替换
        var _options = {
            async: true, // 是否异步
            contentType: 'application/json; charset=utf-8', // POST时，head编码方式，默认json
            jsonForce: true // 是否强制要求返回格式为json
        };
        // 覆盖默认参数对象
        if (Object.prototype.toString.call(options) == '[object Object]') {
            for (var pname in options) {
                _options[pname] = options[pname];
            }
        }
        // 生成xhr对象，懒函数
        var createXHR = function() {
            try {
                xhr = new XMLHttpRequest(); // 直接创建
                createXHR = function() {
                    return new XMLHttpRequest()
                };
            } catch (e) {
                try {
                    xhr = new ActiveXObject('Msxml2.XMLHTTP'); // IE高版本创建XMLHTTP
                    createXHR = function() {
                        return new ActiveXObject('Msxml2.XMLHTTP')
                    };
                } catch (e) {
                    try {
                        xhr = new ActiveXObject('Microsoft.XMLHTTP'); // IE低版本创建XMLHTTP
                        createXHR = function() {
                            return new ActiveXObject('Microsoft.XMLHTTP')
                        };
                    } catch (e) {
                        xhr = null;
                        createXHR = function() {
                            return null
                        };
                    }
                }
            }
            return xhr;
        }
        var xhr = createXHR();
        var doAjax = function(url, data, method) {
            // 300ms内跑完Ajax不显示loading
            var _sTime = setTimeout(function() {
                ywork.showLoading();
            }, 300);

            // 开始执行ajax
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    // 执行always里面的函数
                    for (var i = 0, l = main.alwaysCallbacks.length; i < l; i++) {
                        main.alwaysCallbacks[i](xhr.responseText, xhr);
                    }
                    // 返回结果转换为json
                    var resJson;

                    try {
                        resJson = JSON.parse(xhr.responseText || null);
                    } catch (e) {
                        resJson = undefined;
                    }

                    var status = xhr.status;

                    // ajax失败回调
                    if (status < 200 || (status >= 300 && status != 304) || (_options.jsonForce && typeof(resJson) === 'undefined')) {
                        clearTimeout(_sTime);
                        ywork.hideLoading();
                        // 执行errCallbacks里面的函数
                        for (var i = 0, l = main.errCallbacks.length; i < l; i++) {
                            main.errCallbacks[i](xhr.responseText, xhr);
                        }
                    } else { // ajax成功回调
                        clearTimeout(_sTime);
                        ywork.hideLoading();
                        // 执行sucCallbacks里面的函数
                        for (var i = 0, l = main.sucCallbacks.length; i < l; i++) {
                            main.sucCallbacks[i](resJson, xhr);
                        }
                    }

                }
            }
            xhr.open(method, url, _options.async);
            // 如果是post要改变头
            method === 'POST' && xhr.setRequestHeader('Content-Type', _options.contentType);
            xhr.send(data || null);
        }

        var main = {
            sucCallbacks: [],
            errCallbacks: [],
            alwaysCallbacks: [],
            options: _options,
            get: function(url, data) {
                doAjax(url, data, 'GET');
                return main;
            },
            post: function(url, data) {
                doAjax(url, data, 'POST');
                return main;
            }
        };
        /**
         * 设置多个请求头
         * @param  {object} headers
         */
        main.headers = function(headers) {
            if (Object.prototype.toString.call(headers) === '[object Object]') {
                for (var name in headers) {
                    console.log(name + ' ' + headers[name]);
                    console.log(xhr)
                    xhr.setRequestHeader(name, headers[name]);
                }
            }
        };
        /**
         * 设置前置处理方法
         * @param  {Function} callback
         */
        main.before = function(callback) {
            typeof(callback) === 'function' && callback(xhr);
            return main;
        };
        /**
         * 分别是成功、失败、完成的回调函数
         * @param  {Function} callback [description]
         */
        main.succ = function(callback) {
            typeof(callback) === 'function' && main.sucCallbacks.push(callback);
            return main;
        };
        main.fail = function(callback) {
            typeof(callback) === 'function' && main.errCallbacks.push(callback);
            return main;
        };
        main.always = function(callback) {
            typeof(callback) === 'function' && main.alwaysCallbacks.push(callback);
            return main;
        };
        return main;
    };

    ywork.alert = function(options) {
        var options = options || {},
            text = options.text || '系统繁忙，请稍候再试',
            title = options.title || '',
            strHtml = '<div class=weui_dialog_alert><div class=weui_mask></div><div class=weui_dialog><div class=weui_dialog_hd><strong class=weui_dialog_title>' + title + '</strong></div><div class=weui_dialog_bd>' + text + '</div><div class=weui_dialog_ft><a href="javascript: void(0);" class="weui_btn_dialog primary">确定</a></div></div></div>';

        _createDiv('ywork-jsapi-alert', strHtml, function(div) {
            var closeBtn = document.getElementsByClassName('weui_btn_dialog primary')[0];

            closeBtn.onclick = function() {
                div.parentNode.removeChild(div);
            };
        });
    };

    ywork.confirm = function(options) {
        var options = options || {},
            title = options.title || '',
            text = options.text || '',
            confirmText = options.confirmText || '确定',
            cancelText = options.cancelText || '忽略',
            confirmColor = options.confirmColor || '#0BB20C',
            cancelColor = options.cancelColor || '#353535',
            strHtml = '<div class=weui_dialog_confirm><div class=weui_mask></div><div class=weui_dialog><div class=weui_dialog_hd><strong class=weui_dialog_title>' + title + '</strong></div><div class=weui_dialog_bd>' + text + '</div><div class=weui_dialog_ft><a href="javascript:void(0);" class="weui_btn_dialog default" style="color: ' + cancelColor + '">' + cancelText + '</a><a href="javascript:void(0);" class="weui_btn_dialog primary" style="color: ' + confirmColor + '">' + confirmText + '</a></div></div></div>';

        _createDiv('ywork-jsapi-confirm', strHtml, function(div) {
            var succBtn = document.getElementsByClassName('weui_btn_dialog primary')[0],
                failBtn = document.getElementsByClassName('weui_btn_dialog default')[0];

            succBtn.onclick = function() {
                div.parentNode.removeChild(div);
                if (typeof options.succ == 'function') {
                    options.succ();
                }
            };

            failBtn.onclick = function() {
                div.parentNode.removeChild(div);
                if (typeof options.fail == 'function') {
                    options.fail();
                }
            };

        });
    };

    ywork.toast = function(options) {
        var options = options || {},
            text = options.text || '系统繁忙<br>请稍候再试',
            iconLogo = options.icon ? 'weui_icon_toast' : 'weui_icon_toast_error',
            duration = options.duration || 900,
            strHtml = '<div  class=toast><div class=weui_mask_transparent></div><div class=weui_toast><i class=' + iconLogo + '></i><p class=weui_toast_content>' + text + '</p></div></div>';

        _createDiv('ywork-jsapi-toast', strHtml, function(div) {
            setTimeout(function() {
                div.parentNode.removeChild(div);
            }, duration);
        });
    };

    ywork.showLoading = function(options) {
        var options = options || {},
            text = options.text || '数据加载中',
            strHtml = '<div class=weui_loading_toast><div class=weui_mask_transparent></div><div class=weui_toast><div class=weui_loading><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div><p class=weui_toast_content>' + text + '</p></div></div>';

        _createDiv('ywork-jsapi-showLoading', strHtml);
    };

    ywork.hideLoading = function() {
        var div = document.getElementById('ywork-jsapi-showLoading');
        div && div.parentNode.removeChild(div);
    };

    ywork.actionSheet = function(options) {
        var options = options || {},
            itemList = options.itemList,
            listHtml = '',
            succFn = function(index) {
                if (typeof options.succ == 'function') {
                    options.succ(index);
                }
            },
            failFn = function(res) {
                if (typeof options.fail == 'function') {
                    options.fail(res);
                }
            };

        if (typeof itemList == 'undefined' || !itemList instanceof Array || itemList.length == 0) {
            console.error('check your array');
            return;
        }

        // 生成每一项
        for (var i = 0; i < itemList.length; i++) {
            listHtml += '<div data-index=' + i + ' class="weui_actionsheet_cell item">' + itemList[i] + '</div>';
        }

        var strHtml = '<div class="weui_mask_transition weui_fade_toggle"></div><div class="weui_actionsheet weui_actionsheet_toggle"><div class="weui_actionsheet_menu">' + listHtml + '</div><div class="weui_actionsheet_action"><div class="weui_actionsheet_cell cancel_btn">取消</div></div></div>';

        _createDiv('ywork-jsapi-actionsheet', strHtml, function(div) {
            var mask = document.getElementsByClassName('weui_mask_transition')[0],
                cancelBtn = document.getElementsByClassName('weui_actionsheet_cell cancel_btn')[0],
                itemListArr = document.getElementsByClassName('weui_actionsheet_cell item');


            mask.style.display = 'block';
            mask.onclick = function() {
                div.parentNode.removeChild(div);
                failFn(-1);
            }

            cancelBtn.onclick = function() {
                div.parentNode.removeChild(div);
                failFn(-1);
            };

            if (itemListArr && itemListArr.length > 0) {
                for (var i = 0; i < itemListArr.length; i++) {
                    itemListArr[i].onclick = function() {
                        div.parentNode.removeChild(div);
                        succFn(parseInt(this.getAttribute('data-index')));
                    };
                }
            }
        });
    };

    ywork.updateShow = function(options) {
        var options = options || {},
            title = options.title || '',
            text = options.text || '',
            imgHtml = options.image ? '<img src=" ' + options.image + ' "  class=weui_dialog_img  />' : '',
            buttonText = options.buttonText || '我知道了',
            strHtml = '<div class=weui_dialog_confirm><div class=weui_mask></div><div class=weui_dialog><div class=weui_dialog_hd>' + imgHtml + '<h3>' + title + '</h3><div class=weui_dialog_bd>' + text + '</div></div><div class=weui_dialog_ft><a href="javascript:void(0);" class="weui_btn_dialog primary">' + buttonText + '</a></div></div></div>';

        _createDiv('ywork-jsapi-updateShow', strHtml, function(div) {
            var closeBtn = document.getElementsByClassName('weui_btn_dialog primary')[0];

            closeBtn.onclick = function() {
                div.parentNode.removeChild(div);
            };
        });
    };


    /**
     * 创建头像
     * @param    String    name 名字
     * @param    Number    size 图像大小 [如果觉得模糊请传入3倍]
     * @param    String    font 字体
     * @return   String    img的src
     */
    ywork.avatar = function(options) {
        var options = options || {},
            name = options.name || '',
            imgW = options.size || 90,
            font = options.font || '36px 微软雅黑';

        function _isEnglish(name) {
            return name.match(/^([a-zA-Z]|\s|,|\.)+$/) !== null;
        };

        var colors = ["#78c06e", "#f65e8d", "#f6bf26", "#f65e5e", "#5e97f6", "#9a89b9", "#a1887f", "#ff943e", "#5ec9f6", "#3bc2b5", "#5c6bc0", "#bd84cd", "#6bb5ce", "#c5cb63", "#ff8e6b", "#78919d"];

        var colorsLength = colors.length;

        var AvatarService = {
            getAvatar: function(name) {

                var name = this._getShowName(name);
                var color = this._getColor(name);

                return {
                    name: name,
                    color: color
                };
            },
            _getShowName: function(name) {
                var showName = name || "",
                    arr = [];

                if (_isEnglish(showName)) {
                    //将“,.”转为空格，如果导致出现连续空格（如原字符为", "，则转换后会为"  "），
                    //则将连续空格转换为单个空格
                    showName = showName.replace(/,|\./g, " ").replace(/\s+/g, " ");

                    arr = showName.split(" ");

                    if (arr.length === 1) {
                        return showName.slice(0, 2);
                    }

                    return arr[0].slice(0, 1) + arr[1].slice(0, 1);
                }
                return showName.replace(/,|\.|\s+/g, "").slice(-2);
            },
            _getColor: function(name) {
                var total = 0;
                for (char in name) {
                    total += name.charCodeAt(char);
                }
                return colors[total % colorsLength];
            }
        };

        function getUserAvatar(name, imgW, font) {
            var info = AvatarService.getAvatar(name),
                imgW = imgW,
                font = font,
                canvas = document.createElement('canvas'),
                cxt = canvas.getContext('2d');

            canvas.width = canvas.height = imgW;
            cxt.rect(0, 0, imgW, imgW);
            cxt.fillStyle = info.color;
            cxt.fill();
            cxt.font = font;
            cxt.textBaseline = 'middle';
            cxt.textAlign = 'center';
            cxt.fillStyle = '#fff';
            cxt.fillText(info.name, imgW / 2, imgW / 2);
            return canvas.toDataURL();
        }

        return getUserAvatar(name, imgW, font);

    };

    /**
     * [选人 选部门]
     * @param  {String}     ajaxURL         [必须, 请求Ajax地址]
     * @param  {String}     id              [可选, 初始请求指定部门的id]
     * @param  {Boolean}    onlyDepartment  [可选, 只能选择部门]
     * @param  {Boolean}    onlyUser        [可选, 只能选择人员]
     * @param  {Boolean}    debug           [可选, 开启Debug模式]
     * @param  {Function}   succ            [可选, 点击确定按钮的回调]
     * @param  {Function}   fail          [可选, 点击取消按钮的回调]
     *
     * @return {Array}      deptList        [已选部门列表]
     * @return {Array}      userList        [已选用户列表]
     */
    ywork.complexChoose = function(options) {
        var _options = options || {},
            _ajaxURL = options.ajaxURL,
            _id = options.id || '',
            _onlyDepartment = options.onlyDepartment || false,
            _onlyUser = options.onlyUser || false,
            _debug = options.debug || false,
            _succ = options.succ || function(res) {},
            _fail = options.fail || function(res) {},
            $thisMain;

        if (!_debug && typeof _ajaxURL == 'undefined') {
            console.error('must be need ajaxURL');
            return;
        }

        var domServer = {
            calcSum: function() {
                var $subBtn = $thisMain.querySelector('#submit-btn'),
                    $span = $thisMain.querySelector('#submit-btn span'),
                    $allBtn = $thisMain.querySelector('#checkall'),
                    sum = $thisMain.querySelectorAll('.b-flex > li').length;

                if (sum <= 0) {
                    $subBtn.disabled = true;
                    $span.innerHTML = '';
                    $allBtn.querySelector('i.g-check').className = 'g-check';
                } else {
                    $subBtn.disabled = false;
                    $span.innerHTML = '(' + sum + ')';
                }
            },
            // 判断该部门下的选项是否都选上，是则勾上‘全选’按钮的勾
            checkAllState: function() {
                var $allLi = $thisMain.querySelectorAll('li[data-name] i.g-check'),
                    $checkAllBtn = $thisMain.querySelector('#checkall i.g-check'),
                    value = true; // 默认勾上全选按钮

                for (var i = 0; i < $allLi.length; i++) {
                    if ($allLi[i].className.indexOf('checked') == -1) {
                        // 只有一个不是，就不勾上全选按钮
                        value = false;
                        break;
                    }
                }

                if (value) {
                    $checkAllBtn.className = 'g-check checked';
                } else {
                    $checkAllBtn.className = 'g-check';
                }
            },
            // 部门选中自动去掉后面的箭头
            checkDepartment: function() {
                var $allLi = $thisMain.querySelectorAll('.dropdown-box li[data-type="1"]');

                // console.log($allLi);

                for (var i = 0; i < $allLi.length; i++) {
                    var rightIconStyle = 'block';

                    if ($allLi[i].querySelector('i.g-check').className.indexOf('checked') != -1) {
                        rightIconStyle = 'none';
                    }

                    $allLi[i].querySelector('div.b-righticon').style.display = rightIconStyle;
                }
            },
            // 增加底部用户
            _addBottomtUser: function(id, name, avatar, type) {
                var $bootomLi = document.createElement('li');

                $bootomLi.setAttribute('data-id', id);
                $bootomLi.setAttribute('data-name', name);
                $bootomLi.setAttribute('data-type', type);

                $bootomLi.innerHTML = '<img src="' + avatar + '" class="linkman-box-img"><a class="g-add del-icon"></a>';

                $thisMain.querySelector('#select-user ul.b-flex').appendChild($bootomLi);

                this.calcSum();

                this.bind.delectUser();
            },
            // 获取预选用户
            _getPrimaryUser: function() {
                var $li = $thisMain.querySelectorAll('.b-flex > li[data-id]');

                if ($li.length > 0) {
                    var primaryUser = [];

                    for (var i = 0; i < $li.length; i++) {
                        var obj = {
                            id: $li[i].getAttribute('data-id'),
                            name: $li[i].getAttribute('data-name'),
                            type: $li[i].getAttribute('data-type'),
                            avatar: $li[i].querySelector('img').src
                        };

                        primaryUser.push(obj);
                    }

                    return primaryUser;
                }

                // return null;
            },
            // 设置预选用户
            _setPrimaryUser: function(primaryUser) {
                if (!primaryUser || typeof primaryUser == 'undefined') {
                    return;
                }

                var $allCheck = $thisMain.querySelectorAll('li[data-name]'),
                    ids = [];

                for (var i = 0; i < primaryUser.length; i++) {
                    ids.push(primaryUser[i].id);
                }

                // 匹配预选部门和用户
                for (var i = 0; i < $allCheck.length; i++) {
                    var thisId = $allCheck[i].getAttribute('data-id');
                    if (ywork.indexOfArray({ array: ids, value: thisId }) != -1) {
                        $allCheck[i].querySelector('i.g-check').className = 'g-check checked';
                    }
                }

                // 给底部加上匹配预选用户
                for (var i = 0; i < primaryUser.length; i++) {
                    var id = primaryUser[i].id,
                        name = primaryUser[i].name || '',
                        type = primaryUser[i].type || '',
                        avatar = primaryUser[i].avatar || ywork.avatar({ name: name });

                    this._addBottomtUser(id, name, avatar, type);

                }

                domServer.checkDepartment();

            },
            bind: {
                // 返回上一个部门函数
                preDepartment: function() {
                    var $preText = $thisMain.querySelector('#preDepartment');

                    if ($preText != null) {
                        $preText.onclick = function() {
                            var id = this.getAttribute('data-pid'),
                                primaryUser = domServer._getPrimaryUser();

                            getDate(id, primaryUser, true);
                        }
                    }
                },
                // 进入下一个部门函数
                nextDepartmentFn: function($li) {
                    var id = $li.getAttribute('data-id'),
                        primaryUser = domServer._getPrimaryUser();

                    getDate(id, primaryUser, true);
                },
                // 选择部门和人员的函数
                _selectFn: function($li) {
                    var id = $li.getAttribute('data-id'),
                        $i = $li.querySelector('i.g-check');

                    // console.log(id);
                    // console.log($i);
                    if ($i.className.indexOf('checked') != -1) { // 进行取消
                        $i.className = 'g-check';

                        var $bottomLi = $thisMain.querySelector('.b-flex li[data-id="' + id + '"]');

                        $bottomLi.parentNode.removeChild($bottomLi);

                        domServer.calcSum();
                    } else { // 进行选中
                        $i.className = 'g-check checked';

                        var name = $li.getAttribute('data-name') || '',
                            type = $li.getAttribute('data-type');

                        if ($li.querySelector('img') == null) {
                            var avatar = ywork.avatar({ name: name });
                        } else {
                            var avatar = $li.querySelector('img').src;
                        }

                        domServer._addBottomtUser(id, name, avatar, type);
                    }

                    // 非只选人 则可以检测下部门
                    if (!_onlyUser) {
                        domServer.checkDepartment();
                    }

                    domServer.checkAllState();
                },
                // 底部头像 删除已选的部门和人员的函数
                _bottomDelectFn: function($bottomLi) {
                    var id = $bottomLi.getAttribute('data-id'),
                        $i = $thisMain.querySelector('li[data-id="' + id + '"] i.g-check');

                    if ($i != null) {
                        $i.className = 'g-check';
                    }

                    $bottomLi.parentNode.removeChild($bottomLi);

                    domServer.checkAllState();

                    domServer.calcSum();
                },
                // 全选按钮
                checkall: function() {
                    $thisMain.querySelector('#checkall').onclick = function() {
                        var $allI = this.querySelector('i.g-check'),
                            $li = $thisMain.querySelectorAll('li[data-name]');

                        // console.log($allI);
                        // console.log($li);
                        if ($allI.className.indexOf('checked') != -1) { // 取消全选
                            $allI.className = 'g-check';

                            for (var i = 0; i < $li.length; i++) {
                                var $i = $li[i].querySelector('i.g-check'),
                                    id = $li[i].getAttribute('data-id');

                                if ($i != null && $i.className.indexOf('checked') != -1) {
                                    // 对人员或部门进行取消选中
                                    $i.className = 'g-check';

                                    var $selectBottomLi = $thisMain.querySelector('.b-flex > li[data-id="' + id + '"]');

                                    $selectBottomLi.parentNode.removeChild($selectBottomLi);

                                    domServer.calcSum();
                                }
                            }
                        } else { // 进行全选
                            $allI.className = 'g-check checked';

                            for (var i = 0; i < $li.length; i++) {
                                var $i = $li[i].querySelector('i.g-check');

                                // 如人员部门 非选中 则进行选中
                                if ($i != null && $i.className.indexOf('checked') == -1) {
                                    domServer.bind._selectFn($li[i]);
                                }
                            }
                        }

                        // 部门选中自动去掉后面的箭头
                        !_onlyUser && domServer.checkDepartment();
                    };
                },
                // 点击部门和人员
                selectUser: function() {
                    var $li = $thisMain.querySelectorAll('li[data-name]');

                    for (var i = 0; i < $li.length; i++) {
                        $li[i].onclick = function() {
                            var type = parseInt(this.getAttribute('data-type'));

                            if (_onlyUser && type == 1) { // 只选人模式
                                // 部门变成不可选 点击进入下一级
                                domServer.bind.nextDepartmentFn(this);
                            } else {
                                domServer.bind._selectFn(this);
                            }
                        }
                    }
                },
                // 删除已选的部门和人员
                delectUser: function() {
                    var $selectBottomLi = $thisMain.querySelectorAll('.b-flex > li');

                    for (var i = 0; i < $selectBottomLi.length; i++) {
                        $selectBottomLi[i].onclick = function() {
                            domServer.bind._bottomDelectFn(this);
                        };
                    }
                },
                // 部门的右侧箭头按钮
                rightBtn: function() {
                    var $allRightIcon = $thisMain.querySelectorAll('li[data-name] div.b-righticon');

                    // console.log($allRightIcon);
                    for (var i = 0; i < $allRightIcon.length; i++) {
                        $allRightIcon[i].onclick = function(e) {
                            e.stopPropagation();
                            var $li = this.parentNode.parentNode;
                            $li && domServer.bind.nextDepartmentFn($li);
                        }
                    }
                },
                // 确定提交按钮
                submitFn: function() {
                    $thisMain.querySelector('#submit-btn').onclick = function() {
                        var resObj = {
                            userList: [],
                            deptList: []
                        };

                        var $selectBottomLi = $thisMain.querySelectorAll('.b-flex li');

                        for (var i = 0; i < $selectBottomLi.length; i++) {
                            var _id = $selectBottomLi[i].getAttribute('data-id') || '',
                                _name = $selectBottomLi[i].getAttribute('data-name') || '',
                                _avatar = $selectBottomLi[i].querySelector('img').src || '',
                                _type = parseInt($selectBottomLi[i].getAttribute('data-type')), // 1 : user, 2 : dept
                                item = {
                                    id: _id,
                                    name: _name,
                                    avatar: _avatar
                                };

                            if (typeof _type != 'undefined' && _type != null) {
                                if (_type == 1) {
                                    resObj.deptList.push(item);
                                } else if (_type == 2) {
                                    resObj.userList.push(item);
                                } else {
                                    console.error(this + 'is can not push to resObj');
                                }
                            }
                        }

                        $thisMain.parentNode.removeChild($thisMain);

                        _succ(resObj);
                    };
                },
                // 返回按钮
                goBack: function() {
                    $thisMain.querySelector('#complexChoose-goback-btn').onclick = function() {
                        $thisMain.parentNode.removeChild($thisMain);
                        _fail();
                    };
                }
            }
        };

        var createHtml = function(data, primaryUser, _isChangePage) {
            var preDep = data.preDep,
                currDep = data.currDep;

            // head
            var strHtml = '<div id="recipient-main" class="recipient-main"><div class="recipient-main-box">';

            // nav
            strHtml += '<div class="navigation-box g-bottomLine"><p>组织架构</p><button id="complexChoose-goback-btn"><i></i>关闭</button></div>';

            // search
            //strHtml += '<div class="search-box g-bottomLine"><span class="search-icon"></span><input type="search" class="input-search" placeholder="搜索"></div>';

            // department tree
            var structureHtml = '';
            if (preDep && typeof preDep != 'undefined') {
                var _pId = preDep.id || '',
                    _pName = preDep.name || '返回上一层';

                structureHtml += '<span id="preDepartment" class="stractive" data-pid="' + _pId + '">' + _pName + '</span>&nbsp;&nbsp;&gt;';
            }

            if (currDep && typeof currDep != 'undefined') {
                var _cName = currDep.name || '';
                structureHtml += '<span>' + _cName + '</span>';
            }

            strHtml += '<p class="structure g-bottomLine">' + structureHtml + '</p>';

            strHtml += '<div class="dropdown-box g-bottomLine"><ul><li><div id="checkall" class="checkall"><i class="g-check"></i>全选</div><ul>';

            // department
            var department = data.department,
                g_checkHtml = _onlyUser ? '' : '<i class="g-check"></i>'; // 只选用户需要出现选择框

            for (var i = 0; i < department.length; i++) {
                var id = department[i].id,
                    name = department[i].name || '',
                    sum = department[i].sum || 0;

                strHtml += '<li data-id="' + id + '" data-name="' + name + '" data-type="1"><div class="a-itemwrap rowheight g-topLine"><div class="b-title b-flex g-ellipsis">' + g_checkHtml + name + '</div><div class="b-righticon ">' + sum + '</div></div>';

            }

            strHtml += '</ul></li></ul></div>';

            var people = data.people || '',
                pLen = people.length;

            if (!_onlyDepartment && pLen > 0) { // 非只选部门 和人员数大于0
                // center
                strHtml += '<p class="structure g-bottomLine">部门人员</p>';

                // people
                strHtml += '<div class="linkman-box g-topLine"><ul>';

                for (var j = 0; j < pLen; j++) {
                    var id = people[j].id,
                        name = people[j].name || '',
                        avatar = people[j].avatar || ywork.avatar({ name: name });

                    strHtml += '<li data-id="' + id + '" data-name="' + name + '" data-type="2" class="p-itembox g-bottomLine"><i class="g-check"></i><img src=' + avatar + ' class="linkman-box-img"><div class="g-ellipsis p-flex">' + name + '</div></li>';
                }

                strHtml += '</ul></div>';
            }

            strHtml += '</div>';

            // foot
            strHtml += '<div id="select-user" class="select-user"><div class="p-itembox select-userpic"><ul class="b-flex"></ul></div><button id="submit-btn" class="userbutton">确定<span></span></button></div></div>';

            if (_isChangePage) {
                var warp = document.getElementById('ywork-complex-choose');
                document.getElementsByTagName('body')[0].removeChild(warp);
            }

            var divId = 'ywork-complex-choose';

            _createDiv(divId, strHtml, function(div) {
                $thisMain = document.getElementById(divId);

                // 绑定 点击 选人/选部门
                domServer.bind.selectUser();

                if (primaryUser) {
                    domServer._setPrimaryUser(primaryUser);
                }

                // 绑定上一个部门
                if (preDep && typeof preDep != 'undefined') {
                    domServer.bind.preDepartment();
                }

                // 检查是否人员全选了
                domServer.checkAllState();

                // 绑定 全选
                domServer.bind.checkall();

                // 绑定 删人
                domServer.bind.delectUser();

                // 非只选用户 开启右侧按钮
                if (!_onlyUser) {
                    // 绑定 右侧按钮
                    domServer.bind.rightBtn();
                }

                // 绑定提交按钮
                domServer.bind.submitFn();

                // 绑定返回按钮
                domServer.bind.goBack();

                // 计算已选总数
                domServer.calcSum();
            });

        };

        var getDate = function(id, primaryUser, _isChangePage) {
            var primaryUser = primaryUser || false,
                _isChangePage = _isChangePage || false;

            if (_debug) {
                var res = bumenRes1;

                if (id == 'b3') {
                    res = bumenRes2;
                }

                if (id == 'c1') {
                    res = bumenRes3;
                }

                console.log(res);

                createHtml(res.data, primaryUser, _isChangePage);

            } else {
                if (id && typeof id != 'undefined' && id != '') {
                    var _getURL = _ajaxURL + '&deptId=' + id;
                } else {
                    var _getURL = _ajaxURL;
                }

                ywork.ajax.get(_getURL).succ(function(res) {
                    ywork.log(_getURL, res);

                    if (typeof res == 'undefined' || res == null) {
                        ywork.toast('集合返回失败');
                        return;
                    }

                    var errcode = res.errcode;
                    if (typeof errcode == 'undefined' || errcode == null || errcode != 0) {
                        ywork.toast('返回码有误：' + errcode);
                        return;
                    }

                    var data = res.data;
                    if (typeof data == 'undefined' || data == null) {
                        ywork.toast('返回数据有误');
                        return;
                    }

                    createHtml(data, primaryUser, _isChangePage);

                }).fail(function(err) {
                    ywork.toast();
                    console.error(err);
                });
            }

        };

        getDate(_id);

    };

    // 引导分享给微信朋友弹层
    ywork.shareToWechatFriend = function() {
        var strHtml = '<div class="shareToWechatFriend"><div class="shareToWechatFriend-box"><div class="weix-ico">分享给微信好友</div></div><a class="shareToWechatFriend-close" href="javascript: void(0);">关闭</a></div>';

        _createDiv('ywork-jsapi-shareToWechatFriend', strHtml, function(div) {
            var closeBtn = document.getElementsByClassName('shareToWechatFriend-close')[0];

            closeBtn.onclick = function() {
                div.parentNode.removeChild(div);
            };
        });

    };


    /**
     * 提醒控件闹钟
     * @param  {Array}  list [候选值, 传入毫秒]
     * @param  {Array}  selectList [预选值, 传入毫秒]
     * @param  {[type]} succ [确定方法, res返回已选的值(毫秒)]
     * @param  {[type]} fail [取消方法]
     */
    ywork.clock = function(options) {
        var options = options || {},
            list = options.list,
            selectList = options.selectList || [];

        if (typeof list == 'undefined' || list.length == 0) {
            console.log('ywork.clock没有候选值');
            return;
        }

        var listHtml = '<ul class="y-b-d-body-ul">';

        for (var i = 0; i < list.length; i++) {
            var item = list[i],
                text = (item == 0) ? '约定时间' : '提前' + (item / 1000 / 60) + '分钟',
                checked = false;

            if (selectList instanceof Array && selectList.length > 0) {
                for (var j = 0; j < selectList.length; j++) {
                    if (item == selectList[j]) {
                        checked = true;
                        break;
                    }
                }
            };

            if (checked) {
                listHtml += '<li class="y-b-d-body-li"><input class="g-check"type="checkbox"name="ywork-clock-array" value="' + item + '" checked="checked" onclick="this.checked = !this.checked"><span class="active">' + text + '</span></li>';
            } else {
                listHtml += '<li class="y-b-d-body-li"><input class="g-check"type="checkbox"name="ywork-clock-array" value="' + item + '" onclick="this.checked = !this.checked"><span>' + text + '</span></li>';
            }

        }

        listHtml += '</ul>';

        var strHtml = '<div><div class="weui_mask"></div><div class="ywork-bottom-dialog ywork-clock"><div class="ywork-bottom-dialog-head g-topLine"><button class="y-b-d-head-button left">不提醒</button><button class="y-b-d-head-button right">确认</button></div><div class="ywork-bottom-dialog-body ywork-clock-body ">' + listHtml + '</div></div></div>';

        _createDiv('ywork-jsapi-clock', strHtml, function(div) {
            var LI = document.getElementsByClassName('y-b-d-body-li'),
                // var LI = document.getElementsByName('ywork-clock-array'),
                succBtn = document.getElementsByClassName('y-b-d-head-button right')[0],
                failBtn = document.getElementsByClassName('y-b-d-head-button left')[0];

            for (i in LI) {
                LI[i].onclick = function() {
                    var $childs = this.childNodes,
                        $input;

                    // 找到input
                    for (var i = 0; i < $childs.length; i++) {
                        if ($childs[i].tagName == 'INPUT') {
                            $input = $childs[i];
                            break;
                        }
                    }

                    var _class = $input.checked ? '' : 'active';

                    $input.checked = !$input.checked;

                    $input.nextSibling.className = _class;
                }
            }

            succBtn.onclick = function() {
                if (typeof options.succ == 'function') {
                    var res = [];

                    for (var i = 0; i < LI.length; i++) {
                        if (LI[i].firstChild.checked) {
                            var val = parseInt(LI[i].firstChild.value);
                            res.push(val);
                        }
                    }

                    options.succ(res);
                }

                div.parentNode.removeChild(div);
            };

            failBtn.onclick = function() {
                div.parentNode.removeChild(div);
                if (typeof options.fail == 'function') {
                    options.fail();
                }
            };

        });
    };

    // 获取浏览器参数
    ywork.getUrlParam = function(param) {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]); // unescape decodeURIComponent decodeURI
        }
        return null;
    };

    // 是否安卓
    ywork.isAndroid = function() {
        var u = navigator.userAgent,
            isAndroid = false;
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            isAndroid = true;
        }
        return isAndroid;
    };

    /**
     * 检测数组是否存在某个值
     * @param  {Array}
     * @param  {String}     [要检索的值]
     * @return {number}     [如存在，返回下标；如不存在，返回-1]
     */
    ywork.indexOfArray = function(options) {
        var options = options || {},
            array = options.array,
            value = options.value;

        if (typeof array == 'undefined' || typeof value == 'undefined') {
            console.error('传参有误, 请检查');
            return;
        }

        for (var i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
        return -1;
    };


    /**
     * [选好友]
     * @param  {String}     title              [标题]
     * @param  {Array}      primaryList        [数组对象，预选用户] [{'uid': 'p3'}]
     * @param  {Array}      resList            [数组对象，可选列表] [{'uid': 'p3', 'n': '刘备'}]
     * @param  {Function}   success            [传入'点击确定按钮'的回调]
     *
     * @return {Array}      [{'uid': 'p2','n': '赵云','h':''}]
     *
     */
    ywork.friendChoose = function(options) {
        var options = options || {},
            title = options.title || '我的好友',
            primaryList = options.primaryList || [],
            resList = options.resList,
            _dataObj = {
                isLoadAjax: false,
                datas: [],
                pageNo: 1,
                pageSize: 20,
                totalCount: 0
            },
            $thisMain;

        var domServer = {
            // 计算底部数量
            calcFriendSum: function() {
                var $subBtn = $thisMain.querySelector('#friend-submit-btn'),
                    $span = $thisMain.querySelector('#friend-submit-btn span'),
                    sum = $thisMain.querySelectorAll('.b-flex > li').length;

                if (sum <= 0) {
                    $subBtn.disabled = true;
                    $span.innerHTML = '';
                } else {
                    $subBtn.disabled = false;
                    $span.innerHTML = '(' + sum + ')';
                }
            },
            // 增加底部好友
            _addBottomtFriend: function(id, name, avatar) {
                var $bootomLi = document.createElement('li');
                $bootomLi.setAttribute('data-id', id);
                $bootomLi.setAttribute('data-name', name);
                $bootomLi.innerHTML = '<img src="' + avatar + '" class="linkman-box-img"><a class="g-add del-icon"></a>';

                $thisMain.querySelector('#selects-friend ul.b-flex').appendChild($bootomLi);

                this.calcFriendSum();

                this.bind.delectFriend();
            },
            // 设置预选好友
            _setPrimaryFriend: function(primaryFriend) {
                if (!primaryFriend || typeof primaryFriend == 'undefined') {
                    return;
                }

                var $allCheck = $thisMain.querySelectorAll('li[data-name]'),
                    ids = [];

                for (var i = 0; i < primaryFriend.length; i++) {
                    ids.push(primaryFriend[i].uid);
                }

                // 勾上好友
                for (var i = 0; i < $allCheck.length; i++) {
                    var thisId = $allCheck[i].getAttribute('data-id');
                    if (ywork.indexOfArray({ array: ids, value: thisId }) != -1) {
                        $allCheck[i].querySelector('i.g-check').click();
                        // 注: 不是两个方法都可以
                        // 上面这个方法允许只传ID，写少一段底部好友添加demo的for代码
                        // 但是这个只适用于都在这页没有部门等翻来翻去的情况（不适用complexChoose）
                        //
                        // $allCheck[i].querySelector('i.g-check').className = 'g-check checked';
                    }
                }

                // 设置过后把数组置空，防止创建好友LI后的选择再次选中
                primaryFriend = null;
            },
            bind: {
                // 选择好友的函数
                _selectFn: function($li) {
                    var id = $li.getAttribute('id'),
                        $i = $li.querySelector('i.g-check');


                    if ($i.className.indexOf('checked') != -1) { // 进行取消
                        $i.className = 'g-check';

                        var $bottomLi = $thisMain.querySelector('.b-flex li[data-id="' + id + '"]');

                        $bottomLi.parentNode.removeChild($bottomLi);

                        domServer.calcFriendSum();
                    } else { // 进行选中
                        $i.className = 'g-check checked';

                        var name = $li.getAttribute('data-name') || '',
                            type = $li.getAttribute('data-type');

                        if ($li.querySelector('img') == null) {
                            var avatar = ywork.avatar({ name: name });
                        } else {
                            var avatar = $li.querySelector('img').src;
                        }

                        domServer._addBottomtFriend(id, name, avatar);
                    }
                },
                // 底部头像 删除已选的好友
                _bottomDelectFn: function($bottomLi) {
                    var id = $bottomLi.getAttribute('data-id'),
                        $i = $thisMain.querySelector('li[data-id="' + id + '"] i.g-check');

                    if ($i != null) {
                        $i.className = 'g-check';
                    }

                    $bottomLi.parentNode.removeChild($bottomLi);

                    domServer.calcFriendSum();
                },
                // 选择 好友
                selectFriend: function() {
                    var $li = $thisMain.querySelectorAll('li[data-name]');

                    for (var i = 0; i < $li.length; i++) {
                        $li[i].onclick = function() {
                            domServer.bind._selectFn(this);
                        }
                    }
                },
                // 删除已选的好友
                delectFriend: function() {
                    var $selectBottomLi = $thisMain.querySelectorAll('.b-flex > li');

                    for (var i = 0; i < $selectBottomLi.length; i++) {
                        $selectBottomLi[i].onclick = function() {
                            domServer.bind._bottomDelectFn(this);
                        };
                    }
                },
                // 确定提交按钮
                friendSubmitFn: function() {
                    $thisMain.querySelector('#friend-submit-btn').onclick = function() {
                        if (typeof options.succ == 'function') {
                            var resArr = [];

                            var $selectBottomLi = $thisMain.querySelectorAll('.b-flex li');

                            for (var i = 0; i < $selectBottomLi.length; i++) {
                                var _id = $selectBottomLi[i].getAttribute('id') || '',
                                    _name = $selectBottomLi[i].getAttribute('name') || '',
                                    _avatar = $selectBottomLi[i].querySelector('img').src || ywork.avatar({ name: _name }),
                                    item = {
                                        uid: _id,
                                        n: _name,
                                        h: _avatar
                                    };

                                resArr.push(item);
                            }
                            options.succ(resArr);
                        }
                        $thisMain.parentNode.removeChild($thisMain);
                    };
                },
                // 滚动加载
                scrollLoad: function() {
                    var $content = $thisMain.querySelector('.recipient-main-box');

                    var fn = function() {
                        if (!_dataObj.isLoadAjax) {
                            if ($content.scrollTop + window.screen.height > document.getElementById('#friend-main-friendul').offsetHeight + 80) {
                                if (_dataObj.pageNo < _dataObj.totalPages) {
                                    _dataObj.isLoadAjax = true;
                                    setTimeout(function() {
                                        _dataObj.pageNo++;
                                        getData();
                                    }, 300);
                                } else {
                                    ywork.toast({ text: '没有更多了' });
                                    $content.removeEventListener('scroll', fn);
                                }
                            }
                        }
                    };

                    $content.addEventListener('scroll', fn);
                },
                // 返回按钮
                goBack: function() {
                    $thisMain.querySelector('#friend-goback-btn').onclick = function() {
                        if (typeof options.fail == 'function') {
                            options.fail(resArr);
                        }

                        $thisMain.parentNode.removeChild($thisMain);
                    };
                }
            }
        };

        // 创建初始DOM
        var createInitHtml = function() {
            // 总框架
            var strHtml = '<div id="friend-main" class="recipient-main">';

            // 头部
            strHtml += '<div class="recipient-main-box">';

            // 导航条
            strHtml += '<div class="navigation-box g-bottomLine"><p>' + title + '</p><button id="friend-goback-btn"><i></i>关闭</button></div>';

            // 标题
            strHtml += '<p class="structure g-topLine">我的好友</p>';

            // 好友list
            strHtml += '<div class="linkman-box g-topLine"><ul id="friend-main-friendul">';

            var _datas = _dataObj.datas,
                _len = _datas.length,
                liHtml = '';

            if (_len > 0) {
                for (var i = 0; i < _len; i++) {
                    var id = _datas[i].uid,
                        name = _datas[i].n || '',
                        avatar = _datas[i].h || ywork.avatar({ name: name });

                    liHtml += '<li data-id="' + id + '" data-name="' + name + '" class="p-itembox g-bottomLine"><i class="g-check"></i><img src=' + avatar + ' class="linkman-box-img"><div class="g-ellipsis p-flex">' + name + '</div></li>';
                }

                strHtml += liHtml;

                strHtml += '</ul></div>';

                // $thisMain.querySelector('#friend-main-friendul').append(liHtml);
            }

            strHtml += '</div>';

            // 底部
            strHtml += '<div id="selects-friend" class="select-user"><div class="p-itembox select-userpic"><ul class="b-flex"></ul></div><button id="friend-submit-btn" class="userbutton">确定<span></span></button></div></div>';

            var divId = 'ywork-complex-friendchoose';
            _createDiv(divId, strHtml, function(div) {
                $thisMain = document.getElementById(divId);
                // 绑定 选好友
                domServer.bind.selectFriend();

                // 绑定 删好友
                domServer.bind.delectFriend();

                // 设置预选好友
                if (primaryList) {
                    domServer._setPrimaryFriend(primaryList);
                }

                // 计算底部已选数量
                domServer.calcFriendSum();

                // 如没有传入指定选择范围 则 启动滚动加载方法
                if (typeof resList == 'undefined' || resList.length == 0) {
                    domServer.bind.scrollLoad();
                }

                // 绑定提交按钮
                domServer.bind.friendSubmitFn();

                // 绑定返回按钮
                domServer.bind.goBack();
            });
        };

        var getData = function() {
            var ajaxURL = '/yw/lancloud/yue/h5/myfriends?pageNo=' + _dataObj.pageNo + '&pageSize=' + _dataObj.pageSize;

            if (_dataObj.totalCount > 0) {
                ajaxURL += '&totalCount=' + _dataObj.totalCount;
            }

            // 如有传入指定选择范围
            if (resList && resList != '' && resList.length > 0) {
                _dataObj.datas = resList;
                createInitHtml();
                return;
            }

            var debug = window.debug || false;

            if (debug) {
                if (typeof friendChooseRes == 'undefined') {
                    ywork.toast('请引入JSON再Debug!');
                    return;
                }

                ywork.log('debug', friendChooseRes);

                _dataObj = friendChooseRes.data;

                _dataObj.isLoadAjax = false;

                domServer.bind.scrollLoad = function() {
                    console.error('debug就不需要滚动加载了');
                };

                createInitHtml();

            } else {
                // ywork.showLoading();
                ywork.ajax(ajaxURL).get().succ(function(res) {
                    console.log(ajaxURL, res);
                    // ywork.hideLoading();

                    if (typeof res == 'undefined') {
                        ywork.toast();
                        return;
                    }

                    var _errcode = res.errcode;

                    if (typeof _errcode == 'undefined' || _errcode != 0) {
                        ywork.toast('请求失败<br>状态码: ' + _errcode);
                        return;
                    }

                    var _data = res.data;

                    if (typeof _data == 'undefined' || _data == '') {
                        ywork.toast('好友数据列表返回失败');
                        return;
                    }

                    var _datas = res.data.datas;

                    if (typeof _datas == 'undefined' || _datas.length == 0) {
                        ywork.toast('暂无好友数据');
                        return;
                    }

                    _dataObj = _data;

                    _dataObj.isLoadAjax = false;

                    // 分页数据追加
                    if (_dataObj.pageNo > 1) {
                        createFriendsHtml();
                    } else { // 第一次加载数据
                        createInitHtml();
                    }
                }).fail(function(err) {
                    console.error(err);
                    ywork.hideLoading();
                    ywork.toast();
                    _dataObj.isLoadAjax = false;
                });
            }
        };
        getData();
    };



    // 微信免登 有groupData
    ywork.wxAuthLogin = function(options) {
        var options = options || {},
            debug = options.debug || false,
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        url = encodeURIComponent(window.location.href.split('#')[0]);

        if (options.ajaxURL && typeof options.ajaxURL != 'undefined' && options.ajaxURL != '') {
            var ajaxURL = options.ajaxURL;
        } else {
            var ajaxURL = '/yw/app/votebiz/getGroupTicket';
        }

        if (ajaxURL.indexOf('?') > -1) {
            ajaxURL += '&url=' + url;
        } else {
            ajaxURL += '?url=' + url;
        }

        debug && console.log('wechat签名', ajaxURL);

        ywork.ajax().get(ajaxURL).succ(function(res) {
            debug && console.log('后台签名数据返回:', res);

            if (typeof res == 'undefined') {
                failFn('集合返回失败');
                return;
            }

            if (typeof res.errcode == 'undefined' || res.errcode != 0) {
                failFn('返回码有误:' + res.errcode);
                return;
            }

            if (typeof res.data == 'undefined') {
                failFn('返回数据有误');
                return;
            }

            var configData = res.data.signature;

            groupData = res.data.groupTicket;

            if (typeof configData == 'undefined' || typeof groupData == 'undefined') {
                failFn('返回普通签名数据有误');
                return;
            }

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: configData.appId, // 必填，公众号的唯一标识
                timestamp: configData.timestamp, // 必填，生成签名的时间戳
                nonceStr: configData.nonceStr, // 必填，生成签名的随机串
                signature: configData.signature, // 必填，签名
                jsApiList: [
                    'checkJsApi',
                    'openEnterpriseChat',
                    'openEnterpriseContact',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'translateVoice',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ]
            });

            wx.error(function(err) {
                debug && console.error(err);
                failFn(err);
            });

            wx.ready(function(res) {
                debug && console.log('wx签名成功');
                succFn(res);
            });
        }).fail(function(err) {
            console.error(ajaxURL, err);
            failFn(err);
        });
    };

    // 打开通讯录
    ywork.wxOpenEnterpriseContact = function(options) {
        var options = options || {},
            isSingle = options.isSingle ? 'single' : 'multi',
            departmentIds = options.departmentIds || [0],
            tagIds = options.tagIds || [0],
            userIds = options.userIds || [],
            type = options.type || ['department', 'user', 'tag'],
            selectedDepartmentIds = options.selectedDepartmentIds || [],
            selectedTagIds = options.selectedTagIds || [],
            selectedUserIds = options.selectedUserIds || [],
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        wx.ready(function() {
            var evalWXjsApi = function(jsApiFun) {
                if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
                    jsApiFun();
                } else {
                    document.attachEvent && document.attachEvent("WeixinJSBridgeReady", jsApiFun);
                    document.addEventListener && document.addEventListener("WeixinJSBridgeReady", jsApiFun);
                }
            }

            evalWXjsApi(function() {
                WeixinJSBridge.invoke("openEnterpriseContact", {
                    "groupId": groupData.groupId,
                    "timestamp": groupData.timestamp,
                    "nonceStr": groupData.nonceStr,
                    "signature": groupData.signature,
                    "params": {
                        'departmentIds': departmentIds,
                        'tagIds': tagIds,
                        'userIds': userIds,
                        'mode': isSingle,
                        'type': type,
                        'selectedDepartmentIds': selectedDepartmentIds,
                        'selectedTagIds': selectedTagIds,
                        'selectedUserIds': selectedUserIds
                    },
                }, function(res) {
                    if (typeof res == 'undefined' || res == null) {
                        failFn({ errMsg: '返回数据有误' });
                        return;
                    }

                    var _errMsg = res.errMsg || res.err_msg;
                    if (typeof _errMsg != 'undefined' && _errMsg.indexOf('function_not_exist') > 0) {
                        failFn({ errMsg: '版本过低请升级' });
                        return;
                    }

                    // 不成功
                    if (_errMsg.indexOf('openEnterpriseContact:ok') == -1) {
                        failFn({ errMsg: _errMsg });
                        return;
                    }

                    var result = JSON.parse(res.result); // 返回字符串，开发者需自行调用JSON.parse解析

                    ywork.log('ywork.wxOpenEnterpriseContact通讯录返回', result);


                    var selectAll = result.selectAll, // 是否全选（如果是，其余结果不再填充）
                        selectedDepartmentList = result.departmentList || [], // 已选的部门
                        selectedUserList = result.userList || [], // 已选的人员
                        selectedTagList = result.tagList || []; // 已选的标签

                    // 没有全选 和 没选标签 直接返回结果了
                    if (!selectAll && selectedTagList.length == 0) {
                        succFn(result);
                        return;
                    }

                    var _url = '/yw/app/votebiz/getQyWechatUserList',
                        ajaxObj = {
                            selectAll: selectAll,
                            deptIds: [],
                            userIds: [],
                            tagIds: []
                        };

                    // 有选部门
                    if (selectedDepartmentList.length > 0) {
                        for (var i = 0; i < selectedDepartmentList.length; i++) {
                            var department = selectedDepartmentList[i],
                                departmentId = department.id, // 已选的单个部门ID
                                departemntName = department.name; // 已选的单个部门名称

                            ajaxObj.deptIds.push(departmentId);
                        }
                    }

                    // 有选人员
                    if (selectedUserList.length > 0) {
                        for (var i = 0; i < selectedUserList.length; i++) {
                            var user = selectedUserList[i],
                                userId = user.id, // 已选的单个成员ID
                                userName = user.name; // 已选的单个成员名称

                            ajaxObj.userIds.push(userId);
                        }
                    }

                    // 有选标签
                    if (selectedTagList.length > 0) {
                        for (var i = 0; i < selectedTagList.length; i++) {
                            var tag = selectedTagList[i],
                                tagId = tag.id; // 已选的单个标签ID

                            ajaxObj.tagIds.push(tagId);
                        }
                    }

                    ywork.ajax().post(_url, JSON.stringify(ajaxObj)).succ(function(res) {
                        ywork.log(_url, res);
                        if (typeof res == 'undefined' || res == null) {
                            failFn({ errMsg: '集合返回失败' });
                            return;
                        }

                        var errcode = res.errcode;
                        if (typeof errcode == 'undefined' || errcode == null) {
                            failFn({ errMsg: '系统繁忙' });
                            return;
                        }

                        if (errcode != 0) {
                            failFn({ errMsg: '系统繁忙:' + errcode });
                            return;
                        }

                        var data = res.data;
                        if (typeof data == 'undefined' || data == null) {
                            failFn({ errMsg: '返回数据有误' });
                            return;
                        }

                        var _userList = res.data.userList || [];

                        result.userList = [];

                        result.userList = _userList;

                        succFn(result);

                    }).fail(function(err) {
                        console.error(err);
                        failFn({ errMsg: '请求后台数据失败' })
                    });


                });
            });
        });


    }

    // 设置标题
    ywork.setTitle = function(title) {
        var title = title || '';

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.biz.navigation.setTitle({
                    title: title
                });
            });
        } else {
            // } else if (api && api == 'wx') {
            document.title = title;

            // hack wechat for ios , 安卓不需要
            if (!ywork.isAndroid()) {
                var iframe = document.createElement('iframe');
                iframe.style.visibility = 'hidden';
                iframe.setAttribute('src', 'favicon.ico');
                var iframeCallback = function() {
                    setTimeout(function() {
                        iframe.removeEventListener('load', iframeCallback);
                        document.body.removeChild(iframe);
                    }, 0);
                };
                iframe.addEventListener('load', iframeCallback);
                document.body.appendChild(iframe);
            }
        }
    };

    // 上传图片
    ywork.uploadImage = function(options) {
        var options = options || {},
            max = options.max || 9,
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.biz.util.uploadImage({
                    multiple: true, // 是否多选
                    max: max,
                    onSuccess: succFn,
                    onFail: failFn
                });
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                var result = {
                    localIds: [],
                    serverIds: []
                };

                // 注意，坑爹的微信不支持并行上传，只能串行
                function upToServer(localIds) {
                    var localId = localIds.pop();
                    wx.uploadImage({
                        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 0, // 默认为1，显示进度提示
                        success: function(res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID

                            result.serverIds.push(serverId);

                            if (localIds.length > 0) {
                                upToServer(localIds);
                            } else if (localIds.length == 0) {
                                ywork.hideLoading();
                                if (typeof options.succ == 'function') {
                                    options.succ(result);
                                }
                            }

                        },
                        fail: function(err) {
                            console.log(err);
                            ywork.hideLoading();
                            if (typeof options.fail == 'function') {
                                options.fail(err);
                            }
                        }
                    });

                };

                wx.chooseImage({
                    count: max || 9, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function(res) {
                        var localIds = res.localIds;
                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                        for (var i = 0; i < localIds.length; i++) {
                            result.localIds.push(localIds[i]);
                        }

                        ywork.showLoading({ text: '图片上传中' });

                        upToServer(localIds);

                    },
                    fail: function(err) {
                        ywork.hideLoading();
                        if (typeof options.fail == 'function') {
                            options.fail(err);
                        }
                    }
                });

            });
        }
    };

    // 预览图片
    ywork.previewImage = function(options) {
        var options = options || {},
            imgURL = options.imgURL,
            imgList = options.imgList || [],
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        if (!imgURL || imgURL == '' || typeof imgURL == 'undefined') {
            console.error('图片链接有误');
            return;
        }

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.biz.util.previewImage({
                    urls: imgList, // 图片地址列表[String]
                    current: imgURL, // 当前显示的图片链接
                    onSuccess: succFn,
                    onFail: failFn
                })
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                wx.previewImage({
                    current: imgURL, // 当前显示图片的http链接
                    urls: imgList, // 需要预览的图片http链接列表
                    success: succFn,
                    fail: failFn
                });
            });
        }
    };

    // 获取地理位置
    ywork.getLocation = function(options) {
        var targetAccuracy = options.targetAccuracy || 300,
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.device.geolocation.get({
                    targetAccuracy: targetAccuracy, //  期望定位精度半径（单位米）
                    onSuccess: succFn,
                    onFail: failFn
                });
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                wx.getLocation({
                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: succFn,
                    fail: failFn
                });
            });
        }
    };

    // 触发关闭
    ywork.close = function() {
        if (api && api == 'dd') {
            dd.ready(function() {
                dd.biz.navigation.close();
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                wx.closeWindow();
            });
        }
    }

    // 获取网络状态
    ywork.getNetworkType = function(options) {
        var succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.device.connection.getNetworkType({
                    onSuccess: succFn,
                    onFail: failFn
                });
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                wx.getNetworkType({
                    success: succFn
                });
            });
        }

    };

    // 分享
    ywork.share = function(options) {
        var options = options || {},
            url = options.url,
            title = options.title || '',
            content = options.content || '',
            imageURL = options.imageURL || '',
            succFn = function(res) {
                if (typeof options.succ == 'function') {
                    options.succ(res);
                }
            },
            failFn = function(err) {
                if (typeof options.fail == 'function') {
                    options.fail(err);
                }
            };

        if (!url || typeof url == 'undefined') {
            console.error('传入链接有误');
            return;
        };

        if (api && api == 'dd') {
            dd.ready(function() {
                dd.biz.util.share({
                    type: 0, //分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
                    url: url,
                    title: title,
                    content: content,
                    image: imageURL,
                    onSuccess: succFn, // 将在分享完成之后回调
                    onFail: failFn
                })
            });
        } else if (api && api == 'wx') {
            wx.ready(function() {
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: title + content, // 分享标题
                    link: url, // 分享链接
                    imgUrl: imageURL, // 分享图标
                    success: function() {
                        succFn("wxf");
                    },
                    cancel: failFn
                });

                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: content, // 分享描述
                    link: url, // 分享链接
                    imgUrl: imageURL, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        succFn("wx");
                    },
                    cancel: failFn
                });

                // 分享到QQ
                wx.onMenuShareQQ({
                    title: title, // 分享标题
                    desc: content, // 分享描述
                    link: url, // 分享链接
                    imgUrl: imageURL, // 分享图标
                    success: function() {
                        succFn("qq");
                    },
                    cancel: failFn
                });

                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title: title, // 分享标题
                    desc: content, // 分享描述
                    link: url, // 分享链接
                    imgUrl: imageURL, // 分享图标
                    success: function() {
                        succFn("wb");
                    },
                    cancel: failFn
                });

                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title: title, // 分享标题
                    desc: content, // 分享描述
                    link: url, // 分享链接
                    imgUrl: imageURL, // 分享图标
                    success: function() {
                        succFn("qqkj");
                    },
                    cancel: failFn
                });
            });
        }
    };

    w.ywork = ywork;

})(window);
