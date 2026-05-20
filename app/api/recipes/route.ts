import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipeCreateSchema } from '@/lib/validation';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: [{ isFavorite: 'desc' }, { updatedAt: 'desc' }],
      include: {
        _count: { select: { bakes: true } },
        bakes: { select: { rating: true } },
      },
    });
    const result = recipes.map((r) => {
      const ratings = r.bakes.map((b) => b.rating).filter((v): v is number => v !== null);
      const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
      return { ...r, bakeCount: r._count.bakes, avgRating, bakes: undefined, _count: undefined };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/recipes', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RecipeCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const recipe = await prisma.recipe.create({ data: parsed.data as never });
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('POST /api/recipes', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
