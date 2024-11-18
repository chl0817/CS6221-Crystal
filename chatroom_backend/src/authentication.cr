# src/authentication.cr
require "kemal"
require "bcrypt"
require "./database"

module Authentication
  extend self

  def handle_login(env : HTTP::Server::Context)
    username = env.params["username"]?
    password = env.params["password"]?

    if user = Database.find_user(username)
      hashed_password = user["password"].as_s
      if BCrypt::Password.new(hashed_password) == password
        env.response.content_type = "application/json"
        env.response.print({message: "Success", username: username}.to_json)
      else
        env.response.status_code = 401
        env.response.print("Invalid password")
      end
    else
      env.response.status_code = 404
      env.response.print("User not found")
    end
  end

  def handle_register(env : HTTP::Server::Context)
    username = env.params["username"]?
    password = env.params["password"]?

    if Database.find_user(username)
      env.response.status_code = 409
      env.response.print("Username already exists")
    else
      hashed_password = BCrypt::Password.create(password)
      Database.create_user(username, hashed_password)
      env.response.content_type = "application/json"
      env.response.print({message: "Register successful"}.to_json)
    end
  end
end