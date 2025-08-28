import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';

// In-memory data store
let reports = [
  { id: 1, instrument: 'example.com', type: 'Phishing Website', description: 'A fake login page for a bank.', status: 'public', reviews: 5, userId: 'user1', createdAt: new Date() },
  { id: 2, instrument: 'scam@example.com', type: 'Scam Email', description: 'An email asking for money.', status: 'hidden', reviews: 2, userId: 'user2', createdAt: new Date() },
  { id: 3, instrument: '1-800-bad-guy', type: 'Fraudulent Phone Number', description: 'A fake tech support number.', status: 'public', reviews: 10, userId: 'user1', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hours ago
];

// Mock user session
const getUserId = (req: NextApiRequest) => {
  // In a real app, you would get the user ID from the session or token
  return 'user1';
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const { instrument, type, description } = body;

  // In a real app, you would get the user ID from the session or token
  const userId = 'user1'; // Mocking user ID

  const reportIndex = reports.findIndex(report => report.id === parseInt(id));

  if (reportIndex === -1) {
    return NextResponse.json({ message: 'Report not found' }, { status: 404 });
  }

  const report = reports[reportIndex];

  if (report.userId !== userId) {
    return NextResponse.json({ message: 'You are not authorized to edit this report' }, { status: 403 });
  }

  const now = new Date();
  const reportDate = new Date(report.createdAt);
  const hoursDifference = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60);

  if (hoursDifference > 1) {
    return NextResponse.json({ message: 'You can only edit your report within one hour of creation' }, { status: 403 });
  }

  reports[reportIndex] = { ...report, instrument, type, description };

  return NextResponse.json(reports[reportIndex]);
}
