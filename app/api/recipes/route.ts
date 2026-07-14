import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipeCreateSchema } from '@/lib/validation';

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: [{ isFavorite: 'desc' }, { updatedAt: 'desc' }],
      select: {
        id: true,
        name: true,
        styleId: true,
        editionId: true,
        mode: true,
        doughBalls: true,
        ballWeight: true,
        hydration: true,
        isFavorite: true,
        updatedAt: true,
        _count: { select: { bakes: true } },
      },
    });
    // Average rating per recipe via a single groupBy aggregation instead of
    // shipping every bake's rating to the client.
    const ratings = await prisma.bake.groupBy({
      by: ['recipeId'],
      _avg: { rating: true },
      where: { recipeId: { in: recipes.map((r) => r.id) } },
    });
    const ratingMap = new Map(ratings.map((r) => [r.recipeId, r._avg.rating]));
    const result = recipes.map((r) => ({
      ...r,
      bakeCount: r._count.bakes,
      avgRating: ratingMap.get(r.id) ?? null,
      _count: undefined,
    }));
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
