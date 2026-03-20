import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import "./index.css";
import Layout from "./Layout.tsx";
import { ThemeProvider } from "./lib/ThemeProvider.tsx";
import { routes } from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SidebarProvider defaultOpen={false}>
          <Layout>
            <Routes>
              <Route index element={<App />} />
              {routes.map((route, i) => {
                return (
                  <Route key={i} path={route.path} element={route.component} />
                );
              })}
            </Routes>
          </Layout>
        </SidebarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
