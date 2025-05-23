import { getLogs } from '../../utils/emailCron';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ logs: getLogs() });
  }
  return res.status(400).json({ message: 'Invalid request' });
}