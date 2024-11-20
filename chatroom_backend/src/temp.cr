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

# Function to parse multipart form data (simplified for video uploads)
def parse_multipart(body : String)
  boundary = body.split("\r\n")[0] # The boundary is at the start of the body
  boundary = "--" + boundary

  parts = [] of Hash(String, String)

  body.split(boundary).each do |part|
    next if part.strip.empty?
    if part.includes?("\r\n\r\n")
      headers, content = part.split("\r\n\r\n", 2)
      headers = headers.split("\r\n").map { |header| header.split(": ") }

      content_type = headers.find { |h| h[0] == "Content-Type" }
      content_disposition = headers.find { |h| h[0] == "Content-Disposition" }

      if content_disposition
        # Ensure that content_disposition is correctly formed before accessing it
        if content_disposition[1].includes?("filename")
          # Safely access filename and ensure it's not nil
          filename = content_disposition[1].split('=')[1][1..-2] || "unknown_filename"
          content = content.strip || ""

          # Only add to parts if both filename and content are valid
          if !filename.empty? && !content.empty?
            parts << {"filename" => filename, "content" => content}
          end
        end
      end
    end
  end

  parts
end



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
        context.response.print("Request body is missing.")
        next
    end

  end

  # Set up the server to listen on port 8007
 
end
server.bind_tcp("0.0.0.0", 8007)
puts "Server running on http://localhost:8007"
server.listen
