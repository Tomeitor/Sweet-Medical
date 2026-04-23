export let medicosDB = [
    { id: 1, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', matricula: '12345' },
    { id: 2, nombre: 'Dr. Luis Pérez', especialidad: 'Cardiología', matricula: '67890' }
];

export const findById = (id) => {
    return medicosDB.find(m => m.id === id); 
};
