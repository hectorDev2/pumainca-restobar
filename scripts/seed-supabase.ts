
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { products, categories as dataCategories } from '../data';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCategories() {
  console.log('Seeding Categories...');
  
  let categoriesToSeed = dataCategories;
  try {
     const jsonPath = path.join(process.cwd(), 'data', 'categories.json');
     const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
     categoriesToSeed = JSON.parse(jsonContent);
     console.log('Loaded categories from categories.json');
  } catch (e) {
     console.log('Using categories from data.ts');
  }

  for (const cat of categoriesToSeed) {
    const { id, name, description, imageUrl, displayOrder, subcategories } = cat as any;

    const { error: catError } = await supabase.from('categories').upsert({
      id,
      name,
      description,
      image_url: imageUrl || (cat as any).image,
      display_order: displayOrder || 0
    }, { onConflict: 'id' });

    if (catError) console.error(`Error inserting category ${name}:`, catError);
    else console.log(`Inserted category: ${name}`);

    // Insert Subcategories
    if (subcategories && Array.isArray(subcategories)) {
      for (const sub of subcategories) {
        const { id: subId, name: subName, description: subDesc } = sub;
        const { error: subError } = await supabase.from('subcategories').upsert({
          id: subId,
          category_id: id,
          name: subName,
          description: subDesc
        }, { onConflict: 'id' });
        
        if (subError) console.error(`Error inserting subcategory ${subName}:`, subError);
      }
    }
  }
}

async function seedProducts() {
  console.log('Seeding Products...');
  
  for (const prod of products) {
    const { id, name, description, image, category, subcategory, ingredients, allergens, isChefSpecial, isRecommended, isVegetarian, isSpicy, isGlutenFree, price } = prod;

    let finalPrice = 0;
    let isVariableToken = false;
    
    if (typeof price === 'number') {
      finalPrice = price;
    } else if (typeof price === 'object') {
       isVariableToken = true;
       const values = Object.values(price);
       finalPrice = values.length > 0 ? Number(Math.min(...values)) : 0;
    }

    const { error: prodError } = await supabase.from('products').upsert({
      id,
      name,
      description,
      image_url: image,
      category_id: category,
      subcategory_id: subcategory,
      price: finalPrice,
      is_variable_price: isVariableToken,
      is_chef_special: isChefSpecial,
      is_recommended: isRecommended,
      is_vegetarian: isVegetarian,
      is_spicy: isSpicy,
      is_gluten_free: isGlutenFree,
      is_available: true
    }, { onConflict: 'id' });

    if (prodError) {
      console.error(`Error inserting product ${name}:`, prodError);
      continue;
    }
    console.log(`Inserted product: ${name}`);

    if (isVariableToken && typeof price === 'object') {
       for (const [sizeName, startPrice] of Object.entries(price)) {
          const { error: priceError } = await supabase.from('product_prices').upsert({
             product_id: id,
             size_name: sizeName,
             price: Number(startPrice)
          }, { onConflict: 'product_id, size_name' });
          if (priceError) console.error(`Error inserting price for ${name} ${sizeName}:`, priceError);
       }
    }

    // Clean up old lists
    await supabase.from('product_ingredients').delete().eq('product_id', id);
    if (ingredients && Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        await supabase.from('product_ingredients').insert({
          product_id: id,
          ingredient_name: ing
        });
      }
    }

    await supabase.from('product_allergens').delete().eq('product_id', id);
    if (allergens && Array.isArray(allergens)) {
       for (const allg of allergens) {
         await supabase.from('product_allergens').insert({
           product_id: id,
           allergen_name: allg
         });
       }
    }
  }
}

async function main() {
  await seedCategories();
  await seedProducts();
}

main();
