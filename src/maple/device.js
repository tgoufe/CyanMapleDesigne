import {forEach} from 'lodash';
var alias = {
    androidchrome: "androidChrome",
    webview: "webView",
    minimalui: "minimalUi",
    statusbar: "statusBar",
    pixelratio: "pixelRatio",
    wechat: "weixin",
    wx: "weixin"
};
var metaViewport=Array.from(document.getElementsByTagName('meta')).filter(item=>{
    return item.getAttribute('name')==='viewport'
});
// Classes
var classNames = [];
var htmlClass=document.documentElement.classList;
var device = function() {
    var l = arguments.length,
        i = 0,
        t,
        result = true;

    if (l === 0) {
        result = false;
    } else {
        for (; i < l; i++) {
            t = arguments[i];

            if (t in device && device.hasOwnProperty(t)) {
                result = result && device[t];
            } else {
                t = t.toLowerCase();

                if (t in alias) {
                    result = result && device[alias[t]];
                } else {
                    result = result && false;
                }
            }

            if (!result) {
                break;
            }
        }
    }

    return result;
};
var ua = navigator.userAgent;

var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

// Chrome
device.chrome = ua.toLowerCase().indexOf("chrome") >= 0;

// Android
if (android) {
    device.os = "android";
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = device.android && device.chrome;
}
if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
}
// iOS
if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, ".");
    device.iphone = true;
}
if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, ".");
    device.ipad = true;
}
if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, ".") : null;
    device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf("Version/") >= 0) {
    if (device.osVersion.split(".")[0] === "10") {
        device.osVersion = ua
            .toLowerCase()
            .split("version/")[1]
            .split(" ")[0];
    }
}

// Webview
device.webView =
    (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

// Minimal UI
if (device.os && device.os === "ios") {
    var osVersionArr = device.osVersion.split(".");
    device.minimalUi =
        !device.webView &&
        (ipod || iphone) &&
        (osVersionArr[0] * 1 === 7
            ? osVersionArr[1] * 1 >= 1
            : osVersionArr[0] * 1 > 7) &&
            metaViewport.length > 0 &&
            metaViewport.getAttribute('content').indexOf("minimal-ui") >= 0;
}

// Check for status bar and fullscreen app mode
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

device.statusBar =
    device.webView &&
    windowWidth * windowHeight === screen.width * screen.height;

// Pixel Ratio
device.pixelRatio = window.devicePixelRatio || 1;
classNames.push("pixel-ratio-" + Math.floor(device.pixelRatio));
if (device.pixelRatio >= 2) {
    classNames.push("retina");
}

// OS classes
if (device.os) {
    classNames.push(
        device.os,
        device.os + "-" + device.osVersion.split(".")[0],
        device.os + "-" + device.osVersion.replace(/\./g, "-")
    );
    if (device.os === "ios") {
        var major = parseInt(device.osVersion.split(".")[0], 10);
        for (var i = major - 1; i >= 6; i--) {
            classNames.push("ios-gt-" + i);
        }
    }
}
// Status bar classes
if (device.statusBar) {
    classNames.push("with-statusbar-overlay");
} else {
    htmlClass.remove("with-statusbar-overlay");
}
// keng..
device.weixin = /MicroMessenger/i.test(ua);

// UC �����
device.uc = ua.indexOf("UCBrowser") > -1;
// Add html classes
forEach(device,(value,key)=>{
    if(value===true){
        classNames.push(`device_${key}`);
    }
});
htmlClass.add(...classNames);
export default device;
