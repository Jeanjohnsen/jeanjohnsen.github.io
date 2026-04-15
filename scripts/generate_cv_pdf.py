from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepInFrame,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUTS = [ROOT / "etc" / "Jean_Johnsen_NNE_Junior_Automation_Engineer_CV_refined.pdf"]


SECTION = colors.HexColor("#142D4B")
TEXT = colors.HexColor("#20242A")
MUTED = colors.HexColor("#5E6875")
SOFT = colors.HexColor("#F4F7FB")
RULE = colors.HexColor("#D5DEEA")


def build_styles():
    styles = getSampleStyleSheet()
    styles["BodyText"].fontName = "Helvetica"
    styles["BodyText"].fontSize = 10.2
    styles["BodyText"].leading = 13.2
    styles["BodyText"].textColor = TEXT

    return {
        "name": ParagraphStyle(
            "Name",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=27,
            textColor=TEXT,
            spaceAfter=2,
        ),
        "role": ParagraphStyle(
            "Role",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=14,
            textColor=SECTION,
            spaceAfter=5,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=styles["BodyText"],
            fontSize=9.8,
            leading=12.2,
            textColor=TEXT,
        ),
        "profile": ParagraphStyle(
            "Profile",
            parent=styles["BodyText"],
            fontSize=9.9,
            leading=13,
            textColor=TEXT,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=14,
            textColor=SECTION,
            spaceAfter=2,
        ),
        "company": ParagraphStyle(
            "Company",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.8,
            leading=12.2,
            textColor=TEXT,
        ),
        "dates": ParagraphStyle(
            "Dates",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.2,
            leading=12.2,
            alignment=TA_RIGHT,
            textColor=TEXT,
        ),
        "meta": ParagraphStyle(
            "Meta",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9.7,
            leading=11.7,
            textColor=MUTED,
        ),
        "meta_right": ParagraphStyle(
            "MetaRight",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9.7,
            leading=11.7,
            alignment=TA_RIGHT,
            textColor=MUTED,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["BodyText"],
            fontSize=9.45,
            leading=11.4,
            leftIndent=12,
            firstLineIndent=0,
            bulletIndent=0,
            spaceBefore=0.5,
            spaceAfter=0.5,
        ),
        "small_heading": ParagraphStyle(
            "SmallHeading",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10.8,
            leading=12.5,
            textColor=SECTION,
            spaceAfter=3,
        ),
        "small_body": ParagraphStyle(
            "SmallBody",
            parent=styles["BodyText"],
            fontSize=9.2,
            leading=11.2,
            textColor=TEXT,
        ),
        "highlight": ParagraphStyle(
            "Highlight",
            parent=styles["BodyText"],
            fontSize=9.3,
            leading=11,
            textColor=SECTION,
        ),
    }


def section_heading(title, styles):
    return [
        Spacer(1, 4),
        Paragraph(title, styles["section"]),
        HRFlowable(width="100%", thickness=1, color=RULE, spaceBefore=2, spaceAfter=4),
    ]


def experience_block(company, dates, title, location, bullets, styles, width):
    header = Table(
        [
            [Paragraph(company, styles["company"]), Paragraph(dates, styles["dates"])],
            [Paragraph(title, styles["meta"]), Paragraph(location, styles["meta_right"])],
        ],
        colWidths=[width * 0.68, width * 0.32],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )

    bullet_flow = [
        Paragraph(item, styles["bullet"], bulletText="\u2022") for item in bullets
    ]
    return KeepTogether([header, Spacer(1, 2), *bullet_flow, Spacer(1, 4)])


def education_column(styles, col_width):
    items = [
        "<b>SIMAC</b><br/>Bachelor in Technology Management and Marine Engineering<br/><font color='#5E6875'>Jan 2025 -- Present · Svendborg, Denmark</font>",
        "<b>Processkolen</b><br/>EUD - Process and Optimization<br/><font color='#5E6875'>Aug 2022 -- Jan 2025 · Kalundborg, Denmark</font>",
        "<b>University of Southern Denmark</b><br/>Bachelor of Science in Computer Science<br/><font color='#5E6875'>Sep 2016 -- Jan 2020 · Odense, Denmark</font>",
    ]
    flow = [Paragraph("Education", styles["small_heading"])]
    for item in items:
        flow.append(Paragraph(item, styles["small_body"]))
        flow.append(Spacer(1, 4))
    return KeepInFrame(col_width, 52 * mm, flow, mode="shrink")


def skills_column(styles, col_width):
    items = [
        "<b>Automation</b><br/>ABB 800xA, ABB SattLine, control logic, HMI / operator interfaces, system testing, troubleshooting, documentation",
        "<b>Pharma and production</b><br/>GMP exposure from pharma operations, process equipment, cross-functional work close to production, MES familiarity with LMES and PAS-X",
        "<b>Programming</b><br/>C#, Java, Python, Rust",
        "<b>Tools and languages</b><br/>Git, GitLab, Danish, English",
    ]
    flow = [Paragraph("Core Skills", styles["small_heading"])]
    for item in items:
        flow.append(Paragraph(item, styles["small_body"]))
        flow.append(Spacer(1, 4))
    return KeepInFrame(col_width, 52 * mm, flow, mode="shrink")


def build_pdf(target: Path):
    target.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(target),
        pagesize=A4,
        leftMargin=17 * mm,
        rightMargin=17 * mm,
        topMargin=15 * mm,
        bottomMargin=14 * mm,
    )
    styles = build_styles()
    width = doc.width

    story = [
        Paragraph("Jean R. Johnsen", styles["name"]),
        Paragraph("Junior Automation Engineer", styles["role"]),
        Paragraph(
            "Kalundborg / Svendborg, Denmark | +45 28905807 | "
            "<link href='mailto:jeanjohnsen@pm.me' color='#20242A'>jeanjohnsen@pm.me</link> | "
            "<link href='https://cv.hojfrekvens.xyz/' color='#20242A'>cv.hojfrekvens.xyz</link>",
            styles["contact"],
        ),
        Spacer(1, 3),
        Paragraph(
            "ABB 800xA · Pharma production support · PCS/DCS interest · Practical GMP mindset",
            styles["highlight"],
        ),
        Spacer(1, 6),
    ]

    profile = Table(
        [[
            Paragraph(
                "Junior Automation Engineer with hands-on experience in ABB 800xA, pharma production support, "
                "and software for technical systems where reliability and clarity matter. I currently build and test "
                "automation solutions at Tipatek and previously worked close to production at Novo Nordisk in Kalundborg, "
                "giving me a practical understanding of quality-critical operations. I am applying to NNE to grow deeper "
                "into PCS/DCS application work in a strong GMP environment and contribute to robust automation solutions.",
                styles["profile"],
            )
        ]],
        colWidths=[width],
    )
    profile.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                ("BOX", (0, 0), (-1, -1), 0.7, SOFT),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(profile)

    story.extend(section_heading("Experience", styles))
    story.append(
        experience_block(
            "Tipatek A/S",
            "Apr 2025 -- Present",
            "Junior Automation Engineer",
            "Odense, Denmark",
            [
                "Develop, configure, and test ABB 800xA automation solutions, including control logic, system configuration, and operator interfaces.",
                "Support structured verification, troubleshooting, and quality-focused delivery of industrial automation systems.",
                "Improve internal automation and IT workflows through debugging, refinement, and practical software support.",
            ],
            styles,
            width,
        )
    )
    story.append(
        experience_block(
            "Novo Nordisk A/S",
            "Aug 2022 -- Feb 2025",
            "Process Operator and IT / Automation Projects",
            "Kalundborg, Denmark",
            [
                "Worked in day-to-day operation of process equipment in pharma production, including troubleshooting and repair in a quality-critical environment.",
                "Contributed to PTFE valve analysis and piping optimization with focus on process robustness and maintainability.",
                "Supported automation and IT improvement efforts through testing, practical problem solving, and collaboration close to production.",
            ],
            styles,
            width,
        )
    )
    story.append(
        experience_block(
            "Netcompany",
            "Jan 2021 -- Jun 2022",
            "Freelance Software Architect",
            "Remote",
            [
                "Delivered mobile and web solutions for Danish clients with focus on system design, maintainability, and secure implementation.",
                "Worked across C#, backend architecture, and technical decision-making for both small and larger customer projects.",
            ],
            styles,
            width,
        )
    )
    story.append(
        experience_block(
            "Level 3 Technologies",
            "Dec 2017 -- Oct 2018",
            "Junior Software Engineer",
            "Odense, Denmark",
            [
                "Built internal modules, scripts, and prototype tooling that improved technical workflows and sped up proof-of-concept work.",
                "Developed a method for comparing cause-and-effect diagrams with real shutdown events, reducing analysis effort and strengthening traceability.",
            ],
            styles,
            width,
        )
    )
    story.append(
        Paragraph(
            "Earlier experience includes student development and data analysis at TV2, web development at Hauch's Physiske Cabinet, and elite sports through Adidas & Team Danmark.",
            styles["meta"],
        )
    )

    story.extend(section_heading("Education and Skills", styles))
    compact_lines = [
        "<b>Education:</b> SIMAC, Bachelor in Technology Management and Marine Engineering, Jan 2025 -- Present; "
        "Processkolen, EUD - Process and Optimization, Aug 2022 -- Jan 2025; "
        "University of Southern Denmark, Bachelor of Science in Computer Science, Sep 2016 -- Jan 2020.",
        "<b>Automation:</b> ABB 800xA, ABB SattLine, control logic, HMI / operator interfaces, system testing, troubleshooting, documentation.",
        "<b>Pharma and production:</b> GMP exposure from pharma operations, process equipment, cross-functional work close to production, MES familiarity with LMES and PAS-X.",
        "<b>Programming:</b> C#, Java, Python, Rust.",
        "<b>Tools and languages:</b> Git, GitLab, Danish, English.",
    ]
    for line in compact_lines:
        story.append(Paragraph(line, styles["small_body"]))
        story.append(Spacer(1, 2))

    doc.build(story)


def main():
    for target in OUTPUTS:
        build_pdf(target)
        print(f"Wrote {target}")


if __name__ == "__main__":
    main()
