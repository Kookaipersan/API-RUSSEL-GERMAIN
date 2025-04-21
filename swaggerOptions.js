

// swaggerOptions.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de gestion des catways',
    version: '1.0.0',
    description: 'Documentation de l\'API pour la gestion des catways et réservations',
  },
};

const options = {
  swaggerDefinition,
  apis: ['routes/*.js', 'controllers/*.js'], // Spécifie les fichiers où Swagger doit chercher les annotations
};

const swaggerSpec = swaggerJSDoc(options);

// Exporte la configuration Swagger pour être utilisée ailleurs
module.exports = swaggerSpec;
