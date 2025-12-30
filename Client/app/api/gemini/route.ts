import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { Analytics, Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { error } from "console";

const ai = new GoogleGenAI({})

const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.fixedWindow(5, "24 h"),
    analytics: true
})







export async function POST(req: Request) {
    try {

        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`)


        // console.log(req)
        if (!success) {
            return NextResponse.json(
                { error: "Daily limit reached. Try again in 24 hours." }
                , {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": limit.toString(),
                        "X-RateLimit-Remaining": remaining.toString(),
                        "X-RateLimit-Reset": reset.toString()
                    }
                }
            )
        }


        const form = await req.formData();

        const topic = form.get("Topic_name");          // string
        const size = form.get("Notebook_size");        // string
        const attached = form.get("Attached_notes") as File;   // "on" or null          // File | null

        console.log({ topic, size, attached });

        const contents = [];
        if (attached && attached instanceof File) {
            const uploadedFile = await ai.files.upload({
                file: attached,
                config: { mimeType: "plain/text" }
            });

            contents.push({
                fileData: {
                    mimeType: uploadedFile.mimeType,
                    fileUri: uploadedFile.uri
                }
            });
        }

        contents.push({
            text: `Generate organized notes based on the provided data. 
                STRUCTURE REQUIREMENTS:
                - Organize notes into a hierarchical tree structure.
                - Each branch (logical grouping) must contain at least 3 notes.
                - There should be ${size} notes.
                - The topic is ${topic}
                - There should be one root note. And it must have a root tag as unique as possible
                - Use the 'tag' field as a unique identifier for each note.
                - Use the 'link' field to store the 'tag' of the parent note to create the tree connection.`
        });
        // console.log(contents)

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        notebook: {
                            type: "object",
                            properties: {
                                name: { type: "string", description: "The name of the notebook." }
                            },
                            required: ["name"]
                        },
                        notes: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    answer: { type: "string" },
                                    tag: { type: "string", description: "Unique ID for this note." },
                                    link: { type: "string", description: "The tag of the parent note (null for root)." }
                                },
                                required: ["question", "answer", "tag", "link"]
                            },
                            description: "A list of notes forming a tree structure. witch each leaf having 3 parents"
                        }
                    },
                    required: ["notebook", "notes"]
                }
            }
        });

        // 4. Access the response text correctly
        if (response.text && response) {
            const responseText = JSON.parse(response.text)
            return NextResponse.json({ responseText })
            // return JSON.parse(responseText);
        }

    } catch (error) {
        console.error("Error generating notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}