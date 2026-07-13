/**
 * Minecraft Education 中文像素字擴充功能
 * 將繁體中文、英文、數字與標點轉成 16×16 方塊字。
 */

enum ChinesePixelColor {
    //% block="白色"
    White = 0,
    //% block="紅色"
    Red = 1,
    //% block="粉紅色"
    Pink = 2,
    //% block="橘色"
    Orange = 3,
    //% block="黃色"
    Yellow = 4,
    //% block="青色"
    Cyan = 5,
    //% block="淺綠色"
    Lime = 6,
    //% block="藍色"
    Blue = 7,
    //% block="淺藍色"
    LightBlue = 8,
    //% block="洋紅色"
    Magenta = 9,
    //% block="灰色"
    Gray = 10,
    //% block="紫色"
    Purple = 11,
    //% block="淺灰色"
    LightGray = 12,
    //% block="棕色"
    Brown = 13,
    //% block="黑色"
    Black = 14
}

enum ChinesePixelMaterial {
    //% block="混凝土"
    Concrete = 0,
    //% block="羊毛"
    Wool = 1,
    //% block="玻璃"
    Glass = 2,
    //% block="發光"
    Glow = 3,
    //% block="木板"
    Wood = 4
}

enum ChinesePixelFont {
    //% block="標準"
    Normal = 0,
    //% block="粗體"
    Bold = 1,
    //% block="細體"
    Thin = 2,
    //% block="空心"
    Outline = 3
}

//% block="中文像素字"
//% color="#1565C0"
//% icon="\uf031"
//% weight=90
namespace chinesePixel {
    const GLYPH_SIZE = 16;
    const DEFAULT_LINE_SPACING = 2;

    /**
     * 將輸入文字建造成 16×16 像素字。
     * 支援繁體中文、英文、數字、常用標點與換行。
     *
     * @param text 要建造的文字，例如：你好麥塊
     * @param position 整段文字左下角的起始位置
     * @param direction 文字面向的方向
     * @param color 混凝土顏色
     * @param scale 每一個像素放大成幾格，建議 1
     * @param spacing 每個字之間保留幾個像素
     */
    //% blockId=minecraft_chinese_pixel_draw_text
    //% block="畫出中文 $text|在 $position|朝向 $direction|顏色 $color|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="你好麥塊"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Blue
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=100
    export function drawText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Blue,
        scale: number = 1,
        spacing: number = 1
    ): void {
        drawTextAdvanced(text, position, direction, color, ChinesePixelMaterial.Concrete, ChinesePixelFont.Normal, scale, spacing);
    }

    /**
     * 進階中文像素字：可選材質與字型。
     */
    //% blockId=minecraft_chinese_pixel_draw_text_advanced
    //% block="進階中文 $text|在 $position|朝向 $direction|顏色 $color|材質 $material|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Blue
    //% material.defl=ChinesePixelMaterial.Concrete
    //% font.defl=ChinesePixelFont.Normal
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=98
    export function drawTextAdvanced(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Blue,
        material: ChinesePixelMaterial = ChinesePixelMaterial.Concrete,
        font: ChinesePixelFont = ChinesePixelFont.Normal,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const matrix = buildTextMatrix(text, color, material, font, false, false, spacing);
        drawMatrix(matrix, position.toWorld(), direction, scale, 0, 0);
    }

    /**
     * 在指定寬度內置中畫出中文。
     */
    //% blockId=minecraft_chinese_pixel_draw_centered_text
    //% block="置中中文 $text|在 $position|朝向 $direction|區域寬 $areaWidth|顏色 $color|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="歡迎光臨"
    //% position.shadow=minecraftCreatePosition
    //% areaWidth.min=16 areaWidth.max=200 areaWidth.defl=80
    //% color.defl=ChinesePixelColor.Black
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=96
    export function drawCenteredText(
        text: string,
        position: Position,
        direction: CompassDirection,
        areaWidth: number = 80,
        color: ChinesePixelColor = ChinesePixelColor.Black,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        areaWidth = Math.max(1, Math.round(areaWidth));
        const matrix = buildTextMatrix(text, color, ChinesePixelMaterial.Concrete, font, false, false, spacing);
        const offsetX = Math.max(0, Math.round((areaWidth - matrixWidth(matrix) * scale) / 2));
        drawMatrix(matrix, position.toWorld(), direction, scale, offsetX, 0);
    }

    /**
     * 直排中文，適合牌匾、古風地圖與任務入口。
     */
    //% blockId=minecraft_chinese_pixel_draw_vertical_text
    //% block="直排中文 $text|在 $position|朝向 $direction|顏色 $color|材質 $material|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Black
    //% material.defl=ChinesePixelMaterial.Concrete
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=94
    export function drawVerticalText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Black,
        material: ChinesePixelMaterial = ChinesePixelMaterial.Concrete,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const matrix = buildTextMatrix(text, color, material, font, true, false, spacing);
        drawMatrix(matrix, position.toWorld(), direction, scale, 0, 0);
    }

    /**
     * 彩虹中文，每個字自動換顏色。
     */
    //% blockId=minecraft_chinese_pixel_draw_rainbow_text
    //% block="彩虹中文 $text|在 $position|朝向 $direction|材質 $material|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="彩虹麥塊"
    //% position.shadow=minecraftCreatePosition
    //% material.defl=ChinesePixelMaterial.Concrete
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=92
    export function drawRainbowText(
        text: string,
        position: Position,
        direction: CompassDirection,
        material: ChinesePixelMaterial = ChinesePixelMaterial.Concrete,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const matrix = buildTextMatrix(text, ChinesePixelColor.Red, material, font, false, true, spacing);
        drawMatrix(matrix, position.toWorld(), direction, scale, 0, 0);
    }

    /**
     * 發光中文，使用發光方塊，適合夜晚招牌。
     */
    //% blockId=minecraft_chinese_pixel_draw_glow_text
    //% block="發光中文 $text|在 $position|朝向 $direction|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="任務開始"
    //% position.shadow=minecraftCreatePosition
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=90
    export function drawGlowText(
        text: string,
        position: Position,
        direction: CompassDirection,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const matrix = buildTextMatrix(text, ChinesePixelColor.Yellow, ChinesePixelMaterial.Glow, font, false, false, spacing);
        drawMatrix(matrix, position.toWorld(), direction, scale, 0, 0);
    }

    /**
     * 自動產生背景板，再畫上中文。
     */
    //% blockId=minecraft_chinese_pixel_draw_board
    //% block="中文看板 $text|在 $position|朝向 $direction|文字色 $textColor|背景色 $backgroundColor|字型 $font|放大 $scale 倍|字距 $spacing|邊距 $padding"
    //% inlineInputMode=external
    //% text.defl="歡迎來到翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% textColor.defl=ChinesePixelColor.Black
    //% backgroundColor.defl=ChinesePixelColor.White
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% padding.min=0 padding.max=8 padding.defl=2
    //% weight=88
    export function drawBoard(
        text: string,
        position: Position,
        direction: CompassDirection,
        textColor: ChinesePixelColor = ChinesePixelColor.Black,
        backgroundColor: ChinesePixelColor = ChinesePixelColor.White,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1,
        padding: number = 2
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        padding = clampInteger(padding, 0, 8);
        const origin = position.toWorld();
        const matrix = buildTextMatrix(text, textColor, ChinesePixelMaterial.Concrete, font, false, false, spacing);
        const boardWidth = matrixWidth(matrix) * scale + padding * 2;
        const boardHeight = matrixHeight(matrix) * scale + padding * 2;
        fillBlockRect(origin, direction, concreteBlock(backgroundColor), 0, 0, boardWidth - 1, boardHeight - 1);
        drawMatrix(matrix, origin, direction, scale, padding, padding);
    }

    /**
     * 清除指定寬高的文字區域。
     */
    //% blockId=minecraft_chinese_pixel_clear_area
    //% block="清除文字區域 在 $position|朝向 $direction|寬 $width|高 $height"
    //% position.shadow=minecraftCreatePosition
    //% width.min=1 width.max=200 width.defl=80
    //% height.min=1 height.max=100 height.defl=24
    //% weight=86
    export function clearArea(position: Position, direction: CompassDirection, width: number = 80, height: number = 24): void {
        width = Math.max(1, Math.round(width));
        height = Math.max(1, Math.round(height));
        fillBlockRect(position.toWorld(), direction, AIR, 0, 0, width - 1, height - 1);
    }

    /**
     * 依照文字尺寸自動清除區域。
     */
    //% blockId=minecraft_chinese_pixel_clear_text_area
    //% block="依文字 $text|清除區域 在 $position|朝向 $direction|放大 $scale 倍|字距 $spacing|邊距 $padding"
    //% inlineInputMode=external
    //% text.defl="你好麥塊"
    //% position.shadow=minecraftCreatePosition
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% padding.min=0 padding.max=8 padding.defl=2
    //% weight=84
    export function clearTextArea(
        text: string,
        position: Position,
        direction: CompassDirection,
        scale: number = 1,
        spacing: number = 1,
        padding: number = 2
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        padding = clampInteger(padding, 0, 8);
        const matrix = buildTextMatrix(text, ChinesePixelColor.Black, ChinesePixelMaterial.Concrete, ChinesePixelFont.Normal, false, false, spacing);
        const width = matrixWidth(matrix) * scale + padding * 2;
        const height = matrixHeight(matrix) * scale + padding * 2;
        fillBlockRect(position.toWorld(), direction, AIR, 0, 0, width - 1, height - 1);
    }

    /**
     * 快速建立任務看板。
     */
    //% blockId=minecraft_chinese_pixel_task_board
    //% block="任務看板 $text|在 $position|朝向 $direction"
    //% text.defl="第一關：紅石機關"
    //% position.shadow=minecraftCreatePosition
    //% weight=82
    export function drawTaskBoard(text: string, position: Position, direction: CompassDirection): void {
        drawBoard(text, position, direction, ChinesePixelColor.Yellow, ChinesePixelColor.Blue, ChinesePixelFont.Bold, 1, 1, 3);
    }

    /**
     * 快速建立學生姓名牌。
     */
    //% blockId=minecraft_chinese_pixel_name_tag
    //% block="學生姓名牌 $name|在 $position|朝向 $direction"
    //% name.defl="王小明"
    //% position.shadow=minecraftCreatePosition
    //% weight=80
    export function drawStudentNameTag(name: string, position: Position, direction: CompassDirection): void {
        drawBoard(name, position, direction, ChinesePixelColor.Black, ChinesePixelColor.LightGray, ChinesePixelFont.Bold, 1, 1, 2);
    }

    /**
     * 快速建立班級歡迎牆。
     */
    //% blockId=minecraft_chinese_pixel_welcome_wall
    //% block="班級歡迎牆 $text|在 $position|朝向 $direction"
    //% text.defl="歡迎來到翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% weight=78
    export function drawWelcomeWall(text: string, position: Position, direction: CompassDirection): void {
        drawBoard(text, position, direction, ChinesePixelColor.Red, ChinesePixelColor.White, ChinesePixelFont.Bold, 2, 1, 4);
    }

    /**
     * 檢查內建字庫是否包含指定字元。
     */
    //% blockId=minecraft_chinese_pixel_has_character
    //% block="中文字庫包含 $character"
    //% character.defl="學"
    //% weight=76
    export function hasCharacter(character: string): boolean {
        if (!character || character.length === 0) return false;
        return pixelFontData.contains(character.charAt(0));
    }

    /**
     * 計算一行文字建造後的寬度（方塊數）。
     */
    //% blockId=minecraft_chinese_pixel_text_width
    //% block="$text 放大 $scale 倍 字距 $spacing 的寬度"
    //% text.defl="你好麥塊"
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=74
    export function textWidth(text: string, scale: number = 1, spacing: number = 1): number {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const lines = splitLines(text);
        let longest = 0;
        for (let i = 0; i < lines.length; i++) longest = Math.max(longest, lines[i].length);
        if (longest === 0) return 0;
        return (longest * GLYPH_SIZE + (longest - 1) * spacing) * scale;
    }

    /**
     * 計算多行文字建造後的高度（方塊數）。
     */
    //% blockId=minecraft_chinese_pixel_text_height
    //% block="$text 放大 $scale 倍 的高度"
    //% text.defl="你好麥塊"
    //% scale.min=1 scale.max=4 scale.defl=1
    //% weight=72
    export function textHeight(text: string, scale: number = 1): number {
        scale = clampInteger(scale, 1, 4);
        const lines = splitLines(text);
        if (lines.length === 0) return 0;
        return (lines.length * GLYPH_SIZE + (lines.length - 1) * DEFAULT_LINE_SPACING) * scale;
    }

    function buildTextMatrix(
        text: string,
        color: ChinesePixelColor,
        material: ChinesePixelMaterial,
        font: ChinesePixelFont,
        vertical: boolean,
        rainbow: boolean,
        spacing: number
    ): number[][] {
        if (!text || text.length === 0) text = " ";
        spacing = clampInteger(spacing, 0, 4);

        if (vertical) {
            return buildVerticalMatrix(text, color, material, font, rainbow, spacing);
        }

        const lines = splitLines(text);
        let maxLength = 1;
        for (let i = 0; i < lines.length; i++) maxLength = Math.max(maxLength, lines[i].length);
        const width = maxLength * GLYPH_SIZE + Math.max(0, maxLength - 1) * spacing;
        const height = lines.length * GLYPH_SIZE + Math.max(0, lines.length - 1) * DEFAULT_LINE_SPACING;
        const matrix = createMatrix(width, height);
        let visibleIndex = 0;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const baseY = (lines.length - lineIndex - 1) * (GLYPH_SIZE + DEFAULT_LINE_SPACING);
            for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
                const baseX = characterIndex * (GLYPH_SIZE + spacing);
                const block = blockForMaterial(rainbowColor(visibleIndex, color, rainbow), material);
                paintGlyph(matrix, line.charAt(characterIndex), baseX, baseY, block, font);
                visibleIndex++;
            }
        }
        return matrix;
    }

    function buildVerticalMatrix(text: string, color: ChinesePixelColor, material: ChinesePixelMaterial, font: ChinesePixelFont, rainbow: boolean, spacing: number): number[][] {
        text = removeLineBreaks(text);
        if (!text || text.length === 0) text = " ";
        const width = GLYPH_SIZE;
        const height = text.length * GLYPH_SIZE + Math.max(0, text.length - 1) * spacing;
        const matrix = createMatrix(width, height);
        for (let i = 0; i < text.length; i++) {
            const baseY = (text.length - i - 1) * (GLYPH_SIZE + spacing);
            const block = blockForMaterial(rainbowColor(i, color, rainbow), material);
            paintGlyph(matrix, text.charAt(i), 0, baseY, block, font);
        }
        return matrix;
    }

    function paintGlyph(matrix: number[][], character: string, baseX: number, baseY: number, block: number, font: ChinesePixelFont): void {
        const rows = decodeGlyph(pixelFontData.glyphFor(character));
        for (let rowIndex = 0; rowIndex < GLYPH_SIZE; rowIndex++) {
            const pixelY = baseY + (GLYPH_SIZE - 1 - rowIndex);
            for (let x = 0; x < GLYPH_SIZE; x++) {
                if (styledPixelIsSet(rows, x, rowIndex, font)) {
                    setMatrixPixel(matrix, baseX + x, pixelY, block);
                }
            }
        }
    }

    function drawMatrix(matrix: number[][], origin: Position, direction: CompassDirection, scale: number, offsetX: number, offsetY: number): void {
        const width = matrixWidth(matrix);
        const height = matrixHeight(matrix);
        const visited = createMatrix(width, height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const block = getMatrixPixel(matrix, x, y);
                if (!block || getMatrixPixel(visited, x, y)) continue;

                let rectWidth = 1;
                while (x + rectWidth < width && getMatrixPixel(matrix, x + rectWidth, y) === block && !getMatrixPixel(visited, x + rectWidth, y)) {
                    rectWidth++;
                }

                let rectHeight = 1;
                let canGrow = true;
                while (y + rectHeight < height && canGrow) {
                    for (let i = 0; i < rectWidth; i++) {
                        if (getMatrixPixel(matrix, x + i, y + rectHeight) !== block || getMatrixPixel(visited, x + i, y + rectHeight)) {
                            canGrow = false;
                            break;
                        }
                    }
                    if (canGrow) rectHeight++;
                }

                for (let yy = y; yy < y + rectHeight; yy++) {
                    for (let xx = x; xx < x + rectWidth; xx++) setMatrixPixel(visited, xx, yy, 1);
                }

                fillScaledRect(origin, direction, block, x, y, rectWidth, rectHeight, scale, offsetX, offsetY);
            }
        }
    }

    function fillScaledRect(origin: Position, direction: CompassDirection, block: number, x: number, y: number, width: number, height: number, scale: number, offsetX: number, offsetY: number): void {
        const x0 = offsetX + x * scale;
        const x1 = offsetX + (x + width) * scale - 1;
        const y0 = offsetY + y * scale;
        const y1 = offsetY + (y + height) * scale - 1;
        fillBlockRect(origin, direction, block, x0, y0, x1, y1);
    }

    function fillBlockRect(origin: Position, direction: CompassDirection, block: number, x0: number, y0: number, x1: number, y1: number): void {
        let fromPosition: Position;
        let toPosition: Position;

        if (direction === CompassDirection.North) {
            fromPosition = world(origin.getValue(Axis.X), origin.getValue(Axis.Y) + y0, origin.getValue(Axis.Z) - x0);
            toPosition = world(origin.getValue(Axis.X), origin.getValue(Axis.Y) + y1, origin.getValue(Axis.Z) - x1);
        } else if (direction === CompassDirection.East) {
            fromPosition = world(origin.getValue(Axis.X) + x0, origin.getValue(Axis.Y) + y0, origin.getValue(Axis.Z));
            toPosition = world(origin.getValue(Axis.X) + x1, origin.getValue(Axis.Y) + y1, origin.getValue(Axis.Z));
        } else if (direction === CompassDirection.South) {
            fromPosition = world(origin.getValue(Axis.X), origin.getValue(Axis.Y) + y0, origin.getValue(Axis.Z) + x0);
            toPosition = world(origin.getValue(Axis.X), origin.getValue(Axis.Y) + y1, origin.getValue(Axis.Z) + x1);
        } else {
            fromPosition = world(origin.getValue(Axis.X) - x0, origin.getValue(Axis.Y) + y0, origin.getValue(Axis.Z));
            toPosition = world(origin.getValue(Axis.X) - x1, origin.getValue(Axis.Y) + y1, origin.getValue(Axis.Z));
        }

        blocks.fill(block, fromPosition, toPosition, FillOperation.Replace);
    }

    function styledPixelIsSet(rows: number[], x: number, y: number, font: ChinesePixelFont): boolean {
        if (font === ChinesePixelFont.Bold) {
            return rawPixel(rows, x, y) || rawPixel(rows, x - 1, y) || rawPixel(rows, x, y - 1) || rawPixel(rows, x - 1, y - 1);
        }

        if (font === ChinesePixelFont.Thin) {
            return rawPixel(rows, x, y) && !(rawPixel(rows, x - 1, y) && rawPixel(rows, x + 1, y) && rawPixel(rows, x, y - 1) && rawPixel(rows, x, y + 1));
        }

        if (font === ChinesePixelFont.Outline) {
            return rawPixel(rows, x, y) && (!rawPixel(rows, x - 1, y) || !rawPixel(rows, x + 1, y) || !rawPixel(rows, x, y - 1) || !rawPixel(rows, x, y + 1));
        }

        return rawPixel(rows, x, y);
    }

    function rawPixel(rows: number[], x: number, y: number): boolean {
        if (x < 0 || x >= GLYPH_SIZE || y < 0 || y >= GLYPH_SIZE) return false;
        return (rows[y] & (1 << (15 - x))) !== 0;
    }

    function blockForMaterial(color: ChinesePixelColor, material: ChinesePixelMaterial): number {
        if (material === ChinesePixelMaterial.Wool) return blockWithData(WOOL, woolData(color));
        if (material === ChinesePixelMaterial.Glass) return GLASS;
        if (material === ChinesePixelMaterial.Glow) return GLOWSTONE;
        if (material === ChinesePixelMaterial.Wood) return PLANKS;
        return concreteBlock(color);
    }

    function concreteBlock(color: ChinesePixelColor): number {
        switch (color) {
            case ChinesePixelColor.White: return WHITE_CONCRETE;
            case ChinesePixelColor.Red: return RED_CONCRETE;
            case ChinesePixelColor.Pink: return PINK_CONCRETE;
            case ChinesePixelColor.Orange: return ORANGE_CONCRETE;
            case ChinesePixelColor.Yellow: return YELLOW_CONCRETE;
            case ChinesePixelColor.Cyan: return CYAN_CONCRETE;
            case ChinesePixelColor.Lime: return LIME_CONCRETE;
            case ChinesePixelColor.Blue: return BLUE_CONCRETE;
            case ChinesePixelColor.LightBlue: return LIGHT_BLUE_CONCRETE;
            case ChinesePixelColor.Magenta: return MAGENTA_CONCRETE;
            case ChinesePixelColor.Gray: return GRAY_CONCRETE;
            case ChinesePixelColor.Purple: return PURPLE_CONCRETE;
            case ChinesePixelColor.LightGray: return LIGHT_GRAY_CONCRETE;
            case ChinesePixelColor.Brown: return BROWN_CONCRETE;
            default: return BLACK_CONCRETE;
        }
    }

    function woolData(color: ChinesePixelColor): number {
        switch (color) {
            case ChinesePixelColor.White: return 0;
            case ChinesePixelColor.Orange: return 1;
            case ChinesePixelColor.Magenta: return 2;
            case ChinesePixelColor.LightBlue: return 3;
            case ChinesePixelColor.Yellow: return 4;
            case ChinesePixelColor.Lime: return 5;
            case ChinesePixelColor.Pink: return 6;
            case ChinesePixelColor.Gray: return 7;
            case ChinesePixelColor.LightGray: return 8;
            case ChinesePixelColor.Cyan: return 9;
            case ChinesePixelColor.Purple: return 10;
            case ChinesePixelColor.Blue: return 11;
            case ChinesePixelColor.Brown: return 12;
            case ChinesePixelColor.Red: return 14;
            case ChinesePixelColor.Black: return 15;
            default: return 0;
        }
    }

    function rainbowColor(index: number, fallback: ChinesePixelColor, rainbow: boolean): ChinesePixelColor {
        if (!rainbow) return fallback;
        const colors = [
            ChinesePixelColor.Red,
            ChinesePixelColor.Orange,
            ChinesePixelColor.Yellow,
            ChinesePixelColor.Lime,
            ChinesePixelColor.Cyan,
            ChinesePixelColor.Blue,
            ChinesePixelColor.Purple,
            ChinesePixelColor.Magenta
        ];
        return colors[index % colors.length];
    }

    function splitLines(text: string): string[] {
        const result: string[] = [];
        let current = "";
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            if (character === "\n") {
                result.push(current);
                current = "";
            } else if (character !== "\r") {
                current += character;
            }
        }
        result.push(current);
        return result;
    }

    function removeLineBreaks(text: string): string {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i);
            if (character !== "\n" && character !== "\r") result += character;
        }
        return result;
    }

    function decodeGlyph(encoded: string): number[] {
        const bytes: number[] = [];
        for (let i = 0; i < encoded.length; i += 4) {
            const a = base64Value(encoded.charCodeAt(i));
            const b = base64Value(encoded.charCodeAt(i + 1));
            const c = base64Value(encoded.charCodeAt(i + 2));
            const d = base64Value(encoded.charCodeAt(i + 3));
            if (a < 0 || b < 0) break;
            bytes.push((a << 2) | (b >> 4));
            if (c >= 0) {
                bytes.push(((b & 15) << 4) | (c >> 2));
                if (d >= 0) bytes.push(((c & 3) << 6) | d);
            }
        }
        const rows: number[] = [];
        for (let row = 0; row < GLYPH_SIZE; row++) {
            const high = bytes[row * 2] || 0;
            const low = bytes[row * 2 + 1] || 0;
            rows.push((high << 8) | low);
        }
        return rows;
    }

    function base64Value(code: number): number {
        if (code >= 65 && code <= 90) return code - 65;
        if (code >= 97 && code <= 122) return code - 97 + 26;
        if (code >= 48 && code <= 57) return code - 48 + 52;
        if (code === 43) return 62;
        if (code === 47) return 63;
        return -1;
    }

    function clampInteger(value: number, minimum: number, maximum: number): number {
        value = Math.round(value);
        if (value < minimum) return minimum;
        if (value > maximum) return maximum;
        return value;
    }

    function createMatrix(width: number, height: number): number[][] {
        const matrix: number[][] = [];
        width = Math.max(1, Math.round(width));
        height = Math.max(1, Math.round(height));
        for (let y = 0; y < height; y++) {
            const row: number[] = [];
            for (let x = 0; x < width; x++) row.push(0);
            matrix.push(row);
        }
        return matrix;
    }

    function matrixWidth(matrix: number[][]): number {
        if (!matrix || matrix.length === 0) return 0;
        return matrix[0].length;
    }

    function matrixHeight(matrix: number[][]): number {
        if (!matrix) return 0;
        return matrix.length;
    }

    function setMatrixPixel(matrix: number[][], x: number, y: number, value: number): void {
        if (y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length) matrix[y][x] = value;
    }

    function getMatrixPixel(matrix: number[][], x: number, y: number): number {
        if (y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length) return matrix[y][x];
        return 0;
    }
}
