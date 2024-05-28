# BubbleMap

## Project Description

A website that displays a map of all bubble tea stores nearby, allowing users to log in/register, review stores they have visited, see others' reviews, and save their favorite shops.

## Info/Disclaimer

This project is in active development and everything described here is subject to change. This presently exists as a personal reference and is not final documentation.

Install dependencies:

```bash
bun i
bun pm trust --all
```

To run:

```bash
bun run dev
# or
bun start
```

This project was created using `bun init` in bun v1.1.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Quickstart Setup with Docker (TEMPORARY)

To start, clone this repo:

```bash
git clone https://github.com/SebilleK/BubbleMap.git
```

and make sure to have a valid .env file. For a better look at its specifications please refer to **src/env/index.ts.**.

1. Docker | Build images and start the containers:

```bash
docker-compose build
docker-compose up
```

2. Alter your .env so that DB_HOST is "127.0.0.1" and NOT "mysql". **Docker will use the latter one, while deploying the database with Prisma uses the first one.** (Temporary fix)

3. Prisma | Open a new CLI and run:

```bash
bunx prisma db push
```

4. Open http://localhost:3003/users

You should now be able to make requests. Try creating a new user! **(see src/requests)**.

---

## Dockerization

With docker compose (build the docker images for the db and the app + start the containers):

```bash
docker-compose build
docker-compose up
```

If any troubles setting up the container arrise, please check **docker-compose.yml** and **make sure your .env is correctly set**. For a better look at its specifications please refer to **src/env/index.ts.**.

Additionally, if you get an error **"port is already allocated"** even though you already **removed all containers** and **restarted** the docker service, try to either map it differently or **disable port binding** in **docker-compose.yml**, as it may fix this issue:

```bash
    ports:
      - 3000
```

**important note on Docker + Bun + Prisma**

- Using Prisma in Docker has known issues if you choose to use Bun. This is especially true in Windows. They appear to be fixed as of this project's used bun release, but if you still have trouble with it there are fixes for this. One of these workarounds is to include NodeJS in the generated Docker images. Even though it defeats the purpose of using Bun as a replacement for NodeJS, it still DOES solve the problem.

- Please check these threads for more information on this issue and fixes:
  https://github.com/prisma/prisma/discussions/22360
  https://github.com/oven-sh/bun/issues/
  https://medium.com/@simmonsfrank/beautiful-elysia-imprismad-in-a-jail-6518dd2af586

- The Dockerfile includes a comment for the mentioned fix. Source: https://github.com/oven-sh/bun/issues/5320#issuecomment-1730927088

## Database

Generate the Prisma Client **(Caution: running this in Docker is not supported by earlier versions of Bun!)**:

```bash
bunx prisma generate
```

For initial database deployment (Please refer to the steps in the **Quickstart section** for this command to work **if you're using Docker**):

```bash
bunx prisma db push
```

### Database Schema

- I used this platform to design the database schema [dbdiagram.io](https://dbdiagram.io/d). You can export your schema to pdf, mysql, etc:..

![Database Schema](images/databaseschema.svg)

### Why MySQL and not other database management system?

- I decided to use a relational database mainly to preserve the relationships needed between users/reviews and reviews/stores (since those are at the core of this project) and as such guarantee less mistakes in their interconnectedness over a NoSQL database like MongoDB, as well as ensuring data integrity.

- Adding to that, I chose MySQL because:

  1. It is free, open source, and the most widely used SQL database;
  2. It can handle considerable scalability and growing complexity and strikes a good balances between features/performance;
  3. The most particular type of data stored are coordinates, and their usage for the implemented functionality in this project is relatively simple, so there is no need for advanced geospacial features (PostgreSQL with PostGIS);

- Note on the data type used to store coordinates https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases

## Features

TBA

## Libraries/Frameworks currently being used

- Elysia
- Prisma
- zod
- dotenv
- jsonwebtoken
- bcrypt
