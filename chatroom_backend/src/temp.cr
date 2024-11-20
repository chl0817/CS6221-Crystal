require "http/server"
require "json"
require "uri"
require "time"
require "file_utils"

videos = [
  { "src" => "http://vjs.zencdn.net/v/oceans.mp4", "thumbnail" => "image/1.jpg", "title" => "Test Video 1", "date" => "2024-11-17 21:09", "views" => 4966 },
  { "src" => "https://static.videezy.com/system/resources/previews/000/043/143/original/lights_go.mp4", "thumbnail" => "image/2.jpg", "title" => "Test Video 2", "date" => "2024-10-27 21:09", "views" => 2266 }
]


# Define the server
server = HTTP::Server.new do |context|
  context.response.headers.add("Access-Control-Allow-Origin", "*")
  context.response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  context.response.headers.add("Access-Control-Allow-Headers", "Content-Type")

  if context.request.method == "OPTIONS"
    context.response.status = HTTP::Status::OK
    context.response.print("")
    next
  end

  if context.request.path == "/api/videos"
    context.response.content_type = "application/json"
    context.response.print(videos.to_json)

  elsif context.request.path == "/api/upload" && context.request.method == "POST"
  puts("NEW UPLOAD")
    if context.request.body.nil?
      context.response.status = HTTP::Status::BAD_REQUEST
      context.response.print("Request body is missing.")
      puts("NO UPLOAD")
    else
      body = context.request.body.not_nil!.gets_to_end
      begin
        puts("PARSING")
        video_data = JSON.parse(body).as_h
  
        # Validate input data
        title = video_data["title"]?.try(&.as_s) || ""
        src = video_data["src"]?.try(&.as_s) || ""
        thumbnail = video_data["thumbnail"]?.try(&.as_s) || "image/placeholder-thumbnail.jpg"


        puts "Video Data: #{video_data.inspect}"
        puts "Title: #{title}, Src: #{src}"
        puts "Title is a String: #{title.is_a?(String)}, Src is a String: #{src.is_a?(String)}"


        if !title.empty? && !src.empty?
          new_video = {
            "src" => src,
            "title" => title,
            "thumbnail" => thumbnail, 
            "date" => Time.local.to_s("%Y-%m-%d %H:%M"),
            "views" => 0
          }
          videos << new_video
          puts("NEW UPLOAD WOO")
          context.response.content_type = "application/json"
          context.response.print({ success: true, message: "Video added successfully." }.to_json)
        else
          context.response.status = HTTP::Status::BAD_REQUEST
          context.response.cont