# Minecraft Education 中文像素字

這是一個 Minecraft Education MakeCode 自訂積木擴充功能，可直接輸入繁體中文，並在世界中建造成 16×16 像素方塊字。

## 正確安裝網址

在 Minecraft Education MakeCode 的「擴充功能 Extensions」中，請貼上儲存庫根目錄網址：

```text
https://github.com/JackChung-Taiwan/new_pixel
```

不要貼 `/tree/main/Minecraft_Chinese_Pixel` 資料夾網址，MakeCode 擴充功能需要讀取儲存庫根目錄的 `pxt.json`。

## v0.2.0 新增功能

已加入完整 1～7 功能：

1. 清除文字區域
2. 中文背景看板
3. 發光中文
4. 直排中文
5. 彩虹中文
6. 矩形合併最佳化，減少 `blocks.fill` 次數
7. 不同字型風格：標準、粗體、細體、空心

另外加入課堂常用快速積木：

- 任務看板
- 學生姓名牌
- 班級歡迎牆
- 置中文字
- 材質選擇：混凝土、羊毛、玻璃、發光、木板

## 使用方式

安裝後左側會出現「中文像素字」分類。

### 基本中文

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

### 中文看板

```typescript
player.onChat("看板", function () {
    chinesePixel.drawBoard(
        "歡迎來到翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        ChinesePixelColor.White,
        ChinesePixelFont.Bold,
        1,
        1,
        2
    )
})
```

### 發光中文

```typescript
player.onChat("發光", function () {
    chinesePixel.drawGlowText(
        "任務開始",
        pos(0, 1, 5),
        EAST,
        ChinesePixelFont.Bold,
        1,
        1
    )
})
```

### 直排中文

```typescript
player.onChat("直排", function () {
    chinesePixel.drawVerticalText(
        "翊華教育",
        pos(0, 1, 5),
        EAST,
        ChinesePixelColor.Black,
        ChinesePixelMaterial.Concrete,
        ChinesePixelFont.Bold,
        1,
        1
    )
})
```

### 彩虹中文

```typescript
player.onChat("彩虹", function () {
    chinesePixel.drawRainbowText(
        "彩虹麥塊",
        pos(0, 1, 5),
        EAST,
        ChinesePixelMaterial.Concrete,
        ChinesePixelFont.Bold,
        1,
        1
    )
})
```

### 清除區域

```typescript
player.onChat("清除", function () {
    chinesePixel.clearArea(pos(0, 1, 5), EAST, 100, 40)
})
```

## 主要積木

| 積木 | 用途 |
|---|---|
| 畫出中文 | 基本中文像素字 |
| 進階中文 | 可選材質與字型 |
| 置中中文 | 在指定寬度內自動置中 |
| 直排中文 | 做古風牌匾或直式招牌 |
| 彩虹中文 | 每個字自動換顏色 |
| 發光中文 | 夜晚可見的發光招牌 |
| 中文看板 | 自動生成背景板再寫字 |
| 清除文字區域 | 清掉指定寬高區域 |
| 依文字清除區域 | 依文字尺寸自動清除 |
| 任務看板 | 快速做關卡標題 |
| 學生姓名牌 | 快速做學生作品簽名 |
| 班級歡迎牆 | 快速做教室入口牆 |
| 中文字庫包含 | 檢查字庫是否支援某字 |
| 文字寬度 / 高度 | 計算建造尺寸 |

## 參數

- 文字：直接輸入繁體中文、英文、數字與標點
- 位置：整段文字左下角起始位置
- 朝向：NORTH、EAST、SOUTH、WEST
- 顏色：15 種顏色
- 材質：混凝土、羊毛、玻璃、發光、木板
- 字型：標準、粗體、細體、空心
- 放大：1～4 倍
- 字距：0～4
- 邊距：看板背景與文字間距

## 檔案結構

`pxt.json` 放在儲存庫根目錄，實際程式檔放在 `Minecraft_Chinese_Pixel/` 資料夾。這樣 MakeCode 才能從 GitHub 根目錄正確載入擴充功能。

## 注意

玻璃、發光、木板模式主要改變材質，顏色不一定能完整對應；彩色效果建議使用「混凝土」或「羊毛」。
