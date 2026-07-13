# Minecraft Education 中文像素字

這是一個 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 16×16 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## 目前版本：v0.2.2

此版本回到精簡方向，只保留中文像素字主功能，並加入指定的第 4、6、7 項：

4. 直排中文
6. 生成速度優化：相同顏色的像素會自動合併成矩形，再用 `blocks.fill` 建造
7. 字型風格：標準清楚、粗體清楚、細體

已移除「空心」字型。預設「畫出中文」會使用粗體清楚版本，遠距離比較容易閱讀。

## 積木功能

安裝後左側會出現「中文像素字」分類。

主要積木：

```text
畫出中文 [你好麥塊] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

字型積木：

```text
畫出中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 字型 [粗體清楚] 放大 [倍率] 倍 字距 [字距]
```

直排積木：

```text
畫出直排中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 字型 [粗體清楚] 放大 [倍率] 倍 字距 [字距]
```

## JavaScript 範例

```typescript
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

player.onChat("字型", function () {
    chinesePixel.drawTextWithFont(
        "翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
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
        ChinesePixelFont.Bold,
        1,
        1
    )
})
```

回到 Minecraft 後，按 `T` 輸入：

```text
中文
字型
直排
```

## 參數

- 文字：直接輸入繁體中文、英文、數字與標點
- 位置：整段文字左下角起始位置
- 朝向：NORTH、EAST、SOUTH、WEST
- 顏色：15 種混凝土顏色
- 放大：1～4 倍
- 字距：0～4
- 字型：標準清楚、粗體清楚、細體

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。
