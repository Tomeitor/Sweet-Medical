import { useEffect, useMemo, useState } from "react";
import { fetchDoctors } from "../services/api.js";
import { SessionContext } from "./session-contexto.js";

const SESSION_STORAGE_KEY = "sweet-medical-session";

const demoPatients = [
  {
    key: "patient:1",
    role: "patient",
    label: "Juan Perez",
    subtitle: "Paciente · OSDE 210",
    patientId: "1",
    userId: "1",
  },
  {
    key: "patient:2",
    role: "patient",
    label: "Maria Lopez",
    subtitle: "Paciente · Swiss Medical SMG20",
    patientId: "2",
    userId: "2",
  },
];

function getDoctorId(doctor) {
  return doctor.id ?? doctor._id ?? doctor.medicoId ?? doctor.usuario;
}

export function SessionProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [sessionKey, setSessionKey] = useState(() => {
    return window.localStorage.getItem(SESSION_STORAGE_KEY) ?? demoPatients[0].key;
  });

  useEffect(() => {
    let mounted = true;

    async function loadDoctors() {
      try {
        const response = await fetchDoctors();

        if (!mounted) {
          return;
        }

        setDoctors(Array.isArray(response) ? response : []);
      } finally {
        if (mounted) {
          setLoadingDoctors(false);
        }
      }
    }

    loadDoctors();

    return () => {
      mounted = false;
    };
  }, []);

  const doctorSessions = useMemo(
    () =>
      doctors
        .map((doctor) => {
          const doctorId = getDoctorId(doctor);

          if (!doctorId) {
            return null;
          }

          return {
            key: `doctor:${doctorId}`,
            role: "doctor",
            label: doctor.nombre,
            subtitle: `Médico · MP ${doctor.matricula}`,
            doctorId: String(doctorId),
            userId: String(doctor.usuario ?? doctorId),
            doctor,
          };
        })
        .filter(Boolean),
    [doctors],
  );

  const sessions = useMemo(() => [...demoPatients, ...doctorSessions], [doctorSessions]);

  useEffect(() => {
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionKey);
  }, [sessionKey]);

  const currentSession = sessions.find((session) => session.key === sessionKey) ?? sessions[0] ?? demoPatients[0];

  const value = useMemo(
    () => ({
      sessions,
      currentSession,
      loadingDoctors,
      setSessionKey,
      isPatient: currentSession?.role === "patient",
      isDoctor: currentSession?.role === "doctor",
    }),
    [currentSession, loadingDoctors, sessions],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
