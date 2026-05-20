import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BakeCreateSchema } from '@/lib/validation';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Ctx) {
  try {
    const { id: recipeId } = await params;
    const body = await request.json();
    const parsed = BakeCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const bake = await prisma.bake.create({
      data: { ...parsed.data, recipeId, bakedAt: new Date(parsed.data.bakedAt) } as never,
    });
    return NextResponse.json(bake, { status: 201 });
  } catch (error) {
    console.error('POST /api/recipes/[id]/bakes', error);
    return NextResponse.json({ error: 'Failed to log bake' }, { status: 500 });
  }
}
