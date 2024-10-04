import {FunctionTool, OpenAIAgent} from "llamaindex";
import {sendSlack, signJwt} from "@/app/utility/request-utilities";

export async function createAgent(): Promise<OpenAIAgent>{
    return new OpenAIAgent({
        tools: [draftSlackMessage, confirmAndSendSlackMessage, createSalesforceContact]
    });
}


export const draftSlackMessage = FunctionTool.from(
    ({ message}: { message: string; }) => {
        console.log("draft slack message: " + message);
        return "Message: " + message;
    },
    {
        name: "draftSlackMessage",
        description: "Use this function to draft a message in Slack. This is a required function step" +
            "before sending the message in Slack. Prompt confirmation from " +
            "user to trigger the confirm and send step. This function does not send the message in" +
            "Slack. This function only drafts a message and prompts for confirmation",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "The draft message",
                },
            },
            required: ["message"],
        },
    }
);


export const confirmAndSendSlackMessage = FunctionTool.from(
    async({ confirmation, message }: { confirmation: string; message: string; }) => {
        console.log("Confirmed: " + confirmation);
        console.log("Slack Message: " + message);

        //TODO: remove hard coded username!!!
        const response = await sendSlack(message, signJwt("jack.mu@useparagon.com"));
        if(response.statusCode){
            return "Successfully Sent";
        }
        return "Message not sent successfully";
    },
    {
        name: "confirmAndSendSlackMessage",
        description: "Use this function to send a message in Slack only after a draft has been created. Do" +
            "not use this function if an affirmative confirmation is not given. Do not use this function if" +
            "a draft has not been created",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "The draft message",
                },
                confirmation: {
                    type: "string",
                    description: "The draft message",
                },
            },
            required: ["confirmation", "message"],
        },
    }
);

// TODO: implement with pinecone store
// new QueryEngineTool({
//   queryEngine:
// })

export const createSalesforceContact = FunctionTool.from(
    ({ name, role }: { name: string, role: string}) => {
        console.log("Salesforce name: " + name);
        console.log("Salesforce role: " + role);
        return [name, role];
    },
    {
        name: "createSalesforceContact",
        description: "Use this function to create a contact in salesforce given their name and role",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name of Salesforce contact",
                },
                role: {
                    type: "string",
                    description: "role of Salesforce contact",
                },
            },
            required: ["name", "role"],
        },
    }
);