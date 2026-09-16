function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
    var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

// Background: #0f172a
const bg = [15, 23, 42];

// Label Text: text-slate-300 = #cbd5e1 = 203, 213, 225
const label = [203, 213, 225];
console.log("Label contrast:", contrast(bg, label));

// Input Background is bg-slate-950/50 (#020617 @ 50%) over #0f172a
// 0.5 * 2 + 0.5 * 15 = 8.5
// 0.5 * 6 + 0.5 * 23 = 14.5
// 0.5 * 23 + 0.5 * 42 = 32.5
const inputBg = [8.5, 14.5, 32.5];

// Input Text: text-white = #ffffff
const inputText = [255, 255, 255];
console.log("Input contrast:", contrast(inputBg, inputText));
