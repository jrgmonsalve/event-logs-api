const { execSync } = require('child_process');
require('dotenv').config();

// Lee las variables desde .env
const apiRateLimit = process.env.API_RATE_LIMIT || 100;

// Ejecuta el comando sam deploy con las variables de entorno
const command = `sam deploy --template-file packaged.yaml --stack-name EventLogsStack --capabilities CAPABILITY_IAM --parameter-overrides ApiRateLimit=${apiRateLimit}`;

console.log('Ejecutando comando:', command);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error durante el despliegue:', error);
}

