import {FunctionTool, OpenAIAgent} from "llamaindex";

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
        description: "Use this function to draft a message in Slack. Prompt confirmation from " +
            "user to trigger the confirm and send step",
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
    ({ confirmation, message }: { confirmation: string; message: string; }) => {
        console.log("Confirmed: " + confirmation);
        console.log("Slack Message: " + message);
        return message;
    },
    {
        name: "confirmAndSendSlackMessage",
        description: "Use this function to send a message in Slack after a draft has been created. Do" +
            "not use this function if an affirmative confirmation is given.",
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