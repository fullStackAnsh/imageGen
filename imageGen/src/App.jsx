import React, { useState } from "react";
import { Client } from "@gradio/client";

function App() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const client = await Client.connect("stabilityai/stable-diffusion-3.5-large", { hf_token: "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" });
      const result = await client.predict("/infer", {
        prompt: prompt || "A beautiful landscape",
        negative_prompt: negativePrompt || "",
        seed: 0,
        randomize_seed: true,
        width: 312,
        height: 312,
        guidance_scale: 7.0,
        num_inference_steps: 25,
      });
      console.log(result);
      setImage(result.data[0].url); // Assuming `result.data[0]` contains the image URL or base64.
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Check the console for details.");
    }
    setLoading(false);
  };
  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image; // Image source (URL or base64).
    link.download = "generated-image.png"; // Suggested filename.
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Image Generator</h1>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "300px", margin: "10px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Enter negative prompt (optional)"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
        style={{ width: "300px", margin: "10px" }}
      />
      <br />
      <button onClick={generateImage} disabled={loading} style={{ padding: "10px 20px", marginTop: "10px" }}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {image && <img src={image} alt="Generated" style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }} />}
      </div>
      {image &&  <button onClick={downloadImage} style={{ padding: "10px 20px" }}>
              Download Image
            </button>}
    </div>
  );
}

export default App;
