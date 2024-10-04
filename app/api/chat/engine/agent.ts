import {FunctionTool, OpenAIAgent} from "llamaindex";

export async function createAgent(): Promise<OpenAIAgent>{
    return new OpenAIAgent({
        tools: [sendSlackMessage, createSalesforceContact]
    });
}


export const sendSlackMessage = FunctionTool.from(
    ({ message}: { message: string; }) => {
        console.log("sending slack message: " + message);
        return message;
    },
    {
        name: "sendSlackMessage",
        description: "Use this function to send a message in Slack",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "The message",
                },
            },
            required: ["message"],
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