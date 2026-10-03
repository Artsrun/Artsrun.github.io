/**
 * Chapter cards from KimizLlm Latent Journey (2026-10-02).
 * Frames are stills from the public X video, not a re-render.
 */
export const pages = [
  { id: "00", chapter: "open", title: "Latent Journey", formula: "forward(prompt) → token", note: "Complete forward pass. Prompt in the film: “Why is the sky blue?” Window 4096.", src: "frames/01-title.jpg" },
  { id: "1.1", chapter: "input", title: "Embedding lookup", formula: "E ∈ ℝ^{32000×4096}", note: "Token id indexes a row. Ten positions in this pass.", src: "frames/02-embed-lookup.jpg" },
  { id: "1.2.1", chapter: "input", title: "BPE merge", formula: "(“s”, “k”) → “sk”  rank 12", note: "Bytes become tokens before the table lookup.", src: "frames/03-bpe.jpg" },
  { id: "1.3", chapter: "input", title: "Token embedding", formula: "x₄ = E[14744] ∈ ℝ^{4096}", note: "Same vector every time that id appears.", src: "frames/04-token-embed.jpg" },
  { id: "1.4", chapter: "input", title: "Residual stream", formula: "h ∈ ℝ^{10×4096}", note: "The highway every block reads and writes.", src: "frames/05-residual.jpg" },
  { id: "1.4.5", chapter: "input", title: "Embedding addition", formula: "h = x + p", note: "Content plus position. Same width, no concat.", src: "frames/06-embed-add.jpg" },
  { id: "2.1.4", chapter: "math", title: "Batched matmul", formula: "Y = X W", note: "Row meets column, multiply, sum. This is the whole model.", src: "frames/07-matmul.jpg" },
  { id: "3.1.1", chapter: "block", title: "Pre-attention RMSNorm", formula: "ĥ = RMSNorm(h)", note: "Scale the row, keep direction. Residual stays raw.", src: "frames/08-rmsnorm.jpg" },
  { id: "3.2.1", chapter: "attn", title: "QKV projection", formula: "[Q K V] = h W_{qkv}", note: "One matmul, three slices. Each ∈ ℝ^{10×4096}.", src: "frames/09-qkv.jpg" },
  { id: "3.4", chapter: "attn", title: "RoPE", formula: "θᵢ = 10000^{−2i/128}", note: "angle = m · θᵢ. Fast dims spin, slow dims barely move.", src: "frames/10-rope.jpg" },
  { id: "3.5", chapter: "attn", title: "Heads", formula: "32 × dₖ 128, causal", note: "Each head is a different lookup over the same stream.", src: "frames/11-heads.jpg" },
  { id: "3.6.1", chapter: "attn", title: "Head concat", formula: "O = Σⱼ aⱼ Vⱼ", note: "Weighted values, concatenated back to 4096.", src: "frames/12-concat.jpg" },
  { id: "3.7.1", chapter: "ffn", title: "SwiGLU", formula: "gate = SiLU(x W_gate)", note: "Most of what the model knows lives in this widen-and-gate.", src: "frames/13-swiglu.jpg" },
  { id: "4.1.1", chapter: "stack", title: "Depth", formula: "block × 32", note: "h ← h + Attn(RMSNorm(h)), then h ← h + FFN(RMSNorm(h)).", src: "frames/14-depth.jpg" },
  { id: "5.1.2", chapter: "decode", title: "Logits", formula: "logits = RMSNorm(h₉) W_U", note: "∈ ℝ^{32000}. One score per next token.", src: "frames/15-logits.jpg" },
  { id: "5.2.2", chapter: "decode", title: "Top-p", formula: "p = 0.90, T = 0.70", note: "Cut the tail, sample inside the remaining mass.", src: "frames/16-topp.jpg" },
  { id: "6.1.2", chapter: "gen", title: "KV cache", formula: "10 pos · 5.0 MiB", note: "Generated “ Ray”. New token attends to stored K/V.", src: "frames/17-kv.jpg" },
  { id: "6.2.1", chapter: "gen", title: "Context growth", formula: "cache ∝ L × n", note: "Prefill once. Each new token walks the stack alone.", src: "frames/18-context.jpg" },
  { id: "end", chapter: "close", title: "KimizLlm", formula: "JS + WebGL / Canvas", note: "Live timeline in the browser. Stills extracted here, not a re-render.", src: "frames/19-end.jpg" }
];
