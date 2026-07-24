import os
import math
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw
import numpy as np

# Source images
hero_path = r'C:\Users\Gaming\.gemini\antigravity-ide\brain\41a875f9-5ccf-4768-8adf-cdc92fc8f431\trackhawk_hero_1784916327868.png'
dirty_path = r'C:\Users\Gaming\.gemini\antigravity-ide\brain\41a875f9-5ccf-4768-8adf-cdc92fc8f431\trackhawk_exterior_before_1784916341034.png'

hero_img = Image.open(hero_path).convert('RGB')
dirty_img = Image.open(dirty_path).convert('RGB')

assets_dir = r'c:\Users\Gaming\Desktop\Auto Detailin\src\assets'
public_dir = r'c:\Users\Gaming\Desktop\Auto Detailin\public'
os.makedirs(assets_dir, exist_ok=True)
os.makedirs(public_dir, exist_ok=True)

# Helper function to generate swirl marks pattern for "Paint Correction Before"
def generate_swirls(width, height):
    img = Image.new('L', (width, height), color=0)
    draw = ImageDraw.Draw(img)
    cx, cy = width // 2, height // 2
    # Draw radial arc swirls as if under an inspection light
    for r in range(20, min(width, height) // 2, 8):
        for angle in range(0, 360, 15):
            rad = math.radians(angle)
            x1 = cx + int(r * math.cos(rad))
            y1 = cy + int(r * math.sin(rad))
            x2 = cx + int((r + 25) * math.cos(rad + 0.3))
            y2 = cy + int((r + 25) * math.sin(rad + 0.3))
            draw.line([(x1, y1), (x2, y2)], fill=180, width=1)
    
    # Add spotlight glow in center
    glow = Image.new('L', (width, height), color=0)
    gdraw = ImageDraw.Draw(glow)
    for r in range(min(width, height) // 2, 0, -2):
        val = int(255 * (1 - r / (min(width, height) // 2)))
        gdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=val)
    
    swirls_arr = np.array(img).astype(float)
    glow_arr = np.array(glow).astype(float) / 255.0
    result = (swirls_arr * glow_arr).astype(np.uint8)
    return Image.fromarray(result)

# Helper to generate hydrophobic water beads pattern
def generate_beads(width, height):
    img = Image.new('RGBA', (width, height), color=(0,0,0,0))
    draw = ImageDraw.Draw(img)
    np.random.seed(42)
    for _ in range(350):
        bx = np.random.randint(10, width - 10)
        by = np.random.randint(10, height - 10)
        br = np.random.randint(3, 14)
        # Drop shadow
        draw.ellipse([bx - br + 1, by - br + 2, bx + br + 1, by + br + 2], fill=(0, 0, 0, 100))
        # Water drop body
        draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(220, 240, 255, 160), outline=(255, 255, 255, 220))
        # Specular highlight inside drop
        draw.ellipse([bx - br//2, by - br//2, bx - br//4, by - br//4], fill=(255, 255, 255, 240))
    return img

print("1. Generating main Hero and Public images...")
hero_img.save(os.path.join(assets_dir, 'hero.jpg'), quality=95)
hero_img.save(os.path.join(public_dir, 'hero.jpg'), quality=95)

# 2. Main gallery detail shots derived from the White Trackhawk
print("2. Generating Gallery Detail images (detail-1..4.jpg)...")

# Detail 1: Paint correction / fender polishing close-up
d1 = hero_img.crop((100, 300, 700, 800)).resize((1024, 1024), Image.Resampling.LANCZOS)
d1 = ImageEnhance.Contrast(d1).enhance(1.15)
d1 = ImageEnhance.Sharpness(d1).enhance(1.2)
d1.save(os.path.join(assets_dir, 'detail-1.jpg'), quality=95)

# Detail 2: Interior / Cockpit view close up
# Crop hood & windshield/interior view with luxury tone
d2 = hero_img.crop((320, 250, 800, 650)).resize((1024, 1024), Image.Resampling.LANCZOS)
d2 = ImageEnhance.Color(d2).enhance(0.9)
d2 = ImageEnhance.Brightness(d2).enhance(1.05)
d2.save(os.path.join(assets_dir, 'detail-2.jpg'), quality=95)

# Detail 3: Ceramic Coating close up on white Trackhawk front end
d3 = hero_img.crop((100, 380, 600, 750)).resize((1024, 1024), Image.Resampling.LANCZOS)
beads_overlay = generate_beads(1024, 1024)
d3_beaded = Image.alpha_composite(d3.convert('RGBA'), beads_overlay).convert('RGB')
d3_beaded.save(os.path.join(assets_dir, 'detail-3.jpg'), quality=95)

# Detail 4: Wheel & Brembo Caliper close-up
d4 = hero_img.crop((460, 480, 640, 680)).resize((1024, 1024), Image.Resampling.LANCZOS)
d4 = ImageEnhance.Sharpness(d4).enhance(1.3)
d4 = ImageEnhance.Contrast(d4).enhance(1.1)
d4.save(os.path.join(assets_dir, 'detail-4.jpg'), quality=95)

# 3. Generating public vehicle icons / previews (all white Trackhawk)
print("3. Updating public vehicle icons...")
# Crop centered vehicle on dark background for SUV, Sedan, Coupe, Van
veh_base = hero_img.crop((100, 250, 920, 750)).resize((800, 500), Image.Resampling.LANCZOS)
veh_base.save(os.path.join(public_dir, 'vehicle-suv.png'))
veh_base.save(os.path.join(public_dir, 'vehicle-sedan.png'))
veh_base.save(os.path.join(public_dir, 'vehicle-coupe.png'))
veh_base.save(os.path.join(public_dir, 'vehicle-van.png'))

# 4. Generating Before & After Pairs for all categories
print("4. Generating Before & After pairs...")

ba_dir = os.path.join(assets_dir, 'before_after')
os.makedirs(ba_dir, exist_ok=True)

# --- Category 1: Außenreinigung (Exterior Wash & Detailing) ---
# Lack & Karosserie
dirty_img.resize((1024, 1024), Image.Resampling.LANCZOS).save(os.path.join(ba_dir, 'exterior_body_before.jpg'), quality=92)
hero_img.save(os.path.join(ba_dir, 'exterior_body_after.jpg'), quality=92)

# Felgen & Reifen (Wheel & Tire cleaning)
wheel_after = d4.copy()
# Wheel before: add brake dust, dirt, dull yellow caliper
wheel_before_arr = np.array(wheel_after).astype(float)
# Darken and add brownish brake dust tint
wheel_before_arr[:, :, 0] *= 0.6  # R
wheel_before_arr[:, :, 1] *= 0.55 # G
wheel_before_arr[:, :, 2] *= 0.5  # B
# Add noise dust
dust_noise = np.random.normal(0, 15, wheel_before_arr.shape)
wheel_before_arr = np.clip(wheel_before_arr + dust_noise, 0, 255).astype(np.uint8)
wheel_before = Image.fromarray(wheel_before_arr).filter(ImageFilter.GaussianBlur(0.6))

wheel_before.save(os.path.join(ba_dir, 'wheel_before.jpg'), quality=92)
wheel_after.save(os.path.join(ba_dir, 'wheel_after.jpg'), quality=92)

# Scheinwerfer (Headlight detailing)
headlight_after = hero_img.crop((110, 410, 490, 520)).resize((1024, 600), Image.Resampling.LANCZOS)
# Headlight before: yellowed, oxidized lens
hl_before_arr = np.array(headlight_after).astype(float)
hl_before_arr[:, :, 0] *= 1.1 # yellow tint (R)
hl_before_arr[:, :, 1] *= 1.05 # G
hl_before_arr[:, :, 2] *= 0.65 # blue dropped
hl_before_arr = np.clip(hl_before_arr, 0, 255).astype(np.uint8)
headlight_before = Image.fromarray(hl_before_arr).filter(ImageFilter.GaussianBlur(1.8))

headlight_before.save(os.path.join(ba_dir, 'headlight_before.jpg'), quality=92)
headlight_after.save(os.path.join(ba_dir, 'headlight_after.jpg'), quality=92)

# --- Category 2: Lackkorrektur (Paint Correction) ---
# Kratzer & Swirl-Marks
paint_after = hero_img.crop((200, 350, 600, 550)).resize((1024, 600), Image.Resampling.LANCZOS)
swirls = generate_swirls(1024, 600)
paint_before_arr = np.array(paint_after).astype(float)
swirl_mask = np.array(swirls).astype(float) / 255.0
for c in range(3):
    paint_before_arr[:, :, c] = paint_before_arr[:, :, c] * (1 - swirl_mask * 0.4) + 220 * swirl_mask * 0.4
paint_before = Image.fromarray(np.clip(paint_before_arr, 0, 255).astype(np.uint8))

paint_before.save(os.path.join(ba_dir, 'paint_swirls_before.jpg'), quality=92)
paint_after.save(os.path.join(ba_dir, 'paint_swirls_after.jpg'), quality=92)

# Oxidation
ox_after = d1.crop((100, 100, 900, 600)).resize((1024, 600), Image.Resampling.LANCZOS)
ox_before = ImageEnhance.Contrast(ox_after).enhance(0.5)
ox_before = ImageEnhance.Brightness(ox_before).enhance(0.85)
ox_before = ox_before.filter(ImageFilter.GaussianBlur(1.5))
ox_before.save(os.path.join(ba_dir, 'paint_ox_before.jpg'), quality=92)
ox_after.save(os.path.join(ba_dir, 'paint_ox_after.jpg'), quality=92)

# --- Category 3: Keramikversiegelung (Ceramic Coating) ---
# Hydrophob-Effekt
coating_after = d3_beaded.crop((100, 100, 900, 600)).resize((1024, 600), Image.Resampling.LANCZOS)
coating_before = d3.crop((100, 100, 900, 600)).resize((1024, 600), Image.Resampling.LANCZOS)
coating_before = ImageEnhance.Contrast(coating_before).enhance(0.8)

coating_before.save(os.path.join(ba_dir, 'ceramic_beads_before.jpg'), quality=92)
coating_after.save(os.path.join(ba_dir, 'ceramic_beads_after.jpg'), quality=92)

# Hochglanz
gloss_after = hero_img.crop((50, 200, 950, 750)).resize((1024, 600), Image.Resampling.LANCZOS)
gloss_before = ImageEnhance.Color(gloss_after).enhance(0.7)
gloss_before = ImageEnhance.Contrast(gloss_before).enhance(0.75)
gloss_before.save(os.path.join(ba_dir, 'ceramic_gloss_before.jpg'), quality=92)
gloss_after.save(os.path.join(ba_dir, 'ceramic_gloss_after.jpg'), quality=92)

# --- Category 4: Motorraumreinigung (Engine Bay Cleaning) ---
engine_after = hero_img.crop((250, 360, 550, 520)).resize((1024, 600), Image.Resampling.LANCZOS)
engine_after = ImageEnhance.Sharpness(engine_after).enhance(1.4)
engine_after = ImageEnhance.Contrast(engine_after).enhance(1.2)

# Engine before: dirty oil grime overlay
eng_arr = np.array(engine_after).astype(float)
eng_arr[:, :, 0] *= 0.7
eng_arr[:, :, 1] *= 0.65
eng_arr[:, :, 2] *= 0.55
noise = np.random.normal(0, 20, eng_arr.shape)
eng_arr = np.clip(eng_arr + noise, 0, 255).astype(np.uint8)
engine_before = Image.fromarray(eng_arr).filter(ImageFilter.GaussianBlur(1.0))

engine_before.save(os.path.join(ba_dir, 'engine_before.jpg'), quality=92)
engine_after.save(os.path.join(ba_dir, 'engine_after.jpg'), quality=92)

# --- Category 5: Innenreinigung (Interior Detailing) ---
interior_after = d2.crop((100, 100, 900, 600)).resize((1024, 600), Image.Resampling.LANCZOS)
interior_after = ImageEnhance.Contrast(interior_after).enhance(1.15)

int_arr = np.array(interior_after).astype(float)
int_arr *= 0.75
int_noise = np.random.normal(0, 12, int_arr.shape)
int_arr = np.clip(int_arr + int_noise, 0, 255).astype(np.uint8)
interior_before = Image.fromarray(int_arr).filter(ImageFilter.GaussianBlur(0.8))

interior_before.save(os.path.join(ba_dir, 'interior_before.jpg'), quality=92)
interior_after.save(os.path.join(ba_dir, 'interior_after.jpg'), quality=92)

print("SUCCESS: All White Jeep Trackhawk assets generated successfully!")
