import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type ProductRecord = any;

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (e) {}
}

async function readProducts(): Promise<ProductRecord[]> {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(txt) as ProductRecord[];
  } catch (err) {
    // fallback to data.ts products if file missing
    try {
      const mod = await import('../../../../data');
      const products = mod.products ?? [];
      // persist initial snapshot
      await writeProducts(products);
      return products;
    } catch (e) {
      return [];
    }
  }
}

async function writeProducts(list: ProductRecord[]) {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-z0-9.-]/gi, '_');
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const products = await readProducts();
  const p = products.find((x) => x.id === id);
  if (!p) {
    return NextResponse.json({ statusCode: 404, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(p);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ statusCode: 400, message: ['Content-Type must be multipart/form-data'], error: 'Bad Request' }, { status: 400 });
  }

  const formData = await req.formData();
  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json({ statusCode: 404, message: 'Product not found' }, { status: 404 });
  }

  const product = { ...products[idx] } as any;

  const setIf = (field: string, value: any) => {
    if (value !== undefined && value !== null) product[field] = value;
  };

  const maybe = (key: string) => {
    const v = formData.get(key);
    return v === null ? undefined : String(v);
  };

  // Update simple string fields
  const name = maybe('name');
  if (name !== undefined) setIf('name', name);

  const description = maybe('description');
  if (description !== undefined) setIf('description', description);

  const category_id = maybe('category_id');
  if (category_id !== undefined) setIf('category', category_id);

  const subcategory_id = formData.get('subcategory_id');
  if (subcategory_id !== null) {
    const s = String(subcategory_id);
    product.subcategory = s === '' ? undefined : s;
  }

  const subcategory_name = maybe('subcategory_name');
  if (subcategory_name !== undefined) setIf('subcategory_name', subcategory_name);

  const priceRaw = formData.get('price');
  if (priceRaw !== null) {
    const parsed = Number(String(priceRaw));
    if (!Number.isNaN(parsed)) product.price = parsed;
    else product.price = String(priceRaw);
  }

  const boolFields = [
    'is_variable_price',
    'is_available',
    'is_vegetarian',
    'is_spicy',
    'is_gluten_free',
    'is_chef_special',
    'is_recommended',
  ];
  for (const f of boolFields) {
    const v = formData.get(f);
    if (v !== null) {
      const s = String(v).toLowerCase();
      product[f.replace(/_/g, '')] = s === 'true' || s === '1' || s === 'on';
      // also support original snake case
      product[f] = s === 'true' || s === '1' || s === 'on';
    }
  }

  const prep = formData.get('preparation_time_minutes');
  if (prep !== null) {
    const n = Number(String(prep));
    if (!Number.isNaN(n)) product.preparation_time_minutes = n;
  }

  const displayOrder = formData.get('display_order');
  if (displayOrder !== null) {
    const n = Number(String(displayOrder));
    if (!Number.isNaN(n)) product.display_order = n;
  }

  // Image file
  const imageField = formData.get('image') as File | null;
  if (imageField && (imageField as any).size) {
    await ensureUploadsDir();
    try {
      const file = imageField as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = path.extname(file.name) || '.jpg';
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, fileName);
      await fs.writeFile(filePath, buffer);
      product.image = `/uploads/${fileName}`;
      product.image_url = `/uploads/${fileName}`;
    } catch (err) {
      console.error('Error saving image', err);
      return NextResponse.json({ statusCode: 500, message: 'Error saving image' }, { status: 500 });
    }
  }

  product.updatedAt = new Date().toISOString();
  products[idx] = product;
  await writeProducts(products);

  return NextResponse.json(product);
}
