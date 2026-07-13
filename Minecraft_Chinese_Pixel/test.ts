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

player.onChat("看板", function () {
    chinesePixel.drawBoard(
        "歡迎來到翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        ChinesePixelColor.White,
        ChinesePixelFont.Bold,
        1,
        1,
        2
    )
})

player.onChat("發光", function () {
    chinesePixel.drawGlowText(
        "任務開始",
        pos(0, 1, 5),
        EAST,
        ChinesePixelFont.Bold,
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
        ChinesePixelMaterial.Concrete,
        ChinesePixelFont.Bold,
        1,
        1
    )
})

player.onChat("彩虹", function () {
    chinesePixel.drawRainbowText(
        "彩虹麥塊",
        pos(0, 1, 5),
        EAST,
        ChinesePixelMaterial.Concrete,
        ChinesePixelFont.Bold,
        1,
        1
    )
})

player.onChat("清除", function () {
    chinesePixel.clearArea(pos(0, 1, 5), EAST, 100, 50)
})
