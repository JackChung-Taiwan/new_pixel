# Minecraft Education 中文像素字

for PXT/minecraft

在 Minecraft Education MakeCode 中輸入繁體中文，將文字建造成 16×16 混凝土像素字。

## 功能

- 內建 5639 個中文字元、英文、數字與標點
- 15 種混凝土顏色
- 1～4 倍放大
- 可調整字距
- 支援換行與四個面向
- 不支援的字元以「□」顯示

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
```

## 安裝

將整個資料夾上傳至 GitHub 儲存庫，再於 Minecraft Education MakeCode：

1. 設定
2. 擴充功能
3. 貼上 GitHub 儲存庫網址

## 檔案說明

- `main.ts`：自訂積木與 Minecraft 建造程式
- `font-index.ts`：字元查詢
- `font-data-0.ts`～`font-data-6.ts`：16×16 字形資料
- `pxt.json`：MakeCode 擴充套件設定
- `test.ts`：測試範例
