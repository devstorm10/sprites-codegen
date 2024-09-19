import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Where are you now that I need you most?');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
