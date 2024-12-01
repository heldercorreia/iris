var ColorChannel = {
    Red: 0,
    Green: 1,
    Blue: 2
}

var ResizeMode = {
    Grow: 0,
    Shrink: 1,
    Full: 2
}

var g_canvas = document.getElementById("canvas");
var g_context = g_canvas.getContext("2d");
var g_size = viewport();
var g_width = g_size.width;
var g_height = g_size.height;
var g_area = g_width * g_height;
var g_maxDimension = Math.max(g_width, g_height);

var g_buffer;
var g_pattern;
var g_patternBaseFunction;
var g_palette = new Uint8Array(256);

var g_timerInterval = 1000 / 60;
var g_animationTimer = null;

var g_baseColorChannel = ColorChannel.Blue;
var g_angleFunction = Math.sin;

var g_a1, g_a2, g_b1 = -4, g_b2;

var g_colorComponent = 0;

var g_fps = 0;
var g_lastFps = 0;

var g_currentPatternPreset;
var g_patternPresets = [
    { a1:   20, a2:   0.15, b1:  100, b2:   0.015, f: Math.sin },
    { a1:  -58, a2: -0.008, b1:    4, b2: -0.1146, f: Math.sin },
    { a1:   -2, a2: -0.032, b1:  404, b2: -0.0007, f: Math.tan },
    { a1:  -58, a2: -0.002, b1:    4, b2: -0.1146, f: Math.sin },
    { a1:  -38, a2:  0.002, b1:   12, b2: -0.0662, f: Math.sin },
    { a1:   -2, a2: -0.148, b1:  -36, b2: -0.0023, f: Math.sin },
    { a1:   -2, a2: -0.032, b1:  404, b2: -0.0007, f: Math.tan },
    { a1:  -34, a2:  0.092, b1: 1780, b2: -0.0007, f: Math.sin },
    { a1:  130, a2:  0.002, b1:  -12, b2:  -0.043, f: Math.sin },
    { a1:  -58, a2: -0.002, b1:   -4, b2: -0.0138, f: Math.sin }
]

function setPatternPreset(p) {
    g_a1 = g_patternPresets[p].a1;
    g_a2 = g_patternPresets[p].a2;
    g_b1 = g_patternPresets[p].b1;
    g_b2 = g_patternPresets[p].b2;
    g_angleFunction = g_patternPresets[p].f;
    g_currentPatternPreset = p;
    setUp();
}

function setUp() {
    var _a1 = g_a1, _a2 = g_a2, _b1 = g_b1, _b2 = g_b2;
    var _width = g_width, _height = g_height;
    var _angleFunction = g_angleFunction;
    var _maxDimension = g_maxDimension;
    var _f = g_patternBaseFunction;
    var _cos = Math.cos;
    var x;

    for (x = 0; x < _maxDimension; ++x)
        _f[x] = _a1 * _angleFunction(x * _a2) + _b1 * _cos(x * _b2);

    var _palette = g_palette;
    var _colorComponent = g_colorComponent;

    for (x = 0; x < 128; ++x, _colorComponent += 2)
        _palette[x] = _palette[255-x] = _colorComponent;

    var _pattern = g_pattern;
    var _abs = Math.abs;
    var y;

    for (y = 0; y < _height; ++y)
        for (x = 0; x < _width; ++x)
            _pattern[y * _width + x] = _abs(_f[x] + _f[y]) % 255;
}

function setAngleFunction(f) {
    g_angleFunction = f;
    setUp();
}

function setBaseColorChannel(c) {
    if (c == ColorChannel.Red)
        g_baseColorChannel = ColorChannel.Red;
    else if (c == ColorChannel.Green)
        g_baseColorChannel = ColorChannel.Green;
    else if (c == ColorChannel.Blue)
        g_baseColorChannel = ColorChannel.Blue;
    setUp();
}

function toggleAnimation() {
    if (g_animationTimer) {
        clearInterval(g_animationTimer);
        g_animationTimer = null;
    } else
        g_animationTimer = setInterval(paint, g_timerInterval);
}

function resize(mode) {
    if (g_animationTimer)
        toggleAnimation();

    var _width, _height;

    if (mode == ResizeMode.Grow) {
        _width = Math.round(g_width * 1.2);
        _height = Math.round(g_height * 1.2);
    } else if (mode == ResizeMode.Shrink) {
        _width = Math.round(g_width * 0.8);
        _height = Math.round(g_height * 0.8);
    } else if (mode == ResizeMode.Full) {
        g_size = viewport();
        _width = g_size.width;
        _height = g_size.height;
    }

    g_canvas.width = _width;
    g_canvas.height = _height;
    g_area = _width * _height;
    g_maxDimension = Math.max(_width, _height);
    g_patternBaseFunction = new Uint8Array(g_maxDimension);
    g_pattern = new Uint8Array(_width * _height);
    g_context.fillStyle = "#000";
    g_context.fillRect(0, 0, _width, _height);
    g_buffer = g_context.getImageData(0, 0, _width, _height);

    g_width = _width;
    g_height = _height;

    setUp();
    if (g_animationTimer == null)
        toggleAnimation();
}

function paint() {
    var _palette = g_palette;
    var i;

    for (i = 0; i < 255; ++i)
        _palette[i] = _palette[i+1];
    _palette[255] = _palette[0];

    var _data = g_buffer.data;
    var _pattern = g_pattern;
    var _area = g_area;
    var j;

    for (i = 0, j = g_baseColorChannel; i < _area; ++i, j += 4)
        _data[j] = _palette[_pattern[i]];

    var _context = g_context;
    _context.putImageData(g_buffer, 0, 0);
    _context.fillRect(0, 0, 20, 20);
    _context.fillStyle = '#fff';
    _context.fillText(g_lastFps, 4, 14);
    _context.fillStyle = '#000';
    ++g_fps;
}

function updateFps() {
    g_lastFps = g_fps;
    g_fps = 0;
}

function onKeyEvent(ev) {
    var k = ev.keyCode;
    switch (k) {
        case 65:  /* 'A' */ g_b2 -= 0.0008; setUp(); break;
        case 97:  /* 'a' */ g_a2 -= 0.002;  setUp(); break;
        case 87:  /* 'W' */ g_b1 += 8;      setUp(); break;
        case 119: /* 'w' */ g_a1 += 2;      setUp(); break;
        case 68:  /* 'D' */ g_b2 += 0.0008; setUp(); break;
        case 100: /* 'd' */ g_a2 += 0.002;  setUp(); break;
        case 88:  /* 'X' */ g_b1 -= 8;      setUp(); break;
        case 120: /* 'x' */ g_a1 -= 2;      setUp(); break;

        case 110: /* 'N' */ case 78: /* 'n' */ resize(ResizeMode.Shrink); break;
        case 109: /* 'M' */ case 77: /* 'm' */ resize(ResizeMode.Grow); break;
        case 102: /* 'F' */ case 70: /* 'f' */ resize(ResizeMode.Full); break;

        case 104: /* 'H' */ case 72: /* 'h' */ toggleAnimation(); break;

        case 117: /* 'U' */ case 85: /* 'u' */ setAngleFunction(Math.atan); break;
        case 116: /* 'T' */ case 84: /* 't' */ setAngleFunction(Math.tan); break;
        case 115: /* 'S' */ case 83: /* 's' */ setAngleFunction(Math.sin); break;

        case 114: /* 'R' */ case 82: /* 'r' */ setBaseColorChannel(ColorChannel.Red); break;
        case 103: /* 'G' */ case 71: /* 'g' */ setBaseColorChannel(ColorChannel.Green); break;
        case 98:  /* 'B' */ case 66: /* 'b' */ setBaseColorChannel(ColorChannel.Blue); break;

        case 48: /* '0' */ setPatternPreset(0); break;
        case 49: /* '1' */ setPatternPreset(1); break;
        case 50: /* '2' */ setPatternPreset(2); break;
        case 51: /* '3' */ setPatternPreset(3); break;
        case 52: /* '4' */ setPatternPreset(4); break;
        case 53: /* '5' */ setPatternPreset(5); break;
        case 54: /* '6' */ setPatternPreset(6); break;
        case 55: /* '7' */ setPatternPreset(7); break;
        case 56: /* '8' */ setPatternPreset(8); break;
        case 57: /* '9' */ setPatternPreset(9); break;
    }
}

function onKeyDownEvent(ev) {
    var k = ev.keyCode;
    switch (k) {
    }
}

function randomizeEffects() {
    var colorChannel, preset;
    do {
        colorChannel = Math.floor(Math.random()*3);
    } while (colorChannel == g_baseColorChannel)
    do {
        preset = Math.floor(Math.random()*10);
    } while (preset == g_currentPatternPreset)
    setBaseColorChannel(colorChannel);
    setPatternPreset(preset);
}

function start() {
    window.onresize = function() {
        resize(ResizeMode.Full);
    }
    document.onkeydown = onKeyEvent;
    resize(ResizeMode.Full);
    setBaseColorChannel(Math.floor(Math.random()*3))
    setPatternPreset(Math.floor(Math.random()*10));
    setInterval(randomizeEffects, 3000);
    setInterval(updateFps, 1000);
}

start();
