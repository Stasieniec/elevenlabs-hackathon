About
Run any large language model with fal, powered by OpenRouter.

1. Calling the API
#
Install the client
#
The client provides a convenient way to interact with the model API.

npm
yarn
pnpm
bun

npm install --save @fal-ai/client
Migrate to @fal-ai/client
The @fal-ai/serverless-client package has been deprecated in favor of @fal-ai/client. Please check the migration guide for more information.

Setup your API Key
#
Set FAL_KEY as an environment variable in your runtime.


export FAL_KEY="YOUR_API_KEY"
Submit a request
#
The client API handles the API submit protocol. It will handle the request status updates and return the result when the request is completed.


import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/any-llm", {
  input: {
    prompt: "What is the meaning of life?"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);
console.log(result.requestId);
Streaming
#
This model supports streaming requests. You can stream data directly to the model and get the result in real-time.


import { fal } from "@fal-ai/client";

const stream = await fal.stream("fal-ai/any-llm", {
  input: {
    prompt: "What is the meaning of life?"
  }
});

for await (const event of stream) {
  console.log(event);
}

const result = await stream.done();
2. Authentication
#
The API uses an API Key for authentication. It is recommended you set the FAL_KEY environment variable in your runtime when possible.

API Key
#
In case your app is running in an environment where you cannot set environment variables, you can set the API Key manually as a client configuration.

import { fal } from "@fal-ai/client";

fal.config({
  credentials: "YOUR_FAL_KEY"
});
Protect your API Key
When running code on the client-side (e.g. in a browser, mobile app or GUI applications), make sure to not expose your FAL_KEY. Instead, use a server-side proxy to make requests to the API. For more information, check out our server-side integration guide.

3. Queue
#
Long-running requests
For long-running requests, such as training jobs or models with slower inference times, it is recommended to check the Queue status and rely on Webhooks instead of blocking while waiting for the result.

Submit a request
#
The client API provides a convenient way to submit requests to the model.


import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/any-llm", {
  input: {
    prompt: "What is the meaning of life?"
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
Fetch request status
#
You can fetch the status of a request to check if it is completed or still in progress.


import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/any-llm", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
Get the result
#
Once the request is completed, you can fetch the result. See the Output Schema for the expected result format.


import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/any-llm", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
console.log(result.data);
console.log(result.requestId);
4. Files
#
Some attributes in the API accept file URLs as input. Whenever that's the case you can pass your own URL or a Base64 data URI.

Data URI (base64)
#
You can pass a Base64 data URI as a file input. The API will handle the file decoding for you. Keep in mind that for large files, this alternative although convenient can impact the request performance.

Hosted files (URL)
#
You can also pass your own URLs as long as they are publicly accessible. Be aware that some hosts might block cross-site requests, rate-limit, or consider the request as a bot.

Uploading files
#
We provide a convenient file storage that allows you to upload files and use them in your requests. You can upload files using the client API and use the returned URL in your requests.


import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
Auto uploads
The client will auto-upload the file for you if you pass a binary object (e.g. File, Data).

Read more about file handling in our file upload guide.

5. Schema
#
Input
#
model ModelEnum
Name of the model to use. Premium models are charged at 10x the rate of standard models, they include: meta-llama/llama-3.2-90b-vision-instruct, openai/gpt-4o, anthropic/claude-3-5-haiku, google/gemini-pro-1.5, anthropic/claude-3.5-sonnet. Default value: "google/gemini-flash-1.5"

Possible enum values: anthropic/claude-3.5-sonnet, anthropic/claude-3-5-haiku, anthropic/claude-3-haiku, google/gemini-pro-1.5, google/gemini-flash-1.5, google/gemini-flash-1.5-8b, meta-llama/llama-3.2-1b-instruct, meta-llama/llama-3.2-3b-instruct, meta-llama/llama-3.1-8b-instruct, meta-llama/llama-3.1-70b-instruct, openai/gpt-4o-mini, openai/gpt-4o, deepseek/deepseek-r1

prompt string
Prompt to be used for the chat completion

system_prompt string
System prompt to provide context or instructions to the model

reasoning boolean
Should reasoning be the part of the final answer.


{
  "model": "google/gemini-flash-1.5",
  "prompt": "What is the meaning of life?"
}
Output
#
output string
Generated output

reasoning string
Generated reasoning for the final answer

partial boolean
Whether the output is partial

error string
Error message if an error occurred


{
  "output": "The meaning of life is subjective and depends on individual perspectives."
}