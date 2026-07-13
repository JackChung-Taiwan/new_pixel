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

enum ChinesePixelFont {
    //% block="標準清楚"
    Normal = 0,
    //% block="粗體清楚"
    Bold = 1,
    //% block="細體"
    Thin = 2
}

//% block="中文像素字"
//% color="#1565C0"
//% icon="\uf031"
//% weight=90
namespace chinesePixel {
    const GLYPH_SIZE = 16;
    const DEFAULT_LINE_SPACING = 2;

    /**
     * 將輸入文字建造成 16×16 像素字。預設使用粗體清楚版本，遠距離較容易閱讀。
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
        drawTextWithFont(text, position, direction, color, ChinesePixelFont.Bold, scale, spacing);
    }

    /**
     * 使用指定字型畫出中文。已移除空心字，保留較適合閱讀的標準、粗體、細體。
     */
    //% blockId=minecraft_chinese_pixel_draw_text_with_font
    //% block="畫出中文 $text|在 $position|朝向 $direction|顏色 $color|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Blue
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=98
    export function drawTextWithFont(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Blue,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);

        const origin = position.toWorld();
        const matrix = buildTextMatrix(text, color, font, false, spacing);
        drawMatrix(matrix, origin, direction, scale, 0, 0);
    }

    /**
     * 畫出直排中文。
     */
    //% blockId=minecraft_chinese_pixel_draw_vertical_text
    //% block="畫出直排中文 $text|在 $position|朝向 $direction|顏色 $color|字型 $font|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Black
    //% font.defl=ChinesePixelFont.Bold
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=1
    //% weight=96
    export function drawVerticalText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Black,
        font: ChinesePixelFont = ChinesePixelFont.Bold,
        scale: number = 1,
        spacing: number = 1
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);

        const origin = position.toWorld();
        const matrix = buildTextMatrix(text, color, font, true, spacing);
        drawMatrix(matrix, origin, direction, scale, 0, 0);
    }

    /**
     * 檢查內建字庫是否包含指定字元。
     */
    //% blockId=minecraft_chinese_pixel_has_character
    //% block="中文字庫包含 $character"
    //% character.defl="學"
    //% weight=80
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
    //% weight=70
    export function textWidth(text: string, scale: number = 1, spacing: number = 1): number {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const lines = splitLines(text);
        let longest = 0;
        for (let i = 0; i < lines.length; i++) longest = Math.max(longest, lines[i].length);
        if (longest === 0) return 0;
        return (longest * GLYPH_SIZE + (longest - 1) * spacing) * scale;
    }

    function buildTextMatrix(text: string, color: ChinesePixelColor, font: ChinesePixelFont, vertical: boolean, spacing: number): number[][] {
        if (!text || text.length === 0) text = " ";
        spacing = clampInteger(spacing, 0, 4);

        if (vertical) return buildVerticalMatrix(text, color, font, spacing);

        const lines = splitLines(text);
        let maxLength = 1;
        for (let i = 0; i < lines.length; i++) maxLength = Math.max(maxLength, lines[i].length);

        const width = maxLength * GLYPH_SIZE + Math.max(0, maxLength - 1) * spacing;
        const height = lines.length * GLYPH_SIZE + Math.max(0, lines.length - 1) * DEFAULT_LINE_SPACING;
        const matrix = createMatrix(width, height);
        const block = blockForColor(color);

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const baseY = (lines.length - lineIndex - 1) * (GLYPH_SIZE + DEFAULT_LINE_SPACING);
            for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
                const baseX = characterIndex * (GLYPH_SIZE + spacing);
                paintGlyph(matrix, line.charAt(characterIndex), baseX, baseY, block, font);
            }
        }

        return matrix;
    }

    function buildVerticalMatrix(text: string, color: ChinesePixelColor, font: ChinesePixelFont, spacing: number): number[][] {
        text = removeLineBreaks(text);
        if (!text || text.length === 0) text = " ";

        const width = GLYPH_SIZE;
        const height = text.length * GLYPH_SIZE + Math.max(0, text.length - 1) * spacing;
        const matrix = createMatrix(width, height);
        const block = blockForColor(color);

        for (let i = 0; i < text.length; i++) {
            const baseY = (text.length - i - 1) * (GLYPH_SIZE + spacing);
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

    function styledPixelIsSet(rows: number[], x: number, y: number, font: ChinesePixelFont): boolean {
        const base = rawPixelIsSet(rows, x, y);

        if (font === ChinesePixelFont.Thin) {
            // 細體：保留原字形中比較穩定的骨架，避免完全變成空心或斷裂。
            return base && (
                rawPixelIsSet(rows, x - 1, y) ||
                rawPixelIsSet(rows, x + 1, y) ||
                rawPixelIsSet(rows, x, y - 1) ||
                rawPixelIsSet(rows, x, y + 1)
            );
        }

        if (font === ChinesePixelFont.Bold || font === ChinesePixelFont.Normal) {
            // 清楚版：加強右側與下方筆畫，中文遠看比較清楚。
            return base || rawPixelIsSet(rows, x - 1, y) || rawPixelIsSet(rows, x, y - 1);
        }

        return base;
    }

    function rawPixelIsSet(rows: number[], x: number, y: number): boolean {
        if (x < 0 || x >= GLYPH_SIZE || y < 0 || y >= GLYPH_SIZE) return false;
        return (rows[y] & (1 << (GLYPH_SIZE - 1 - x))) !== 0;
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

    function createMatrix(width: number, height: number): number[][] {
        const matrix: number[][] = [];
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

    function getMatrixPixel(matrix: number[][], x: number, y: number): number {
        if (y < 0 || y >= matrix.length) return 0;
        if (x < 0 || x >= matrix[y].length) return 0;
        return matrix[y][x];
    }

    function setMatrixPixel(matrix: number[][], x: number, y: number, value: number): void {
        if (y < 0 || y >= matrix.length) return;
        if (x < 0 || x >= matrix[y].length) return;
        matrix[y][x] = value;
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

    function clampInteger(value: number, minimum: number, maximum: number): number {
        value = Math.round(value);
        if (value < minimum) return minimum;
        if (value > maximum) return maximum;
        return value;
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

    function blockForColor(color: ChinesePixelColor): number {
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
}