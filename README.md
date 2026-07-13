# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 16×16 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## v0.3.2 雙格筆劃版

此版本改成固定雙格筆劃：

1. 每一個中文字筆劃會先細化，再補成雙格筆劃。
2. 不再提供字型選擇，學生只需要使用「畫出中文」。
3. 已刪除「中文字庫包含 學」積木。
4. 保留「畫出直排中文」。
5. 保留矩形合併加速，會把相同顏色連續區域合併成 `blocks.fill`。
6. 保留鏡像修正，生成文字不會左右顛倒。

## 積木功能

```text
畫出中文 [你好麥塊] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
畫出直排中文 [翊華教育] 在 [位置] 朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
[文字] 放大 [倍率] 倍 字距 [字距] 的寬度
```

## 已移除

以下積木已移除：

```text
畫出中文 + 字型
中文字庫包含 學
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
        2
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
        2
    )
})
```

## 建議

- `scale` 建議先用 1。
- `spacing` 建議用 2，中文字比較不會黏在一起。
- 目前沒有字型選擇，所有中文都固定使用雙格筆劃。

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。
