import { NextResponse } from 'next/server';

const threats = [
  { id: 1, name: 'example.com' },
  { id: 2, name: 'bad-actor.org' },
  { id: 3, name: 'phishing-site.net' },
  { id: 4, name: 'malware-domain.io' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (typeof query !== 'string') {
    return NextResponse.json({ message: 'Query must be a string' }, { status: 400 });
  }

  const filteredThreats = threats.filter((threat) =>
    threat.name.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json(filteredThreats);
}
