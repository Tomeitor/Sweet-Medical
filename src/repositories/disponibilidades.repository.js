export let disponibilidadesDB = [
    // --- MÉDICOS QUE CUBREN TODOS LOS DÍAS (Lunes a Viernes) ---
    // Dra. Ana Gómez (id: 1)
    { id: 1, idMedico: 1, diaSemana: 'LUNES', desde: '09:00', hasta: '17:00' },
    { id: 2, idMedico: 1, diaSemana: 'MARTES', desde: '09:00', hasta: '17:00' },
    { id: 3, idMedico: 1, diaSemana: 'MIERCOLES', desde: '09:00', hasta: '17:00' },
    { id: 4, idMedico: 1, diaSemana: 'JUEVES', desde: '09:00', hasta: '17:00' },
    { id: 5, idMedico: 1, diaSemana: 'VIERNES', desde: '09:00', hasta: '17:00' },

    // Dr. Andrés Giménez (id: 16) - Turno mañana
    { id: 6, idMedico: 16, diaSemana: 'LUNES', desde: '08:00', hasta: '14:00' },
    { id: 7, idMedico: 16, diaSemana: 'MARTES', desde: '08:00', hasta: '14:00' },
    { id: 8, idMedico: 16, diaSemana: 'MIERCOLES', desde: '08:00', hasta: '14:00' },
    { id: 9, idMedico: 16, diaSemana: 'JUEVES', desde: '08:00', hasta: '14:00' },
    { id: 10, idMedico: 16, diaSemana: 'VIERNES', desde: '08:00', hasta: '14:00' },

    // Dra. Florencia Ríos (id: 17) - Turno tarde
    { id: 11, idMedico: 17, diaSemana: 'LUNES', desde: '12:00', hasta: '19:00' },
    { id: 12, idMedico: 17, diaSemana: 'MARTES', desde: '12:00', hasta: '19:00' },
    { id: 13, idMedico: 17, diaSemana: 'MIERCOLES', desde: '12:00', hasta: '19:00' },
    { id: 14, idMedico: 17, diaSemana: 'JUEVES', desde: '12:00', hasta: '19:00' },
    { id: 15, idMedico: 17, diaSemana: 'VIERNES', desde: '12:00', hasta: '19:00' },


    // --- MÉDICOS QUE CUBREN ALGUNOS DÍAS (2 o 3 días por semana) ---
    // Dr. Luis Pérez (id: 2)
    { id: 16, idMedico: 2, diaSemana: 'MARTES', desde: '08:00', hasta: '12:00' },
    { id: 17, idMedico: 2, diaSemana: 'JUEVES', desde: '14:00', hasta: '18:00' },

    // Dra. María Fernández (id: 3)
    { id: 18, idMedico: 3, diaSemana: 'LUNES', desde: '10:00', hasta: '16:00' },
    { id: 19, idMedico: 3, diaSemana: 'MIERCOLES', desde: '10:00', hasta: '16:00' },
    { id: 20, idMedico: 3, diaSemana: 'VIERNES', desde: '10:00', hasta: '16:00' },

    // Dra. Laura Martínez (id: 5)
    { id: 21, idMedico: 5, diaSemana: 'MARTES', desde: '09:00', hasta: '15:00' },
    { id: 22, idMedico: 5, diaSemana: 'JUEVES', desde: '09:00', hasta: '15:00' },

    // Dra. Sofía López (id: 7)
    { id: 23, idMedico: 7, diaSemana: 'LUNES', desde: '14:00', hasta: '18:00' },
    { id: 24, idMedico: 7, diaSemana: 'JUEVES', desde: '14:00', hasta: '18:00' },

    // Dra. Valentina Castro (id: 9)
    { id: 25, idMedico: 9, diaSemana: 'MIERCOLES', desde: '08:00', hasta: '14:00' },
    { id: 26, idMedico: 9, diaSemana: 'VIERNES', desde: '08:00', hasta: '14:00' },

    // Dr. Martín Romero (id: 10) - Incluye un Sábado
    { id: 27, idMedico: 10, diaSemana: 'MARTES', desde: '14:00', hasta: '18:00' },
    { id: 28, idMedico: 10, diaSemana: 'JUEVES', desde: '14:00', hasta: '18:00' },
    { id: 29, idMedico: 10, diaSemana: 'SABADO', desde: '09:00', hasta: '13:00' },

    // Dr. Fernando Iglesias (id: 12)
    { id: 30, idMedico: 12, diaSemana: 'LUNES', desde: '08:00', hasta: '12:00' },
    { id: 31, idMedico: 12, diaSemana: 'MIERCOLES', desde: '08:00', hasta: '12:00' },

    // Dr. Javier Molina (id: 14)
    { id: 32, idMedico: 14, diaSemana: 'MARTES', desde: '10:00', hasta: '17:00' },
    { id: 33, idMedico: 14, diaSemana: 'VIERNES', desde: '10:00', hasta: '17:00' },

    // Dr. Pablo Vargas (id: 18)
    { id: 34, idMedico: 18, diaSemana: 'LUNES', desde: '09:00', hasta: '13:00' },
    { id: 35, idMedico: 18, diaSemana: 'MIERCOLES', desde: '09:00', hasta: '13:00' },
    { id: 36, idMedico: 18, diaSemana: 'VIERNES', desde: '09:00', hasta: '13:00' },

    // Dr. Gabriel Blanco (id: 20)
    { id: 37, idMedico: 20, diaSemana: 'MARTES', desde: '15:00', hasta: '19:00' },
    { id: 38, idMedico: 20, diaSemana: 'JUEVES', desde: '15:00', hasta: '19:00' },


    // --- MÉDICOS QUE CUBREN SOLO 1 DÍA A LA SEMANA ---
    // Dr. Carlos Ruiz (id: 4)
    { id: 39, idMedico: 4, diaSemana: 'VIERNES', desde: '09:00', hasta: '13:00' },

    // Dr. Jorge Silva (id: 6)
    { id: 40, idMedico: 6, diaSemana: 'MARTES', desde: '13:00', hasta: '17:00' },

    // Dr. Diego Torres (id: 8)
    { id: 41, idMedico: 8, diaSemana: 'JUEVES', desde: '10:00', hasta: '14:00' },

    // Dra. Camila Sosa (id: 11)
    { id: 42, idMedico: 11, diaSemana: 'LUNES', desde: '14:00', hasta: '18:00' },

    // Dra. Paula Navarro (id: 13)
    { id: 43, idMedico: 13, diaSemana: 'MIERCOLES', desde: '10:00', hasta: '16:00' },

    // Dra. Lucía Herrera (id: 15)
    { id: 44, idMedico: 15, diaSemana: 'LUNES', desde: '08:00', hasta: '12:00' },

    // Dra. Natalia Domínguez (id: 19)
    { id: 45, idMedico: 19, diaSemana: 'VIERNES', desde: '08:00', hasta: '12:00' }
];