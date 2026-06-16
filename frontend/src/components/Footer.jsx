import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="app-footer" aria-label="Pie de página">
      <div className="footer-content">
        <div className="footer-column">
          <p className="eyebrow">Sweet Medical</p>
          <p>
            Reserva tus turnos con médicos y prácticas en un solo lugar. Simple,
            rápido y con costos estimados.
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
          <h3>Enlaces</h3>
          <Link to="/">Inicio</Link>
          <Link to="/buscar">Buscar turnos</Link>
          <Link to="/preseleccion">Preselección</Link>
          <Link to="/como-funciona">Cómo funciona</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Sweet Medical. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
