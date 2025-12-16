# web-sovellusprojekti-ryhma3

This is a full-stack web application that allows users to discover movies, write reviews, manage personal favorite lists, and interact with user-created groups. 

The project is built with a **React frontend**, a **Node.js + Express backend**, and a **PostgreSQL database**, and is fully containerized using **Docker**. Movie data is fetched from **TMDB API**.

This project was done as a group project for the following course (OAMK):
- `Web-ohjelmoinnin sovellusprojekti (syksy 2025, TVT24SPO)`

## Group Members

Specific areas that each group member focused on:

- **Kimi Sarkkila** ([@basap](https://github.com/basap)): User management, database, front page
- **Panu Ronkainen** ([@PanuRonkOAMK](https://github.com/PanuRonkOAMK)): Reviews, now airing
- **Saku Simonen** ([@sakuvaan](https://github.com/sakuvaan)): Favorites
- **Joel Remes** ([@remjoe](https://github.com/remjoe)): Search function
- **Eetu Flinkman** ([@t3flee00](https://github.com/t3flee00)): Groups

## Core Features

**Authentication and user management**

- User registration and login
- Secure authentication using HTTP-only cookies
- Password hashing with bcrypt
- Password changing
- Account deletion (removes related data such as reviews, favorites and groups)

**Movies and reviews**

- Browse movies (via TMDB API)
- Write and read reviews written by other users
- User can only leave a single review per movie, but the review can be changed by deleting the old one
- Movies which are currently airing are also listed separately

**Favorites**

- Create and delete favorite lists
- Add and remove movies from favorite lists
- A movie can be added from 'Now Airing' or by searching

**Groups**

- Users can create a group or join another by sending a join request
- Group owners can:
    - Accept or reject join requests
    - Remove members
    - Delete the entire group
    