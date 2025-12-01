from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union
from datetime import date, datetime
import uvicorn

app = FastAPI(title="Learnavia - Attractive Resume Generator API")

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
        # MODERN: Professional two-column layout with clean design
        return """
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px 20px;
        }
        .container { 
            background: white;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            border-radius: 0;
            overflow: hidden;
            display: grid;
            grid-template-columns: 300px 1fr;
            min-height: 100vh;
        }
        .sidebar {
            background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 40px 30px;
        }
        .sidebar .name {
            font-size: 1.8em;
            font-weight: 700;
            margin-bottom: 8px;
            word-wrap: break-word;
        }
        .sidebar .title {
            font-size: 1em;
            opacity: 0.9;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        .sidebar-section {
            margin-bottom: 30px;
        }
        .sidebar-section h3 {
            font-size: 1.1em;
            font-weight: 600;
            margin-bottom: 15px;
            color: #3498db;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .sidebar-item {
            margin-bottom: 10px;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .sidebar-item::before {
            content: '▸';
            color: #3498db;
            font-weight: bold;
        }
        .skill-badge {
            background: rgba(52, 152, 219, 0.2);
            color: #3498db;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            margin: 5px 5px 5px 0;
            display: inline-block;
            border: 1px solid rgba(52, 152, 219, 0.3);
        }
        .main-content {
            padding: 40px 50px;
            background: #f8f9fa;
        }
        .content-section {
            background: white;
            padding: 30px;
            margin-bottom: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .section-title {
            color: #2c3e50;
            font-size: 1.6em;
            font-weight: 700;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #3498db;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title::before {
            content: '●';
            color: #3498db;
            font-size: 0.6em;
        }
        .activity-card {
            background: #f8f9fa;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 6px;
            border-left: 4px solid #3498db;
            transition: all 0.3s ease;
        }
        .activity-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
        }
        .activity-card h4 {
            color: #2c3e50;
            font-size: 1.15em;
            margin-bottom: 8px;
            font-weight: 600;
        }
        .activity-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .activity-tag {
            background: #e8f4f8;
            color: #2980b9;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 0.8em;
            margin-right: 6px;
            display: inline-block;
            margin-top: 8px;
        }
        @media (max-width: 968px) {
            .container {
                grid-template-columns: 1fr;
            }
            .sidebar {
                padding: 30px 20px;
            }
            .main-content {
                padding: 30px 20px;
            }
        }
        """
    elif layout == "creative":
        # CREATIVE: Unique modern design with sidebar and creative elements
        return """
        body { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
            padding: 30px 15px;
        }
        .container { 
            background: white;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            border-radius: 20px;
            overflow: hidden;
            display: grid;
            grid-template-columns: 320px 1fr;
            max-width: 1200px;
            margin: 0 auto;
        }
        .creative-sidebar {
            background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 50px 30px;
            position: relative;
            overflow: hidden;
        }
        .creative-sidebar::before {
            content: '';
            position: absolute;
            top: -100px;
            right: -100px;
            width: 250px;
            height: 250px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        .creative-sidebar::after {
            content: '';
            position: absolute;
            bottom: -80px;
            left: -80px;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        .profile-image-placeholder {
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            border: 4px solid rgba(255,255,255,0.5);
            position: relative;
            z-index: 1;
        }
        .creative-sidebar .name {
            font-size: 2em;
            font-weight: 800;
            margin-bottom: 8px;
            text-align: center;
            position: relative;
            z-index: 1;
        }
        .creative-sidebar .title {
            font-size: 1.1em;
            margin-bottom: 30px;
            text-align: center;
            opacity: 0.95;
            position: relative;
            z-index: 1;
        }
        .creative-divider {
            width: 60px;
            height: 4px;
            background: white;
            margin: 25px auto;
            border-radius: 2px;
            position: relative;
            z-index: 1;
        }
        .creative-section {
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
        }
        .creative-section h3 {
            font-size: 1.2em;
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .contact-list {
            list-style: none;
        }
        .contact-list li {
            margin-bottom: 12px;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .contact-icon {
            width: 30px;
            height: 30px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9em;
        }
        .skill-pill {
            background: rgba(255,255,255,0.25);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 5px 5px 5px 0;
            display: inline-block;
            border: 2px solid rgba(255,255,255,0.4);
            transition: all 0.3s ease;
        }
        .skill-pill:hover {
            background: rgba(255,255,255,0.4);
            transform: scale(1.05);
        }
        .creative-main {
            padding: 50px 40px;
            background: linear-gradient(180deg, #ffffff 0%, #fef5f8 100%);
        }
        .creative-header {
            margin-bottom: 40px;
        }
        .creative-header h2 {
            font-size: 2.5em;
            font-weight: 800;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .creative-header p {
            font-size: 1.1em;
            color: #7f8c8d;
            line-height: 1.8;
        }
        .content-block {
            margin-bottom: 40px;
        }
        .block-title {
            color: #f5576c;
            font-size: 1.8em;
            font-weight: 800;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .block-title::before {
            content: '';
            width: 8px;
            height: 40px;
            background: linear-gradient(180deg, #f5576c, #f093fb);
            border-radius: 4px;
        }
        .activity-creative {
            background: white;
            padding: 25px;
            margin-bottom: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(245,87,108,0.12);
            border: 2px solid #ffe0e6;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
        }
        .activity-creative::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 5px;
            height: 100%;
            background: linear-gradient(180deg, #f5576c, #f093fb);
            border-radius: 15px 0 0 15px;
        }
        .activity-creative:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 35px rgba(245,87,108,0.2);
            border-color: #f5576c;
        }
        .activity-creative h4 {
            color: #f5576c;
            font-size: 1.3em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .activity-creative .meta {
            color: #95a5a6;
            font-size: 0.95em;
            margin-bottom: 10px;
            font-weight: 500;
        }
        .activity-creative .description {
            color: #555;
            line-height: 1.6;
            margin-bottom: 12px;
        }
        .creative-tag {
            background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
            color: #2d3436;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            margin-right: 8px;
            display: inline-block;
            margin-top: 8px;
            border: 2px solid #fdcb6e;
            box-shadow: 0 3px 10px rgba(253,203,110,0.3);
        }
        .timeline-dot {
            width: 12px;
            height: 12px;
            background: #f5576c;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        @media (max-width: 968px) {
            .container {
                grid-template-columns: 1fr;
            }
            .creative-sidebar {
                padding: 40px 25px;
            }
            .creative-main {
                padding: 35px 25px;
            }
        }
        """
    else:  # standard
        return """
        body { 
            background: #ffffff; 
            color: #000000; 
            font-family: 'Times New Roman', Times, serif;
            padding: 20px;
        }
        .container { 
            background: white;
            max-width: 800px;
            border: 1px solid #000000;
            box-shadow: none;
            border-radius: 0;
        }
        .header { 
            background: white;
            color: #000000;
            padding: 40px 40px 20px 40px;
            text-align: center;
            border-bottom: 2px solid #000000;
        }
        .name { 
            font-size: 2.2em; 
            font-weight: bold; 
            margin-bottom: 8px;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .title { 
            font-size: 1.1em; 
            margin-bottom: 15px;
            color: #000000;
            font-style: italic;
        }
        .content { 
            padding: 30px 40px; 
            background: white;
        }
        .section { 
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .section-title { 
            color: #000000; 
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000000;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .skill-tag { 
            background: white;
            color: #000000;
            padding: 4px 0;
            margin: 0 8px 0 0;
            border-radius: 0;
            font-size: 0.95em;
            font-weight: normal;
            display: inline;
            border: none;
            box-shadow: none;
        }
        .skill-tag::after {
            content: ',';
            margin-right: 4px;
        }
        .skill-tag:last-child::after {
            content: '';
        }
        .activity-item { 
            background: white;
            padding: 15px 0;
            margin-bottom: 15px;
            border-radius: 0;
            border-left: none;
            border-bottom: 1px solid #cccccc;
        }
        .activity-item:hover { 
            transform: none;
            box-shadow: none;
        }
        .activity-item h4 {
            color: #000000;
            font-size: 1.1em;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .activity-item p {
            margin: 5px 0;
            line-height: 1.6;
        }
        .contact-info { 
            display: flex;
            justify-content: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #cccccc;
        }
        .contact-item { 
            background: white;
            padding: 0;
            border-radius: 0;
            backdrop-filter: none;
            font-weight: normal;
            border: none;
            color: #000000;
            font-size: 0.95em;
        }
        .contact-item::after {
            content: ' |';
            margin-left: 10px;
            color: #cccccc;
        }
        .contact-item:last-child::after {
            content: '';
        }
        .tag {
            background: white;
            color: #000000;
            padding: 0;
            border-radius: 0;
            font-size: 0.9em;
            font-weight: normal;
            border: none;
            display: inline;
        }
        .tag::after {
            content: ',';
            margin-right: 5px;
        }
        .tag:last-child::after {
            content: '';
        }
        """

def generate_html_portfolio(profile: StudentProfile, activities: List[Activity], layout="standard"):
    
    if layout == "modern":
        # MODERN LAYOUT - Two column professional design
        activities_html = ""
        for activity in activities:
            date_str = str(activity.date) if activity.date else "N/A"
            tags = " ".join([f'<span class="activity-tag">{tag}</span>' for tag in (activity.tags or [])])
            activities_html += f"""
            <div class="activity-card">
                <h4>{activity.title}</h4>
                <div class="activity-meta">{activity.type.upper()} • {date_str}</div>
                {f'<p style="margin: 10px 0; color: #555;">{activity.description}</p>' if activity.description else ''}
                {f'<div>{tags}</div>' if tags.strip() else ''}
            </div>
            """
        
        skills_html = " ".join([f'<span class="skill-badge">{skill}</span>' for skill in (profile.skills or [])])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{profile.name} — Resume</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
                * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                {get_layout_style("modern")}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="sidebar">
                    <div class="name">{profile.name}</div>
                    <div class="title">{profile.department or "Computer Science"}</div>
                    
                    <div class="sidebar-section">
                        <h3>Contact</h3>
                        {f'<div class="sidebar-item">{profile.email}</div>' if profile.email else ''}
                        {f'<div class="sidebar-item">{profile.phone}</div>' if profile.phone else ''}
                        {f'<div class="sidebar-item">{profile.college}</div>' if profile.college else ''}
                    </div>
                    
                    <div class="sidebar-section">
                        <h3>Education</h3>
                        {f'<div class="sidebar-item">Year {profile.year}</div>' if profile.year else ''}
                        {f'<div class="sidebar-item">GPA: {profile.gpa}</div>' if profile.gpa else ''}
                    </div>
                    
                    {f'<div class="sidebar-section"><h3>Skills</h3><div>{skills_html}</div></div>' if profile.skills else ''}
                </div>
                
                <div class="main-content">
                    {f'<div class="content-section"><h2 class="section-title">About Me</h2><p style="line-height: 1.8; color: #555;">{profile.summary}</p></div>' if profile.summary else ''}
                    
                    {f'<div class="content-section"><h2 class="section-title">Activities & Experience</h2>{activities_html}</div>' if activities else ''}
                    
                    <div style="text-align: center; color: #95a5a6; margin-top: 30px; font-size: 0.9em;">
                        Resume generated on {datetime.now().strftime('%B %d, %Y')}
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html
        
    elif layout == "creative":
        # CREATIVE LAYOUT - Unique sidebar design with creative elements
        activities_html = ""
        for activity in activities:
            date_str = str(activity.date) if activity.date else "N/A"
            tags = " ".join([f'<span class="creative-tag">{tag}</span>' for tag in (activity.tags or [])])
            activities_html += f"""
            <div class="activity-creative">
                <h4>{activity.title}</h4>
                <div class="meta"><span class="timeline-dot"></span>{activity.type.upper()} • {date_str}</div>
                {f'<p class="description">{activity.description}</p>' if activity.description else ''}
                {f'<div>{tags}</div>' if tags.strip() else ''}
            </div>
            """
        
        skills_html = " ".join([f'<span class="skill-pill">{skill}</span>' for skill in (profile.skills or [])])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{profile.name} — Resume</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
                * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                {get_layout_style("creative")}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="creative-sidebar">
                    <div class="profile-image-placeholder">👤</div>
                    <div class="name">{profile.name}</div>
                    <div class="title">{profile.department or "Computer Science"}{" at " + profile.college if profile.college else ""}</div>
                    
                    <div class="creative-divider"></div>
                    
                    <div class="creative-section">
                        <h3>Contact</h3>
                        <ul class="contact-list">
                            {f'<li><div class="contact-icon">📧</div><span>{profile.email}</span></li>' if profile.email else ''}
                            {f'<li><div class="contact-icon">📱</div><span>{profile.phone}</span></li>' if profile.phone else ''}
                            {f'<li><div class="contact-icon">🎓</div><span>Year {profile.year}</span></li>' if profile.year else ''}
                            {f'<li><div class="contact-icon">📊</div><span>GPA: {profile.gpa}</span></li>' if profile.gpa else ''}
                        </ul>
                    </div>
                    
                    {f'<div class="creative-divider"></div><div class="creative-section"><h3>Skills</h3><div>{skills_html}</div></div>' if profile.skills else ''}
                </div>
                
                <div class="creative-main">
                    {f'<div class="creative-header"><h2>Hello! 👋</h2><p>{profile.summary}</p></div>' if profile.summary else ''}
                    
                    {f'<div class="content-block"><h2 class="block-title">Experience & Activities</h2>{activities_html}</div>' if activities else ''}
                    
                    <div style="text-align: center; color: #95a5a6; margin-top: 40px; font-size: 0.9em;">
                        ✨ Resume generated on {datetime.now().strftime('%B %d, %Y')} ✨
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html
        
    else:  # STANDARD LAYOUT 
        activities_html = ""
        for activity in activities:
            date_str = str(activity.date) if activity.date else "N/A"
            tags = " ".join([f'<span class="tag">{tag}</span>' for tag in (activity.tags or [])])
            activities_html += f"""
            <div class="activity-item">
                <h4>{activity.title}</h4>
                <p><strong>{activity.type.upper()}</strong> • {date_str}</p>
                {f'<p>{activity.description}</p>' if activity.description else ''}
                {f'<div style="margin-top: 8px;">{tags}</div>' if tags.strip() else ''}
            </div>
            """
        
        skills_html = " ".join([f'<span class="skill-tag">{skill}</span>' for skill in (profile.skills or [])])
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{profile.name} — Resume</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                {get_layout_style("standard")}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="name">{profile.name}</h1>
                    <p class="title">{profile.department or "cse"}{" at " + profile.college if profile.college else ""}</p>
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
                        <p style="text-align: center; color: #666; margin-top: 30px; font-size: 0.9em;">
                            ✨ Resume generated on {datetime.now().strftime('%B %d, %Y')} ✨
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
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")
    
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