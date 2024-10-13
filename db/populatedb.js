#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,            -- Unique ID for each game
    title VARCHAR(255) NOT NULL,           -- Title of the game
    overview TEXT,                         -- Short description
    release_date DATE,                     -- Release date of the game
    price DECIMAL(10, 2) NOT NULL,         -- Price of the game
    rating INT NOT NULL,                   -- From 0 to 5
    image_url TEXT
);

CREATE TABLE genre (
    genre_id SERIAL PRIMARY KEY,           -- Unique ID for each genre
    name VARCHAR(100) NOT NULL UNIQUE,     -- Genre name (e.g., Action, RPG)
    description TEXT,                      -- Optional description of the genre
    image_url TEXT
);

CREATE TABLE game_genre (
    game_id INT NOT NULL,                  -- Foreign key referencing game
    genre_id INT NOT NULL,                 -- Foreign key referencing genre
    PRIMARY KEY (game_id, genre_id),       -- Composite primary key
    FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE,  -- Cascade delete if the game is removed
    FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE CASCADE  -- Cascade delete if the genre is removed
);

INSERT INTO genre (name, description, image_url) VALUES
('Action', 'Fast-paced games with physical challenges.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714206539/7dcaf5a7-c8da-4df1-b56c-402015935844-Action.jpg'),
('Adventure', 'Story-driven games with exploration elements.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714206604/6a7ad902-8c8b-4760-9426-3091f1263800-Adventure.jpg'),
('RPG', 'Role-playing games where you control a character.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714472182/742c09a1-d5c2-4eb2-ad0e-e2c678518a9a-0veewc8x806c1.jpg'),
('Sports', 'Games simulating real-world sports activities.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714472990/cb9e06bd-9586-4900-a20d-9fcf72c870f9-imf6h0igxrk4hnmkcafx.jpg'),
('Strategy', 'Games focused on planning and tactics.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714405478/4489a9b0-5565-485d-a879-473239caa6f5-Strategy.avif'),
('Simulation', 'Games that mimic real-world activities.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714472641/cb58cab3-0765-405d-a2e1-f495f377e9d3-3wEiZ7uALRKZov9DDxtBfM.jpg'),
('Horror', 'Games designed to scare the player.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714471473/2b7e3215-1edf-4902-b992-bb3c20607728-skyrim-4.avif'),
('Puzzle', 'Games that challenge problem-solving skills.', 'https://res.cloudinary.com/dmt9s5xlh/image/upload/v1714472855/843ea89d-26b1-4756-8244-3d6b75f3691e-xavi-cabrera-kn-UmDZQDjM-unsplash.jpg');

INSERT INTO game (title, overview, release_date, price, rating, image_url) VALUES
('The Witcher 3: Wild Hunt', 'An open-world RPG filled with rich storylines and combat.', '2015-05-19', 39.99, 5, 'https://s.yimg.com/fz/api/res/1.2/FpepAu6zJHo2.BqIbUIWfg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTgy/https://s.yimg.com/zb/imgv1/4c654f76-6d2c-30ca-a4d7-ca43994812b3/t_500x300'),
('FIFA 22', 'The latest entry in the famous football game series.', '2021-09-27', 59.99, 4, 'https://s.yimg.com/fz/api/res/1.2/yMFuSFxQTDnKb3idJubM0Q--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTcy/https://s.yimg.com/zb/imgv1/54b7b875-666a-3b14-b637-56c7a67d7b59/t_500x300'),
('Resident Evil Village', 'A survival horror game with terrifying enemies.', '2021-05-07', 49.99, 5, 'https://s.yimg.com/fz/api/res/1.2/Usiy7L6BUN_laucSunFyIg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTcy/https://s.yimg.com/zb/imgv1/d901ff64-101d-3463-ac44-24e4176b315d/t_500x300'),
('The Legend of Zelda: Breath of the Wild', 'An action-adventure game set in a vast open world.', '2017-03-03', 59.99, 5, 'https://s.yimg.com/fz/api/res/1.2/LuHp4x2pQ9VgEVhAnwPkXg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTYw/https://s.yimg.com/zb/imgv1/92c49d6f-029e-3633-8b5d-23b8197c3ddf/t_500x300'),
('Dark Souls III', 'A challenging action RPG with dark and mysterious themes.', '2016-04-12', 49.99, 5, 'https://s.yimg.com/fz/api/res/1.2/z_NaaYdLz8RYqhGJRtcrtg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MjYw/https://s.yimg.com/zb/imgv1/f4ed2d27-e134-303a-b2a8-c3d7bef0feca/t_500x300'),
('Stardew Valley', 'A farming simulation and role-playing game.', '2016-02-26', 14.99, 5, 'https://s.yimg.com/fz/api/res/1.2/pIeeFeklMyPK3smP7Uf3ow--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/b80de31a-6c58-3c12-9ef4-fe93637912d6/t_500x300'),
('Overwatch', 'A team-based multiplayer first-person shooter.', '2016-05-24', 29.99, 4, 'https://s.yimg.com/fz/api/res/1.2/R8GLTVEYles4XmSoEo4TnQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/e280376d-0025-3232-a561-7a56af897079/t_500x300'),
('Portal 2', 'A puzzle game with physics-based gameplay.', '2011-04-19', 19.99, 5, 'https://s.yimg.com/fz/api/res/1.2/oRMrFdIGIIZYITouqYdYzg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTg4/https://s.yimg.com/zb/imgv1/bd388ee8-25f5-3dde-8ef2-6a898eed4017/t_500x300'),
('The Sims 4', 'A simulation game where you create and control people.', '2014-09-02', 39.99, 4, 'https://s.yimg.com/fz/api/res/1.2/DPKUtTzeO9S4k5wR7V_zfg--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTcy/https://s.yimg.com/zb/imgv1/080408c2-6c6a-3a16-9efd-d0c5c0b45fde/t_500x300'),
('Civilization VI', 'A turn-based strategy game where you build an empire.', '2016-10-21', 59.99, 5, 'https://s.yimg.com/fz/api/res/1.2/i6V_bl9HQn0xaDck4uYDsQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTgy/https://s.yimg.com/zb/imgv1/5b01265a-588d-3935-94b7-0f5a93ef7e50/t_500x300'),
('Minecraft', 'A sandbox game that lets you build anything you can imagine.', '2011-11-18', 26.95, 5, 'https://s.yimg.com/fz/api/res/1.2/L0ytgYfWh1njsZ9S4IT23w--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpbGw7aD0yNDA7cT0xMDA7dz0yNDA-/https://s.yimg.com/cv/apiv2/default/20211202/minecraft.jpeg'),
('Outlast', 'A first-person survival horror game set in a psychiatric hospital.', '2013-09-04', 19.99, 4, 'https://s.yimg.com/fz/api/res/1.2/UQe_mxDaJ.gaP2lms7JO7A--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MzMy/https://s.yimg.com/zb/imgv1/9e764d5c-fb7a-3751-b137-394bd811c9fb/t_500x300'),
('Call of Duty: Warzone', 'A free-to-play battle royale shooter.', '2020-03-10', 0.00, 4, 'https://s.yimg.com/fz/api/res/1.2/DQTKXTQvjKnZHamtUjqB.A--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MjE4/https://s.yimg.com/zb/imgv1/b7a06707-a69b-385a-9295-9bc87178a8ba/t_500x300'),
('Rocket League', 'A soccer game played with rocket-powered cars.', '2015-07-07', 19.99, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS32bsACqqDzmVkyRqdgao-Mc6oZIo0R0dytw&s'),
('Bloodborne', 'An action RPG set in a dark gothic world.', '2015-03-24', 49.99, 5, 'https://tse3.mm.bing.net/th?id=OIP.uMmKVJLABDhDLNjAuvDjWQHaKe&pid=Api&P=0&h=220'),
('Hades', 'A rogue-like dungeon crawler game where you defy the god of death.', '2020-09-17', 24.99, 5, 'https://tse4.mm.bing.net/th?id=OIP.8G0WjfFzNdBU0wdEEN_d1wHaKN&pid=Api&P=0&h=220'),
('Assassin’s Creed Valhalla', 'A Viking action RPG set in medieval England.', '2020-11-10', 59.99, 4, 'https://s.yimg.com/fz/api/res/1.2/0puz2CbrskY3qOonWWuMNQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MTk4/https://s.yimg.com/zb/imgv1/046ffa35-bdfe-31e9-bf98-47ed6d33a31f/t_500x300'),
('Tetris Effect', 'A mesmerizing puzzle game based on the classic Tetris.', '2018-11-09', 39.99, 5, 'https://s.yimg.com/fz/api/res/1.2/w.zP24Rxph8Hk5_j7OEp8w--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MjYw/https://s.yimg.com/zb/imgv1/54079c35-821f-3c45-8fc6-b3de0b8f8afb/t_500x300'),
('Dead Space', 'A sci-fi survival horror game set in space.', '2008-10-14', 19.99, 4, 'https://tse4.mm.bing.net/th?id=OIP.Os-9vPx1mWQB2EfpZJRlUgHaJQ&pid=Api&P=0&h=220'),
('Super Mario Odyssey', 'A platformer game where Mario explores new worlds.', '2017-10-27', 59.99, 5, 'https://s.yimg.com/fz/api/res/1.2/7Sxh_bM_Y4wEzrH8XNGlkA--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpdDtoPTI2MDtxPTgwO3c9MjYw/https://s.yimg.com/zb/imgv1/27181709-17ad-3976-871c-f368077ff5c0/t_500x300');


INSERT INTO game_genre (game_id, genre_id) VALUES
(1, 3), (1, 2),        -- The Witcher 3: Wild Hunt (RPG, Adventure)
(2, 4),                -- FIFA 22 (Sports)
(3, 7),                -- Resident Evil Village (Horror)
(4, 1), (4, 2),        -- The Legend of Zelda: Breath of the Wild (Action, Adventure)
(5, 1), (5, 3),        -- Dark Souls III (Action, RPG)
(6, 6),                -- Stardew Valley (Simulation)
(7, 1),                -- Overwatch (Action)
(8, 8),                -- Portal 2 (Puzzle)
(9, 6),                -- The Sims 4 (Simulation)
(10, 5),               -- Civilization VI (Strategy)
(11, 6),               -- Minecraft (Simulation)
(12, 7),               -- Outlast (Horror)
(13, 1),               -- Call of Duty: Warzone (Action)
(14, 4),               -- Rocket League (Sports)
(15, 1), (15, 3),      -- Bloodborne (Action, RPG)
(16, 3), (16, 1),      -- Hades (RPG, Action)
(17, 1), (17, 3),      -- Assassin’s Creed Valhalla (Action, RPG)
(18, 8),               -- Tetris Effect (Puzzle)
(19, 7), (19, 1),      -- Dead Space (Horror, Action)
(20, 1);               -- Super Mario Odyssey (Action)

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.argv[2],
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
