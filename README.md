# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 32×32 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中貼上：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

## v0.3.6：真正左到右版本

這一版重新定義了文字座標：

1. 橫式文字嚴格依照輸入順序排列。
2. 輸入 `你好麥塊`，正面觀看一定是 `你 → 好 → 麥 → 塊`。
3. 單一中文字不做水平鏡像。
4. 每個中文字為 32×32。
5. 每個字形像素放大成 2×2 方塊，也就是雙格筆劃。
6. 不提供字型類型選擇。
7. 已刪除「中文字庫包含 學」積木。
8. 保留直排中文與文字寬度積木。

## 正面朝向

方向現在代表文字的正面：

```text
NORTH：站在文字北側觀看
EAST：站在文字東側觀看
SOUTH：站在文字南側觀看
WEST：站在文字西側觀看
```

從所選的正面觀看，橫式文字才會是正確的左到右順序。

## 建議測試

先使用 `SOUTH`，並站在文字南側往北看：

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

畫面應顯示：

```text
你　好　麥　塊
```

不能顯示成：

```text
塊　麥　好　你
```

## 直排範例

```typescript
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
```

## 建議設定

- `scale`：先使用 1。
- `spacing`：建議使用 4。
- 32×32 文字很大，先測試 2～4 個字。
- 更新擴充功能後，請建立新的 MakeCode 專案，避免舊快取。
