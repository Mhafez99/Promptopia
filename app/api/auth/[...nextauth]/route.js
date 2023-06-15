import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import {connectToDB} from "@utilityFun/database";
import User from "@models/user";
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        // get data about the user every single time to keep an existing and running session
        async session({session}) {
            const sessionUser = await User.findOne({
                email: session.user.email
            });
            session.user.id = sessionUser._id.toString();
            return session;
        },
        async signIn({profile}) {
            try {
                // Serverless -> lambda func -> dynamicdb
                // => Open up only when it gets called 
                // Make Connection to db as needed
                // => we dont have to keep our server running constanly 
                await connectToDB();
                //  2 Check
                // check if a user already exists
                const userExists = await User.findOne({
                    email: profile.email
                });

                // if not, create a new user 
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture
                    });
                }
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
    }
});

export {handler as GET, handler as POST};