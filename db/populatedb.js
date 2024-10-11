#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE game (
    game_id SERIAL PRIMARY KEY,            -- Unique ID for each game
    title VARCHAR(255) NOT NULL,           -- Title of the game
    release_date DATE,                     -- Release date of the game
    price DECIMAL(10, 2) NOT NULL,         -- Price of the game
    stock_quantity INT DEFAULT 0,          -- Stock available for the game
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Last update timestamp
);

CREATE TABLE genre (
    genre_id SERIAL PRIMARY KEY,           -- Unique ID for each genre
    name VARCHAR(100) NOT NULL UNIQUE,     -- Genre name (e.g., Action, RPG)
    description TEXT,                      -- Optional description of the genre
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Last update timestamp
);

CREATE TABLE game_genre (
    game_id INT NOT NULL,                  -- Foreign key referencing game
    genre_id INT NOT NULL,                 -- Foreign key referencing genre
    PRIMARY KEY (game_id, genre_id),       -- Composite primary key
    FOREIGN KEY (game_id) REFERENCES game (game_id) ON DELETE CASCADE,  -- Cascade delete if the game is removed
    FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE CASCADE  -- Cascade delete if the genre is removed
);

ALTER TABLE game ADD CONSTRAINT unique_title_release UNIQUE (title, release_date);

CREATE INDEX idx_game_id ON game_genre (game_id);
CREATE INDEX idx_genre_id ON game_genre (genre_id);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://yassin:hamza@localhost:5432/inventory",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
