import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { installPreviewGlow } from "./click-glow";
import "./globals.css";
import "./interaction.css";
import "./click-glow.css";

installPreviewGlow();
createRoot(document.getElementById("root")!).render(<App />);
