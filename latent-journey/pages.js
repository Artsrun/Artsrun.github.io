/** v2 chapter source. Canvas stage id drives the live draw. */
export const tokens = ["<bos>", "<user>", "Why", "_is", "_the", "_sky", "_blue", "?", "<end>", "<asst>"];
export const ids = [1, 3, 3750, 338, 278, 14744, 7254, 29973, 2, 4];

export const pages = [
  { id: "00", stage: "title", chapter: "open", title: "Latent Journey", formula: "forward(prompt) → token", note: "Live forward pass. Prompt: “Why is the sky blue?” Window 4096." },
  { id: "1.1", stage: "lookup", chapter: "input", title: "Embedding lookup", formula: "E ∈ ℝ^{32000×4096}", note: "Token id indexes a row. Ten positions in this pass." },
  { id: "1.2.1", stage: "bpe", chapter: "input", title: "BPE merge", formula: "(“s”, “k”) → “sk”  rank 12", note: "Bytes become tokens before the table lookup." },
  { id: "1.3", stage: "embed", chapter: "input", title: "Token embedding", formula: "x₄ = E[14744] ∈ ℝ^{4096}", note: "Same vector every time that id appears." },
  { id: "1.4", stage: "residual", chapter: "input", title: "Residual stream", formula: "h ∈ ℝ^{10×4096}", note: "The highway every block reads and writes." },
  { id: "1.4.5", stage: "add", chapter: "input", title: "Embedding addition", formula: "h = x + p", note: "Content plus position. Same width, no concat." },
  { id: "2.1.4", stage: "matmul", chapter: "math", title: "Batched matmul", formula: "Y = X W", note: "Row meets column, multiply, sum. This is the whole model." },
  { id: "3.1.1", stage: "rms", chapter: "block", title: "Pre-attention RMSNorm", formula: "ĥ = RMSNorm(h)", note: "Scale the row, keep direction. Residual stays raw." },
  { id: "3.2.1", stage: "qkv", chapter: "attn", title: "QKV projection", formula: "[Q K V] = h Wqkv", note: "One matmul, three slices. Each ∈ ℝ^{10×4096}." },
  { id: "3.4", stage: "rope", chapter: "attn", title: "RoPE", formula: "θᵢ = 10000^{−2i/128}", note: "angle = m · θᵢ. Fast dims spin, slow dims barely move." },
  { id: "3.5", stage: "heads", chapter: "attn", title: "Heads", formula: "32 × dₖ 128, causal", note: "Each head is a different lookup over the same stream." },
  { id: "3.6.1", stage: "concat", chapter: "attn", title: "Head concat", formula: "O = Σⱼ aⱼ Vⱼ", note: "Weighted values, concatenated back to 4096." },
  { id: "3.7.1", stage: "swiglu", chapter: "ffn", title: "SwiGLU", formula: "gate = SiLU(x Wgate)", note: "Most of what the model knows lives in this widen-and-gate." },
  { id: "4.1.1", stage: "depth", chapter: "stack", title: "Depth", formula: "block × 32", note: "h ← h + Attn(RMSNorm(h)), then h ← h + FFN(RMSNorm(h))." },
  { id: "5.1.2", stage: "logits", chapter: "decode", title: "Logits", formula: "logits = RMSNorm(h₉) Wᵤ", note: "∈ ℝ^{32000}. One score per next token." },
  { id: "5.2.2", stage: "topp", chapter: "decode", title: "Top-p", formula: "p = 0.90, T = 0.70", note: "Cut the tail, sample inside the remaining mass." },
  { id: "6.1.2", stage: "kv", chapter: "gen", title: "KV cache", formula: "10 pos · 5.0 MiB", note: "Generated “ Ray”. New token attends to stored K/V." },
  { id: "6.2.1", stage: "growth", chapter: "gen", title: "Context growth", formula: "cache ∝ L × n", note: "Prefill once. Each new token walks the stack alone." },
  { id: "end", stage: "end", chapter: "close", title: "v2", formula: "canvas timeline", note: "Original draw of the same pass. Stills remain in stills.html." }
];
