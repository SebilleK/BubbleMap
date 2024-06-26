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

//? Latitude/Longitude validation
const LatitudeSchema = Type.Number({ minimum: -90, maximum: 90 });
const LongitudeSchema = Type.Number({ minimum: -180, maximum: 180 });

export const typeCheckerGeo = TypeCompiler.Compile(Type.Object({ latitude: LatitudeSchema, longitude: LongitudeSchema }));

//? Review text and rating validation
const ReviewTextSchema = Type.String({ minLength: 10, maxLength: 1000 });
const ReviewRatingSchema = Type.Number({ minimum: 1, maximum: 5 });

export const typeCheckerReview = TypeCompiler.Compile(Type.Object({ rating: ReviewRatingSchema, reviewText: ReviewTextSchema }));

// type ReviewTextSchemaType = Static<typeof ReviewTextSchema>;



