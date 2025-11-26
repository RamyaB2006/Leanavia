# app.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from datetime import date, datetime
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
import uvicorn

app = FastAPI(title="Learnavia - Portfolio & Recommendations API")

# ------------------------------
# CORS setup
# ------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change ["*"] to your frontend domain(s) for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Pydantic models
# ------------------------------
class Activity(BaseModel):
    id: Optional[str] = None
    type: str
    title: str
    date: Optional[Union[date, str]] = None   # accepts date objects or strings
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    proof_url: Optional[str] = None
    status: Optional[str] = "approved"

def _format_activity_date(d):
    """
    Accepts date | str | None and returns a printable string.
    """
    if d is None:
        return "-"
    if isinstance(d, date):
        return d.isoformat()
    if isinstance(d, str):
        return d
    return str(d)

class StudentProfile(BaseModel):
    name: str
    email: Optional[EmailStr] = None   # optional now
    phone: Optional[str] = None
    college: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    gpa: Optional[float] = None
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    summary: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    profile_image_url: Optional[str] = None

class PortfolioRequest(BaseModel):
    profile: StudentProfile
    activities: Optional[List[Activity]] = []
    include_badges: Optional[bool] = True
    layout: Optional[str] = "standard"

class RecommendationRequest(BaseModel):
    profile: StudentProfile
    activities: Optional[List[Activity]] = []
    num_recs: Optional[int] = 6

# ------------------------------
# Helper: simple PDF generator (reportlab)
# ------------------------------
def build_portfolio_pdf_bytes(profile: StudentProfile, activities: List[Activity], include_badges=True):
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            rightMargin=36, leftMargin=36,
                            topMargin=36, bottomMargin=24)
    styles = getSampleStyleSheet()
    story = []

    # Header
    header = f"{profile.name} — Portfolio"
    story.append(Paragraph(header, styles["Title"]))
    meta = []
    if profile.college:
        meta.append(profile.college)
    if profile.department:
        meta.append(profile.department)
    if profile.year:
        meta.append(f"Year {profile.year}")
    if profile.email:
        meta.append(profile.email)
    if profile.phone:
        meta.append(profile.phone)
    meta_line = " | ".join(meta)
    story.append(Paragraph(meta_line, styles["Normal"]))
    story.append(Spacer(1, 12))

    # Summary
    if profile.summary:
        story.append(Paragraph("<b>Summary</b>", styles["Heading3"]))
        story.append(Paragraph(profile.summary, styles["Normal"]))
        story.append(Spacer(1, 12))

    # Skills & Links
    skills_line = ", ".join(profile.skills or [])
    if skills_line:
        story.append(Paragraph("<b>Skills</b>", styles["Heading3"]))
        story.append(Paragraph(skills_line, styles["Normal"]))
        story.append(Spacer(1, 12))

    links = []
    if profile.linkedin:
        links.append(f"LinkedIn: {profile.linkedin}")
    if profile.github:
        links.append(f"Github: {profile.github}")
    if links:
        story.append(Paragraph("<b>Links</b>", styles["Heading3"]))
        story.append(Paragraph("<br/>".join(links), styles["Normal"]))
        story.append(Spacer(1, 12))

    # Activities Table
    if activities:
        story.append(Paragraph("<b>Selected Activities</b>", styles["Heading3"]))
        table_data = [["Type", "Title", "Date", "Tags", "Status"]]
        for a in activities:
            dt = _format_activity_date(a.date)
            tags = ", ".join(a.tags or [])
            table_data.append([a.type, a.title, dt, tags, a.status or "-"])
        tbl = Table(table_data, repeatRows=1, hAlign='LEFT', colWidths=[70, 200, 60, 100, 60])
        tbl.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#efefef")),
            ('GRID', (0,0), (-1,-1), 0.4, colors.grey),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ]))
        story.append(tbl)
        story.append(Spacer(1, 12))

    # Badges
    if include_badges:
        counts = {}
        for a in activities:
            counts[a.type] = counts.get(a.type, 0) + 1
        if counts:
            story.append(Paragraph("<b>Badges & Milestones</b>", styles["Heading3"]))
            badge_lines = [f"{k.title()}: {v}" for k, v in counts.items()]
            story.append(Paragraph(", ".join(badge_lines), styles["Normal"]))
            story.append(Spacer(1, 12))

    # Footer
    story.append(Spacer(1, 24))
    story.append(Paragraph(f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}", styles["Italic"]))

    doc.build(story)
    buf.seek(0)
    return buf

# ------------------------------
# Simple Recommendation logic
# ------------------------------
DEFAULT_ACTIVITY_POOL = [
    {"type": "workshop", "title": "Advanced ML Workshop", "tags": ["ml", "python", "projects"], "desc": "Hands-on ML workshop"},
    {"type": "internship", "title": "Research Internship (CS Dept)", "tags": ["research", "paper", "nlp"], "desc": "Short research internship"},
    {"type": "project", "title": "Open-source Contribution Sprint", "tags": ["github", "collab", "backend"], "desc": "Contribute to OSS"},
    {"type": "cert", "title": "Cloud Certification (Foundations)", "tags": ["cloud", "aws", "gcp"], "desc": "Entry cloud cert"},
    {"type": "competition", "title": "Hackathon: 48-hour", "tags": ["hackathon", "team", "product"], "desc": "Build prototype"},
    {"type": "course", "title": "Advanced Security Course", "tags": ["security", "network", "crypto"], "desc": "Security fundamentals"},
    {"type": "workshop", "title": "NLP Hands-on", "tags": ["nlp", "transformers"], "desc": "NLP fine-tuning"},
    {"type": "volunteer", "title": "Teaching Assistant", "tags": ["teaching", "mentor"], "desc": "TA for undergrads"}
]

def recommend_activities(profile: StudentProfile, past_activities: List[Activity], num_recs=6):
    scores = []
    interest_set = set([t.lower() for t in (profile.interests or [])])
    skill_set = set([s.lower() for s in (profile.skills or [])])
    done_titles = set([a.title.lower() for a in (past_activities or [])])

    for item in DEFAULT_ACTIVITY_POOL:
        if item["title"].lower() in done_titles:
            continue
        tags = set([t.lower() for t in item.get("tags", [])])
        score = 0
        score += 3 * len(tags & interest_set)
        score += 2 * len(tags & skill_set)
        if profile.year and profile.year >= 3 and item["type"] in ["internship", "project"]:
            score += 2
        score += (sum(ord(c) for c in item["title"]) % 5) / 10.0
        scores.append((score, item))

    scores.sort(key=lambda x: x[0], reverse=True)
    recs = [s[1] for s in scores[:num_recs]]

    out = []
    for r in recs:
        reason_parts = []
        if interest_set & set([t.lower() for t in r["tags"]]):
            reason_parts.append("matches your interests")
        if skill_set & set([t.lower() for t in r["tags"]]):
            reason_parts.append("uses your skills")
        if profile.year and profile.year >= 3 and r["type"] in ["internship", "project"]:
            reason_parts.append("good for final-year portfolio")
        reason = "; ".join(reason_parts) if reason_parts else "recommended"
        out.append({
            "type": r["type"],
            "title": r["title"],
            "tags": r["tags"],
            "description": r["desc"],
            "reason": reason
        })
    return out

# ------------------------------
# Routes
# ------------------------------
@app.post("/generate_portfolio")
async def generate_portfolio(req: PortfolioRequest):
    try:
        buf = build_portfolio_pdf_bytes(req.profile, req.activities or [], include_badges=req.include_badges)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
    filename = f"{req.profile.name.replace(' ','_')}_portfolio.pdf"
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": f"attachment;filename={filename}"})

@app.post("/recommendations")
async def recommendations(req: RecommendationRequest):
    recs = recommend_activities(req.profile, req.activities or [], num_recs=req.num_recs or 6)
    return JSONResponse({"recommendations": recs})

@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

# ------------------------------
# Run with Uvicorn
# ------------------------------
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
