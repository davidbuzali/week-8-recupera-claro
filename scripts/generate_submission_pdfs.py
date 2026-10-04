"""Generate and verify the Week 8 submission PDFs from project sources."""

from __future__ import annotations

import html
import json
import re
import sqlite3
import unicodedata
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

FONT_REGULAR = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")
FONT_BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
EMOJI_FONT = Path("/System/Library/Fonts/Apple Color Emoji.ttc")

pdfmetrics.registerFont(TTFont("AUnicode", str(FONT_REGULAR)))
pdfmetrics.registerFont(TTFont("AUnicodeBold", str(FONT_BOLD)))
pdfmetrics.registerFont(TTFont("AppleEmoji", str(EMOJI_FONT), subfontIndex=0))

MAIN_GLYPHS = pdfmetrics.getFont("AUnicode").face.charWidths
EMOJI_GLYPHS = pdfmetrics.getFont("AppleEmoji").face.charWidths

NAVY = colors.HexColor("#0b334b")
TEAL = colors.HexColor("#0c8c91")
MUTED = colors.HexColor("#5d6e78")
LINE = colors.HexColor("#ced8d5")
PAPER = colors.HexColor("#fbfbf7")
AMBER = colors.HexColor("#d68b18")


def normalize(text: str) -> str:
    return (
        text.replace("\u2010", "-")
        .replace("\u2011", "-")
        .replace("\u2012", "-")
        .replace("\u2013", "-")
        .replace("\u2014", "-")
        .replace("\u2212", "-")
        .replace("\u00a0", " ")
    )


def humanize_app_directives(text: str) -> str:
    text = re.sub(
        r':codex-file-citation\{path="([^"]+)" purpose="(?:source|output)"\}',
        lambda match: f"[PDF: {Path(match.group(1)).name}]",
        text,
    )
    text = re.sub(
        r'-\s*:codex-followup\[([^]]+)\]\{prompt="[^"]*"\}',
        lambda match: f"- Suggested next action: {match.group(1)}",
        text,
    )
    return text


def render_supported(text: str) -> str:
    chunks: list[str] = []
    for char in normalize(text).replace("\t", "    "):
        if char == "\ufe0f":
            continue
        escaped = html.escape(char, quote=False)
        if ord(char) not in MAIN_GLYPHS and ord(char) in EMOJI_GLYPHS:
            chunks.append(f"[emoji: {unicodedata.name(char, 'symbol').lower()}]")
        else:
            chunks.append(escaped)
    return "".join(chunks)


def inline_markup(text: str) -> str:
    value = render_supported(text)
    value = re.sub(
        r"\[([^\]]+)\]\((https?://[^)]+)\)",
        lambda match: f'<link href="{match.group(2)}" color="#0b6c82"><u>{match.group(1)}</u></link>',
        value,
    )
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"`([^`]+)`", r'<font name="Courier">\1</font>', value)
    value = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", value)
    return value


def make_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "TitleX",
            parent=styles["Title"],
            fontName="AUnicodeBold",
            fontSize=22,
            leading=25,
            textColor=NAVY,
            alignment=TA_CENTER,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2X",
            parent=styles["Heading2"],
            fontName="AUnicodeBold",
            fontSize=13,
            leading=16,
            textColor=NAVY,
            spaceBefore=11,
            spaceAfter=5,
        ),
        "h3": ParagraphStyle(
            "H3X",
            parent=styles["Heading3"],
            fontName="AUnicodeBold",
            fontSize=9.8,
            leading=12,
            textColor=TEAL,
            spaceBefore=8,
            spaceAfter=3,
        ),
        "body": ParagraphStyle(
            "BodyX",
            parent=styles["BodyText"],
            fontName="AUnicode",
            fontSize=8.4,
            leading=11.6,
            textColor=colors.HexColor("#1e2d36"),
            spaceAfter=5,
        ),
        "bullet": ParagraphStyle(
            "BulletX",
            parent=styles["BodyText"],
            fontName="AUnicode",
            fontSize=8.2,
            leading=11.2,
            leftIndent=14,
            firstLineIndent=-8,
            textColor=colors.HexColor("#263841"),
            spaceAfter=3,
        ),
        "code": ParagraphStyle(
            "CodeX",
            fontName="Courier",
            fontSize=6.3,
            leading=8.0,
            leftIndent=8,
            rightIndent=8,
            textColor=colors.HexColor("#203544"),
            backColor=colors.HexColor("#eef3f2"),
            borderColor=LINE,
            borderWidth=0.5,
            borderPadding=7,
            spaceAfter=8,
        ),
        "caption": ParagraphStyle(
            "CaptionX",
            parent=styles["BodyText"],
            fontName="AUnicode",
            fontSize=7.2,
            leading=9.2,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=7,
        ),
        "small": ParagraphStyle(
            "SmallX",
            parent=styles["BodyText"],
            fontName="AUnicode",
            fontSize=7.2,
            leading=9.4,
            textColor=MUTED,
            spaceAfter=3,
        ),
    }


STYLES = make_styles()


def image_flowable(path: Path, alt: str):
    with PILImage.open(path) as source:
        width, height = source.size
    max_width = 7.25 * inch
    # Leave enough vertical room for a section heading and caption so a
    # screenshot is not pushed to a mostly blank following page.
    max_height = 8.45 * inch
    scale = min(max_width / width, max_height / height)
    return [Image(str(path), width=width * scale, height=height * scale), Paragraph(inline_markup(alt), STYLES["caption"])]


def paragraph_block(lines: list[str]):
    text = " ".join(line.strip() for line in lines).strip()
    return Paragraph(inline_markup(text), STYLES["body"]) if text else Spacer(1, 1)


def parse_markdown(path: Path):
    lines = normalize(path.read_text(encoding="utf-8")).splitlines()
    story = []
    index = 0
    paragraph: list[str] = []

    def flush():
        nonlocal paragraph
        if paragraph:
            story.append(paragraph_block(paragraph))
            paragraph = []

    while index < len(lines):
        line = lines[index]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush()
            language = stripped[3:].strip()
            index += 1
            code_lines = []
            while index < len(lines) and not lines[index].strip().startswith("```"):
                code_lines.append(lines[index])
                index += 1
            label = "MERMAID DIAGRAM - diagram-as-code" if language == "mermaid" else language.upper()
            if label:
                story.append(Paragraph(render_supported(label), STYLES["h3"]))
            story.append(Preformatted("\n".join(code_lines), STYLES["code"]))
            index += 1
            continue

        image_match = re.fullmatch(r"!\[([^]]*)\]\(([^)]+)\)", stripped)
        if image_match:
            flush()
            image_path = (path.parent / image_match.group(2)).resolve()
            image_block = image_flowable(image_path, image_match.group(1))
            if story and isinstance(story[-1], Paragraph) and story[-1].style in (STYLES["h2"], STYLES["h3"]):
                heading = story.pop()
                story.append(KeepTogether([heading, *image_block]))
            else:
                story.extend(image_block)
            index += 1
            continue

        if stripped == "<!-- pagebreak -->":
            flush()
            story.append(PageBreak())
            index += 1
            continue

        if stripped.startswith("# "):
            flush()
            story.append(Paragraph(inline_markup(stripped[2:]), STYLES["title"]))
            story.append(HRFlowable(width="100%", thickness=1.3, color=TEAL, spaceAfter=9))
            index += 1
            continue
        if stripped.startswith("## "):
            flush()
            story.append(Paragraph(inline_markup(stripped[3:]), STYLES["h2"]))
            index += 1
            continue
        if stripped.startswith("### "):
            flush()
            story.append(Paragraph(inline_markup(stripped[4:]), STYLES["h3"]))
            index += 1
            continue

        if stripped.startswith("|") and index + 1 < len(lines) and re.match(r"^\|?\s*:?-+", lines[index + 1].strip()):
            flush()
            table_lines = [stripped]
            index += 2
            while index < len(lines) and lines[index].strip().startswith("|"):
                table_lines.append(lines[index].strip())
                index += 1
            data = []
            for row in table_lines:
                cells = [cell.strip() for cell in row.strip("|").split("|")]
                data.append([Paragraph(inline_markup(cell), STYLES["small"]) for cell in cells])
            column_count = max(len(row) for row in data)
            widths = [7.2 * inch / column_count] * column_count
            table = Table(data, colWidths=widths, repeatRows=1)
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("FONTNAME", (0, 0), (-1, 0), "AUnicodeBold"),
                        ("GRID", (0, 0), (-1, -1), 0.45, LINE),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("BACKGROUND", (0, 1), (-1, -1), PAPER),
                        ("LEFTPADDING", (0, 0), (-1, -1), 5),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                        ("TOPPADDING", (0, 0), (-1, -1), 5),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ]
                )
            )
            story.extend([table, Spacer(1, 7)])
            continue

        if re.match(r"^-\s+", stripped):
            flush()
            story.append(Paragraph(inline_markup(re.sub(r"^-\s+", "", stripped)), STYLES["bullet"], bulletText="-"))
            index += 1
            continue
        numbered = re.match(r"^(\d+)\.\s+(.*)", stripped)
        if numbered:
            flush()
            story.append(Paragraph(inline_markup(numbered.group(2)), STYLES["bullet"], bulletText=f"{numbered.group(1)}."))
            index += 1
            continue
        if stripped == "---":
            flush()
            story.append(HRFlowable(width="100%", thickness=0.6, color=LINE, spaceBefore=3, spaceAfter=6))
            index += 1
            continue
        if not stripped:
            flush()
            index += 1
            continue

        paragraph.append(stripped)
        index += 1

    flush()
    return story


def footer(canvas, doc, label: str):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(0.55 * inch, 0.48 * inch, 7.95 * inch, 0.48 * inch)
    canvas.setFont("AUnicode", 6.8)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.55 * inch, 0.31 * inch, label)
    canvas.drawRightString(7.95 * inch, 0.31 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_markdown_pdf(source: Path, target: Path, label: str):
    doc = SimpleDocTemplate(
        str(target),
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.65 * inch,
        title=source.stem,
        author="David Buzali",
    )
    doc.build(
        parse_markdown(source),
        onFirstPage=lambda canvas, page_doc: footer(canvas, page_doc, label),
        onLaterPages=lambda canvas, page_doc: footer(canvas, page_doc, label),
    )


def build_chat_pdf(target: Path):
    database = Path("/Users/davidbuzali/.codex/thread_history_1.sqlite")
    thread_id = "01a108e0-e199-7af0-ba83-886b1d4975d4"
    with sqlite3.connect(f"file:{database}?mode=ro", uri=True) as connection:
        rows = connection.execute(
            """SELECT rollout_ordinal, created_at_ms, item_type, item_json
               FROM thread_items
               WHERE thread_id = ? AND item_type IN ('userMessage', 'agentMessage')
               ORDER BY rollout_ordinal""",
            (thread_id,),
        ).fetchall()

    messages = []
    for ordinal, created_ms, item_type, raw in rows:
        item = json.loads(raw)
        if item_type == "userMessage":
            parts = [block.get("text", "") for block in item.get("content", []) if block.get("type") == "text"]
            body = "\n".join(parts)
            role = "DAVID"
        else:
            body = item.get("text", "")
            role = "CODEX - progress update" if item.get("phase") == "commentary" else "CODEX"
        if body:
            messages.append((ordinal, created_ms, role, normalize(humanize_app_directives(body))))

    if not messages:
        raise RuntimeError("No visible chat messages found for the Week 8 task")

    raw_target = ROOT / "output" / "BUILDCHAT_davidbuzali_raw.txt"
    raw_target.parent.mkdir(parents=True, exist_ok=True)
    with raw_target.open("w", encoding="utf-8") as stream:
        for index, (_ordinal, created_ms, role, body) in enumerate(messages, 1):
            when = datetime.fromtimestamp(created_ms / 1000, ZoneInfo("America/Mexico_City"))
            stream.write(f"{index:02d}  {role}  |  {when:%d %b %Y %H:%M:%S}\n{body}\n\n")

    role_style = ParagraphStyle(
        "ChatRole",
        fontName="AUnicodeBold",
        fontSize=8.8,
        leading=11,
        textColor=TEAL,
        spaceBefore=8,
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "ChatBody",
        fontName="AUnicode",
        fontSize=7.7,
        leading=10.4,
        textColor=colors.HexColor("#202d35"),
        spaceAfter=2,
        splitLongWords=True,
    )
    first = datetime.fromtimestamp(messages[0][1] / 1000, ZoneInfo("America/Mexico_City"))
    last = datetime.fromtimestamp(messages[-1][1] / 1000, ZoneInfo("America/Mexico_City"))
    story = [
        Paragraph("WEEK 8 - BUILD CHAT", STYLES["title"]),
        Paragraph(
            inline_markup(
                f"David Buzali and Codex | {len(messages)} visible messages | "
                f"{first:%d %b %Y %H:%M} to {last:%d %b %Y %H:%M} Mexico City time"
            ),
            STYLES["caption"],
        ),
        Paragraph(
            "Complete user-visible conversation through the export. Tool calls and private reasoning are excluded. "
            "Emoji are labeled for PDF legibility; the companion UTF-8 text preserves the original characters.",
            STYLES["small"],
        ),
        HRFlowable(width="100%", thickness=1.1, color=TEAL, spaceAfter=5),
    ]

    for index, (_ordinal, created_ms, role, body) in enumerate(messages, 1):
        when = datetime.fromtimestamp(created_ms / 1000, ZoneInfo("America/Mexico_City"))
        heading = Paragraph(f"{index:02d}  {role}  |  {when:%d %b %Y %H:%M:%S}", role_style)
        paragraphs = [Paragraph(render_supported(line) if line else "&nbsp;", body_style) for line in body.split("\n")]
        story.append(KeepTogether([heading] + paragraphs[:2]))
        story.extend(paragraphs[2:])
        story.append(Spacer(1, 2))

    doc = SimpleDocTemplate(
        str(target),
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.5 * inch,
        bottomMargin=0.65 * inch,
        title="Week 8 build chat - David Buzali",
        author="David Buzali and Codex",
    )
    doc.build(
        story,
        onFirstPage=lambda canvas, page_doc: footer(canvas, page_doc, "WEEK 8 / RECUPERA CLARO / BUILD CHAT"),
        onLaterPages=lambda canvas, page_doc: footer(canvas, page_doc, "WEEK 8 / RECUPERA CLARO / BUILD CHAT"),
    )


if __name__ == "__main__":
    build_markdown_pdf(ROOT / "docs" / "PACKET.md", OUT / "PACKET_davidbuzali.pdf", "WEEK 8 / RECUPERA CLARO / PACKET")
    build_markdown_pdf(ROOT / "docs" / "PERSONA.md", OUT / "PERSONA_davidbuzali.pdf", "WEEK 8 / RECUPERA CLARO / PERSONA TEST")
    build_chat_pdf(OUT / "BUILDCHAT_davidbuzali.pdf")
    for pdf in sorted(OUT.glob("*.pdf")):
        print(f"{pdf}: {pdf.stat().st_size} bytes")
