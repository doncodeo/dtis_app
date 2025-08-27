import { NextResponse } from 'next/server';

const reports = [
  { id: 1, instrument: 'example.com', type: 'Phishing Website', description: 'A fake login page for a bank.', status: 'public', reviews: 5 },
  { id: 2, instrument: 'scam@example.com', type: 'Scam Email', description: 'An email asking for money.', status: 'hidden', reviews: 2 },
  { id: 3, instrument: '1-800-bad-guy', type: 'Fraudulent Phone Number', description: 'A fake tech support number.', status: 'public', reviews: 10 },
  { id: 4, instrument: 'malware.com', type: 'Malware Distribution', description: 'A site that downloads a virus.', status: 'public', reviews: 1 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category) {
    const filteredReports = reports.filter((report) => report.type === category);
    return NextResponse.json(filteredReports);
  }

  return NextResponse.json(reports);
}
