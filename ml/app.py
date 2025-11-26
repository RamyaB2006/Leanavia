from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from datetime import date, datetime
import uvicorn

app = FastAPI(title="Learnavia - Attractive Portfolio Generator API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Activity(BaseModel):
    id: Optional[str] = None
    type: str
    title: str
    date: Optional[Union[date, str]] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    proof_url: Optional[str] = None
    status: Optional[str] = "approved"

class StudentProfile(BaseModel):
    name: str
    email: Optional[EmailStr] = None
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

# Helper function to get layout styles
def get_layout_style(layout):
    if layout == "modern":
        return """
        body { background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%); color: #fff; }
        .container { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .section-title { color: #4ecdc4; }
        .skill-tag { background: linear-gradient(45deg, #667eea, #764ba2); }
        .activity-item { background: rgba(255,255,255,0.05); border-left: 4px solid #4ecdc4; }
        """
    elif layout == "creative":
        return """
        body { background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .section-title { color: #ff6b6b; font-family: 'Comic Sans MS', cursive; }
        .skill-tag { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); border-radius: 25px; }
        .activity-item { background: #fff; border-radius: 15px; box-shadow: 0 10px 25px rgba(255,107,107,0.2); }
        .activity-item:hover { transform: translateY(-5px) rotate(1deg); }
        """
    else:  
        return """
        body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .header { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); }
        .section-title { color: #2196F3; }
        .skill-tag { background: linear-gradient(135deg, #2196F3, #1976D2); }
        .activity-item { background: white; border-left: 4px solid #2196F3; }
        """

def generate_html_portfolio(profile: StudentProfile, activities: List[Activity], layout="standard"):
    activities_html = ""
    for activity in activities:
        date_str = str(activity.date) if activity.date else "N/A"
        tags = " ".join([f'<span class="tag">{tag}</span>' for tag in (activity.tags or [])])
        activities_html += f"""
        <div class="activity-item">
            <h4>{activity.title}</h4>
            <p><strong>{activity.type.upper()}</strong> • {date_str}</p>
            {f'<p>{activity.description}</p>' if activity.description else ''}
            <div>{tags}</div>
        </div>
        """
    
    skills_html = " ".join([f'<span class="skill-tag">{skill}</span>' for skill in (profile.skills or [])])
    
    layout_styles = get_layout_style(layout)

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>{profile.name} - Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ font-family: 'Inter', sans-serif; min-height: 100vh; padding: 20px; }}
            .container {{ max-width: 900px; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }}
            .header {{ color: white; padding: 50px 40px; text-align: center; }}
            .name {{ font-size: 2.5em; font-weight: 700; margin-bottom: 10px; }}
            .title {{ font-size: 1.2em; margin-bottom: 20px; opacity: 0.9; }}
            .content {{ padding: 40px; background: white; }}
            .section {{ margin-bottom: 30px; }}
            .section-title {{ font-size: 1.5em; font-weight: 600; margin-bottom: 15px; border-bottom: 2px solid #eee; padding-bottom: 8px; }}
            .skill-tag {{ display: inline-block; color: white; padding: 6px 12px; margin: 4px; border-radius: 15px; font-size: 0.9em; font-weight: 500; }}
            .activity-item {{ padding: 20px; margin-bottom: 15px; border-radius: 8px; transition: all 0.3s ease; }}
            .activity-item:hover {{ transform: translateY(-2px); }}
            .tag {{ background: #f0f0f0; padding: 4px 8px; margin: 2px; border-radius: 10px; font-size: 0.8em; display: inline-block; }}
            .contact-info {{ display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }}
            .contact-item {{ background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 15px; }}
            @media (max-width: 768px) {{
                .header {{ padding: 30px 20px; }}
                .name {{ font-size: 2em; }}
                .content {{ padding: 25px 20px; }}
                .contact-info {{ flex-direction: column; align-items: center; }}
            }}
            {layout_styles}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="name">{profile.name}</h1>
                <p class="title">{profile.department or "Student"}{" at " + profile.college if profile.college else ""}</p>
                <div class="contact-info">
                    {f'<div class="contact-item">📧 {profile.email}</div>' if profile.email else ''}
                    {f'<div class="contact-item">📱 {profile.phone}</div>' if profile.phone else ''}
                    {f'<div class="contact-item">🎓 Year {profile.year}</div>' if profile.year else ''}
                    {f'<div class="contact-item">📊 GPA: {profile.gpa}</div>' if profile.gpa else ''}
                </div>
            </div>
            
            <div class="content">
                {f'<div class="section"><h2 class="section-title">About</h2><p>{profile.summary}</p></div>' if profile.summary else ''}
                
                {f'<div class="section"><h2 class="section-title">Skills</h2><div>{skills_html}</div></div>' if profile.skills else ''}
                
                {f'<div class="section"><h2 class="section-title">Activities</h2>{activities_html}</div>' if activities else ''}
                
                <div class="section">
                    <p style="text-align: center; color: #666; margin-top: 30px;">
                        ✨ Portfolio generated on {datetime.now().strftime('%B %d, %Y')} ✨
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    return html

@app.post("/generate_portfolio")
async def generate_portfolio(req: PortfolioRequest):
    try:
        html_content = generate_html_portfolio(
            req.profile, 
            req.activities or [], 
            req.layout or "standard"
        )
        return HTMLResponse(content=html_content, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio generation failed: {str(e)}")
    
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

@app.post("/recommendations")
async def recommendations(req: RecommendationRequest):
    recs = recommend_activities(req.profile, req.activities or [], num_recs=req.num_recs or 6)
    return JSONResponse({"recommendations": recs})

@app.get("/health")
async def health():
    return {"status": "ok", "time": datetime.utcnow().isoformat()}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)