import { NavLink, Outlet } from "react-router-dom";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import { SessionSwitcher } from "./SessionSwitcher.jsx";

export function Header() {
  const { total } = usePreseleccion();
  const navLinkClass = ({ isActive }) => (isActive ? "nav-link is-active" : "nav-link");

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      <header className="topbar">
        <NavLink to="/" className="brand-block" aria-label="Ir al inicio de Sweet Medical">
          <div className="brand-heading">
            <img
              src="/faviconSweetMedical.png"
              alt="Sweet Medical"
              className="brand-icon"
            />
            <p className="eyebrow" id="titulo-unico">Sweet Medical</p>
          </div>
          <p className="brand-title">Centro médico integral para gestionar tus turnos de forma clara y rápida.</p>
        </NavLink>

        <div className="topbar-actions">
          <SessionSwitcher />

          <nav className="topbar-nav" aria-label="Navegación principal">
            <NavLink to="/" className={navLinkClass}>Inicio</NavLink>
            <NavLink to="/buscar" className={navLinkClass}>Buscar turnos</NavLink>
            <NavLink to="/preseleccion" className="cart-chip" aria-label={`Turnos preseleccionados: ${total}`}>
              Preselección
              <span>{total}</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" className="page-content">
        <Outlet />
      </main>

      <footer className="app-footer" aria-label="Pie de página">
        <div className="footer-content">
          <div className="footer-column">
            <p className="eyebrow">Sweet Medical</p>
            <p>
              Centro médico con turnos online, información clara de sedes y
              disponibilidad actualizada para pacientes.
            </p>
          </div>

          <div className="footer-column">
            <h3>Contacto</h3>
            <p>
              <a href="mailto:contacto@sweetmedical.com">
                contacto@sweetmedical.com
              </a>
            </p>
            <p>
              <a href="tel:+541112345678">+54 11 1234 5678</a>
            </p>
            <p>CABA, Argentina</p>
          </div>

          <div className="footer-column">
            <h3>Accesos rápidos</h3>
            <NavLink to="/" className={navLinkClass}>Inicio</NavLink>
            <NavLink to="/buscar" className={navLinkClass}>Buscar turnos</NavLink>
            <NavLink to="/preseleccion" className={navLinkClass}>Preselección</NavLink>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Sweet Medical. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
