import { NextApiRequest, NextApiResponse } from 'next';

const threats = [
  { id: 1, name: 'example.com' },
  { id: 2, name: 'bad-actor.org' },
  { id: 3, name: 'phishing-site.net' },
  { id: 4, name: 'malware-domain.io' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;

  if (typeof query !== 'string') {
    return res.status(400).json({ message: 'Query must be a string' });
  }

  const filteredThreats = threats.filter((threat) =>
    threat.name.toLowerCase().includes(query.toLowerCase())
  );

  res.status(200).json(filteredThreats);
}
