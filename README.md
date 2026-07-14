# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 32×32 像素方塊字。

## 安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中貼上：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

## v0.4.2：固定雙格筆劃與較完整中文字形

1. 每個字庫骨架像素固定生成 `2×2` 方塊，因此基準筆劃寬度為兩格。
2. 字庫改用 Noto Sans CJK TC Regular 的臺灣繁體字形。
3. 字形以較大的 15×15 範圍保留部件比例，再進行有限兩次細化。
4. 不再於 Minecraft 執行時重複細化，減少缺筆、斷筆與部件變形。
5. 保留 32×32 尺寸、右到左排列、直排文字、顏色、方向、放大與字距功能。
6. 單字水平校正保持不變，避免中文字左右鏡像。

## 橫式積木

```text
[你好麥塊]
在 [位置]
正面朝向 [方向]
顏色 [顏色]
放大 [倍率]
字距 [字距]
```

輸入 `你好麥塊` 時，正面觀看維持目前設定的右到左排列：

```text
塊　麥　好　你
```

## 測試範例

```typescript
player.onChat("中文", function () {
    chinesePixel.drawText(
        "你好麥塊",
        pos(0, 1, 5),
        SOUTH,
        ChinesePixelColor.Blue,
        1,
        4
    )
})
```

## 建議設定

- `scale` 建議先使用 1。
- `spacing` 建議使用 4。
- 更新後建立新的 MakeCode 專案，再重新加入擴充功能，以避開舊版快取。
