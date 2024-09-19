import app from './app';

import dotenv from 'dotenv';

const PORT = process.env.PORT || 3000;

dotenv.config();  // Load environment variables

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
