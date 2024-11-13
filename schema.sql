CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS ChatRooms (
    chatroom_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    event_category TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatroom_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS In_ChatRoom (
    user_id INTEGER NOT NULL,
    chatroom_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id)
);

CREATE TABLE IF NOT EXISTS Moderates (
    chatroom_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (chatroom_id, user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE IF NOT EXISTS Banned_From (
    user_id INTEGER NOT NULL,
    chatroom_id INTEGER NOT NULL,
    banned_by INTEGER NOT NULL,
    PRIMARY KEY (user_id, chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (banned_by) REFERENCES Users(user_id)
);
