# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 32×32 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## v0.3.3：32×32 不鏡像版本

此版本改成 32×32 中文像素字：

1. 每個中文字建造成 32×32 方塊字。
2. 每個原始筆劃像素固定放大成 2×2 方塊，也就是雙格筆劃。
3. 文字方向已修正，不會左右鏡像。
4. 不再提供字型類型選擇，避免學生操作混淆。
5. 已刪除「中文字庫包含 學」積木。
6. 保留直排中文。
7. 同一列連續像素會合併成 `blocks.fill`，比逐格放置更快。

## 積木功能

```text
畫出32×32中文 [你好麥塊] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
畫出32×32直排中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
[文字] 放大 [倍率] 倍 字距 [字距] 的寬度
```

## JavaScript 範例

```typescript
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
```

```typescript
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
```

## 建議

- `scale` 建議先用 1。
- `spacing` 建議用 4，32×32 字比較不會黏在一起。
- 若文字太大，請先測試 2～4 個字。

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。
