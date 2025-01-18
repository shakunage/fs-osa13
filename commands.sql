-- Unneeded due to Sequelize feature Model.sync() usage
-- CREATE TABLE IF NOT EXISTS blogs (
--     id SERIAL PRIMARY KEY NOT NULL,
--     author text NOT NULL,
--     url text NOT NULL,
--     title text NOT NULL,
--     likes INTEGER DEFAULT 0
-- );

insert into users (name, username, created_at, updated_at) values ('jarmo', 'admin', NOW(), NOW());
insert into blogs (author, url, title, user_id) values ('Steve Jobs', 'apple.com', 'Thoughts on Flash', 1);
insert into blogs (author, url, title, user_id) values ('Edsger Dijkstra', 'en.wikipedia.org/wiki/Considered_harmful', 'Go To Statement Considered Harmful', 1);