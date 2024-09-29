import { PrismaClient } from '@prisma/client';
import prisma from '../connection/connection'

interface identity  {
    id: string
    name: string
    email: string
    phone_number: string
    image: string

    phoneNumberFromString: (val: string) => string;
}

async function createIdentity() {
    const newIdentity = await prisma.identity.create({
        data: {
            email: 'user@example.com',
            name: 'John Doe',
            image: 'https://example.com/image.jpg',  // Optional, can be null
            phone_number: '123-456-7890',            // Optional, can be null
            address: '123 Main St, Springfield',
            created_at: new Date(),
        },
    });

    console.log('new identity created:', newIdentity);
}

// Call the function
createIdentity().catch((e) => console.error(e)).finally(async () => {
    await prisma.$disconnect();
});
