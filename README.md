# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 16×16 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## v0.3.1 細版字體與鏡像修正

此版本修正中文字左右鏡像問題，並維持細版中文字設定：

1. 字庫產生工具改用 Noto Sans CJK TC Regular。
2. 字庫縮圖設定為 14×14，筆劃更有留白。
3. 預設 `畫出中文` 使用「細字」。
4. 所有模式都不再自動整體加粗。
5. 「清楚最多兩格」會補強筆劃，但限制筆劃最多兩格寬。
6. 保留直排中文與矩形合併加速。
7. 修正 Minecraft 牆面生成時的水平鏡像，中文字會以正常閱讀方向顯示。

## 積木功能

```text
畫出中文 [你好麥塊] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
畫出中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 字型 [細字] 放大 [倍率] 倍 字距 [字距]
```

```text
畫出直排中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 字型 [細字] 放大 [倍率] 倍 字距 [字距]
```

## 字型

- 細字：最細，筆劃盡量一格寬。
- 標準：細字基礎上修補小斷點。
- 清楚最多兩格：局部補強，但限制筆劃最多兩格寬。

## JavaScript 範例

```typescript
player.onChat("中文", function () {
    chinesePixel.drawText(
        "台北市",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Blue,
        1,
        2
    )
})
```

```typescript
player.onChat("字型", function () {
    chinesePixel.drawTextWithFont(
        "翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        ChinesePixelFont.Clear,
        1,
        2
    )
})
```

## 建議

- `scale` 建議先用 1。
- `spacing` 建議用 2，中文字比較不會黏在一起。
- 想接近範例圖片風格，建議使用「細字」或「清楚最多兩格」。
- 如果之前看到鏡像字，請新開 MakeCode 專案重新加入擴充功能，避免使用舊快取。

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。
