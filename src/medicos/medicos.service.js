let medicosDB = [
    { id: 1, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', matricula: '12345' },
    { id: 2, nombre: 'Dr. Luis Pérez', especialidad: 'Cardiología', matricula: '67890' }
];

export default class MedicoService {
    async getAll() {
        return medicosDB;
    }

    async getById(id) {
        const medico = medicosDB.find(m => m.id == id);
        if (!medico) throw new Error('Médico no encontrado');
        return medico;
    }

    async create(medicoData) {
        const nuevoMedico = { 
            id: medicosDB.length + 1, 
            ...medicoData 
        };
        medicosDB.push(nuevoMedico);
        return nuevoMedico;
    }

    // Actualizar un médico existente
    async update(id, medicoData) {
        // Ejemplo con BD real: return await MedicoModel.findByIdAndUpdate(id, medicoData, { new: true });
        const index = medicosDB.findIndex(m => m.id === parseInt(id));
        if (index === -1) throw new Error('Médico no encontrado');
        
        medicosDB[index] = { ...medicosDB[index], ...medicoData };
        return medicosDB[index];
    }

    // Eliminar un médico
    async delete(id) {
        // Ejemplo con BD real: return await MedicoModel.findByIdAndDelete(id);
        const index = medicosDB.findIndex(m => m.id === parseInt(id));
        if (index === -1) throw new Error('Médico no encontrado');
        
        const medicoEliminado = medicosDB.splice(index, 1);
        return medicoEliminado[0];
    }
}

