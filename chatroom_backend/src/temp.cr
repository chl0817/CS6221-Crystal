# video_server.cr (Crystal backend)

require "http/server"
require "json"

# Define the server
server = HTTP::Server.new do |context|
  # CORS headers: Allow any origin, and specific methods
  context.response.headers.add("Access-Control-Allow-Origin", "*")  # Allow all origins, change to specific origins if needed
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
    videos = [
      { "src" => "http://vjs.zencdn.net/v/oceans.mp4", "thumbnail" => "image/1.jpg", "title" => "Test Video 1", "date" => "2024-11-17 21:09", "views" => 4966 },
      { "src" => "https://media.w3.org/2010/05/sintel/trailer.mp4", "thumbnail" => "image/2.jpg", "title" => "Test Video 2", "date" => "2024-10-27 21:09", "views" => 2266 }
    ]
    
    context.response.content_type = "application/json"
    context.response.print(videos.to_json)
  else
    context.response.status = HTTP::Status::NOT_FOUND
    context.response.print("Not found")
  end
end

# Set up the server to listen on port 8007
server.bind_tcp("0.0.0.0", 8007)
puts "Server running on http://localhost:8007"
server.listen
