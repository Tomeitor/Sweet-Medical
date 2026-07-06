import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { handleApiError } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      const sessionUser = await login(form);
      const redirectTo = location.state?.from ?? (sessionUser.role === "MEDICO" ? "/medicos" : "/");
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(handleApiError(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    navigate(user.role === "MEDICO" ? "/medicos" : "/", { replace: true });
  }, [navigate, user]);

  return (
    <div className="content-grid two-columns align-start login-page">
      <section className="hero-panel stack-md">
        <p className="eyebrow">Acceso</p>
        <h2>Ingresá con tu usuario</h2>
        <p>
          Usá una cuenta de demo para acceder según tu rol y continuar con el flujo habitual.
        </p>
        <div className="status-card">
          <strong>Demo</strong>
          <p>La contraseña de demo es <strong>Demo123!</strong></p>
        </div>
      </section>

      <section className="info-card stack-md">
        <div>
          <p className="eyebrow">Sesión</p>
          <h2>Iniciar sesión</h2>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <form className="stack-md" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Usuario</span>
            <input
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="ana.gomez"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Contraseña</span>
            <input
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="••••••••"
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
}
