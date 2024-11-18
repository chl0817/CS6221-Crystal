# src/database.cr
require "db"

module Database
  extend self

  def setup
    DB.execute <<-SQL
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      );
    SQL
  end

  def find_user(username : String)
    DB.query_one("SELECT * FROM users WHERE username = ?", username)
  end

  def create_user(username : String, password : String)
    DB.exec("INSERT INTO users (username, password) VALUES (?, ?)", username, password)
  end
end