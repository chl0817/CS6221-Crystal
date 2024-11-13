CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE ChatRooms (
    chatroom_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_category VARCHAR(255) NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    chatroom_id INT NOT NULL,
    user_id INT NOT NULL,
    message_text TEXT NOT NULL,
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE In_ChatRoom (
    user_id INT NOT NULL,
    chatroom_id INT NOT NULL,
    PRIMARY KEY (user_id, chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id)
);

CREATE TABLE Moderates (
    user_id INT NOT NULL,
    chatroom_id INT NOT NULL,
    PRIMARY KEY (chatroom_id, user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Banned_From (
    user_id INT NOT NULL,
    chatroom_id INT NOT NULL,
    banned_by INT NOT NULL,
    ban_end TIMESTAMP,
    PRIMARY KEY (user_id, chatroom_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (chatroom_id) REFERENCES ChatRooms(chatroom_id),
    FOREIGN KEY (banned_by) REFERENCES Users(user_id)
);


