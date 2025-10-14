var v146 = "en",
    offsetYButtons = 0,
    gameReadyCalled = false,
    skipTitle = window.famobi.hasFeature("skip_title"),
    doneOnce = false,
    externalStart = window.famobi.hasFeature("external_start"),
    externalMute = window.famobi.hasFeature("external_mute"),
    externalPause = window.famobi.hasFeature("external_pause"),
    newScore = 0,
    oldScore = 0,
    gamePaused = false;

function f1(LanguageID) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        var protocolRegex = new RegExp('^file:', 'i');
        var isFileProtocol = protocolRegex.test(xmlhttp.responseURL);

        if (xmlhttp.readyState == 4
                && (xmlhttp.status == 200 || (isFileProtocol && xmlhttp.status == 0))) {
            v146 = LanguageID + "";
            v146 = "en"; // famobi
            var str = xmlhttp.responseText;
            var OneLine = str.split('\n');
            if (OneLine.length < 3) return;
            var TextID = 0;
            for (i = 0; i < OneLine.length; i++) {
                var test_str = OneLine[i];
                var start_pos = test_str.indexOf('"') + 1;
                if (start_pos == 1) {
                    famobi.log("start_pos: " + start_pos);
                    var end_pos = test_str.indexOf('"', start_pos);
                    var text_to_get = test_str.substring(start_pos, end_pos)
                    // v287[TextID] = text_to_get;
                    TextID++;
                }
            }
        }
    }
    xmlhttp.open("GET", "datas/localisation/" + LanguageID + ".txt", true);
    xmlhttp.send();
}

function f22() {
    var userLang = navigator.language || navigator.userLanguage;
    famobi.log("Navigator Language: " + userLang);
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var LocalPos = vars[i].search("locale=");
        if (LocalPos == 0) {
            var ForceLocal = vars[i].substring(7, 9);
            famobi.log("Navigator Forced Language: '" + ForceLocal + "'");
            userLang = ForceLocal + "-" + ForceLocal;
        }
    }
    return userLang;
}

function f7() {
    var userLang = f22();
    if (userLang.search("fr") != -1) f1("fr");
    if (userLang.search("de") != -1) f1("de");
    if (userLang.search("es") != -1) f1("es");
    if (userLang.search("nl") != -1) f1("nl");
    if (userLang.search("pl") != -1) f1("pl");
    if (userLang.search("pt") != -1) f1("pt");
    if (userLang.search("ru") != -1) f1("ru");
    if (userLang.search("tr") != -1) f1("tr");
}

function f172(argString) {
    if (argString === null || typeof argString === 'undefined') {
        return '';
    }
    var string = (argString + '');
    var utftext = '',
        start, end, stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else {
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }
    if (end > start) {
        utftext += string.slice(start, stringl);
    }
    return utftext;
}

function md5(str) {
    // discuss at: http://phpjs.org/functions/md5/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Michael White (http://getsprink.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    var xl;
    var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };
    var _F = function(x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function(x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function(x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function(x, y, z) {
        return (y ^ (x | (~z)));
    };
    var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    var wordToHex = function(lValue) {
        var wordToHexValue = '',
            wordToHexValue_temp = '',
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };
    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    str = this.f172(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
}
var ColizWord = new Array();
var v162 = new Array();
var v160 = new Array();
var v233 = 0;
var v192 = 0;

function f190() {
    this.HashCount_X = 1;
    this.HashCount_Y = 1;
    this.HashSize_X = 0;
    this.HashSize_Y = 0;
    this.HashPos_Left = 0;
    this.HashPos_Right = 0;
    this.HashPos_Top = 0;
    this.HashPos_Bottom = 0;
    this.HashDetected = 0;
    this.HashDetectedCount = 0;
    this.StaticSegments;
    this.StaticSegmentsCount = 0;
    this.HashStaticsList;
    this.Dyna_ax = 0;
    this.Dyna_bx = 0;
    this.Dyna_cx = 0;
    this.Dyna_dx = 0;
    this.Dyna_ay = 0;
    this.Dyna_by = 0;
    this.Dyna_cy = 0;
    this.Dyna_dy = 0;
}

function f138() {
    this.ax = 0;
    this.ay = 0;
    this.bx = 0;
    this.by = 0;
}

function f84() {
    ColizWord = [];
    ColizWord = new f190();
    ColizWord.StaticSegmentsCount = 0;
    ColizWord.HashDetected = new Array();
    for (var i = 0; i < 20; i++) ColizWord.HashDetected.push;
    ColizWord.StaticSegments = new Array();
    ColizWord.HashStaticsList = new Array();
    for (var i = 0; i < 100 * 100; i++) {
        ColizWord.HashStaticsList.push;
        ColizWord.HashStaticsList[i] = new Array();
    }
    for (var i = 0; i < 100; i++) {
        v162.push;
        v160.push;
    }
}
var v113;
var v112;

function f32(x, y, x1, y1, x2, y2) {
    v113 = 0;
    v112 = 0;
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0)
        param = dot / len_sq;
    var xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    v113 = xx;
    v112 = yy;
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function f3(Cx, Cy, Radius, x1, y1, x2, y2) {
    var distance = f32(Cx, Cy, x1, y1, x2, y2);
    if (distance > 0 && distance < Radius) return true;
    return false;
}
var v258 = 0;
var v259 = 0;
var v6;

function f8(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
    if (v192 == 1) famobi.log("f8");
    var denom = ((b2y - b1y) * (a2x - a1x)) - ((b2x - b1x) * (a2y - a1y));
    if (denom == 0) return false;
    var ua = (((b2x - b1x) * (a1y - b1y)) - ((b2y - b1y) * (a1x - b1x))) / denom;
    var ub = (((a2x - a1x) * (a1y - b1y)) - ((a2y - a1y) * (a1x - b1x))) / denom;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;
    v258 = a1x + ua * (a2x - a1x);
    v259 = a1y + ua * (a2y - a1y);
    v162[v233] = v258;
    v160[v233] = v259;
    v233++;
    if (v233 > 100) v233 = 0;
    ColDirX += v258;
    ColDirY += v259;
    ColDirCount++;
    if (v192 == 1) famobi.log("f8 ColDirCount" + ColDirCount + ", ColDirX" + ColDirX + ",ColDirY " + ColDirY);
    return true;
}

function f0(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
    if (v192 == 1) famobi.log("f0 " + a1x + " " + a1y + " " + a2x + " " + a2y + " " + b1x + " " + b1y + " " + b2x + " " + b2y);
    var denom = ((b2y - b1y) * (a2x - a1x)) - ((b2x - b1x) * (a2y - a1y));
    if (denom == 0) return false;
    if (v192 == 1) famobi.log("f0 denom OK");
    var ua = (((b2x - b1x) * (a1y - b1y)) - ((b2y - b1y) * (a1x - b1x))) / denom;
    var ub = (((a2x - a1x) * (a1y - b1y)) - ((a2y - a1y) * (a1x - b1x))) / denom;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return false;
    if (v192 == 1) famobi.log("f0 ua < 0 || ua > 1 || ub < 0 || ub > 1 OK");
    v258 = a1x + ua * (a2x - a1x);
    v259 = a1y + ua * (a2y - a1y);
    if (ColDirY > v259) {
        v162[0] = v258;
        v160[0] = v259;
        ColDirX = v258;
        ColDirY = v259;
        ColDirCount++;
    }
    if (b2x < b1x) {
        v72 = b1x - b2x;
        v76 = b1y - b2y;
    } else {
        v72 = b2x - b1x;
        v76 = b2y - b1y;
    }
    var length = Math.sqrt(v72 * v72 + v76 * v76);
    if (length == 0) length = 0.000000001;
    v72 /= length;
    v76 /= length;
    if (v192 == 1) famobi.log("f0 ColDirCount" + ColDirCount + ", ColDirX" + ColDirX + ",ColDirY " + ColDirY);
    return true;
}
var v72 = 0;
var v76 = 0;

function f31(Cx, Cy, Radius) {
    f15(Cx, Cy, Radius * 2.1, Radius * 2.1);
    v72 = 0;
    v76 = 0;
    for (var i = 0; i < ColizWord.HashDetectedCount; i++) {
        var HashID = ColizWord.HashDetected[i];
        if (HashID > -1 && HashID < 10000) {
            var SegCount = ColizWord.HashStaticsList[HashID].length;
            for (var j = 0; j < SegCount; j++) {
                var SegID = ColizWord.HashStaticsList[HashID][j];
                if (
                    f3(Cx, Cy, Radius,
                        ColizWord.StaticSegments[SegID].ax,
                        ColizWord.StaticSegments[SegID].ay,
                        ColizWord.StaticSegments[SegID].bx,
                        ColizWord.StaticSegments[SegID].by) ==
                    true) {
                    if (ColizWord.StaticSegments[SegID].ax > ColizWord.StaticSegments[SegID].bx) {
                        v72 = ColizWord.StaticSegments[SegID].ax - ColizWord.StaticSegments[SegID].bx;
                        v76 = ColizWord.StaticSegments[SegID].ay - ColizWord.StaticSegments[SegID].by;
                    } else {
                        v72 = ColizWord.StaticSegments[SegID].bx - ColizWord.StaticSegments[SegID].ax;
                        v76 = ColizWord.StaticSegments[SegID].by - ColizWord.StaticSegments[SegID].ay;
                    }
                    var length = Math.sqrt(v72 * v72 + v76 * v76);
                    if (length == 0) length = 0.000000001;
                    v72 /= length;
                    v76 /= length;
                    return true;
                }
            }
        }
    }
    return false;
}

function f57(ax, ay, bx, by) {
    ColizWord.Dyna_ax = ax;
    ColizWord.Dyna_ay = ay;
    ColizWord.Dyna_bx = bx;
    ColizWord.Dyna_by = by;
    ColizWord.Dyna_cx = ax;
    ColizWord.Dyna_cy = ay;
    ColizWord.Dyna_dx = bx;
    ColizWord.Dyna_dy = by;
    ColDirX = 0;
    ColDirY = 10000000;
    ColDirCount = 0;
    var centerX = (ax + bx) * 0.5;
    var centerY = (ay + by) * 0.5;
    var SizeX = Math.abs(bx - ax);
    var SizeY = Math.abs(by - ay);
    if (SizeX < 1) SizeX = 1;
    if (SizeY < 1) SizeY = 1;
    f15(centerX, centerY, SizeX, SizeY);
    for (var i = 0; i < ColizWord.HashDetectedCount; i++) {
        var HashID = ColizWord.HashDetected[i];
        if (HashID > -1 && HashID < 10000) {
            var SegCount = ColizWord.HashStaticsList[HashID].length;
            for (var j = 0; j < SegCount; j++) {
                var SegID = ColizWord.HashStaticsList[HashID][j];
                f0(ax, ay, bx, by, ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
            }
        }
    }
}

function f69(ax, ay, bx, by, cx, cy, dx, dy) {
    ColizWord.Dyna_ax = ax;
    ColizWord.Dyna_ay = ay;
    ColizWord.Dyna_bx = bx;
    ColizWord.Dyna_by = by;
    ColizWord.Dyna_cx = cx;
    ColizWord.Dyna_cy = cy;
    ColizWord.Dyna_dx = dx;
    ColizWord.Dyna_dy = dy;
    ColDirX = 0;
    ColDirY = 0;
    ColDirCount = 0;
    for (var i = 0; i < ColizWord.HashDetectedCount; i++) {
        var HashID = ColizWord.HashDetected[i];
        if (HashID > -1 && HashID < 10000) {
            var SegCount = ColizWord.HashStaticsList[HashID].length;
            for (var j = 0; j < SegCount; j++) {
                var SegID = ColizWord.HashStaticsList[HashID][j];
                f8(ax, ay, bx, by, ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
                f8(bx, by, cx, cy, ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
                f8(cx, cy, dx, dy, ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
                f8(dx, dy, ax, ay, ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
            }
        }
    }
    if (ColDirCount > 0) {
        ColDirX /= ColDirCount;
        ColDirY /= ColDirCount;
    }
}

function f20(ax, ay, bx, by) {
    ColizWord.StaticSegments.push;
    ColizWord.StaticSegments[ColizWord.StaticSegmentsCount] = new f138();
    ColizWord.StaticSegments[ColizWord.StaticSegmentsCount].ax = ax;
    ColizWord.StaticSegments[ColizWord.StaticSegmentsCount].ay = ay;
    ColizWord.StaticSegments[ColizWord.StaticSegmentsCount].bx = bx;
    ColizWord.StaticSegments[ColizWord.StaticSegmentsCount].by = by;
    ColizWord.StaticSegmentsCount++;
}

function f15(PosX, PosY, SizeX, SizeY) {
    ColizWord.HashDetectedCount = 0;
    var x = PosX - ColizWord.HashPos_Left;
    var y = PosY - ColizWord.HashPos_Top;
    var Left = Math.floor((x - SizeX * 0.5) / ColizWord.HashSize_X);
    var Top = Math.floor((y - SizeY * 0.5) / ColizWord.HashSize_Y);
    var Right = Math.floor((x + SizeX * 0.5) / ColizWord.HashSize_X);
    var Bottom = Math.floor((y + SizeY * 0.5) / ColizWord.HashSize_Y);
    for (var x = Left; x < Right + 1; x++) {
        for (var y = Top; y < Bottom + 1; y++) {
            ColizWord.HashDetected[ColizWord.HashDetectedCount] = Math.floor(x + y * ColizWord.HashCount_X);
            ColizWord.HashDetectedCount++;
        }
    }
}

function f59(shiftX) {
    for (var i = 0; i < ColizWord.StaticSegmentsCount; i++) {
        ColizWord.StaticSegments[i].ax -= shiftX;
        ColizWord.StaticSegments[i].bx -= shiftX;
    }
}

function f12(BeloX) {
    return;
    for (var i = 0; i < ColizWord.StaticSegmentsCount; i++) {
        if (ColizWord.StaticSegments[i].bx < BeloX) {}
    }
}

function f94() {
    ColizWord.HashStaticsList = new Array();
    for (var i = 0; i < 100 * 100; i++) {
        ColizWord.HashStaticsList.push;
        ColizWord.HashStaticsList[i] = new Array();
    }
}

function f28() {
    for (var i = 0; i < ColizWord.StaticSegmentsCount; i++) {
        var PosX = (ColizWord.StaticSegments[i].ax + ColizWord.StaticSegments[i].bx) * 0.5;
        var PosY = (ColizWord.StaticSegments[i].ay + ColizWord.StaticSegments[i].by) * 0.5;
        var SizeX = Math.abs(ColizWord.StaticSegments[i].bx - ColizWord.StaticSegments[i].ax);
        var SizeY = Math.abs(ColizWord.StaticSegments[i].by - ColizWord.StaticSegments[i].ay);
        f15(PosX, PosY, SizeX, SizeY);
        for (var j = 0; j < ColizWord.HashDetectedCount; j++) {
            var HashID = ColizWord.HashDetected[j];
            if (HashID > -1 && HashID < 10000) {
                ColizWord.HashStaticsList[HashID].push(i);
            }
        }
    }
    famobi.log("Static Count in Hash vs Evil " + ColizWord.StaticSegmentsCount);
}

function f55() {
    ColizWord.HashSize_X = (ColizWord.HashPos_Right - ColizWord.HashPos_Left) / ColizWord.HashCount_X;
    ColizWord.HashSize_Y = (ColizWord.HashPos_Bottom - ColizWord.HashPos_Top) / ColizWord.HashCount_Y;
}

function f21(HashPos_Left, HashPos_Top, HashPos_Right, HashPos_Bottom) {
    ColizWord.HashPos_Left = HashPos_Left;
    ColizWord.HashPos_Top = HashPos_Top;
    ColizWord.HashPos_Right = HashPos_Right;
    ColizWord.HashPos_Bottom = HashPos_Bottom;
    f55();
}

function f49(HashCount_X, HashCount_Y) {
    if (HashCount_X > 100) HashCount_X = 100;
    if (HashCount_Y > 100) HashCount_Y = 100;
    ColizWord.HashCount_X = HashCount_X;
    ColizWord.HashCount_Y = HashCount_Y;
    f55();
}
var v277

function f229(PosX, PosY, PosXB, PosYB) {
    var WallLength = Math.sqrt((PosX - PosXB) * (PosX - PosXB) + (PosY - PosYB) * (PosY - PosYB));
    var WallAngle = -f201(PosX, PosY, PosXB, PosYB);
    f153();
    f186(PosX, PosY, 0);
    f251(WallAngle, 0, 0, 1);
    f129(-v277, -v277,
        v277, WallLength + v277);
    f185();
}
var v136 = 0;

function f92() {
    v277 = 0.5;
    f153();
    f186(0, 5, 0);
    f251(90, 1, 0, 0);
    gl.enable(gl.BLEND);
    gl.depthMask(false);
    f183(3);
    for (var x = 0; x < ColizWord.HashCount_X; x++) {
        var PosX = ColizWord.HashPos_Left + x * ColizWord.HashSize_X;
        for (var y = 0; y < ColizWord.HashCount_Y; y++) {
            f139(0.0, 0.0, 0.0, 0.8);
            var PosY = ColizWord.HashPos_Top + y * ColizWord.HashSize_Y;
            for (var i = 0; i < ColizWord.HashDetectedCount; i++) {
                if (ColizWord.HashDetected[i] == Math.floor(x + y * ColizWord.HashCount_X)) {
                    f139(0.0, 1.0, 0.0, 0.2);
                    break;
                }
            }
            f129(PosX + v277, PosY + v277,
                PosX + ColizWord.HashSize_X - v277, PosY + ColizWord.HashSize_Y - v277);
        }
    }
    f139(1.0, 1.0, 0.0, 0.2);
    for (var i = 0; i < ColizWord.StaticSegmentsCount; i++) {
        f229(ColizWord.StaticSegments[i].ax, ColizWord.StaticSegments[i].ay, ColizWord.StaticSegments[i].bx, ColizWord.StaticSegments[i].by);
    }
    f139(1.0, 1.0, 0.0, 1.0);
    for (var i = 0; i < ColizWord.HashDetectedCount; i++) {
        var HashID = ColizWord.HashDetected[i];
        if (HashID > -1 && HashID < 10000) {
            var SegCount = ColizWord.HashStaticsList[HashID].length;
            for (var j = 0; j < SegCount; j++) {
                var SegID = ColizWord.HashStaticsList[HashID][j];
                f229(ColizWord.StaticSegments[SegID].ax, ColizWord.StaticSegments[SegID].ay, ColizWord.StaticSegments[SegID].bx, ColizWord.StaticSegments[SegID].by);
            }
        }
    }
    v277 = 0.5;
    f139(0.0, 1.0, 0.0, 1.0);
    f229(ColizWord.Dyna_ax, ColizWord.Dyna_ay, ColizWord.Dyna_bx, ColizWord.Dyna_by);
    f229(ColizWord.Dyna_bx, ColizWord.Dyna_by, ColizWord.Dyna_cx, ColizWord.Dyna_cy);
    f229(ColizWord.Dyna_cx, ColizWord.Dyna_cy, ColizWord.Dyna_dx, ColizWord.Dyna_dy);
    f229(ColizWord.Dyna_dx, ColizWord.Dyna_dy, ColizWord.Dyna_ax, ColizWord.Dyna_ay);
    f139(1.0, 0.0, 0.0, 1.0);
    for (var i = 0; i < 100; i++)
        f129(v162[i] - 1, v160[i] - 1,
            v162[i] + 1, v160[i] + 1);
    gl.disable(gl.BLEND);
    gl.depthMask(true);
    f185();
}
var DataToDownload = 0;
var v262 = 0;
var v95 = 0;
var v215 = 0;
var v178 = 0;
var v265 = "";
var keysDown = {};
var v250 = 0;
var v313 = -1;
var v312 = -1;
var v239 = 0;
var v221 = 0;
var v185 = 0;
var v186 = 0;
var v217 = 180.0 / Math.PI;

function f240(variable) {
    return Math.cos(variable);
}

function f241(variable) {
    return Math.sin(variable);
}

function f201(xa, za, xb, zb) {
    return 270.0 - Math.atan2(za - zb, xa - xb) * v217;
}

function f133(xa, za, xb, zb) {
    return Math.atan2(zb - za, xb - xa);
}

function f114() {
    var myWidth = 100;
    if (typeof(window.innerWidth) == 'number') {
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        myWidth = document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        myWidth = document.body.clientWidth;
    }
    return myWidth;
}

function f96() {
    var myHeight = 100;
    if (typeof(window.innerWidth) == 'number') {
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        myHeight = document.body.clientHeight;
    }
    return myHeight;
}

function f67() {
    /*
    document.body.ontouchstart=function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    }
    document.body.touchmove=function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
    }
    */
}

function f175(el, X, Y) {
    Realv313 = X;
    Realv312 = Y;
    var CanvasX = v151.width;
    var CanvasY = v151.height;
    var TempX = X - v151.offsetLeft;
    var TempY = Y - v151.offsetTop;
    if (isNaN(TempX) == false && isNaN(TempY) == false) {
        OLD_v313 = v313;
        OLD_v312 = v312;
        v313 = X;
        v312 = Y;
        v313 *= v207 / v176;
        v312 *= v142 / v149;
        v313 = Math.floor(v313);
        v312 = Math.floor(v312);
        if (isNaN(v312) == true) v312 = 0;
        if (isNaN(v313) == true) v313 = 0;
        if (v313 < 0) v313 = 0;
        if (v312 < 0) v312 = 0;
        if (v313 > v207) v313 = v207;
        if (v312 > v142) v312 = v142;
    }
}

function f79() {
    if (v178 == 0 && v215 == -1) v215 = 0;
    if (v215 == 1) v215 = -1;
    if (v178 == 1 && v215 == 0) v215 = 1;
}
var v80 = [];
var v138 = 0;

function f177() {
    this.x = 0;
    this.y = 0;
    this.Touch_id = 0;
}

function f178() {
    v80 = [];
    v138 = 0;
}
/*
function f24(evt) {
var touches=evt.changedTouches;
if (v68==1) f178();
for (var i=0; i<touches.length; i++)
{
v80.push(touches[i]);
}
}
*/
function f24(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var touches = evt.changedTouches;
    var ShouldAddTouch;
    for (var i = 0; i < touches.length; i++) {
        ShouldAddTouch = 1;
        for (var j = 0; j < v138; j++) {
            if (v80[j].Touch_id == touches[i].identifier) {
                v80[j].x = touches[i].pageX;
                v80[j].y = touches[i].pageY;
                ShouldAddTouch = 0;
                break;
            }
        }
        if (ShouldAddTouch == 1) {
            var StartTouch = v138;
            v80.push();
            v80[v138] = new f177();
            v80[v138].x = touches[i].pageX;
            v80[v138].y = touches[i].pageY;
            v80[v138].Touch_id = touches[i].identifier;
            v138++;
        }
    }
}

function f41(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        for (var j = 0; j < v138; j++) {
            if (v80[j].Touch_id == touches[i].identifier) {
                v80.splice(j, 1);
                v138--;
                break;
            }
        }
    }
}

function f36(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        for (var j = 0; j < v138; j++) {
            if (v80[j].Touch_id == touches[i].identifier) {
                v80[j].x = touches[i].pageX;
                v80[j].y = touches[i].pageY;
                break;
            }
        }
    }
}

function f137(ax, ay, bx, by) {
    if (v215 == 1 && v313 >= ax && v313 <= bx && v312 >= ay && v312 <= by) {
        v215 = -1;
        return 1;
    }
    return 0;
}

function f136(ax, ay, bx, by) {
    if (v178 == 1 && v313 >= ax && v313 <= bx && v312 >= ay && v312 <= by) return 1;
    for (var i = 0; i < v138; i++) {
        var x = v80[i].x * v207 / v176;
        var y = v80[i].y * v142 / v149;
        if (
            x > ax &&
            x < bx &&
            y > ay &&
            y < by
        ) return 1;
    }
    return 0;
}
var v201 = -5000,
    TextField_y = -5000;

function f40() {
    f67();
    v151.addEventListener('touchstart', function(e) {
        if (v26 == 1 && v50 == 1) {
            v26 = 0;
            f219(9);
        }
        f24(e);
        f175(v151, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        if (v313 > v201 - 255 && v313 < v201 + 255 && v312 > TextField_y - 5 && v312 < TextField_y + 75) {
            v201 = -5000;
            TextField_y = -5000;
            document.getElementById("dlg-textfield").focus();
        }
        v178 = 1;
        window.scrollTo(0, 1);
    }, false)
    v151.addEventListener('touchmove', function(e) {
        f36(e);
        f175(v151, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        v178 = 1;
        window.scrollTo(0, 1);
    }, false)
    v151.addEventListener('touchend', function(e) {
        f41(e);
        if (v0 == 1) {
            v305.load();
            var promise = v305.play();
            if (promise) {
                //Older browsers may not return a promise, according to the MDN website
                promise.catch(function(error) {
                    // console.error(error);
                });
            }
            v0 = 0;
        }
        if (v265.length > 5) {
            window.open(v265);
            v265 = "";
        }
        v178 = 0;
        window.scrollTo(0, 1);
    }, false)
    v151.addEventListener('touchcancel', function(e) {
        f41(e);
        if (v265.length > 5) {
            window.open(v265);
            v265 = "";
        }
        v178 = 0;
        window.scrollTo(0, 1);
    }, false)
    v151.addEventListener('touchleave', function(e) {
        f41(e);
        v178 = 0;
        window.scrollTo(0, 1);
    }, false)
    if (v79 == 0) {
        v151.onmousemove = function(e) {
            f175(v151, e.pageX, e.pageY);
        }
        v151.onmousedown = function(e) {
            if (v265.length > 5) {
                window.open(v265);
                v265 = "";
            }
            f175(v151, e.pageX, e.pageY);
            v178 = 1;
        }
        v151.onmouseup = function(e) {
            if (v265.length > 5) {
                window.open(v265);
                v265 = "";
            }
            v178 = 0;
        }
        v151.onmouseout = function(e) {
            if (v265.length > 5) {
                window.open(v265);
                v265 = "";
            }
            v178 = 0;
        }
        addEventListener("keydown", function(e) {
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            KeyIsDown = 1;
            v250 = e.keyCode;
            keysDown[e.keyCode] = true;
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        addEventListener("keyup", function(e) {
            KeyIsDown = 0;
            v250 = 0;
            delete keysDown[e.keyCode];
        }, false);
    }
}
var Monetisation_IsFamobi = 0;
var v5 = 0;
var v19 = "php/";

function f76() {
    if(window.famobi.hasFeature("standalone") || !window.famobi.hasFeature("leaderboard")) {
        return false;
    }

    if (typeof window !== "undefined" && window.famobi) {
        Monetisation_IsFamobi = 1;
        v19 = "https://formulafever.famobi.com/php/" + Game_ID_String + "_";
    }
}
window.famobi_onPauseRequested = function() {
    v5 = 1;
};
window.famobi_onResumeRequested = function() {
    v5 = 0;
}

function f13() {
    if (v5 == 1) return 1;
    return 0;
}

function f43() {
    Stanislic_SendInfo("Monetisation__ShowAd_Request");
    // if (Monetisation_IsFamobi == 1) window.famobi.showAd();
}

function f19() {
    Stanislic_SendInfo("Monetisation__MoreGames_LinkClicked");
    famobi.moreGamesLink();
}
var v79 = 0;
var v68 = 0;
var v256 = 0;

function f250() {
    var ChromeStrings = ['crios'];
    var i = 0;
    for (i = 0; i < ChromeStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(ChromeStrings[i]);
        if (MOBILE_Search > -1) {
            v256 = 1;
            return 1;
        }
    }
    return 0;
}

function f249() {
    var ChromeStrings = ['crios'];
    var i = 0;
    for (i = 0; i < ChromeStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(ChromeStrings[i]);
        if (MOBILE_Search > -1) {
            return 0;
        }
    }
    var MobileStrings = ['safari'];
    var i = 0;
    for (i = 0; i < MobileStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(MobileStrings[i]);
        if (MOBILE_Search > -1) {
            return 1;
        }
    }
    return 0;
}

function f238() {
    var MobileStrings = ['android', "bean"];
    var i = 0;
    for (i = 0; i < MobileStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(MobileStrings[i]);
        if (MOBILE_Search > -1) {
            v68 = 1;
            return 1;
        }
    }
    return 0;
}

function f262() {
    var MobileStrings = ['iphone', 'ipad'];
    var i = 0;
    for (i = 0; i < MobileStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(MobileStrings[i]);
        if (MOBILE_Search > -1) {
            DeviceIsiOS = 1;
            return 1;
        }
    }
    DeviceIsiOS = 0;
    return 0;
}
var v295 = 0;

function f261() {
    var MobileStrings = ['os 8_'];
    var i = 0;
    for (i = 0; i < MobileStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(MobileStrings[i]);
        if (MOBILE_Search > -1) {
            v295 = 1;
            return 1;
        }
    }
    return 0;
}

function f248() {

    if((/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || !detection.is.pc)) {
        v79 = 1;
        return 1;
    } else {
        v79 = 0;
        return 0;
    }

    var MobileStrings = ['kfsowi', 'silk', 'tablet', 'mobile', 'iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
    var i = 0;
    for (i = 0; i < MobileStrings.length; i++) {
        var MOBILE_Search = navigator.userAgent.toLowerCase().search(MobileStrings[i]);
        if (MOBILE_Search > -1) {
            f238();
            v79 = 1;
            return 1;
        }
    }
    v79 = 0;
    return 0;
}
var Pref_User_Sound = 1;
var v61 = 1;
var v212 = null;
var v109 = null;
var v45 = 1;
var v97 = null;
var v65 = "none";
var v169 = "EndlessTruck_DLG_001_";

function f246(PrefID) {
    if (typeof localStorage == 'undefined') return null;
    if (Monetisation_IsFamobi == 1) {
        return famobi.localStorage.getItem(v169 + PrefID);
    }
    return localStorage.getItem(v169 + PrefID);
}

function f233(PrefID, Data) {
    if (typeof localStorage == 'undefined') return null;
    if (Monetisation_IsFamobi == 1) {
        famobi.localStorage.setItem(v169 + PrefID, Data);
        return;
    }
    localStorage.setItem(v169 + PrefID, Data);
}

function f230() {
    v109 = f246("UserKey");
    if (v109 == null) {
        var d = new Date();
        var Time = d.getTime();
        v109 = md5("mykey" + Time + Math.random() * 256);
        f233("UserKey", v109);
    }
    v212 = f246("UserID");
    if (v212 == null) {
        v212 = md5("UserID" + v109);
        f233("UserID", v212);
    }
    v45 = f246("UserAvatar");
    if (v45 < 1) {
        v45 = 1;
        f233("UserAvatar", v45);
    }
    v97 = f246("UserName");
    if (v97 == null) {
        f163(0, 0, 0);
        v97 = "Pilot" + Math.floor((50000 + Math.random() * 50000) * 0.1);
        f233("UserName", v97);
    }
}
var ScoresTable = [];
var v103 = 20;
var v104 = 0;
var v71 = 0;
var v75 = 0;

function f181() {
    this.LastUpdate = -1;
    this.Name = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.Score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.Rank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.Avatar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.PlayerRank = 0;
}

function f221() {
    for (var i = 0; i < v103; i++) {
        ScoresTable.push();
        ScoresTable[i] = new f181();
    }
}

function f239(Categorie) {

    if(window.famobi.hasFeature("standalone") || !window.famobi.hasFeature("leaderboard")) {
        return false;
    }

    v71 = 0;
    v104 = 0;
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        var protocolRegex = new RegExp('^file:', 'i');
        var isFileProtocol = protocolRegex.test(xmlhttp.responseURL);

        if (xmlhttp.readyState == 4
                && (xmlhttp.status == 200 || (isFileProtocol && xmlhttp.status == 0))) {
            ScoresTable[Categorie].Rank = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            v104 = 0;
            var str = xmlhttp.responseText;
            var OneLine = str.split(",");
            var i;
            if (OneLine.length < 3) return;
            for (i = 0; i < OneLine.length; i += 3) {
                if (v104 > 19) {
                    v71 = v104;
                    return;
                }
                if (OneLine[i].length < 1) {
                    v71 = v104;
                    return;
                }
                if (OneLine[i].substring(0, 2) == ">>") {
                    ScoresTable[Categorie].PlayerRank = parseInt(OneLine[i].substring(2));
                    famobi.log("ScoresTable [PlayerRank]: " + ScoresTable[Categorie].PlayerRank);
                } else {
                    if (OneLine[i + 2] < 1) {
                        v71 = v104;
                        return;
                    }
                    if (OneLine[i] == NaN) {
                        v71 = v104;
                        return;
                    }
                    if (OneLine[i + 2] == NaN) {
                        v71 = v104;
                        return;
                    }
                    var Posi = i / 3 - 1;
                    ScoresTable[Categorie].Rank[Posi] = Posi + 1;
                    ScoresTable[Categorie].Avatar[Posi] = 1;
                    if (OneLine[i][OneLine[i].length - 3] == "-") {
                        ScoresTable[Categorie].Name[Posi] = OneLine[i].substring(0, OneLine[i].length - 3);
                        ScoresTable[Categorie].Avatar[Posi] = parseInt(OneLine[i].substring(OneLine[i].length, OneLine[i].length - 2));
                    } else {
                        ScoresTable[Categorie].Name[Posi] = OneLine[i];
                    }
                    ScoresTable[Categorie].Score[Posi] = OneLine[i + 2];
                    famobi.log("ScoresTable [" + (Posi + 1) + "]: " + ScoresTable[Categorie].Name[Posi] + " " + ScoresTable[Categorie].Score[Posi]);
                    v104++;
                }
            }
            v71 = v104;
        }
    }
    xmlhttp.open("GET", v19 + "get_scores.php?cat=" + Categorie + "&maxscore=" + v75, true);
    xmlhttp.send();
}

function f220(Categorie) {
    var seconds = new Date().getTime() / 1000;
    if (seconds < ScoresTable[Categorie].LastUpdate) return;
    ScoresTable[Categorie].LastUpdate = seconds + 30;
    f239(Categorie);
}

function f45(Categorie) {
    f220(Categorie);
    return ScoresTable[Categorie].PlayerRank;
}

function f98(Pos, Categorie) {
    if (Pos > v103 - 1) return 1;
    f220(Categorie);
    return ScoresTable[Categorie].Avatar[Pos];
}

function f135(Pos, Categorie) {
    if (Pos > v103 - 1) return 0;
    f220(Categorie);
    return ScoresTable[Categorie].Rank[Pos];
}

function f132(Pos, Categorie) {
    if (Pos > v103 - 1) return 0;
    f220(Categorie);
    return ScoresTable[Categorie].Name[Pos];
}

function f104(Pos, Categorie) {
    if (Pos > v103 - 1) return 0;
    f220(Categorie);
    return ScoresTable[Categorie].Score[Pos];
}

function f163(Categorie, Score, Depth) {

    if(window.famobi.hasFeature("standalone") || !window.famobi.hasFeature("leaderboard")) {
        return false;
    }

    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        var protocolRegex = new RegExp('^file:', 'i');
        var isFileProtocol = protocolRegex.test(xmlhttp.responseURL);

        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200 || (isFileProtocol && xmlhttp.status == 0)) {
                famobi.log("f163: " + xmlhttp.responseText);
                ScoresTable[Categorie].LastUpdate = -1;
            } else {
                famobi.log("f163 ERROR: " + xmlhttp.responseText);
                if (Depth > 0) Submit_Score(Categorie, Score, Depth - 1);
            }
        }
    }
    Score = parseInt(Score);
    var ScoreKey = md5(v109 + Score + v212);
    var TempAvatarNumber = "-" + v45;
    if (v45 < 10) TempAvatarNumber = "-0" + v45;
    var UserTempName = v97 + TempAvatarNumber;
    var ULRsrc = v19 + 'update_scores.php?id=' + v212 + '&key=' + v109 + '&name=' + UserTempName + '&avatar=' + v45 + '&email=' + v65 + '&score=' + Score + '&scorekey=' + ScoreKey + '&cat=' + Categorie;
    xmlhttp.open("GET", ULRsrc, true);
    xmlhttp.send();
}
var Overlay_OnScreen = 0;

function Overlay_Hide() {
    var OverlayDiv = document.getElementById("overlay");
    OverlayDiv.style.display = "none";
    Overlay_OnScreen = 0;
}

function Overlay_fadeIn(fade) {
    if (fade > 1) fade = 1;
    var DialBoxDiv = document.getElementById("DialBox");
    DialBoxDiv.style.opacity = fade;
    DialBoxDiv.style.filter = "alpha(opacity=" + (fade * 100) + ")";
    if (fade < 1) setTimeout(function() {
        Overlay_fadeIn(fade + 0.1);
    }, 1000 / 40);
}

function Overlay_Show(path) {
    document.getElementById("OverlayFrame").src = path;
    Overlay_fadeIn(0);
    var OverlayDiv = document.getElementById("overlay");
    OverlayDiv.style.display = "block";
    Overlay_OnScreen = 1;
}
var Maxv273 = 40;
var v273 = new Array();
var v134 = false;

function f93() {
    this.Exist = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.s_sx = 0;
    this.s_sy = 0;
    this.s_sz = 0;
    this.size = 0;
    this.s_size = 0;
    this.Rotation = 0;
    this.s_Rotation = 0;
    this.TextureID = 0;
    this.v306y = 0;
    this.GroundBounce = 0;
    this.Alpha = 1.0;
    this.AlphaFade = 0.0;
}

function f61(true_false) {
    v134 = true_false;
}

function f127() {
    for (var i = 0; i < Maxv273; i++) {
        v273.push();
        v273[i] = new f93();
    }
}
var v172;
var TempGroundBounce;

function f48(v306y, GroundBounce) {
    v172 = v306y;
    TempGroundBounce = GroundBounce;
}
var v274;
var v274Fade;

function f64(Alpha, AlphaFade) {
    v274 = Alpha;
    v274Fade = AlphaFade;
}
var v124;

function f47(TextureID) {
    v124 = TextureID;
}
var v283;
var Temps_size;
var TempRotation;
var Temps_Rotation;

function f46(size, s_size, Rotation, s_Rotation) {
    v283 = size;
    Temps_size = s_size;
    TempRotation = Rotation;
    Temps_Rotation = s_Rotation;
}
var v322;
var Tempy;
var Tempz;
var Tempsx;
var Tempsy;
var Tempsz;

function f34(x, y, z, sx, sy, sz) {
    v322 = x;
    Tempy = y;
    Tempz = z;
    Tempsx = sx;
    Tempsy = sy;
    Tempsz = sz;
}

function f146() {
    var ID = -1;
    for (var i = 0; i < Maxv273; i++) {
        if (v273[i].Exist == 0) {
            ID = i;
            break;
        }
    }
    if (ID == -1) {
        famobi.log("v273 No Room !");
        return;
    }
    v273[ID].Exist = 1;
    v273[ID].x = v322;
    v273[ID].y = Tempy;
    v273[ID].z = Tempz;
    v273[ID].sx = Tempsx * 0.01;
    v273[ID].sy = Tempsy * 0.01;
    v273[ID].sz = Tempsz * 0.01;
    v273[ID].v306y = v172 * 0.01;
    v273[ID].GroundBounce = TempGroundBounce;
    v273[ID].Alpha = v274;
    v273[ID].AlphaFade = v274Fade * 0.01;
    v273[ID].TextureID = v124;
    v273[ID].size = v283 * 0.5;
    v273[ID].s_size = Temps_size * 0.1;
    v273[ID].Rotation = TempRotation;
    v273[ID].s_Rotation = Temps_Rotation * 0.1;
}

function f78(Shift) {
    for (var i = 0; i < Maxv273; i++) {
        if (v273[i].Exist == 1) {
            v273[i].x += Shift;
        }
    }
}

function f125() {
    gl.depthMask(false);
    f183(2);
    for (var i = 0; i < Maxv273; i++) {
        if (v273[i].Exist == 1) {
            f139(1.0, 1.0, 1.0, v273[i].Alpha);
            f153();
            f186(v273[i].x, v273[i].y, v273[i].z);
            if (v134 == false) {
                f189(-v148 - 1.57, 0, 1, 0);
                f251(30, -1, 0, 0);
            }
            f251(v273[i].Rotation, 0, 0, 1);
            f86(v273[i].TextureID, -v273[i].size, -v273[i].size, +v273[i].size, +v273[i].size);
            f185();
            v273[i].size += v273[i].s_size;
            v273[i].Alpha -= v273[i].AlphaFade * v262;
            if (v273[i].Alpha < 0 || v273[i].size < 1) v273[i].Exist = 0;
            v273[i].Rotation += v273[i].s_Rotation * v262;
            v273[i].x += v273[i].sx * v262;
            v273[i].y += v273[i].sy * v262;
            v273[i].z += v273[i].sz * v262;
            v273[i].sy -= v273[i].v306y * v262;
            if (v273[i].GroundBounce > 0 && v273[i].y < v273[i].size * 0.5) {
                v273[i].y = v273[i].size * 0.5;
                v273[i].sy = Math.abs(v273[i].sy) * v273[i].GroundBounce;
            }
        }
    }
    gl.depthMask(true);
}
var shaderProgram = new Array;
var v101 = new Array;
var v154 = new Array;
var v241 = new Array;
var v240 = new Array;
var v167 = 0;

function f139(R, G, B, A) {
    gl.uniform4f(v101[v116].ColorsUniform, R, G, B, A);
}

function f10() {
    gl.uniformMatrix4fv(v101[v116].v304Uniform, false, v304);
    gl.uniformMatrix4fv(v101[v116].v284Uniform, false, v284);
    gl.uniformMatrix4fv(v101[v116].v170Uniform, false, v170);
    if (v116 != 3) {
        gl.uniform1i(v101[v116].Texture0_Uniform, 0);
        gl.uniform1i(v101[v116].Texture1_Uniform, 1);
    }
}
var v116 = -1

function f183(id) {
    if (v154[id] != 1) return;
    gl.useProgram(shaderProgram[id]);
    v116 = id;
    /*
    gl.uniform1i(shaderProgram[id].useLightingUniform, 1.0);
    gl.uniform3f(
    shaderProgram[id].ambientColorUniform,
    parseFloat(0.5),
    parseFloat(0.2),
    parseFloat(0.5)
    );
    gl.uniform3f(
    shaderProgram[id].pointLightingLocationUniform,
    parseFloat(0.0),
    parseFloat(30.0),
    parseFloat(0.0)
    );
    gl.uniform3f(
    shaderProgram[id].pointLightingColorUniform,
    parseFloat(1.0),
    parseFloat(1.5),
    parseFloat(1.0)
    );
    */
}

function f70(id) {
    famobi.log("f70[" + id + "]");
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, v240[id]);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        alert("Error Compile Vertex Shader [" + id + "]" + gl.getShaderInfoLog(vertShader));
        alert(v240[id]);
        v167 = 0;
    }
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, v241[id]);
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        alert("Error Compile Fragment Shader [" + id + "]" + gl.getShaderInfoLog(fragShader));
        alert(v241[id]);
        v167 = 0;
    }
    shaderProgram[id] = gl.createProgram();
    gl.attachShader(shaderProgram[id], vertShader);
    gl.attachShader(shaderProgram[id], fragShader);
    gl.linkProgram(shaderProgram[id]);
    if (!gl.getProgramParameter(shaderProgram[id], gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        v167 = 0;
        return;
    }
    gl.useProgram(shaderProgram[id]);
    v101[id].vertexPositionAttribute = gl.getAttribLocation(shaderProgram[id], "aVertexPosition");
    gl.enableVertexAttribArray(v101[id].vertexPositionAttribute);
    v101[id].textureCoordAttribute = gl.getAttribLocation(shaderProgram[id], "aTextureCoord");
    if (v101[id].textureCoordAttribute != -1) gl.enableVertexAttribArray(v101[id].textureCoordAttribute);
    v101[id].v304Uniform = gl.getUniformLocation(shaderProgram[id], "uPMatrix");
    v101[id].v284Uniform = gl.getUniformLocation(shaderProgram[id], "uMVMatrix");
    v101[id].nMatrixUniform = gl.getUniformLocation(shaderProgram[id], "uNMatrix");
    v101[id].v170Uniform = gl.getUniformLocation(shaderProgram[id], "CamMatrix");
    v101[id].Texture0_Uniform = gl.getUniformLocation(shaderProgram[id], "Texture0");
    v101[id].Texture1_Uniform = gl.getUniformLocation(shaderProgram[id], "Texture1");
    v101[id].ColorsUniform = gl.getUniformLocation(shaderProgram[id], "uColors");
    v154[id] = 1;
    v167--;
}

function f106(id, name) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            v240[id] = "\n" + xmlhttp.responseText + "\n";
            v154[id] -= 1;
        }
    }
    xmlhttp.open("GET", "datas/shaders/" + name + ".vsh" + v197, true);
    xmlhttp.send();
}

function f107(id, name) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            v241[id] = "\n" + xmlhttp.responseText + "\n";
            v154[id] -= 1;
        }
    }
    xmlhttp.open("GET", "datas/shaders/" + name + ".fsh" + v197, true);
    xmlhttp.send();
}

function f168(id, name) {
    v167++;
    v154[id] = 0;
    f106(id, name);
    f107(id, name);
}

function f72() {
    if (v167 == 0) return 1;
    for (var i = 1; i < 20; i++) {
        if (v154[i] == -2) {
            f70(i);
        }
    }
    return 0;
}

function f23() {
    this.vertexPositionAttribute = 0;
    this.textureCoordAttribute = 0;
    this.v304Uniform = 0;
    this.v284Uniform = 0;
    this.nMatrixUniform = 0;
    this.v170Uniform = 0;
    this.Texture0_Uniform = 0;
    this.Texture1_Uniform = 0;
    this.ColorsUniform = 0;
}

function f145() {
    for (var i = 0; i < 20; i++) {
        shaderProgram.push;
        v154.push;
        v154[i] = 0;
        v101.push;
        v101[i] = new f23();
        v241.push;
        v240.push
    }
    f168(1, "simple");
    f168(2, "simple_color");
    f168(3, "only_color");
    f168(4, "shadow");
    f168(5, "simple_shadow");
}
var GLTexture = new Array();
var v98 = new Array();
var v144 = 200;
var v7;
var v3;
var v14;
var v150 = new Array();
var v96 = new Array();
var v56 = new Array();

function f51() {
    v7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    var vertices = [-0.5, 0.5, -0.2,
        0.5, 0.5, -0.2,
        0.5, -0.5, -0.2, -0.5, -0.5, -0.2,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    v7.itemSize = 3;
    v7.numItems = 4;
    v3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v3);
    var textureCoords = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    v3.itemSize = 2;
    v3.numItems = 4;
    v14 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v14);
    var sVertexIndices = [0, 1, 2, 0, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sVertexIndices), gl.STATIC_DRAW);
    v14.itemSize = 1;
    v14.numItems = 6;
}

function f42(texture) {
    if (DataToDownload > 0) DataToDownload--;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    if (f102(texture.image.width, texture.image.height) == 1) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function f110(Var) {
    if (Var > 4096) return 4096;
    if (Var > 2048) return 4096;
    if (Var > 1024) return 2048;
    if (Var > 512) return 1024;
    if (Var > 256) return 512;
    if (Var > 128) return 256;
    if (Var > 64) return 128;
    if (Var > 32) return 64;
    if (Var > 16) return 32;
    return 16;
}

function f102(x, y) {
    if (x != 16 && x != 32 && x != 64 && x != 128 && x != 256 && x != 512 && x != 1024 && x != 2048 && x != 4096) return 0;
    if (y != 16 && y != 32 && y != 64 && y != 128 && y != 256 && y != 512 && y != 1024 && y != 2048 && y != 4096) return 0;
    return 1;
}

function f2(x, y, TextName, ThisTexture) {
    famobi.log("No Power Of Two[" + i + "] '" + TextName + "' " + x + "x" + y);
    x = f110(x);
    y = f110(y);
    var dec_x = (x - ThisTexture.image.width) * 0.5;
    var dec_y = (y - ThisTexture.image.height) * 0.5;
    var width = ThisTexture.image.width;
    var height = ThisTexture.image.height;
    famobi.log("New Size " + x + "x" + y);
    var canvas = document.createElement('canvas');
    canvas.width = x;
    canvas.height = y;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(ThisTexture.image, dec_x, dec_y);
    ThisTexture.image.style.width = width;
    ThisTexture.image.style.height = height;
    ThisTexture.image.src = canvas.toDataURL();
}

function f116(ID, TextPath) {
    var TextName = "datas/" + TextPath + v197;
    if (TextPath.search("data:") != -1) TextName = TextPath;
    if (TextPath.search("http") != -1) TextName = TextPath;
    var i;
    if (ID != -1) {
        v98[ID] = TextName;
        for (i = 0; i < v144; i++) {
            if (v98[i] == TextName && i != ID) {
                famobi.log("Found Dupliacte Texture[" + i + "] '" + TextName + "'");
                return GLTexture[i];
            }
        }
    }
    famobi.log("f116[" + ID + "] '" + TextName + "'");
    DataToDownload++;
    var ThisTexture = gl.createTexture();
    ThisTexture.image = new Image();
    ThisTexture.image.onload = function() {
        var x = ThisTexture.image.width;
        var y = ThisTexture.image.height;
        f42(ThisTexture)
    }
    ThisTexture.image.src = TextName;
    return ThisTexture;
}

function f131() {
    var i;
    for (i; i < v144; i++) {
        GLTexture.push;
        v98.push;
    }
}
var v210 = -1;

function f160(ID) {
    if (v210 == ID) return;
    v210 = ID;
    if (ID == -1) return;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, GLTexture[ID]);
}

function f121(ID) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, GLTexture[ID]);
    gl.activeTexture(gl.TEXTURE0);
}

function f129(xa, ya, xb, yb) {
    f153();
    f186(xa, ya, 0.0);
    f256(xb - xa, yb - ya, 1);
    f186(0.5, 0.5, 0.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v7.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v14);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v14.numItems, gl.UNSIGNED_SHORT, 0);
    f185();
    v95 += 2;
}

function f86(ID, xa, ya, xb, yb) {
    if (ID != -1) f160(ID);
    f153();
    f186(xa, ya, 0.0);
    f256(xb - xa, yb - ya, 1);
    f186(0.5, 0.5, 0.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v7.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v3);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v3.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v14);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v14.numItems, gl.UNSIGNED_SHORT, 0);
    f185();
    v95 += 2;
}

function f165(ID) {
    f160(ID);
    f153();
    f256(GLTexture[ID].image.width, GLTexture[ID].image.height, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v7.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v3);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v3.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v14);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v14.numItems, gl.UNSIGNED_SHORT, 0);
    f185();
    v95 += 2;
}

function f234(path) {
    for (var i = 0; i < v150.length; i++) {
        if (v150[i] == path) return i;
    }
    var i = v150.length;
    v150.push();
    v56.push();
    v96.push();
    v150[i] = path;
    v96[i] = 0;
    var ThisTexture = gl.createTexture();
    ThisTexture.image = new Image();
    ThisTexture.image.crossOrigin = "Anonymous";
    ThisTexture.image.onload = function() {
        var x = ThisTexture.image.width;
        var y = ThisTexture.image.height;
        f42(ThisTexture)
        v56[i] = ThisTexture;
        v96[i] = 1;
    }
    ThisTexture.image.src = path;
    return i;
}

function f18(Path) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) return 0;
    return v56[TexID].image.width;
}

function f14(Path) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) return 0;
    return v56[TexID].image.height;
}

function f9(Path) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) return 0;
    return parseInt(v56[TexID].image.style.width);
}

function f5(Path) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) return 0;
    return parseInt(v56[TexID].image.style.height);
}

function f27(Path, v124) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) {
        f160(v124);
        return;
    }
    v210 = -1;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, v56[TexID]);
}

function f30(Path, v124) {
    var TexID = f234(Path);
    if (v96[TexID] == 0) {
        f153();
        f256(0.5, 0.5, 1);
        f251(Math.random() * 360, 0, 0, 1);
        if (v124 > 0) f165(v124);
        f185();
        return;
    }
    v210 = -1;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, v56[TexID]);
    f153();
    f256(v56[TexID].image.width, v56[TexID].image.height, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v7.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v3);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v3.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v14);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v14.numItems, gl.UNSIGNED_SHORT, 0);
    f185();
    v95 += 2;
}
var v135 = [];
var v304 = mat4.create();
var v284 = mat4.create();
var v170 = mat4.create();
var v137 = mat4.create();

function f153() {
    var copy = mat4.create();
    mat4.copy(copy, v284);
    v135.push(copy);
}

function f185() {
    if (v135.length == 0) {
        throw "Invalid pov304!";
    }
    v284 = v135.pop();
}
var v20;

function f38(x, y, z) {
    LightX = x;
    LightY = y;
    LightZ = z;
}

function f112() {
    var lightpos = [50, 0.1, 50, 1];
    lightpos[0] = LightX;
    lightpos[1] = LightY;
    lightpos[2] = LightZ;
    var dot;
    var groundplane = [0, 1, 0, 0];
    var shadowMat = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    dot = groundplane[0] * lightpos[0] + groundplane[1] * lightpos[1] + groundplane[2] * lightpos[2];
    shadowMat[0] = dot - lightpos[0] * groundplane[0];
    shadowMat[4] = -lightpos[0] * groundplane[1];
    shadowMat[8] = -lightpos[0] * groundplane[2];
    shadowMat[12] = -lightpos[0] * groundplane[3];
    shadowMat[1] = -lightpos[1] * groundplane[0];
    shadowMat[5] = dot - lightpos[1] * groundplane[1];
    shadowMat[9] = -lightpos[1] * groundplane[2];
    shadowMat[13] = -lightpos[1] * groundplane[3] + 1000;
    shadowMat[2] = -lightpos[2] * groundplane[0];
    shadowMat[6] = -lightpos[2] * groundplane[1];
    shadowMat[10] = dot - lightpos[2] * groundplane[2];
    shadowMat[14] = -lightpos[2] * groundplane[3];
    shadowMat[3] = -lightpos[3] * groundplane[0];
    shadowMat[7] = -lightpos[3] * groundplane[1];
    shadowMat[11] = -lightpos[3] * groundplane[2];
    shadowMat[15] = dot - lightpos[3] * groundplane[3];
    mat4.multiply(v284, v284, shadowMat);
}

function f253(degrees) {
    return degrees * Math.PI / 180;
}

function f186(x, y, z) {
    mat4.translate(v284, v284, [x, y, z]);
}

function f256(x, y, z) {
    mat4.scale(v284, v284, [x, y, z]);
}

function f251(Angle, x, y, z) {
    mat4.rotate(v284, v284, f253(Angle), [x, y, z]);
}

function f189(Angle, x, y, z) {
    mat4.rotate(v284, v284, Angle, [x, y, z]);
}

function f50(fov) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    mat4.perspective(v304, f253(fov), v176 / v149, 20.0, 4500.0);
    mat4.identity(v284);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
}
var v207 = 300;
var v142 = 700;

function f166() {
    v207 = v176 * v142 / v149;
    if (v207 < 500) v207 = 500;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    mat4.ortho(v304, 0, v207, v142, 0, 0.1, 800.0)
    mat4.identity(v284);
    mat4.identity(v170);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
var v173;
var v174;
var v175;
var v148;

function f202(EyeX, EyeY, EyeZ, CenterX, CenterY, CenterZ, UpX, UpY, UpZ) {
    v173 = EyeX;
    v174 = EyeY;
    v175 = EyeZ;
    mat4.lookAt(v170, [EyeX, EyeY, EyeZ], [CenterX, CenterY, CenterZ], [UpX, UpY, UpZ]);
    mat4.multiply(v284, v170, v284);
    v148 = f133(EyeX, EyeZ, CenterX, CenterZ);
}

function f80(EyeX, EyeY, EyeZ, CenterX, CenterY, CenterZ, UpX, UpY, UpZ) {
    v173 = EyeX;
    v174 = EyeY;
    v175 = EyeZ;
    mat4.lookAt(v170, [EyeX, EyeY, EyeZ], [CenterX, CenterY, CenterZ], [UpX, UpY, UpZ]);
    mat4.multiply(v137, v170, v284);
}
var v246 = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
var A = 0;
var B = 1;
var C = 2;
var D = 3;
var RIGHT = 0;
var LEFT = 1;
var v308 = 2;
var TOP = 3;
var BACK = 4;
var v318 = 5;

function f122(frustum, side) {
    var magnitude = Math.sqrt(frustum[side][A] * frustum[side][A] +
        frustum[side][B] * frustum[side][B] +
        frustum[side][C] * frustum[side][C]);
    frustum[side][A] /= magnitude;
    frustum[side][B] /= magnitude;
    frustum[side][C] /= magnitude;
    frustum[side][D] /= magnitude;
}

function f105() {
    v170
    var clip = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    clip[0] = v284[0] * v304[0] + v284[1] * v304[4] + v284[2] * v304[8] + v284[3] * v304[12];
    clip[1] = v284[0] * v304[1] + v284[1] * v304[5] + v284[2] * v304[9] + v284[3] * v304[13];
    clip[2] = v284[0] * v304[2] + v284[1] * v304[6] + v284[2] * v304[10] + v284[3] * v304[14];
    clip[3] = v284[0] * v304[3] + v284[1] * v304[7] + v284[2] * v304[11] + v284[3] * v304[15];
    clip[4] = v284[4] * v304[0] + v284[5] * v304[4] + v284[6] * v304[8] + v284[7] * v304[12];
    clip[5] = v284[4] * v304[1] + v284[5] * v304[5] + v284[6] * v304[9] + v284[7] * v304[13];
    clip[6] = v284[4] * v304[2] + v284[5] * v304[6] + v284[6] * v304[10] + v284[7] * v304[14];
    clip[7] = v284[4] * v304[3] + v284[5] * v304[7] + v284[6] * v304[11] + v284[7] * v304[15];
    clip[8] = v284[8] * v304[0] + v284[9] * v304[4] + v284[10] * v304[8] + v284[11] * v304[12];
    clip[9] = v284[8] * v304[1] + v284[9] * v304[5] + v284[10] * v304[9] + v284[11] * v304[13];
    clip[10] = v284[8] * v304[2] + v284[9] * v304[6] + v284[10] * v304[10] + v284[11] * v304[14];
    clip[11] = v284[8] * v304[3] + v284[9] * v304[7] + v284[10] * v304[11] + v284[11] * v304[15];
    clip[12] = v284[12] * v304[0] + v284[13] * v304[4] + v284[14] * v304[8] + v284[15] * v304[12];
    clip[13] = v284[12] * v304[1] + v284[13] * v304[5] + v284[14] * v304[9] + v284[15] * v304[13];
    clip[14] = v284[12] * v304[2] + v284[13] * v304[6] + v284[14] * v304[10] + v284[15] * v304[14];
    clip[15] = v284[12] * v304[3] + v284[13] * v304[7] + v284[14] * v304[11] + v284[15] * v304[15];
    v246[RIGHT][A] = clip[3] - clip[0];
    v246[RIGHT][B] = clip[7] - clip[4];
    v246[RIGHT][C] = clip[11] - clip[8];
    v246[RIGHT][D] = clip[15] - clip[12];
    f122(v246, RIGHT);
    v246[LEFT][A] = clip[3] + clip[0];
    v246[LEFT][B] = clip[7] + clip[4];
    v246[LEFT][C] = clip[11] + clip[8];
    v246[LEFT][D] = clip[15] + clip[12];
    f122(v246, LEFT);
    v246[v308][A] = clip[3] + clip[1];
    v246[v308][B] = clip[7] + clip[5];
    v246[v308][C] = clip[11] + clip[9];
    v246[v308][D] = clip[15] + clip[13];
    f122(v246, v308);
    v246[TOP][A] = clip[3] - clip[1];
    v246[TOP][B] = clip[7] - clip[5];
    v246[TOP][C] = clip[11] - clip[9];
    v246[TOP][D] = clip[15] - clip[13];
    f122(v246, TOP);
    v246[BACK][A] = clip[3] - clip[2];
    v246[BACK][B] = clip[7] - clip[6];
    v246[BACK][C] = clip[11] - clip[10];
    v246[BACK][D] = clip[15] - clip[14];
    f122(v246, BACK);
    v246[v318][A] = clip[3] + clip[2];
    v246[v318][B] = clip[7] + clip[6];
    v246[v318][C] = clip[11] + clip[10];
    v246[v318][D] = clip[15] + clip[14];
    f122(v246, v318);
}

function f71(xa, ya, za, xb, yb, zb) {
    for (var i = 0; i < 6; i++) {
        if (v246[i][A] * (xa) + v246[i][B] * (yb) + v246[i][C] * (za) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xb) + v246[i][B] * (yb) + v246[i][C] * (za) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xa) + v246[i][B] * (ya) + v246[i][C] * (za) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xb) + v246[i][B] * (ya) + v246[i][C] * (za) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xa) + v246[i][B] * (yb) + v246[i][C] * (zb) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xb) + v246[i][B] * (yb) + v246[i][C] * (zb) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xa) + v246[i][B] * (ya) + v246[i][C] * (zb) + v246[i][D] > 0) continue;
        if (v246[i][A] * (xb) + v246[i][B] * (ya) + v246[i][C] * (zb) + v246[i][D] > 0) continue;
        return 0;
    }
    return 1;
}

function f37(x, y, z, radius) {
    for (var i = 0; i < 6; i++) {
        if (v246[i][A] * x + v246[i][B] * y + v246[i][C] * z + v246[i][D] <= -radius) {
            return 0;
        }
    }
    return 1;
}
var v199 = 0;
var v198 = 0;

function f193() {
    var IN = [0, 0, 0, 1];
    var IN_B = [0, 0, 0, 0];
    IN_B[0] = IN[0] * v284[0] + IN[1] * v284[4] + IN[2] * v284[8] + IN[3] * v284[12];
    IN_B[1] = IN[0] * v284[1] + IN[1] * v284[5] + IN[2] * v284[9] + IN[3] * v284[13];
    IN_B[2] = IN[0] * v284[2] + IN[1] * v284[6] + IN[2] * v284[10] + IN[3] * v284[14];
    IN_B[3] = IN[0] * v284[3] + IN[1] * v284[7] + IN[2] * v284[11] + IN[3] * v284[15];
    IN[0] = IN_B[0] * v304[0] + IN_B[1] * v304[4] + IN_B[2] * v304[8] + IN_B[3] * v304[12];
    IN[1] = IN_B[0] * v304[1] + IN_B[1] * v304[5] + IN_B[2] * v304[9] + IN_B[3] * v304[13];
    IN[2] = IN_B[0] * v304[2] + IN_B[1] * v304[6] + IN_B[2] * v304[10] + IN_B[3] * v304[14];
    IN[3] = IN_B[0] * v304[3] + IN_B[1] * v304[7] + IN_B[2] * v304[11] + IN_B[3] * v304[15];
    if (IN[3] == 0.0) {
        v199 = v149 * 0.5;
        v198 = -v176;
        return 0;
    }
    IN[0] /= IN[3];
    IN[1] /= IN[3];
    IN[2] /= IN[3];
    if (IN[3] < 0.0) {
        IN[0] *= 20000;
        IN[1] *= 20000;
    }
    IN[0] = IN[0] * 0.5 + 0.5;
    IN[1] = IN[1] * 0.5 + 0.5;
    IN[2] = IN[2] * 0.5 + 0.5;
    /* Map x,y to viewport */
    IN[0] = IN[0] * v176;
    IN[1] = IN[1] * v149;
    if (IN[3] > 0.0) {
        v199 = IN[0];
        v198 = v149 - IN[1];
    } else {
        v199 = v176 - IN[0];
        v198 = IN[1];
    }
    return 1;
}
var v264 = new Array();
var v219 = 100;

function f151() {
    this.Exist = 0;
    this.xa = 0;
    this.ya = 0;
    this.xb = 0;
    this.yb = 0;
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.HPx = 0;
    this.HPy = 0;
    this.textureID = 0;
    this.VertexSpritePositionBuffer;
    this.TextureSpriteCoordBuffer;
    this.VertexSpriteIndexBuffer;
}

function f44(id) {
    v264[id].VertexSpritePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v264[id].VertexSpritePositionBuffer);
    vertices =
        [-v264[id].centerX, v264[id].centerY, -0.25,
            v264[id].centerX, v264[id].centerY, -0.25,
            v264[id].centerX, -v264[id].centerY, -0.25, -v264[id].centerX, -v264[id].centerY, -0.25,
        ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    v264[id].VertexSpritePositionBuffer.itemSize = 3;
    v264[id].VertexSpritePositionBuffer.numItems = 4;
    var TextureWidth = GLTexture[v264[id].textureID].image.width;
    var TextureHeight = GLTexture[v264[id].textureID].image.height;
    var uvStart_X = v264[id].xa / TextureWidth;
    var uvStart_Y = 1.0 - v264[id].ya / TextureHeight;
    var uvEnd_X = v264[id].xb / TextureWidth;
    var uvEnd_Y = 1.0 - v264[id].yb / TextureHeight;
    v264[id].VertexTextureSpriteCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v264[id].VertexTextureSpriteCoordBuffer);
    var textureCoords = [
        uvStart_X, uvEnd_Y, uvEnd_X, uvEnd_Y, uvEnd_X, uvStart_Y, uvStart_X, uvStart_Y,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    v264[id].VertexTextureSpriteCoordBuffer.itemSize = 2;
    v264[id].VertexTextureSpriteCoordBuffer.numItems = 4;
    v264[id].VertexSpriteIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v264[id].VertexSpriteIndexBuffer);
    var sVertexIndices = [0, 1, 2, 0, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sVertexIndices), gl.STATIC_DRAW);
    v264[id].VertexSpriteIndexBuffer.itemSize = 1;
    v264[id].VertexSpriteIndexBuffer.numItems = 6;
}

function f198(id, textureID, xa, ya, xb, yb) {
    v264[id].xa = xa;
    v264[id].ya = ya;
    v264[id].xb = xb;
    v264[id].yb = yb;
    v264[id].textureID = textureID;
    v264[id].width = xb - xa;
    v264[id].height = yb - ya;
    v264[id].centerX = v264[id].width * 0.5;
    v264[id].centerY = v264[id].height * 0.5;
    f44(id);
    v264[id].Exist = 1;
}

function f66(id, x, y) {
    v264[id].HPx = x;
    v264[id].HPy = y;
}

function f111(id, xa, ya, xb, yb) {
    if (id > -1) {} else {
        famobi.log("f111 " + id + " " + x + " " + y + " " + s);
        return;
    }
    if (v264[id].Exist != 1) return;
    f160(v264[id].textureID);
    f153();
    f186(xa, ya, 0.0);
    f256(xb - xa, yb - ya, 1);
    f186(0.5, 0.5, 0.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v7);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v264[id].VertexSpritePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v264[id].VertexTextureSpriteCoordBuffer);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v264[id].VertexTextureSpriteCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v264[id].VertexSpriteIndexBuffer);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v264[id].VertexSpriteIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    f185();
    v95 += 2;
}

function f16(id, x, y, s) {
    if (id > -1) {} else {
        famobi.log("f65 " + id + " " + x + " " + y + " " + s);
        return;
    }
    var SizeX = v264[id].centerX * s;
    var SizeY = v264[id].centerY * s;
    f195(id, x, y, s);
    if (f136(x - SizeX, y - SizeY - 40, x + SizeX, y + SizeY + 40) == 1) return 1;
    return 0;
}

function f65(id, x, y, s) {
    if (id > -1) {} else {
        famobi.log("f65 " + id + " " + x + " " + y + " " + s);
        return;
    }
    var SizeX = v264[id].centerX * s;
    var SizeY = v264[id].centerY * s;
    f195(id, x, y, s);
    if (f137(x - SizeX, y - SizeY, x + SizeX, y + SizeY) == 1) return 1;
    return 0;
}

function f195(id, x, y, s) {
    if (id > -1) {} else {
        famobi.log("!!f195 " + id + " " + x + " " + y + " " + s);
        return;
    }
    if (v264[id].Exist != 1) return;
    f160(v264[id].textureID);
    f153();
    f186(x, y, 0);
    if (s != 1.0) f256(s, s, 1);
    f186(v264[id].HPx, v264[id].HPy, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v264[id].VertexSpritePositionBuffer);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v264[id].VertexSpritePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v264[id].VertexTextureSpriteCoordBuffer);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v264[id].VertexTextureSpriteCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v264[id].VertexSpriteIndexBuffer);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v264[id].VertexSpriteIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    v95 += 2;
    f185();
}

function f194() {
    for (var i = 0; i < v219; i++) {
        v264.push();
        v264[i] = new f151();
    }
}
var Game_ID_String = "endlesstruck";
var v197 = "?0.957";
var v287 = [
    "Please wait, loading...",
    "Back FLIP",
    "Front FLIP",
    "Perfect LANDING",
    "Best ",
    "Low On Gas",
    "Out Of Gas",
    "Press Space Bar",
    "Touch to continue",
    "GARAGE",
    "PAUSED",
    "CONTINUE",
    "EXIT",
    "Distance",
    "Total Distance",
    "Garage Shop",
    "ENGINE",
    "BODYSHELL",
    "WHEELS",
    "FUEL TANK",
    "BULLBAR",
    "Increase max speed",
    "Increase Tank Capacity",
    "Better handling",
    "Increase Tank Capacity",
    "Better protection",
    "Speed+1",
    "Weight-1 Fuel+1",
    "Weight-1 Handling+1",
    "Fuel+1",
    "Weight+1 Shield+1",
    "BUY",
    "Fully Geared",
    "Free Bucks",
    "Options",
    "Play Music",
    "Play Sounds",
    "About",
    "Fuel Bonus!",
    "MISSION",
    "Perform 1 front flip",
    "Earn more than $150",
    "Do a perfect landing",
    "Perform 1 back flip",
    "Drive over 300m in one run",
    "Do 2 perfect landings",
    "Perform a double front flip",
    "Earn more than $500",
    "Buy one upgrade from the shop",
    "Perform a double back flip",
    "Pick up 2 gas tanks",
    "Drive a cumulative distance of 1000m",
    "Perform 1 front flip & 1 back flip in 1 jump",
    "Drive over 500m in one run",
    "Pick up more than $100 in one run",
    "Perform a triple front flip",
    "Pick up 3 gas tanks",
    "Buy 3 upgrades from the shop",
    "Perform a triple back flip",
    "Pick up $10 after crashing",
    "Have a cash balance of $1000",
    "Perform a quadruple front flip",
    "Do a perfect landing after a front flip",
    "Drive over 600m in one run",
    "Perform a quadrupe back flip",
    "Drive a cumulative distance of 5000m",
    "Perform a quintuple front flip",
    "Collect a gas tank after running out of gas",
    "Perform a quintuple back flip",
    "Buy 4 upgrades from the shop",
    "Drive over 700m in one run",
    "Perform a quintuple front flip",
    "Collect 3 gas tanks in one run",
    "Land perfectly after a triple front flip",
    "Buy 8 upgrades from the shop",
    "Perform a sextuple back flip",
    "Earn more than $600 in one run",
    "Fully upgrade one part of your truck",
    "Perform a sextuple front flip",
    "Drive a cumulative distance of 10km",
    "Perform 3 triple front flips",
    "Fully upgrade 2 parts of your truck",
    "Pick up 5 gas tanks in one run",
    "Perform 3 triple back flips",
    "Earn more than $2000 in one run",
    "Do a perfect landing after a quadruple back flip",
    "Roll over 40m after a crash",
    "Perform 2 quadruple front flips",
    "Fully upgrade 3 parts of your truck",
    "Perform 2 quadruple back flips",
    "Do 1 triple front flip and a back flip in 1 jump",
    "Earn more than $3000 in one run",
    "Fully upgrade 4 parts of your truck",
    "Do a perfect landing after a quadruple front flip",
    "Drive more than 1km in one run",
    "Perform a septuple front flip",
    "Do 1 triple back flip and 1 front flip in 1 jump",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Mission completed",
    "HI-SCORES",
    "Crashed",
    "Best Scores",
    "User Prefs",
    "Edit Your Name",
    "About",
    "ENDLESS TRUCK",
    "©FAMOBI INC.",
    "ENGINE CODING, GRAPHICS",
    "Daniel Labriet, DanLabGames",
    "PRODUCTION, BUSINESS DEV.",
    "Julien Donguy, AdAsGame",
    "TESTERS",
    "Lea, Emma, Monsieur S.",
    "Ok",
    "Please Rotate Device",
    "Please Make this",
    "Game Window larger",
    "Earn ",
    "Push Jump Button On Right",
    "Press the space bar on the keyboard",
    "To jump over the fence",
    "Push Rotation Button On left",
    "Press ARROW KEYS on the keyboard",
    "To perform a FLIP!",
    "JUMP Control Learned",
    "FLIP Controls Learned",
];
// famobi
var help = null;
for ($i = 0; $i < v287.length; $i++) {
    help = window.famobi.__(v287[$i]);
    if (help) v287[$i] = help;
    else famobi.log("not translated: " + v287[$i])
}
var v74 = 0;
var v196 = [
    300,
    1000,
    3000,
    7000
];
var v83 = [
    400,
    800,
    1000,
    2500,
    6000,
    7000,
    8000,
    9000,
    9999
];
var v195 = [
    350,
    900,
    2000,
    4500
];
var v143 = [
    250,
    600,
    1500,
    3500
];
var v107 = [
    500,
    2000,
    4000,
    7000
];
/*
if ( f137(v207*0.5-270, 190,v207*0.5-80,343)==1 ) {v214=13;v54=0;}
if ( f137(v207*0.5-80, 190,v207*0.5+80,343)==1 ) {v214=13;v54=1;}
if ( f137(v207*0.5+80, 190,v207*0.5+270,343)==1 ){v214=13;v54=2;}
if ( f137(v207*0.5-270, 343,v207*0.5-80,490)==1 ) {v214=13;v54=3;}
*/
var v214 = 0;
var v193 = 0;
var v249 = 0;
var v171 = 500;
var v33 = 0;
var v24 = 0;
var v81 = 0;
var v11 = 0;
var v153 = 200;
var v272 = 200;
var v156 = 0;
var v191 = 0;
var v190 = 0;
var v244 = 0;
var v105 = 0;
var v86 = -1;
var v266 = 0;
var v41 = 0;
var v189 = 0;
var v89 = 0;
var v70 = 0;
var v77 = 1;
var v110 = 1;
var v92 = 0;
var v114 = 0;
var v188 = 0;
var v49 = 0;
var v63 = 0;
var v13 = 0;
var v15 = 0;
var v8 = 0;
var v10 = 0;
var v2 = 0;
var v4 = 0;
var v17 = 0;
var v36 = 0;
var v42 = 0;
var v1 = 0;
var v29 = 0;

function f252() {
    this.x;
    this.y;
    this.radius;
    this.Pos;
    this.sx;
    this.sy;
    this.Rot;
    this.RotSpeed;
    this.OnGround;
    this.Sup_x;
    this.Sup_y;
    this.Sup_sx;
    this.Sup_sy;
    this.GroundY;
    this.GroundNormal_X;
    this.GroundNormal_Y;
}
var v311;
var v187 = 5;
var v291;
var v140 = 9;

function f204() {
    this.z;
}

function f243() {
    this.x;
    this.y;
    this.Size;
}

function f247() {
    this.x;
    this.z;
    this.sx;
    this.sz;
}

function f257() {
    this.x;
    this.y;
    this.sx = 0;
    this.sy = 0;
    this.sR = 0;
    this.Tyre;
    this.TyreCount;
    this.Body_x;
    this.Body_y;
    this.FlyingTime;
    this.RotationStep;
}
var v223 = 0;
var v289 = 392;
var v276 = 227;
var v220 = 0;
var v292 = 0;
var v268 = 0;
var PCar = new f257();
var v285 = 45.0;
var v181 = 5;
var v231 = 0;
var v230 = 0;
var v69 = 0;
var v67 = 0;
var v129;
var v130;
var v306 = 1.3;
var v179 = 0;
var v222 = 0;
var v270;

function f213(FuncDepth) {
    var DeltaPhy = (v262 / v181) * 0.01;
    if (v188 > 0) {
        v70 -= 5; {
            PCar.Tyre[1].sx -= v230 * DeltaPhy * v70;
            PCar.Tyre[1].sy += v231 * DeltaPhy * v70;
        } {
            PCar.Tyre[0].sx += v230 * DeltaPhy * v70;
            PCar.Tyre[0].sy -= v231 * DeltaPhy * v70;
        }
        v188 -= DeltaPhy;
        if (v222 > 3) {
            f48(0, 0.1);
            f64(1.0, 0.1);
            if (Math.random() > 0.5) f47(5);
            else f47(8);
            f46(25 + 15 * Math.random(), 5.5 + Math.random() * 5, Math.random() * 360, (25 + Math.random() * 5.5) * 0.1);
            f34(PCar.x, 7, PCar.y, PCar.sx * 0.5 + Math.random() * 10 - 5, 10, -1 - Math.random() * 10);
            f146();
            v222 = 0;
        }
        v222 += DeltaPhy * 7;
    }
    if (v114 == 0) {
        PCar.sy = -30;
        PCar.sx = (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.5;
        PCar.sR = 10;
    } else {
        PCar.Body_x = PCar.x;
        PCar.Body_y = PCar.y;
        v189 = 0;
    }
    if (FuncDepth == 0 && v114 == 1) {
        if (v272 > 0) v272 *= 0.995;
        PCar.Body_x += PCar.sx * DeltaPhy;
        PCar.x += PCar.sx * DeltaPhy;
        if (PCar.sx > 0) PCar.sx -= DeltaPhy;
        if (PCar.sx < 0) PCar.sx *= 0.999;
        PCar.Body_y += PCar.sy * DeltaPhy;
        PCar.y += PCar.sy * DeltaPhy;
        PCar.sy += DeltaPhy * 2;
        v254 += PCar.sR * DeltaPhy;
        if (PCar.sR > 0) PCar.sR -= DeltaPhy * 12;
        if (PCar.sR < 0) PCar.sR += DeltaPhy * 12;
        PCar.sR *= 0.9999;
        if (v222 > 5) {
            f48(0, 0.1);
            f64(1.0, 0.1);
            if (Math.random() > 0.5) f47(5);
            else f47(8);
            f46(25 + 15 * Math.random(), 5.5 + Math.random() * 5, Math.random() * 360, (25 + Math.random() * 5.5) * 0.1);
            f34(PCar.x, 7, PCar.y, PCar.sx * 0.5 + Math.random() * 10 - 5, 10, -1 - Math.random() * 10);
            f146();
            v222 = 0;
        }
        v222 += DeltaPhy * 7;
    }
    if (f31(PCar.Body_x, PCar.Body_y, 15) == true) {
        var DecalY = -1 * DeltaPhy;
        PCar.y += DecalY;
        if (FuncDepth == 0) {
            PCar.sR = -PCar.sx * 4;
            PCar.sy = -Math.abs(PCar.sy * 0.5);
            if (PCar.sy < -2) f219(11);
        }
        if (v114 == 0) {
            f99();
            f219(6);
            v29 = 0;
            v114 = 1;
            PCar.Tyre[0].sx = PCar.sx;
            PCar.Tyre[1].sx = PCar.sx;
            PCar.Tyre[0].sy = -10;
            PCar.Tyre[1].sy = -25;
        }
        f213(FuncDepth + 1);
        return;
    }
}

function f224(ID) {
    var DeltaPhy = (v262 / v181) * 0.01;
    var TyreRadius = PCar.Tyre[ID].radius;
    v129 = v231;
    v130 = v230;
    if (v189 > 0)
        PCar.Tyre[ID].sy += v306 * DeltaPhy * 0.5;
    else
        PCar.Tyre[ID].sy += v306 * DeltaPhy;
    PCar.Tyre[ID].x += PCar.Tyre[ID].sx * DeltaPhy;
    PCar.Tyre[ID].y += PCar.Tyre[ID].sy * DeltaPhy;
    var Speed = Math.sqrt(PCar.Tyre[ID].sx * PCar.Tyre[ID].sx + PCar.Tyre[ID].sy * PCar.Tyre[ID].sy);
    if (Speed == 0) Speed = 0.000000001;
    if (v189 > 0)
        if (Speed > v285 * 1.5) Speed = v285 * 1.5;
    if (v189 < 0.1)
        if (Speed > v285) Speed -= (Speed - v285) * 0.5;
    if (f31(PCar.Tyre[ID].x, PCar.Tyre[ID].y, TyreRadius) == true) {
        v129 = v72;
        v130 = v76;
        var NormX = v113 - PCar.Tyre[ID].x;
        var NormY = v112 - PCar.Tyre[ID].y;
        var length = Math.sqrt(NormX * NormX + NormY * NormY);
        if (length == 0) length = 0.000000001;
        NormX /= length;
        NormY /= length;
        PCar.Tyre[ID].x = (v113 - NormX * TyreRadius);
        PCar.Tyre[ID].y = (v112 - NormY * TyreRadius);
        PCar.Tyre[ID].sx = v129 * Speed;
        PCar.Tyre[ID].sy = v130 * Speed;
        if (PCar.Tyre[ID].OnGround < 80) {
            var SpeedY = PCar.Tyre[ID].sy;
            PCar.Tyre[ID].sy = -Math.abs(SpeedY * 0.1);
            PCar.Tyre[ID].y -= 2;
            f219(8);
            f48(-0.01, 1);
            f64(1.0, 0.05);
            f47(5);
            f46(30, 5.5, 360, 0.5);
            f34(PCar.Tyre[ID].x, 10, PCar.Tyre[ID].y, (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.2, -2, (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.2);
            f146();
            f48(0, 1);
            f64(1.0, 0.5);
            f47(2);
            f46(35 + 25 * Math.random(), 5.5, Math.random() * 360, (25 + Math.random() * 5.5) * 0.1);
            f34(PCar.Tyre[ID].x, 0, PCar.Tyre[ID].y, (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.2, -3, (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.2 + 2);
            f146();
        }
        PCar.Tyre[ID].OnGround = 100;
    }
    if (PCar.Tyre[ID].OnGround > 95) {
        PCar.Tyre[ID].RotSpeed = Speed * 3.0 * DeltaPhy;
        v89 = 0.5;
        var AccelSpeed = (2.0 + v156 * 2.0);
        if (v179 == 1) {
            PCar.Tyre[ID].sx += (v129 * DeltaPhy) * AccelSpeed;
            PCar.Tyre[ID].sy += (v130 * DeltaPhy) * AccelSpeed;
            if (v189 > 0) {
                PCar.Tyre[ID].sx += (v129 * DeltaPhy) * AccelSpeed * 2;
                PCar.Tyre[ID].sy += (v130 * DeltaPhy) * AccelSpeed * 2;
                if (v239 == 0) {
                    f48(0, 1);
                    f64(1.0, 0.6);
                    f47(4);
                    f46(50, -5, Math.random() * 360, -10.5);
                    f34(PCar.Tyre[ID].x, 10, PCar.Tyre[ID].y, (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.1, 0, (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.1);
                    f146();
                }
            }
        } else {
            if (PCar.Tyre[ID].sx > 0) PCar.Tyre[ID].sx -= DeltaPhy * 1.1;
            if (PCar.Tyre[ID].sx < 0) PCar.Tyre[ID].sx = 0;
        }
    } else {
        if (PCar.Tyre[ID].sx > 0) PCar.Tyre[ID].sx -= DeltaPhy * 0.10;
        if (PCar.Tyre[ID].sx < 0) PCar.Tyre[ID].sx = 0;
        if (PCar.Tyre[ID].RotSpeed > 1) PCar.Tyre[ID].RotSpeed -= DeltaPhy * 0.04;
        if (v89 < 20) v89 += DeltaPhy * 0.1;
    }
    PCar.Tyre[ID].OnGround -= DeltaPhy * 5;
    PCar.Tyre[ID].Rot -= PCar.Tyre[ID].RotSpeed;
    PCar.Tyre[ID].Sup_x += PCar.Tyre[ID].Sup_sx * DeltaPhy;
    PCar.Tyre[ID].Sup_y += PCar.Tyre[ID].Sup_sy * DeltaPhy;
    var SpringSpeed = 8.5;
    if (PCar.Tyre[ID].Sup_x < PCar.Tyre[ID].x) PCar.Tyre[ID].Sup_sx += DeltaPhy * SpringSpeed;
    else PCar.Tyre[ID].Sup_sx -= DeltaPhy * SpringSpeed;
    if (PCar.Tyre[ID].Sup_y < PCar.Tyre[ID].y) PCar.Tyre[ID].Sup_sy += DeltaPhy * SpringSpeed;
    else PCar.Tyre[ID].Sup_sy -= DeltaPhy * SpringSpeed;
    PCar.Tyre[ID].Sup_sx *= 0.99;
    PCar.Tyre[ID].Sup_sy *= 0.99;
    PCar.Tyre[ID].Sup_x = PCar.Tyre[ID].Sup_x * 0.99 + PCar.Tyre[ID].x * 0.01;
    PCar.Tyre[ID].Sup_y = PCar.Tyre[ID].Sup_y * 0.99 + PCar.Tyre[ID].y * 0.01;
    if (PCar.Tyre[ID].OnGround < 95) PCar.Tyre[ID].Sup_y = PCar.Tyre[ID].Sup_y * 0.95 + PCar.Tyre[ID].y * 0.05;
    if (PCar.Tyre[ID].OnGround < 95) PCar.Tyre[ID].Sup_x = PCar.Tyre[ID].Sup_x * 0.95 + PCar.Tyre[ID].x * 0.05;
    var MaxMove = 15;
    if (PCar.Tyre[ID].Sup_x < PCar.Tyre[ID].x - MaxMove) PCar.Tyre[ID].Sup_x = PCar.Tyre[ID].x - MaxMove;
    if (PCar.Tyre[ID].Sup_x > PCar.Tyre[ID].x + MaxMove) PCar.Tyre[ID].Sup_x = PCar.Tyre[ID].x + MaxMove;
    if (PCar.Tyre[ID].Sup_y < PCar.Tyre[ID].y - MaxMove) PCar.Tyre[ID].Sup_y = PCar.Tyre[ID].y - MaxMove;
    if (PCar.Tyre[ID].Sup_y > PCar.Tyre[ID].y + MaxMove) PCar.Tyre[ID].Sup_y = PCar.Tyre[ID].y + MaxMove;
}
var v159 = 0;
var Control_Right = 0;
var v161 = 0;

function f228() {
    if (v79 == 0) {
        v159 = keysDown[37];
        Control_Right = keysDown[39];
        v161 = keysDown[32];
    }
    if (v272 < 0 && (PCar.Tyre[0].OnGround > 90 || PCar.Tyre[1].OnGround > 90)) {
        v159 = 0;
        Control_Right = 0;
        v161 = 0;
        PCar.Tyre[0].sx *= 0.995;
        PCar.Tyre[1].sx *= 0.995;
        v70 * 0.9;
    }
    var TyreMaxId = PCar.TyreCount - 1;
    for (var j = 0; j < v181; j++) {
        if (v114 == 0) {
            v231 = PCar.Tyre[0].x - PCar.Tyre[1].x;
            v230 = PCar.Tyre[0].y - PCar.Tyre[1].y;
            var length = Math.sqrt(v231 * v231 + v230 * v230);
            if (length == 0) length = 0.000000001;
            v231 /= length;
            v230 /= length;
        }
        var DeltaPhy = (v262 / v181) * 0.01;
        if (v159 == 1) {
            if (v225 == 2) {
                v225 = 0;
                f219(14);
                f113(131, 5);
            }
            v70 += v89 * DeltaPhy * 1.0;
            if (v70 < 0) v70 += v89 * DeltaPhy * 0.5;
            if (PCar.Tyre[1].Sup_y < PCar.Tyre[1].y + 8) {
                PCar.Tyre[1].Sup_y += DeltaPhy * 9.5;
                PCar.Tyre[1].Sup_sy *= 0.5;
            }
        } else {
            if (v70 > 0) v70 -= v89 * DeltaPhy * 0.4;
        }
        if (Control_Right == 1) {
            if (v225 == 2) {
                v225 = 0;
                f219(14);
                f113(131, 5);
            }
            v70 -= v89 * DeltaPhy * 1.0;
            if (v70 > 0) v70 -= v89 * DeltaPhy * 0.5;
            if (PCar.Tyre[0].Sup_y < PCar.Tyre[0].y + 8) {
                PCar.Tyre[0].Sup_y += DeltaPhy * 9.5;
                PCar.Tyre[0].Sup_sy *= 0.5;
            }
        } else {
            if (v70 < 0) v70 += v89 * DeltaPhy * .4;
        }
        if (v70 > v89 * 3) v70 = v89 * 3;
        if (v70 < -v89 * 3) v70 = -v89 * 3; {
            PCar.Tyre[1].sx -= v230 * DeltaPhy * v70;
            PCar.Tyre[1].sy += v231 * DeltaPhy * v70;
        } {
            PCar.Tyre[0].sx += v230 * DeltaPhy * v70;
            PCar.Tyre[0].sy -= v231 * DeltaPhy * v70;
        }
        /*
        if (v161==1)
        {
        if (PCar.Tyre[0].sy<20) PCar.Tyre[0].sy +=DeltaPhy*10;
        if (PCar.Tyre[1].sy<20) PCar.Tyre[1].sy +=DeltaPhy*10;
        v41=1;
        }
        */
        if (v161 == 1) {
            if (PCar.Tyre[1].OnGround > 95 || PCar.Tyre[0].OnGround > 95) {
                if (v225 == 1) {
                    v225 = 0;
                    f219(14);
                    f113(130, 5);
                }
                f219(10);
                PCar.Tyre[0].sy += -16 * v231;
                PCar.Tyre[0].sx += -16 * v230 * 0.1;
                PCar.Tyre[1].sy += -18 * v231;
                PCar.Tyre[1].sx += -15 * v230 * 0.1;
                PCar.Tyre[0].sx = (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.5;
                PCar.Tyre[0].sy = (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.5;
                PCar.Tyre[1].OnGround = 95;
                PCar.Tyre[0].OnGround = 95;
                PCar.Tyre[0].Sup_x = PCar.Tyre[0].x;
                PCar.Tyre[0].Sup_y = PCar.Tyre[0].y;
                PCar.Tyre[1].Sup_x = PCar.Tyre[1].x;
                PCar.Tyre[1].Sup_y = PCar.Tyre[1].y;
                PCar.Tyre[0].Sup_sx = PCar.Tyre[0].sx;
                PCar.Tyre[1].Sup_sx = PCar.Tyre[1].sx;
                PCar.Tyre[0].Sup_sy = 25;
                PCar.Tyre[1].Sup_sy = -25;
                if (v189 > 2) {}
                v41 = 1;
            }
        }
        if (v114 == 0) {
            if (PCar.Tyre[0].x > PCar.Tyre[1].x) {
                v231 = PCar.Tyre[0].x - PCar.Tyre[1].x;
                v230 = PCar.Tyre[0].y - PCar.Tyre[1].y;
            } else {
                v231 = PCar.Tyre[1].x - PCar.Tyre[0].x;
                v230 = PCar.Tyre[1].y - PCar.Tyre[0].y;
            }
            v231 = PCar.Tyre[0].x - PCar.Tyre[1].x;
            v230 = PCar.Tyre[0].y - PCar.Tyre[1].y;
            var length = Math.sqrt(v231 * v231 + v230 * v230);
            if (length == 0) length = 0.000000001;
            v231 /= length;
            v230 /= length;
        }
        f57(PCar.Tyre[0].x, PCar.Tyre[0].y, PCar.Tyre[0].x, PCar.Tyre[0].y + 1000);
        PCar.Tyre[0].GroundY = ColDirY;
        PCar.Tyre[0].GroundNormal_X = v72;
        PCar.Tyre[0].GroundNormal_Y = v76;
        f57(PCar.Tyre[1].x, PCar.Tyre[1].y, PCar.Tyre[1].x, PCar.Tyre[1].y + 1000);
        PCar.Tyre[1].GroundY = ColDirY;
        PCar.Tyre[1].GroundNormal_X = v72;
        PCar.Tyre[1].GroundNormal_Y = v76;
        v69 = PCar.Tyre[0].x - PCar.Tyre[1].x;
        v67 = PCar.Tyre[0].GroundY - PCar.Tyre[1].GroundY;
        var length = Math.sqrt(v69 * v69 + v67 * v67);
        if (length == 0) length = 0.000000001;
        v69 /= length;
        v67 /= length;
        f224(1);
        f224(0);
        if (v114 == 0)
            for (var i = 0; i < PCar.TyreCount - 1; i++) {
                var k = i + 1;
                var x1 = PCar.Tyre[i].x;
                var y1 = PCar.Tyre[i].y;
                var x2 = PCar.Tyre[k].x;
                var y2 = PCar.Tyre[k].y;
                var x3 = x1 - x2;
                var y3 = y1 - y2;
                var length = Math.sqrt(x3 * x3 + y3 * y3);
                if (length == 0) length = 0.0000001;
                x3 /= length;
                y3 /= length;
                var cx = (PCar.Tyre[i].x + PCar.Tyre[k].x) * 0.5;
                var cy = (PCar.Tyre[i].y + PCar.Tyre[k].y) * 0.5;
                var dist = Math.abs(PCar.Tyre[i].Dist - PCar.Tyre[k].Dist) * 0.5;
                PCar.Tyre[i].x = cx + dist * x3;
                PCar.Tyre[i].y = cy + dist * y3;
                PCar.Tyre[k].x = cx - dist * x3;
                PCar.Tyre[k].y = cy - dist * y3;
            }
        if (v114 == 0) {
            PCar.x = 0;
            PCar.y = 0;
            for (var i = 0; i < PCar.TyreCount; i++) {
                PCar.x += PCar.Tyre[i].x;
                PCar.y += PCar.Tyre[i].y;
            }
            PCar.x /= PCar.TyreCount;
            PCar.y /= PCar.TyreCount;
        }
        f213(0);
        if (v114 == 0) {
            v254 = f201(PCar.Tyre[0].Sup_x, PCar.Tyre[0].Sup_y, PCar.Tyre[1].Sup_x, PCar.Tyre[1].Sup_y) + 90;
            v133 = f201(PCar.Tyre[0].x, PCar.Tyre[0].y, PCar.Tyre[1].x, PCar.Tyre[1].y) + 90;
        }
        if (PCar.Tyre[1].OnGround > 99 || PCar.Tyre[0].OnGround > 99) {
            if (v114 == 0 && v272 > 0 && PCar.FlyingTime > 11 && Math.abs(Math.round((v231 - v69) * 100) / 100) < 0.25 && Math.abs(Math.round((v230 - v67) * 100) / 100) < 0.25) {
                PCar.Tyre[0].sx *= 1.5;
                PCar.Tyre[1].sx *= 1.5;
                f113(3, 15);
                v41 = 3;
                v189 = 10;
                f219(3);
                v17++;
                v2 = v49;
                v4 = v63;
            }
            v77 = 1;
            v110 = 1;
            v49 = 0;
            v63 = 0;
            PCar.FlyingTime = 0;
            PCar.RotationStep = 0;
        } else {
            PCar.FlyingTime += DeltaPhy;
            if (v41 > -7) v41 -= DeltaPhy * 3;
            if (PCar.RotationStep == 0 && v230 < -0.9) PCar.RotationStep = 1;
            if (PCar.RotationStep == 1 && v231 < -0.9) PCar.RotationStep = 2;
            if (PCar.RotationStep == 1 && v231 > 0.9) PCar.RotationStep = 0;
            if (PCar.RotationStep == 2 && v230 > 0.9) PCar.RotationStep = 3;
            if (PCar.RotationStep == 2 && v230 < -0.9) PCar.RotationStep = 1;
            if (PCar.RotationStep == 3 && v231 > 0.7) {
                PCar.RotationStep = 0;
                f113(1, 10 * v110);
                v110 *= 2;
                v63++;
                if (v63 == 3) v15++;
                if (v63 == 4) v10++;
            }
            if (PCar.RotationStep == 3 && v231 < -0.9) PCar.RotationStep = 2;
            if (PCar.RotationStep == 0 && v230 > 0.9) PCar.RotationStep = -1;
            if (PCar.RotationStep == -1 && v231 < -0.9) PCar.RotationStep = -2;
            if (PCar.RotationStep == -1 && v231 > 0.9) PCar.RotationStep = 0;
            if (PCar.RotationStep == -2 && v230 < -0.9) PCar.RotationStep = -3;
            if (PCar.RotationStep == -2 && v230 > 0.9) PCar.RotationStep = -1;
            if (PCar.RotationStep == -3 && v231 > 0.7) {
                PCar.RotationStep = 0;
                f113(2, 10 * v77);
                v77 *= 2;
                v49++;
                if (v49 == 3) v13++;
                if (v49 == 4) v8++;
            }
            if (PCar.RotationStep == -3 && v231 < -0.9) PCar.RotationStep = -2;
        }
    }
}
var v254 = 90;
var v133 = 90;
var v216 = 0;
var FlagCount = 6;
var PFlag = new Array();
var v269 = 10;
var v168 = new Array();
var v59 = 0;

function f226() {
    this.ObjID;
    this.PosX;
}

function f90(ID) {
    for (var i = 0; i < v269; i++) {
        famobi.log("v168[" + i + "].ObjID=" + v168[i].ObjID);
        if (v168[i].ObjID == -1) {
            var ObjID = 9;
            if (ID != -1) ObjID = ID;
            v168[i].ObjID = ObjID;
            v168[i].PosX = v59;
            for (var j = 0; j < OBJ[ObjID].MarkersCount - 1; j++) {
                f20(
                    v59 + OBJ[ObjID].Marker[j].x, -OBJ[ObjID].Marker[j].z,
                    v59 + OBJ[ObjID].Marker[j + 1].x, -OBJ[ObjID].Marker[j + 1].z);
            }
            v59 += OBJ[ObjID].Max_X;
            famobi.log("f90 " + ID + " v59" + v59 + " ID" + i);
            return;
        }
    }
}
var v310 = 0;
var v226 = 0;

function f182(ChunkID) {
    var ObjRemoved = v168[ChunkID].ObjID;
    var ShiftX = OBJ[ObjRemoved].Max_X;
    v168[ChunkID].ObjID = -1;
    v59 -= ShiftX;
    v289 -= ShiftX;
    v216 -= ShiftX;
    v303 -= ShiftX;
    PCar.x -= ShiftX;
    PCar.Body_x -= ShiftX;
    PCar.Tyre[0].x -= ShiftX;
    PCar.Tyre[1].x -= ShiftX;
    PCar.Tyre[0].Sup_x -= ShiftX;
    PCar.Tyre[1].Sup_x -= ShiftX;
    v310 -= ShiftX;
    v226 -= ShiftX;
    v173 -= ShiftX;
    v164 -= ShiftX;
    f78(-ShiftX);
    for (var i = 0; i < FlagCount; i++) {
        PFlag[i].x -= ShiftX;
    }
    for (var i = 0; i < v269; i++) {
        if (v168[i].ObjID != -1) {
            v168[i].PosX -= ShiftX;
        }
    }
    for (var i = 0; i < v255; i++) {
        if (v307[i].ID != -1) {
            v307[i].x -= ShiftX;
        }
    }
    f59(ShiftX);
    var Rando = Math.floor(Math.random() * 8);
    var ChunkObjID = 26;
    if (Rando == 0) ChunkObjID = 12;
    if (Rando == 1) ChunkObjID = 13;
    if (Rando == 2) ChunkObjID = 22;
    if (Rando == 3) ChunkObjID = 9;
    if (Rando == 4) ChunkObjID = 31;
    if (Rando == 5) ChunkObjID = 32;
    f90(ChunkObjID);
    f12(-2000);
    f94();
    f28();
}
var FlagX, FlagZ;
var FlagGoalX, FlagGoalZ;
var FlagMatrix;

function f232() {
    if (v114 == 1) return;
    var Dist = 8.4;
    for (var i = 0; i < FlagCount; i++) {
        var NormX = FlagGoalX - FlagX;
        var NormY = FlagGoalZ - FlagZ;
        var length = Math.sqrt(NormX * NormX + NormY * NormY);
        if (length == 0) length = 0.000000001;
        NormX /= length;
        NormY /= length;
        var GoalX = FlagX + NormX * Dist;
        var GoalZ = FlagZ + NormY * Dist;
        PFlag[i].x = GoalX * 0.4 + PFlag[i].x * 0.6;
        PFlag[i].z = GoalZ * 0.4 + PFlag[i].z * 0.6;
        PFlag[i].x += PFlag[i].sx * v262;
        PFlag[i].z += PFlag[i].sz * v262;
        PFlag[i].sx *= 0.99;
        PFlag[i].sz *= 0.99;
        var Rigi = 0.0003 * v262;
        if (PFlag[i].x < GoalX - 0.8) PFlag[i].sx += Rigi;
        if (PFlag[i].x > GoalX - 0.1) PFlag[i].sx -= Rigi;
        if (PFlag[i].z < GoalZ - 0.1) PFlag[i].sz += Rigi;
        if (PFlag[i].z > GoalZ) PFlag[i].sz -= Rigi;
        NormX = PFlag[i].x - FlagX;
        NormY = PFlag[i].z - FlagZ;
        length = Math.sqrt(NormX * NormX + NormY * NormY);
        if (length == 0) length = 0.000000001;
        NormX /= length;
        NormY /= length;
        FlagX = FlagX + NormX * Dist;
        FlagZ = FlagZ + NormY * Dist;
        FlagGoalX = FlagX + NormX * Dist;
        FlagGoalZ = FlagZ + NormY * Dist;
        f153();
        f186(FlagX, 9, FlagZ);
        f251(90, -1, 0, 0);
        var Angle = f201(FlagX, FlagZ, FlagGoalX, FlagGoalZ);
        f251(Angle, 0, 0, 1);
        if (FlagCount == i + 1) f196(5);
        else f196(4);
        f185();
    }
}
var v66 = 0;
var v166 = 0;

function f254() {
    var Scale = 0.11;
    if (v66 != v191) {
        v66 = v191;
        if (v191 == 1) f188(0, "body_1b.obj");
        if (v191 == 2) f188(0, "body_2.obj");
        if (v191 == 3) f188(0, "body_3.obj");
        if (v191 == 4) f188(0, "body_4.obj");
        if (v191 == 5) f188(0, "body_5.obj");
        if (v191 == 6) f188(0, "body_5b.obj");
        if (v191 == 7) f188(0, "body_5c.obj");
        if (v191 == 8) f188(0, "body_5d.obj");
    }
    if (v166 != v190) {
        v166 = v190;
        if (v190 == 1) f188(1, "tyre_2.obj");
        if (v190 == 2) f188(1, "tyre_3.obj");
        if (v190 == 3) f188(1, "tyre_4.obj");
        if (v190 == 4) f188(1, "tyre_5.obj");
    }
    if (v114 == 0) {
        f153();
        f186(PCar.x, 0, PCar.y - 2);
        f251(v133, 0, 1, 0);
        f196(15);
        f185();
    }
    if (PCar.Tyre[0].OnGround < 98) v292 *= 0.8;
    else v292 = f240(v81 * 2) * 4;
    f153();
    f186(PCar.x, 0, PCar.y);
    f251(v292, 1, 0, 0);
    f251(v254, 0, 1, 0);
    if (v114 == 0) f186(0, 0, v41);
    f251(-90, 1, 0, 0);
    f256(Scale, Scale, Scale);
    if (v114 == 1) {
        f186(0, -170, 0);
        f251(25, 1, 1, 1);
    }
    f196(0);
    f196(2);
    if (v105 > 0) f196(17 + v105);
    f185();
    v41 *= 0.94;
    if (v114 == 0) {
        f153();
        f186(PCar.Tyre[0].x, 0, PCar.Tyre[0].y - 2);
        f251(v302, 0, 1, 0);
        f256(1, 1, 0.8 - v41 * 0.05);
        f196(16);
        f185();
        f153();
        f186(v294, 0, v293);
        f251(v302 + 180, 0, 1, 0);
        f196(17);
        f185();
        f153();
        f186(PCar.Tyre[1].x, 0, PCar.Tyre[1].y - 2);
        f251(v299, 0, 1, 0);
        f256(1, 1, 0.8 - v41 * 0.05);
        f196(16);
        f185();
        f153();
        f186(v301, 0, v300);
        f251(v299 + 180, 0, 1, 0);
        f196(17);
        f185();
    }
    for (var i = 0; i < PCar.TyreCount; i++) {
        var TyreRumble = f240(v81 * 10 + i * 130) * 2;
        if (PCar.Tyre[0].OnGround < 80) TyreRumble = 0;
        var Scale = PCar.Tyre[i].radius * 0.008;
        f153();
        f186(PCar.Tyre[i].x, 0, PCar.Tyre[i].y - 2);
        f251(TyreRumble, 1, 0, 0);
        f256(Scale, Scale, Scale);
        f251(PCar.Tyre[i].Rot, 0, 1, 0);
        f196(1);
        f185();
        /*
        f153();
        f186(PCar.Tyre[i].Sup_x,0,PCar.Tyre[i].Sup_y);
        f256(Scale*0.5,Scale*1.5,Scale*0.5);
        f196(1);
        f185();
        */
        /*
        f153();
        f186(PCar.Tyre[i].x,0,PCar.Tyre[i].GroundY);
        f256(Scale*0.5,Scale*1.5,Scale*0.5);
        f196(1);
        f185();
        */
    }
}
var v165 = 0;
var v173 = 0;
var v174 = 0;
var v175 = 0;
var v164 = 0;
var v158 = 0;
var v157 = 0;
var v303 = -1;
var v294;
var v293;
var v302;
var v301;
var v300;
var v299;
var v255 = 15;

function f212() {
    this.x;
    this.z;
    this.nx;
    this.ny;
    this.ID = -1;
}
var v307 = new Array();

function f211(ID, x, z) {
    for (var i = 0; i < v255; i++) {
        if (v307[i].ID == -1) {
            if (z == -1) {
                v192 = 0;
                f57(x, -1000, x, -1);
                v192 = 0;
                z = ColDirY;
                if (z > 5) return;
                if (ID == 28 && z < -60) return 0;
                if (ID == 33 && z < -60) return 0;
                if (ID == 33) z = 0;
                if (ID == 34 && z < -30) return 0;
            }
            v307[i].x = x;
            v307[i].z = z;
            if (ID == 34) {
                v192 = 0;
                f57(x - 600, -1000, x - 600, -1);
                if (Math.abs(v307[i].z - ColDirY) > 5) return 0;
            }
            v307[i].ID = ID;
            return 1;
        }
    }
    return 0;
}

function f176() {
    f183(2);
    f139(1, 1, 1, 1);
    for (var i = 0; i < v255; i++) {
        if (v307[i].ID != -1) {
            var Jump = f240(v249 * 10 + i * 5) * 15;
            if (Jump < 0) Jump = 0;
            if (v307[i].ID == 28 || v307[i].ID == 33 || v307[i].ID == 34) Jump = 0;
            f153();
            f186(v307[i].x, 0, v307[i].z - Jump);
            if (v307[i].ID < 28) f251(v249 * 200 + i * 50, 0, 0, 1);
            if (v307[i].ID == 34 && f240(v249 * 20 + i * 5) > 0) f139(2, 2, 1.5, 1.0);
            else f139(1, 1, 1, 1.0);
            if (v307[i].ID == 34) f256(1.0, 1.0, 1.0 + f240(v249 * 15 + i * 5) * 0.05);
            f196(v307[i].ID);
            f185();
            if (v307[i].x < -100) v307[i].ID = -1;
            if (v307[i].ID == 33) f209(v307[i].x);
            if (v307[i].ID == 23 && v307[i].x < PCar.x + 50 && v307[i].x > PCar.x - 50 && v307[i].z - 75 < PCar.y) {
                f219(7);
                if (v272 < 0.1) v1 = 1;
                v307[i].ID = -1;
                v272 += 50;
                v92 = 700;
                if (v272 > v153) v272 = v153;
                f48(0, 1);
                f64(1.0, 0.1);
                f47(8);
                f46(5 + 15 * Math.random(), 25.5, Math.random() * 360, (25 + Math.random() * 5.5) * 0.1);
                f34(PCar.x, 0, PCar.y - 15, (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.2, 2, (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.2);
                f146();
                f113(38, 0);
                v42++;
            }
            if (v307[i].ID == 24 && v307[i].x < PCar.x + 50 && v307[i].x > PCar.x - 50 && v307[i].z - 75 < PCar.y) {
                f219(4);
                v307[i].ID = -1;
                f184(v199 * v207 / v176, v198 * v142 / v149, 10, -20);
                f48(0, 1);
                f64(1.0, 0.1);
                f47(8);
                f46(5 + 15 * Math.random(), 25.5, Math.random() * 360, (25 + Math.random() * 5.5) * 0.1);
                f34(PCar.x, 0, PCar.y - 15, (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.2, 2, (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.2);
                f146();
                v29 += 5;
            }
            if (v307[i].ID == 34 && v307[i].x < PCar.x + 50 && v307[i].x > PCar.x - 50 && v307[i].z - 35 < PCar.y) {
                f219(2);
                f219(6);
                v307[i].ID = -1;
                PCar.Tyre[0].sx = PCar.sx * 0.5;
                PCar.Tyre[1].sx = PCar.sx * 0.5;
                PCar.Tyre[0].sy = -45;
                PCar.Tyre[1].sy = -45;
                v70 = 0;
                v89 = 0;
                v188 = 10;
                PCar.Tyre[0].OnGround = 90;
                PCar.Tyre[1].OnGround = 90;
                PCar.Tyre[0].y -= 5;
                PCar.Tyre[1].y -= 5;
                PCar.sy = -50;
                PCar.sx = (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.5;
                f48(0, 5);
                f64(1.0, 0.05);
                f47(2);
                for (var j = 0; j < 10; j++) {
                    if (Math.random() > 0.5) f47(2);
                    else f47(5);
                    f46(65 + 15 * Math.random(), 3, (j * 5 + 25 + Math.random() * 5.5) * 0.1, 2 + j);
                    if (Math.random() > 0.5) {
                        f47(12)
                        f46(25 + 15 * Math.random(), 0, Math.random() * 360, (2 + j) * 0.3);
                    }
                    f34(PCar.x, (-60 + Math.random() * 120), PCar.y - 15, (PCar.Tyre[0].sx + PCar.Tyre[1].sx + (-100 + Math.random() * 100)) * 0.5, 2, (PCar.Tyre[0].sy + PCar.Tyre[1].sy - j * 20 - (-15 + Math.random() * 30)) * 0.1);
                    f146();
                }
                PCar.Tyre[0].sx *= (0.2 + v105 * 0.2);
                PCar.Tyre[1].sx *= (0.2 + v105 * 0.2);
                v189 = 0;
            }
            if (
                v307[i].ID == 28 &&
                v44 == 1 &&
                v214 == 10 &&
                PCar.Tyre[0].OnGround > 95 &&
                PCar.Tyre[1].OnGround > 95 &&
                v114 == 0 &&
                PCar.x < v307[i].x &&
                PCar.x > v307[i].x - 350
            ) {
                v44 = 0;
                v225 = 1;
                v78 = 0;
            }
            if (v307[i].ID == 28 && v307[i].x < PCar.x + 50 && v307[i].x > PCar.x - 50 && v307[i].z - 35 < PCar.y) {
                f219(1);
                v225 = 0;
                v307[i].ID = 29;
                f48(0, 5);
                f64(1.0, 0.05);
                f47(9);
                for (var j = 0; j < 6; j++) {
                    f46(25 + 15 * Math.random(), 0, (j * 5 + 25 + Math.random() * 5.5) * 0.1, 2 + j);
                    f34(PCar.x, (-60 + Math.random() * 120), PCar.y - 15, (PCar.Tyre[0].sx + PCar.Tyre[1].sx + (-100 + Math.random() * 200)) * 0.4, 2, (PCar.Tyre[0].sy + PCar.Tyre[1].sy - j * 20 - (-15 + Math.random() * 30)) * 0.2);
                    f146();
                }
                PCar.Tyre[0].sx *= (0.2 + v105 * 0.2);
                PCar.Tyre[1].sx *= (0.2 + v105 * 0.2);
                v189 = 0;
            }
        }
    }
}

function f209(Z) {
    for (var i = 0; i < v140; i++) {
        if (v291[i].z == -2000) {
            v291[i].z = Z;
            return;
        }
    }
}

function f174() {
    gl.depthMask(false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    for (var i = 0; i < v140; i++) {
        if (v291[i].z != -2000) {
            f153();
            f186(v291[i].z, -103, -148);
            f251(90, 1, 0, 0);
            f251(35, 0, 1, 0);
            f256(1.5, 0.5, 1);
            f195(v267, 0, 0, 2.0);
            f185();
            f153();
            f186(v291[i].z, 103, -148);
            f251(90, 1, 0, 0);
            f251(35, 0, 1, 0);
            f256(1.5, 0.5, 1);
            f195(v267, 0, 0, 2.0);
            f185();
            v291[i].z = -2000;
        }
    }
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(true);
}

function f4() {}

var famobi_eventCalled = false;
var famobi_showButton = false;
var v131 = 0;
var v180 = 0;
var v227 = 0.25;
var v155 = 0;
var v126 = 0;
var v125 = 50;
var v290 = 1,
    Sky_Green = 1,
    Sky_Blue = 1;
var v251 = 1,
    Cloud_Green = 1,
    Cloud_Blue = 1;
var v297 = 1,
    Obj_Green = 1,
    Obj_Blue = 1;
var v25 = 1;

function f203() {
    if (v303 != PCar.x) {
        if (v303 != -1) {
            v81 += (PCar.x - v303) * 0.01;
        }

        // live score
        newScore = Math.max(0, Math.round(v81));
        if(newScore != oldScore) {
            window.famobi_analytics.trackEvent("EVENT_LIVESCORE", {liveScore: newScore});
            console.log(newScore);
            oldScore = newScore;
        }

        if (v303 != -1 && v114 == 1) v11 += (PCar.x - v303) * 0.01;
        if (v33 < v81) v33 = v81;
        v310 -= (PCar.x - v303) * 0.9;
        if (v310 > 3000) v310 -= 3000;
        if (v310 < -3000) v310 += 3000;
        v131 += (PCar.x - v303) * 0.0001;
        for (var i = 0; i < v187; i++) {
            v311[i].x -= (PCar.x - v303) * (0.05 + i * 0.01) + (v262 + i * 0.1 * v262) * 0.01;
            var BottomValue = -600;
            if (v214 > 10 && v214 < 19) BottomValue = -2200;
            if (v214 < 10) BottomValue = -2200;
            if (v311[i].x < BottomValue) {
                v311[i].x = 1500;
            }
        }
        v303 = PCar.x;
        v180 = -550 + v131 * 100;
        v155 = -550 + (v131 - 3) * 100;
        if (v131 < 0) v131 = 0;
        if (v131 < 1) {
            v290 = 1.0;
            Sky_Green = 1.0;
            Sky_Blue = 1.0;
            v251 = 1.0;
            Cloud_Green = 1.0;
            Cloud_Blue = 1.0;
            v126 = 0;
        }
        if (v131 > 1) {
            v290 = f263(1, 2.0, v131 - 1);
            Sky_Green = f263(1, 0.9, v131 - 1);
            Sky_Blue = f263(1, 0.5, v131 - 1);
            v251 = f263(1, 1.0, v131 - 1);
            Cloud_Green = f263(1, 0.5, v131 - 1);
            Cloud_Blue = f263(1, 0.0, v131 - 1);
        }
        if (v131 > 2.5) {
            v290 = f263(v290, 0.1, v131 * 2 - 5);
            Sky_Green = f263(Sky_Green, 0.2, v131 * 2 - 5);
            Sky_Blue = f263(Sky_Blue, 0.2, v131 * 2 - 5);
            v251 = f263(v251, 0.0, v131 * 2 - 5);
            Cloud_Green = f263(Cloud_Green, 0.1, v131 * 2 - 5);
            Cloud_Blue = f263(Cloud_Blue, 0.15, v131 * 2 - 5);
            v126 = f263(0, 1.0, v131 * 2 - 5);
        }
        if (v131 > 6.0) {
            v290 = f263(v290, 2.0, v131 - 6);
            Sky_Green = f263(Sky_Green, 0.8, v131 - 6);
            Sky_Blue = f263(Sky_Blue, 1.9, v131 - 6);
            v251 = f263(v251, 1.0, v131 - 6);
            Cloud_Green = f263(Cloud_Green, 0.5, v131 - 6);
            Cloud_Blue = f263(Cloud_Blue, 1.0, v131 - 6);
            v126 = f263(1.0, 0.0, v131 - 6);
            v180 = -550 + (9.0 - v131) * 100;
        }
        if (v131 > 7.0) {
            v290 = f263(v290, 1.0, v131 - 7);
            Sky_Green = f263(Sky_Green, 1.0, v131 - 7);
            Sky_Blue = f263(Sky_Blue, 1.0, v131 - 7);
            v251 = f263(v251, 1.0, v131 - 7);
            Cloud_Green = f263(Cloud_Green, 1.0, v131 - 7);
            Cloud_Blue = f263(Cloud_Blue, 1.0, v131 - 7);
            v180 = -550 + (9.0 - v131) * 100;
            if (v131 > 10) v131 -= 10;
        }
    }
    v297 = f263(1.0, v290, 0.3);
    Obj_Green = f263(1.0, Sky_Green, 0.3);
    Obj_Blue = f263(1.0, Sky_Blue, 0.3);
    v227 = v227 * 0.99 + (v180 + 450) * 0.00025;
    if (v227 > 3) v227 = 3;
    if (v227 < 0.2) v227 = 0.2;
    f153();
    f186(PCar.x, 0, PCar.y);
    f251(v292, 1, 0, 0);
    f251(v254, 0, 1, 0);
    f186(0, 0, v41);
    FlagMatrix = v284;
    f185();
    var x = 0;
    var z = -20;
    if (v114 == 0) {
        PCar.Body_x = (x * FlagMatrix[0]) + (z * FlagMatrix[8]) + FlagMatrix[12];
        PCar.Body_y = (x * FlagMatrix[2]) + (z * FlagMatrix[10]) + FlagMatrix[14];
    }
    x = -20;
    z = -20;
    FlagX = (x * FlagMatrix[0]) + (z * FlagMatrix[8]) + FlagMatrix[12];
    FlagZ = (x * FlagMatrix[2]) + (z * FlagMatrix[10]) + FlagMatrix[14];
    x = -20;
    z = -1000;
    FlagGoalX = (x * FlagMatrix[0]) + (z * FlagMatrix[8]) + FlagMatrix[12];
    FlagGoalZ = (x * FlagMatrix[2]) + (z * FlagMatrix[10]) + FlagMatrix[14];
    x = 10;
    z = 7.8 - 20;
    v294 = (x * FlagMatrix[0]) + (z * FlagMatrix[8]) + FlagMatrix[12];
    v293 = (x * FlagMatrix[2]) + (z * FlagMatrix[10]) + FlagMatrix[14];
    v302 = f201(v294, v293, PCar.Tyre[0].x, PCar.Tyre[0].y - 2);
    x = -10;
    z = 7.8 - 20;
    v301 = (x * FlagMatrix[0]) + (z * FlagMatrix[8]) + FlagMatrix[12];
    v300 = (x * FlagMatrix[2]) + (z * FlagMatrix[10]) + FlagMatrix[14];
    v299 = f201(v301, v300, PCar.Tyre[1].x, PCar.Tyre[1].y - 2);
    v226 -= 1;
    if (v226 > 1000) v226 -= 1000;
    if (v226 < -1000) v226 += 1000;
    if (v216 != v173) {
        v216 = v173;
    }
    f50(20);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    f202(v173, v174, v175, v164, v158, v157, 0, -1, 0);
    f153();
    f186(PCar.x, PCar.y, 0);
    f193();
    f185();
    f251(-90, 1, 0, 0);
    gl.disable(gl.DEPTH_TEST);
    f183(2);
    f139(v290, Sky_Green, Sky_Blue, 1.0);
    f153();
    f186(v173, -400, 370 + v174 * 0.7);
    f251(20, 0, 0, 1);
    f196(11);
    f153();
    f251(90, 1, 0, 0);
    gl.enable(gl.BLEND);
    if (v126 > 0.01) {
        f139(1, 1, 1, v126);
        f195(43, 900, -495, -0.8);
        f195(43, 800, -444, 1.0);
        if (v155 < -280) f195(41, 970, v155, 0.5);
    }
    f139(1, 1, 1, 1.0);
    if (v180 < -280) f195(40, 870, v180, 1.0);
    gl.disable(gl.BLEND);
    f185();
    f139(v290, Sky_Green, Sky_Blue, 1.0);
    f196(25);
    gl.enable(gl.BLEND);
    f139(v251, Cloud_Green, Cloud_Blue, 1.0);
    f153();
    f251(90, 1, 0, 0);
    for (var i = 0; i < v187; i++) {
        f195(42, v311[i].x, v311[i].y + v174 * (0.02 + i * 0.005), v311[i].Size);
    }
    f185();
    f139(1, 1, 1, 1.0);
    gl.disable(gl.BLEND);
    f185();
    gl.enable(gl.DEPTH_TEST);
    f183(1);
    f176();
    f183(1);
    f254();
    f232();
    gl.disable(gl.BLEND);
    var ChunkToRemove = -1;
    f153();
    f251(-90, 1, 0, 0);
    for (var i = 0; i < v269; i++) {
        if (v168[i].ObjID != -1) {
            f183(2);
            f139(v297, Obj_Green, Obj_Blue, 1);
            f153();
            f186(v168[i].PosX, -0.5, 0);
            f196(v168[i].ObjID);
            f183(5);
            f139(0.7 * v290, 0.6 * Sky_Green, 0.3 * Sky_Blue, v227);
            f77(v168[i].ObjID);
            f185();
            if (v168[i].PosX < PCar.x - 400 - OBJ[v168[i].ObjID].Max_X) {
                ChunkToRemove = i;
            }
        }
    }
    var MetersPosX = PCar.x + (v125 - v81) * 100;
    if (v81 > v125 + 20) {
        v125 += 50;
        v25 = 1;
    }
    if (v81 > v125 && v25 == 1) {
        f219(9);
        v25 = 0;
    }
    f183(2);
    f139(v297, Obj_Green, Obj_Blue, 1);
    f153();
    f186(MetersPosX, -0.5, 0);
    f196(27);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    f153();
    f227(v234);
    f186(0, 165, -265);
    f251(-25, 0, 1, 0);
    f256(0.6, -0.8, 1);
    f139(0, 0, 0, 1);
    f144(v125 + "m");
    f185();
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    f183(5);
    f139(0.7 * v290, 0.6 * Sky_Green, 0.3 * Sky_Blue, 1.0);
    f77(27);
    f185();
    f185();
    f183(2);
    gl.depthMask(false);
    gl.enable(gl.BLEND);
    for (var i = 0; i < PCar.TyreCount; i++) {
        if ((PCar.Tyre[i].GroundY - PCar.Tyre[i].y - 10) < 20) {
            var Alpha = 1.0 - (PCar.Tyre[i].GroundY - PCar.Tyre[i].y - 10) / 20;
            f139(1.0, 1.0, 1.0, Alpha);
            f153();
            f186(PCar.Tyre[i].x, 3, PCar.Tyre[i].GroundY - 2);
            f251(90, 0, 0, 1);
            var GroundAngle = f201(0, 0, PCar.Tyre[i].GroundNormal_X, PCar.Tyre[i].GroundNormal_Y) - 90;
            f251(GroundAngle, 1, 0, 0);
            f86(3, -31, -5 - 10 * Alpha, 31, 5 + 10 * Alpha);
            f185();
        }
    }
    f139(1.0, 1.0, 1.0, 1);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    f183(1);
    f183(2);
    f139(v290, Sky_Green, Sky_Blue, 1.0);
    f153();
    f186(v226, 700 + f240(v249 * 2) * 60, 1);
    f251(-90, 1, 0, 0);
    f256(1, 1, 1.2);
    f196(10);
    f185();
    f139(1, 1, 1, 1);
    gl.enable(gl.BLEND);
    f174();
    f125();
    if (v189 > 0) {
        f183(2);
        gl.depthMask(false);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        for (var i = 0; i < PCar.TyreCount; i++) {
            var Scale = PCar.Tyre[i].radius * 0.008;
            f153();
            f186(PCar.Tyre[i].x, -21, PCar.Tyre[i].y);
            f251(90, 1, 0, 0);
            f139(1, f240(v249 * 105 + i * 5) * 0.5 + 0.8, f240(v249 * 195 + i * 9) * 0.5 + 0.8, v189);
            f195(3, -35, 0, 0.4);
            f186(0, 0, -42);
            f139(1, f240(v249 * 103 + i * 6) * 0.5 + 0.8, f240(v249 * 196 + i * 7) * 0.5 + 0.8, v189);
            f195(3, -35, 0, 0.4);
            f185();
        }
        v189 -= v262 * 0.005;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthMask(true);
    }
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    f183(1);
    f139(1, 1, 1, 1);
    if (ChunkToRemove != -1) f182(ChunkToRemove);
}
var v238 = 10;
var v323 = new Array();

function f170() {
    this.x;
    this.y;
    this.sx = 0;
    this.sy = 0;
    this.Exist = 0;
    this.R;
}

function f157() {
    for (var i = 0; i < v238 + 1; i++) {
        v323.push;
        v323[i] = new f170();
    }
}

function f184(x, y, sx, sy) {
    for (var i = 0; i < v238 + 1; i++) {
        if (v323[i].Exist == 0) {
            v323[i].Exist = 1;
            v323[i].x = x;
            v323[i].y = y;
            v323[i].sx = sx;
            v323[i].sy = sy;
            v323[i].R = Math.random() * 360;
            return;
        }
    }
    v171 += 5;
    v36 += 5;
}

function f159() {
    f166();
    f183(2);
    f139(1, 1, 1, 1);
    for (var i = 0; i < v238; i++) {
        if (v323[i].Exist == 1) {
            f153();
            f186(v323[i].x, v323[i].y, 0);
            f251(v323[i].R, 0, 0, 1);
            f195(2, 0, 0, 0.6);
            f185();
            v323[i].x += v323[i].sx * v262 * 0.01;
            v323[i].y += v323[i].sy * v262 * 0.01;
            v323[i].R += Math.abs(v323[i].sx + v323[i].sy) * v262 * 0.01;
            if (v323[i].x > 50) v323[i].sx -= v262 * 0.05;
            if (v323[i].y < v142 - 50) v323[i].sy += v262 * 0.05;
            if (v323[i].y > v142 - 50) {
                v323[i].y = v142 - 50;
                v323[i].sy = -Math.abs(v323[i].sy) * 0.25;
            }
            if (v323[i].x < 50) {
                v323[i].x = 50;
                v323[i].sx = Math.abs(v323[i].sx) * 0.25;
            }
            if (v323[i].x < 55 && v323[i].y > v142 - 55) {
                v323[i].Exist = 0;
                v171 += 5;
                v36 += 5;
                f219(4);
            }
        }
    }
}
var v123 = 5;
var v317 = new Array();

function f115() {
    this.TextID;
    this.Coins;
    this.y;
    this.Timer;
    this.Position;
}

function f81() {
    for (var i = 0; i < v123 + 1; i++) {
        v317.push;
        v317[i] = new f115();
        v317[i].Timer = -1;
    }
}

function f113(TextID, Coins) {
    for (var i = 0; i < v123 + 1; i++) {
        if (v317[i].Timer == -1) {
            f219(12);
            v317[i].TextID = TextID;
            v317[i].Coins = Coins;
            v317[i].Timer = 100;
            if (TextID == 104) v317[i].Timer = 300;
            v317[i].y = 190;
            return;
        }
    }
    v171 += Coins;
    v36 += Coins;
}

function f101() {
    for (var i = 0; i < v123; i++) v317[i].Position = v123;
    for (var i = 0; i < v123; i++)
        for (var j = 0; j < v123; j++) {
            if (i != j && v317[i].Timer >= v317[j].Timer && v317[i].Timer > -1 && v317[j].Timer > -1) v317[i].Position--;
        }
    f166();
    f183(2);
    f139(0, 0, 0, 1);
    f227(v234);
    if (v194 > 0)
        f186(v207 * 0.5, v142 - 287, 0);
    else
        f186(v207 * 0.5, v142 - 190, 0);
    f256(0.7, 0.8, 1);
    var CurrentPos = 0;
    var MoneyX;
    var MoneyY;
    for (var j = 0; j < v123 + 1; j++)
        for (var i = 0; i < v123; i++) {
            if (v317[i].Position == j && v317[i].Timer > -1) {
                var InfoText = v287[v317[i].TextID];
                if (v317[i].Coins > 0) {
                    InfoText = InfoText + " " + v317[i].Coins + "¶";
                }
                f153();
                f186(0, v317[i].y, 0);
                f139(0, 0, 0, 1);
                if (v131 > 2.8 && v131 < 6) f139(2, 2, 2, 1);
                if (v317[i].Coins > 15 && f240(v249 * 30) > 0) f139(3.0, 3.0, 0.5, 1);
                if (v317[i].TextID == 104 && f240(v249 * 50) > 0) f139(8.0, 8.0, 8.0, 1);
                if (v317[i].TextID == 104 && f240(v249 * 50) < 0) f139(0.0, 0.5, 0.0, 1);
                var Dist = f144(InfoText);
                f139(1, 1, 1, 1);
                if (v317[i].Coins > 0) f195(1, -Dist + 30, 56, 0.6);
                f185();
                v317[i].y = v317[i].y * 0.8 + (-CurrentPos * 70) * 0.2;
                v317[i].Timer -= v262 * 0.05;
                if (v317[i].Timer < 0) {
                    v317[i].Timer = -1;
                    var MoneyX = v207 * 0.5 + (-Dist + 30) * 0.7;
                    var MoneyY = v142 - 180 + v317[i].y * 0.8 + 35;
                    for (j = 0; j < v317[i].Coins; j += 5) {
                        f184(MoneyX + j * 3, MoneyY + j * 3, 10 + (i + j) * 0.5, -48 + (i + j) * 2.5);
                    }
                }
                CurrentPos++;
            }
        }
}

function f60(x, y, id) {
    var Amount = 0;
    if (id == 0) Amount = v156;
    if (id == 1) Amount = v191;
    if (id == 2) Amount = v190;
    if (id == 3) Amount = v244;
    if (id == 4) Amount = v105;
    f195(12, x, y, 0.29);
    f195(f83(Amount), x - 1, y + 15, 0.29);
    f195(18 + id, x, y - 8, 0.29);
    y += 14;
    if (f225(Amount, id) == 1)
        f195(63, x, y, 0.25);
    else
    if (f207(Amount, id) == 1)
        f195(62, x, y, 0.25 + f240(v249 * 25) * 0.005);
}

function f11(x, y, Size, TextID) {
    f139(0.5, 0.5, 0.5, 0.5);
    Size *= 0.5;
    f111(32, x - Size, y, x - Size + 27, y + 91);
    f111(33, x - Size + 27, y, x + Size - 27, y + 91);
    f111(32, x + Size, y, x + Size - 27, y + 91);
    f139(1.0, 1.0, 1.0, 0.25);
    f153();
    f227(v234);
    f186(x, y + 8, 0);
    f256(0.65, 0.7, 1);
    f144(v287[TextID]);
    f185();
    return 0;
}

// pause buttons
function f87(x, y, Size, TextID) {
    f139(1, 1, 1, 1);
    Size *= 0.5;
    f111(32, x - Size, y, x - Size + 27, y + 91);
    f111(33, x - Size + 27, y, x + Size - 27, y + 91);
    f111(32, x + Size, y, x + Size - 27, y + 91);
    f153();
    f227(v234);
    f186(x, y + 13, 0);
    f256(0.65, 0.7, 1);
    f139(0, 0, 0, 1);
    f144(v287[TextID]);
    f139(1, 1, 1, 1);
    f186(0, -8, 0);
    f144(v287[TextID]);
    f185();
    if (f137(x - Size - 5, y - 5, x + Size + 5, y + 91 + 5) == 1) return 1;
    return 0;
}

function f169(xa, ya, xb, yb, TextID) {
    var BorderScale = 1.0;
    f139(1, 1, 1, 1);
    f111(23, xa, ya, xa + 84 * BorderScale, ya + 117 * BorderScale);
    f111(24, xa + 84 * BorderScale, ya, xb - 84 * BorderScale, ya + 117 * BorderScale);
    f111(25, xb - 84 * BorderScale, ya, xb, ya + 117 * BorderScale);
    f111(26, xa, ya + 117 * BorderScale, xa + 84 * BorderScale, yb - 71 * BorderScale);
    f111(27, xa + 84 * BorderScale, ya + 117 * BorderScale, xb - 84 * BorderScale, yb - 71 * BorderScale);
    f111(28, xb - 84 * BorderScale, ya + 117 * BorderScale, xb, yb - 71 * BorderScale);
    f111(29, xa, yb - 71 * BorderScale, xa + 84 * BorderScale, yb);
    f111(30, xa + 84 * BorderScale, yb - 71 * BorderScale, xb - 84 * BorderScale, yb);
    f111(31, xb - 84 * BorderScale, yb - 71 * BorderScale, xb, yb);
    if (v184 > 0.99) v184 = 1.0;
    if (v184 < 0.8) return;
    if (TextID != -1) {
        f153();
        f227(v234);
        f186((xa + xb) * 0.5, ya + 28, 0);
        f256(0.65, 0.7, 1);
        f144(v287[TextID]);
        f185();
    }
}
var v184 = 0;
var v102 = 0;
var v121 = 0;

function f54() {
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    v121 += v262 * 0.1;
    if (v121 > 100) {
        v102++;
        v121 = 0;
        v75 = 20000 - v33;
        if (v102 == 0) f220(0);
        if (v102 == 1)
            for (i = 0; i < Math.abs(Math.round(v81 * 0.1)); i += 5)
                f184(v207 * 0.5 + 200, 190, 10 + (i) * 0.5, -48 + (i) * 2.5);
        /*
        if (v102==3)
        for (i=0;i<Math.abs(Math.round(v24*0.01));i+=5)
        f184(v207*0.5+200,300,10+(i)*0.5,-48+(i)*2.5);
        */
        if (v102 == 2) {
            v24 += v81;
            f43();
        }
    }
    var WindowTitle = 6;
    if (v114 == 1) WindowTitle = 106;
    f169(v207 * 0.5 - 250 * v184, v184, v207 * 0.5 + 250 * v184, 700 * v184, WindowTitle);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.95) return;

    if (v102 > 2) {

        if(!famobi_eventCalled) {
            famobi_eventCalled = true;

            Promise.all([
                window.famobi_analytics.trackEvent("EVENT_LEVELFAIL", {levelName: "", reason: "dead"}),
                window.famobi_analytics.trackEvent("EVENT_TOTALSCORE", {totalScore: Math.round(v81)})
            ]).then(
                function() {
                    famobi_showButton = true;
                }
            );
        }

        if (famobi_showButton && f87(v207 * 0.5, 565, 398, 9) == 1) {
            f130();
            v28 = 1;
            v102 = 0;
            v121 = 0;
            v184 = 0;
            v214 = 1;
        }
        /*
        f153();
        f186 (v207*0.5,588,0);
        f139(1,1,1,1);
        if (v215==1 && v312>508 && v312<666 && v313>v207*0.5-256 && v313<v207*0.5-85)
        {f130();v28=-1;v102=0; v121=0; v184=0;v214=1;}
        if (v215==1 && v312>508 && v312<666 && v313>v207*0.5-85 && v313<v207*0.5+85)
        {f130();v28=1;v102=0; v121=0; v184=0;v214=1;}
        if (v215==1 && v312>508 && v312<666 && v313<v207*0.5+256 && v313>v207*0.5+85)
        {f130();v28=2;v102=0; v121=0; v184=0;v214=1;}
        f256(0.95,0.57,1);
        f165(13);
        f185();
        */
    } else {
        famobi_eventCalled = false;
        famobi_showButton = false;
    }

    f153();
    f227(v281); //
    f186(v207 * 0.5 - 190, 112, 0);
    f153();
    f256(0.5, 0.5, 1);
    f139(0, 0, 0, 0.8);
    f144(v287[13]); //
    f256(1.6, 1.6, 1);
    f186(0, 41, 0);
    f139(2, 2, 2, 0.8);
    f144(Math.abs(Math.round(v81)) + "m");
    if (v102 > 0) {
        f227(FontRight);
        f186(473, 0, 0);
        f144(Math.abs(Math.round(v81 * 0.1)) + "¶");
        f139(1, 1, 1, 1);
        f195(1, 35, 58, 0.6);
        f227(v281);
    }
    f185();
    /*
    f186 (0,111,0);
    f153();
    f256(0.5,0.5,1);
    f139(0,0,0,0.8);
    f144(v287[14]);
    f256(1.6,1.6,1);
    f186 (0,41,0);
    f139(2,2,2,0.8);
    f144(Math.abs(Math.round(v24))+"m");
    if (v102>2)
    {
    f227 (FontRight);
    f186 (473,0,0);
    f144(Math.abs(Math.round(v24*0.01))+"¶");
    f139(1,1,1,1); f195 (1 ,35,58,0.6);
    f227 (v281);
    }
    f185();
    */
    f153();
    f186(0, 111, 0);
    f256(0.5, 0.5, 1);
    f139(0, 0, 0, 0.8);
    if(window.famobi.hasFeature("leaderboard")) {
        f144(v287[107]);
        f185();
        for (var i = 0; i < 3; i++) {
        f148(i, -12, 183 + i * 43, 1.0);
    }
        f148(-1, -12, 183 + 3.9 * 43, 1.0);
        f185();
    }
}

function f82() {
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    f169(v207 * 0.5 - 200 * v184, 100 * v184, v207 * 0.5 + 200 * v184, 460 * v184, 10);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.8) return;
    if (f87(v207 * 0.5, 212, 307, 11) == 1) {
        window.famobi_analytics.trackScreen("SCREEN_LEVEL");
        v184 = 0;
        v214 = 10;
    }
    if (f87(v207 * 0.5, 316, 307, 12) == 1) {
        window.famobi_analytics.trackEvent("EVENT_LEVELFAIL", {levelName: "", reason: "quit"}).then(function() {
            f99();
            f130();
            v28 = 0;
            v184 = 0;
            v214 = 1;
        });
    }
}
var v120 = -1;

function f83(Val) {
    if (Val > 4) return 58 + Val - 5;
    return Val + 13;
}

function f225(Val, ItemID) {
    if (Val > 3 && ItemID != 1) return 1;
    if (Val > 7 && ItemID == 1) return 1;
    return 0;
}

function f155(Amount, ItemID) {
    if (ItemID == 0) return v196[Amount];
    if (ItemID == 1) return v83[Amount];
    if (ItemID == 2) return v195[Amount];
    if (ItemID == 3) return v107[Amount];
    if (ItemID == 4) return v143[Amount];
    return 1000000;
}

function f207(Amount, ItemID) {
    if (v171 < f155(Amount, ItemID)) return 0;
    return 1;
}

function f123() {
    var Amount = 0;
    if (v54 == 0) Amount = v156;
    if (v54 == 1) Amount = v191;
    if (v54 == 2) Amount = v190;
    if (v54 == 3) Amount = v244;
    if (v54 == 4) Amount = v105;
    if (Amount > 4 && v54 != 1) Amount = 4;
    if (Amount > 8 && v54 == 1) Amount = 8;
    var Price = f155(Amount, v54);
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    f169(v207 * 0.5 - 300 * v184, 100 * v184, v207 * 0.5 + 300 * v184, 499 * v184, 15);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.99) return;
    f153();
    f186(v207 * 0.5 - 179, 264, 0);
    var SpriteAmount = Amount;
    f195(f83(Amount), -1, 68, 1.0);
    f195(18 + v54, 0, -8, 1.0);
    f185();
    f153();
    f227(v281);
    f186(v207 * 0.5 - 90, 220, 0);
    f256(0.55, 0.6, 1);
    if (v146 != "en") f256(0.8, 0.9, 1);
    f139(0, 0, 0, 0.8);
    f144(v287[16 + v54]);
    f185();
    f153();
    f227(v281);
    f186(v207 * 0.5 - 90, 270, 0);
    f256(0.4, 0.4, 1);
    if (v146 != "en") f256(0.8, 0.9, 1)
    f139(2, 2, 2, 0.8);
    f144(v287[21 + v54]);
    f139(0, 0, 0, 0.5);
    f186(0, 95, 0);
    f144(v287[26 + v54]);
    f185();
    var CurrentTimeInSeconds = new Date().getTime() / 1000;
    if (f225(Amount, v54) == 0 && Price > v171 && CurrentTimeInSeconds < v120 + 60) {
        f11(v207 * 0.5 + 106, 367, 300, 33);
        var TimerString = Math.floor((v120 + 61 - CurrentTimeInSeconds)) + "";
        f153();
        f227(v234);
        f186(v207 * 0.5 + 106, 370, 0);
        f256(0.8, 0.8, 1);
        f139(2, 2, 2, 1.0);
        f144(TimerString);
        f185();
    }
    if (f225(Amount, v54) == 0 && Price > v171 && CurrentTimeInSeconds > v120 + 60)
        if (f87(v207 * 0.5 + 106, 367, 300, 33) == 1) {
            v120 = CurrentTimeInSeconds;
            v215 = -1;
            v313 = -1;
            v312 = -1;
            window.famobi.rewardedAd(function(response) {
                if (response && response.rewardGranted) {
                    for (var i = 0; i < 30; i++) {
                        f184(v207 * 0.5 + 106, 367, Math.random() * 10 - 5, -5 - i * 3);
                    }
                }
            });
            return;
        }
    if (f225(Amount, v54) == 0 && Price <= v171)
        if (f87(v207 * 0.5 + 133, 367, 250, 31) == 1) {
            PCar.Tyre[0].sy += -5;
            PCar.Tyre[1].sy += -6;
            PCar.Tyre[0].sx = (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.5;
            PCar.Tyre[0].sy = (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.5;
            PCar.Tyre[1].OnGround = 95;
            PCar.Tyre[0].OnGround = 95;
            PCar.Tyre[0].Sup_x = PCar.Tyre[0].x;
            PCar.Tyre[0].Sup_y = PCar.Tyre[0].y;
            PCar.Tyre[1].Sup_x = PCar.Tyre[1].x;
            PCar.Tyre[1].Sup_y = PCar.Tyre[1].y;
            PCar.Tyre[0].Sup_sx = 0;
            PCar.Tyre[1].Sup_sx = 0;
            PCar.Tyre[0].Sup_sy = 25;
            PCar.Tyre[1].Sup_sy = -25;
            v41 = 1;
            v171 -= Price;
            v184 = 0;
            v214 = 5;
            f219(14);
            if (v54 == 0) v156++;
            if (v54 == 1) v191++;
            if (v54 == 2) v190++;
            if (v54 == 3) v244++;
            if (v54 == 4) v105++;
            f130();
            if (v54 == 0) Stanislic_SendInfo("Upgrade, Engine LVL" + v156);
            if (v54 == 1) Stanislic_SendInfo("Upgrade, Bodyshell LVL" + v191);
            if (v54 == 2) Stanislic_SendInfo("Upgrade, Wheels LVL" + v190);
            if (v54 == 3) Stanislic_SendInfo("Upgrade, Bullbar LVL" + v244);
            if (v54 == 4) Stanislic_SendInfo("Upgrade, Tank LVL" + v105);
        }
    f139(1, 1, 1, 1.0)
    if (f240(v249 * 10) > 0) f139(1.5, 1.5, 0, 1);
    if (f136(v207 * 0.5 + 256 - 50, 80, v207 * 0.5 + 256 + 50, 190) == 1) {
        v184 = 0;
        v214 = 5;
    }
    f139(1, 1, 1, 1);
    f195(34, v207 * 0.5 + 256, 138, 0.9);
    if (f225(Amount, v54) == 0) {
        f195(1, v207 * 0.5 - 261, 400, 0.7);
        f153();
        f227(v281);
        f186(v207 * 0.5 - 253, 366, 0);
        f256(0.8, 0.9, 1);
        f139(0, 0, 0, 0.6);
        f144("¶" + Price + "");
        f186(0, -4, 0);
        f139(1, 1, 1, 1.0);
        if (Price > v171) f139(1, 0, 0, 1.0);
        f144("¶" + Price + "");
        f185();
    }
    f139(1, 1, 1, 1.0);
    if (f225(Amount, v54) == 1) {
        f227(v234);
        f186(v207 * 0.5, 366, 0);
        f256(0.6, 0.7, 1);
        f139(0, 0, 0, 1.0);
        f144(v287[32]);
        f185();
        f139(1, 1, 1, 1.0);
    }
}
var v247 = 0;

function f85() {
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    f169(v207 * 0.5 - 200 * v184, v184, v207 * 0.5 + 200 * v184, 700 * v184, 110);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.99) return;
    f139(1, 1, 1, 1);
    f183(1);
    if (v312 > 195 && v312 < 315 && v313 > v207 * 0.5 - 100 && v313 < v207 * 0.5 + 100 && v178 == 1)
        v265 = (window.famobi.hasFeature("standalone") || window.famobi.config.aid == "A-O7SKJ") ? "" : "http://famobi.com";
    else v265 = "";
    f183(2);
    if (f87(v207 * 0.5, 566, 300, 119) == 1) {
        v247 = 0;
    }
    var LineDistance = 71;
    f186(v207 * 0.5, 140, 0);
    f153();
    f227(v234);
    f256(0.3, 0.35, 1);
    f139(2, 2, 2, 1.0);
    f144(v287[111]);
    f186(0, 78, 0);
    f256(0.8, 0.8, 1);
    f139(0, 0, 0, 0.5);
    f144(window.famobi.__("Exclusively published by"));
    f153();
    f139(0.0, 0.0, 0.0, 1.0);
    f186(0, 307, 0);
    f256(3, 3, 1.0);
    f30("datas/textures/famobi.png", 10);
    f139(1.0, 1.0, 1.0, 1.0);
    f185();
    f185();
    f186(0, 111, 0);
    f186(0, LineDistance, 0);
    f153();
    f227(v234);
    f256(0.3, 0.35, 1);
    f139(2, 2, 2, 1.0);
    f144(v287[113]);
    f186(0, 78, 0);
    f256(0.8, 0.8, 1);
    f139(0, 0, 0, 0.5);
    f144(v287[114]);
    f185();
    f186(0, LineDistance, 0);
    f153();
    f227(v234);
    f256(0.3, 0.35, 1);
    f139(2, 2, 2, 1.0);
    f144(v287[115]);
    f186(0, 78, 0);
    f256(0.8, 0.8, 1);
    f139(0, 0, 0, 0.5);
    f144(v287[116]);
    f185();
    f186(0, LineDistance, 0);
    f153();
    f227(v234);
    f256(0.3, 0.35, 1);
    f139(2, 2, 2, 1.0);
    f144(v287[117]);
    f186(0, 78, 0);
    f256(0.8, 0.8, 1);
    f139(0, 0, 0, 0.5);
    f144(v287[118]);
    f185();
}

function f62() {
    if (v247 == 1) {
        f85();
        return;
    }
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    f169(v207 * 0.5 - 200 * v184, v184, v207 * 0.5 + 200 * v184, 600 * v184, 34);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.99) return;
    f139(1, 1, 1, 1.0)
    if (f240(v249 * 10) > 0) f139(1.5, 1.5, 0, 1);
    if (f136(v207 * 0.5 + 169 - 50, 0, v207 * 0.5 + 169 + 50, 100) == 1) {
        v247 = 0;
        v184 = 0;
        v214 = 5;
        f130();
        v75 = 20000 - v33;
        f163(0, 0, 0);
    }
    f195(34, v207 * 0.5 + 169, 48, 0.9);
    f139(1, 1, 1, 1);
    f139(0, 0, 0, 0.8);
    f153();
    f227(v281);
    f186(v207 * 0.5 - 44, 195, 0);
    f256(0.4, 0.4, 1);
    f144(v287[36]);
    f185();
    f139(1, 1, 1, 1);
    if (f65(35 + Pref_User_Sound, v207 * 0.5 - 102, 214, 0.6) == 1) {
        Pref_User_Sound = window.famobi_paused ? 0 : 1 - Pref_User_Sound; // famobi
        f219(5);
        if (Pref_User_Sound == 0) Stanislic_SendInfo("Sound Switch OFF");
        if (Pref_User_Sound == 1) Stanislic_SendInfo("Sound Switch ON");
    }
    f139(0, 0, 0, 0.8);
    f153();
    f227(v281);
    f186(v207 * 0.5 - 44, 295, 0);
    f256(0.4, 0.4, 1);
    f144(v287[35]);
    f185();
    f139(1, 1, 1, 1);
    if (f65(35 + v61, v207 * 0.5 - 102, 314, 0.6) == 1) {
        v61 = 1 - v61;
        if (v61 == 0 || window.famobi_paused) f99(); // famobi
        if (v61 == 1 && !window.famobi_paused) f100(-1); // famobi
        f219(5);
        if (v61 == 0) Stanislic_SendInfo("Music Switch OFF");
        if (v61 == 1) Stanislic_SendInfo("Music Switch ON");
    }
    if (window.famobi.hasFeature("credits") && f87(v207 * 0.5, 463, 300, 37) == 1) {
        v184 = 0;
        v247 = 1;
    }
}

function f126() {
    f166();
    f183(2);
    f139(1, 1, 1, 1.0);
    f86(7, 0, 0, v207, v142);
    f169(v207 * 0.5 - 300 * v184, v184, v207 * 0.5 + 300 * v184, 635 * v184, 108);
    v184 = v184 * 0.8 + 0.2;
    if (v184 < 0.99) return;
    f139(1, 1, 1, 1.0)
    if (f240(v249 * 10) > 0) f139(1.5, 1.5, 0, 1);
    f195(34, v207 * 0.5 + 269, 48, 0.9);
    f139(1, 1, 1, 1);
    f227(v281);
    f153();
    f186(v207 * 0.5 - 251, 113, 0);
    f256(0.5, 0.5, 1);
    f139(0, 0, 0, 0.8);
    f144(v287[109]);
    f185();
    v97 = f108(0, v97, v207 * 0.5 + 1, 163, -1);
    var StartPos = v207 * 0.5 - 211;
    var EndPos = v207 * 0.5 + 210;
    var IconPosX = StartPos;
    var IconPosY = 296;
    f153();
    if (v45 > 0 && v45 < 25) {} else v45 = 1;
    var Sizzzz = 44;
    for (var i = 1; i < 25; i++) {
        if (i == v45) {
            f183(3);
            f139(1.0, 1.0, 0.0, 1.0);
            f129(IconPosX - Sizzzz, IconPosY - Sizzzz,
                IconPosX + Sizzzz, IconPosY + Sizzzz);
        }
        if (v215 == 1 && v313 > IconPosX - Sizzzz && v313 < IconPosX + Sizzzz && v312 > IconPosY - Sizzzz && v312 < IconPosY + Sizzzz) {
            v215 = -1;
            v45 = i;
        }
        f183(1);
        f153();
        f139(1.0, 1.0, 1.0, 1.0);
        f186(IconPosX, IconPosY, 0);
        f256(0.6, 0.6, 1.0);
        f30("datas/textures/avatars/" + i + ".jpg", 10);
        f139(1.0, 1.0, 1.0, 1.0);
        f185();
        IconPosX += 84;
        if (IconPosX > EndPos) {
            IconPosX = StartPos;
            IconPosY += 83;
        }
    }
    f153();
    f183(2);
    if (f136(v207 * 0.5 + 269 - 50, 0, v207 * 0.5 + 269 + 50, 100) == 1) {
        v201 = -5000;
        TextField_y = -5000;
        v247 = 0;
        v184 = 0;
        v214 = 5;
        f130();
        if (v61 == 1) Stanislic_SendInfo("User Name Edited");
    }
}
var v54 = 0;

function f88() {
    f183(2);
    gl.depthMask(false);
    f153();
    f186(358, 56, -500 + 294);
    f139(1, 1, 1, 1);
    f251(90, 1, 0, 0);
    f227(v234);
    f256(0.35, 0.4, 1);
    f139(0, 0, 0, 0.75);
    f144(v287[9]);
    f186(0, -3, 0);
    f139(2, 2, 2, 0.75);
    f144(v287[9]);
    f185();
    f153();
    f186(362, -38, -500 + 282);
    f139(1, 1, 1, 1);
    f251(90, 1, 0, 0);
    f60(-65, 90, 0);
    f60(0, 90, 1);
    f60(65, 90, 2);
    f60(-65, 141, 3);
    f60(65, 141, 4);
    f185();
    gl.depthMask(true);
    if (v115 == 1) {
        if (f137(v207 * 0.5 - 270, 190, v207 * 0.5 - 80, 343) == 1) {
            v214 = 13;
            v54 = 0;
        }
        if (f137(v207 * 0.5 - 80, 190, v207 * 0.5 + 80, 343) == 1) {
            v214 = 13;
            v54 = 1;
        }
        if (f137(v207 * 0.5 + 80, 190, v207 * 0.5 + 270, 343) == 1) {
            v214 = 13;
            v54 = 2;
        }
        if (f137(v207 * 0.5 - 270, 343, v207 * 0.5 - 80, 490) == 1) {
            v214 = 13;
            v54 = 3;
        }
        if (f137(v207 * 0.5 + 80, 343, v207 * 0.5 + 270, 490) == 1) {
            v214 = 13;
            v54 = 4;
        }
    }
}

function f148(ID, x, y, s) {

    if((window.famobi.hasFeature("standalone") || !window.famobi.hasFeature("leaderboard")) && ID >= 0) return false;

    v75 = 20000 - v33;
    f220(0);
    if (v71 > 0) {
        v270 = "";
        for (var i = 0; i < 20; i++) {
            if (i < 20) {
                v270 += f132(i, 0) + ";" + f98(i, 0) + ";123;" + (20000 - f104(i, 0)) + ",";
            }
        }
        v71 = 0;
    }
    var Score_Avatar = "1";
    var Score_Name = "";
    var Score_Score = 0;
    var PlayerPosition = ID + 1;
    if (ID > -1) {
        var OnScoreSplit = v270.split(",");
        if (typeof OnScoreSplit !== "undefined") {
            var ScoreCount = OnScoreSplit.length;
            if (typeof OnScoreSplit[ID] !== "undefined") {
                var LineScoreSplit = OnScoreSplit[ID].split(";");
                var LineScoreCount = LineScoreSplit.length;
                Score_Name = LineScoreSplit[0];
                Score_Avatar = LineScoreSplit[1];
                Score_Score = LineScoreSplit[3];
            }
        }
    } else {
        Score_Name = v97 + "";
        Score_Avatar = v45 + "";
        Score_Score = Math.floor(v33) + "";
        PlayerPosition = ScoresTable[0].PlayerRank;
    }
    if (Score_Score < 1 || Score_Score > 19999) return;
    f139(1.0, 1.0, 1.0, 1.0);
    f153();
    f186(x, y, 0);
    f256(s, s, 1);
    f153();
    f186(34, 0, 0);
    f256(0.30, 0.30, 1);
    f30("datas/textures/avatars/" + Score_Avatar + ".jpg", 10);
    f185();
    f195(44, 0, 0, 0.5);
    f153();
    f186(-1, -15, 0);
    f256(0.30, 0.3, 1);
    f227(v234);
    f186(0, 0, -1);
    if (PlayerPosition > 99) f256(0.70, 1.0, 1);
    if (PlayerPosition > 999) f256(0.90, 1.0, 1);
    f139(3, 3, 3, 0.8);
    f144(PlayerPosition + "");
    f186(-3, -3, -1);
    f139(0, 0, 0, 1.0);
    f144(PlayerPosition + "");
    f185();
    f139(1.8, 144 / 256, 47 / 256, 1.0);
    if (v214 > 10) f139(0, 0, 0, 0.5);
    f153();
    f186(56, -25, 0);
    f256(0.4, 0.5, 1);
    f227(v281);
    f144(Score_Name);
    f185();
    f139(1.5, 1.5, 1.5, 1.0);
    f153();
    f186(326, -25, 0);
    if (v214 == 12) f186(77, 0, 0);
    f256(0.4, 0.5, 1);
    f227(FontRight);
    f144(Score_Score + "m");
    f185();
    f185();
    v100++;
}
var v64 = 0;
var v100 = 0;

function f124() {
    v64 -= v262 * 0.01;
    if (v178 == 1 && v313 > v207 * 0.5 - 350 && v313 < v207 * 0.5 + 350) {
        v64 -= v262 * 0.1;
        if (v215 == 1) Stanislic_SendInfo("High scores Scroll");
    }
    f183(2);
    gl.depthMask(false);
    f153();
    f186(-481, 56, -500 + 218);
    f139(1, 1, 1, 1);
    f251(90, 1, 0, 0);
    f227(v234);
    f256(0.30, 0.4, 1);
    f139(0, 0, 0, 0.75);
    f144(v287[105]);
    f186(0, -3, 0);
    f139(2, 2, 2, 0.75);
    f144(v287[105]);
    f185();
    f153();
    f186(-479 - 99, -28, -500 + 282);
    f139(1, 1, 1, 1);
    f251(90, 1, 0, 0);
    gl.enable(gl.DEPTH_TEST);
    v100 = 0;

    if(!window.famobi.hasFeature("standalone") && window.famobi.hasFeature("leaderboard")) {
        for (var i = -1; i < 20; i++) {
            var Posy = (i * 25.5) + v64 + 110;
            if (i == -1) Posy -= 15;
            if (Posy > -56 && Posy < 240) {
                f148(i, 0, Posy, 0.6);
            }
        }
    } else {
        i = -1;
        f148(i, 0, (i * 25.5) + 50, 0.6);
    }


    if (v100 == 0) v64 = 111;
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    /*
    f60 (-65,90,0);
    f60 ( 0,90,1);
    f60 ( 65,90,2);
    f60 (-65,141,3);
    f60 ( 65,141,4);
    */
    f185();
}

function f263(a, b, f) {
    if (f <= 0) return a;
    if (f >= 1) return b;
    return b * f + a * (1 - f);
}
var v53 = 0;
var v115 = 0;
var v228 = 0;
var v99 = 0;

function f134() {
    v171 = parseInt(f246("pl_Coins"));
    if (v171 == null || isNaN(v171)) v171 = 200;
    v33 = parseInt(f246("pl_BestDist"));
    if (v33 == null || isNaN(v33)) v33 = 0;
    v24 = parseInt(f246("pl_TotalDist"));
    if (v24 == null || isNaN(v24)) v24 = 0;
    v156 = parseInt(f246("pl_Engine"));
    if (v156 == null || isNaN(v156)) v156 = 0;
    v191 = parseInt(f246("pl_Shell"));
    if (v191 == null || isNaN(v191)) v191 = 0;
    v190 = parseInt(f246("pl_Wheel"));
    if (v190 == null || isNaN(v190)) v190 = 0;
    v244 = parseInt(f246("pl_Tank"));
    if (v244 == null || isNaN(v244)) v244 = 0;
    v105 = parseInt(f246("pl_BullBar"));
    if (v105 == null || isNaN(v105)) v105 = 0;
    v74 = parseInt(f246("pl_Missions"));
    if (v74 == null || isNaN(v74)) v74 = 0;
    Pref_User_Sound = parseInt(f246("UserSound"));
    if (Pref_User_Sound == null || isNaN(Pref_User_Sound)) Pref_User_Sound = 1;
    v61 = parseInt(f246("UserMusic"));
    if (v61 == null || isNaN(v61)) v61 = 1;
    v45 = parseInt(f246("UserAvatar"));
    if (v45 == null || isNaN(v45)) v45 = 1;
    v270 = f246("pl_ScoreTop") + "___";
    if (v270.length < 10) v270 = "ROBERTO;default;123456789;757,DAN;default;12345679;661,JULIEN;default;1234589;600,BJORN;default;123789;559,JEAN PIERRE;1;12389;478,SAMUEL;default;1289;409,IGGY;default;129;313,PABLO;default;123;222,RICKY;default;121;208,LEA;default;120;136,EMMA;default;12;134,";
}

function f130() {
    f233("pl_Coins", v171);
    f233("pl_BestDist", v33);
    f233("pl_TotalDist", v24);
    f233("pl_Engine", v156);
    f233("pl_Shell", v191);
    f233("pl_Wheel", v190);
    f233("pl_Tank", v244);
    f233("pl_BullBar", v105);
    if (v74 != -1) f233("pl_Missions", v74);
    if (v270.length > 10) f233("pl_ScoreTop", v270);
    f233("UserName", v97);
    f233("UserAvatar", v45);
    f233("UserSound", Pref_User_Sound);
    f233("UserMusic", v61);
}
var v28 = 0;
var v139 = 319;
var v27 = 0;
var v22 = 0;
var v73 = 0;
var v37 = 0;
var v32 = 0;
var v91 = -1;
var v147 = 0;
var v108 = 0;
var v194 = 0;
var v128 = 0;
var v122 = 0;
var v111 = 0;
var v84 = 0;
var v87 = 0;
var v88 = 0;
var v90 = 0;
var v52 = 0;

function f143() {
    if (v194 == -1) return;
    if (v128 == 1 && v122 == 1 && v111 == 1) {
        if (v90 == 0) {
            f113(104, 250 * (v91 + 1));
            f219(14);
        }
        v90 += v262 * 0.01;
        v84 = 1;
        v87 = 1;
        v88 = 1;
        v194 = 1;
        if (v90 > 20) {
            v74++;
            f130();
            v128 = 0;
            v122 = 0;
            v111 = 0;
            v84 = 0;
            v87 = 0;
            v88 = 0;
            v90 = 0;
            v13 = 0;
            v15 = 0;
            v8 = 0;
            v10 = 0;
            v49 = 0;
            v63 = 0;
            v17 = 0;
            v36 = 0;
            v42 = 0;
            v1 = 0;
            v29 = 0;
            v2 = 0;
            v4 = 0;
            v194 = -1;
            return;
        }
    }
    var FullUpgraded = 0;
    if (v156 > 3) FullUpgraded++;
    if (v191 > 6) FullUpgraded++;
    if (v190 > 3) FullUpgraded++;
    if (v244 > 3) FullUpgraded++;
    if (v105 > 3) FullUpgraded++;
    if (v52 == 1) {
        f219(13);
        v52 = 0;
    }
    switch (v91) {
        case 0:
            /*
            "Perform 1 front flip",
            "Earn more than $150",
            "Do a perfect landing",
            */
            if (v128 == 0 && v49 > 0) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v36 >= 150) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v17 > 0) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 1:
            /*
            "Perform 1 back flip",
            "Drive over 300m in one run",
            "Do 2 perfect landings",
            */
            if (v128 == 0 && v63 > 0) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v81 >= 300) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v17 > 1) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 2:
            /*
            "Perform a double front flip",
            "Earn more than $500",
            "Buy one upgrade from the shop",
            */
            if (v128 == 0 && v49 > 1) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v36 >= 500) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && (v156 + v191 + v190 + v244 + v105) > 1) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 3:
            /*
            "Perform a double back flip",
            "Pick up 2 gas tanks",
            "Drive a cumulative distance of 1000m",
            */
            if (v128 == 0 && v63 > 1) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v42 > 1) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v24 > 1000) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 4:
            /*
            "Perform 1 front flip & 1 back flip in 1 jump",
            "Drive over 500m in one run",
            "Pick up more than $100 in one run",
            */
            if (v128 == 0 && v63 > 0 && v49 > 0) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v81 >= 500) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v29 >= 100) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 5:
            /*
            "Perform a triple front flip",
            "Pick up 3 gas tanks",
            "Buy 3 upgrades from the shop",
            */
            if (v128 == 0 && v49 > 2) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v42 > 2) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && (v156 + v191 + v190 + v244 + v105) > 2) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 6:
            /*
            "Perform a triple back flip",
            "Pick up $10 after crashing",
            "Have a cash balance of $1000",
            */
            if (v128 == 0 && v63 > 2) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v29 > 9 && v114 == 1) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v171 >= 1000) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 7:
            /*
            "Perform a quadruple front flip",
            "Do a perfect landing after a front flip",
            "Drive over 600m in one run",
            */
            if (v128 == 0 && v49 > 3) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v2 > 0) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v81 >= 600) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 8:
            /*
            "Perform a quadrupe back flip",
            "Drive a cumulative distance of 5000m",
            "Perform a quintuple front flip",
            */
            if (v128 == 0 && v63 > 3) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v24 >= 5000) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v49 > 4) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 9:
            /*
            "Collect a gas tank after running out of gas",
            "Perform a quintuple back flip",
            "Buy 4 upgrades from the shop",
            */
            if (v128 == 0 && v1 > 0) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v63 > 4) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && (v156 + v191 + v190 + v244 + v105) > 3) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 10:
            /*
            "Drive over 700m in one run",
            "Perform a quintuple front flip",
            "Collect 3 gas tanks in one run",
            */
            if (v128 == 0 && v81 >= 700) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v49 > 4) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v42 > 2) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 11:
            /*
            "Land perfectly after a triple front flip",
            "Buy 8 upgrades from the shop",
            "Perform a sextuple back flip",
            */
            if (v128 == 0 && v2 > 2) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && (v156 + v191 + v190 + v244 + v105) > 7) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v63 > 5) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 12:
            /*
            "Earn more than $600 in one run",
            "Fully upgrade one part of your truck",
            "Perform a sextuple front flip",
            */
            if (v128 == 0 && v36 >= 600) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && FullUpgraded > 0) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v49 > 5) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 13:
            /*
            "Drive a cumulative distance of 10km",
            "Perform 3 triple front flips",
            "Fully upgrade 2 parts of your truck",
            v13=0;
            v15=0;
            */
            if (v128 == 0 && v24 >= 10000) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v13 > 2) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && FullUpgraded > 2) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 14:
            /*
            "Pick up 5 gas tanks in one run",
            "Perform 3 triple back flips",
            "Earn more than $2000 in one run",
            */
            if (v128 == 0 && v42 > 4) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v15 > 2) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v36 >= 2000) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 15:
            /*
            "Do a perfect landing after a quadruple back flip",
            "Roll over 40m after a crash",
            "Perform 2 quadruple front flips",
            v13=0;
            v15=0;
            v8
            v10
            */
            if (v128 == 0 && v4 > 0 && v10 > 0) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v11 >= 40) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v8 > 1) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 16:
            /*
            "Fully upgrade 3 parts of your truck",
            "Perform 2 quadruple back flips",
            "Do 1 triple front flip and a back flip in 1 jump",
            v13=0;
            v15=0;
            v8
            v10
            */
            if (v128 == 0 && FullUpgraded > 2) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v10 > 1) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v13 > 2 && v63 > 0) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 17:
            /*
            "Earn more than $3000 in one run",
            "Fully upgrade 4 parts of your truck",
            "Do a perfect landing after a quadruple front flip",
            v13=0;
            v15=0;
            v8
            v10
            */
            if (v128 == 0 && v36 >= 3000) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && FullUpgraded > 3) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v8 > 0 && v2 > 0) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
        case 18:
            /*
            "Drive more than 1km in one run",
            "Perform a septuple front flip",
            "Do 1 triple back flip and 1 front flip in 1 jump",
            v13=0;
            v15=0;
            v8
            v10
            */
            if (v128 == 0 && v81 >= 10000) {
                v128 = 1;
                v84 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v122 == 0 && v8 > 1) {
                v122 = 1;
                v87 = 1;
                v194 = 1;
                v52 = 1;
            }
            if (v111 == 0 && v15 > 0 && v49 > 0) {
                v111 = 1;
                v88 = 1;
                v194 = 1;
                v52 = 1;
            }
            break;
            /*
            v36
            v63
            v49
            v42
            v81
            v2=0;
            v4=0;
            v24
            */
    }
    v2 = 0;
    v4 = 0;
}

function f141() {
    if (v194 == -1) return;
    if (v91 == -1 || v91 > 18) return;
    f143();
    if (v91 == -1 || v91 > 18) return;
    var MissionA = v91 * 3;
    var MissionB = MissionA + 1;
    var MissionC = MissionA + 2;
    var v147Goal = -1;
    var TempWidth = -1;
    var NewScale = 0.7;
    if (v147 > -90) {
        f153();
        f186(v207 - v147 * 0.8 * NewScale, v142 - 177 * NewScale, 0);
        f256(0.8 * NewScale, 0.8 * NewScale, 1);
        f111(39, -28, 0, v147 + 50, v108);
        f227(v281);
        f256(0.6, 0.7, 1);
        f186(0, -91, 0);
        f139(0.3, 0.3, 0.3, 1.0);
        if (v194 > 0.6)
            f144(v287[39] + " " + (v91 + 1));
        else {
            var textEarn = v287[123] + 250 * (v91 + 1) + "¶";
            if (f240(v249 * 25) > 0) f139(0.7, 0.7, 0.7, 1);
            f144(textEarn);
            var Dist = f156(textEarn);
            f139(1, 1, 1, 1);
            f195(1, Dist + 30, 56, 0.6);
        }
        f186(0, 91, 0);
        if (MissionA != -1) {
            TempWidth = f156(v287[40 + MissionA]);
            f139(1, 1, 1, 1);
            if (v84 > 0 && f240(v249 * 50) > 0) {
                v84 -= v262 * 0.001;
                f139(3, 3, 0, 2);
            }
            f195(37 + v128, -52, 54, 1.2);
            if (v128 == 0) f139(2, 2, 2, 0.5);
            else f139(1, 1, 1, 1.0);
            if (v84 > 0 && f240(v249 * 50) > 0) {
                f139(3, 3, 0, 2);
            }
            f144(v287[40 + MissionA]);
            f186(0, 82, 0);
            if (v147Goal < TempWidth) v147Goal = TempWidth;
        }
        if (MissionB != -1) {
            TempWidth = f156(v287[40 + MissionB]);
            f139(1, 1, 1, 1);
            if (v87 > 0 && f240(v249 * 50) > 0) {
                v87 -= v262 * 0.001;
                f139(3, 3, 0, 2);
            }
            f195(37 + v122, -52, 54, 1.2);
            if (v122 == 0) f139(2, 2, 2, 0.5);
            else f139(1, 1, 1, 1.0);
            if (v87 > 0 && f240(v249 * 50) > 0) {
                f139(3, 3, 0, 2);
            }
            f144(v287[40 + MissionB]);
            f186(0, 82, 0);
            if (v147Goal < TempWidth) v147Goal = TempWidth;
        }
        if (MissionC != -1) {
            TempWidth = f156(v287[40 + MissionC]);
            f139(1, 1, 1, 1);
            if (v88 > 0 && f240(v249 * 50) > 0) {
                v88 -= v262 * 0.001;
                f139(3, 3, 0, 2);
            }
            f195(37 + v111, -52, 54, 1.2);
            if (v111 == 0) f139(2, 2, 2, 0.5);
            else f139(1, 1, 1, 1.0);
            if (v88 > 0 && f240(v249 * 50) > 0) {
                f139(3, 3, 0, 2);
            }
            f144(v287[40 + MissionC]);
            f186(0, 82, 0);
            if (v147Goal < TempWidth) v147Goal = TempWidth;
        }
        f185();
        f139(1, 1, 1, 1);
    }
    if (v84 > 0 || v87 > 0 || v88 > 0) v194 = 1;
    v108 = 47;
    if (MissionA != -1) v108 += 49;
    if (MissionB != -1) v108 += 49;
    if (MissionC != -1) v108 += 49;
    v147Goal *= 0.6;
    v147Goal += 25;
    if (v147Goal < 455) v147Goal = 455;
    if (v194 <= 0) v147Goal = -100;
    v147 = v147Goal * 0.3 + v147 * 0.7;
    if (v194 > 0) v194 -= v262 * 0.0002;
}

function f167(Text, Pos, Char) {
    var EndPart = Text.substring(Pos + 1);
    var StartPart = Text.substring(0, Pos);
    if (Pos == 0) StartPart = "";
    return StartPart + Char + EndPart;
}

function f119() {
    f134();
    v147 = -500;
    v91 = v74;
    if (v91 > 18) v91 = -1
}

function f56() {
    f166();
    gl.clear(gl.COLOR_BUFFER_BIT);
    f183(2);
    f139(1, 1, 1, 1);
    f153();
    f139(1.0, 1.0, 1.0, 1.0);
    f186(v207 * 0.5, 300, 0);
    f256(0.6, 0.6, 1.0);
    if (v79 == 1)
        f30("datas/textures/larger_device.png", 10);
    else
        f30("datas/textures/larger_window.png", 10);
    f139(1.0, 1.0, 1.0, 1.0);
    f185();
    f153();
    f186(v207 * 0.5, 380, 0);
    f227(v234);
    f256(0.4, 0.5, 1);
    f139(2, 2, 2, 1);
    if (v79 == 1)
        f144(v287[120]);
    else {
        f144(v287[121]);
        f186(0, 69, 0);
        f144(v287[122]);
    }
    f185();
    f139(1.0, 1.0, 1.0, 1.0);
}
var v78 = 0;

function f117() {
    if (v114 == 1) v225 = 0;
    v194 = 0;
    var Icone_A, Icone_B, Texte_A, Texte_B;
    if (v225 == 1) {
        if (v79 == 0)
            Texte_A = 125;
        else
            Texte_A = 124;
        Texte_B = 126;
        Icone_A = "datas/textures/tutorial_jump1.png";
        if (v79 == 0)
            Icone_B = "datas/textures/tutorial_jump3.png";
        else
            Icone_B = "datas/textures/tutorial_jump2.png";
    }
    if (v225 == 2) {
        if (v79 == 0)
            Texte_A = 128;
        else
            Texte_A = 127;
        Texte_B = 129;
        Icone_A = "datas/textures/tutorial_flip1.png";
        if (v79 == 0)
            Icone_B = "datas/textures/tutorial_flip3.png";
        else
            Icone_B = "datas/textures/tutorial_flip2.png";
    }
    f227(v234);
    f139(0.0, 0.0, 0.0, 2.0);
    f153();
    f86(7, 0, 0, v207, 115 * v78);
    f86(7, 0, v142 - 115 * v78, v207, v142);
    f139(1.0, 1.0, 1.0, 1.0);
    var IconesPos = 105 * v78;
    f153();
    f186(IconesPos, IconesPos, 0);
    f256(0.85, 0.85, 1);
    f251(10, 0, 0, -1);
    f30(Icone_A, 1);
    f185();
    if (f240(v249 * 20) > 0) f139(1.5, 1.5, 1.5, 1);
    f153();
    f186(v207 - IconesPos, IconesPos, 0);
    f256(0.85, 0.85, 1);
    f251(10, 0, 0, 1);
    f30(Icone_B, 2);
    f185();
    f186(v207 * 0.5, v142 - 112 * v78, 0);
    f153();
    if (v207 < 800) f256(0.8, 1.0, 1);
    f256(0.5, 0.6, 1);
    f139(1, 1, 1, 1);
    var ColorRGB = 1.25 + f240(v249 * 5) * 0.5;
    f139(ColorRGB, ColorRGB, 0, 1);
    f144(v287[Texte_A]);
    f186(0, 69, 0);
    f144(v287[Texte_B]);
    f185();
    f139(1.0, 1.0, 1.0, 1.0);
    f185();
    v78 = v78 * 0.9 + 0.1;
}
var v267 = 46;
var v200 = 0;
var v152 = -1;
var v224 = 0;
var v225 = 0;
var v43 = 1;
var v44 = 1;
var v119 = 1;

function f245() {
    v249 += v262 * 0.001;
    if (v249 > 360) v249 -= 360;
    if (DataToDownload > 0 || v106 != 1) return;
    if (v250 == 106) {
        v268 = 1 - v268;
        v250 = 0;
    }
    if (v225 > 0) {
        v262 *= v119;
        v119 = v119 * 0.9 + 0.025 * 0.1;
    } else v119 = v119 * 0.9 + 1.0 * 0.1;
    f166();
    f183(1);
    if (v152 != v214 && v214 > 1) {
        v152 = v214;
        f219(0);
    }
    switch (v214) {
        case 0:
            f134();
            f198(0, 6, 3, 3, 143, 131);
            f198(1, 6, 147, 3, 278, 124);
            f198(2, 6, 282, 3, 402, 73);
            f198(3, 6, 406, 3, 656, 77);
            f198(4, 6, 12, 135, 212, 211);
            f198(5, 6, 233, 135, 433, 211);
            f198(6, 6, 445, 80, 552, 216);
            f198(7, 6, 827, 2, 1021, 196);
            f198(8, 6, 3, 215, 173, 369);
            f198(9, 6, 177, 215, 346, 369);
            f198(10, 6, 351, 220, 532, 374);
            f198(11, 6, 660, 2, 786, 114);
            f198(12, 6, 823, 200, 1021, 376);
            f198(13, 6, 556, 118, 723, 157);
            f198(14, 6, 556, 161, 723, 200);
            f198(15, 6, 556, 204, 723, 243);
            f198(16, 6, 556, 247, 723, 286);
            f198(17, 6, 556, 290, 723, 327);
            f198(18, 6, 3, 373, 136, 515);
            f198(19, 6, 140, 373, 306, 515);
            f198(20, 6, 310, 378, 436, 505);
            f198(21, 6, 440, 378, 601, 497);
            f198(22, 6, 605, 378, 788, 491);
            f198(23, 6, 2, 519, 85, 635);
            f198(24, 6, 88, 519, 111, 635);
            f198(25, 6, 114, 519, 197, 635);
            f198(26, 6, 2, 639, 85, 664);
            f198(27, 6, 88, 639, 111, 664);
            f198(28, 6, 114, 639, 197, 664);
            f198(29, 6, 2, 668, 85, 737);
            f198(30, 6, 88, 668, 111, 737);
            f198(31, 6, 114, 668, 197, 737);
            f198(32, 6, 732, 130, 758, 220);
            f198(33, 6, 760, 130, 792, 220);
            f198(34, 6, 727, 223, 820, 312);
            f198(35, 6, 3, 740, 164, 831);
            f198(36, 6, 3, 835, 164, 926);
            f198(37, 6, 9, 939, 80, 1014);
            f198(38, 6, 80, 939, 160, 1014);
            f198(39, 6, 795, 384, 1024, 489);
            f198(40, 6, 822, 624, 1019, 828);
            f198(41, 6, 621, 624, 818, 828);
            f198(42, 6, 177, 832, 1019, 1012);
            f198(43, 6, 200, 520, 1019, 620);
            f198(44, 6, 168, 758, 235, 829);
            f198(45, 6, 459, 687, 616, 828);
            var TorcheStart = 200;
            var TorcheStep = 28.33;
            f198(46, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(47, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(48, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(49, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(50, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(51, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(52, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(53, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(54, 6, TorcheStart, 624, TorcheStart + TorcheStep, 751);
            TorcheStart += TorcheStep;
            f198(55, 11, 1, 1, 122, 126);
            f198(56, 11, 124, 1, 245, 126);
            f198(57, 11, 247, 1, 368, 126);
            f198(58, 6, 824, 3, 991, 42);
            f198(59, 6, 824, 46, 991, 85);
            f198(60, 6, 824, 89, 991, 128);
            f198(61, 6, 824, 132, 991, 171);
            f198(62, 6, 307, 758, 377, 828);
            f198(63, 6, 382, 758, 452, 828);
            f81();
            f157();
            for (var i = 0; i < FlagCount + 1; i++) {
                PFlag.push;
                PFlag[i] = new f247();
                PFlag[i].sx = 0;
                PFlag[i].sz = 0;
                PFlag[i].x = 0;
                PFlag[i].z = 0;
            }
            v214 = 1;
            break;
        case 1:
            f134();
            v223 = 0;
            v289 = 392;
            v276 = 227;
            v220 = 0;
            v173 = 0;
            v174 = -50;
            v175 = -500;
            v164 = 0;
            v158 = 0;
            v157 = 0;
            v25 = 1;
            v114 = 0;
            v188 = 0;
            v49 = 0;
            v63 = 0;
            v13 = 0;
            v15 = 0;
            v8 = 0;
            v10 = 0;
            v36 = 0;
            v17 = 0;
            v42 = 0;
            v1 = 0;
            v29 = 0;
            v128 = 0;
            v122 = 0;
            v111 = 0;
            v84 = 0;
            v87 = 0;
            v88 = 0;
            v90 = 0;
            f119();
            v125 = 50;
            v89 = 0;
            v70 = 0;
            v81 = 0;
            v11 = 0;
            PCar = new f257();
            PCar.Tyre = new Array();
            PCar.TyreCount = 0;
            PCar.x = 0;
            PCar.y = -67;
            if (v28 == 1) PCar.x = v139 + 70;
            v303 = PCar.x;
            PCar.Tyre.push;
            PCar.Tyre[PCar.TyreCount] = new f252();
            PCar.Tyre[PCar.TyreCount].Dist = 0;
            PCar.Tyre[PCar.TyreCount].x = PCar.x + PCar.Tyre[PCar.TyreCount].Dist;
            PCar.Tyre[PCar.TyreCount].y = PCar.y;
            PCar.Tyre[PCar.TyreCount].sx = 0;
            PCar.Tyre[PCar.TyreCount].sy = 0;
            PCar.Tyre[PCar.TyreCount].Sup_sx = 0;
            PCar.Tyre[PCar.TyreCount].Sup_sy = 0;
            PCar.Tyre[PCar.TyreCount].Sup_x = 0;
            PCar.Tyre[PCar.TyreCount].Sup_y = 0;
            PCar.Tyre[PCar.TyreCount].radius = 10.0;
            PCar.Tyre[PCar.TyreCount].Rot = 0.0;
            PCar.Tyre[PCar.TyreCount].OnGround = 0;
            PCar.Tyre[PCar.TyreCount].RotSpeed = 0;
            PCar.TyreCount++;
            PCar.Tyre.push;
            PCar.Tyre[PCar.TyreCount] = new f252();
            PCar.Tyre[PCar.TyreCount].Dist = -30;
            PCar.Tyre[PCar.TyreCount].x = PCar.x + PCar.Tyre[PCar.TyreCount].Dist;
            PCar.Tyre[PCar.TyreCount].y = PCar.y;
            PCar.Tyre[PCar.TyreCount].sx = 0;
            PCar.Tyre[PCar.TyreCount].sy = 0;
            PCar.Tyre[PCar.TyreCount].Sup_sx = 0;
            PCar.Tyre[PCar.TyreCount].Sup_sy = 0;
            PCar.Tyre[PCar.TyreCount].Sup_x = 0;
            PCar.Tyre[PCar.TyreCount].Sup_y = 0;
            PCar.Tyre[PCar.TyreCount].radius = 10.0;
            PCar.Tyre[PCar.TyreCount].Rot = 0.0;
            PCar.Tyre[PCar.TyreCount].OnGround = 0;
            PCar.Tyre[PCar.TyreCount].RotSpeed = 0;
            PCar.TyreCount++;
            v168 = new Array();
            v59 = 0;
            for (var i = 0; i < v269; i++) {
                v168.push;
                v168[i] = new f226();
                v168[i].ObjID = -1;
            }
            v307 = new Array();
            for (var i = 0; i < v255; i++) {
                v307.push;
                v307[i] = new f212();
                v307[i].id = -1;
            }
            v311 = new Array();
            for (var i = 0; i < v187; i++) {
                v311.push;
                v311[i] = new f243();
                v311[i].x = -1000 + Math.random() * 100 + i * 700;
                v311[i].y = -395 - Math.random() * 60;
                v311[i].Size = 0.25 + Math.random() * 0.4;
            }
            v291 = new Array();
            for (var i = 0; i < v140; i++) {
                v291.push;
                v291[i] = new f204();
                v291[i].z = -2000;
            }
            if (v28 == 0) v115 = 0;
            else v115 = 1;
            if (v28 == -1) v115 = 2;
            f84();
            f21(-5000, -5000, 10000, 1000);
            f49(100, 6);
            f90(30);
            f90(3);
            f90(14);
            f90(26);
            f90(9);
            f90(26);
            f90(31);
            f90(31);
            f28();
            f100("title");
            v214 = 5;
            v228 = 0;
            v159 = 0;
            Control_Right = 0;
            v161 = 0;
            if (v28 == 2) {
                PCar.x = 300;
                PCar.Tyre[0].x = PCar.x + PCar.Tyre[0].Dist;
                PCar.Tyre[1].x = PCar.x + PCar.Tyre[1].Dist;
                f219(9);
                StartButton = 0;
                v28 = 0;
                v228 = 0;
                v214 = 9;
                v250 = 0;
                v215 = -1;
            }
            break;
        case 5:
            if(!doneOnce) {

                doneOnce = true;

                if(externalStart) {
                    window.famobi.onRequest("startGame", function() {
                        // do nothing so far
                    });
                }

                window.famobi.onRequest("pauseGameplay", function() {
                    gamePaused = true;
                });

                window.famobi.onRequest("resumeGameplay", function() {
                    gamePaused = false;
                });

                window.famobi.onRequest("enableAudio", function() {
                    Pref_User_Sound = 1;
                });

                window.famobi.onRequest("disableAudio", function() {
                    Pref_User_Sound = 0;
                });

                window.famobi.onRequest("enableMusic", function() {
                    if(v61) f100 (-1);
                });

                window.famobi.onRequest("disableMusic", function() {
                    f99();
                });
            }
            v114 = 0;
            v188 = 0;
            if (PCar.Tyre[1].y < -100) PCar.Tyre[1].sy += v262 * 0.1;
            if (PCar.Tyre[0].y < -100) PCar.Tyre[0].sy += v262 * 0.1;
            v272 = 0;
            if (v115 == 0 || v115 == 2) {
                v179 = 0;
                PCar.Tyre[0].x = PCar.Tyre[0].x * 0.9 + 15 * 0.1;
                PCar.Tyre[1].x = PCar.Tyre[1].x * 0.9 - 10 * 0.1;
                if (PCar.x > 50) PCar.Tyre[1].sx *= 0.8;
                if (PCar.x > 50) PCar.Tyre[0].sx *= 0.99;
            }
            if (v115 == 1) {
                if (PCar.x < 100) v179 = 1;
                else v179 = 0;
                if (PCar.x < 100) PCar.Tyre[0].sx += v262 * 0.1;
                if (PCar.Tyre[1].x > v139 + 25) PCar.Tyre[1].x = (PCar.Tyre[1].x + v139 + 25) * 0.5;
                if (PCar.Tyre[1].x < v139 + 25) PCar.Tyre[1].x = PCar.Tyre[1].x * 0.999 + (v139 + 25) * 0.001;
                if (PCar.x > v139) PCar.Tyre[1].sx *= 0.8;
                if (PCar.x > v139) PCar.Tyre[0].sx *= 0.99;
            }
            v289 = PCar.x;
            v276 = PCar.y;

            if (v115 == 0) {
                window.famobi_analytics.getScreen() != "SCREEN_HOME" && window.famobi_analytics.trackScreen("SCREEN_HOME");

                if(!skipTitle && !gameReadyCalled) {
                    gameReadyCalled = true;
                    window.famobi.gameReady();
                }

                v131 *= 0.95;
                v173 = f263(v173, v289 + 430, v228);
                v174 = f263(v174, v276, v228);
                v175 = f263(v175, -680, v228);
                v164 = f263(v164, v289, v228);
                v158 = f263(v158, v276 - 72, v228);
                v157 = f263(v157, 0, v228);
                if (v228 < 1) v228 += v262 * 0.0005;
            }
            if (v115 == 1) {
                v131 *= 0.95;
                v173 = f263(v173, v289, v228);
                v174 = f263(v174, v276 - 24, v228);
                v175 = f263(v175, -680, v228);
                v164 = f263(v164, v289, 0.9);
                v158 = f263(v158, v276 - 40, v228);
                v157 = f263(v157, 0, v228);
                if (v228 < 1) v228 += v262 * 0.00001;
                if (v28 == 1 && v228 < 1) v228 += v262 * 0.0003;
            }
            if (v115 == 2) {
                v131 = v131 * 0.9 + 2.5 * 0.1;
                v173 = f263(v173, -478, v228);
                v174 = f263(v174, v276, v228);
                v175 = f263(v175, -787, v228);
                v164 = f263(v164, -478, v228);
                v158 = f263(v158, v276 - 98, v228);
                v157 = f263(v157, 0, v228);
                if (v228 < 1) v228 += v262 * 0.00025;
            }
            gl.disable(gl.BLEND);
            f153();
            f228();
            f203();
            gl.enable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            f153();
            f186(0, 30, -206);
            f139(1, 1, 1, 1);
            f251(90, 1, 0, 0);
            f256(0.4, 0.4, 1);
            f165(1);
            f185();
            if (v164 > 3) f88();
            if (v164 < 2) f124();
            gl.disable(gl.DEPTH_TEST);
            f185();
            f166();
            f183(2);
            f139(1, 1, 1, 1);
            if (v115 == 0) {
                var LogoURL = "datas/textures/html5games_logo.png";
                LogoURL = famobi.getMoreGamesButtonImage();
                var LogoX = f18(LogoURL);
                var LogoY = f14(LogoURL);
                if (LogoX > 8 && LogoY > 8) {
                    var MaxSize = 200;
                    if (v207 < v142) MaxSize = 100;
                    var ScaleX = MaxSize / LogoX;
                    var ScaleY = MaxSize / LogoY;
                    var ScaleLogo = ScaleX;
                    if (ScaleY < ScaleX) ScaleLogo = ScaleY;
                    f153();
                    f186(15, v142 - 15, 0);
                    f256(ScaleLogo, ScaleLogo, 1);
                    f186(LogoX * 0.5, -LogoY * 0.5, 0);
                    f30(LogoURL);
                    f185();
                    if (v313 < LogoX * ScaleLogo + 15 && v312 > v142 - 15 - LogoY * ScaleLogo && v178 == 1) {
                        famobi.moreGamesLink();
                    } else v265 = "";
                }
            }

            // settings
            if (v115 != 2 && !externalMute) f195(8, v207 - 54, 54 + offsetYButtons, 0.6);
            // leaderboard
            if ((!window.famobi.hasFeature("standalone") && window.famobi.hasFeature("leaderboard")) && v115 != 2) f195(9, v207 - 54, 155 + offsetYButtons, 0.6);

            if (v115 == 1 && PCar.x < 300) {
                f139(1.0, 1.0, 1.0, 0.5);
            }

            if (v115 == 1 || v115 == 0) {
                f153();
                f186(v207 - 87 - 180, v142 - 71, 0);
                f256(-1, 1, 1);
                if(!skipTitle) {
                    f195(10, 0, 0, 0.9);
                }
                f185();
            }
            if (f240(v249 * 10) > 0) {
                f139(2.5, 2.5, 0, 1);
            }
            if (v115 == 1 && PCar.x < 300) {
                f139(1.0, 1.0, 1.0, 0.5);
            }
            if (skipTitle && v115 == 1 && PCar.x > 350 && !gameReadyCalled) {
                gameReadyCalled = true;
                window.famobi.gameReady();
            }

            f195(10, v207 - 87, v142 - 71, 0.9);
            if (v115 == 2) {
                f153();
                f186(v207 - 16, 3, 0);
                f227(FontRight);
                f256(0.8, 0.9, 1);
                f139(0, 0, 0, 1);
                f144(v97);
                var DecalAvatar = f156(v97) * 0.8;
                f185();
                f139(1.0, 1.0, 1.0, 1.0);
                f153();
                f186(v207 - 72 - DecalAvatar, 49, 0);
                f256(59 * 0.01, 49 * 0.01, 1);
                f30("datas/textures/avatars/" + v45 + ".jpg", 10);
                f185();
                if (f240(v249 * 10) > 0) f139(2.5, 2.5, 0, 1);
                f195(45, v207 - 72 - DecalAvatar, 54, 0.64);
                f139(1.0, 1.0, 1.0, 1.0);
                if (f137(v207 - 140 - DecalAvatar, 0, v207, 120) == 1) v214 = 15;
            }
            var StartButton = f137(v207 - 180, v142 - 160, v207, v142);
            var f215 = !skipTitle ? f137(v207 - 180 - 180, v142 - 160, v207 - 180, v142) : 0;
            var PrefButton = !externalMute ? f137(v207 - 100, 0 + offsetYButtons, v207, 95 + offsetYButtons) : 0;
            var ScoreButton = f137(v207 - 100, 101 + offsetYButtons, v207, 195 + offsetYButtons);
            if (PrefButton == 1 && v115 != 2) v214 = 14;
            if ((!window.famobi.hasFeature("standalone") && window.famobi.hasFeature("leaderboard")) && ScoreButton == 1 && v115 != 2) v115 = 2;
            if (PCar.x < 150) v179 = 1;
            else v179 = 0;
            if (PCar.Tyre[1].x > 335)
                if (v115 == 1 && f215 == 1 && PCar.x > 300) {
                    f219(9);
                    f215 = 0;
                    v28 = 0;
                    v228 = 0;
                    v115 = 0;
                    v250 = 0;
                    v215 = -1;
                }
            if (v115 == 1 && StartButton == 1 && PCar.x > 300) {

                window.famobi_analytics.trackEvent("EVENT_LEVELSTART", {levelName: ""}).then(function() {
                    window.famobi_analytics.trackScreen("SCREEN_LEVEL");
                    f219(9);
                    StartButton = 0;
                    v28 = 0;
                    v228 = 0;
                    v214 = 9;
                    v250 = 0;
                    v215 = -1;
                });
            }
            if (v115 == 0 && (skipTitle || StartButton == 1)) {
                f219(9);
                StartButton = 0;
                v28 = 0;
                v228 = 0;
                v115 = 1;
                v250 = 0;
                v215 = -1;
            }
            if (v115 == 0 && f215 == 1) {
                f219(9);
                f215 = 0;
                v28 = 0;
                v228 = 0;
                v115 = 2;
                v250 = 0;
                v215 = -1;
                v64 = 0;
                Stanislic_SendInfo("High scores table");
            }
            if (v115 == 2 && StartButton == 1) {
                f219(9);
                StartButton = 0;
                v28 = 0;
                v228 = 0;
                v115 = 0;
                v250 = 0;
                v215 = -1;
            }
            break;
        case 9:
            Stanislic_SendInfo("Game started");
            v131 = 0.00001;
            v303 = PCar.x;
            v153 = 150 + v244 * 55 + v191 * 11;
            v272 = v153;
            v285 = 35.0 + v156 * 7;
            v306 = (1.35 - v191 * 0.025 + v105 * 0.01) * 1.8;
            v73 = -2000 - Math.random() * 6000;
            v37 = -2000 - Math.random() * 6000;
            v27 = 0;
            v22 = 0;
            v32 = 0;
            v194 = 1;
            v214 = 10;
            f100("ingame");
        case 10:
            if (1 == 0) {
                var TargetY = -10 - v313 * 0.5;
                if (PCar.Tyre[0].y > TargetY) PCar.Tyre[0].sy -= v262 * 0.5;
                if (PCar.Tyre[1].y > TargetY) PCar.Tyre[1].sy -= v262 * 0.5;
                if (PCar.Tyre[0].y < TargetY - 10) PCar.Tyre[0].sy += v262 * 1.5;
                if (PCar.Tyre[1].y < TargetY - 10) PCar.Tyre[1].sy += v262 * 1.5;
                PCar.Tyre[0].sy *= 0.9;
                PCar.Tyre[1].sy *= 0.9;
                PCar.Tyre[0].x = PCar.Tyre[1].x + 29;
                if (v178 == 1) {
                    PCar.Tyre[0].sx = 300;
                    PCar.Tyre[1].sx = 300;
                } else {
                    PCar.Tyre[0].sx *= 0.8;
                    PCar.Tyre[1].sx *= 0.8;
                }
            }
            if (v272 > 0) v179 = 1;
            else {
                v179 = 0;
                v306 = 1.5;
                PCar.Tyre[0].sx *= 0.999;
                PCar.Tyre[1].sx *= 0.9999;
            }
            if (v272 < 0.1 && Math.abs(PCar.Tyre[0].sy) < 1.0 && Math.abs(PCar.Tyre[0].sx) < 1.0 && PCar.FlyingTime < 2) {
                v214 = 12;
                v75 = 20000 - v33;
                f163(0, 20000 - Math.floor(v81), 0);
            }
            if (v92 < 1) v272 -= v262 * 0.006;
            f228();
            v53 = v53 * 0.99 + (PCar.Tyre[0].sx + PCar.Tyre[1].sx) * 0.005;
            v289 = PCar.x;
            v276 = v276 * 0.9 + PCar.y * 0.1;
            v165 = v165 * 0.9 - (PCar.Tyre[0].sy + PCar.Tyre[1].sy) * 0.25;
            if (v165 > 0) v165 = 0;
            if (v165 < -90) v165 = -90;
            var ZoomCam = PCar.y * 0.5;
            if (ZoomCam < -180) ZoomCam = -180;
            ZoomCam -= (1.0 - v119) * 300;
            if (PCar.FlyingTime > 20 && v99 > -450) v99 -= v262 * 0.03;
            else v99 *= 0.99;
            if (v114 == 1) {
                v99 = 0;
                v165 = 0;
                ZoomCam = 0;
            }
            v173 = f263(v173, v289 - 536, v228);
            v174 = f263(v174, v276 - 100 + v165 * 2 + v99, v228);
            v175 = f263(v175, -600 - ZoomCam, v228);
            v164 = f263(v164, v289 + 50, v228);
            v158 = f263(v158, v276, v228);
            v157 = f263(v157, 0, v228);
            if (v228 < 1) v228 += v262 * 0.0001;
            gl.disable(gl.BLEND);
            f153();
            f203();
            if (v43 == 1 && PCar.Tyre[0].sy < -12 && PCar.Tyre[1].sy < -12 && (PCar.Tyre[0].GroundY - PCar.Tyre[0].y) > 100) {
                v43 = 0;
                v225 = 2;
                v78 = 0;
            }
            gl.enable(gl.BLEND);
            if (v79 == 1 && v114 == 1) {
                v159 = 0;
                Control_Right = 0;
                v161 = 0;
            } else
            if (v79 == 1 && v114 == 0 && v81 > 3) {
                f166();
                f183(2);
                if (v159 == 1 || (v225 == 2 && f240(v249 * 50) < 0)) f139(1, 1, 1, 1.0);
                else f139(1, 1, 1, 0.3);
                v159 = f16(55, 77, v142 - 240, 1.5);
                if (Control_Right == 1 || (v225 == 2 && f240(v249 * 50) > 0)) f139(1, 1, 1, 1.0);
                else f139(1, 1, 1, 0.3);
                Control_Right = f16(56, 280, v142 - 220, 1.5);
                if (v161 == 1 || (v225 == 1 && f240(v249 * 50) > 0)) f139(1, 1, 1, 1.0);
                else f139(1, 1, 1, 0.3);
                v161 = f16(57, v207 - 100, v142 - 230, 1.5);
                f139(1, 1, 1, 1.0);
            }
            f185();
            f166();
            f139(1, 1, 1, 1.0);
            f139(1, 1, 1, 1.0);
            if (v225 == 0) {
                f195(11, v207 - 54, 47 + offsetYButtons, 0.8);
                var PauseButton = f137(v207 - 110, 0 + offsetYButtons, v207, 110 + offsetYButtons);
                if (PauseButton == 1) {
                    window.famobi_analytics.trackScreen("SCREEN_PAUSE");
                    v214 = 11;
                    v194 = 0;
                }
            }
            v73 += v262;
            if (v73 > 4000) {
                if (f211(23, PCar.x + 2000, -1) == 1) {
                    v73 = -2000 - Math.random() * 6000;
                }
            }
            v37 += v262;
            if (v37 > 2500) {
                for (var i = 0; i < 5; i++) f211(24, PCar.x + 2000 + i * 100, -1);
                v37 = -4000 - Math.random() * 6000;
            }
            v27 += v262;
            if (v27 > 0) {
                if (f211(28, PCar.x + 2000, -1) == 1) {
                    v27 = -4000 - Math.random() * 4000;
                }
            }
            if (v81 > 100 && v81 > v22) {
                if (f211(34, PCar.x + 2000, -1) == 1) {
                    v22 = v81 + 25;
                } else v22++;
            }
            if (v131 > 3 && v131 < 6) {
                v32 += v262;
            }
            v200 += v262;
            if (v200 > 80) {
                v200 -= 80;
                v267++;
                if (v267 == 55) v267 = 46;
            }
            if (v32 > 0) {
                f211(33, PCar.x + 2000, -1);
                v32 = -1500;
            }
            break;
        case 11:
            f203();
            f82();
            break;
        case 12:
            f203();
            f54();
            break;
        case 13:
            f203();
            f123();
            break;
        case 14:
            f203();
            f62();
            break;
        case 15:
            f203();
            f126();
            break;
    }
    f166();
    f183(2);
    if (v225 == 0 && v115 != 0) {
        f153();
        f186(96, v142 - 123, 0);
        if (v224 == 1) {
            f186(-19, 36, 0);
            f256(0.75, 0.75, 1);
        }
        f227(v281);
        f256(1.2 + v266, 1.3 + v266, 1);
        f139(1, 1, 1, 1);
        if (v266 > 0.1 && f240(v249 * 45) > 0) f139(5, 5, 5, 1);
        f144("" + v171);
        f195(0, -44, 44, 0.7);
        f185();
    }
    f139(1, 1, 1, 1);
    v266 *= 0.9;
    if (v86 != v171) {
        v86 = v171;
        v266 = 0.4;
    }
    if (v214 == 10 && v225 == 0) {
        var PlayerRoundDistance = Math.floor(v81);
        f153();
        f186(v207 - 19, v142 - 123, 0);
        f227(FontRight);
        f256(1.2, 1.3, 1);
        f139(1, 1, 1, 1);
        f144(PlayerRoundDistance + "m");
        f256(0.4, 0.4, 1);
        f186(0, -43, 0);
        f139(0, 0, 0, 0.5);
        f144(v287[4] + Math.floor(v33) + "m");
        f185();
        var PourcentOfMaxGaz = (1.0 / 200) * v153;
        var PourcentOfGaz = (1.0 / 200) * v272;
        if (v272 > v153) v272 = v153;
        if (v272 < 0) v272 = 0;
        if (v225 == 0) {
            f153();
            f139(1, 1, 1, 1);
            if (v92 > 0 && f240(v249 * 50) > 0) {
                v92 -= v262;
                f139(3.5, 3.5, 3.5, 1);
            }
            f153();
            f186(61, 57, 0);
            f153();
            f256(PourcentOfMaxGaz, 0.6, 1);
            f195(5, 105, 0, 1.0);
            f185();
            f256(PourcentOfGaz, 0.6, 1);
            f195(4, 100, 0, 1.0);
            f185();
            f195(6, 44, 58, 0.8);
            if (v272 < 40) {
                f227(FontRight);
                f186(PourcentOfMaxGaz + 261, 75, 0);
                f256(0.4, 0.4, 1);
                f139(1, 0, 0, 1);
                if (v272 > 0 && f240(v249 * 10) > 0) f139(1.5, 1.5, 0, 1);
                if (v272 > 0) f144(v287[5]);
                else f144(v287[6]);
            }
            f185();
        }
    }
    f139(1, 1, 1, 1);
    if (v225 == 0) f101();
    f159();
    f166();
    f183(2);
    if (v214 > 5 && v225 == 0) f141();
    for (var i = 0; i < v80.length; i++) {
        var x = v80[i].pageX * v207 / v176;
        var y = v80[i].pageY * v142 / v149;
        f195(40, x, y, 1.2);
    }
    if (v225 > 0 && v214 == 10) f117();
    /*
    f166 ();
    f183(2);
    f139(1,1,0,1);
    f227 (v281);
    f256(0.4,0.5,1);
    f144("Touchs From Events "+v80.length); f186(0,70,0);
    */
    if (v268 == 1) {
        f166();
        f183(2);
        f139(-1, 1, 0, 1);
        f227(v281);
        f256(0.2, 0.25, 1);
        f144("Device Pixel Ratio " + v31);
        f186(0, 70, 0);
        f144("Mouse " + v313 + " " + v312);
        f186(0, 70, 0);
        f144("v250 " + v250);
        f186(0, 70, 0);
        f144("PCar.Tyre[i].GroundY-PCar.Tyre[i].y:" + (PCar.Tyre[0].GroundY - PCar.Tyre[0].y));
        f186(0, 70, 0);
        f144("PCar.Tyre[i].sy:" + (PCar.Tyre[0].sy));
        f186(0, 70, 0);
        f144("Monetisation_IsFamobi " + Monetisation_IsFamobi);
        f186(0, 70, 0);
        if (Monetisation_IsFamobi == 1) {
            f144("getMoreGamesButtonImage " + famobi.getMoreGamesButtonImage());
            f186(0, 70, 0);
        }
        f139(1, 1, 1, 1);
    }
}
var v309 = 0;
var Wall = new Array();
var v248 = 0;

function f255() {
    this.xa;
    this.za;
    this.xb;
    this.zb;
}

function f259(xa, za, xb, zb) {
    Wall.push;
    Wall[v248] = new f255();
    Wall[v248].xa = xa;
    Wall[v248].za = za;
    Wall[v248].xb = xb;
    Wall[v248].zb = zb;
    v248++;
}
var OBJ = new Array();
var v203 = new Array();
var v48 = new Array();
var v93 = 150;

function f63(ImagePath) {
    if (ImagePath.substring(0, 5) == "dummy") return -1;
    for (i = 0; i < v93; i++) {
        if (v48[i] == ImagePath) return i;
    }
    for (i = 0; i < v93; i++) {
        if (v48[i] == "none") {
            v48[i] = ImagePath;
            v203[i] = f116(-1, "textures/" + ImagePath + ".jpg");
            return i;
        }
    }
    return -1;
}

function f35(ID) {
    if (OBJ[ID].Triangles < 1) return;
    if (v101[v116].vertexPositionAttribute == -1) return;
    for (var SubObjID = 0; SubObjID < OBJ[ID].ObjCount; SubObjID++) {
        if (f71(
                OBJ[ID].SubOBJ[SubObjID].MinX,
                OBJ[ID].SubOBJ[SubObjID].MinY,
                OBJ[ID].SubOBJ[SubObjID].MinZ,
                OBJ[ID].SubOBJ[SubObjID].MaxX,
                OBJ[ID].SubOBJ[SubObjID].MaxY,
                OBJ[ID].SubOBJ[SubObjID].MaxZ) == 1) {
            if (OBJ[ID].SubOBJ[SubObjID].NoShadow == 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
                gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
                f10(1);
                gl.drawElements(gl.TRIANGLES, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                v95 += OBJ[ID].SubOBJ[SubObjID].Triangles;
            }
        }
    }
}

function f53(ID) {
    if (OBJ[ID].Triangles < 1) return;
    if (v101[v116].vertexPositionAttribute == -1 || v101[v116].textureCoordAttribute == -1) return;
    for (var SubObjID = 0; SubObjID < OBJ[ID].ObjCount; SubObjID++) {
        if (f71(
                OBJ[ID].SubOBJ[SubObjID].MinX,
                OBJ[ID].SubOBJ[SubObjID].MinY,
                OBJ[ID].SubOBJ[SubObjID].MinZ,
                OBJ[ID].SubOBJ[SubObjID].MaxX,
                OBJ[ID].SubOBJ[SubObjID].MaxY,
                OBJ[ID].SubOBJ[SubObjID].MaxZ) == 1) {
            if (OBJ[ID].SubOBJ[SubObjID].TextureID != -1) {
                v210 = -1;
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, v203[OBJ[ID].SubOBJ[SubObjID].TextureID]);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
            gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer);
            gl.vertexAttribPointer(v101[v116].textureCoordAttribute, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
            f10();
            gl.drawElements(gl.TRIANGLES, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            v95 += OBJ[ID].SubOBJ[SubObjID].Triangles;
        }
    }
}

function f77(ID) {
    if (OBJ[ID].Triangles < 1) return;
    if (v101[v116].vertexPositionAttribute == -1) return;
    for (var SubObjID = 0; SubObjID < OBJ[ID].ObjCount; SubObjID++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
        gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
        f10();
        gl.drawElements(gl.TRIANGLES, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    v95 += OBJ[ID].Triangles;
}

function f196(ID) {
    if (OBJ[ID].Triangles < 1) return;
    if (v101[v116].vertexPositionAttribute == -1 || v101[v116].textureCoordAttribute == -1) return;
    for (var SubObjID = 0; SubObjID < OBJ[ID].ObjCount; SubObjID++) {
        if (OBJ[ID].SubOBJ[SubObjID].TextureID != -1) {
            v210 = -1;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, v203[OBJ[ID].SubOBJ[SubObjID].TextureID]);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
        gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer);
        gl.vertexAttribPointer(v101[v116].textureCoordAttribute, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
        f10();
        gl.drawElements(gl.TRIANGLES, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    v95 += OBJ[ID].Triangles;
}

function f150() {
    this.Name;
    this.Triangles = 0;
    this.Vertexs = 0;
    this.UVs = 0;
    this.Material;
    this.VertexPositionBuffer;
    this.TextureCoordBuffer;
    this.VertexIndexBuffer;
    this.TextureID = -1;
    this.NoShadow = 0;
    this.MinX = 100000;
    this.MaxX = -100000;
    this.MinY = 100000;
    this.MaxY = -100000;
    this.MinZ = 100000;
    this.MaxZ = -100000;
}

function f192() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

function f200() {
    this.va = 0;
    this.vb = 0;
    this.vc = 0;
    this.ta = 0;
    this.tb = 0;
    this.tc = 0;
}

function f191() {
    this.Vec = 0;
    this.UV = 0;
}

function f140() {
    this.x = 0;
    this.z = 0;
    this.type = 0;
    this.activated = 0;
    this.Rot = 0;
}

function f17() {
    return;
    var LenA = v252.length - 1;
    for (var i = 0; i < v252.length; i++) {
        v253.push;
        v253[i] = new f140();
        v253[i].x = v252[LenA - i].x;
        v253[i].z = v252[LenA - i].z;
    }
    v253[0].x = v253[1].x;
    v253[0].z = v253[1].z;
    v253[LenA].x = v253[0].x;
    v253[LenA].z = v253[0].z;
}
var v252 = new Array();
var v253 = new Array();
var v62 = 0;
var v141 = new Array();
var v30 = 0;

function f68() {
    if (v252.length != 0) v252 = [];
    v62 = 0;
    if (v141.length != 0) v141 = [];
    v30 = 0;
    if (Wall.length != 0) Wall = [];
    v248 = 0;
}

function f58(ID) {
    if (OBJ[ID].Triangles != 0) {
        OBJ[ID].Triangles = 0;
        for (var SubObjID = 0; SubObjID < OBJ[ID].ObjCount; SubObjID++) {
            /*
            this.Name;
            this.Triangles=0;
            this.Vertexs=0;
            this.UVs=0;
            this.Material;
            this.VertexPositionBuffer;
            this.TextureCoordBuffer;
            this.VertexIndexBuffer;
            this.TextureID=-1;
            this.NoShadow=0;
            OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer=gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TempSubVertex), gl.STATIC_DRAW);
            OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize=3;
            OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.numItems=CurrentSubVertex/3;
            */
            gl.deleteBuffer(OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
            gl.deleteBuffer(OBJ[ID].SubOBJ[SubObjID].TextureCoordBuffer);
            gl.deleteBuffer(OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
        }
        OBJ[ID].ObjCount = 0;
        return 1;
    }
    return 0;
}

function f188(ID, Name) {
    DataToDownload++;
    f58(ID);
    var TempTriangles = 0;
    var xmlhttp;
    famobi.log("f188[" + ID + "]:" + Name + v197);
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            var str = xmlhttp.responseText;
            var OneLine = str.split("\n");
            var i;
            if (OneLine.length < 3) return;
            var ReadMode = 0;
            var SubObjID = -1;
            var TempVertex = new Array();
            var CurrentVertex = 0;
            var TempUVs = new Array();
            var CurrentUVs = 0;
            var TempFace = new Array();
            var CurrentFace = 0;
            var StartFace = 0;
            OBJ[ID].SubOBJ = new Array();
            for (i = 0; i < OneLine.length; i++) {
                if (ReadMode == 3 && OneLine[i][0] != "f" && OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 6) == "Marker") {
                    var VecIndexA = TempFace[StartFace].vc - 1;
                    var vecX = TempVertex[VecIndexA].x;
                    var vecY = TempVertex[VecIndexA].y;
                    if (OBJ[ID].Max_X < vecX) OBJ[ID].Max_X = vecX;
                    OBJ[ID].Marker.push;
                    OBJ[ID].Marker[OBJ[ID].MarkersCount] = new f192();
                    OBJ[ID].Marker[OBJ[ID].MarkersCount].x = vecX;
                    OBJ[ID].Marker[OBJ[ID].MarkersCount].y = vecY;
                    OBJ[ID].Marker[OBJ[ID].MarkersCount].z = vecY;
                    OBJ[ID].MarkersCount++;
                    ReadMode = 0;
                    SubObjID--;
                    OBJ[ID].ObjCount--;
                }
                if (ReadMode == 3 && OneLine[i][0] != "f" && OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 7) == "exclude") {
                    ReadMode = 0;
                    SubObjID--;
                    OBJ[ID].ObjCount--;
                }
                if (ReadMode == 3 && OneLine[i][0] != "f" && OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 8) == "Element_") {
                    var VecIndexA = TempFace[StartFace].va - 1;
                    var VecIndexB = TempFace[StartFace].vb - 1;
                    v141.push;
                    v141[v30] = new f140();
                    v141[v30].x = TempVertex[VecIndexA].x;
                    v141[v30].z = TempVertex[VecIndexA].z;
                    v141[v30].Rot = f201(TempVertex[VecIndexA].x, TempVertex[VecIndexA].z, TempVertex[VecIndexB].x, TempVertex[VecIndexB].z);
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 11) == "Element_OIL") v141[v30].type = 1;
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 12) == "Element_COIN") v141[v30].type = 2;
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 13) == "Element_BOOST") v141[v30].type = 3;
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 11) == "Element_ICE") v141[v30].type = 4;
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 12) == "Element_Lamp") v141[v30].type = 5;
                    v30++;
                    ReadMode = 0;
                    SubObjID--;
                    OBJ[ID].ObjCount--;
                }
                if (ReadMode == 3 && OneLine[i][0] != "f" && OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 9) == "AI_Path_A") {
                    var VecIndexA = TempFace[StartFace].va - 1;
                    v252.push;
                    v252[v62] = new f140();
                    v252[v62].x = TempVertex[VecIndexA].x;
                    v252[v62].z = TempVertex[VecIndexA].z;
                    v62++;
                    ReadMode = 0;
                    SubObjID--;
                    OBJ[ID].ObjCount--;
                }
                if (ReadMode == 3 && OneLine[i][0] != "f") {
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 9) == "no_shadow") OBJ[ID].SubOBJ[SubObjID].NoShadow = 1;
                    else
                        OBJ[ID].SubOBJ[SubObjID].NoShadow = 0;
                    if (OBJ[ID].SubOBJ[SubObjID].Name.substring(0, 4) == "Wall") {
                        for (var j = StartFace; j < CurrentFace; j++) {
                            var VecIndexA = TempFace[j].va - 1;
                            var VecIndexB = TempFace[j].vb - 1;
                            var VecIndexC = TempFace[j].vc - 1;
                            if (TempVertex[VecIndexA].y < 0.1 && TempVertex[VecIndexB].y < 0.1) {
                                f259(TempVertex[VecIndexA].x, TempVertex[VecIndexA].z, TempVertex[VecIndexB].x, TempVertex[VecIndexB].z);
                            }
                            if (TempVertex[VecIndexB].y < 0.1 && TempVertex[VecIndexC].y < 0.1) {
                                f259(TempVertex[VecIndexB].x, TempVertex[VecIndexB].z, TempVertex[VecIndexC].x, TempVertex[VecIndexC].z);
                            }
                            if (TempVertex[VecIndexC].y < 0.1 && TempVertex[VecIndexA].y < 0.1) {
                                f259(TempVertex[VecIndexC].x, TempVertex[VecIndexC].z, TempVertex[VecIndexA].x, TempVertex[VecIndexA].z);
                            }
                        }
                    }
                    var TempIndex = new Array();
                    var CurrentIndex = 0;
                    var TempSubVertex = new Array();
                    var CurrentSubVertex = 0;
                    var TempSubUVs = new Array();
                    var CurrentSubUVs = 0;
                    for (var j = StartFace; j < CurrentFace; j++) {
                        TempIndex.push;
                        TempIndex[CurrentIndex] = CurrentIndex;
                        CurrentIndex++;
                        var VecIndex = TempFace[j].va - 1;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex] = TempVertex[VecIndex].x;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 1] = TempVertex[VecIndex].y;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 2] = TempVertex[VecIndex].z;
                        CurrentSubVertex += 3;
                        var VecUV = TempFace[j].ta - 1;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs] = TempUVs[VecUV].x;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs + 1] = TempUVs[VecUV].y;
                        CurrentSubUVs += 2;
                        TempIndex.push;
                        TempIndex[CurrentIndex] = CurrentIndex;
                        CurrentIndex++;
                        var VecIndex = TempFace[j].vb - 1;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex] = TempVertex[VecIndex].x;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 1] = TempVertex[VecIndex].y;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 2] = TempVertex[VecIndex].z;
                        CurrentSubVertex += 3;
                        var VecUV = TempFace[j].tb - 1;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs] = TempUVs[VecUV].x;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs + 1] = TempUVs[VecUV].y;
                        CurrentSubUVs += 2;
                        TempIndex.push;
                        TempIndex[CurrentIndex] = CurrentIndex;
                        CurrentIndex++;
                        var VecIndex = TempFace[j].vc - 1;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex] = TempVertex[VecIndex].x;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 1] = TempVertex[VecIndex].y;
                        TempSubVertex.push;
                        TempSubVertex[CurrentSubVertex + 2] = TempVertex[VecIndex].z;
                        CurrentSubVertex += 3;
                        var VecUV = TempFace[j].tc - 1;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs] = TempUVs[VecUV].x;
                        TempSubUVs.push;
                        TempSubUVs[CurrentSubUVs + 1] = TempUVs[VecUV].y;
                        CurrentSubUVs += 2;
                    }
                    for (var j = 0; j < CurrentIndex; j++) {
                        var Index = TempIndex[j];
                        for (var k = j; k < CurrentIndex; k++) {
                            var B_Index = TempIndex[k];
                            if (j != k && TempIndex[j] != TempIndex[k] &&
                                TempSubVertex[Index * 3] == TempSubVertex[B_Index * 3] && TempSubVertex[Index * 3 + 1] == TempSubVertex[B_Index * 3 + 1] && TempSubVertex[Index * 3 + 2] == TempSubVertex[B_Index * 3 + 2] &&
                                TempSubUVs[Index * 2] == TempSubUVs[B_Index * 2] && TempSubUVs[Index * 2 + 1] == TempSubUVs[B_Index * 2 + 1]) {
                                TempIndex[k] = Index;
                                TempSubVertex[B_Index * 3] = TempSubVertex[CurrentSubVertex * 3];
                                TempSubVertex[B_Index * 3 + 1] = TempSubVertex[CurrentSubVertex * 3 + 1];
                                TempSubVertex[B_Index * 3 + 2] = TempSubVertex[CurrentSubVertex * 3 + 2];
                                TempSubUVs[B_Index * 2] = TempSubUVs[CurrentSubUVs * 2];
                                TempSubUVs[B_Index * 2 + 1] = TempSubUVs[CurrentSubUVs * 2 + 1];
                                for (var l = k; l < CurrentIndex + 1; l++) {
                                    if (TempIndex[j] == CurrentSubVertex) TempIndex[j] = B_Index;
                                }
                                CurrentSubVertex--;
                                CurrentSubUVs--;
                            }
                        }
                    }
                    OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TempSubVertex), gl.STATIC_DRAW);
                    OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.itemSize = 3;
                    OBJ[ID].SubOBJ[SubObjID].VertexPositionBuffer.numItems = CurrentSubVertex / 3;
                    OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TempSubUVs), gl.STATIC_DRAW);
                    OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer.itemSize = 2;
                    OBJ[ID].SubOBJ[SubObjID].VertexTextureCoordBuffer.numItems = CurrentSubUVs / 2;
                    OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer);
                    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(TempIndex), gl.STATIC_DRAW);
                    OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.itemSize = 1;
                    OBJ[ID].SubOBJ[SubObjID].VertexIndexBuffer.numItems = CurrentIndex;
                    ReadMode = 999;
                }
                if (ReadMode == 3 && OneLine[i][0] == "f") {
                    var va, vb, vc, vd = -1;
                    var ta, tb, tc, td;
                    var TempSTRA = OneLine[i].substring(2);
                    var TempSTRB = TempSTRA.split(" ");
                    for (var j = 0; j < TempSTRB.length; j++) {
                        var TempSTRC = TempSTRB[j].split("/");
                        if (j == 0) {
                            va = parseInt(TempSTRC[0]);
                            ta = parseInt(TempSTRC[1]);
                        }
                        if (j == 1) {
                            vb = parseInt(TempSTRC[0]);
                            tb = parseInt(TempSTRC[1]);
                        }
                        if (j == 2) {
                            vc = parseInt(TempSTRC[0]);
                            tc = parseInt(TempSTRC[1]);
                        }
                        if (j == 3) {
                            vd = parseInt(TempSTRC[0]);
                            td = parseInt(TempSTRC[1]);
                        }
                    }
                    TempFace.push;
                    TempFace[CurrentFace] = new f200();
                    TempFace[CurrentFace].va = va;
                    TempFace[CurrentFace].vb = vb;
                    TempFace[CurrentFace].vc = vc;
                    TempFace[CurrentFace].ta = ta;
                    TempFace[CurrentFace].tb = tb;
                    TempFace[CurrentFace].tc = tc;
                    CurrentFace++;
                    OBJ[ID].SubOBJ[SubObjID].Triangles++;
                    TempTriangles++;
                    if (TempSTRB[3].length > 2) {
                        /*
                        famobi.log ("vd: "+vd);
                        famobi.log ("TempSTRB[0]: "+TempSTRB[0]);
                        famobi.log ("TempSTRB[1]: "+TempSTRB[1]);
                        famobi.log ("TempSTRB[2]: "+TempSTRB[2]);
                        famobi.log ("TempSTRB[3]: "+TempSTRB[3]);
                        famobi.log (" ");
                        */
                        TempFace.push;
                        TempFace[CurrentFace] = new f200();
                        TempFace[CurrentFace].va = va;
                        TempFace[CurrentFace].vb = vc;
                        TempFace[CurrentFace].vc = vd;
                        TempFace[CurrentFace].ta = ta;
                        TempFace[CurrentFace].tb = tc;
                        TempFace[CurrentFace].tc = td;
                        CurrentFace++;
                        OBJ[ID].SubOBJ[SubObjID].Triangles++;
                        OBJ[ID].Triangles++;
                        TempTriangles++;
                    }
                }
                if (ReadMode == 2 && OneLine[i][0] != "v") {
                    ReadMode = 3;
                }
                if (ReadMode == 2 && OneLine[i][0] == "v" && OneLine[i][1] == "t") {
                    TempUVs.push;
                    TempUVs[CurrentUVs] = new f192();
                    var TempSTRA = OneLine[i].substring(3);
                    var TempSTRB = TempSTRA.split(" ");
                    TempUVs[CurrentUVs].x = parseFloat(TempSTRB[0]);
                    TempUVs[CurrentUVs].y = parseFloat(TempSTRB[1]);
                    TempUVs[CurrentUVs].z = 0.0;
                    CurrentUVs++;
                    OBJ[ID].SubOBJ[SubObjID].UVs++;
                }
                if (ReadMode == 1 && OneLine[i][0] != "v") {
                    ReadMode = 2;
                }
                if (ReadMode == 1 && OneLine[i][0] == "v") {
                    TempVertex.push;
                    TempVertex[CurrentVertex] = new f192();
                    var TempSTRA = OneLine[i].substring(2);
                    var TempSTRB = TempSTRA.split(" ");
                    TempVertex[CurrentVertex].x = parseFloat(TempSTRB[0]);
                    TempVertex[CurrentVertex].y = parseFloat(TempSTRB[1]);
                    TempVertex[CurrentVertex].z = parseFloat(TempSTRB[2]);
                    if (OBJ[ID].SubOBJ[SubObjID].MinX > TempVertex[CurrentVertex].x) OBJ[ID].SubOBJ[SubObjID].MinX = TempVertex[CurrentVertex].x;
                    if (OBJ[ID].SubOBJ[SubObjID].MaxX < TempVertex[CurrentVertex].x) OBJ[ID].SubOBJ[SubObjID].MaxX = TempVertex[CurrentVertex].x;
                    if (OBJ[ID].SubOBJ[SubObjID].MinY > TempVertex[CurrentVertex].y) OBJ[ID].SubOBJ[SubObjID].MinY = TempVertex[CurrentVertex].y;
                    if (OBJ[ID].SubOBJ[SubObjID].MaxY < TempVertex[CurrentVertex].y) OBJ[ID].SubOBJ[SubObjID].MaxY = TempVertex[CurrentVertex].y;
                    if (OBJ[ID].SubOBJ[SubObjID].MinZ > TempVertex[CurrentVertex].z) OBJ[ID].SubOBJ[SubObjID].MinZ = TempVertex[CurrentVertex].z;
                    if (OBJ[ID].SubOBJ[SubObjID].MaxZ < TempVertex[CurrentVertex].z) OBJ[ID].SubOBJ[SubObjID].MaxZ = TempVertex[CurrentVertex].z;
                    CurrentVertex++;
                    OBJ[ID].SubOBJ[SubObjID].Vertexs++;
                }
                if (OneLine[i][0] == "g") {
                    SubObjID++;
                    OBJ[ID].ObjCount++;
                    OBJ[ID].SubOBJ.push;
                    OBJ[ID].SubOBJ[SubObjID] = new f150();
                    OBJ[ID].SubOBJ[SubObjID].Vertexs = 0;
                    OBJ[ID].SubOBJ[SubObjID].Name = OneLine[i].substring(2);
                    StartFace = CurrentFace;
                    if (OneLine[i + 1][0] == "u") {
                        OBJ[ID].SubOBJ[SubObjID].TextureID = f63(OneLine[i + 1].substring(7));
                    }
                    i++;
                    ReadMode = 1;
                }
            }
            OBJ[ID].Triangles = TempTriangles;
            DataToDownload--;
            f17();
        }
    }
    xmlhttp.open("GET", "datas/objects/" + Name + v197, true);
    xmlhttp.send();
}

function f242() {
    this.Triangles = 0;
    this.ObjCount = 0;
    this.SubOBJ;
    this.Min_X = 0;
    this.Max_X = 0;
    this.MarkersCount = 0;
    this.Marker = new Array();
}

function f162() {
    var i;
    for (i = 0; i < 50; i++) {
        OBJ.push;
        OBJ[i] = new f242();
    }
    for (i = 0; i < v93; i++) {
        v203.push;
        v48.push;
        v48[i] = "none";
    }
}
var GLFontTexture;
var v320 = new Array();
var v232 = 0;

function f187() {
    this.Exist = 0;
    this.uvStart_X = 0;
    this.uvStart_Y = 0;
    this.uvEnd_X = 0;
    this.uvEnd_Y = 0;
    this.size_X = 0;
    this.size_Y = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.xAdvance = 0;
    this.VertexPositionBuffer;
    this.TextureCoordBuffer;
    this.VertexIndexBuffer;
}

function f210() {
    var i;
    for (i = 0; i < 8800; i++) {
        v320.push;
        v320[i] = new f187();
    }
}

function f52(charId) {
    v320[charId].VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v320[charId].VertexPositionBuffer);
    vertices =
        [
            v320[charId].xOffset, v320[charId].yOffset + v320[charId].size_Y, -0.25,
            v320[charId].xOffset + v320[charId].size_X, v320[charId].yOffset + v320[charId].size_Y, -0.25,
            v320[charId].xOffset + v320[charId].size_X, v320[charId].yOffset, -0.25,
            v320[charId].xOffset, v320[charId].yOffset, -0.25,
        ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    v320[charId].VertexPositionBuffer.itemSize = 3;
    v320[charId].VertexPositionBuffer.numItems = 4;
    v320[charId].VertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v320[charId].VertexTextureCoordBuffer);
    var textureCoords = [
        v320[charId].uvStart_X, v320[charId].uvEnd_Y,
        v320[charId].uvEnd_X, v320[charId].uvEnd_Y,
        v320[charId].uvEnd_X, v320[charId].uvStart_Y,
        v320[charId].uvStart_X, v320[charId].uvStart_Y,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    v320[charId].VertexTextureCoordBuffer.itemSize = 2;
    v320[charId].VertexTextureCoordBuffer.numItems = 4;
    v320[charId].VertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v320[charId].VertexIndexBuffer);
    var sVertexIndices = [0, 1, 2, 0, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sVertexIndices), gl.STATIC_DRAW);
    v320[charId].VertexIndexBuffer.itemSize = 1;
    v320[charId].VertexIndexBuffer.numItems = 6;
}

function f39(Str, StringToFind, TempArray) {
    var n = Str.indexOf(StringToFind)
    if (n == 0) {
        var StartPos = StringToFind.length;
        var DoubleFloatString = Str.substring(StartPos, Str.length - 1);
        DoubleFloatString = DoubleFloatString.replace("(", "");
        DoubleFloatString = DoubleFloatString.replace(")", "");
        DoubleFloatString = DoubleFloatString.replace(" ", "");
        var OneFloat = DoubleFloatString.split(",");
        var numberArray = new Array();
        TempArray[0] = parseFloat(OneFloat[0]);
        TempArray[1] = parseFloat(OneFloat[1]);
        return 1;
    }
    return -1;
}

function f75(Str, StringToFind) {
    var n = Str.indexOf(StringToFind)
    if (n == 0) {
        var StartPos = StringToFind.length;
        var numberString = Str.substring(StartPos, Str.length - 1);
        return parseInt(numberString);
    }
    return -1;
}

function f26() {
    return ["fr", "de", "en"].indexOf(window.famobi.getCurrentLanguage()) > 0 ? 0 : 1; // famobi
    var userLang = f22();
    if (userLang.search("fr") != -1) return 0;
    if (userLang.search("de") != -1) return 0;
    if (userLang.search("en") != -1) return 0;
    return 1;
}

function f231() {
    var FontScale = 1.0;
    var font_name = "font";
    if (f26() == 1) {
        font_name = "font_unicode";
        FontScale = 0.7;
    }
    var xmlhttp;
    famobi.log("f231");
    GLFontTexture = f116(-1, "fonts/" + font_name + ".png")
    f210();
    var TempArray = new Array();
    TempArray.push;
    TempArray.push;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            var str = xmlhttp.responseText;
            var LineCount = 0;
            var OneLine = str.split("#");
            var i;
            if (OneLine.length < 3) return;
            var Currentv320 = 0;
            for (i = 9; i < OneLine.length; i += 7) {
                var charId = f75(OneLine[i], "charId=");
                if (charId != -1) {
                    Currentv320 = charId;
                    v320[Currentv320].Exist = 1;
                    var uvStart = f39(OneLine[i + 1], "uvStart=", TempArray);
                    v320[Currentv320].uvStart_X = TempArray[0];
                    v320[Currentv320].uvStart_Y = 1.0 - TempArray[1];
                    f39(OneLine[i + 2], "uvEnd=", TempArray);
                    v320[Currentv320].uvEnd_X = TempArray[0];
                    v320[Currentv320].uvEnd_Y = 1.0 - TempArray[1];
                    f39(OneLine[i + 3], "size=", TempArray);
                    v320[Currentv320].size_X = TempArray[0] * FontScale;
                    v320[Currentv320].size_Y = TempArray[1];
                    var xOffset = f75(OneLine[i + 4], "xOffset=");
                    v320[Currentv320].xOffset = xOffset * FontScale;
                    var yOffset = f75(OneLine[i + 5], "yOffset=");
                    v320[Currentv320].yOffset = yOffset;
                    var xAdvance = f75(OneLine[i + 6], "xAdvance=");
                    v320[Currentv320].xAdvance = xAdvance * FontScale - 3;
                    f52(charId);
                }
            }
            v232++;
        }
    }
    xmlhttp.open("GET", "datas/fonts/" + font_name + ".fnt" + v197, true);
    xmlhttp.send();
}

function f164(ID) {
    if (v320[ID].Exist == 0 || ID > 2048) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, v320[ID].VertexPositionBuffer);
    gl.vertexAttribPointer(v101[v116].vertexPositionAttribute, v320[ID].VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, v320[ID].VertexTextureCoordBuffer);
    gl.vertexAttribPointer(v101[v116].textureCoordAttribute, v320[ID].VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v320[ID].VertexIndexBuffer);
    f10(1);
    gl.drawElements(gl.TRIANGLES, v320[ID].VertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    f186(v320[ID].xAdvance, 0.0, 0.0);
    v95 += 2;
}
var v281 = 0;
var v234 = 1;
var FontRight = 2;
var v235 = 0;

function f227(align) {
    v235 = align;
}

function f218(FilterID) {
    if (FilterID == 8217) return 39;
    return FilterID;
}

function f156(str) {
    var FontDecal = 0;
    for (var i = 0; i < str.length; i++) {
        FontDecal += v320[f218(str.charCodeAt(i))].xAdvance;
    }
    return FontDecal;
}

function f144(str) {
    if (v232 == 0) return 0;
    var FontDecal = 0;
    if (v235 > 0) {
        FontDecal = -f156(str);
        if (v235 == v234) FontDecal *= 0.5;
    }
    v210 = -1;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, GLFontTexture);
    f153()
    f186(FontDecal, 0, 0);
    for (var i = 0; i < str.length; i++) {
        f164(f218(str.charCodeAt(i)));
    }
    f185();
    return FontDecal;
}
var TextField_Selected = -1;
var v47 = 0;
var v209 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_.!";
String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}

function f235(Texte) {
    for (var i = 0; i < Texte.length; i++) {
        var IsGood = 0;
        for (var j = 0; j < v209.length; j++) {
            if (Texte[i] == v209[j]) {
                IsGood = 1;
                break;
            }
        }
        if (IsGood == 0) {
            //console.log(Texte);
            Texte = Texte.replaceAt(i, "_");
        }
    }
    return Texte;
}

function f108(FieldID, Text, PosX, PosY, infoID) {
    v201 = PosX,
        TextField_y = PosY;
    var MyTextField = document.getElementById("dlg-textfield");
    if (TextField_Selected != FieldID && v178 == 1 && v313 > PosX - 255 && v313 < PosX + 255 && v312 > PosY - 5 && v312 < PosY + 75) {
        TextField_Selected = FieldID
        MyTextField.value = "";
        MyTextField.select();
        MyTextField.value = "" + Text;
        MyTextField.focus();
    }
    if (TextField_Selected != -1) {}
    if (TextField_Selected == FieldID && Text != MyTextField.value) {
        Text = MyTextField.value;
        if (Text.length > 10) Text = Text.substring(0, 10);
        Text = f235(Text);
        MyTextField = Text;
    }
    f183(3);
    if (TextField_Selected == FieldID) {
        f139(1.0, 1.0, 1.0, 0.8);
        f129(PosX - 255, PosY - 5,
            PosX + 255, PosY + 75);
    }
    f139(0.0, 0.0, 0.0, 1.0);
    f129(PosX - 250, PosY,
        PosX + 250, PosY + 70);
    f183(2);
    f139(1.5, 1.5, 1.5, 1.0);
    f153();
    f186(PosX - 255 + 10, PosY - 4, 0);
    f256(0.7, 0.7, 1.0);
    f227(v281);
    f139(2.0, 2.0, 2.0, 1.0);
    f144(v97);
    f185();
    if (TextField_Selected == FieldID) {
        if (v185 == 0) {
            var CursorPos = PosX - 235 + f156(v97) * 0.7;
            f183(3);
            f139(1.0, 1.0, 1.0, 0.8);
            f129(CursorPos, PosY + 2, CursorPos + 40, PosY + 68);
            f183(2);
        }
        if (v178 == 1)
            if (v313 < PosX - 255 || v313 > PosX + 255 || v312 < PosY - 5 || v312 > PosY + 75) {
                TextField_Selected = -1;
                document.getElementById("dlg-textfield").blur();
                v201 = -5000;
            }
        if (v250 == 13) {
            TextField_Selected = -1;
            document.getElementById("dlg-textfield").blur();
            v201 = -5000;
        }
    }
    if (infoID != -1) {
        f183(2);
        if (TextField_Selected == FieldID) f139(1.5, 1.5, 1.5, 1.0);
        else f139(1.0, 1.0, 1.0, 0.5);
        f153();
        f186(PosX - 255 + 10, PosY - 45, 0);
        f256(0.45, 0.45, 1.0);
        f227(v281);
        f144(v287[infoID]);
        f185();
    }
    return Text;
}
var v50 = 0;
var v211 = new Array();
var v279 = "";
var v26 = 0;
var v118;
var v58 = 0;

function f223() {
    famobi.log("Sound: Init");

    var unlockAudioContext = function(audioCtx) {
      if (audioCtx.state === 'suspended') {
        var events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        var unlock = function unlock() {
          events.forEach(function (event) {
            document.body.removeEventListener(event, unlock)
          });
          audioCtx.resume();
        };

        events.forEach(function (event) {
          document.body.addEventListener(event, unlock, false)
        });
      }
    }

    if (f261() == 1 && f262() == 1 && f250() == 0) {
        v58 = 1;
    }
    if (f262() == 1 || f238() == 1) v26 = 1;
    v50 = 1;
    /*
    if (f238()==1)
    {
    v50=0; return;
    }
    */
    try {
        v118 = new (window.AudioContext || window.webkitAudioContext)();
        unlockAudioContext(v118);

    } catch (e) {
        v50 = 0;
        return;
    }

    var myTempAudio = document.createElement('audio');
    if (myTempAudio.canPlayType('audio/mp3')) {
        v279 = "mp3";
        famobi.log("Sound: ext:" + v279);
        return;
    } else
    if (myTempAudio.canPlayType('audio/ogg')) {
        v279 = "ogg";
        famobi.log("Sound: ext:" + v279);
        return;
    } else
    if (myTempAudio.canPlayType('audio/mp4')) {
        v279 = "mp4";
        famobi.log("Sound: ext:" + v279);
        return;
    }
    v50 = 0;
}

function f260() {}

function f222(ID, SoundPath) {
    if (v50 == 0) return;
    DataToDownload++;
    var Path = SoundPath.replace("snd", v279) + v197;
    var request = new XMLHttpRequest();
    request.open('GET', Path, true);
    request.responseType = 'arraybuffer';
    famobi.log("Sound: load:" + Path);
    request.onload = function() {
        v118.decodeAudioData(request.response,
            function(buffer) {
                v211.push = null;
                v211[ID] = buffer;
                DataToDownload--;
            }, f260);
    }
    request.send();
}
var v57 = 1.0;

function f97(Vol) {
    v57 = Vol;
}

function f219(ID) {
    if (v50 == 0 || Pref_User_Sound == 0) return;
    var source = v118.createBufferSource();
    if (source == null) return;
    source.buffer = v211[ID];
    var volumeNode = v118.createGain();
    volumeNode.gain.value = v57 * 0.25;
    source.connect(volumeNode);
    volumeNode.connect(v118.destination);
    source.connect(v118.destination);
    source.start ? source.start(0) : source.noteOn(0);
}
var v213 = null;

function f217() {
    if (v50 == 0) return;
}

function f216(ID) {
    if (v50 == 0 || v213 == null) return;
    v213.stop ? v213.stop(0) : v213.noteOff(0);
    v213 = null;
}

function f197(ID) {
    if (v50 == 0 || v61 == 0) return;
    f216(1);
    v213 = v118.createBufferSource();
    if (ID == 1) v213.buffer = v211[4];
    if (ID == 2) v213.buffer = v211[5];
    v213.loop = true;
    v213.connect(v118.destination);
    v213.start ? v213.start(0) : v213.noteOn(0);
}
var v305 = null;
var v127 = null;

function f99() {
    if (v50 == 0) return;
    if (v305 != null && v305.id == "MusicStreamPlayer") {
        v305.pause();
        v305.currentTime = 0;
    }
}
var v18 = null;
var v0 = 0;

function f100(path) {
    if (path == -1 && v18 != null) path = v18;
    if (path.length > 2) v18 = path;
    if (v50 == 0) return;
    if (v305 != null && v305.id == "MusicStreamPlayer") {
        v305.pause();
        v305.currentTime = 0;
        if (v127 != null) v305.removeChild(v127);
        v127 = null;
    }
    if (v61 == 0) return;
    v305 = document.createElement('audio');
    v305.id = "MusicStreamPlayer";
    v305.preload = 'auto';
    if(path === "ingame") {
        v305.loop = true;
    }
    famobi.log("Musique: createElement");
    if (v305.canPlayType) {
        famobi.log("Musique: v305.canPlayType");
        var canPlayMp4 = !!v305.canPlayType && "" != v305.canPlayType('audio/mp4');
        var canPlayMp3 = !!v305.canPlayType && "" != v305.canPlayType('audio/mp3');
        var canPlayOgg = !!v305.canPlayType && "" != v305.canPlayType('audio/ogg; codecs="vorbis"');
        if (canPlayOgg == true) {
            v127 = document.createElement('source');
            v127.type = 'audio/ogg; codecs="vorbis"';
            v127.src = 'datas/musics/' + path + '.ogg';
            v305.appendChild(v127);
        } else
        if (canPlayMp4 == true && f262() == 1) {
            v127 = document.createElement('source');
            v127.type = 'audio/mp4';
            v127.src = 'datas/musics/' + path + '.m4a';
            v305.appendChild(v127);
        } else
        if (canPlayMp3 == true) {
            v127 = document.createElement('source');
            v127.type = 'audio/mp3';
            v127.src = 'datas/musics/' + path + '.mp3';
            v305.appendChild(v127);
        }
        famobi.log("Musique:" + v127.src);
        v305.load();
        var promise = v305.play();
        if (promise) {
            //Older browsers may not return a promise, according to the MDN website
            promise.catch(function(error) {
                // console.error(error);
            });
        }
        v305.volume = 0.35;
        v0 = 1;
    }
}
window.onbeforeunload = function() {
    v305.pause();
    v305.currentTime = 0;
}
var v271 = [
    "",
    "MONTENRY",
    "MANYRUN",
    "MACANO",
    "WAYCOCO",
    "TIKINANEN",
    "AUSTRAMIA",
    "BROOMAP",
    "FLAKESTONES",
    "MOOSWOOD",
    "KWOOLSTOOD",
    "DUSTDOWN",
    "SUNNINGSTONES",
];
var v288 = [
    "",
    "Red Puledro",
    "BonBallo",
    "Mad Buffalo",
    "Samy Runner",
    "Usually Serious",
    "Groucho",
];
var v316 = [
    "",
    "0",
    "11",
    "9",
    "10",
    "8",
];
var v278 = [
    "",
    "0",
    "100",
    "225",
    "350",
    "400",
    "475",
    "1000",
    "3000",
    "5000",
    "7000",
];
var v242 = [
    "",
    "50",
    "75",
    "100",
    "125",
    "150",
    "175",
    "200",
    "225",
    "250",
    "275",
    "300",
    "325",
    "350",
    "375",
    "400",
    "425",
    "450",
    "475",
    "500",
    "525",
    "550",
    "575",
    "600",
    "625",
    "650",
    "675",
    "700",
    "725",
    "750",
    "775",
    "800",
    "900",
    "1000",
    "1100",
];
var v60 = [
    "",
    "50",
    "125",
    "225",
    "350",
    "400",
    "475",
    "600",
    "650",
    "700",
    "800",
    "900",
    "1000",
    "1100",
    "1200",
    "1300",
    "1400",
    "1500",
    "1600",
    "1700",
    "1800",
    "1900",
    "2000",
    "2100",
    "2200",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
    "25000",
];
var v263 = -1;
var v208 = 0;
var v257 = 0;
var v21 = -1;
var v35 = -1;
var v245 = 0;
var v275 = 12;
var v145 = 1;
var v82 = 0;
var v229 = 1;
var v298 = 5;

function f215() {
    if (v245 != 0) return 0;
    var BoingTXT = 0.7 + Math.cos(v257 / 57.2957795 * 6) * 0.005;
    f227(v281);
    f153();
    f186(20 + 200 * v263 - 200, 10, 0);
    f251(-2, 0, 0, 1);
    f256(BoingTXT, BoingTXT, 1);
    f139(3.0, 3.0, 3.0, 1.5);
    f144(v287[22]);
    f186(-3, -3, 0)
    f139(0.0, 0.0, 0.0, 1.0);
    f144(v287[22]);
    f185();
    if (v215 == 1 && v312 < 100 && v313 < v207 * 0.5) return 1;
    return 0;
}
var v38 = "Oups";

function f180() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    f214(0, 650 + (1 - v263) * 50);
    f214(0, 640 * v263 - 730);
    v97 = f108(1, v97, v207 * 0.5, 140 * v263, 51);
    var StartPos = v207 * 0.5 - 211;
    var EndPos = v207 * 0.5 + 210;
    var IconPosX = StartPos;
    var IconPosY = 274 * v263;
    famobi.log("v45 " + v45);
    f153();
    if (v45 > 0 && v45 < 25) {} else v45 = 1;
    var Sizzzz = 44;
    for (var i = 1; i < 25; i++) {
        if (i == v45) {
            f183(3);
            f139(1.0, 1.0, 0.0, 1.0);
            f129(IconPosX - Sizzzz, IconPosY - Sizzzz,
                IconPosX + Sizzzz, IconPosY + Sizzzz);
        }
        if (v215 == 1 && v313 > IconPosX - Sizzzz && v313 < IconPosX + Sizzzz && v312 > IconPosY - Sizzzz && v312 < IconPosY + Sizzzz) {
            v215 = -1;
            v45 = i;
        }
        f183(1);
        f153();
        f139(1.0, 1.0, 1.0, 1.0);
        f186(IconPosX, IconPosY, 0);
        f256(0.6 * v263, 0.6 * v263, 1.0);
        f30("textures/avatars/" + i + ".jpg");
        f139(1.0, 1.0, 1.0, 1.0);
        f185();
        IconPosX += 84;
        if (IconPosX > EndPos) {
            IconPosX = StartPos;
            IconPosY += 83;
        }
    }
    f153();
    f183(2);
    if (f215() == 1) {
        TextField_Selected = -1;
        document.getElementById("dlg-textfield").blur();
        if (v97.length < 3) v97 = v38;
        if (v97 != v38) {
            Stanislic_SendInfo("User_Changed_Name");
        }
        Save_UserPrefs();
        v245 = 1;
        v21 = 1;
        v35 = -1;
    }
}

function f73() {
    if (v45 > 0 && v45 < 25) {} else v45 = 1;
    var AvatarButton = v207 - (f156(v97) * 0.8) - 155;
    if (AvatarButton < 250) AvatarButton = v207 - 130;
    f183(2);
    f139(1.0, 1.0, 1.0, 1.0);
    f153();
    f186(AvatarButton, 700 - 150 * v263, 0);
    f86(12, 0, 0, v207, 205);
    f186(130, 40, 0);
    f256(0.8, 0.9, 1.0);
    f227(v281);
    f139(2.0, 2.0, 2.0, 1.0);
    f144(v97);
    f186(-3, -3, 0);
    f139(0.0, 0.0, 0.0, 1.0);
    if (v185 == 0 && v97.substring(0, 6) == "Player") f139(0.5, 0.5, 0.5, 1.0);
    f144(v97);
    f153();
    f139(1.0, 1.0, 1.0, 1.0);
    if (v185 == 0 && v97.substring(0, 6) == "Player") f139(1.5, 1.5, 1.5, 1.0);
    f186(-84, 46, 0);
    f256(1.0, 1.0, 1.0);
    f30("textures/avatars/" + v45 + ".jpg");
    f139(1.0, 1.0, 1.0, 1.0);
    f185();
    f185();
    if (v215 == 1 && v313 > AvatarButton && v312 > 550) {
        v38 = v97;
        v245 = 1;
        v21 = 5;
        v35 = -1;
    }
}

function f214(textID, ButPosY) {
    f183(2);
    if (v178 == 1 && v312 > ButPosY + 5 && v312 < ButPosY + 195) f139(2.0, 2.0, 0.0, 1.0);
    else f139(1.0, 1.0, 1.0, 1.0);
    f86(12, 0 - 4, ButPosY, v207 + 4, ButPosY + 200);
    f183(2);
    var BoingTXT = 0.8;
    f227(v234);
    f153();
    f186(v207 * 0.5, ButPosY + 55, 0);
    f251(-2, 0, 0, 1);
    f256(BoingTXT, BoingTXT, 1.0);
    f139(3.0, 3.0, 3.0, 1.8);
    f144(v287[textID]);
    f186(-3, -3, 0)
    f139(0.0, 0.0, 0.0, 0.85);
    f144(v287[textID]);
    f185();
    if (v245 == 0 && v215 == 1 && v312 > ButPosY + 5 && v312 < ButPosY + 195) return 1;
    return 0;
}

function f89(textID, ButPosY) {
    f183(2);
    if (v178 == 1 && v312 > ButPosY + 5 && v312 < ButPosY + 165) f139(2.0, 2.0, 0.0, 1.0);
    else f139(1.0, 1.0, 1.0, 1.0);
    f86(12, 0 - 4, ButPosY, v207 + 4, ButPosY + 170);
    f183(2);
    var BoingTXT = 0.8;
    f227(v234);
    f153();
    f186(v207 * 0.5, ButPosY + 42, 0);
    f251(-2, 0, 0, 1);
    f256(BoingTXT, BoingTXT, 1.0);
    f139(3.0, 3.0, 3.0, 1.8);
    f144(v287[textID]);
    f186(-3, -3, 0)
    f139(0.0, 0.0, 0.0, 0.85);
    f144(v287[textID]);
    f185();
    if (v245 == 0 && v215 == 1 && v312 > ButPosY + 5 && v312 < ButPosY + 195) return 1;
    return 0;
}
var v85 = 0;

function f103() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    f214(0, 650 + (1 - v263) * 50);
    f214(0, 640 * v263 - 730);
    f153();
    f186(v207 * 0.5, 268 * v263 - 200, 0);
    f251(-2, 0, 0, 1);
    f139(1.5, 1.5, 1.5, 1.0);
    f144(v287[50]);
    f185();
    var TrackIconWidth = 380;
    for (var i = -5; i < 6; i++) {
        var ID = i + v229;
        while (ID > v298) {
            ID -= v298;
        }
        while (ID < 1) {
            ID += v298;
        }
        var PosX = v207 * 0.5 + i * TrackIconWidth + v85;
        if (PosX > -200 && PosX < v207 + 200) {
            f153();
            f186(PosX, 680 * v263 - 320, 0);
            f251(-2, 0, 0, 1);
            f256(0.7, 0.7, 1.0);
            f153();
            f186(0, 0, -5);
            f256(4.8, -4.8, 0.01);
            gl.enable(gl.DEPTH_TEST);
            f153();
            f251(32, 1, 0, 0);
            f251(i * 50 + (v85 / TrackIconWidth) * 50, 0, 1, 0);
            f183(2);
            gl.depthMask(false);
            f139(1.0, 1.0, 1.0, 1.0);
            f153();
            f251(90, 1, 0, 0);
            f165(2);
            f185();
            gl.depthMask(true);
            f183(2);
            if (Pref_User_Unlocked_B[ID] == 1) f139(1.0, 1.0, 1.0, 1.0);
            else f139(0.3, 0.3, 0.3, 1.0);
            f153();
            f196(v316[ID]);
            f186(0, 24, -3);
            f196(4);
            f185();
            f153();
            f186(0, 10.8, -25.9);
            f196(1);
            f185();
            f153();
            f186(18.9, 7.2, 17.9);
            f196(2);
            f185();
            f153();
            f186(-18.9, 7.2, 17.9);
            f251(-180, 0, 1, 0);
            f196(2);
            f185();
            f185();
            gl.disable(gl.DEPTH_TEST);
            f185();
            if (Pref_User_Unlocked_B[ID] != 1) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
                f186(0, -100, 0);
                if (i == 0) f139(1.0, 1.0, 1.0, 1.0);
                else f139(0.25, 0.25, 0.25, 1.0);
                f30("textures/lock.png");
                f186(0, 70, 0);
                var CoinDecal = f156("" + v278[ID]);
                f153();
                f186(-CoinDecal * 0.5 - 33, 95, -5);
                f256(1.8, -1.8, 0.01);
                f251(v249 * 2, 0, 1, 0);
                gl.enable(gl.DEPTH_TEST);
                f196(7);
                gl.disable(gl.DEPTH_TEST);
                f185();
                f144(v278[ID]);
                f186(0, 30, 0);
            }
            f186(0, 100, 0);
            f256(0.85, 1.0, 1.0);
            f139(0.0, 0.0, 0.0, 1.0);
            f144(v288[ID]);
            f186(0, -5, 0);
            if (i == 0) f139(5.0, 5.0, 5.0, 1.0);
            else f139(1.0, 1.0, 1.0, 0.5);
            f144(v288[ID]);
            if (i == 0) f139(1.0, 1.0, 1.0, 1.0);
            else f139(1.0, 1.0, 1.0, 0.5);
            f186(0, 120, 0);
            f86(26, -200, 0, 200, 70);
            f183(3);
            var PosX = -183;
            f139(0.0, 1.0, 0.0, 0.8);
            var TopSpeed = ID * 3.0 - 2;
            for (var z = 0; z < TopSpeed; z++) {
                f129(PosX, 13, PosX + 20, 59);
                PosX += 29;
            }
            f183(2);
            f186(-203, 64, 0);
            f256(0.6, 0.5, 1.0);
            if (i == 0) f139(5.0, 5.0, 5.0, 0.5);
            else f139(1.0, 1.0, 1.0, 0.25);
            f227(v281);
            f144(v287[62]);
            f227(v234);
            f185();
        }
    }
    var BoingLogo = Math.cos(v257 / 57.2957795 * 5) * 5.0;
    f153();
    f186(v207 - 50 - BoingLogo, 320 * v263, 0);
    f183(2);
    f256(-1, 3, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    f153();
    f186(50 + BoingLogo, 320 * v263, 0);
    f183(2);
    f256(1, 3, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    v85 *= 0.9;
    if (v215 == 1 && v312 > 155 && v312 < 530 && v312 < 516 && v313 > v207 * 0.5 + TrackIconWidth * 0.5) {
        v229++;
        v85 += TrackIconWidth;
    }
    if (v215 == 1 && v312 > 155 && v312 < 530 && v312 < 516 && v313 < v207 * 0.5 - TrackIconWidth * 0.5) {
        v229--;
        v85 -= TrackIconWidth;
    }
    while (v229 > v298) {
        v229 -= v298;
    }
    while (v229 < 1) {
        v229 += v298;
    }
    if (Pref_User_Unlocked_B[v229] != 1 && v215 == 1 && v312 > 155 && v312 < 530 && v313 < v207 * 0.5 + TrackIconWidth * 0.5 && v313 > v207 * 0.5 - TrackIconWidth * 0.5) {
        v215 = -1;
        v263 = 0.8;
        Pref_User_COINS = parseInt(Pref_User_COINS);
        if (Pref_User_COINS >= parseInt(v278[v229])) {
            Pref_User_COINS -= parseInt(v278[v229]);
            Pref_User_Unlocked_B[v229] = 1;
            f219(9);
            Save_UserPrefs();
            Stanislic_SendInfo("Car_Unlocked_" + v229);
        } else
            f219(10);
    }
    if (Pref_User_Unlocked_B[v229] == 1 && v215 == 1 && v312 > 155 && v312 < 530 && v313 < v207 * 0.5 + TrackIconWidth * 0.5 && v313 > v207 * 0.5 - TrackIconWidth * 0.5) {
        SelectedCarID = v229;
        v215 = -1;
        f219(0);
        v245 = 1;
        v21 = 100;
        v35 = -1;
        Car[0].posSY += 0.4;
    }
    if (f215() == 1) {
        v245 = 1;
        v21 = 0;
        v35 = -1;
    }
    f73();
}

function f91() {
    f183(2);
    f153();
    f186(v207 * 0.5, 680 * v263 - 320, 0);
    f256(1.7, 1.7, 1.0);
    f139(0.3, 0.3, 0.3, 0.9)
    f30("textures/track_" + v145 + ".png");
    f251(-2, 0, 0, 1);
    f186(0, 250, 0);
    f256(0.8, 0.8, 1.0)
    f139(5.0, 5.0, 5.0, 1.0);
    f144(v271[v145]);
    f185();
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    f214(0, 640 * v263 - 730);
    f153();
    f186(v207 * 0.5, 293 * v263, 0);
    f183(2);
    f256(0.8, 0.8, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    if (v79 == 0) f165(6);
    else f165(7);
    f185();
    if (f214(64, 490 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = 999;
        v35 = 10;
    }
    if (f215() == 1) {
        v245 = 1;
        v21 = 100;
        v35 = -1;
    }
}
var v40 = 0;

function f120(TrackID) {
    v215 = -1;
    v263 = 0.8;
    Pref_User_COINS = parseInt(Pref_User_COINS);
    if (Pref_User_COINS >= parseInt(v60[TrackID])) {
        Pref_User_COINS -= parseInt(v60[TrackID]);
        Pref_User_Unlocked[TrackID] = 1;
        f219(9);
        Save_UserPrefs();
        Stanislic_SendInfo("Track_Unlocked_" + TrackID);
        v208 = 100;
        v145 = TrackID;
    } else
        f219(10);
}

function f74() {
    Pref_User_Unlocked[1] = 1;
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    f214(0, 650 + (1 - v263) * 50);
    f214(0, 640 * v263 - 730);
    f153();
    f186(v207 * 0.5, 268 * v263 - 200, 0);
    f251(-2, 0, 0, 1);
    f139(1.5, 1.5, 1.5, 1.0);
    f144(v287[21]);
    f185();
    var TrackIconWidth = 380;
    for (var i = -5; i < 6; i++) {
        var ID = i + v145;
        while (ID > v275) {
            ID -= v275;
        }
        while (ID < 1) {
            ID += v275;
        }
        var ImageID = ID;
        if (ImageID > 12) ImageID -= 12;
        var PosX = v207 * 0.5 + i * TrackIconWidth + v82;
        if (PosX > -200 && PosX < v207 + 200) {
            f153();
            f186(PosX, 680 * v263 - 320, 0);
            f256(0.7, 0.7, 1.0);
            if (i == 0) f139(1.0, 1.0, 1.0, 1.0);
            else f139(0.5, 0.5, 0.5, 0.5);
            if (Pref_User_Unlocked[ID] != 1) f139(0.05, 0.05, 0.05, 0.9);
            f30("textures/track_" + ImageID + ".png");
            f251(-2, 0, 0, 1);
            f186(0, 250, 0);
            f256(0.8, 0.8, 1.0)
            f139(0.0, 0.0, 0.0, 1.0);
            if (i == 0) f139(5.0, 5.0, 5.0, 1.0);
            else f139(1.0, 1.0, 1.0, 0.5);
            f144(v271[ImageID]);
            if (ImageID != ID) {
                f153();
                f186(0, -73, 0);
                f144(v287[63]);
                f185();
            }
            if (Pref_User_Unlocked[ID] != 1) {
                f186(0, -420, 0);
                if (i == 0) f139(1.0, 1.0, 1.0, 1.0);
                else f139(0.25, 0.25, 0.25, 1.0);
                f30("textures/lock.png");
                f186(0, 70, 0);
                var CoinDecal = f156("" + v60[ID]);
                f153();
                f186(-CoinDecal * 0.5 - 33, 95, -5);
                f256(1.8, -1.8, 0.01);
                f251(v249 * 2, 0, 1, 0);
                gl.enable(gl.DEPTH_TEST);
                f196(7);
                gl.disable(gl.DEPTH_TEST);
                f185();
                f144(v60[ID]);
            }
            f185();
        }
    }
    var BoingLogo = Math.cos(v257 / 57.2957795 * 5) * 5.0;
    f153();
    f186(v207 - 50 - BoingLogo, 400 * v263, 0);
    f183(2);
    f256(-1, 3, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    f153();
    f186(50 + BoingLogo, 400 * v263, 0);
    f183(2);
    f256(1, 3, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    f153();
    f186(v207 * 0.5, 600 * v263, 0);
    f183(2);
    f256(0.6, 0.6, 0.6);
    f139(1.0, 1.0, 1.0, 1.0);
    f144(v145 + "/" + v275);
    f185();
    v82 *= 0.8;
    if (v215 == 1 && v312 > 155 && v313 > v207 * 0.5 + TrackIconWidth * 0.5) {
        v145++;
        v82 += TrackIconWidth;
    }
    if (v215 == 1 && v312 > 155 && v313 < v207 * 0.5 - TrackIconWidth * 0.5) {
        v145--;
        v82 -= TrackIconWidth;
    }
    while (v145 > v275) {
        v145 -= v275;
    }
    while (v145 < 1) {
        v145 += v275;
    }
    if (Pref_User_Unlocked[v145] != 1 && v215 == 1 && v312 > 155 && v313 < v207 * 0.5 + TrackIconWidth * 0.5 && v313 > v207 * 0.5 - TrackIconWidth * 0.5) {
        f120(v145);
    }
    if (Pref_User_Unlocked[v145] == 1 && v215 == 1 && v312 > 155 && v313 < v207 * 0.5 + TrackIconWidth * 0.5 && v313 > v207 * 0.5 - TrackIconWidth * 0.5) {
        f219(0);
        if (v40 < 3) {
            v208 = 8;
            v40++;
            Save_UserPrefs();
        } else {
            v245 = 1;
            v21 = 999;
            v35 = 10;
        }
        Save_UserPrefs();
    }
    if (f215() == 1) {
        v245 = 1;
        v21 = 1;
        v35 = -1;
    }
}
var v218 = 0;
var v183 = 0;
var v182 = 0;

function f95(v145, Largeur, MaxLines) {
    f153();
    var LineH = 40;
    var SwapBack = 0;
    for (var i = 0; i < MaxLines; i++) {
        SwapBack = 1 - SwapBack;
        if (SwapBack == 1) {
            f183(3);
            f139(0.0, 0.0, 0.0, 0.1);
            f129(-Largeur * 0.5, 0, Largeur * 0.5, LineH);
            f183(2);
        }
        var DecalName = 35;
        f139(0.5, 0.5, 0.5, 1.0);
        if (f135(i, v145) > 0) {
            f153();
            f186(-Largeur * 0.5 + 3, -2, 0);
            f256(0.45, 0.40, 1)
            var RankText = "" + f135(i, v145);
            f227(v281);
            f144(RankText);
            var FontWi = ((f156(RankText)) * 0.45 + 10);
            if (DecalName < FontWi) DecalName = FontWi;
            f185();
            f139(0.0, 0.0, 0.0, 1.0);
            f153();
            f186(-Largeur * 0.5 + DecalName, -4, 0);
            f256(0.4, 0.45, 1);
            f227(v281);
            f144(f132(i, v145));
            f185();
            f153();
            f186(Largeur * 0.5 - 3, -4, 0);
            f256(0.4, 0.45, 1);
            f227(FontRight);
            f144(f104(i, v145));
            f185();
        }
        f186(0, LineH, 0);
    }
    f185();
}
var v163;
var v296;
var v236 = -1;
var v117;
var v16;
var v94 = 0;

function f33(TimeInt) {
    var Minutes = Math.floor(TimeInt / 60 / 100);
    var Seconds = Math.floor((TimeInt - Minutes * 100 * 60) / 100);
    var Milisec = Math.floor(TimeInt - Seconds * 100 - Minutes * 100 * 60);
    var MinutesText = "" + Minutes;
    var SecondsText = "" + Seconds;
    var MiliText = "" + Milisec;
    if (Minutes < 10) var MinutesText = "0" + Minutes;
    if (Seconds < 10) var SecondsText = "0" + Seconds;
    if (Milisec < 10) var MiliText = "0" + Milisec;
    var TimerText = MinutesText + ":" + SecondsText + ":" + MiliText;
    return TimerText;
}
var v9 = 1;
var v12 = 5;

function f179() {
    var TrackToUnlock = -1;
    for (var i = 1; i < 13; i++) {
        if (Pref_User_Unlocked[i] == 0) {
            TrackToUnlock = i;
            break;
        }
    }
    if (TrackToUnlock == -1 && v245 != 1) {
        v245 = 1;
        v21 = v9;
        v35 = v12;
    }
    if (TrackToUnlock == -1) return;
    var CoinsToEarn = v60[TrackToUnlock] - Pref_User_COINS;
    v182 = v263;
    f183(2);
    f153();
    f183(3);
    f139(1.0, 1.0, 1.0, 0.9 * v182);
    f129(0, 123, v207, 550);
    f185();
    f183(2);
    f139(1.0, 1.0, 1.0, 1.0);
    f153();
    f186(v207 * 0.5, -300 + v182 * 403, 0);
    f256(0.4, 0.4, 1.0);
    f30("textures/track_" + TrackToUnlock + ".png");
    f185();
    f183(2);
    f153();
    f186(v207 * 0.5, -600 + v182 * 795, 0);
    f251(-2, 0, 0, 1);
    f256(0.6, 0.7, 1.0)
    f139(0.0, 0.0, 0.0, 1.0);
    f227(v234);
    f144(v271[TrackToUnlock]);
    f185();
    if (CoinsToEarn > 0) {
        f183(2);
        f153();
        f186(v207 * 0.5, -600 + v182 * 851, 0);
        f251(-2, 0, 0, 1);
        f256(0.6, 0.7, 1.0)
        f139(0.0, 0.0, 0.0, 0.8);
        f227(v234);
        f144(v287[82] + " " + CoinsToEarn);
        var CoinDecal = f156(v287[82] + " " + CoinsToEarn);
        f139(1.0, 1.0, 1.0, 1.0);
        f153();
        f186(+CoinDecal * 0.5 + 46, 91, -5);
        f256(1.8, -1.8, 0.01);
        f251(v249 * 2, 0, 1, 0);
        gl.enable(gl.DEPTH_TEST);
        f196(7);
        gl.disable(gl.DEPTH_TEST);
        f139(0.0, 0.0, 0.0, 1.0);
        f185();
        f186(0, 79, 0);
        f139(0.0, 0.0, 0.0, 0.8);
        f144(v287[83]);
        f185();
        f183(1);
        if (f89(81, 411 * v263) == 1 && v245 == 0) {
            f219(0);
            v245 = 1;
            v21 = v9;
            v35 = v12;
        }
    }
    if (CoinsToEarn < 1) {
        f183(2);
        f153();
        f186(v207 * 0.5, -600 + v182 * 851, 0);
        f251(-2, 0, 0, 1);
        f256(0.6, 0.7, 1.0)
        f139(0.0, 0.0, 0.0, 0.8);
        f227(v234);
        f144(v287[84] + " " + v60[TrackToUnlock]);
        var CoinDecal = f156(v287[84] + " " + v60[TrackToUnlock]);
        f139(1.0, 1.0, 1.0, 1.0);
        f153();
        f186(+CoinDecal * 0.5 + 46, 91, -5);
        f256(1.8, -1.8, 0.01);
        f251(v249 * 2, 0, 1, 0);
        gl.enable(gl.DEPTH_TEST);
        f196(7);
        gl.disable(gl.DEPTH_TEST);
        f139(0.0, 0.0, 0.0, 1.0);
        f185();
        f185();
        f183(1);
        if (f89(85, 331 * v263) == 1 && v245 == 0) {
            f219(0);
            f120(TrackToUnlock);
        }
        if (f89(86, 492 * v263) == 1 && v245 == 0) {
            f219(0);
            v245 = 1;
            v21 = v9;
            v35 = v12;
        }
    }
}

function f152() {
    if (v218 == 0) {
        if (Timer_Minutes == 0 && Timer_Seconds == 0 && Timer_Mili == 0) {
            Timer_Mili = 33;
            Timer_Seconds = 44;
            Timer_Minutes = 55;
        }
        v117 = parseInt(v242[v145]);
        v117 /= Car[0].Pos;
        v94 = Timer_Minutes * 100 * 60 + Timer_Seconds * 100 + Timer_Mili;
        if (Car[0].Pos > 3) v117 *= 0.5;
        v117 = Math.floor(v117);
        v16 = v117;
        v236 = -1;
        if (Car[0].Pos == 1) {
            v236 = 17;
            v296 = v287[29];
            v163 = v287[44];
        }
        if (Car[0].Pos == 2) {
            v236 = 18;
            v296 = v287[30];
            v163 = v287[45];
        }
        if (Car[0].Pos == 3) {
            v236 = 19;
            v296 = v287[31];
            v163 = v287[46];
        }
        if (Car[0].Pos == 4) {
            v296 = v287[32];
        }
        if (Car[0].Pos == 5) {
            v296 = v287[33];
        }
        if (Car[0].Pos == 6) {
            v296 = v287[34];
        }
        f183(2);
        f153();
        f186(v207 * 0.5, 300, 0);
        f256(1.8 * v182, 1.8 * v182, 1.5);
        if (Car[0].Pos < 4) {
            f183(2);
            f139(1.0, 1.0, 1.0, 1.0);
            f165(v236);
            f153();
            f186(57, -88, 0);
            f256(0.5, 0.5, 1.5);
            f251(5, 0, 0, 1);
            f227(v281);
            f139(1.5, 1.5, 1.5, 1.0);
            f144(v163);
            f186(-2, -8, 0);
            f139(0.0, 0.0, 0.0, 0.8);
            f144(v163);
            f185();
        } else {
            f186(0, -120, 0);
        }
        f227(v234);
        f186(0, 109, 0);
        f256(0.8, 0.8, 1.0);
        f139(0.0, 0.0, 0.0, 1.0);
        f144(v296);
        f186(-1, -3, 0);
        f139(1.5, 1.5, 1.5, 1.0);
        f144(v296);
        f185();
        v182 = 1;
        v183 = 1400;
        if (v182 == 1.0) {
            v183 += v262;
            if (v183 > 1400) {
                v183 = 0;
                v182 = 0;
                v218 = 1;
                if (Pref_User_Scores[v145] > v94 || Pref_User_Scores[v145] == 0)
                    Pref_User_Scores[v145] = v94;
                Pref_User_Scores[19] = 0;
                for (var i = 0; i < 19; i++) Pref_User_Scores[19] += (Pref_User_Scores[i] + i) * (i + 3);
                Save_UserPrefs();
                f163(v145, v94, 10);
            }
        }
    }
    if (v218 == 1) {
        f183(3);
        f139(1.0, 1.0, 1.0, 0.9 * v182);
        if (v117 == 0)
            f129(0, 123, v207, 550);
        else
            f129(0, 123, v207, 280);
        f183(2);
        f153();
        f186(v207 * 0.5, 300 - v182 * 220, 0);
        f256(1.8 * (1.0 - v182 * 0.6), 1.8 * (1.0 - v182 * 0.6), 1.5);
        if (Car[0].Pos < 4) {
            f183(2);
            f139(1.0, 1.0, 1.0, 1.0);
            f165(v236);
            f153();
            f186(57, -88, 0);
            f256(0.5, 0.5, 1.5);
            f251(5, 0, 0, 1);
            f227(v281);
            f139(1.5, 1.5, 1.5, 1.0);
            f144(v163);
            f186(-2, -8, 0);
            f139(0.0, 0.0, 0.0, 0.8);
            f144(v163);
            f185();
        } else {
            f186(0, -120, 0);
            f227(v234);
            f186(0, 109, 0);
            f256(0.8, 0.8, 1.0);
            f139(0.0, 0.0, 0.0, 1.0);
            f144(v296);
            f186(-1, -3, 0);
            f139(1.5, 1.5, 1.5, 1.0);
            f144(v296);
        }
        if (v182 == 1) {
            f186(0, 109, 0);
            f256(1.4, 1.4, 1.0);
            f227(v234);
            f139(0.0, 0.0, 0.0, 1.0);
            var CoinDecal = f156("" + v16);
            f144("" + v16);
            f139(1.0, 1.0, 1.0, 1.0);
            f153();
            f186(-CoinDecal * 0.5 - 33, 95, -5);
            f256(1.8, -1.8, 0.01);
            f251(v249 * 2, 0, 1, 0);
            gl.enable(gl.DEPTH_TEST);
            f196(7);
            gl.disable(gl.DEPTH_TEST);
            f139(0.0, 0.0, 0.0, 1.0);
            f185();
            v183 += v262;
            if (v183 > 100 && v117 > 100) {
                AddCoin(v207 * 0.5 - 50 + Math.random() * 100, 250);
                for (var i = 0; i < 99; i++) Pref_User_COINS++;
                v117 -= 100;
                v183 = 0;
            } else
            if (v183 > 100 && v117 > 20) {
                AddCoin(v207 * 0.5 - 50 + Math.random() * 100, 250);
                for (var i = 0; i < 19; i++) Pref_User_COINS++;
                v117 -= 20;
                v183 = 0;
            } else
            if (v183 > 100 && v117 > 0) {
                AddCoin(v207 * 0.5 - 50 + Math.random() * 100, 250);
                v117--;
                v183 = 0;
            }
            if (v117 == 0) {
                f186(0, 84, 0);
                f144(f33(v94));
                if (Pref_User_Scores[v145] > 0) {
                    f186(0, 130, 0);
                    f144(f33(Pref_User_Scores[v145]));
                    f139(0.0, 0.0, 0.0, 0.5);
                    f153();
                    f186(0, -35, 0);
                    f256(0.6, 0.6, 1);
                    f144(v287[80]);
                    f185();
                    f139(0.0, 0.0, 0.0, 1.0);
                }
            }
        }
        f185();
        if (v117 == 0) {
            f139(1.0, 1.0, 1.0, 1.0);
            f153();
            f186(v207 * 0.5 - 165, 546, 0);
            f256(0.6, 0.6, 1);
            f30("textures/try1.png");
            f185();
            f153();
            f186(v207 * 0.5, 546, 0);
            f256(0.6, 0.6, 1);
            f30("textures/try2.png");
            f185();
            f153();
            f186(v207 * 0.5 + 165, 546, 0);
            f256(0.6, 0.6, 1);
            f30("textures/try3.png");
            f185();
            if (v215 == 1 && v313 > v207 * 0.5 - 82 * 3 && v313 < v207 * 0.5 - 82 && v312 > 440 && v312 < 650) {
                v218 = 0;
                v183 = 0;
                v94 = 0;
                f219(0);
                v245 = 1;
                v21 = 2;
                v35 = 5;
            }
            if (v215 == 1 && v313 > v207 * 0.5 - 82 && v313 < v207 * 0.5 + 82 && v312 > 440 && v312 < 650) {
                v218 = 0;
                v183 = 0;
                v94 = 0;
                f219(0);
                v9 = 999;
                v12 = 10;
                v208 = 9;
            }
            if (v215 == 1 && v313 > v207 * 0.5 + 82 && v313 < v207 * 0.5 + 82 * 3 && v312 > 440 && v312 < 650) {
                v218 = 0;
                v183 = 0;
                v94 = 0;
                f219(0);
                v9 = 1;
                v12 = 5;
                v208 = 9;
            }
        }
    }
    if (v182 < 1.0) v182 += v262 * 0.002;
    if (v182 > 1.0) v182 = 1.0;
}
var v55 = 0;

function f149() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.8);
    f129(0, 0, v207, 700);
    f183(2);
    f153();
    f186(v207 * 0.5, 300, 0);
    f256(0.8, 0.8, 1);
    f139(1.5, 1.5, 1.5, 1.0);
    f227(v234);
    f144(v287[25]);
    f256(0.8, 0.8, 1);
    f186(0, 120, 0);
    f139(0.5, 0.5, 0.5, 1.0);
    f144(v287[26]);
    f185();
}

function f158(ImageID, x, y) {
    var Mx = v313;
    var My = v312;
    f139(1.0, 1.0, 1.0, 1.0);
    f153();
    f186(x, y, 0);
    f165(ImageID);
    f185();
    if (v215 == 1 &&
        Mx > x - GLTexture[ImageID].image.width * 0.5 &&
        Mx < x + GLTexture[ImageID].image.width * 0.5 &&
        My > y - GLTexture[ImageID].image.height * 0.5 &&
        My < y + GLTexture[ImageID].image.height * 0.5
    ) return 1;
    return 0;
}

function f208() {
    if (f214(19, 200 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = 1;
        v35 = -1;
    }
    if (f214(20, 380 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = 2;
        v35 = -1;
    }
    var BoingLogo = 1.0 + Math.cos(v257 / 57.2957795 * 3) * 0.01;
    if (v207 < 610) BoingLogo *= 0.9;
    if (v207 < 560) BoingLogo *= 0.9;
    f153();
    f186(v207 * 0.5, 135 * v263, 0);
    f251(v263 * 180 + 180, 0, 0, 1);
    f183(2);
    f256(BoingLogo, BoingLogo, 1.0);
    f186(0, -5, 0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(5);
    f185();
    /*
    if ( f158(32, v207-124,642)==1)
    {
    f19();
    }
    */
    if (f158(16 - Pref_User_Sound, v207 - 50, 50) == 1) {
        Pref_User_Sound = 1 - Pref_User_Sound;
        Save_UserPrefs();
    }
    if (f158(20, v207 - 50, 130) == 1) {
        v245 = 1;
        v21 = 6;
        v35 = -1;
    }
    v265 = "Nop"; {
        f153();
        f186(v207 * 0.5, 598, 0);
        f256(0.5, 0.5, 1.0);
        if (v207 < 929) f256(0.75, 0.8, 1.0);
        f227(v234);
        f139(0, 0, 0, 0.8);
        f144(v287[77]);
        f186(0, 78, 0);
        f144(v287[78]);
        f227(v234);
        f139(1.5, 1.5, 1.5, 1.0);
        f186(0, -88, 0);
        f144(v287[77]);
        f186(0, 78, 0);
        f144(v287[78]);
        f185();
        if (f137(0, 575, v207, 710) == 1) {
            v265 = window.famobi.config.aid == "A-O7SKJ" ? "" : "http://games.famobi.com";
        } {}
    }
}
var v243 = 0;

function f173() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    v243 *= 0.9;
    if (v245 == 0 && v215 == 1 && v312 > 155 && v313 > v207 - 200) {
        v145++;
        v243 = 1;
    }
    if (v245 == 0 && v215 == 1 && v312 > 155 && v313 < 200) {
        v145--;
        v243 = -1;
    }
    if (v145 > v275) v145 = 1;
    if (v145 < 1) v145 = v275;
    var PosY = 170 * v263;
    var LineH = 60 * v263;
    f153();
    f186(20, PosY, 0);
    f251(-2, 0, 0, 1);
    var BoingLogo = Math.cos(v257 / 57.2957795 * 5) * 3.0;
    f153();
    f186(v207 - 65 - BoingLogo, 246 * v263, 0);
    f183(2);
    f256(-0.9, 3.7, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    f153();
    f186(8 + BoingLogo, 246 * v263, 0);
    f183(2);
    f256(0.9, 3.7, 1.0);
    f139(1.0, 1.0, 1.0, 1.0);
    f165(14);
    f185();
    f186(v243 * v207, 0, 0);
    f153();
    f186(v207 - 110, -78, 0);
    f256(0.8, 0.8, 1);
    if (v207 < 750) f256(0.8, 0.9, 1);
    if (v207 < 600) f256(0.9, 1.0, 1);
    f139(1.5, 1.5, 1.5, 1.0);
    if (v145 == 0) {
        f227(FontRight);
        f144(v287[23]);
    } else {
        f139(1.5, 1.5, 1.5, 1.0);
        f227(FontRight);
        f144(v287[24]);
        var FontWi = f156(v287[24]);
        f186(-FontWi, 0, 0);
        f144(v271[v145]);
        FontWi = f156(v271[v145]);
        f153();
        f139(1.0, 1.0, 1.0, 1.0);
        f186(-FontWi - 45, 50, 0);
        f256(0.20, 0.19, 1.0);
        f30("textures/track_" + v145 + ".png");
        f185();
    }
    f185();
    var SwapBack = 0;
    for (var i = 0; i < 8; i++) {
        SwapBack = 1 - SwapBack;
        if (SwapBack == 1) {
            f183(3);
            f139(1.0, 1.0, 1.0, 0.2);
            f129(-v207 * 2, 0, v207 * 3, LineH);
            f183(2);
        }
        f186(100 * v243, 0, 0);
        var TextScale = 0.95;
        if (v207 < 600) TextScale = 0.75;
        if (v207 < 550) TextScale = 0.7;
        if (v207 < 505) TextScale = 0.6;
        var DecalName = 35;
        f139(2.0, 2.0, 0.0, 1.0);
        if ((i < 7 && f135(i, v145) > 0) || (i == 7 && parseInt(Pref_User_Scores[v145]) > 0 && parseInt(f45(v145)) > 0)) {
            f153();
            f186(45, 10, 0);
            f256(0.45 * TextScale, 0.45, 1)
            var RankText = "" + f135(i, v145);
            var AvatarID = f98(i, v145);
            if (i == 7) RankText = "" + f45(v145);
            if (i == 7) AvatarID = v45;
            if (AvatarID < 1 || AvatarID > 24) AvatarID = 1;
            f227(v281);
            f144(RankText);
            var FontWi = TextScale * ((f156(RankText)) * 0.45 + 10);
            if (DecalName < FontWi) DecalName = FontWi;
            f185();
            if (v207 > 670) {
                f139(1.0, 1.0, 1.0, 1.0);
                f153();
                f186(DecalName + 68, 30, 0);
                f256(0.42, 0.42, 1);
                f30("textures/avatars/" + AvatarID + ".jpg");
                f185();
                DecalName += 51;
            }
            f139(2.0, 2.0, 2.0, 1.0);
            var ScoreName = f132(i, v145);
            var ScoreScore = f104(i, v145);
            if (i == 7) {
                f139(2.0, 2.0, 0.0, 1.0);
                ScoreName = "" + v97;
                ScoreScore = "" + Pref_User_Scores[v145];
            }
            f153();
            f186(45 + DecalName, 0, 0);
            f256(0.6 * TextScale, 0.6, 1);
            f227(v281);
            f144(ScoreName);
            f185();
            f153();
            f186(v207 - 110, 0, 0);
            f256(0.6 * TextScale, 0.6, 1);
            f227(FontRight);
            f144(f33(ScoreScore));
            f185();
        }
        f186(0, LineH, 0);
    }
    f185();
    f183(1);
    f214(0, 640 * v263);
    f214(0, 640 * v263 - 740);
    if (f215() == 1) {
        v245 = 1;
        v21 = 0;
        v35 = -1;
    }
}

function f206() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.6 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    f214(0, 650 + (1 - v263) * 50);
    f214(0, 640 * v263 - 730);
    f227(v234);
    f153();
    f186(v207 * 0.5, 110, 0);
    f251(-2, 0, 0, 1);
    f256(0.25 * (v263 + 1), 0.5, 1);
    if (v207 < 610) f256(0.8, 0.9, 1);
    f139(2.0, 2.0, 0.0, 0.8);
    f144(v287[52]);
    f186(0, 90, 0);
    f139(3.0, 3.0, 3.0, 1.5);
    f144(v287[53]);
    f186(0, 120, 0);
    f139(2.0, 2.0, 0.0, 0.8);
    f144(v287[54]);
    f186(0, 90, 0);
    f139(3.0, 3.0, 3.0, 1.5);
    f144(v287[55]);
    f186(0, 120, 0);
    f139(2.0, 2.0, 0.0, 0.8);
    f144(v287[56]);
    f186(0, 90, 0);
    f139(3.0, 3.0, 3.0, 1.5);
    f144(v287[57]);
    f186(0, 503, 0);
    f139(3.0, 3.0, 3.0, 1.5);
    f144(v287[76]);
    f186(0, -201, 0);
    f256(1.8, 1.8, 1);
    f139(1.0, 1.0, 1.0, 1.0);
    f30("textures/about_pic.png");
    f185();
    if (f215() == 1) {
        v245 = 1;
        v21 = 0;
        v35 = -1;
    }
}

function f205() {
    f183(3);
    f139(0.0, 0.0, 0.0, 0.8 * v263);
    f129(0, 0, v207, 700);
    f183(1);
    if (f89(58, 200 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = -1;
        v35 = 21;
    }
    if (f89(59, 350 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = -1;
        v35 = 10;
        f216(1);
    }
    if (f89(60, 500 * v263) == 1 && v245 == 0) {
        f219(0);
        v245 = 1;
        v21 = 0;
        v35 = 1;
        f216(1);
    }
    f227(v234);
    f153();
    f186(v207 * 0.5, 75, 0);
    f251(-2, 0, 0, 1);
    f256(0.5 * (v263 + 1), 1.0, 1);
    f139(2.0, 2.0, 2.0, 0.8);
    f144(v287[61]);
    f186(0, 90, 0);
    f185();
}

function f244() {
    f166();
    switch (v208) {
        case 0:
            f208();
            break;
        case 1:
            f103();
            break;
        case 100:
            f74();
            break;
        case 2:
            f173();
            break;
        case 3:
            f149();
            break;
        case 4:
            f152();
            break;
        case 5:
            f180();
            break;
        case 6:
            f206();
            break;
        case 7:
            f205();
            break;
        case 8:
            f91();
            break;
        case 9:
            f179();
            break;
            f74
    }
    if (v245 == 0) {
        if (v263 < 1) {
            v263 += v262 * 0.005;
            if (v263 > 1) v263 = 1;
        }
    }
    if (v245 == 1) {
        if (v263 > -1) {
            v263 -= v262 * 0.01;
            if (v263 < -1) v263 = -1;
        }
    }
    if (v245 == 1 && v263 == -1) {
        v245 = 0;
        if (v21 != -1) {
            v208 = v21;
            v21 = -1;
        }
        if (v35 != -1) {
            v214 = v35;
            v35 = -1;
        }
    }
    v257 += v262 * 0.1;
    if (v257 > 360) v257 -= 360;
}
var LoaderPosition = 0;
var v177 = 0;
var v106 = 0;
var v282 = [];

function f6() {
    v106 = -1;
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {

        var protocolRegex = new RegExp('^file:', 'i');
        var isFileProtocol = protocolRegex.test(xmlhttp.responseURL);

        if (xmlhttp.readyState == 4
                && (xmlhttp.status == 200 || (isFileProtocol && xmlhttp.status == 0))) {
            var str = xmlhttp.responseText;
            var OneLine = str.split('\n');
            if (OneLine.length < 3) return;
            var TextID = 0;
            for (i = 0; i < OneLine.length; i++) {
                var test_str = OneLine[i];
                var start_pos = test_str.indexOf('"') + 1;
                var end_pos = test_str.indexOf('"', start_pos);
                var text_to_get = test_str.substring(start_pos, end_pos)
                if (text_to_get.length > 4) {
                    v282[TextID] = text_to_get;
                    TextID++;
                }
            }
            v106 = 1;
        }
    }
    var TimeStamp = new Date().getTime();
    xmlhttp.open("GET", "datas/resources.txt?" + TimeStamp, true);
    xmlhttp.send();
}
var v280 = 0;
var v314 = 0;
var v315 = 0;

function f171() {
    if (v106 == 0) f6();
    if (v106 == -1 || v177 > 5) return 0;
    if (v232 == 0) return 1;
    var v282Count = v282.length;
    if (v282Count == LoaderPosition && DataToDownload == 0) v177++;
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    f166();
    var CenterX = v207 * 0.5;
    var CenterY = v142 * 0.5;
    var Pourcentage = Math.floor((LoaderPosition / v282Count) * 100);
    if (LoaderPosition < 3 && DataToDownload > 0) return 1;
    if (LoaderPosition > 2) {
        f183(2);
        f153();
        f186(CenterX, CenterY, 0);
        f256(0.6, 0.6, 1.0)
        f139(0.0, 0.0, 0.0, 0.5);
        for (var r = 0; r < 360; r += 15) {
            f153();
            f251(r + 180, 0, 0, 1);
            f186(0, -128, 0);
            f165(0);
            f185();
        }
        f139(1.0, 1.0, 1.0, 1.0);
        for (var r = 0; r < 360; r += 15) {
            if (Pourcentage > r / 3.6) {
                f153();
                f186(0, -10, 0);
                f251(r + 180, 0, 0, 1);
                f186(0, -128, 0);
                f165(0);
                f185();
            }
        }
        f185();
    }
    f183(2);
    f139(2.0, 2.0, 2.0, 0.2);
    /*
    f153();
    f186 (CenterX, v142-50, 0);
    f256(0.35,0.35,1.0);
    f227(v234);
    f144("Powered By DanLabGames WBGL Engine");
    f185();
    */
    f153();
    f186(CenterX, CenterY - 60, 0);
    f256(1.1, 1.1, 1.1);
    f227(v234);
    f139(0.0, 0.0, 0.0, 1.0);
    f144(Pourcentage + "%");
    f186(0, -5, 0);
    f139(2.0, 2.0, 2.0, 1.0);
    f144(Pourcentage + "%");
    f185();

    window.famobi.setPreloadProgress(Pourcentage);
    /*
    f183(3);
    f139 (1.0, 1.0, 1.0,0.2);
    f129(CenterX-205,CenterY-5, CenterX+205, CenterY+15);
    var VumeterWidth=(LoaderPosition/v282Count)*400;
    f139 (1.0, 1.0, 1.0,1.0);
    f129(CenterX-200,CenterY, CenterX-200+VumeterWidth, CenterY+10);
    */
    if (DataToDownload < 6 && LoaderPosition < v282Count) {
        var DataPath = v282[LoaderPosition];
        var isPNG = DataPath.search(".png");
        var isJPG = DataPath.search(".jpg");
        if (isPNG > 0 || isJPG > 0) {
            GLTexture[v280] = f116(v280, "textures/" + DataPath);
            v280++;
            LoaderPosition++;
            return 1;
        }
        var isOBJ = DataPath.search(".obj");
        if (isOBJ > 0) {
            f188(v314, DataPath);
            v314++;
            LoaderPosition++;
            return 1;
        }
        var isSND = DataPath.search(".snd");
        if (isSND > 0) {
            f222(v315, "datas/sounds/" + DataPath);
            v315++;
            LoaderPosition++;
            return 1;
        }
    }
    return 1;
}
var gl;
var v151;
var v286 = 0;
var v176 = 600;
var v149 = 300;
var v51 = 1.5;

function f154() {
    if (f72() == 0) return;
    if (f171() == 1) return;
    f79();
    v95 = 0;
    v221 += v262;
    if (v221 > 50) {
        v221 -= 50;
        v239 = 1 - v239;
    }
    v186 += v262;
    if (v186 > 250) {
        v186 -= 250;
        v185 = 1 - v185;
    }
    f245();
}
var v39;
var v34;

function f118() {
    gl.bindTexture(gl.TEXTURE_2D, v34);
}

function f29(width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    return texture;
}

function f237(width, height) {
    v34 = f29(width, height);
    v39 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, v39);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, v34, 0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    famobi.log("f237");
}

function f258() {
    if(!gamePaused) {
        f154();
    }
}
var fps = 60;

function f236() {
    var timeNow = new Date().getTime();
    var elapsed = timeNow - (v286 || timeNow);
    if (elapsed > 45) elapsed = 45;
    if (elapsed < 0.001) elapsed = 0.001;
    v262 = elapsed;
    requestAnimationFrame(f236);
    f258();
    v286 = timeNow;
}

function f199() {
    famobi.log("f199");
    if (!gl) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        for (var ii = 0; ii < names.length; ++ii) {
            if (!gl)
                try {
                    gl = v151.getContext(names[ii], {
                        antialias: false,
                        alpha: false,
                        stencil: false,
                        preserveDrawingBuffer: true
                    });
                    gl.viewportWidth = v176;
                    gl.viewportHeight = v149;
                    famobi.log("WebGL Init with: " + names[ii]);
                    famobi.log("WebGL Size: " + v176 + "x" + v149);
                } catch (e) {}
        }
        if (!gl) {
            v151.style.display = "none";
            document.getElementById("dlg-error-div").style.display = "block"
            Stanislic_SendInfo("WebGL_Error");
        }
    }
}
var v31 = 1;

function f128() {

    setTimeout(function() {
        v176 = f114();
        v149 = f96();
        v151.style.width = v176;
        v151.style.height = v149;
        v31 = window.devicePixelRatio || 1;
        if (v31 > 1) v51 = 1.0;
        if (v31 > 1) v31 *= 0.8;
        if (v79 == 1) v51 = 1.0;
        v151.width = v176 * devicePixelRatio * v51;
        v151.height = v149 * devicePixelRatio * v51;
        famobi.log("Screen:" + v176 + "x" + v149);
    }, 250);
}

function f161() {
    f128()
    if (!gl) return;
    gl.viewportWidth = v176;
    gl.viewportHeight = v149;
}
window.onresize = function() {
    f161();
    v151.focus();
}

function DLG_WebGLStart() {
    f76();
    f7();
    f262();
    Stanislic_Start();
    f248();
    f230();
    v151 = document.getElementById("dlg-webgl-canvas");
    f128();
    f199();
    f40();
    f145();
    f162();
    f231();
    f223();
    f217();
    f51();
    f127();
    f194();
    f221();
    f236();
}; // Compressed with KorbenDallasMultiPack
