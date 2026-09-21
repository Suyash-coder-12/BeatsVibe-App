import os
import requests
import base64
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='../', static_url_path='')
CORS(app)

PORT = 5000
RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs"
RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4"

@app.route('/')
@app.route('/index.html')
def index():
    return send_from_directory('../', 'index.html')

@app.route('/dashboard')
@app.route('/dashboard.html')
def dashboard():
    return send_from_directory('../', 'dashboard.html')

@app.route('/course-details')
@app.route('/course-details.html')
def course_details():
    return send_from_directory('../', 'course-details.html')

@app.route('/login')
@app.route('/login.html')
def login():
    return send_from_directory('../', 'login.html')

@app.route('/register')
@app.route('/register.html')
def register():
    return send_from_directory('../', 'register.html')

@app.route('/programs')
@app.route('/programs.html')
def programs():
    return send_from_directory('../', 'programs.html')

@app.route('/admin')
@app.route('/admin.html')
def admin():
    return send_from_directory('../', 'admin.html')

@app.route('/api/payment/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = int(data.get('amount', 0)) * 100
        student_id = data.get('studentId', 'unknown')
        
        # Razorpay API Call
        url = "https://api.razorpay.com/v1/orders"
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
        
        response = requests.post(url, json=payload, headers=headers)
        order_data = response.json()
        
        return jsonify({"success": True, "order": order_data})
        
    except Exception as e:
        print("Order Creation Error:", str(e))
        return jsonify({"success": False, "message": "Something went wrong with Razorpay!"}), 500

if __name__ == '__main__':
    print(f"[SYS] BeatsVibe Server active on port {PORT}")
    app.run(port=PORT)
