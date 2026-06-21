import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { PreseleccionProvider } from "./context/PreseleccionContext.jsx";

import { Header } from "./components/Header.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { PreseleccionPage } from "./pages/PreseleccionPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <PreseleccionProvider>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/buscar" element={<SearchPage />} />
            <Route path="/preseleccion" element={<PreseleccionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </PreseleccionProvider>
    </BrowserRouter>
  );
}

export default App;
