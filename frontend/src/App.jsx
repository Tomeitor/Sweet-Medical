import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { PreselectionProvider } from "./context/PreselectionContext.jsx";
import { AppShell } from "./components/AppShell.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { SearchPageV2 } from "./pages/SearchPageV2.jsx";
import { PreselectionPage } from "./pages/PreselectionPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <PreselectionProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/buscar" element={<SearchPageV2 />} />
            <Route path="/preseleccion" element={<PreselectionPage />} />
            <Route path="/como-funciona" element={<Navigate to="/" replace />} />
            <Route path="/inicio" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </PreselectionProvider>
    </BrowserRouter>
  );
}

export default App;
