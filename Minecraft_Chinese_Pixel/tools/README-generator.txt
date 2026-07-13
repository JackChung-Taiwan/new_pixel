from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import base64
import json
import textwrap

# This utility regenerates the TypeScript bitmap data.
# It does not copy or distribute the font file.
ROOT = Path(__file__).resolve().parents[1]
FONT_PATH = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
FONT_INDEX = 3
FONT_SIZE = 18
CHUNK_SIZE = 450

# See the generated package for the current character selection.
