/*
HOW TO USE
wxConfig = {
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [],  //可以为空, 默认注册以下方法:'checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'
    share: {
        title: '', // 分享标题
        desc: '', // 分享描述
        link: '', // 分享链接
        imgUrl: '', // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function(){
            console.log(arguments[0]);
        },
        cancel： {
            timeLine: function() {},
            appMessage: function() {},
            qq: function() {},
            qZone: function() {}
        }
    }
}
*/
(function() {
    jsApiList = wxConfig.jsApiList.length == 0 ? ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] : wxConfig.jsApiList;
    var c = wxConfig;
    wx.config({
        debug: c.debug || false,
        appId: c.appId,
        timestamp: c.timestamp,
        nonceStr: c.nonceStr,
        signature: c.signature,
        jsApiList: jsApiList
    });
    function checkJsApi(jsApiList) {
        wx.checkJsApi({
            jsApiList: jsApiList,
            success: function(res) {
                if (wxConfig.debug) console.log(res)
            }
        });
    }
    function wxCallback(callback, res) {
        if ({}.toString.call(callback) == "[object Function]") {
            callback(res);
        }
    }
    function in_array(search, array) {
        for (var i in array) {
            if (array[i] == search) {
                return true;
            }
        }
        return false;
    }
    var wxShare = {
        Init: function() {
            var s = this.shareObj;
            wx.onMenuShareTimeline(s('timeLine', c));
            wx.onMenuShareAppMessage(s('appMessage', c));
            wx.onMenuShareQQ(s('qq', c));
            wx.onMenuShareQZone(s('qZone', c));
        },
        shareObj: function(type) {
            var c = arguments[1].share;
            var obj = {
                title: c.title,
                link: c.link,
                imgUrl: c.imgUrl
            }
            if (in_array(type, ['appMessage', 'qq', 'qZone'])) {
                obj.desc = c.desc
            }
            if (type == 'appMessage') {
                obj.type = c.type || 'link';
                obj.dataUrl = c.dataUrl || '';
            }

            obj.success = function(res) {
                if ({}.toString.call(c.success) == "[object Function]") {
                    c.success(res);
                } else if ({}.toString.call(c.success) == "[object Object]") {
                    var callback = c.success[type];
                    wxCallback(callback, res);
                }
            }
            obj.cancel = function(res) {
                if ({}.toString.call(c.cancel) == "[object Function]") {
                    c.cancel(res);
                } else if ({}.toString.call(c.cancel) == "[object Object]") {
                    var callback = c.cancel[type];
                    wxCallback(callback, res);
                }
            }
            return obj;
        }
    }
    wx.ready(function() {
        checkJsApi(jsApiList);
        wxShare.Init();
    })
})()
