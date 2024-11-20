require "http/server"
require "json"
require "uri"
require "time"
require "file_utils"

# Define a simple videos array
videos = [
  { "src" => "http://vjs.zencdn.net/v/oceans.mp4", "thumbnail" => "image/1.jpg", "title" => "Test Video 1", "date" => "2024-11-17 21:09", "views" => 4966 },
  { "src" => "https://media.w3.org/2010/05/sintel/trailer.mp4", "thumbnail" => "image/2.jpg", "title" => "Test Video 2", "date" => "2024-10-27 21:09", "views" => 2266 }
]


# Define the server
server = HTTP::Server.new do |context|
  # CORS headers: Allow any origin, and specific methods
  context.response.headers.add("Access-Control-Allow-Origin", "*")
  context.response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  context.response.headers.add("Access-Control-Allow-Headers", "Content-Type")

  # Handle OPTIONS preflight request for CORS
  if context.request.method == "OPTIONS"
    context.response.status = HTTP::Status::OK
    context.response.print("")
    next
  end

  # Respond with video data on /api/videos endpoint
  if context.request.path == "/api/videos"
    context.response.content_type = "application/json"
    context.response.print(videos.to_json)
  
  # Handle file uploads on /api/upload endpoint
  # Handle file uploads on /api/upload endpoint
  elsif context.request.path == "/api/upload"
    if context.request.body.nil?
        context.response.status = HTTP::Status::BAD_REQUEST
        context.response.print("Request