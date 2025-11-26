import requests

# Test data
data = {
    "profile": {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "college": "Tech University",
        "department": "Computer Science",
        "year": 2,
        "gpa": 3.9,
        "skills": ["Python", "Machine Learning", "React"],
        "summary": "Aspiring AI engineer passionate about technology"
    },
    "activities": [
        {
            "type": "project",
            "title": "AI Chatbot",
            "date": "2024-03-15",
            "description": "Built an AI chatbot using Python and NLP",
            "tags": ["Python", "NLP", "AI"],
            "status": "approved"
        }
    ],
    "layout": "creative"  # Try: standard, modern, creative
}

# Make request
response = requests.post("http://127.0.0.1:8000/generate_portfolio", json=data)

# Save the HTML response
if response.status_code == 200:
    with open("portfolio.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    print("Portfolio saved as portfolio.html - open it in your browser!")
else:
    print(f"Error: {response.status_code} - {response.text}")