package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

const (
	PORT              = ":5000"
	RAZORPAY_KEY_ID   = "rzp_test_TU6zzd7qlXCLZs"
	RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4"
)

type OrderRequest struct {
	Amount     int    `json:"amount"`
	CourseName string `json:"courseName"`
	StudentID  string `json:"studentId"`
}

func main() {
	mux := http.NewServeMux()

	// Static file serving from root directory
	fs := http.FileServer(http.Dir("../"))

	// Routes
	routes := []string{"/", "/index.html", "/dashboard", "/dashboard.html", 
		"/course-details", "/course-details.html", "/login", "/login.html", 
		"/register", "/register.html", "/programs", "/programs.html", "/admin", "/admin.html"}

	for _, route := range routes {
		if route == "/" || route == "/index.html" {
			mux.HandleFunc(route, func(w http.ResponseWriter, r *http.Request) {
				if r.URL.Path == "/" || r.URL.Path == "/index.html" {
					http.ServeFile(w, r, "../index.html")
					return
				}
				fs.ServeHTTP(w, r)
			})
		} else {
			filePath := ".." + route
			if route[len(route)-5:] != ".html" {
				filePath += ".html"
			}
			mux.HandleFunc(route, func(w http.ResponseWriter, r *http.Request) {
				http.ServeFile(w, r, filePath)
			})
		}
	}

	// API Route
	mux.HandleFunc("/api/payment/create-order", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		
		if r.Method != "POST" {
			http.Error(w, `{"success": false, "message": "Method not allowed"}`, http.StatusMethodNotAllowed)
			return
		}

		var reqData OrderRequest
		if err := json.NewDecoder(r.Body).Decode(&reqData); err != nil {
			http.Error(w, `{"success": false, "message": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		amountPaise := reqData.Amount * 100
		receiptID := fmt.Sprintf("rcpt_%s_%d", reqData.StudentID, time.Now().UnixNano()/int64(time.Millisecond))

		razorpayPayload := map[string]interface{}{
			"amount":   amountPaise,
			"currency": "INR",
			"receipt":  receiptID,
		}

		payloadBytes, _ := json.Marshal(razorpayPayload)

		req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(payloadBytes))
		if err != nil {
			http.Error(w, `{"success": false, "message": "Failed to create request"}`, http.StatusInternalServerError)
			return
		}

		req.SetBasicAuth(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, `{"success": false, "message": "Failed to contact Razorpay"}`, http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		respBody, _ := ioutil.ReadAll(resp.Body)

		var orderResp map[string]interface{}
		json.Unmarshal(respBody, &orderResp)

		responseMap := map[string]interface{}{
			"success": true,
			"order":   orderResp,
		}

		json.NewEncoder(w).Encode(responseMap)
	})

	log.Printf("[SYS] BeatsVibe Go Server active on port %s", PORT)
	log.Printf("[SYS] Access the platform at: http://localhost%s", PORT)
	log.Fatal(http.ListenAndServe(PORT, mux))
}
