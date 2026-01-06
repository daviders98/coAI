import { MLCEngine } from "@mlc-ai/web-llm";

const MODEL_ID = "Llama-3.2-1B-Instruct-q4f32_1-MLC";

let engine: MLCEngine | null = null;
let initPromise: Promise<MLCEngine> | null = null;

async function initEngine(): Promise<MLCEngine> {
  if (engine) return engine;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const e = new MLCEngine();
    await e.reload(MODEL_ID);
    engine = e;
    return e;
  })();

  return initPromise;
}

export async function warmupRewordEngine() {
  const e = await initEngine();

  await e.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Rewrite this sentence clearly: Hello world.",
      },
    ],
    stream: false,
  });
}

export async function rewordNoteLocal(text: string): Promise<string> {
  if (!text.trim()) return text;

  const e = await initEngine();

  const prompt = `
Summarize the following note to be better. Preserve meaning. Do not add new ideas. Do not explain me anything. Just return the result.

${text}
`;

  const res = await e.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    stream: false,
  });

  return res.choices?.[0]?.message?.content?.trim() ?? text;
}
