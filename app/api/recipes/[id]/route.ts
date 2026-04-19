import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const recipe = await prisma.recipe.update({
      where: { id: resolvedParams.id },
      data: {
        name: body.name,
        doughBalls: body.doughBalls,
        ballWeight: body.ballWeight,
        hydration: body.hydration,
        salt: body.salt,
        yeast: body.yeast,
        oil: body.oil || null,
        diastaticMalt: body.diastaticMalt || null,
        poolish: body.poolish || null,
        flours: body.flours || [],
      },
    });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.recipe.delete({
      where: { id: resolvedParams.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
