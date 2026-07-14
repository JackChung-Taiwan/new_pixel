player.onChat("右到左", function () {
    chinesePixel.drawText(
        "你好麥塊",
        pos(0, 1, 5),
        SOUTH,
        ChinesePixelColor.Blue,
        1,
        4
    )
})

player.onChat("直排", function () {
    chinesePixel.drawVerticalText(
        "翊華教育",
        pos(0, 1, 5),
        SOUTH,
        ChinesePixelColor.Black,
        1,
        4
    )
})
