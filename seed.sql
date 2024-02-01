CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  clerk_user_id VARCHAR(255),
  username VARCHAR (255)
)

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  post_content VARCHAR(255),
  user_id INTEGER REFERENCES profiles(id)  
)

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  comment_content VARCHAR(255),
  posts_id INTEGER REFERENCES posts(id)
)

CREATE TABLE IF NOT EXISTS posts_likes (
  profile_id INTEGER REFERENCES profiles(id),
  post_id INTEGER REFERENCES posts(id) 
)

  CREATE TABLE IF NOT EXISTS comment_likes (
  profile_id INTEGER REFERENCES profiles(id),
  comment_id INTEGER REFERENCES comments(id)
  
)