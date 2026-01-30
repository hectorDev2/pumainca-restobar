#!/usr/bin/env node

/**
 * Script para generar iconos PWA en múltiples tamaños desde logo.png
 * 
 * Genera:
 * - Iconos normales: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
 * - Iconos maskable (con padding para Android adaptive icons): 192x192, 512x512
 * - Apple touch icon: 180x180
 * - Shortcuts icons: 96x96 para menú, reservas, carrito
 * 
 * Los iconos maskable tienen 20% de padding para la "safe zone" de Android
 */

import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const ICONS_DIR = join(PUBLIC_DIR, 'icons');
const SOURCE_LOGO = join(PUBLIC_DIR, 'logo.png');

// Tamaños de iconos PWA estándar
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Tamaños para iconos maskable (Android adaptive icons)
const MASKABLE_SIZES = [192, 512];

// Color de fondo para iconos (tu tema oscuro)
const BACKGROUND_COLOR = '#18181b';

async function generateIcons() {
  console.log('🎨 Generando iconos PWA...\n');

  try {
    // Crear directorio /public/icons si no existe
    await mkdir(ICONS_DIR, { recursive: true });
    console.log('✅ Directorio /public/icons creado\n');

    // Generar iconos normales
    console.log('📱 Generando iconos normales...');
    for (const size of ICON_SIZES) {
      await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: 'contain',
          background: BACKGROUND_COLOR
        })
        .png()
        .toFile(join(ICONS_DIR, `icon-${size}x${size}.png`));
      console.log(`  ✓ icon-${size}x${size}.png`);
    }

    // Generar iconos maskable (con padding del 20%)
    console.log('\n🤖 Generando iconos maskable (Android adaptive)...');
    for (const size of MASKABLE_SIZES) {
      const logoSize = Math.floor(size * 0.6); // 60% del tamaño total (20% padding en cada lado)
      const padding = Math.floor((size - logoSize) / 2);

      await sharp(SOURCE_LOGO)
        .resize(logoSize, logoSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: BACKGROUND_COLOR
        })
        .png()
        .toFile(join(ICONS_DIR, `icon-maskable-${size}x${size}.png`));
      console.log(`  ✓ icon-maskable-${size}x${size}.png`);
    }

    // Generar Apple Touch Icon (180x180 es el tamaño recomendado)
    console.log('\n🍎 Generando Apple Touch Icon...');
    await sharp(SOURCE_LOGO)
      .resize(180, 180, {
        fit: 'contain',
        background: BACKGROUND_COLOR
      })
      .png()
      .toFile(join(ICONS_DIR, 'apple-touch-icon.png'));
    console.log('  ✓ apple-touch-icon.png (180x180)');

    // Generar iconos para shortcuts (96x96)
    console.log('\n⚡ Generando iconos para shortcuts...');
    const shortcuts = [
      { name: 'menu', emoji: '📋' },
      { name: 'reservation', emoji: '📅' },
      { name: 'cart', emoji: '🛒' }
    ];

    for (const shortcut of shortcuts) {
      // Aquí simplemente copiamos el icono base
      // En producción podrías generar iconos personalizados con diferentes colores/símbolos
      await sharp(SOURCE_LOGO)
        .resize(96, 96, {
          fit: 'contain',
          background: BACKGROUND_COLOR
        })
        .png()
        .toFile(join(ICONS_DIR, `shortcut-${shortcut.name}.png`));
      console.log(`  ✓ shortcut-${shortcut.name}.png (96x96) ${shortcut.emoji}`);
    }

    // Generar favicon actualizado (32x32)
    console.log('\n🔖 Generando favicon...');
    await sharp(SOURCE_LOGO)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(join(PUBLIC_DIR, 'favicon-32x32.png'));
    console.log('  ✓ favicon-32x32.png');

    await sharp(SOURCE_LOGO)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(join(PUBLIC_DIR, 'favicon-16x16.png'));
    console.log('  ✓ favicon-16x16.png');

    console.log('\n✨ ¡Todos los iconos PWA generados exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`  • ${ICON_SIZES.length} iconos normales`);
    console.log(`  • ${MASKABLE_SIZES.length} iconos maskable`);
    console.log(`  • 1 Apple Touch Icon`);
    console.log(`  • ${shortcuts.length} iconos de shortcuts`);
    console.log(`  • 2 favicons\n`);

  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    process.exit(1);
  }
}

// Ejecutar
generateIcons();
