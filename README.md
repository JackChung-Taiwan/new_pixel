# Minecraft Education 中文像素字

這是一個 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 16×16 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## 使用方式

安裝後左側會出現「中文像素字」分類。

JavaScript 範例：

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
```

回到 Minecraft 後，按 `T` 輸入：

```text
中文
```

就會建造「你好麥塊」。

## 參數

- 文字：直接輸入繁體中文、英文、數字與標點
- 位置：整段文字左下角起始位置
- 朝向：NORTH、EAST、SOUTH、WEST
- 顏色：15 種混凝土顏色
- 放大：1～4 倍
- 字距：0～4

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。
