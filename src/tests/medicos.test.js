const axios = require('axios');
const router = require('../routers/medicos.routes.js');

jest.mock('axios');

// Se pueden leer a todos los medicos
test('Cuando hago GET se devuelven todos los medicos', () => {
    const medicos = [
        { id: 1, nombre: 'Dra. Ana Gómez', especialidad: 'Pediatría', matricula: '12345' },
        { id: 2, nombre: 'Dr. Luis Pérez', especialidad: 'Cardiología', matricula: '67890' }
    ];
    const resp = {data: medicos};    
    
    axios.get.mockResolvedValue(resp);

    return router.get('/api/v1/medicos/', controller.getMedicos).then(data => expect(data).toEqual(medicos));
});

// Se puede borrar un medico
test('Cuando hago DELETE del medico con id 1, se borra del sistema', () => {
    const medicos = [
        { id: 2, nombre: 'Dr. Luis Pérez', especialidad: 'Cardiología', matricula: '67890' }
    ];
    const resp = {data: medicos};    
    
    axios.delete.mockResolvedValue(resp);

    return router.delete('/api/v1/medicos/1', controller.deleteMedico).then(data => expect(data).toEqual(medicos));
});