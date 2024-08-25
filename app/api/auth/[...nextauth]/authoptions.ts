import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

const authoptions: NextAuthOptions = {
    // session: {
    //     strategy: 'jwt'
    // },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        })
    ],
    secret: NEXTAUTH_SECRET,
    // callbacks: {
    //     async signIn({ account, profile }) {
    //         if (!profile) {
    // throw new Error('No profile')
    //             alert("not authenticated")
    //         }

    //         return true
    //     }
    // }
}

export default authoptions
