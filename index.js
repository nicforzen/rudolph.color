

exports.fromHexString = function (hexColor) { return _fromHexString(hexColor); }
exports.fromRgb = function (r, g, b) { return _fromRgb(r, g, b); }
exports.fromArgb = function (a, r, g, b) { return _fromArgb(a, r, g, b); }
exports.fromHsv = function (h, s, v) { return _fromHsv(h, s, v); }
exports.WHITE = _fromHexString("#FFFFFF")
exports.BLACK = _fromHexString("#000000")
exports.RED = _fromHexString("#FF0000")
exports.GREEN = _fromHexString("#00FF00")
exports.BLUE = _fromHexString("#0000FF")
exports.GREY = _fromHexString("#808080")
exports.GRAY = _fromHexString("#808080")
exports.DARKGREY = _fromHexString("#333333")
exports.LIGHTGREY = _fromHexString("#666666")
exports.DARKGRAY = _fromHexString("#333333")
exports.LIGHTGRAY = _fromHexString("#666666")
exports.MAGENTA = _fromHexString("#FF00FF")
exports.ORANGE = _fromHexString("#FFA500")
exports.YELLOW = _fromHexString("#FFFF00")
exports.TEAL = _fromHexString("#008080")
exports.PINK = _fromHexString("#FFC0CB")
exports.PURPLE = _fromHexString("#A020F0")
exports.TRANSPARENT = _fromHexString("#FF000000")

function _fromRgb(r, g, b) {
    if (r === undefined || g === undefined || b === undefined) {
        throw "Must provide rgb values"
    }
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
        throw "Rgb values out of range [0, 255]"

    let hexColor = "#" + _channelToHexString(r) + _channelToHexString(g)
        + _channelToHexString(b)

    let hsv = _rgbToHsv(r, g, b)

    return {
        a: 255,
        r: r,
        g: g,
        b: b,
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        hexString: hexColor.toUpperCase()
    }
}

function _fromHsv(h, s, v) {
    if (h === undefined || s === undefined || v === undefined) {
        throw "Must provide rgb values"
    }
    if (h < 0 || h > 360)
        throw "Hue value out of range [0, 360]"
    if (s < 0 || s > 1)
        throw "Saturation value out of range [0, 1]"
    if (v < 0 || v > 1)
        throw "Color Value out of range [0, 1]"

    let rgb = _hsvToRgb(h, s, v)

    let hexColor = "#" + _channelToHexString(rgb.r) + _channelToHexString(rgb.g)
        + _channelToHexString(rgb.b)

    return {
        a: 255,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        h: h,
        s: s,
        v: v,
        hexString: hexColor.toUpperCase()
    }
}

function _fromArgb(a, r, g, b) {
    if (a === undefined || r === undefined || g === undefined
        || b === undefined) {
        throw "Must provide rgb values"
    }
    if (a < 0 || a > 255 || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255)
        throw "Argb values out of range [0, 255]"

    let hexColor = "#" + _channelToHexString(a) + _channelToHexString(r)
        + _channelToHexString(g) + _channelToHexString(b)

    let hsv = _rgbToHsv(r, g, b)

    return {
        a: a,
        r: r,
        g: g,
        b: b,
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        hexString: hexColor.toUpperCase()
    }
}

function _fromHexString(hexColor) {
    if (!hexColor) throw "Must give hex color"
    if (!hexColor.startsWith("#")) throw "Hex color must start with #"
    if (hexColor.length == 1) throw "No number"
    let hString = hexColor.substring(1)
    let number = parseInt(hString)
    if (number === NaN) throw "Invalid hex string: " + hexColor
    let reg = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
    if (!hexColor.match(reg)) throw "Invalid hex string: " + hexColor

    let a = 255
    let r = 0
    let g = 0
    let b = 0
    if (hString.length == 3) {
        r = parseInt(hString[0] + hString[0], 16)
        g = parseInt(hString[1] + hString[1], 16)
        b = parseInt(hString[2] + hString[2], 16)
        hexColor = "#" + hString[0] + hString[0]
            + hString[1] + hString[1]
            + hString[2] + hString[2]
    } else if (hString.length == 4) {
        a = parseInt(hString[0] + hString[0], 16)
        r = parseInt(hString[1] + hString[1], 16)
        g = parseInt(hString[2] + hString[2], 16)
        b = parseInt(hString[3] + hString[3], 16)
        hexColor = "#" + hString[0] + hString[0]
            + hString[1] + hString[1]
            + hString[2] + hString[2]
            + hString[3] + hString[3]
    } else if (hString.length == 6) {
        r = parseInt(hString.substring(0, 2), 16)
        g = parseInt(hString.substring(2, 4), 16)
        b = parseInt(hString.substring(4, 6), 16)
    } else if (hString.length == 8) {
        a = parseInt(hString.substring(0, 2), 16)
        r = parseInt(hString.substring(2, 4), 16)
        g = parseInt(hString.substring(4, 6), 16)
        b = parseInt(hString.substring(6, 8), 16)
    } else {
        throw "Invalid length hex string"
    }

    if (a == NaN || r == NaN || g == NaN || b == NaN) {
        throw "Color parse failed"
    }

    let hsv = _rgbToHsv(r, g, b)

    return {
        a: a,
        r: r,
        g: g,
        b: b,
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        hexString: hexColor.toUpperCase()
    }
}

function _rgbToHsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s),
        v: percentRoundFn(v)
    };
}

function _hsvToRgb(h, s, v) {
    h /= 360
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)
    }
}

function _channelToHexString(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

