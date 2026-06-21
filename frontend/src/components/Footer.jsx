import { Link } from "react-router-dom";

export function Footer() {
  return (
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
          <Link to="/">Inicio</Link>
          <Link to="/buscar">Buscar turnos</Link>
          <Link to="/preseleccion">Preselección</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Sweet Medical. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
