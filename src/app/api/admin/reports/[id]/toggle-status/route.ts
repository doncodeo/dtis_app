import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  // In a real app, you would find the report by id and update its status in the database.
  // Here, we're just logging the action.
  console.log(`Toggling status for report ${id}`);

  return NextResponse.json({ message: `Report ${id} status toggled successfully` });
}
