import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { PreseleccionProvider } from "./context/PreseleccionContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import { Header } from "./components/Header.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { DoctorsPage } from "./pages/DoctorsPage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { PreseleccionPage } from "./pages/PreseleccionPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PreseleccionProvider>
          <Routes>
            <Route element={<Header />}> 
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute allowedRoles={["MEDICO"]} />}>
                <Route path="/medicos" element={<DoctorsPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={["PACIENTE"]} />}>
                <Route path="/buscar" element={<SearchPage />} />
                <Route path="/preseleccion" element={<PreseleccionPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </PreseleccionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
