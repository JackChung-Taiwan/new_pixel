player.onChat("中文", function () {
    chinesePixel.drawText(
        "你好麥塊",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Blue,
        1,
        1
    )
})

player.onChat("直排", function () {
    chinesePixel.drawVerticalText(
        "翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        ChinesePixelFont.Bold,
        1,
        1
    )
})

player.onChat("字型", function () {
    chinesePixel.drawTextWithFont(
        "程式設計",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Red,
        ChinesePixelFont.Outline,
        1,
        1
    )
})
