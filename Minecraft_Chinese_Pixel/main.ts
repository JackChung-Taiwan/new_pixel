/**
 * Minecraft Education 中文像素字擴充功能
 * 16×16 中文像素字。固定使用雙格筆劃，不提供字型選擇，避免學生操作混淆。
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

//% block="中文像素字"
//% color="#1565C0"
//% icon="\uf031"
//% weight=90
namespace chinesePixel {
    const GLYPH_SIZE = 16;
    const DEFAULT_LINE_SPACING = 2;

    /**
     * 畫出中文像素字。每一個筆劃固定使用雙格方塊，避免太細斷裂，也不會提供字型選擇。
     * @param text 要建造的文字，例如：你好麥塊
     * @param position 整段文字左下角的起始位置
     * @param direction 文字面向的方向
     * @param color 混凝土顏色
     * @param scale 每一個像素放大成幾格，建議 1
     * @param spacing 每個字之間保留幾個像素，建議 2
     */
    //% blockId=minecraft_chinese_pixel_draw_text
    //% block="畫出中文 $text|在 $position|朝向 $direction|顏色 $color|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="你好麥塊"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Blue
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=2
    //% weight=100
    export function drawText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Blue,
        scale: number = 1,
        spacing: number = 2
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);

        const origin = position.toWorld();
        const matrix = buildTextMatrix(text, color, false, spacing);
        drawMatrix(matrix, origin, direction, scale, 0, 0);
    }

    /**
     * 畫出直排中文。每一個筆劃固定使用雙格方塊。
     */
    //% blockId=minecraft_chinese_pixel_draw_vertical_text
    //% block="畫出直排中文 $text|在 $position|朝向 $direction|顏色 $color|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% color.defl=ChinesePixelColor.Black
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=2
    //% weight=96
    export function drawVerticalText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Black,
        scale: number = 1,
        spacing: number = 2
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);

        const origin = position.toWorld();
        const matrix = buildTextMatrix(text, color, true, spacing);
        drawMatrix(matrix, origin, direction, scale, 0, 0);
    }

    /**
     * 計算一行文字建造後的寬度。
     */
    //% blockId=minecraft_chinese_pixel_text_width
    //% block="$text 放大 $scale 倍 字距 $spacing 的寬度"
    //% text.defl="你好麥塊"
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=4 spacing.defl=2
    //% weight=70
    export function textWidth(text: string, scale: number = 1, spacing: number = 2): number {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 4);
        const lines = splitLines(text);
        let longest = 0;
        for (let i = 0; i < lines.length; i++) longest = Math.max(longest, lines[i].length);
        if (longest === 0) return 0;
        return (longest * GLYPH_SIZE + (longest - 1) * spacing) * scale;
    }

    function buildTextMatrix(text: string, color: ChinesePixelColor, vertical: boolean, spacing: number): number[][] {
        if (!text || text.length === 0) text = " ";
        spacing = clampInteger(spacing, 0, 4);

        if (vertical) return buildVerticalMatrix(text, color, spacing);

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
                paintGlyph(matrix, line.charAt(characterIndex), baseX, baseY, block);
            }
        }

        return matrix;
    }

    function buildVerticalMatrix(text: string, color: ChinesePixelColor, spacing: number): number[][] {
        text = removeLineBreaks(text);
        if (!text || text.length === 0) text = " ";

        const width = GLYPH_SIZE;
        const height = text.length * GLYPH_SIZE + Math.max(0, text.length - 1) * spacing;
        const matrix = createMatrix(width, height);
        const block = blockForColor(color);

        for (let i = 0; i < text.length; i++) {
            const baseY = (text.length - i - 1) * (GLYPH_SIZE + spacing);
            paintGlyph(matrix, text.charAt(i), 0, baseY, block);
        }

        return matrix;
    }

    function paintGlyph(matrix: number[][], character: string, baseX: number, baseY: number, block: number): void {
        const rawRows = decodeGlyph(pixelFontData.glyphFor(character));
        const rows = doubleStrokeRows(rawRows);

        for (let rowIndex = 0; rowIndex < GLYPH_SIZE; rowIndex++) {
            const pixelY = baseY + (GLYPH_SIZE - 1 - rowIndex);
            for (let x = 0; x < GLYPH_SIZE; x++) {
                if ((rows[rowIndex] & (1 << (GLYPH_SIZE - 1 - x))) !== 0) {
                    // 修正鏡像：Minecraft 牆面生成時水平軸與字形座標相反，這裡把 x 翻回正常閱讀方向。
                    setMatrixPixel(matrix, baseX + (GLYPH_SIZE - 1 - x), pixelY, block);
                }
            }
        }
    }

    function doubleStrokeRows(rows: number[]): number[] {
        const skeleton = rowsToMatrix(singleBlockRows(rows));
        const result = createMatrix(GLYPH_SIZE, GLYPH_SIZE);

        for (let y = 0; y < GLYPH_SIZE; y++) {
            for (let x = 0; x < GLYPH_SIZE; x++) {
                if (!getMatrixPixel(skeleton, x, y)) continue;

                const horizontal = getMatrixPixel(skeleton, x - 1, y) || getMatrixPixel(skeleton, x + 1, y);
                const vertical = getMatrixPixel(skeleton, x, y - 1) || getMatrixPixel(skeleton, x, y + 1);

                setMatrixPixel(result, x, y, 1);

                if (vertical) setMatrixPixel(result, x + 1, y, 1);
                if (horizontal) setMatrixPixel(result, x, y + 1, 1);
                if (horizontal && vertical) setMatrixPixel(result, x + 1, y + 1, 1);
                if (!horizontal && !vertical) setMatrixPixel(result, x + 1, y, 1);
            }
        }

        return matrixToRows(result);
    }

    function singleBlockRows(rows: number[]): number[] {
        const pixels = rowsToMatrix(rows);
        let changed = true;
        let guard = 0;

        while (changed && guard < 10) {
            changed = false;
            if (thinStep(pixels, 0)) changed = true;
            if (thinStep(pixels, 1)) changed = true;
            guard++;
        }

        return matrixToRows(pixels);
    }

    function thinStep(pixels: number[][], step: number): boolean {
        const removeX: number[] = [];
        const removeY: number[] = [];

        for (let y = 1; y < GLYPH_SIZE - 1; y++) {
            for (let x = 1; x < GLYPH_SIZE - 1; x++) {
                if (!getMatrixPixel(pixels, x, y)) continue;

                const n = neighborCount(pixels, x, y);
                if (n < 2 || n > 6) continue;
                if (transitionCount(pixels, x, y) !== 1) continue;

                const p2 = getMatrixPixel(pixels, x, y - 1) ? 1 : 0;
                const p4 = getMatrixPixel(pixels, x + 1, y) ? 1 : 0;
                const p6 = getMatrixPixel(pixels, x, y + 1) ? 1 : 0;
                const p8 = getMatrixPixel(pixels, x - 1, y) ? 1 : 0;

                if (step === 0) {
                    if (p2 * p4 * p6 !== 0) continue;
                    if (p4 * p6 * p8 !== 0) continue;
                } else {
                    if (p2 * p4 * p8 !== 0) continue;
                    if (p2 * p6 * p8 !== 0) continue;
                }

                removeX.push(x);
                removeY.push(y);
            }
        }

        for (let i = 0; i < removeX.length; i++) {
            setMatrixPixel(pixels, removeX[i], removeY[i], 0);
        }

        return removeX.length > 0;
    }

    function neighborCount(pixels: number[][], x: number, y: number): number {
        let count = 0;
        if (getMatrixPixel(pixels, x, y - 1)) count++;
        if (getMatrixPixel(pixels, x + 1, y - 1)) count++;
        if (getMatrixPixel(pixels, x + 1, y)) count++;
        if (getMatrixPixel(pixels, x + 1, y + 1)) count++;
        if (getMatrixPixel(pixels, x, y + 1)) count++;
        if (getMatrixPixel(pixels, x - 1, y + 1)) count++;
        if (getMatrixPixel(pixels, x - 1, y)) count++;
        if (getMatrixPixel(pixels, x - 1, y - 1)) count++;
        return count;
    }

    function transitionCount(pixels: number[][], x: number, y: number): number {
        const p2 = getMatrixPixel(pixels, x, y - 1) ? 1 : 0;
        const p3 = getMatrixPixel(pixels, x + 1, y - 1) ? 1 : 0;
        const p4 = getMatrixPixel(pixels, x + 1, y) ? 1 : 0;
        const p5 = getMatrixPixel(pixels, x + 1, y + 1) ? 1 : 0;
        const p6 = getMatrixPixel(pixels, x, y + 1) ? 1 : 0;
        const p7 = getMatrixPixel(pixels, x - 1, y + 1) ? 1 : 0;
        const p8 = getMatrixPixel(pixels, x - 1, y) ? 1 : 0;
        const p9 = getMatrixPixel(pixels, x - 1, y - 1) ? 1 : 0;
        let transitions = 0;
        if (p2 === 0 && p3 === 1) transitions++;
        if (p3 === 0 && p4 === 1) transitions++;
        if (p4 === 0 && p5 === 1) transitions++;
        if (p5 === 0 && p6 === 1) transitions++;
        if (p6 === 0 && p7 === 1) transitions++;
        if (p7 === 0 && p8 === 1) transitions++;
        if (p8 === 0 && p9 === 1) transitions++;
        if (p9 === 0 && p2 === 1) transitions++;
        return transitions;
    }

    function rawPixelIsSet(rows: number[], x: number, y: number): boolean {
        if (x < 0 || x >= GLYPH_SIZE || y < 0 || y >= GLYPH_SIZE) return false;
        return (rows[y] & (1 << (GLYPH_SIZE - 1 - x))) !== 0;
    }

    function rowsToMatrix(rows: number[]): number[][] {
        const matrix = createMatrix(GLYPH_SIZE, GLYPH_SIZE);
        for (let y = 0; y < GLYPH_SIZE; y++) {
            for (let x = 0; x < GLYPH_SIZE; x++) {
                if (rawPixelIsSet(rows, x, y)) setMatrixPixel(matrix, x, y, 1);
            }
        }
        return matrix;
    }

    function matrixToRows(matrix: number[][]): number[] {
        const rows: number[] = [];
        for (let y = 0; y < GLYPH_SIZE; y++) {
            let row = 0;
            for (let x = 0; x < GLYPH_SIZE; x++) {
                if (getMatrixPixel(matrix, x, y)) row |= 1 << (GLYPH_SIZE - 1 - x);
            }
            rows.push(row);
        }
        return rows;
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
                while (
                    x + rectWidth < width &&
                    getMatrixPixel(matrix, x + rectWidth, y) === block &&
                    !getMatrixPixel(visited, x + rectWidth, y)
                ) {
                    rectWidth++;
                }

                let rectHeight = 1;
                let canGrow = true;
                while (y + rectHeight < height && canGrow) {
                    for (let i = 0; i < rectWidth; i++) {
                        if (
                            getMatrixPixel(matrix, x + i, y + rectHeight) !== block ||
                            getMatrixPixel(visited, x + i, y + rectHeight)
                        ) {
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
