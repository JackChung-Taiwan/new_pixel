/**
 * Minecraft Education 中文像素字擴充功能
 * 32×32 中文像素字，固定雙格筆劃。
 * 橫式文字依輸入順序由左到右，並以「正面朝向」決定閱讀面。
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
    const SOURCE_GLYPH_SIZE = 16;
    const GLYPH_SIZE = 32;
    const DEFAULT_LINE_SPACING = 4;

    /**
     * 畫出由左到右的 32×32 中文。請從所選的正面方向觀看。
     * NORTH：站在北側看；EAST：站在東側看；SOUTH：站在南側看；WEST：站在西側看。
     * @param text 要建造的文字，例如：你好麥塊
     * @param position 文字左下角位置
     * @param direction 文字正面朝向
     * @param color 混凝土顏色
     * @param scale 放大倍率，建議 1
     * @param spacing 字距，建議 4
     */
    //% blockId=minecraft_chinese_pixel_draw_text_ltr_v036
    //% block="畫出左到右32×32中文 $text|在 $position|正面朝向 $direction|顏色 $color|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="你好麥塊"
    //% position.shadow=minecraftCreatePosition
    //% direction.defl=CompassDirection.South
    //% color.defl=ChinesePixelColor.Blue
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=8 spacing.defl=4
    //% weight=100
    export function drawText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Blue,
        scale: number = 1,
        spacing: number = 4
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 8);
        const origin = position.toWorld();
        drawHorizontalInternal(text, origin, direction, blockForColor(color), scale, spacing);
    }

    /**
     * 畫出 32×32 直排中文，第一個字在最上方。
     */
    //% blockId=minecraft_chinese_pixel_draw_vertical_text_v036
    //% block="畫出32×32直排中文 $text|在 $position|正面朝向 $direction|顏色 $color|放大 $scale 倍|字距 $spacing"
    //% inlineInputMode=external
    //% text.defl="翊華教育"
    //% position.shadow=minecraftCreatePosition
    //% direction.defl=CompassDirection.South
    //% color.defl=ChinesePixelColor.Black
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=8 spacing.defl=4
    //% weight=96
    export function drawVerticalText(
        text: string,
        position: Position,
        direction: CompassDirection,
        color: ChinesePixelColor = ChinesePixelColor.Black,
        scale: number = 1,
        spacing: number = 4
    ): void {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 8);
        const origin = position.toWorld();
        drawVerticalInternal(removeLineBreaks(text), origin, direction, blockForColor(color), scale, spacing);
    }

    /**
     * 計算一行 32×32 中文的寬度。
     */
    //% blockId=minecraft_chinese_pixel_text_width_v036
    //% block="$text 放大 $scale 倍 字距 $spacing 的寬度"
    //% text.defl="你好麥塊"
    //% scale.min=1 scale.max=4 scale.defl=1
    //% spacing.min=0 spacing.max=8 spacing.defl=4
    //% weight=70
    export function textWidth(text: string, scale: number = 1, spacing: number = 4): number {
        scale = clampInteger(scale, 1, 4);
        spacing = clampInteger(spacing, 0, 8);
        const lines = splitLines(text);
        let longest = 0;
        for (let i = 0; i < lines.length; i++) longest = Math.max(longest, lines[i].length);
        if (longest === 0) return 0;
        return (longest * GLYPH_SIZE + (longest - 1) * spacing) * scale;
    }

    function drawHorizontalInternal(text: string, origin: Position, direction: CompassDirection, block: number, scale: number, spacing: number): void {
        if (!text || text.length === 0) text = " ";
        const lines = splitLines(text);

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            const baseY = (lines.length - lineIndex - 1) * (GLYPH_SIZE + DEFAULT_LINE_SPACING) * scale;

            for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
                // 嚴格依輸入順序：你、好、麥、塊。
                const baseX = characterIndex * (GLYPH_SIZE + spacing) * scale;
                drawGlyph(line.charAt(characterIndex), origin, direction, block, baseX, baseY, scale);
            }
        }
    }

    function drawVerticalInternal(text: string, origin: Position, direction: CompassDirection, block: number, scale: number, spacing: number): void {
        if (!text || text.length === 0) text = " ";

        for (let i = 0; i < text.length; i++) {
            const baseY = (text.length - i - 1) * (GLYPH_SIZE + spacing) * scale;
            drawGlyph(text.charAt(i), origin, direction, block, 0, baseY, scale);
        }
    }

    function drawGlyph(character: string, origin: Position, direction: CompassDirection, block: number, baseX: number, baseY: number, scale: number): void {
        const rows = singleBlockRows(decodeGlyph(pixelFontData.glyphFor(character)));

        for (let sourceY = 0; sourceY < SOURCE_GLYPH_SIZE; sourceY++) {
            const sourceRow = rows[sourceY];
            let sourceX = 0;

            while (sourceX < SOURCE_GLYPH_SIZE) {
                while (sourceX < SOURCE_GLYPH_SIZE && !sourcePixelIsSet(sourceRow, sourceX)) sourceX++;
                if (sourceX >= SOURCE_GLYPH_SIZE) break;

                const runStart = sourceX;
                while (sourceX < SOURCE_GLYPH_SIZE && sourcePixelIsSet(sourceRow, sourceX)) sourceX++;
                const runEnd = sourceX - 1;

                // 字庫的 x=0 就是字形左側，不再做任何水平鏡像。
                const x0 = baseX + runStart * 2 * scale;
                const x1 = baseX + ((runEnd + 1) * 2 * scale) - 1;
                const y0 = baseY + (SOURCE_GLYPH_SIZE - 1 - sourceY) * 2 * scale;
                const y1 = y0 + 2 * scale - 1;

                fillBlockRect(origin, direction, block, x0, y0, x1, y1);
            }
        }
    }

    /**
     * 將本地座標轉成 Minecraft 世界座標。
     * 本地 x 永遠代表「從文字正面看向右」，因此輸入順序固定由左到右。
     */
    function fillBlockRect(origin: Position, direction: CompassDirection, block: number, x0: number, y0: number, x1: number, y1: number): void {
        let fromPosition: Position;
        let toPosition: Position;
        const ox = origin.getValue(Axis.X);
        const oy = origin.getValue(Axis.Y);
        const oz = origin.getValue(Axis.Z);

        if (direction === CompassDirection.North) {
            // 正面在北側；站在北側向南看時，畫面右方是世界西方（-X）。
            fromPosition = world(ox - x0, oy + y0, oz);
            toPosition = world(ox - x1, oy + y1, oz);
        } else if (direction === CompassDirection.East) {
            // 正面在東側；站在東側向西看時，畫面右方是世界北方（-Z）。
            fromPosition = world(ox, oy + y0, oz - x0);
            toPosition = world(ox, oy + y1, oz - x1);
        } else if (direction === CompassDirection.South) {
            // 正面在南側；站在南側向北看時，畫面右方是世界東方（+X）。
            fromPosition = world(ox + x0, oy + y0, oz);
            toPosition = world(ox + x1, oy + y1, oz);
        } else {
            // 正面在西側；站在西側向東看時，畫面右方是世界南方（+Z）。
            fromPosition = world(ox, oy + y0, oz + x0);
            toPosition = world(ox, oy + y1, oz + x1);
        }

        blocks.fill(block, fromPosition, toPosition, FillOperation.Replace);
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
        for (let row = 0; row < SOURCE_GLYPH_SIZE; row++) {
            const high = bytes[row * 2] || 0;
            const low = bytes[row * 2 + 1] || 0;
            rows.push((high << 8) | low);
        }
        return rows;
    }

    function singleBlockRows(rows: number[]): number[] {
        const pixels = rowsToMatrix(rows);
        let changed = true;
        let guard = 0;

        while (changed && guard < 8) {
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

        for (let y = 1; y < SOURCE_GLYPH_SIZE - 1; y++) {
            for (let x = 1; x < SOURCE_GLYPH_SIZE - 1; x++) {
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

        for (let i = 0; i < removeX.length; i++) setMatrixPixel(pixels, removeX[i], removeY[i], 0);
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

    function rowsToMatrix(rows: number[]): number[][] {
        const matrix = createMatrix(SOURCE_GLYPH_SIZE, SOURCE_GLYPH_SIZE);
        for (let y = 0; y < SOURCE_GLYPH_SIZE; y++) {
            for (let x = 0; x < SOURCE_GLYPH_SIZE; x++) {
                if (sourcePixelIsSet(rows[y], x)) setMatrixPixel(matrix, x, y, 1);
            }
        }
        return matrix;
    }

    function matrixToRows(matrix: number[][]): number[] {
        const rows: number[] = [];
        for (let y = 0; y < SOURCE_GLYPH_SIZE; y++) {
            let row = 0;
            for (let x = 0; x < SOURCE_GLYPH_SIZE; x++) {
                if (getMatrixPixel(matrix, x, y)) row |= 1 << (SOURCE_GLYPH_SIZE - 1 - x);
            }
            rows.push(row);
        }
        return rows;
    }

    function sourcePixelIsSet(row: number, x: number): boolean {
        return (row & (1 << (SOURCE_GLYPH_SIZE - 1 - x))) !== 0;
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
