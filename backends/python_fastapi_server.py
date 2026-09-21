from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import time
import base64
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PORT = 5000
RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs"
RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4"

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mount static files (will be handled after specific routes)
app.mount("/static", StaticFiles(directory=ROOT_DIR), name="static")

def serve_html(filename):
    return FileResponse(os.path.join(ROOT_DIR, filename))

@app.get("/")
@app.get("/index.html")
async def read_index():
    return serve_html("index.html")

@app.get("/dashboard")
@app.get("/dashboard.html")
async def read_dashboard():
    return serve_html("dashboard.html")

@app.get("/course-details")
@app.get("/course-details.html")
async def read_course_details():
    return serve_html("course-details.html")

@app.get("/login")
@app.get("/login.html")
async def read_login():
    return serve_html("login.html")

@app.get("/register")
@app.get("/register.html")
async def read_register():
    return serve_html("register.html")

@app.get("/programs")
@app.get("/programs.html")
async def read_programs():
    return serve_html("programs.html")

@app.get("/admin")
@app.get("/admin.html")
async def read_admin():
    return serve_html("admin.html")

@app.post("/api/payment/create-order")
async def create_order(request: Request):
    try:
        data = await request.json()
        amount = int(data.get('amount', 0)) * 100
        student_id = data.get('studentId', 'unknown')
        
        auth_string = f"{RAZORPAY_KEY_ID}:{RAZORPAY_KEY_SECRET}"
        encoded_auth = base64.b64encode(auth_string.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_auth}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "amount": amount,
            "currency": "INR",
            "receipt": f"rcpt_{student_id}_{int(time.time())}"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post("https://api.razorpay.com/v1/orders", json=payload, headers=headers)
            order_data = response.json()
            
        return {"success": True, "order": order_data}
        
    except Exception as e:
        print("Order Creation Error:", str(e))
        raise HTTPException(status_code=500, detail="Something went wrong with Razorpay!")

# Note: Run with `uvicorn python_fastapi_server:app --port 5000`
