import Groq from "groq-sdk";

const groq = new Groq({ apiKey: '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', dangerouslyAllowBrowser: true });

async function generateQuestionsFromPromt(text) {
  const schema = {
    $defs: {
      Question: {
        properties: {
          question: { title: "Question", type: "string" },
          options: {
            items: { type: "string" },
            title: "Options",
            type: "array",
          },
          correctOption: { title: "Correct Option", type: "number" },
        },
        required: ["question", "options", "correctOption"],
        title: "Question",
        type: "object",
      },
    },
    properties: {
      questions: {
        items: { $ref: "#/$defs/Question" },
        title: "Questions",
        type: "array",
      },
    },
    required: ["questions"],
    title: "Quiz",
    type: "object",
  };

  const jsonSchema = JSON.stringify(schema, null, 4);
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a quiz generator that outputs questions in JSON format. The JSON object must use the following schema: ${jsonSchema}.Make sure the correct option is randomized.`,
      },
      {
        role: "user",
        content: `Generate a set of questions using the following promt: ${text}. Ensure that the correct answer option is randomized among the options. The output should be a JSON object that conforms to the provided schema.`,
      },
    ],
    model: "llama3-8b-8192",
    temperature: 0,
    stream: false,
    response_format: { type: "json_object" },
  });

  const generatedQuestions = chatCompletion.choices[0].message.content;
  console.log('Generated questions from text:', generatedQuestions);
  return generatedQuestions;
}

export { generateQuestionsFromPromt };