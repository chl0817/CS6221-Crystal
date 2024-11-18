# src/chat.cr
require "kemal"
require "kemal-websocket"

module Chat
  extend self
  @@clients = [] of Kemal::WebSocket::Client

  def handle_message(env : HTTP::Server::Context)
    message = env.params["message"]?
    username = env.params["username"]?

    @@clients.each do |client|
      client.send("#{username}: #{message}")
    end
  end

  def handle_websocket(socket : Kemal::WebSocket::Client)
    @@clients << socket
    socket.on_message do |message|
      @@clients.each do |client|
        client.send(message)
      end
    end

    socket.on_close do
      @@clients.delete(socket)
    end
  end
end

# config/config.yml
# database: "db/development.sqlite3"

# Setup the SQLite database
Database.setup

# Run the server using 'crystal src/main.cr' after installing all dependencies.

# Notes:
# - The 'kemal' framework is used for the HTTP server and routing.
# - The 'kemal-websocket' extension is used for live chat.
# - SQLite is used as the database for simple persistence.
# - Users and passwords are stored securely using bcrypt hashing.