import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { ProjectsProvider } from "./context/ProjectsContext";
import { ApiKeysProvider } from "./context/ApiKeysContext";
import { SecurityPoliciesProvider } from "./context/SecurityPoliciesContext";
import { RateLimitsProvider } from "./context/RateLimitsContext";
import { AuthProvider } from "./context/AuthContext";

import App from "./App";
import "./index.css";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <ApiKeysProvider>
            <SecurityPoliciesProvider>
              <RateLimitsProvider>
                <App />

                <Toaster
                  position="top-right"
                  richColors
                />
              </RateLimitsProvider>
            </SecurityPoliciesProvider>
          </ApiKeysProvider>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);