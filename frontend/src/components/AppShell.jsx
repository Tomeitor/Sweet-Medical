import { NavLink, Outlet } from "react-router-dom";
import { usePreselection } from "../hooks/usePreselection.jsx";
import { Footer } from "./Footer.jsx";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/buscar", label: "Buscar turnos" },
  { to: "/preseleccion", label: "Preselección" },
  { to: "/como-funciona", label: "Cómo funciona" },
];

export function AppShell() {
  const { total } = usePreselection();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      <header className="topbar">
        <div>
          <div className="brand-heading">
            <img
              src="/faviconSweetMedical.png"
              alt="Sweet Medical"
              className="brand-icon"
            />
            <p className="eyebrow" id="titulo-unico">Sweet Medical</p>
          </div>
          <h1 className="brand-title">Reserva médica simple, clara y rápida</h1>
        </div>

        <nav aria-label="Principal" className="main-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

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
