# BubbleMap

## Project Description

A website that displays a map of all bubble tea stores nearby, allowing users to log in/register, review stores they have visited, see others' reviews, and save their favorite shops.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Info/Disclaimer

This project is in active development and everything here is subject to change.

## Database

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
