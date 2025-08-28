import { NextResponse } from 'next/server';

const reports = [
  { id: 1, instrument: 'example.com', type: 'Phishing Website', description: 'A fake login page for a bank.', status: 'public', reviews: 5, aliases: ['ex.com', 'example.org'] },
  { id: 2, instrument: 'scam@example.com', type: 'Scam Email', description: 'An email asking for money.', status: 'hidden', reviews: 2, aliases: [] },
  { id: 3, instrument: '1-800-bad-guy', type: 'Fraudulent Phone Number', description: 'A fake tech support number.', status: 'public', reviews: 10, aliases: ['1-800-bad-guys'] },
  { id: 4, instrument: 'malware.com', type: 'Malware Distribution', description: 'A site that downloads a virus.', status: 'public', reviews: 1, aliases: [] },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const instrument = searchParams.get('instrument');

  let filteredReports = reports;

  if (type) {
    filteredReports = filteredReports.filter((report) => report.type === type);
  }

  if (instrument) {
    filteredReports = filteredReports.filter((report) =>
      report.instrument.toLowerCase().includes(instrument.toLowerCase())
    );
  }

  return NextResponse.json(filteredReports);
}
