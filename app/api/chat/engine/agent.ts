import {FunctionTool, OpenAIAgent} from "llamaindex";
import {createSalesforceContact, sendSlack, signJwt} from "@/app/utility/request-utilities";

export async function createAgent(): Promise<OpenAIAgent>{
    return new OpenAIAgent({
        tools: [draftSlackMessage, confirmAndSendSlackMessage,
            draftSalesforceContact, confirmAndCreateSalesforceContact]
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
            "a Slack message draft has not been created",
        parameters: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "The draft message",
                },
                confirmation: {
                    type: "string",
                    description: "affirmative confirmation to send draft message",
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

export const draftSalesforceContact = FunctionTool.from(
    ({ first_name, last_name, email, title }: { first_name: string, last_name: string, email: string, title: string}) => {
        console.log("Saleforce Contact Draft:");
        console.log("Salesforce Contact first name: " + first_name);
        console.log("Salesforce Contact last name: " + last_name);
        console.log("Salesforce Contact email: " + email);
        console.log("Salesforce Contact title: " + title);
        return "Salesforce Contact first name: " + first_name + "\n" +
            "Salesforce Contact last name: " + last_name + "\n" +
            "Salesforce Contact email: " + email+ "\n" +
            "Salesforce Contact title: " + title;
    },
    {
        name: "draftSalesforceContact",
        description: "Use this function to draft a contact record in Salesforce. This is a required function step" +
            "before creating a contact record in Salesforce. Prompt confirmation from " +
            "user to trigger the Salesforce record confirm and send step. This function does not create the Contact record" +
            "in Salesforce. This function only drafts a Contact record and prompts for confirmation",
        parameters: {
            type: "object",
            properties: {
                first_name: {
                    type: "string",
                    description: "First name of Salesforce contact",
                },
                last_name: {
                    type: "string",
                    description: "Last name of Salesforce contact",
                },
                email: {
                    type: "string",
                    description: "Email of Salesforce contact",
                },
                title: {
                    type: "string",
                    description: "Title of Salesforce contact",
                },
            },
            required: ["first_name", "last_name", "email", "title"],
        },
    }
);

export const confirmAndCreateSalesforceContact = FunctionTool.from(
    async({ confirmation, first_name, last_name, email, title }: { confirmation: string, first_name: string, last_name: string,
        email: string, title: string}) => {
        console.log("Confirmed Salesforce Contact Creation: " + confirmation);
        const response = await createSalesforceContact({first_name, last_name, email, title}, signJwt("jack.mu@useparagon.com"));
        if(response.statusCode){
            return "Successfully created Salesforce Contact";
        }
        return "Salesforce Contact not created successfully";
    },
    {
        name: "confirmAndCreateSalesforceContact",
        description: "Use this function to create a Salesforce Contact record only after a draft has been created. Do" +
            "not use this function if an affirmative confirmation is not given. Do not use this function if" +
            "a draft Salesforce Contact record has not been created",
        parameters: {
            type: "object",
            properties: {
                confirmation: {
                    type: "string",
                    description: "affirmative confirmation to create Salesforce Contact record"
                },
                first_name: {
                    type: "string",
                    description: "First name of Salesforce contact",
                },
                last_name: {
                    type: "string",
                    description: "Last name of Salesforce contact",
                },
                email: {
                    type: "string",
                    description: "Email of Salesforce contact",
                },
                title: {
                    type: "string",
                    description: "Title of Salesforce contact",
                },
            },
            required: ["confirmation", "first_name", "last_name", "email", "title"],
        },
    }
);