require 'sinatra'
require 'net/http'
require 'json'
require 'base64'

set :port, 5000
set :public_folder, File.dirname(__FILE__) + '/../'

RAZORPAY_KEY_ID = "rzp_test_TU6zzd7qlXCLZs"
RAZORPAY_KEY_SECRET = "UPYyQwzaQrNEixYnB1xS0yc4"

['/', '/index.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'index.html')
  end
end

['/dashboard', '/dashboard.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'dashboard.html')
  end
end

['/course-details', '/course-details.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'course-details.html')
  end
end

['/login', '/login.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'login.html')
  end
end

['/register', '/register.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'register.html')
  end
end

['/programs', '/programs.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'programs.html')
  end
end

['/admin', '/admin.html'].each do |path|
  get path do
    send_file File.join(settings.public_folder, 'admin.html')
  end
end

post '/api/payment/create-order' do
  content_type :json
  
  begin
    request.body.rewind
    data = JSON.parse(request.body.read)
    
    amount = (data['amount'].to_i || 0) * 100
    student_id = data['studentId'] || 'unknown'
    
    uri = URI('https://api.razorpay.com/v1/orders')
    req = Net::HTTP::Post.new(uri)
    req.basic_auth RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
    req.content_type = 'application/json'
    
    req.body = {
      amount: amount,
      currency: "INR",
      receipt: "rcpt_#{student_id}_#{Time.now.to_i}"
    }.to_json
    
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(req)
    end
    
    order_data = JSON.parse(res.body)
    
    { success: true, order: order_data }.to_json
    
  rescue => e
    status 500
    { success: false, message: "Something went wrong with Razorpay!", error: e.message }.to_json
  end
end
