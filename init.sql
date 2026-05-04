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
    user_pokemon_id INTEGER REFERENCES user_pokemon(id_user_pokemon) ON DELETE SET NULL,
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
('brock', '1234', 'brock@email.com', 'rock',  100,  'user'),
('test',  '1234', 'test@email.com',  'grass', 1000, 'admin');


-- ======================
-- 151 POKÉMON ORIGINALES
-- Sprites: PokeAPI official sprites
-- ON CONFLICT DO NOTHING por si ya existen algunos
-- ======================

INSERT INTO pokemon (id_pokemon, name, type, sprite, evolution) VALUES
(1,   'bulbasaur',    'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',   true),
(2,   'ivysaur',      'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',   true),
(3,   'venusaur',     'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',   false),
(4,   'charmander',   'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',   true),
(5,   'charmeleon',   'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png',   true),
(6,   'charizard',    'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',   false),
(7,   'squirtle',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',   true),
(8,   'wartortle',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png',   true),
(9,   'blastoise',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png',   false),
(10,  'caterpie',     'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png',  true),
(11,  'metapod',      'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png',  true),
(12,  'butterfree',   'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png',  false),
(13,  'weedle',       'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png',  true),
(14,  'kakuna',       'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png',  true),
(15,  'beedrill',     'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png',  false),
(16,  'pidgey',       'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png',  true),
(17,  'pidgeotto',    'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png',  true),
(18,  'pidgeot',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png',  false),
(19,  'rattata',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',  true),
(20,  'raticate',     'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png',  false),
(21,  'spearow',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png',  true),
(22,  'fearow',       'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png',  false),
(23,  'ekans',        'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png',  true),
(24,  'arbok',        'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png',  false),
(25,  'pikachu',      'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',  true),
(26,  'raichu',       'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',  false),
(27,  'sandshrew',    'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png',  true),
(28,  'sandslash',    'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png',  false),
(29,  'nidoran-f',    'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png',  true),
(30,  'nidorina',     'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png',  true),
(31,  'nidoqueen',    'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png',  false),
(32,  'nidoran-m',    'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png',  true),
(33,  'nidorino',     'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/33.png',  true),
(34,  'nidoking',     'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png',  false),
(35,  'clefairy',     'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png',  true),
(36,  'clefable',     'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png',  false),
(37,  'vulpix',       'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png',  true),
(38,  'ninetales',    'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png',  false),
(39,  'jigglypuff',   'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',  true),
(40,  'wigglytuff',   'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png',  false),
(41,  'zubat',        'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png',  true),
(42,  'golbat',       'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png',  false),
(43,  'oddish',       'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png',  true),
(44,  'gloom',        'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png',  true),
(45,  'vileplume',    'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png',  false),
(46,  'paras',        'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png',  true),
(47,  'parasect',     'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/47.png',  false),
(48,  'venonat',      'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png',  true),
(49,  'venomoth',     'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png',  false),
(50,  'diglett',      'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png',  true),
(51,  'dugtrio',      'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png',  false),
(52,  'meowth',       'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png',  true),
(53,  'persian',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png',  false),
(54,  'psyduck',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png',  true),
(55,  'golduck',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png',  false),
(56,  'mankey',       'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png',  true),
(57,  'primeape',     'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/57.png',  false),
(58,  'growlithe',    'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png',  true),
(59,  'arcanine',     'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png',  false),
(60,  'poliwag',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png',  true),
(61,  'poliwhirl',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/61.png',  true),
(62,  'poliwrath',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png',  false),
(63,  'abra',         'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png',  true),
(64,  'kadabra',      'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png',  true),
(65,  'alakazam',     'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png',  false),
(66,  'machop',       'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',  true),
(67,  'machoke',      'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png',  true),
(68,  'machamp',      'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png',  false),
(69,  'bellsprout',   'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png',  true),
(70,  'weepinbell',   'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png',  true),
(71,  'victreebel',   'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/71.png',  false),
(72,  'tentacool',    'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png',  true),
(73,  'tentacruel',   'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png',  false),
(74,  'geodude',      'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',  true),
(75,  'graveler',     'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png',  true),
(76,  'golem',        'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png',  false),
(77,  'ponyta',       'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png',  true),
(78,  'rapidash',     'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png',  false),
(79,  'slowpoke',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png',  true),
(80,  'slowbro',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png',  false),
(81,  'magnemite',    'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png',  true),
(82,  'magneton',     'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png',  false),
(83,  'farfetchd',    'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png',  false),
(84,  'doduo',        'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png',  true),
(85,  'dodrio',       'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/85.png',  false),
(86,  'seel',         'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png',  true),
(87,  'dewgong',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png',  false),
(88,  'grimer',       'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png',  true),
(89,  'muk',          'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/89.png',  false),
(90,  'shellder',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png',  true),
(91,  'cloyster',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png',  false),
(92,  'gastly',       'ghost',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png',  true),
(93,  'haunter',      'ghost',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png',  true),
(94,  'gengar',       'ghost',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',  false),
(95,  'onix',         'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',  false),
(96,  'drowzee',      'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png',  true),
(97,  'hypno',        'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/97.png',  false),
(98,  'krabby',       'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png',  true),
(99,  'kingler',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/99.png',  false),
(100, 'voltorb',      'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png', true),
(101, 'electrode',    'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png', false),
(102, 'exeggcute',    'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png', true),
(103, 'exeggutor',    'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png', false),
(104, 'cubone',       'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png', true),
(105, 'marowak',      'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png', false),
(106, 'hitmonlee',    'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png', false),
(107, 'hitmonchan',   'fighting', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png', false),
(108, 'lickitung',    'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png', false),
(109, 'koffing',      'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png', true),
(110, 'weezing',      'poison',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png', false),
(111, 'rhyhorn',      'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png', true),
(112, 'rhydon',       'ground',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png', false),
(113, 'chansey',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png', false),
(114, 'tangela',      'grass',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png', false),
(115, 'kangaskhan',   'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/115.png', false),
(116, 'horsea',       'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png', true),
(117, 'seadra',       'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/117.png', false),
(118, 'goldeen',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png', true),
(119, 'seaking',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png', false),
(120, 'staryu',       'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png', true),
(121, 'starmie',      'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png', false),
(122, 'mr-mime',      'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png', false),
(123, 'scyther',      'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png', false),
(124, 'jynx',         'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png', false),
(125, 'electabuzz',   'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png', false),
(126, 'magmar',       'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png', false),
(127, 'pinsir',       'bug',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png', false),
(128, 'tauros',       'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png', false),
(129, 'magikarp',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png', true),
(130, 'gyarados',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', false),
(131, 'lapras',       'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png', false),
(132, 'ditto',        'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png', false),
(133, 'eevee',        'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', true),
(134, 'vaporeon',     'water',    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png', false),
(135, 'jolteon',      'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png', false),
(136, 'flareon',      'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png', false),
(137, 'porygon',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png', false),
(138, 'omanyte',      'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/138.png', true),
(139, 'omastar',      'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/139.png', false),
(140, 'kabuto',       'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/140.png', true),
(141, 'kabutops',     'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png', false),
(142, 'aerodactyl',   'rock',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png', false),
(143, 'snorlax',      'normal',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png', false),
(144, 'articuno',     'ice',      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png', false),
(145, 'zapdos',       'electric', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png', false),
(146, 'moltres',      'fire',     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png', false),
(147, 'dratini',      'dragon',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png', true),
(148, 'dragonair',    'dragon',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png', true),
(149, 'dragonite',    'dragon',   'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', false),
(150, 'mewtwo',       'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', false),
(151, 'mew',          'psychic',  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', false)

ON CONFLICT (id_pokemon) DO NOTHING;
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
(3, 25, 100, 55, 90), -- id 6 Brock - Pikachu
(3,  4,  90, 60, 65), -- id 7 Brock - Charmander
(3,  7,  95, 50, 43), -- id 8 Brock - Squirtle
(3,  1, 100, 49, 45), -- id 9 Brock - Bulbasaur
(4, 144, 100, 90, 85),  -- Articuno
(4, 145, 100, 95, 100), -- Zapdos
(4, 146, 100, 100, 90), -- Moltres
(4, 150, 120, 120, 110),-- Mewtwo
(4, 151, 100, 100, 100),-- Mew
(4, 25, 100, 55, 90); -- id 1 Ash - Pikachu

-- ======================
-- TEAM
-- ======================
INSERT INTO team (id_user, name) VALUES
(1, 'Equipo Ash'),
(2, 'Equipo Misty'),
(3, 'Equipo Brock');

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
(3, 1, 1), -- Brock - Gorra Pikachu
(3, 2, 1), -- Brock - Fondo volcán
(3, 5, 2), -- Brock - Mejora HP x2
(3, 6, 1); -- Brock - Mejora Attack

-- ======================
-- ORDERS (historial de compras)
-- ======================
INSERT INTO orders (user_id, total, created_at) VALUES
(1, 110.00, '2026-04-10 10:23:00'), -- id 1 Ash
(1,  50.00, '2026-04-18 15:45:00'), -- id 2 Ash
(2,  95.00, '2026-04-12 09:10:00'), -- id 3 Misty
(2, 120.00, '2026-04-25 18:30:00'), -- id 4 Misty
(3, 215.00, '2026-04-05 11:00:00'), -- id 5 Brock
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