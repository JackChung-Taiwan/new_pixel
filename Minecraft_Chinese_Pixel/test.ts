player.onChat("中文", function () {
    chinesePixel.drawText(
        "台北市",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Blue,
        1,
        4
    )
})

player.onChat("直排", function () {
    chinesePixel.drawVerticalText(
        "翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        1,
        4
    )
})
