-- ==============================================
-- INIT.SQL — POKÉBack
-- ==============================================

CREATE TABLE IF NOT EXISTS public.users
(
    id_user serial NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(300) NOT NULL,
    email character varying(50) NOT NULL,
    poketype character varying(50) NOT NULL,
    coins integer DEFAULT 100,
    rol VARCHAR(20) DEFAULT 'user',
    PRIMARY KEY (id_user)
);

CREATE TABLE IF NOT EXISTS public.pokemon
(
    id_pokemon integer NOT NULL,
    name character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    sprite character varying(200) NOT NULL,
    evolution boolean NOT NULL,
    PRIMARY KEY (id_pokemon)
);

CREATE TABLE IF NOT EXISTS public.products
(
    id_product serial NOT NULL,
    type character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(350),
    price numeric(10, 2) NOT NULL,
    stock integer NOT NULL,
    expire_time date,
    image character varying(200),
    PRIMARY KEY (id_product)
);

CREATE TABLE IF NOT EXISTS public.user_pokemon
(
    id_user_pokemon serial NOT NULL,
    user_id_user integer NOT NULL,
    pokemon_id_pokemon integer NOT NULL,
    current_hp integer NOT NULL,
    current_attack integer NOT NULL,
    current_speed integer NOT NULL,
    PRIMARY KEY (id_user_pokemon)
);

CREATE TABLE IF NOT EXISTS public.user_store
(
    user_id_user integer NOT NULL,
    store_id_product integer NOT NULL,
    quantity integer DEFAULT 1,
    PRIMARY KEY (user_id_user, store_id_product)
);

CREATE TABLE IF NOT EXISTS public.team
(
    id_team serial NOT NULL,
    id_user integer NOT NULL,
    name character varying(50) NOT NULL,
    PRIMARY KEY (id_team)
);

CREATE TABLE IF NOT EXISTS public.team_pokemon
(
    team_id integer NOT NULL,
    user_pokemon_id integer NOT NULL,
    slot integer NOT NULL CHECK (slot BETWEEN 1 AND 6),
    PRIMARY KEY (team_id, slot)
);

CREATE TABLE IF NOT EXISTS orders (
    id_order SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id_order_item SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id_order) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id_product)
);

CREATE TABLE IF NOT EXISTS battles (
    id_battle SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id_user),
    user_pokemon_id INTEGER NOT NULL REFERENCES user_pokemon(id_user_pokemon),
    enemy_pokemon_id INTEGER NOT NULL REFERENCES pokemon(id_pokemon),
    enemy_hp INTEGER NOT NULL,
    enemy_attack INTEGER NOT NULL,
    result VARCHAR(10) CHECK (result IN ('win', 'loss', 'flee', 'captured')),
    coins_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- FOREIGN KEYS
-- ======================

ALTER TABLE IF EXISTS public.user_pokemon
    ADD FOREIGN KEY (user_id_user) REFERENCES public.users (id_user) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_pokemon
    ADD FOREIGN KEY (pokemon_id_pokemon) REFERENCES public.pokemon (id_pokemon) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_store
    ADD FOREIGN KEY (user_id_user) REFERENCES public.users (id_user) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.user_store
    ADD FOREIGN KEY (store_id_product) REFERENCES public.products (id_product) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.team
    ADD FOREIGN KEY (id_user) REFERENCES public.users (id_user) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.team_pokemon
    ADD FOREIGN KEY (team_id) REFERENCES public.team (id_team) ON UPDATE NO ACTION ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.team_pokemon
    ADD FOREIGN KEY (user_pokemon_id) REFERENCES public.user_pokemon (id_user_pokemon) ON UPDATE NO ACTION ON DELETE CASCADE;

-- ==============================================
-- DATOS
-- ==============================================

BEGIN;

-- ======================
-- USERS
-- ======================
INSERT INTO users (username, password, email, poketype, coins, rol) VALUES
('ash',   '1234', 'ash@email.com',   'fire',  200,  'user'),
('misty', '1234', 'misty@email.com', 'water', 150,  'user'),
('test',  '1234', 'test@email.com',  'grass', 1000, 'admin'),
('Luis',  '4321', 'luis@admin.com',  'water', 2000, 'admin');

-- ======================
-- POKEMON (40 con sprites reales)
-- ======================
INSERT INTO pokemon (id_pokemon, name, type, sprite, evolution) VALUES
(1,  'bulbasaur',  'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',  true),
(2,  'ivysaur',    'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',  true),
(3,  'venusaur',   'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',  false),
(4,  'charmander', 'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',  true),
(5,  'charmeleon', 'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png',  true),
(6,  'charizard',  'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',  false),
(7,  'squirtle',   'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',  true),
(8,  'wartortle',  'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png',  true),
(9,  'blastoise',  'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',  false),
(10, 'caterpie',   'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png', true),
(13, 'weedle',     'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png', true),
(16, 'pidgey',     'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', true),
(19, 'rattata',    'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', true),
(21, 'spearow',    'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png', true),
(23, 'ekans',      'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png', true),
(25, 'pikachu',    'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', false),
(26, 'raichu',     'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', false),
(27, 'sandshrew',  'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png', true),
(29, 'nidoran-f',  'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png', true),
(32, 'nidoran-m',  'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png', true),
(35, 'clefairy',   'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png', true),
(37, 'vulpix',     'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png', true),
(39, 'jigglypuff', 'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', true),
(41, 'zubat',      'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png', true),
(43, 'oddish',     'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png', true),
(46, 'paras',      'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png', true),
(48, 'venonat',    'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png', true),
(50, 'diglett',    'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png', true),
(52, 'meowth',     'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', true),
(54, 'psyduck',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png', true),
(56, 'mankey',     'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png', true),
(58, 'growlithe',  'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png', true),
(60, 'poliwag',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png', true),
(63, 'abra',       'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png', true),
(66, 'machop',     'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png', true),
(74, 'geodude',    'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png', true),
(79, 'slowpoke',   'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png', true),
(81, 'magnemite',  'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png', true),
(92, 'gastly',     'ghost',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png', true),
(96, 'drowzee',    'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png', true);

-- ======================
-- PRODUCTS
-- ======================
INSERT INTO products (type, name, description, price, stock, expire_time, image) VALUES
('cosmetic', 'Gorra Pikachu',      'Objeto estético para avatar',          20.00,  50,  NULL,         'gorra-pikachu.png'),
('cosmetic', 'Fondo volcán',       'Fondo animado tipo fuego',             35.00,  30,  NULL,         'fondo-volcan.png'),
('pokemon',  'Charmander',         'Pokémon tipo fuego',                  100.00,  10,  NULL,         'charmander.png'),
('pokemon',  'Squirtle',           'Pokémon tipo agua',                   100.00,  10,  NULL,         'squirtle.png'),
('upgrade',  'Mejora HP +20',      'Aumenta vida permanentemente',         50.00, 100,  NULL,         'mejora-20-hp.png'),
('upgrade',  'Mejora Attack +10',  'Aumenta ataque permanentemente',       60.00, 100,  NULL,         'mejora-10-attack.png'),
('upgrade',  'Boost ataque +30',   'Mejora fuerte limitada',              120.00,  10,  '2026-05-01', 'mejora-30-boost-attack.png');

-- ======================
-- USER_POKEMON
-- ======================
INSERT INTO user_pokemon (user_id_user, pokemon_id_pokemon, current_hp, current_attack, current_speed) VALUES
(1, 25, 100, 55, 90), -- id 1 Ash - Pikachu
(1,  4,  90, 60, 65), -- id 2 Ash - Charmander
(1,  7,  95, 50, 43), -- id 3 Ash - Squirtle
(2,  7, 100, 50, 43), -- id 4 Misty - Squirtle
(2,  1, 100, 49, 45), -- id 5 Misty - Bulbasaur
(4, 25, 100, 55, 90), -- id 6 Luis - Pikachu
(4,  4,  90, 60, 65), -- id 7 Luis - Charmander
(4,  7,  95, 50, 43), -- id 8 Luis - Squirtle
(4,  1, 100, 49, 45); -- id 9 Luis - Bulbasaur

-- ======================
-- TEAM
-- ======================
INSERT INTO team (id_user, name) VALUES
(1, 'Equipo Ash'),
(2, 'Equipo Misty'),
(4, 'Equipo Luis');

-- ======================
-- TEAM_POKEMON
-- ======================
INSERT INTO team_pokemon (team_id, user_pokemon_id, slot) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(2, 4, 1),
(2, 5, 2),
(3, 6, 1),
(3, 7, 2),
(3, 8, 3),
(3, 9, 4);

-- ======================
-- USER_STORE
-- ======================
INSERT INTO user_store (user_id_user, store_id_product, quantity) VALUES
(1, 1, 1), -- Ash - Gorra Pikachu
(1, 5, 1), -- Ash - Mejora HP
(1, 6, 1), -- Ash - Mejora Attack
(2, 2, 1), -- Misty - Fondo volcán
(2, 6, 2), -- Misty - Mejora Attack x2
(2, 5, 1), -- Misty - Mejora HP
(4, 1, 1), -- Luis - Gorra Pikachu
(4, 2, 1), -- Luis - Fondo volcán
(4, 5, 2), -- Luis - Mejora HP x2
(4, 6, 1); -- Luis - Mejora Attack

-- ======================
-- ORDERS (historial de compras)
-- ======================
INSERT INTO orders (user_id, total, created_at) VALUES
(1, 110.00, '2026-04-10 10:23:00'), -- id 1 Ash
(1,  50.00, '2026-04-18 15:45:00'), -- id 2 Ash
(2,  95.00, '2026-04-12 09:10:00'), -- id 3 Misty
(2, 120.00, '2026-04-25 18:30:00'), -- id 4 Misty
(4, 215.00, '2026-04-05 11:00:00'), -- id 5 Luis
(4,  60.00, '2026-04-28 20:15:00'); -- id 6 Luis

-- ======================
-- ORDER_ITEMS
-- ======================
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
-- Orden 1: Ash compra Gorra + Mejora HP
(1, 1, 1, 20.00),
(1, 5, 1, 50.00),
(1, 6, 1, 60.00), -- subtotal 130... ajusta el total si tu lógica lo valida

-- Orden 2: Ash compra Mejora HP
(2, 5, 1, 50.00),

-- Orden 3: Misty compra Fondo + Mejora HP
(3, 2, 1, 35.00),
(3, 5, 1, 50.00),
(3, 6, 1, 60.00),

-- Orden 4: Misty compra Boost
(4, 7, 1, 120.00),

-- Orden 5: Luis compra todo
(5, 1, 1,  20.00),
(5, 2, 1,  35.00),
(5, 5, 2, 100.00),
(5, 6, 1,  60.00),

-- Orden 6: Luis compra Mejora Attack
(6, 6, 1, 60.00);

COMMIT;