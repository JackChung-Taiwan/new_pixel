# Minecraft Education 中文像素字

這是 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 32×32 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中貼上：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

## v0.3.9：右到左文字版本

此版本已移除 Pixel Art／像素編輯器功能，只保留中文字功能。

1. 橫式中文字改成由右到左排列。
2. 輸入 `你好麥塊`，正面觀看會顯示為 `塊 → 麥 → 好 → 你`。
3. 每個中文字仍為 32×32。
4. 每個骨架像素生成 2×2 方塊，也就是雙格筆劃。
5. 保留單字方向校正，中文字本身不會左右顛倒。
6. 保留直排中文與文字寬度積木。
7. 已移除 Pixel Art、Image 類別與像素編輯器積木。

## 積木功能

```text
畫出右到左32×32中文 [你好麥塊] 在 [位置] 正面朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
畫出32×32直排中文 [翊華教育] 在 [位置] 正面朝向 [方向] 顏色 [顏色] 放大 [倍率] 倍 字距 [字距]
```

```text
[文字] 放大 [倍率] 倍 字距 [字距] 的寬度
```

## 測試範例

```typescript
player.onChat("右到左", function () {
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

正面觀看結果：

```text
塊　麥　好　你
```

## 正面朝向

```text
NORTH：站在文字北側觀看
EAST：站在文字東側觀看
SOUTH：站在文字南側觀看
WEST：站在文字西側觀看
```

## 建議設定

- `scale`：先使用 1。
- `spacing`：建議使用 4。
- 更新後請建立新的 MakeCode 專案，再重新加入擴充功能，避免舊快取。
