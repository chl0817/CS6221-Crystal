# src/main.cr
require "kemal"
require "db"
require "sqlite3"
require "yaml"
require "./database"
require "./authentication"
require "./chat"

config = YAML.parse(File.read("config/config.yml"))
DB.open SQLite3::Database, config["database"].as_s

get "/" do
  # Load the main page
  send_file "public/index.html"
end

get "/login" do
  # Load the login page
  send_file "public/login.html"
end

get "/register" do
  # Load the registration page
  send_file "public/register.html"
end

post "/login" do |env|
  Authentication.handle_login(env)
end

post "/register" do |env|
  Authentication.handle_register(env)
end

post "/chat/send" do |env|
  Chat.handle_message(env)
end

websocket "/chat" do |socket|
  Chat.handle_websocket(socket)
end

Kemal.run