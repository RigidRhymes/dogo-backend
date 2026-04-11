
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({path: ".env.local"})

if (!process.env.JWT_SECRET) {
    throw  new Error('JWT_SECRET is not set')
}

const token = jwt.sign(
    {
        id: 'test-user',
        email: 'test@example.com'
    },
    process.env.JWT_SECRET as string,
    {expiresIn: '1h'}
);

console.log('Generated JWT:', token)


