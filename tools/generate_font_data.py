from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import base64
import json
import textwrap
import re

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Minecraft_Chinese_Pixel"

FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
FONT_INDEX = 3  # Noto Sans CJK TC
FONT_SIZE = 18
THUMBNAIL_SIZE = 15
THRESHOLD = 150
THIN_CYCLES = 2
CHUNK_SIZE = 450
GLYPH_SIZE = 16

FONT = ImageFont.truetype(FONT_PATH, FONT_SIZE, index=FONT_INDEX)
characters = []

def add(text: str) -> None:
    for character in text:
        if character not in characters and character not in "\r\n":
            characters.append(character)

add("".join(chr(code) for code in range(32, 127)))
add('，。！？、；：「」『』（）《》〈〉【】〔〕［］｛｝…—．％＋－×÷＝＠＃＆＊／＼\u3000＿｜～‧·￥□')

for lead in range(0xA4, 0xC7):
    for trail in list(range(0x40, 0x7F)) + list(range(0xA1, 0xFF)):
        try:
            add(bytes((lead, trail)).decode("big5"))
        except UnicodeDecodeError:
            pass

add("麥塊教育版程式設計人工智慧翊華台北兒童新樂園方塊學院冒險紅石機關建築玩家超能力變數陷阱代理人")

def neighbor_count(pixels, x, y):
    return sum([
        pixels[y - 1][x],
        pixels[y - 1][x + 1],
        pixels[y][x + 1],
        pixels[y + 1][x + 1],
        pixels[y + 1][x],
        pixels[y + 1][x - 1],
        pixels[y][x - 1],
        pixels[y - 1][x - 1],
    ])

def transition_count(pixels, x, y):
    ring = [
        pixels[y - 1][x],
        pixels[y - 1][x + 1],
        pixels[y][x + 1],
        pixels[y + 1][x + 1],
        pixels[y + 1][x],
        pixels[y + 1][x - 1],
        pixels[y][x - 1],
        pixels[y - 1][x - 1],
    ]
    return sum(1 for a, b in zip(ring, ring[1:] + ring[:1]) if a == 0 and b == 1)

def thin_step(pixels, step):
    remove = []
    for y in range(1, GLYPH_SIZE - 1):
        for x in range(1, GLYPH_SIZE - 1):
            if pixels[y][x] == 0:
                continue

            neighbors = neighbor_count(pixels, x, y)
            if neighbors < 2 or neighbors > 6:
                continue
            if transition_count(pixels, x, y) != 1:
                continue

            north = pixels[y - 1][x]
            east = pixels[y][x + 1]
            south = pixels[y + 1][x]
            west = pixels[y][x - 1]

            if step == 0:
                if north * east * south != 0:
                    continue
                if east * south * west != 0:
                    continue
            else:
                if north * east * west != 0:
                    continue
                if north * south * west != 0:
                    continue

            remove.append((x, y))

    for x, y in remove:
        pixels[y][x] = 0

def limited_thinning(pixels):
    # Only two cycles: enough to reduce strokes to a one-pixel skeleton,
    # while preserving more of the original Traditional Chinese proportions.
    for _ in range(THIN_CYCLES):
        thin_step(pixels, 0)
        thin_step(pixels, 1)
    return pixels

def glyph_rows(character: str):
    if character in (" ", "\u3000"):
        return [0] * GLYPH_SIZE

    canvas = Image.new("L", (40, 40), 0)
    draw = ImageDraw.Draw(canvas)
    left, top, right, bottom = draw.textbbox((0, 0), character, font=FONT)
    draw.text(
        ((40 - right + left) // 2 - left, (40 - bottom + top) // 2 - top),
        character,
        font=FONT,
        fill=255
    )

    bounds = canvas.getbbox()
    if not bounds:
        return [0] * GLYPH_SIZE

    cropped = canvas.crop(bounds)
    cropped.thumbnail((THUMBNAIL_SIZE, THUMBNAIL_SIZE), Image.Resampling.LANCZOS)

    bitmap = Image.new("L", (GLYPH_SIZE, GLYPH_SIZE), 0)
    bitmap.paste(
        cropped,
        ((GLYPH_SIZE - cropped.width) // 2, (GLYPH_SIZE - cropped.height) // 2)
    )

    pixels = [
        [1 if bitmap.getpixel((x, y)) >= THRESHOLD else 0 for x in range(GLYPH_SIZE)]
        for y in range(GLYPH_SIZE)
    ]
    pixels = limited_thinning(pixels)

    rows = []
    for y in range(GLYPH_SIZE):
        row = 0
        for x in range(GLYPH_SIZE):
            if pixels[y][x]:
                row |= 1 << (GLYPH_SIZE - 1 - x)
        rows.append(row)
    return rows

def encode(character: str) -> str:
    raw = bytearray()
    for row in glyph_rows(character):
        raw.extend(((row >> 8) & 255, row & 255))
    result = base64.b64encode(raw).decode("ascii")
    assert len(result) == 44
    return result

OUT.mkdir(exist_ok=True)
for old_file in OUT.glob("font-data-*.ts"):
    old_file.unlink()

encoded = [encode(character) for character in characters]
chunks = []
for start in range(0, len(characters), CHUNK_SIZE):
    chunks.append((
        "".join(characters[start:start + CHUNK_SIZE]),
        "".join(encoded[start:start + CHUNK_SIZE])
    ))

source_files = []
for file_index, chunk_start in enumerate(range(0, len(chunks), 2)):
    output = []
    for chunk_index in range(chunk_start, min(chunk_start + 2, len(chunks))):
        chars, glyphs = chunks[chunk_index]
        output.append("// Generated 16×16 Traditional Chinese stroke skeletons. Each pixel becomes 2×2 Minecraft blocks.\n")
        output.append("namespace pixelFontData {\n")
        output.append(f"    export const CHARS_{chunk_index} = {json.dumps(chars, ensure_ascii=False)};\n")
        output.append(f"    export const GLYPHS_{chunk_index} =\n")
        pieces = textwrap.wrap(glyphs, 120)
        for index, piece in enumerate(pieces):
            suffix = " +" if index < len(pieces) - 1 else ";"
            output.append(f'        "{piece}"{suffix}\n')
        output.append("}\n\n")

    destination = OUT / f"font-data-{file_index}.ts"
    destination.write_text("".join(output), encoding="utf-8")
    source_files.append(destination.name)

print(f"Generated {len(characters)} glyphs in {len(source_files)} files.")

def patch_runtime_renderer() -> None:
    main_path = OUT / "main.ts"
    if not main_path.exists():
        return

    source = main_path.read_text(encoding="utf-8")
    pattern = re.compile(
        r"const rows = singleBlockRows\(\s*"
        r"decodeGlyph\(pixelFontData\.glyphFor\(character\)\)\s*"
        r"\)",
        re.MULTILINE,
    )
    replacement = (
        "const rows = decodeGlyph("
        "pixelFontData.glyphFor(character)"
        ")"
    )
    updated, count = pattern.subn(replacement, source, count=1)

    if count == 0:
        print("Renderer already uses generated stroke skeletons.")
        return

    main_path.write_text(updated, encoding="utf-8")
    print("Updated main.ts to use pre-generated stroke skeletons.")

patch_runtime_renderer()
