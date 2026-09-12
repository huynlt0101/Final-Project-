import app from './app.js';
import config from './config/index.js';

// Start HTTP server
app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
  console.log(`Swagger UI: http://localhost:${config.port}/api-docs`);
  console.log(`Environment: ${config.nodeEnv}`);
});
