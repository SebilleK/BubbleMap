import Elysia from 'elysia';
//! import routes here

const app = new Elysia().get('/', () => '✨ Hello Elysia! Server is up and running ✨');

export { app };
