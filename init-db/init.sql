CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    author_id INT,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (id, username, password, created_at) VALUES
(1, 'johndoe', '$2a$10$7Q79m7G7.ezRkF9Fty2T5eHJ.kHGXEM2Hk8JufEYgZ.PzdSwo9PZq', '2024-08-07 12:34:56'),
(2, 'janedoe', '$2a$10$z5N3JtAHT7QoOZ9FN8D.YuIQE5lHjWibTRz8u2nV0A/EtpeCk3jOW', '2024-08-07 12:45:01'),
(3, 'bobsmith', '$2a$10$KyJ7D/ZG8g6Q7hIOr5psguE/vyAB3Zl9ndqSO9x1cT6S9F3s4LaU6', '2024-08-07 13:01:23');

-- Insert mock data into 'posts' table
INSERT INTO posts (id, title, body, author_id, author, created_at) VALUES
(1, 'First Post', 'This is the body of the first post.', 1, 'John Doe', '2024-08-07 14:00:00'),
(2, 'Second Post', 'This is the body of the second post.', 2, 'Jane Doe', '2024-08-07 15:30:00'),
(3, 'Third Post', 'This is the body of the third post.', 3, 'Bob Smith', '2024-08-07 16:45:00'),
(4, 'Another Post', 'Here\'s some more content in another post.', 1, 'John Doe', '2024-08-07 17:00:00');