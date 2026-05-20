import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipeUpdateSchema } from '@/lib/validation';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { bakes: { orderBy: { bakedAt: 'desc' } } },
    });
    if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('GET /api/recipes/[id]', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = RecipeUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const recipe = await prisma.recipe.update({ where: { id }, data: parsed.data as never });
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('PUT /api/recipes/[id]', error);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.recipe.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/recipes/[id]', error);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
