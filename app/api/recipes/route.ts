import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const recipe = await prisma.recipe.create({
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
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
