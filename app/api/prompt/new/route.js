import {connectToDB} from "@utilityFun/database";
import Prompt from "@models/prompt";
export const POST = async (req) => {
    const {userId, prompt, tag} = await req.json();
    try {
        await connectToDB(); // Lambda function meaning it is going to die once does its job
        // everyTime that it gets called it needs to connect to DB do its thing and then go in peace
        const newPrompt = new Prompt({
            creator: userId,
            prompt,
            tag
        });
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), {status: 201});
        // Return response and status  which mean created
    } catch (error) {
        return new Response("Failed To Create a new Prompt", {status: 500});
        // mean Server error 
    }
};