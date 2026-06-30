import { useSession } from "../hooks/useSession.jsx";

export function SessionSwitcher() {
  const { sessions, currentSession, setSessionKey, loadingDoctors } = useSession();

  return (
    <label className="session-switcher field" htmlFor="session-switcher">
      <span className="field-label">Sesión mock</span>
      <select
        id="session-switcher"
        value={currentSession?.key ?? ""}
        onChange={(event) => setSessionKey(event.target.value)}
      >
        {sessions.map((session) => (
          <option key={session.key} value={session.key}>
            {session.label} · {session.role === "doctor" ? "Doctor" : "Paciente"}
          </option>
        ))}
        {loadingDoctors && <option value="" disabled>Cargando médicos...</option>}
      </select>
      <span className="field-hint">{currentSession?.subtitle}</span>
    </label>
  );
}
