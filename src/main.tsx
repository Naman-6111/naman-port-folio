import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { installPreviewGlow } from "./click-glow";
import { installProjectPreviewInteractions } from "./project-preview-interactions";
import "./globals.css";
import "./interaction.css";
import "./click-glow.css";
import "./contact-effects.css";
import "./contact-layout.css";
import "./project-preview-interactions.css";
import "./project-preview-themes.css";

installPreviewGlow();
installProjectPreviewInteractions();
createRoot(document.getElementById("root")!).render(<App />);
