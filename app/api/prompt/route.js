import {connectToDB} from "@utilityFun/database";
import Prompt from "@models/prompt";
export const GET = async (req) => {
    try {
        await connectToDB();
        const prompts = await Prompt.find({}).populate('creator');
        return new Response(JSON.stringify(prompts), {status: 200});
    } catch (error) {
        return new Response('Failed To Fetch all Prompts', {status: 500});
    }
};
