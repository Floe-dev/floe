A common way to use Chat Completions is to instruct the model to always return a JSON object that makes sense for your use case, by specifying this in the system message. While this does work in some cases, occasionally the models may generate output that does not parse to valid JSON objects.

To prevent these errors and improve model performance, when calling gpt-4-1106-preview or gpt-3.5-turbo-1106, you can set response_format to { "type": "json_object" } to enable JSON mode. When JSON mode is enabled, the model is constrained to only generate strings that parse into valid JSON object.

Important notes:

When using JSON mode, always instruct the model to produce JSON via some message in the conversation, for example via your system message. If you don't include an explicit instruction to generate JSON, the model may generate an unending stream of whitespace and the request may run continually until it reaches the token limit. To help ensure you don't forget, the API will throw an error if the string "JSON" does not appear somewhere in the context.
The JSON in the message the model returns may be partial (i.e. cut off) if finish_reason is length, which indicates the generation exceeded max_tokens or the conversation exceeded the token limit. To guard against this, check finish_reason before parsing the response.
JSON mode will not guarantee the output matches any specific schema, only that it is valid and parses without errors.
