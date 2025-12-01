import requests
import json

# FastAPI endpoint
API_URL = "http://localhost:8000/generate_portfolio"

# Sample student profile and activities data
sample_data = {
    "profile": {
        "name": "Ramya",
        "email": "230878.cs@rmkec.ac.in",
        "phone": "9876543210",
        "college": "abc",
        "department": "cse",
        "year": 3,
        "gpa": 8.5,
        "skills": [
            "ethical hacking",
            "python",
            "web development",
            "cybersecurity"
        ],
        "interests": [
            "machine learning",
            "security",
            "open source"
        ],
        "summary": "Passionate computer science student with strong interest in cybersecurity and web development. Actively participating in various technical activities and constantly learning new technologies."
    },
    "activities": [
        {
            "type": "internship",
            "title": "internship",
            "date": "2025-11-26",
            "description": "INTERNSHIP",
            "tags": ["python", "backend"]
        },
        {
            "type": "internship",
            "title": "internship",
            "date": "2025-11-27",
            "description": "INTERNSHIP",
            "tags": ["react", "frontend"]
        },
        {
            "type": "workshop",
            "title": "Machine Learning Workshop",
            "date": "2025-10-15",
            "description": "Attended hands-on workshop on ML algorithms and practical implementation",
            "tags": ["machine learning", "python", "scikit-learn"]
        },
        {
            "type": "project",
            "title": "E-commerce Website",
            "date": "2025-09-20",
            "description": "Built a full-stack e-commerce platform with payment integration",
            "tags": ["react", "node.js", "mongodb"]
        },
        {
            "type": "competition",
            "title": "Hackathon Winner",
            "date": "2025-08-10",
            "description": "Won first place in 24-hour hackathon for building AI-powered chatbot",
            "tags": ["ai", "nlp", "python"]
        }
    ],
    "include_badges": True
}

def generate_resume(layout_type):
    """Generate resume for a specific layout type"""
    print(f"\n Generating {layout_type.upper()} resume...")
    
    # Add layout to the request data
    request_data = sample_data.copy()
    request_data["layout"] = layout_type
    
    try:
        # Make POST request to FastAPI
        response = requests.post(API_URL, json=request_data)
        
        if response.status_code == 200:
            # Save HTML to file
            filename = f"{layout_type}_resume.html"
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(response.text)
            print(f"{layout_type.upper()} resume saved as: {filename}")
            return True
        else:
            print(f" Error generating {layout_type} resume: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f" Cannot connect to FastAPI server at {API_URL}")
        print("   Make sure the server is running with: python app.py")
        return False
    except Exception as e:
        print(f" Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print(" Resume Generator Test Script")
    print("=" * 60)
    print("\nThis script will generate 3 resume versions:")
    print("  1. Standard  - Simple, traditional format")
    print("  2. Modern    - Professional two-column layout")
    print("  3. Creative  - Unique sidebar design with vibrant colors")
    print("\nMake sure FastAPI server is running on http://localhost:8000")
    print("=" * 60)
    
    # Generate all three versions
    layouts = ["standard", "modern", "creative"]
    results = {}
    
    for layout in layouts:
        results[layout] = generate_resume(layout)
    
    # Summary
    print("\n" + "=" * 60)
    print("GENERATION SUMMARY")
    print("=" * 60)
    
    success_count = sum(1 for v in results.values() if v)
    
    for layout, success in results.items():
        status = "Success" if success else " Failed"
        print(f"  {layout.capitalize():12s} - {status}")
    
    print(f"\n  Total: {success_count}/{len(layouts)} resumes generated successfully")
    
    if success_count == len(layouts):
        print("\nAll resumes generated! Open the HTML files in your browser to see the differences.")
        print("\nGenerated files:")
        for layout in layouts:
            print(f"   - {layout}_resume.html")
    elif success_count > 0:
        print("\nSome resumes were generated. Check the errors above.")
    else:
        print("\n No resumes were generated. Please check if FastAPI server is running.")
        print("   Start server with: python app.py")
    
    print("=" * 60)

if __name__ == "__main__":
    main()