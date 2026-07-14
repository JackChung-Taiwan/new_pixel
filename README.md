# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 32×32 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中貼上：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

## v0.3.7：修正中文字左右顛倒

這一版將「整句字序」與「單字方向」分開處理：

1. 橫式文字嚴格依照輸入順序排列。
2. 輸入 `你好麥塊`，正面觀看固定是 `你 → 好 → 麥 → 塊`。
3. 每個中文字在自己的 32×32 字格內做一次水平校正，不再左右顛倒。
4. 不會為了修正單字而反轉整段文字。
5. 每個中文字為 32×32，每個骨架像素生成 2×2 方塊。
6. 不提供字型類型選擇。
7. 已刪除「中文字庫包含 學」積木。
8. 保留直排中文與文字寬度積木。

## 正面朝向

```text
NORTH：站在文字北側觀看
EAST：站在文字東側觀看
SOUTH：站在文字南側觀看
WEST：站在文字西側觀看
```

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

正確結果：

```text
你　好　麥　塊
```

不能出現：

```text
塊　麥　好　你
```

而且每個「你、好、麥、塊」本身也不能左右顛倒。

## 建議設定

- `scale`：先使用 1。
- `spacing`：建議使用 4。
- 32×32 文字很大，先測試 2～4 個字。
- 更新後請建立新的 MakeCode 專案，再重新加入擴充功能，避免舊快取。
