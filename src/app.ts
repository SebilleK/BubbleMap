import Elysia from 'elysia';

//! import routes
import { userController } from './routes/users';

const app = new Elysia();

//? register routes
userController(app);


export { app };
