import { Link, NavLink, Outlet } from "react-router-dom";
import { usePreselection } from "../hooks/usePreselection.jsx";
import { Footer } from "./Footer.jsx";

export function AppShell() {
  const { total } = usePreselection();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      <header className="topbar">
        <Link to="/" className="brand-block" aria-label="Ir al inicio de Sweet Medical">
          <div className="brand-heading">
            <img
              src="/faviconSweetMedical.png"
              alt="Sweet Medical"
              className="brand-icon"
            />
            <p className="eyebrow" id="titulo-unico">Sweet Medical</p>
          </div>
          <p className="brand-title">Centro médico integral para gestionar tus turnos de forma clara y rápida.</p>
        </Link>

        <NavLink
          to="/preseleccion"
          className="cart-chip"
          aria-label={`Turnos preseleccionados: ${total}`}
        >
          Preselección
          <span>{total}</span>
        </NavLink>
      </header>

      <main id="main-content" className="page-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
