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

/**
 * 將輸入文字建造成 Minecraft 方塊像素字。
 */
//% block="中文像素字"
//% color="#1565C0"
//% icon="\uf031"
//% weight=90
namespace chinesePixel {
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
        scale = clampInteger(scale, 1, 4)
        spacing = clampInteger(spacing, 0, 4)

        if (!text || text.length === 0) {
            return
        }

        const origin = position.toWorld()
        const block = blockForColor(color)
        const lines = splitLines(text)
        const lineSpacing = 2

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex]
            // 第一行顯示在最上方；position 是整段文字的左下角。
            const lineBaseY = (lines.length - lineIndex - 1) * (16 + lineSpacing)

            for (let characterIndex = 0; characterIndex < line.length; characterIndex++) {
                const character = line.charAt(characterIndex)
                const rows = decodeGlyph(pixelFontData.glyphFor(character))
                const characterBaseX = characterIndex * (16 + spacing)

                for (let rowIndex = 0; rowIndex < 16; rowIndex++) {
                    const rowBits = rows[rowIndex]
                    const pixelY = lineBaseY + (15 - rowIndex)
                    let x = 0

                    // 將同一列連續的像素合併成 blocks.fill，減少指令數量。
                    while (x < 16) {
                        while (x < 16 && !pixelIsSet(rowBits, x)) {
                            x++
                        }

                        if (x >= 16) {
                            break
                        }

                        const runStart = x
                        while (x < 16 && pixelIsSet(rowBits, x)) {
                            x++
                        }

                        fillPixelRun(
                            origin,
                            direction,
                            block,
                            characterBaseX + runStart,
                            pixelY,
                            x - runStart,
                            scale
                        )
                    }
                }
            }
        }
    }

    /**
     * 檢查內建字庫是否包含指定字元。
     */
    //% blockId=minecraft_chinese_pixel_has_character
    //% block="中文字庫包含 $character"
    //% character.defl="學"
    //% weight=80
    export function hasCharacter(character: string): boolean {
        if (!character || character.length === 0) {
            return false
        }
        return pixelFontData.contains(character.charAt(0))
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
        scale = clampInteger(scale, 1, 4)
        spacing = clampInteger(spacing, 0, 4)

        const lines = splitLines(text)
        let longest = 0
        for (let i = 0; i < lines.length; i++) {
            longest = Math.max(longest, lines[i].length)
        }

        if (longest === 0) {
            return 0
        }

        return (longest * 16 + (longest - 1) * spacing) * scale
    }

    function splitLines(text: string): string[] {
        const result: string[] = []
        let current = ""

        for (let i = 0; i < text.length; i++) {
            const character = text.charAt(i)

            if (character === "\n") {
                result.push(current)
                current = ""
            } else if (character !== "\r") {
                current += character
            }
        }

        result.push(current)
        return result
    }

    function clampInteger(value: number, minimum: number, maximum: number): number {
        value = Math.round(value)

        if (value < minimum) {
            return minimum
        }

        if (value > maximum) {
            return maximum
        }

        return value
    }

    function pixelIsSet(rowBits: number, x: number): boolean {
        return (rowBits & (1 << (15 - x))) !== 0
    }

    function decodeGlyph(encoded: string): number[] {
        const bytes: number[] = []

        for (let i = 0; i < encoded.length; i += 4) {
            const a = base64Value(encoded.charCodeAt(i))
            const b = base64Value(encoded.charCodeAt(i + 1))
            const c = base64Value(encoded.charCodeAt(i + 2))
            const d = base64Value(encoded.charCodeAt(i + 3))

            if (a < 0 || b < 0) {
                break
            }

            bytes.push((a << 2) | (b >> 4))

            if (c >= 0) {
                bytes.push(((b & 15) << 4) | (c >> 2))

                if (d >= 0) {
                    bytes.push(((c & 3) << 6) | d)
                }
            }
        }

        const rows: number[] = []

        for (let row = 0; row < 16; row++) {
            const high = bytes[row * 2] || 0
            const low = bytes[row * 2 + 1] || 0
            rows.push((high << 8) | low)
        }

        return rows
    }

    function base64Value(code: number): number {
        if (code >= 65 && code <= 90) {
            return code - 65
        }

        if (code >= 97 && code <= 122) {
            return code - 97 + 26
        }

        if (code >= 48 && code <= 57) {
            return code - 48 + 52
        }

        if (code === 43) {
            return 62
        }

        if (code === 47) {
            return 63
        }

        return -1
    }

    function blockForColor(color: ChinesePixelColor): number {
        switch (color) {
            case ChinesePixelColor.White:
                return WHITE_CONCRETE
            case ChinesePixelColor.Red:
                return RED_CONCRETE
            case ChinesePixelColor.Pink:
                return PINK_CONCRETE
            case ChinesePixelColor.Orange:
                return ORANGE_CONCRETE
            case ChinesePixelColor.Yellow:
                return YELLOW_CONCRETE
            case ChinesePixelColor.Cyan:
                return CYAN_CONCRETE
            case ChinesePixelColor.Lime:
                return LIME_CONCRETE
            case ChinesePixelColor.Blue:
                return BLUE_CONCRETE
            case ChinesePixelColor.LightBlue:
                return LIGHT_BLUE_CONCRETE
            case ChinesePixelColor.Magenta:
                return MAGENTA_CONCRETE
            case ChinesePixelColor.Gray:
                return GRAY_CONCRETE
            case ChinesePixelColor.Purple:
                return PURPLE_CONCRETE
            case ChinesePixelColor.LightGray:
                return LIGHT_GRAY_CONCRETE
            case ChinesePixelColor.Brown:
                return BROWN_CONCRETE
            default:
                return BLACK_CONCRETE
        }
    }

    function fillPixelRun(
        origin: Position,
        direction: CompassDirection,
        block: number,
        pixelX: number,
        pixelY: number,
        runWidth: number,
        scale: number
    ): void {
        const x0 = pixelX * scale
        const x1 = (pixelX + runWidth) * scale - 1
        const y0 = pixelY * scale
        const y1 = y0 + scale - 1

        let fromPosition: Position
        let toPosition: Position

        if (direction === CompassDirection.North) {
            fromPosition = world(
                origin.getValue(Axis.X),
                origin.getValue(Axis.Y) + y0,
                origin.getValue(Axis.Z) - x0
            )
            toPosition = world(
                origin.getValue(Axis.X),
                origin.getValue(Axis.Y) + y1,
                origin.getValue(Axis.Z) - x1
            )
        } else if (direction === CompassDirection.East) {
            fromPosition = world(
                origin.getValue(Axis.X) + x0,
                origin.getValue(Axis.Y) + y0,
                origin.getValue(Axis.Z)
            )
            toPosition = world(
                origin.getValue(Axis.X) + x1,
                origin.getValue(Axis.Y) + y1,
                origin.getValue(Axis.Z)
            )
        } else if (direction === CompassDirection.South) {
            fromPosition = world(
                origin.getValue(Axis.X),
                origin.getValue(Axis.Y) + y0,
                origin.getValue(Axis.Z) + x0
            )
            toPosition = world(
                origin.getValue(Axis.X),
                origin.getValue(Axis.Y) + y1,
                origin.getValue(Axis.Z) + x1
            )
        } else {
            fromPosition = world(
                origin.getValue(Axis.X) - x0,
                origin.getValue(Axis.Y) + y0,
                origin.getValue(Axis.Z)
            )
            toPosition = world(
                origin.getValue(Axis.X) - x1,
                origin.getValue(Axis.Y) + y1,
                origin.getValue(Axis.Z)
            )
        }

        blocks.fill(
            block,
            fromPosition,
            toPosition,
            FillOperation.Replace
        )
    }
}
