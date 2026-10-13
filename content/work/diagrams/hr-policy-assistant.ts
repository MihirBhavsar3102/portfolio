import type { Diagram } from "@/types/diagram";

/** The retrieval-augmented path from an HR policy question to its answer. */
export const hrPolicyAssistant: Diagram = {
  title: "How an HR policy question gets its answer",
  width: 760,
  height: 324,
  groups: [{ id: "assistant", label: "HR policy assistant", note: "Python", x: 176, y: 32, w: 568, h: 198 }],
  nodes: [
    { id: "question", label: "Question", meta: "HR policy", x: 16, y: 80, w: 130 },
    { id: "fastapi", label: "FastAPI", meta: "API service", tech: "fastapi", group: "assistant", x: 192, y: 80, w: 130 },
    { id: "langchain", label: "LangChain", meta: "orchestration", tech: "langchain", group: "assistant", x: 352, y: 80, w: 150 },
    { id: "llama", label: "Llama", meta: "inference", tech: "llama", group: "assistant", x: 552, y: 80, w: 176 },
    { id: "faiss", label: "FAISS", meta: "semantic retrieval", tech: "faiss", group: "assistant", x: 552, y: 168, w: 176 },
    { id: "documents", label: "HR policies", meta: "source documents", x: 552, y: 262, w: 176 },
  ],
  edges: [
    {
      from: "question",
      to: "fastapi",
      path: [[146, 103], [192, 103]],
      source: "resume: HR chatbot — context-aware HR policy question answering",
    },
    {
      from: "fastapi",
      to: "langchain",
      path: [[322, 103], [352, 103]],
      source: "resume: HR chatbot — Python, FastAPI, LangChain",
    },
    {
      from: "langchain",
      to: "llama",
      path: [[502, 103], [552, 103]],
      source: "resume: HR chatbot — Llama LLM inference",
    },
    {
      from: "langchain",
      to: "faiss",
      path: [[427, 126], [427, 191], [552, 191]],
      source: "resume: HR chatbot — FAISS semantic document retrieval",
    },
    {
      from: "documents",
      to: "faiss",
      path: [[640, 262], [640, 214]],
      source: "resume: HR chatbot — semantic retrieval over the HR policy documents",
    },
  ],
};
