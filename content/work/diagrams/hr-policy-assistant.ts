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
  traces: [
    { id: "answers", figure: "~60%", label: "faster answers", lights: ["langchain", "llama", "faiss", "documents"] },
    {
      id: "question",
      label: "How a question comes in",
      caption: "A question comes in through a FastAPI service, and LangChain coordinates the rest.",
      lights: ["question", "fastapi", "langchain"],
    },
  ],
  // The question runs down through FastAPI to LangChain, which branches to Llama and FAISS; the documents feed FAISS from below.
  phone: {
    width: 340,
    height: 438,
    groups: {
      assistant: { x: 8, y: 78, w: 324, h: 274 },
    },
    nodes: {
      question: { x: 115, y: 8, w: 150 },
      fastapi: { x: 115, y: 130, w: 150 },
      langchain: { x: 115, y: 200, w: 150 },
      llama: { x: 20, y: 290, w: 110 },
      faiss: { x: 150, y: 290, w: 170 },
      documents: { x: 157, y: 384, w: 156 },
    },
    edges: {
      "question->fastapi": { path: [[190, 54], [190, 130]] },
      "fastapi->langchain": { path: [[190, 176], [190, 200]] },
      "langchain->llama": { path: [[115, 223], [75, 223], [75, 290]] },
      "langchain->faiss": { path: [[235, 246], [235, 290]] },
      "documents->faiss": { path: [[235, 384], [235, 336]] },
    },
  },
};
