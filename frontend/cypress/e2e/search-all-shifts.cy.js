/* global describe, it, beforeEach, cy */

const doctorsResponse = [
  {
    _id: 'med-1',
    nombre: 'Dr. Ana Gomez',
    matricula: '12345',
    especialidad: 'Cardiology',
  },
  {
    _id: 'med-2',
    nombre: 'Dr. Bruno Diaz',
    matricula: '67890',
    especialidad: 'Clinical Medicine',
  },
]

const availableShiftsResponse = {
  items: [
    {
      medico: { id: 'med-1', nombre: 'Dr. Ana Gomez', matricula: '12345' },
      especialidad: 'Cardiology',
      practica: 'Electrocardiogram',
      sede: 'Central Clinic',
      fechaHora: '2026-07-01T09:30:00.000Z',
      hora: '09:30',
      cobertura: 'TOTAL',
      costoBase: 25000,
      costoPaciente: 0,
    },
    {
      medico: { id: 'med-2', nombre: 'Dr. Bruno Diaz', matricula: '67890' },
      especialidad: 'Clinical Medicine',
      practica: 'General Consultation',
      sede: 'North Center',
      fechaHora: '2026-07-02T12:00:00.000Z',
      hora: '12:00',
      cobertura: 'PARCIAL',
      costoBase: 18000,
      costoPaciente: 6500,
    },
  ],
  pagination: {
    page: 1,
    limit: 12,
    total: 2,
    totalPages: 1,
  },
}

describe('Search all shifts', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/medicos', doctorsResponse).as('getDoctors')
    cy.intercept('GET', '**/turnos/disponibles*', (request) => {
      if ('q' in request.query) {
        throw new Error('The all-shifts search should not send a q query parameter.')
      }

      request.reply({ body: availableShiftsResponse })
    }).as('getAvailableShifts')
  })

  it('shows cards for available shifts when searching all appointments', () => {
    cy.visit('/buscar')

    cy.get('[data-testid="search-submit-button"]').should('contain.text', 'Buscar todos').click()

    cy.wait('@getAvailableShifts')

    cy.get('[data-testid="shift-card"]').should('have.length', 2)
    cy.contains('[data-testid="shift-card"]', 'Dr. Ana Gomez').should('be.visible')
    cy.contains('[data-testid="shift-card"]', 'Dr. Bruno Diaz').should('be.visible')
    cy.contains('Resultados (2 de 2)').should('be.visible')
  })
})
