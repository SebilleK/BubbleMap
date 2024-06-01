// validation schemas @sinclair/typebox (define & compile)
import { Type, type Static } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

//? Password validation
const PasswordSchema = Type.String({ minLength: 8 });
// type PasswordSchemaType = Static<typeof PasswordSchema>;


export const typeCheckerPassword = TypeCompiler.Compile(PasswordSchema);


//? Email validation 
const EmailSchema = Type.String({ format: 'email' });
// type EmailSchemaType = Static<typeof EmailSchema>;


export const typeCheckerEmail = TypeCompiler.Compile(EmailSchema);