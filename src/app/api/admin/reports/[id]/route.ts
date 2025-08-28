import { NextResponse } from 'next/server';

// In-memory data store
let reports = [
  { id: 1, instrument: 'example.com', type: 'Phishing Website', description: 'A fake login page for a bank.', status: 'public', reviews: 5 },
  { id: 2, instrument: 'scam@example.com', type: 'Scam Email', description: 'An email asking for money.', status: 'hidden', reviews: 2 },
  { id: 3, instrument: '1-800-bad-guy', type: 'Fraudulent Phone Number', description: 'A fake tech support number.', status: 'public', reviews: 10 },
  { id: 4, instrument: 'malware.com', type: 'Malware Distribution', description: 'A site that downloads a virus.', status: 'public', reviews: 1 },
];

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { instrument, type, description } = body;

  const reportIndex = reports.findIndex(report => report.id === parseInt(id));

  if (reportIndex === -1) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  reports[reportIndex] = { ...reports[reportIndex], instrument, type, description };

  return NextResponse.json(reports[reportIndex]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const reportIndex = reports.findIndex(report => report.id === parseInt(id));

  if (reportIndex === -1) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  reports = reports.filter(report => report.id !== parseInt(id));

  return NextResponse.json({ message: 'Report deleted successfully' });
}
