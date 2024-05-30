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

## Quickstart

You can either set up the project with or without Docker. Precise instructions for both can be found below.

Getting Docker to containerize everything successfully and running database migrations with Prisma after can be a challenge. If you plan on using it, read the **Setup with Docker** section carefully and if it doesn't work please refer to the **"Dockerization"** section.

## Setup with Docker

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

2. Alter your .env so that DB_HOST is "127.0.0.1" and NOT "mysql". **Docker will use the latter one, while deploying the database with Prisma uses the first one.** (Important, temporary fix)

It's important to do this because the Prisma CLI runs on your host machine, not within docker, and the host machine would not recognize "mysql" as a valid host.

3. Prisma | Open a new CLI and run:

```bash
bunx prisma db push
```

4. Open http://localhost:{API_PORT}/users

You should now be able to make requests. Try creating a new user! **(see src/requests)**.

## Local Setup for Development WITHOUT Docker (EXAMPLE)

1. Database setup

After **cloning the repo** and making sure to have a **valid .env** file, you can use any tools to set up and manage the database.

For ease of use, I recommend using [XAMPP](https://www.apachefriends.org/) to start up MySQL and the VSCode extension [Database Client JDBC](https://marketplace.visualstudio.com/items?itemName=cweijan.dbclient-jdbc) to manage the connection.

Alternatively to this extension, [MySQL Workbench](https://www.mysql.com/products/workbench/) works just fine too.

After making sure you have a valid database setup, proceed.

2. Install all needed dependencies

```bash
bun i
bun pm trust --all # if needed, trust all the dependencies to install them
```

Make sure you trust all of them to finish this process if need be.
Check again your .env file is correct, the host should be: **DB_HOST=127.0.0.1**.

Next we should generate the prisma client and deploy our schema:

```bash
bunx prisma generate # Generate a new prisma client
bunx prisma db push # Deploy our database schema to create the database #!!ALTER this
```

You can see the schema we're pushing to create our "bubblemap" database on **prisma/schema.prisma**
Refresh your VSCode extension if you're using it, so you can see the database was just created.

Then, start up the app in development (with --watch) or normal mode:

```bash
bun dev # server restarts on code changes
# OR
bun start
```

Open http://localhost:{API_PORT}/api/users — there should not be anything there, so try to create a user! Go to **requests/create_user.rest** and send a request. Refresh the page and it should be there.
Open http://localhost:{API_PORT}/swagger to see API documentation.

---

## Dockerization

With docker compose:

```bash
docker-compose build # build the docker images for the db and the app
docker-compose up # start the containers
```

If any troubles setting up the containers arrise, please check **docker-compose.yml** and **make sure your .env is correctly set**. For a better look at its specifications please refer to **src/env/index.ts.**.

Additionally, if you get an error **"port is already allocated"** even though you already **removed all containers** and **restarted** the docker service, make sure that no other apps are using this port. If that doesn't work, try to either map it differently or **disable port binding** in **docker-compose.yml**, as it may fix this issue:

```bash
    ports:
      - 3000
```

Removing the containers on Docker Desktop by deleting them directly can cause issues. Try to stop and remove them always with the following command:

```bash
docker-compose down # stop containers and remove them + their networks and volumes | "graceful"/proper cleanup
```

**Important note on Docker + Bun + Prisma**

- Using Prisma in Docker has known issues if you choose to use Bun. This is especially true in Windows. They appear to be fixed as of this project's used bun release, but if you still have trouble with it there are fixes for this. One of these workarounds is to include NodeJS in the generated Docker images. Even though it defeats the purpose of using Bun as a replacement for NodeJS, it still DOES solve the problem.

- The Dockerfile includes a comment for the mentioned fix. Source: https://github.com/oven-sh/bun/issues/5320#issuecomment-1730927088

- Please check these threads for more information on this issue and fixes:
  https://github.com/prisma/prisma/issues/21241 | Bun: Can't prisma generate on Docker
  https://github.com/oven-sh/bun/issues/5320 | Bun doesn't run prisma generate or prisma migrate inside docker
  https://stackoverflow.com/questions/67746885/prisma-client-did-not-initialize-yet-please-run-prisma-generate-and-try-to-i |@prisma/client did not initialize yet
  https://medium.com/@simmonsfrank/beautiful-elysia-imprismad-in-a-jail-6518dd2af586

## Database

This project uses Prisma for database queries. It uses its own schema definition language to define database relationships, so it's important that is set up adequately first. **(See prisma/schema.prisma)**.

If needed, equivalent MySQL syntax is provided in **src/database/mysql.sql** to create the "bubblemap" database with the intended schema.

Generate the Prisma Client:

```bash
bunx prisma generate
```

**(Caution: running this in Docker is not supported by earlier versions of Bun!)**

For initial database deployment:

```bash
bunx prisma db push
```

(Please refer to the steps in the **Quickstart section** for this command to work **if you're using Docker**)

### Database Schema

- I used this platform to design the database schema [dbdiagram.io](https://dbdiagram.io/d). You can export your schema to pdf, mysql, etc:..

![Database Schema](images/databaseschema.svg)

### Why MySQL and not other database management system?

- I decided to use a relational database mainly to preserve the relationships needed between users/reviews and reviews/stores (since those are at the core of this project) and as such guarantee less mistakes in their interconnectedness over a NoSQL database like MongoDB, as well as ensuring data integrity.

- Adding to that, I chose MySQL because:

  1. It is free, open source, and the most widely used SQL database;
  2. It can handle considerable scalability and growing complexity and strikes a good balances between features/performance;
  3. The most particular type of data stored are coordinates, and their usage for the implemented functionality in this project is relatively simple, so there is no need for advanced geospacial features (PostgreSQL with PostGIS);

- **Note on the data type used to store coordinates**
  https://stackoverflow.com/questions/1196415/what-datatype-to-use-when-storing-latitude-and-longitude-data-in-sql-databases

## ElysiaJS

This project uses ElysiaJS. It's a web framework similar to Express but focused on performance, that takes advantage of Bun (and is very commonly used with it). Read more about it on [ElysiaJS' website](https://elysiajs.com/) or in this [blog post](https://dev.to/oggy107/elysia-a-bun-first-web-framework-1kf3).

Elysia Docs
https://elysiajs.com/integrations/cheat-sheet.html
https://elysiajs.com/essential/context
https://elysiajs.com/essential/life-cycle.html

For a good example on how to build a simple REST API with Bun, Elysia and Prisma, check here:
https://blog.thecodebrew.tech/create-bun-rest-api-with-elysia-and-prisma/
I based my **src/routes** organization on it.

### API docs

The Elysia Swagger plugin is used to generate a Swagger page of documentation for this API.
When running, check http://localhost:{API_PORT}/swagger

## Features

TBA

## Libraries/Frameworks currently being used

- Elysia
- Prisma
- zod
- dotenv
- bcrypt
