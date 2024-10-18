const { execSync } = require('child_process');
require('dotenv').config();

// Lee las variables desde .env
const DBPassword = process.env.DB_PASSWORD;

// Ejecuta el comando sam deploy con las variables de entorno
const command = `sam deploy --template-file databases.yaml --stack-name DatabasesStack --capabilities CAPABILITY_IAM --parameter-overrides DBPassword=${DBPassword}`;

console.log('Ejecutando comando:', command);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error durante el despliegue:', error);
}

