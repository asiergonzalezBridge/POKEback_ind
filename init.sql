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

ALTER TABLE IF EXISTS public.user_pokemon
    ADD FOREIGN KEY (user_id_user)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
    

ALTER TABLE IF EXISTS public.user_pokemon
    ADD FOREIGN KEY (pokemon_id_pokemon)
    REFERENCES public.pokemon (id_pokemon) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.user_store
    ADD FOREIGN KEY (user_id_user)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.user_store
    ADD FOREIGN KEY (store_id_product)
    REFERENCES public.products (id_product) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.team
    ADD FOREIGN KEY (id_user)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.team_pokemon
    ADD FOREIGN KEY (team_id)
    REFERENCES public.team (id_team) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.team_pokemon
    ADD FOREIGN KEY (user_pokemon_id)
    REFERENCES public.user_pokemon (id_user_pokemon) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;



BEGIN;

-- ======================
-- USERS
-- ======================
INSERT INTO users (username, password, email, poketype, coins, rol)
VALUES
('ash', '1234', 'ash@email.com', 'fire', 200, 'user'),
('misty', '1234', 'misty@email.com', 'water', 150, 'user'),
('test', '1234', 'test@email.com', 'grass', 1000, 'admin'),
('Luis', '4321', 'luis@admin.com', 'water', 2000, 'admin');

-- ======================
-- POKEMON
-- ======================
INSERT INTO pokemon (id_pokemon, name, type, sprite, evolution)
VALUES
(25, 'pikachu', 'electric', 'url', false),
(4, 'charmander', 'fire', 'url', true),
(7, 'squirtle', 'water', 'url', true),
(1, 'bulbasaur', 'grass', 'url', true);

-- ======================
-- PRODUCTS (TIENDA)
-- ======================
INSERT INTO products (type, name, description, price, stock, expire_time, image)
VALUES

-- 🎨 COSMÉTICOS
('cosmetic', 'Gorra Pikachu', 'Objeto estético para avatar', 20.00, 50, NULL, 'gorra-pikachu.png'),
('cosmetic', 'Fondo volcán', 'Fondo animado tipo fuego', 35.00, 30, NULL, 'fondo-volcan.png'),

-- 🐱 POKEMON
('pokemon', 'Charmander', 'Pokémon tipo fuego', 100.00, 10, NULL, 'charmander.png'),
('pokemon', 'Squirtle', 'Pokémon tipo agua', 100.00, 10, NULL, 'squirtle.png'),

-- 💊 MEJORAS
('upgrade', 'Mejora HP +20', 'Aumenta vida permanentemente', 50.00, 100, NULL, 'mejora-20-hp.png'),
('upgrade', 'Mejora Attack +10', 'Aumenta ataque permanentemente', 60.00, 100, NULL, 'mejora-10-attack.png'),

-- ⏳ TEMPORALES
('upgrade', 'Boost ataque +30', 'Mejora fuerte limitada', 120.00, 10, '2026-05-01', 'mejora-30-boost-attack.png');

-- ======================
-- USER_POKEMON (colección)
-- ======================
INSERT INTO user_pokemon (user_id_user, pokemon_id_pokemon, current_hp, current_attack, current_speed)
VALUES
(1, 25, 100, 55, 90), -- id 1
(1, 4, 90, 60, 65),   -- id 2
(1, 7, 95, 50, 43),   -- id 3
(2, 7, 100, 50, 43),  -- id 4
(2, 1, 100, 49, 45),  -- id 5
(4, 25, 100, 55, 90), -- id 6
(4, 4,  90,  60, 65), -- id 7
(4, 7,  95,  50, 43), -- id 8
(4, 1,  100, 49, 45); -- id 9

-- ======================
-- TEAM
-- ======================
INSERT INTO team (id_user, name)
VALUES
(1, 'Equipo Ash'),     -- id 1
(2, 'Equipo Misty'),   -- id 2
(4, 'Equipo Luis');    -- id 3

-- ======================
-- TEAM_POKEMON
-- ======================
INSERT INTO team_pokemon (team_id, user_pokemon_id, slot)
VALUES
(1, 1, 1), -- Pikachu
(1, 2, 2), -- Charmander
(1, 3, 3), -- Squirtle

(2, 4, 1), -- Squirtle
(2, 5, 2), -- Bulbasaur

(3, 6, 1), -- Pikachu
(3, 7, 2), -- Charmander
(3, 8, 3), -- Squirtle
(3, 9, 4); -- Bulbasaur

-- ======================
-- USER_STORE (COMPRAS)
-- ======================
INSERT INTO user_store (user_id_user, store_id_product, quantity)
VALUES
(1, 1, 1), -- Ash compra gorra
(1, 5, 1), -- Ash compra mejora HP
(2, 2, 1), -- Misty compra fondo
(2, 6, 2); -- Misty compra mejora ataque x2

COMMIT;