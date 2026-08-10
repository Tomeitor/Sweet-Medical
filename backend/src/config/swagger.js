import swaggerJSDoc from 'swagger-jsdoc'

const apiPrefix = process.env.PATH_APP || '/api/v1'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SweetMedical API',
      version: '1.0.0',
      description: 'Documentacion de la API de SweetMedical',
    },
    servers: [
      {
        url: apiPrefix,
      },
    ],
  },
  apis: ['./src/routers/*.js'],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export default swaggerSpec
