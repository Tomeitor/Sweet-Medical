import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { usePreseleccion } from "../hooks/usePreseleccion.jsx";
import { fetchNotifications } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const selectedDoctorUserKey = "selectedDoctorUsuarioId";

export function Header() {
  const { total } = usePreseleccion();
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "MEDICO") {
      setUnreadCount(0);
      return;
    }

    function syncUnreadCount() {
      const usuarioId = window.localStorage.getItem(selectedDoctorUserKey) ?? user.username ?? "";

      if (!usuarioId) {
        setUnreadCount(0);
        return;
      }

      fetchNotifications(usuarioId, false)
        .then((items) => setUnreadCount(items.length))
        .catch(() => setUnreadCount(0));
    }

    syncUnreadCount();
    window.addEventListener("selected-doctor-changed", syncUnreadCount);
    window.addEventListener("storage", syncUnreadCount);

    return () => {
      window.removeEventListener("selected-doctor-changed", syncUnreadCount);
      window.removeEventListener("storage", syncUnreadCount);
    };
  }, [user]);

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

        <nav className="topbar-actions" aria-label="Navegación principal">
          {user?.role === "MEDICO" ? (
            <NavLink to="/medicos" className="nav-link">
              Médicos
            </NavLink>
          ) : null}

          <NavLink
            to="/preseleccion"
            className="cart-chip"
            aria-label={`Turnos preseleccionados: ${total}`}
          >
            Preselección
            <span>{total}</span>
          </NavLink>

          {user?.role === "MEDICO" ? (
            <Link
              to="/medicos#notificaciones"
              className="cart-chip cart-chip--icon"
              aria-label={
                unreadCount > 0
                  ? `Notificaciones pendientes: ${unreadCount}`
                  : "Notificaciones"
              }
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                <path d="M9 17a3 3 0 0 0 6 0" />
              </svg>
              {unreadCount > 0 ? <span>{unreadCount}</span> : null}
            </Link>
          ) : null}

          {user ? (
            <>
              <span className="cart-chip" aria-label={`Sesión activa de ${user.username}`}>
                {user.username}
              </span>
              <button type="button" className="secondary-button" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-link">
              Ingresar
            </NavLink>
          )}
        </nav>
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
            <h3>Acceso rápido</h3>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/buscar">Buscar turnos</NavLink>
            {user?.role === "MEDICO" ? <NavLink to="/medicos">Médicos</NavLink> : null}
            <NavLink to="/preseleccion">Preselección</NavLink>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Sweet Medical. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
