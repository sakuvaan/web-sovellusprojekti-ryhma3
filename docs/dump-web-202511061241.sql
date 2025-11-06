--
-- PostgreSQL database dump
--

\restrict nIbw7z3vX4HkznkDuYVfCrCgrGst04C356dcsAyZ1yjhZjCiNHrUxWZo4pq4HW4

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 18.0

-- Started on 2025-11-06 12:41:35 EET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 16507)
-- Name: favorite_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorite_movies (
    id integer NOT NULL,
    favorite_id integer NOT NULL,
    tmdb_id integer NOT NULL,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.favorite_movies OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16506)
-- Name: favorite_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorite_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorite_movies_id_seq OWNER TO postgres;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 227
-- Name: favorite_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorite_movies_id_seq OWNED BY public.favorite_movies.id;


--
-- TOC entry 226 (class 1259 OID 16490)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16489)
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 225
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- TOC entry 230 (class 1259 OID 16523)
-- Name: group_join_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_join_requests (
    id integer NOT NULL,
    group_id integer,
    user_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT group_join_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.group_join_requests OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16522)
-- Name: group_join_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_join_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_join_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 229
-- Name: group_join_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_join_requests_id_seq OWNED BY public.group_join_requests.id;


--
-- TOC entry 220 (class 1259 OID 16429)
-- Name: group_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_members (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.group_members OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16428)
-- Name: group_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_members_id_seq OWNER TO postgres;

--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 219
-- Name: group_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_members_id_seq OWNED BY public.group_members.id;


--
-- TOC entry 222 (class 1259 OID 16452)
-- Name: group_movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_movies (
    id integer NOT NULL,
    group_id integer NOT NULL,
    tmdb_id integer NOT NULL,
    added_by integer,
    added_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.group_movies OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16451)
-- Name: group_movies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_movies_id_seq OWNER TO postgres;

--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 221
-- Name: group_movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.group_movies_id_seq OWNED BY public.group_movies.id;


--
-- TOC entry 218 (class 1259 OID 16412)
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    owner_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_id_seq OWNER TO postgres;

--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 217
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- TOC entry 224 (class 1259 OID 16472)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    tmdb_id integer NOT NULL,
    user_id integer NOT NULL,
    rating smallint NOT NULL,
    text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16471)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 223
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 216 (class 1259 OID 16400)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16399)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3315 (class 2604 OID 16510)
-- Name: favorite_movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_movies ALTER COLUMN id SET DEFAULT nextval('public.favorite_movies_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 16493)
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- TOC entry 3317 (class 2604 OID 16526)
-- Name: group_join_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_join_requests ALTER COLUMN id SET DEFAULT nextval('public.group_join_requests_id_seq'::regclass);


--
-- TOC entry 3306 (class 2604 OID 16432)
-- Name: group_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members ALTER COLUMN id SET DEFAULT nextval('public.group_members_id_seq'::regclass);


--
-- TOC entry 3309 (class 2604 OID 16455)
-- Name: group_movies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies ALTER COLUMN id SET DEFAULT nextval('public.group_movies_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 16415)
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 16475)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 3302 (class 2604 OID 16403)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3521 (class 0 OID 16507)
-- Dependencies: 228
-- Data for Name: favorite_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorite_movies (id, favorite_id, tmdb_id, added_at) FROM stdin;
\.


--
-- TOC entry 3519 (class 0 OID 16490)
-- Dependencies: 226
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, name, created_at) FROM stdin;
\.


--
-- TOC entry 3523 (class 0 OID 16523)
-- Dependencies: 230
-- Data for Name: group_join_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_join_requests (id, group_id, user_id, status, created_at) FROM stdin;
\.


--
-- TOC entry 3513 (class 0 OID 16429)
-- Dependencies: 220
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_members (id, group_id, user_id, role, joined_at) FROM stdin;
\.


--
-- TOC entry 3515 (class 0 OID 16452)
-- Dependencies: 222
-- Data for Name: group_movies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_movies (id, group_id, tmdb_id, added_by, added_at) FROM stdin;
\.


--
-- TOC entry 3511 (class 0 OID 16412)
-- Dependencies: 218
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, name, owner_id, created_at) FROM stdin;
\.


--
-- TOC entry 3517 (class 0 OID 16472)
-- Dependencies: 224
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, tmdb_id, user_id, rating, text, created_at) FROM stdin;
\.


--
-- TOC entry 3509 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, created_at) FROM stdin;
\.


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 227
-- Name: favorite_movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorite_movies_id_seq', 1, false);


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 225
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 229
-- Name: group_join_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_join_requests_id_seq', 1, false);


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 219
-- Name: group_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_members_id_seq', 1, false);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 221
-- Name: group_movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_movies_id_seq', 1, false);


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 217
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_id_seq', 1, false);


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 223
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 3347 (class 2606 OID 16513)
-- Name: favorite_movies favorite_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_movies
    ADD CONSTRAINT favorite_movies_pkey PRIMARY KEY (id);


--
-- TOC entry 3349 (class 2606 OID 16515)
-- Name: favorite_movies favorite_movies_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_movies
    ADD CONSTRAINT favorite_movies_unique UNIQUE (favorite_id, tmdb_id);


--
-- TOC entry 3343 (class 2606 OID 16498)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 3345 (class 2606 OID 16500)
-- Name: favorites favorites_user_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_name_unique UNIQUE (user_id, name);


--
-- TOC entry 3352 (class 2606 OID 16531)
-- Name: group_join_requests group_join_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3331 (class 2606 OID 16438)
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 16440)
-- Name: group_members group_members_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_unique UNIQUE (group_id, user_id);


--
-- TOC entry 3335 (class 2606 OID 16458)
-- Name: group_movies group_movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_pkey PRIMARY KEY (id);


--
-- TOC entry 3337 (class 2606 OID 16460)
-- Name: group_movies group_movies_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_unique UNIQUE (group_id, tmdb_id);


--
-- TOC entry 3327 (class 2606 OID 16422)
-- Name: groups groups_owner_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_owner_name_unique UNIQUE (owner_id, name);


--
-- TOC entry 3329 (class 2606 OID 16420)
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3339 (class 2606 OID 16483)
-- Name: reviews reviews_one_per_user_movie; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_one_per_user_movie UNIQUE (tmdb_id, user_id);


--
-- TOC entry 3341 (class 2606 OID 16481)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 16543)
-- Name: group_join_requests unique_pending_request; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT unique_pending_request UNIQUE (group_id, user_id);


--
-- TOC entry 3323 (class 2606 OID 16410)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3325 (class 2606 OID 16408)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3350 (class 1259 OID 16521)
-- Name: idx_favorite_movies_tmdb; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_favorite_movies_tmdb ON public.favorite_movies USING btree (tmdb_id);


--
-- TOC entry 3362 (class 2606 OID 16516)
-- Name: favorite_movies favorite_movies_favorite_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorite_movies
    ADD CONSTRAINT favorite_movies_favorite_id_fkey FOREIGN KEY (favorite_id) REFERENCES public.favorites(id) ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 16501)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3363 (class 2606 OID 16532)
-- Name: group_join_requests group_join_requests_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 3364 (class 2606 OID 16537)
-- Name: group_join_requests group_join_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_join_requests
    ADD CONSTRAINT group_join_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3356 (class 2606 OID 16441)
-- Name: group_members group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 3357 (class 2606 OID 16446)
-- Name: group_members group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 16466)
-- Name: group_movies group_movies_added_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_added_by_fkey FOREIGN KEY (added_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3359 (class 2606 OID 16461)
-- Name: group_movies group_movies_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_movies
    ADD CONSTRAINT group_movies_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- TOC entry 3355 (class 2606 OID 16423)
-- Name: groups groups_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3360 (class 2606 OID 16484)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-11-06 12:41:36 EET

--
-- PostgreSQL database dump complete
--

\unrestrict nIbw7z3vX4HkznkDuYVfCrCgrGst04C356dcsAyZ1yjhZjCiNHrUxWZo4pq4HW4

