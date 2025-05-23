import { startCron, stopCron, getStatus } from '../../../utils/emailCron';

export default function handler(req, res) {
  const { action } = req.query;

  if (req.method === 'POST') {
    if (action === 'start') {
      startCron();
      return res.status(200).json({ message: 'Cron started', isRunning: getStatus() });
    } else if (action === 'stop') {
      stopCron();
      return res.status(200).json({ message: 'Cron stopped', isRunning: getStatus() });
    }
  } else if (req.method === 'GET' && action === 'status') {
    return res.status(200).json({ isRunning: getStatus() });
  }

  return res.status(400).json({ message: 'Invalid request' });
}