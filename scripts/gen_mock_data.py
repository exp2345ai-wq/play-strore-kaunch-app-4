#!/usr/bin/env python3
"""
Mock data generator for ShopX Elite Pro Max.

Emits TypeScript files under src/data/* with deterministic, beautiful sample
data. Run with `python3 scripts/gen_mock_data.py`. Files are overwritten
in place. The output is deterministic — running multiple times yields
identical files (random seeded).
"""

from __future__ import annotations

import json
import os
import random
import textwrap
from pathlib import Path
from typing import List, Tuple

random.seed(424242)

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Static seed data
# ---------------------------------------------------------------------------

CATEGORY_SEEDS = [
    {
        "slug": "fashion",
        "name": "Fashion & Apparel",
        "tagline": "Drop-shoulder energy, runway prices.",
        "description": "Curated streetwear, athleisure, ethnic, formals & bold accessories from 200+ designers.",
        "emoji": "👗",
        "iconColor": "#FF6FA5",
        "gradient": ("#FF7AD9", "#9C5BFF"),
        "subcats": ["Sneakers", "T-Shirts", "Dresses", "Denim", "Accessories", "Watches", "Bags", "Sunglasses"],
        "brands": ["Aurora", "Vortex Co.", "Lumen Atelier", "Kindred Threads", "Northstar", "MoonRift"],
    },
    {
        "slug": "electronics",
        "name": "Electronics & Gadgets",
        "tagline": "Mind-bending tech, jaw-dropping discounts.",
        "description": "Latest smartphones, audio, laptops, smart home devices, and creator gear.",
        "emoji": "📱",
        "iconColor": "#5BC0FF",
        "gradient": ("#48C6EF", "#6F86D6"),
        "subcats": ["Smartphones", "Headphones", "Laptops", "Tablets", "Smart Watches", "Cameras", "Speakers", "Gaming"],
        "brands": ["NeonByte", "AcousticOne", "OrbitTech", "Quartz Labs", "CircuitMint"],
    },
    {
        "slug": "home-living",
        "name": "Home & Living",
        "tagline": "Cozy upgrades, designer details.",
        "description": "Decor, furniture, kitchenware, lighting and plants for every aesthetic.",
        "emoji": "🛋️",
        "iconColor": "#3DD598",
        "gradient": ("#A8E6CF", "#3DD598"),
        "subcats": ["Decor", "Furniture", "Kitchen", "Lighting", "Bedding", "Plants", "Storage", "Bath"],
        "brands": ["HygWare", "Casa Lumen", "RootHaus", "Linen Republic"],
    },
    {
        "slug": "beauty",
        "name": "Beauty & Personal Care",
        "tagline": "Glow loud, save quiet.",
        "description": "Skincare, makeup, fragrance, haircare and grooming from clean indie brands.",
        "emoji": "💄",
        "iconColor": "#FF8FA3",
        "gradient": ("#FFC1CC", "#FF6FA5"),
        "subcats": ["Skincare", "Makeup", "Fragrance", "Haircare", "Grooming", "Tools", "Wellness", "Bath & Body"],
        "brands": ["Petal & Pulse", "GlowVault", "Dusk Beauty", "Rituel"],
    },
    {
        "slug": "sports",
        "name": "Sports & Outdoors",
        "tagline": "Train hard, save harder.",
        "description": "Running gear, gym essentials, cycling, yoga, hiking and team sports.",
        "emoji": "🏋️",
        "iconColor": "#FFC857",
        "gradient": ("#FFD27F", "#FF8C42"),
        "subcats": ["Running", "Yoga", "Gym", "Cycling", "Hiking", "Team Sports", "Swimming", "Apparel"],
        "brands": ["Stride Co.", "PulseLoop", "TrailKind", "Apex Athletics"],
    },
    {
        "slug": "books",
        "name": "Books & Comics",
        "tagline": "Your next obsession in 2 days.",
        "description": "Literary fiction, manga, self-help, sci-fi, technical, and rare imports.",
        "emoji": "📚",
        "iconColor": "#A877FF",
        "gradient": ("#C2A4FF", "#7D5FFF"),
        "subcats": ["Fiction", "Manga", "Self-Help", "Tech", "Comics", "Children", "Biography", "Poetry"],
        "brands": ["Inkwell", "Polaroid Press", "Constellation Co."],
    },
    {
        "slug": "toys",
        "name": "Toys & Hobbies",
        "tagline": "Tiny humans deserve big things.",
        "description": "Educational toys, building sets, plushies, RC, board games and collectibles.",
        "emoji": "🧸",
        "iconColor": "#FF9E6E",
        "gradient": ("#FFB8A2", "#FF7E5F"),
        "subcats": ["Plushies", "Building", "Board Games", "Puzzles", "RC", "Outdoor", "STEM", "Collectibles"],
        "brands": ["BrickyVerse", "Plushlab", "MiniBrains"],
    },
    {
        "slug": "grocery",
        "name": "Grocery & Gourmet",
        "tagline": "Pantry essentials in 60 minutes.",
        "description": "Pantry staples, snacks, gourmet finds, breakfast, beverages and chocolate.",
        "emoji": "🛒",
        "iconColor": "#3DD598",
        "gradient": ("#7FE5A0", "#1FA66E"),
        "subcats": ["Snacks", "Beverages", "Breakfast", "Pantry", "Chocolate", "Coffee", "Tea", "Healthy"],
        "brands": ["NutriHive", "BloomLeaf", "Forge & Fern"],
    },
    {
        "slug": "jewelry",
        "name": "Jewelry & Watches",
        "tagline": "Heirlooms-in-the-making.",
        "description": "Lab-grown diamonds, gold, silver, vintage and minimalist jewelry.",
        "emoji": "💎",
        "iconColor": "#FFD27F",
        "gradient": ("#FFE9A8", "#E0B65C"),
        "subcats": ["Rings", "Necklaces", "Earrings", "Bracelets", "Watches", "Anklets", "Brooches", "Sets"],
        "brands": ["Aureate", "Lumen Atelier", "Maison Halo"],
    },
    {
        "slug": "automotive",
        "name": "Automotive",
        "tagline": "From keychains to kits.",
        "description": "Accessories, care kits, infotainment, riding gear and OEM-grade parts.",
        "emoji": "🚗",
        "iconColor": "#5BC0FF",
        "gradient": ("#7E96FF", "#3D6BFF"),
        "subcats": ["Care", "Audio", "Riding", "Tools", "Lighting", "Interior", "Exterior", "Tyres"],
        "brands": ["Throttle Lab", "Helmet Republic", "Polish Studio"],
    },
    {
        "slug": "pet-care",
        "name": "Pet Care",
        "tagline": "Little furballs, big personalities.",
        "description": "Food, treats, toys, grooming, beds and travel for dogs, cats and small pets.",
        "emoji": "🐾",
        "iconColor": "#FFA17A",
        "gradient": ("#FFC1A1", "#FF6E5C"),
        "subcats": ["Dog Food", "Cat Food", "Toys", "Grooming", "Beds", "Health", "Travel", "Treats"],
        "brands": ["WhiskerLabs", "PawCloud", "Feather & Fern"],
    },
    {
        "slug": "stationery",
        "name": "Stationery & Office",
        "tagline": "Your desk, but make it tasteful.",
        "description": "Pens, planners, papers, ink, washi and paper goods curated by stationery nerds.",
        "emoji": "✒️",
        "iconColor": "#A877FF",
        "gradient": ("#C2A4FF", "#7D5FFF"),
        "subcats": ["Pens", "Planners", "Notebooks", "Paper", "Ink", "Washi", "Storage", "Desk"],
        "brands": ["Loom Paper", "Quartz Labs", "Polaroid Press"],
    },
]

ADJECTIVES = [
    "Aurora", "Crimson", "Velvet", "Cosmic", "Lunar", "Silken", "Marble",
    "Glacier", "Ember", "Solstice", "Vortex", "Halcyon", "Onyx", "Saffron",
    "Cyclone", "Mirage", "Polaris", "Nebula", "Quartz", "Cipher", "Ivory",
    "Indigo", "Coral", "Ember", "Frost", "Twilight", "Halo", "Stellar",
    "Echo", "Pulse",
]

NOUNS = [
    "Glide", "Drift", "Pulse", "Aurora", "Atlas", "Quill", "Loft", "Flux",
    "Comet", "Lens", "Orbit", "Nebula", "Bloom", "Vista", "Form", "Flow",
    "Foundry", "Studio", "Halo", "Echo", "Waver", "Voyager", "Aero", "Loom",
    "Codex", "Lumen", "Zenith", "Mosaic",
]

PRODUCT_TEMPLATES_PER_CATEGORY = {
    "fashion": [
        ("{adj} {noun} Sneakers", "Cushioned every step from sunrise commute to evening rooftops."),
        ("{adj} {noun} Hoodie", "Brushed-fleece interior, drop-shoulder cut, rib-knit cuffs."),
        ("{adj} {noun} Tee", "Premium combed cotton in a relaxed fit that just works."),
        ("{adj} {noun} Joggers", "4-way stretch, tapered hem, hidden zipper pockets."),
        ("{adj} {noun} Tote", "Buttery vegan leather with magnetic snap closure."),
        ("{adj} {noun} Jacket", "Wind-resistant outer, recycled polyfill, modular hood."),
        ("{adj} {noun} Watch", "316L steel case, sapphire crystal, 100m water resistance."),
        ("{adj} {noun} Belt", "Reversible Italian leather with brushed buckle."),
        ("{adj} {noun} Cap", "6-panel structured crown with curved bill and brass buckle."),
        ("{adj} {noun} Wallet", "RFID-blocking, 8 card slots, ultra-thin profile."),
    ],
    "electronics": [
        ("{adj} {noun} Earbuds Pro", "ANC + transparency, 9h playback, multipoint Bluetooth."),
        ("{adj} {noun} Smartphone", "120Hz OLED, computational triple cam, 6000mAh."),
        ("{adj} {noun} Laptop 14", "M-class chip, 18h battery, 14\" tandem OLED."),
        ("{adj} {noun} Smart Watch", "AMOLED, ECG, SpO₂, 14-day battery, 100+ workouts."),
        ("{adj} {noun} Tablet", "11\" 120Hz, stylus, dual-orientation magnetic keyboard."),
        ("{adj} {noun} Speaker", "Hi-Res audio, omnidirectional, 24h battery, IP67."),
        ("{adj} {noun} Mirrorless Camera", "26MP stacked sensor, 8K30, in-body stabilization."),
        ("{adj} {noun} Power Bank", "20,000mAh, 100W PD, 4 ports, MagSafe-ready."),
        ("{adj} {noun} Drone Mini", "4K HDR, 38min flight, AI subject tracking."),
        ("{adj} {noun} Mechanical Keyboard", "Hot-swap, gasket mount, doubleshot PBT keycaps."),
    ],
    "home-living": [
        ("{adj} {noun} Lamp", "Stoneware base, dimmable warm-white LED, fabric shade."),
        ("{adj} {noun} Sofa", "Pebble bouclé, hardwood frame, deep modular seating."),
        ("{adj} {noun} Dinner Set", "16-piece glazed stoneware, chip-resistant, dishwasher safe."),
        ("{adj} {noun} Throw Blanket", "OEKO-TEX cotton chenille, fringed edge, 130×170cm."),
        ("{adj} {noun} Wall Art", "Giclée print, museum-quality archival paper."),
        ("{adj} {noun} Diffuser", "Whisper-quiet ultrasonic, 12h runtime, ambient light."),
        ("{adj} {noun} Bookshelf", "Solid oak, hidden cable channel, 5 adjustable shelves."),
        ("{adj} {noun} Bedding Set", "400TC sateen organic cotton, button closure."),
        ("{adj} {noun} Planter", "Speckled ceramic with drainage tray and cork base."),
        ("{adj} {noun} Mirror", "Arched frameless, polished bevel, mounting hardware."),
    ],
    "beauty": [
        ("{adj} {noun} Serum", "Niacinamide 10% + zinc, fragrance-free, cruelty-free."),
        ("{adj} {noun} Moisturizer", "Ceramide-rich barrier cream, lightweight finish."),
        ("{adj} {noun} Cleanser", "Sulfate-free gel-to-foam, balanced pH, mild fragrance."),
        ("{adj} {noun} Lipstick", "Buttery satin finish, 10h wear, lasered in 12 shades."),
        ("{adj} {noun} Perfume", "Top: bergamot. Heart: jasmine. Base: amber & cedar."),
        ("{adj} {noun} Hair Mask", "Repairing keratin treatment for chemical-treated hair."),
        ("{adj} {noun} Sunscreen", "SPF 50+ PA++++, no white cast, fragrance-free."),
        ("{adj} {noun} Eye Cream", "Caffeine + peptides, depuffs in two minutes flat."),
        ("{adj} {noun} Body Lotion", "Shea + squalane, 24h hydration, dewy finish."),
        ("{adj} {noun} Toner", "Hydrating essence with PHA + niacinamide."),
    ],
    "sports": [
        ("{adj} {noun} Running Shoe", "Carbon plate, super-foam stack, marathon-tested."),
        ("{adj} {noun} Yoga Mat", "Natural rubber, 6mm, double-sided alignment grid."),
        ("{adj} {noun} Dumbbells 10kg", "Rubberized hex, knurled chrome handle, set of 2."),
        ("{adj} {noun} Bike Helmet", "MIPS, in-mold construction, 24 vents."),
        ("{adj} {noun} Trail Pack 22L", "AirFlex back panel, hydration sleeve, raincover."),
        ("{adj} {noun} Football", "Match-grade thermal-bonded panels, FIFA approved."),
        ("{adj} {noun} Goggles", "Anti-fog, mirrored, racing fit, low-profile."),
        ("{adj} {noun} Track Jacket", "4-way stretch, water-repellent, reflective hits."),
        ("{adj} {noun} Resistance Set", "5-band kit with door anchor, ankle straps & guide."),
        ("{adj} {noun} Smart Scale", "13 metrics, 4-electrode bioimpedance, Bluetooth."),
    ],
    "books": [
        ("{adj} {noun} (Novel)", "A genre-defying novel about found family and quiet courage."),
        ("{adj} {noun} Manga Vol. 1", "First arc collected with bonus art and translator notes."),
        ("{adj} {noun}: A Memoir", "Tender, funny essays from a generational voice."),
        ("{adj} {noun} (Hardcover)", "Limited foiled hardcover with sprayed edges."),
        ("{adj} {noun} for Builders", "An opinionated handbook for shipping software at scale."),
        ("{adj} {noun} (Box Set)", "Trilogy plus exclusive map and reading guide."),
        ("{adj} {noun} for Children", "Lush full-page art for nightly read-alouds."),
        ("{adj} {noun} Poetry", "108 poems on belonging, longing, and lemons."),
        ("{adj} {noun} Cookbook", "120 weeknight recipes from a Michelin alum."),
        ("{adj} {noun} Workbook", "Guided exercises for habit-stacking and rest."),
    ],
    "toys": [
        ("{adj} {noun} Plush", "Heirloom-quality plush with weighted base."),
        ("{adj} {noun} Building Set", "1,200-piece architecture set with display plate."),
        ("{adj} {noun} Board Game", "20–60 minute cooperative deck-builder, 1–4 players."),
        ("{adj} {noun} Puzzle 1000pc", "Linen-finish jigsaw printed on FSC-certified board."),
        ("{adj} {noun} Drone Mini Kit", "Beginner-friendly DIY drone with auto-stabilization."),
        ("{adj} {noun} Magnetic Tiles", "100-piece set, beveled edges, math-pattern guide."),
        ("{adj} {noun} Story Cube", "9-faced storytelling cube set with prompt cards."),
        ("{adj} {noun} Coding Robot", "Drag-and-drop coding, line follower & maze modes."),
        ("{adj} {noun} Plush Backpack", "Soft-shell, harness clip, washable lining."),
        ("{adj} {noun} STEM Lab", "12 chemistry experiments, lab notebook, goggles."),
    ],
    "grocery": [
        ("{adj} {noun} Granola", "Slow-baked with maple, almonds and tart cherries."),
        ("{adj} {noun} Cold Brew", "Single-origin, 200mg caffeine, lightly sweet."),
        ("{adj} {noun} Pasta Pack", "Bronze-die durum semolina, hearty bite."),
        ("{adj} {noun} Hot Sauce", "Aged habanero, fermented 90 days, bright finish."),
        ("{adj} {noun} Trail Mix", "Slow-roasted nuts, crystallized ginger, cacao nibs."),
        ("{adj} {noun} Olive Oil", "Cold-pressed, single-estate, peppery first-press."),
        ("{adj} {noun} Chocolate Bar", "70% single-origin, ethically sourced cacao."),
        ("{adj} {noun} Tea Box", "12 single-origin teas with origin booklet."),
        ("{adj} {noun} Coffee Beans", "Medium roast, washed process, tasting notes inside."),
        ("{adj} {noun} Spice Set", "10 origin-labeled spices in glass jars."),
    ],
    "jewelry": [
        ("{adj} {noun} Solitaire Ring", "Lab-grown 1ct, 14k recycled gold, IGI certified."),
        ("{adj} {noun} Pendant", "Sterling silver with freshwater pearl drop."),
        ("{adj} {noun} Hoop Earrings", "14k gold-fill 25mm, hypoallergenic, lifetime warranty."),
        ("{adj} {noun} Tennis Bracelet", "Handset moissanite line, secure double clasp."),
        ("{adj} {noun} Watch", "Mother-of-pearl dial, sapphire crystal, 36mm."),
        ("{adj} {noun} Anklet", "14k gold-fill paperclip chain with charm."),
        ("{adj} {noun} Choker", "Adjustable curb chain in vermeil gold."),
        ("{adj} {noun} Stud Set", "3-pair set in sleek presentation box."),
        ("{adj} {noun} Cufflinks", "Brushed stainless steel with onyx inlay."),
        ("{adj} {noun} Bridal Set", "Three-piece bridal stack in lab-grown stones."),
    ],
    "automotive": [
        ("{adj} {noun} Riding Helmet", "Full-face, fiberglass shell, DOT/ECE certified."),
        ("{adj} {noun} Polish Kit", "5-step ceramic-coat car detail kit."),
        ("{adj} {noun} Dash Cam", "4K front + 1080p rear, parking surveillance."),
        ("{adj} {noun} Floor Mats", "Custom-fit weather mats with raised edges."),
        ("{adj} {noun} Tyre Inflator", "Smart pre-set PSI, OLED display, USB-C."),
        ("{adj} {noun} Phone Mount", "Magnetic vent mount, 360° rotation."),
        ("{adj} {noun} Toolkit 142pc", "Chrome-vanadium socket set in blow-molded case."),
        ("{adj} {noun} Vacuum", "Cordless car vacuum, HEPA filter, 30min runtime."),
        ("{adj} {noun} Riding Gloves", "Knuckle armor, touchscreen tips, breathable mesh."),
        ("{adj} {noun} Wax Polish", "Synthetic carnauba blend, 6-month protection."),
    ],
    "pet-care": [
        ("{adj} {noun} Dog Food", "Grain-free, real chicken first ingredient."),
        ("{adj} {noun} Cat Tower", "5-tier sisal scratching tower with dome bed."),
        ("{adj} {noun} Treat Pack", "Single-protein treats with no fillers."),
        ("{adj} {noun} Plush Dog Bed", "Memory-foam orthopedic with washable cover."),
        ("{adj} {noun} Carrier", "Airline-approved, breathable mesh, padded strap."),
        ("{adj} {noun} Brush", "Self-cleaning slicker with quick-release button."),
        ("{adj} {noun} Tag", "Engraved stainless ID tag with QR code."),
        ("{adj} {noun} Litter", "Clumping, low-dust, multi-cat formula."),
        ("{adj} {noun} Harness", "No-pull design with reflective stitching."),
        ("{adj} {noun} Catnip Toys", "Set of 6 organic catnip plushies."),
    ],
    "stationery": [
        ("{adj} {noun} Fountain Pen", "EF nib, brass body, magnetic cap, gift box."),
        ("{adj} {noun} Daily Planner", "12-month undated, daily/weekly/monthly spreads."),
        ("{adj} {noun} Notebook A5", "Tomoé River paper, 240 pages, dot-grid."),
        ("{adj} {noun} Ink Bottle 30ml", "Shimmer ink with subtle gold sheen."),
        ("{adj} {noun} Washi Set", "10 rolls of premium washi, illustrated card."),
        ("{adj} {noun} Pencil Case", "Stand-up vegan leather case with brass zip."),
        ("{adj} {noun} Highlighter Set", "Pastel chisel-tip highlighters, set of 6."),
        ("{adj} {noun} Stamp Set", "16 wooden stamps with ink pad and storage tin."),
        ("{adj} {noun} Sticker Book", "100 vinyl stickers with reusable pages."),
        ("{adj} {noun} Desk Pad", "Two-tone vegan leather desk mat, 80×40cm."),
    ],
}

CURRENCIES = ["INR"]


def slugify(s: str) -> str:
    out = []
    for ch in s.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in (" ", "-", "_"):
            out.append("-")
    s2 = "".join(out)
    while "--" in s2:
        s2 = s2.replace("--", "-")
    return s2.strip("-")


def emit_categories() -> List[dict]:
    cats = []
    for i, c in enumerate(CATEGORY_SEEDS):
        slug = c["slug"]
        subcats = []
        for j, sub in enumerate(c["subcats"]):
            subcats.append(
                {
                    "id": f"sub-{slug}-{j+1}",
                    "name": sub,
                    "slug": slugify(f"{slug}-{sub}"),
                    "productCount": 24 + (i * 7 + j * 3) % 50,
                    "thumbnail": f"https://picsum.photos/seed/{slugify(slug + '-' + sub)}/600/400",
                }
            )
        cats.append(
            {
                "id": f"cat-{slug}",
                "slug": slug,
                "name": c["name"],
                "tagline": c["tagline"],
                "description": c["description"],
                "emoji": c["emoji"],
                "iconColor": c["iconColor"],
                "gradient": list(c["gradient"]),
                "productCount": 220 + i * 13,
                "trending": i % 2 == 0,
                "bannerImage": f"https://picsum.photos/seed/banner-{slug}/1200/600",
                "thumbnail": f"https://picsum.photos/seed/thumb-{slug}/600/400",
                "subcategories": subcats,
                "popularBrands": c["brands"],
                "averagePrice": {"amount": 1499 + i * 250, "currency": "INR"},
                "totalReviews": 14000 + i * 1850,
            }
        )
    return cats


def emit_brands(categories: List[dict]) -> List[dict]:
    brand_set = set()
    for c in categories:
        for b in c["popularBrands"]:
            brand_set.add(b)
    out = []
    for i, b in enumerate(sorted(brand_set)):
        out.append(
            {
                "id": f"brand-{slugify(b)}",
                "name": b,
                "slug": slugify(b),
                "description": f"{b} crafts modern essentials with timeless detail. Founded by a tight-knit team obsessed with materials, longevity and quiet design.",
                "logo": f"https://picsum.photos/seed/logo-{slugify(b)}/200/200",
                "rating": round(4.2 + (i % 7) * 0.08, 2),
                "productCount": 18 + (i * 5) % 90,
                "founded": 1998 + (i % 26),
                "origin": ["IN", "US", "DK", "JP", "DE", "IT"][i % 6],
                "premium": i % 3 == 0,
            }
        )
    return out


def emit_products(categories: List[dict], brands: List[dict]) -> List[dict]:
    products: List[dict] = []
    counter = 0
    for cat in categories:
        templates = PRODUCT_TEMPLATES_PER_CATEGORY[cat["slug"]]
        for sub in cat["subcategories"]:
            # ~3 products per subcategory => 12 cats × 8 subs × ~3 = ~288 products
            for k in range(3):
                tpl_title, tpl_desc = templates[(counter + k) % len(templates)]
                adj = ADJECTIVES[(counter * 3 + k) % len(ADJECTIVES)]
                noun = NOUNS[(counter * 7 + k) % len(NOUNS)]
                title = tpl_title.format(adj=adj, noun=noun)
                brand = cat["popularBrands"][(counter + k) % len(cat["popularBrands"])]
                brand_id = f"brand-{slugify(brand)}"
                base_price = 499 + ((counter * 173) % 28000)
                discount = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65][counter % 12]
                price = round(base_price * (100 - discount) / 100)
                pid = f"prod-{cat['slug']}-{sub['id']}-{k+1}"
                seed = slugify(pid)
                images = [
                    f"https://picsum.photos/seed/{seed}-{i}/800/800" for i in range(6)
                ]
                variants = build_variants(cat["slug"], counter)
                specs = build_specs(cat["slug"], title, brand)
                highlights = [
                    f"Premium {sub['name'].lower()} engineered for everyday use.",
                    "Free express shipping & 30-day no-questions returns.",
                    f"Certified by {brand} quality labs and 14k+ reviewers.",
                    "Eco-conscious packaging — recyclable, plastic-free.",
                    "Lifetime support and replaceable parts where possible.",
                ]
                tags = [
                    cat["slug"],
                    sub["slug"],
                    slugify(brand),
                    "trending" if counter % 5 == 0 else "new",
                    "bestseller" if counter % 7 == 0 else "featured",
                    f"under-{((price // 500) + 1) * 500}",
                ]
                products.append(
                    {
                        "id": pid,
                        "sku": f"SKU-{counter+1000:05d}",
                        "title": title,
                        "subtitle": tpl_desc,
                        "description": tpl_desc,
                        "longDescription": (
                            f"Meet the {title} — a thoughtfully designed {sub['name'].lower()} from {brand}. "
                            f"{tpl_desc} We obsessed over every detail, from the precision-cut materials to the "
                            f"hand-finished surface, so it feels as good in week 1 as it does in year 3. "
                            f"Tested across 14 climates, 480 wearers and 12 use-cases, this {title.split(' ')[-1].lower()} "
                            f"is built for the people who notice details and value craft. Pair it with the rest of "
                            f"the {brand} family for a full-stack lifestyle upgrade."
                        ),
                        "brand": brand,
                        "brandId": brand_id,
                        "categoryId": cat["id"],
                        "subcategoryId": sub["id"],
                        "price": {"amount": price, "currency": "INR"},
                        "originalPrice": {"amount": base_price, "currency": "INR"},
                        "discountPercent": discount,
                        "rating": round(3.8 + ((counter * 17) % 12) / 10, 2),
                        "reviewCount": 124 + (counter * 41) % 9000,
                        "images": images,
                        "thumbnail": images[0],
                        "variants": variants,
                        "specs": specs,
                        "highlights": highlights,
                        "tags": tags,
                        "inStock": (counter % 13) != 0,
                        "stockCount": 4 + (counter * 9) % 240,
                        "trending": counter % 5 == 0,
                        "bestseller": counter % 7 == 0,
                        "featured": counter % 6 == 0,
                        "newArrival": counter % 4 == 0,
                        "freeShipping": counter % 3 != 0,
                        "returnable": counter % 11 != 0,
                        "warrantyMonths": [3, 6, 12, 24, 36][counter % 5],
                        "deliveryEta": ["Tomorrow", "2 days", "3 days", "Same day", "4 days"][counter % 5],
                        "createdAt": f"2024-{((counter % 12) + 1):02d}-{((counter % 27) + 1):02d}T10:00:00Z",
                        "updatedAt": f"2024-{((counter % 12) + 1):02d}-{((counter % 27) + 1):02d}T11:00:00Z",
                    }
                )
                counter += 1
    return products


def build_variants(slug: str, counter: int) -> List[dict]:
    sizes_per_cat = {
        "fashion": ("size", ["XS", "S", "M", "L", "XL", "XXL"]),
        "sports": ("size", ["S", "M", "L", "XL"]),
        "beauty": ("size", ["30ml", "50ml", "100ml"]),
        "grocery": ("size", ["250g", "500g", "1kg"]),
        "books": ("material", ["Paperback", "Hardcover", "eBook"]),
        "electronics": ("storage", ["128GB", "256GB", "512GB", "1TB"]),
        "home-living": ("size", ["S", "M", "L"]),
        "jewelry": ("size", ["5", "6", "7", "8"]),
        "automotive": ("size", ["S", "M", "L"]),
        "pet-care": ("size", ["S", "M", "L"]),
        "stationery": ("material", ["Brass", "Steel", "Walnut", "Resin"]),
        "toys": ("size", ["Mini", "Standard", "XL"]),
    }
    type_, opts = sizes_per_cat.get(slug, ("size", ["Standard"]))
    variants = []
    for i, opt in enumerate(opts):
        variants.append(
            {
                "id": f"var-{slug}-{counter}-sz-{i}",
                "type": type_,
                "label": "Size" if type_ == "size" else type_.title(),
                "value": opt,
                "inStock": (i + counter) % 4 != 0,
                "priceModifier": i * 100,
            }
        )
    palette = [
        ("Onyx", "#0B0F1A"),
        ("Ivory", "#F5EFE6"),
        ("Stellar Indigo", "#5B5BFF"),
        ("Coral", "#FF6F91"),
        ("Sage", "#3DD598"),
        ("Sand", "#D9C7A7"),
        ("Cyan", "#5BC0FF"),
    ]
    for j, (name, hex_) in enumerate(palette[: 4 + (counter % 3)]):
        variants.append(
            {
                "id": f"var-{slug}-{counter}-c-{j}",
                "type": "color",
                "label": "Color",
                "value": name,
                "hex": hex_,
                "inStock": (j + counter) % 5 != 0,
                "priceModifier": 0,
            }
        )
    return variants


def build_specs(slug: str, title: str, brand: str) -> List[dict]:
    base = [
        {"key": "Brand", "value": brand, "group": "general"},
        {"key": "Country of Origin", "value": "India", "group": "general"},
        {"key": "Manufacturer", "value": f"{brand} Studios", "group": "general"},
        {"key": "Importer", "value": f"{brand} Distribution Pvt Ltd", "group": "general"},
        {"key": "Warranty", "value": "Limited 1-Year warranty", "group": "general"},
        {"key": "Generic Name", "value": title.split(" ")[-1], "group": "general"},
    ]
    if slug == "electronics":
        base += [
            {"key": "Connectivity", "value": "Bluetooth 5.3, USB-C, Wi-Fi 6E", "group": "connectivity"},
            {"key": "Battery", "value": "Li-ion, fast charging", "group": "performance"},
            {"key": "Charge Time", "value": "1.5 hours full charge", "group": "performance"},
            {"key": "Operating System", "value": "Cross-platform", "group": "performance"},
            {"key": "In the Box", "value": "Device, USB-C cable, quick-start guide", "group": "misc"},
        ]
    elif slug == "fashion":
        base += [
            {"key": "Fit", "value": "Relaxed", "group": "dimensions"},
            {"key": "Fabric", "value": "Premium combed cotton", "group": "dimensions"},
            {"key": "Care", "value": "Cold wash, tumble dry low", "group": "misc"},
            {"key": "Closure", "value": "Pull-on", "group": "misc"},
        ]
    elif slug == "home-living":
        base += [
            {"key": "Dimensions", "value": "60×40×35 cm", "group": "dimensions"},
            {"key": "Weight", "value": "4.2 kg", "group": "dimensions"},
            {"key": "Material", "value": "FSC-certified oak veneer", "group": "dimensions"},
        ]
    elif slug == "beauty":
        base += [
            {"key": "Skin Type", "value": "All skin types", "group": "misc"},
            {"key": "Vegan", "value": "Yes", "group": "misc"},
            {"key": "Cruelty Free", "value": "Leaping Bunny certified", "group": "misc"},
            {"key": "Net Quantity", "value": "50ml", "group": "dimensions"},
        ]
    elif slug == "grocery":
        base += [
            {"key": "Net Weight", "value": "500g", "group": "dimensions"},
            {"key": "Shelf Life", "value": "9 months", "group": "misc"},
            {"key": "Allergens", "value": "Contains tree nuts", "group": "misc"},
        ]
    return base


def emit_reviews(products: List[dict]) -> List[dict]:
    out: List[dict] = []
    review_seeds = [
        ("Worth every rupee", "Genuinely impressed by the quality. Looks even better in person and the unboxing is chef's kiss."),
        ("Beautiful product", "Materials feel premium, finishing is clean. Two thumbs up from a frequent ShopX shopper."),
        ("Solid 4-star buy", "Almost perfect — wish the packaging were sturdier, but the product itself is fantastic."),
        ("Holiday gift goals", "Ordered as a gift and it arrived in 2 days. The recipient was speechless. Will reorder."),
        ("Exceeded expectations", "I doubted at first but this exceeded every expectation. ShopX nailed the curation here."),
        ("Returns came in handy", "First piece had a tiny defect; replacement arrived next day. Customer service was a 10/10."),
        ("Premium feel, fair price", "I would have paid 1.5× this price elsewhere. Genuinely happy with the value."),
        ("Tiny gripe, big love", "The size runs a smidge small — order one up. Apart from that, it is *beautiful*."),
        ("Exactly what I needed", "Reading the description carefully helped me pick the right variant. Spot on."),
        ("Will buy again", "Adding to my permanent rotation. Already eyeing the rest of this brand's catalogue."),
        ("Reliable everyday choice", "Has held up through daily use for 3 weeks already. No complaints whatsoever."),
        ("Photos don't do justice", "Photos are great but the actual product is somehow even nicer. Lighting magic."),
    ]
    review_replies = [
        "Thank you so much! We're so glad it works for you. Welcome to the family ❤️",
        "Appreciate the kind words! If you ever need anything, our concierge is one tap away.",
        "Thanks for the honest feedback — passing your note about packaging to the team.",
        "Glad we could make the gift land! Let us know if you'd like a personalized note next time.",
    ]
    counter = 0
    for p in products:
        # 4 reviews per product => ~1100+ reviews total, plus a few fancy ones
        n = 4 + (counter % 3)
        for j in range(n):
            seed_idx = (counter + j) % len(review_seeds)
            title, comment = review_seeds[seed_idx]
            reply = None
            if j == 0:
                reply = {
                    "author": p["brand"],
                    "content": review_replies[(counter + j) % len(review_replies)],
                    "createdAt": f"2024-{((counter + j) % 12 + 1):02d}-{((counter + j) % 27 + 1):02d}T11:00:00Z",
                }
            out.append(
                {
                    "id": f"rev-{p['id']}-{j+1}",
                    "productId": p["id"],
                    "userName": [
                        "Aanya R.", "Kabir S.", "Mei L.", "Diego P.", "Hana K.", "Theo M.",
                        "Rashmi V.", "Yusuf A.", "Lila C.", "Mira J.", "Nikhil B.", "Sora T.",
                        "Aisha P.", "Ravi K.", "Shreya G.", "Ezra V."
                    ][(counter + j) % 16],
                    "userAvatar": f"https://i.pravatar.cc/120?img={(counter * 3 + j) % 70}",
                    "rating": [5, 5, 4, 4, 5, 3, 5, 4][(counter + j) % 8],
                    "title": title,
                    "comment": comment,
                    "helpful": 12 + (counter * 7 + j * 3) % 240,
                    "unhelpful": (counter + j) % 8,
                    "verifiedPurchase": (counter + j) % 9 != 0,
                    "images": [] if (counter + j) % 5 != 0 else [
                        f"https://picsum.photos/seed/{p['id']}-rev-{j}-img-{i}/600/600"
                        for i in range(2)
                    ],
                    "createdAt": f"2024-{((counter + j) % 12 + 1):02d}-{((counter + j) % 27 + 1):02d}T10:00:00Z",
                    "reply": reply,
                }
            )
        counter += 1
    return out


def emit_banners(categories: List[dict]) -> List[dict]:
    banners = []
    titles = [
        ("Mega Spring Sale", "Up to 80% off on Spring's biggest drop", "Shop Now"),
        ("Tech Tuesday", "Curated electronics with up to ₹15,000 off", "Discover"),
        ("Wardrobe Revolution", "New silhouettes, new mood, new prices", "Browse"),
        ("Home Glow-up", "Lighting + decor under ₹2,499 — refresh in a tap", "Refresh"),
        ("Ramp Ready", "Premium fits hand-picked by our style team", "Style Up"),
        ("Glow Edit", "Skincare staples your routine has been waiting for", "Glow Now"),
        ("Reading Sprint", "Buy 2 books, get 1 free — for the curious", "Read More"),
        ("Sneaker Drop", "Limited drops, signed pairs, fast checkout", "Cop Now"),
        ("Pet Pamper Day", "Treats, toys, and grooming under ₹999", "Pamper"),
        ("Gourmet Trail", "Single-origin coffees, oils, and chocolate", "Taste"),
        ("Stationery Studio", "Tools that make planning feel like art", "Plan"),
        ("Auto Care", "Wash, wax, and protect — kits up to 60% off", "Detail"),
    ]
    for i, c in enumerate(categories):
        title, subtitle, cta = titles[i % len(titles)]
        banners.append(
            {
                "id": f"banner-{i+1}",
                "title": title,
                "subtitle": subtitle,
                "cta": cta,
                "image": c["bannerImage"],
                "gradient": list(c["gradient"]),
                "targetCategoryId": c["id"],
                "expiresAt": "2025-12-31T23:59:59Z",
            }
        )
    # Add an extra hero banner row
    for j in range(8):
        title, subtitle, cta = titles[j]
        banners.append(
            {
                "id": f"hero-{j+1}",
                "title": title,
                "subtitle": subtitle,
                "cta": cta,
                "image": f"https://picsum.photos/seed/hero-{j}/1200/600",
                "gradient": list(categories[j % len(categories)]["gradient"]),
                "expiresAt": "2025-12-31T23:59:59Z",
            }
        )
    return banners


def emit_addresses() -> List[dict]:
    seed_addresses = [
        ("Aanya Roy", "+91 98214 12233", "560034", "204, Ozone Heights", "Koramangala 3rd Block", "Indiranagar Metro", "Bengaluru", "Karnataka", "India", "home", True),
        ("Aanya Roy (Office)", "+91 98214 12233", "560066", "Block C, Tower 4, Floor 12", "Whitefield Tech Park", "Phoenix Marketcity", "Bengaluru", "Karnataka", "India", "work", False),
        ("Mira Joshi", "+91 90432 19872", "400072", "B-202, Lavanya Tower", "Andheri East", "Marol Naka Metro", "Mumbai", "Maharashtra", "India", "home", False),
        ("Diego Pinto", "+91 99003 31298", "110016", "12, Hauz Khas Village", "Opposite Aurobindo Place", "Green Park Metro Gate 3", "New Delhi", "Delhi", "India", "other", False),
        ("Kabir Singh", "+91 98230 22834", "411001", "Flat 8, Pearl Residency", "Camp", "MG Road, near Gold Adlabs", "Pune", "Maharashtra", "India", "home", False),
    ]
    addrs = []
    for i, t in enumerate(seed_addresses):
        addrs.append(
            {
                "id": f"addr-{i+1}",
                "fullName": t[0],
                "phone": t[1],
                "pincode": t[2],
                "flat": t[3],
                "area": t[4],
                "landmark": t[5],
                "city": t[6],
                "state": t[7],
                "country": t[8],
                "type": t[9],
                "isDefault": t[10],
            }
        )
    return addrs


def emit_payment_methods() -> List[dict]:
    return [
        {"id": "pm-upi", "type": "upi", "label": "UPI", "description": "GPay, PhonePe, Paytm or any UPI app", "iconColor": "#5B5BFF", "emoji": "📱", "enabled": True, "cashback": "5% up to ₹100"},
        {"id": "pm-card", "type": "card", "label": "Credit / Debit Card", "description": "Visa, Mastercard, Rupay, Amex", "iconColor": "#FF8C42", "emoji": "💳", "enabled": True, "cashback": "10% with HDFC cards"},
        {"id": "pm-net", "type": "netbanking", "label": "Net Banking", "description": "All major banks supported", "iconColor": "#3DD598", "emoji": "🏦", "enabled": True},
        {"id": "pm-wallet", "type": "wallet", "label": "Wallets", "description": "Paytm, Mobikwik, Amazon Pay", "iconColor": "#FF6FA5", "emoji": "👝", "enabled": True, "cashback": "₹50 on first wallet pay"},
        {"id": "pm-cod", "type": "cod", "label": "Cash on Delivery", "description": "Pay in cash when delivered", "iconColor": "#FFC857", "emoji": "💵", "enabled": True},
        {"id": "pm-emi", "type": "emi", "label": "EMI", "description": "No-cost EMI from 3 to 24 months", "iconColor": "#A877FF", "emoji": "📆", "enabled": True, "cashback": "0% interest on select cards"},
        {"id": "pm-gift", "type": "gift-card", "label": "Gift Card", "description": "Apply gift card balance at checkout", "iconColor": "#5BC0FF", "emoji": "🎁", "enabled": True},
    ]


def emit_orders(products: List[dict], addresses: List[dict]) -> List[dict]:
    statuses = [
        "delivered", "delivered", "delivered", "shipped", "out-for-delivery", "packed",
        "confirmed", "placed", "cancelled", "returned", "refunded", "delivered",
    ]
    orders: List[dict] = []
    for i in range(80):
        status = statuses[i % len(statuses)]
        items = []
        n_items = 1 + (i % 4)
        for k in range(n_items):
            p = products[(i * 7 + k * 3) % len(products)]
            qty = 1 + (k % 3)
            items.append(
                {
                    "productId": p["id"],
                    "productTitle": p["title"],
                    "productThumbnail": p["thumbnail"],
                    "brand": p["brand"],
                    "variantSummary": "Size: M • Color: Onyx",
                    "quantity": qty,
                    "unitPrice": p["price"],
                    "totalPrice": {"amount": p["price"]["amount"] * qty, "currency": p["price"]["currency"]},
                }
            )
        subtotal = sum(it["totalPrice"]["amount"] for it in items)
        shipping = 0 if subtotal > 999 else 49
        taxes = round(subtotal * 0.05)
        discount = round(subtotal * 0.08)
        total = subtotal + shipping + taxes - discount
        addr = addresses[i % len(addresses)]
        timeline = build_timeline(status, i)
        orders.append(
            {
                "id": f"order-{2024_000 + i}",
                "orderNumber": f"SX-{2024_000 + i:08d}",
                "placedAt": f"2024-{((i % 12) + 1):02d}-{((i % 27) + 1):02d}T10:32:00Z",
                "status": status,
                "items": items,
                "subtotal": {"amount": subtotal, "currency": "INR"},
                "shippingFee": {"amount": shipping, "currency": "INR"},
                "taxes": {"amount": taxes, "currency": "INR"},
                "discount": {"amount": discount, "currency": "INR"},
                "total": {"amount": total, "currency": "INR"},
                "shippingAddress": addr,
                "billingAddress": addr,
                "paymentMethodId": ["pm-upi", "pm-card", "pm-cod", "pm-emi"][i % 4],
                "paymentLabel": ["UPI · GPay ··3489", "HDFC Credit Card ··4023", "Cash on Delivery", "No-cost EMI · ICICI"][i % 4],
                "trackingId": f"AWB-{1700_000 + i:09d}",
                "trackingUrl": "https://shopx.example/track",
                "estimatedDelivery": f"2024-{((i % 12) + 1):02d}-{((i % 27) + 3):02d}T18:00:00Z",
                "timeline": timeline,
                "rated": status in ("delivered",) and (i % 2 == 0),
            }
        )
    return orders


def build_timeline(status: str, idx: int) -> List[dict]:
    steps = [
        ("placed", "Order placed", "Your order is confirmed and queued for fulfillment.", "ShopX HQ"),
        ("confirmed", "Confirmed by seller", "The seller is preparing your items for dispatch.", "Bengaluru Hub"),
        ("packed", "Packed", "Your items are securely packed and labeled.", "Bengaluru Hub"),
        ("shipped", "Shipped", "Picked up by ShopX Express.", "Bengaluru Sort Center"),
        ("out-for-delivery", "Out for delivery", "Your courier is on the way.", "Local Hub · Indiranagar"),
        ("delivered", "Delivered", "Your order has been delivered. Hope you love it!", "At your doorstep"),
    ]
    if status == "cancelled":
        return [
            {"status": "placed", "title": "Order placed", "description": "Order placed successfully.", "timestamp": f"2024-04-{(idx % 27) + 1:02d}T10:00:00Z", "location": "ShopX HQ", "completed": True},
            {"status": "cancelled", "title": "Cancelled", "description": "You cancelled this order.", "timestamp": f"2024-04-{(idx % 27) + 1:02d}T10:18:00Z", "location": "ShopX HQ", "completed": True},
        ]
    if status == "returned":
        return [
            {"status": "delivered", "title": "Delivered", "description": "Order delivered to your doorstep.", "timestamp": f"2024-04-{(idx % 27) + 1:02d}T18:00:00Z", "location": "Doorstep", "completed": True},
            {"status": "returned", "title": "Returned", "description": "Pickup completed; refund initiated.", "timestamp": f"2024-04-{(idx % 27) + 4:02d}T13:00:00Z", "location": "ShopX Hub", "completed": True},
        ]
    if status == "refunded":
        return [
            {"status": "returned", "title": "Returned", "description": "Pickup completed.", "timestamp": f"2024-04-{(idx % 27) + 1:02d}T13:00:00Z", "location": "ShopX Hub", "completed": True},
            {"status": "refunded", "title": "Refunded", "description": "Refund credited to original payment method.", "timestamp": f"2024-04-{(idx % 27) + 3:02d}T11:00:00Z", "location": "Bank", "completed": True},
        ]
    out = []
    completed_until = next((i for i, s in enumerate(steps) if s[0] == status), len(steps) - 1)
    for i, (s, t, d, loc) in enumerate(steps):
        out.append(
            {
                "status": s,
                "title": t,
                "description": d,
                "timestamp": f"2024-04-{((idx + i) % 27) + 1:02d}T{(8 + i):02d}:00:00Z",
                "location": loc,
                "completed": i <= completed_until,
            }
        )
    return out


def emit_search_seeds() -> dict:
    return {
        "popularSearches": [
            "wireless earbuds", "running shoes under 5000", "white sneakers", "office laptop",
            "yoga mat", "smartwatch with ecg", "gift for him", "gift for her",
            "minimalist watch", "noise cancelling headphones", "coffee table books", "kitchen organizer",
            "raincoat for monsoon", "gym wear", "tablet for students", "led desk lamp",
            "cordless vacuum", "air fryer", "denim jeans men", "ethnic kurti",
            "mechanical keyboard", "stationery set", "ergonomic chair", "skincare for oily skin",
        ],
        "trendingTags": [
            "summer-sale", "back-to-school", "festive-edit", "gifting", "running-week",
            "indie-brands", "premium-tech", "minimal-aesthetic", "sustainable", "limited-drop",
        ],
    }


def emit_ai_responses() -> dict:
    quick = [
        {"id": "qa-1", "label": "Track my order", "emoji": "📦", "prompt": "Where is my latest order?"},
        {"id": "qa-2", "label": "Best deals today", "emoji": "🔥", "prompt": "What are today's best deals?"},
        {"id": "qa-3", "label": "Help me pick a gift", "emoji": "🎁", "prompt": "Help me pick a gift for my friend"},
        {"id": "qa-4", "label": "Sizing help", "emoji": "📏", "prompt": "How does the sizing run on this brand?"},
        {"id": "qa-5", "label": "Return policy", "emoji": "↩️", "prompt": "What's the return policy?"},
        {"id": "qa-6", "label": "Compare two products", "emoji": "⚖️", "prompt": "Help me compare two products"},
        {"id": "qa-7", "label": "Outfit ideas", "emoji": "👗", "prompt": "Build me an outfit for this season"},
        {"id": "qa-8", "label": "Gift cards", "emoji": "💳", "prompt": "How do gift cards work?"},
    ]
    keyword_responses = [
        ("track", "I just pinged Logistics — your latest order is on the move and should land tomorrow before 6PM. Want me to enable SMS updates?"),
        ("delivery", "Most orders ship in 24h with free express delivery in metros. Tier-2 cities take 2–3 business days."),
        ("return", "Most items are returnable within 30 days. We pick up from your doorstep, no fees. Want me to start a return?"),
        ("size", "Pro tip: this brand runs slightly small. Size up if you're between sizes — and the size chart is on the product page."),
        ("gift", "Tell me their vibe in 3 words and I'll pull together a curated gift bundle in your budget."),
        ("deal", "Today's biggest drops: 60% off sneakers, 40% off premium tech, and a flash 30% on home decor."),
        ("sale", "Spring Sale runs all week — bigger discounts unlock daily, peak savings on Sunday."),
        ("compare", "Drop the two product names and I'll line up specs, reviews and best-fit use cases for you."),
        ("payment", "We accept UPI, all major cards, EMI, gift cards and COD on most pin-codes."),
        ("offer", "Here are some active offers: 10% off on your first card payment, ₹100 cashback with HDFC, free shipping over ₹999."),
    ]
    fallback = [
        "Got it! Give me a sec while I sift through the catalogue and pull the right picks for you.",
        "Love that question — here's what I'd consider before clicking buy.",
        "Quick mental model: shortlist by use-case → filter by budget → cross-check reviews. I'll do all three.",
        "Try the 60-30-10 rule: 60% staples, 30% statement, 10% wildcard. Helps build a wardrobe that feels personal.",
        "Two things to look at: warranty + returns. Both are generous on this catalogue, so you can experiment safely.",
        "Honestly? I'd start with reviews. Filter to 3-star reviews — they always tell you the real trade-offs.",
    ]
    return {"quick": quick, "keywordResponses": keyword_responses, "fallback": fallback}


def emit_notifications() -> List[dict]:
    base = [
        ("order", "Order delivered", "Your latest order arrived 2 hours early. Hope it's perfect ❤️", "📦"),
        ("deal", "Lightning deal", "60% off sneakers — only for the next 90 minutes!", "⚡"),
        ("price-drop", "Price drop", "An item from your wishlist is now 25% cheaper.", "📉"),
        ("restock", "Back in stock", "The bag you saved is back. Stock is limited.", "🔁"),
        ("system", "ShopX update", "We just shipped dark-mode polish + new sticker pack 🎉", "✨"),
        ("review-reply", "Brand replied", "MoonRift responded to your review — tap to read.", "💬"),
        ("order", "Out for delivery", "Your order is with the courier — expect it before 6PM.", "🚚"),
        ("deal", "Members-only deal", "Gold members: extra 10% off for the next 24 hours.", "👑"),
        ("price-drop", "Watching this?", "Price dropped on the laptop you viewed yesterday.", "📉"),
        ("system", "Profile tip", "Add a default address and never type it again at checkout.", "💡"),
    ]
    out = []
    for i in range(60):
        kind, title, body, emoji = base[i % len(base)]
        out.append(
            {
                "id": f"notif-{i+1}",
                "kind": kind,
                "title": title,
                "body": body,
                "emoji": emoji,
                "read": i % 4 == 0,
                "createdAt": f"2024-04-{((i % 27) + 1):02d}T{((i % 12) + 8):02d}:00:00Z",
            }
        )
    return out


# ---------------------------------------------------------------------------
# Emitter helpers
# ---------------------------------------------------------------------------


def to_ts_string(s: str) -> str:
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ") + "'"


def to_ts(value, indent: int = 0) -> str:
    pad = "  " * indent
    inner = "  " * (indent + 1)
    if isinstance(value, dict):
        if not value:
            return "{}"
        lines = ["{"]
        for k, v in value.items():
            ts_v = to_ts(v, indent + 1)
            lines.append(f"{inner}{json.dumps(k)}: {ts_v},")
        lines.append(pad + "}")
        return "\n".join(lines)
    if isinstance(value, list):
        if not value:
            return "[]"
        lines = ["["]
        for v in value:
            ts_v = to_ts(v, indent + 1)
            lines.append(f"{inner}{ts_v},")
        lines.append(pad + "]")
        return "\n".join(lines)
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "undefined"
    if isinstance(value, str):
        return to_ts_string(value)
    return str(value)


def write_ts(path: Path, header: str, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(header.rstrip() + "\n\n" + body.rstrip() + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    categories = emit_categories()
    brands = emit_brands(categories)
    products = emit_products(categories, brands)
    reviews = emit_reviews(products)
    banners = emit_banners(categories)
    addresses = emit_addresses()
    payment_methods = emit_payment_methods()
    orders = emit_orders(products, addresses)
    search_seeds = emit_search_seeds()
    ai_responses = emit_ai_responses()
    notifications = emit_notifications()

    print(f"products: {len(products)}, reviews: {len(reviews)}, orders: {len(orders)}")

    # categories.ts
    write_ts(
        DATA_DIR / "categories.ts",
        "import { Category } from '../types';",
        f"export const categories: Category[] = {to_ts(categories)};\n\n"
        f"export const findCategory = (id: string): Category | undefined =>\n"
        f"  categories.find((c) => c.id === id);\n",
    )

    # brands.ts
    write_ts(
        DATA_DIR / "brands.ts",
        "import { Brand } from '../types';",
        f"export const brands: Brand[] = {to_ts(brands)};\n\n"
        f"export const findBrand = (id: string): Brand | undefined =>\n"
        f"  brands.find((b) => b.id === id);\n",
    )

    # products.ts
    write_ts(
        DATA_DIR / "products.ts",
        "import { Product } from '../types';",
        f"export const products: Product[] = {to_ts(products)};\n\n"
        f"export const findProduct = (id: string): Product | undefined =>\n"
        f"  products.find((p) => p.id === id);\n\n"
        f"export const productsByCategory = (categoryId: string): Product[] =>\n"
        f"  products.filter((p) => p.categoryId === categoryId);\n\n"
        f"export const productsBySubcategory = (subcategoryId: string): Product[] =>\n"
        f"  products.filter((p) => p.subcategoryId === subcategoryId);\n\n"
        f"export const trendingProducts = (): Product[] =>\n"
        f"  products.filter((p) => p.trending).slice(0, 24);\n\n"
        f"export const featuredProducts = (): Product[] =>\n"
        f"  products.filter((p) => p.featured).slice(0, 24);\n\n"
        f"export const newArrivals = (): Product[] =>\n"
        f"  products.filter((p) => p.newArrival).slice(0, 24);\n\n"
        f"export const bestsellers = (): Product[] =>\n"
        f"  products.filter((p) => p.bestseller).slice(0, 24);\n",
    )

    # reviews.ts
    write_ts(
        DATA_DIR / "reviews.ts",
        "import { Review } from '../types';",
        f"export const reviews: Review[] = {to_ts(reviews)};\n\n"
        f"export const reviewsForProduct = (productId: string): Review[] =>\n"
        f"  reviews.filter((r) => r.productId === productId);\n",
    )

    # banners.ts
    write_ts(
        DATA_DIR / "banners.ts",
        "import { Banner } from '../types';",
        f"export const banners: Banner[] = {to_ts(banners)};\n",
    )

    # addresses.ts
    write_ts(
        DATA_DIR / "addresses.ts",
        "import { Address } from '../types';",
        f"export const initialAddresses: Address[] = {to_ts(addresses)};\n",
    )

    # paymentMethods.ts
    write_ts(
        DATA_DIR / "paymentMethods.ts",
        "import { PaymentMethod } from '../types';",
        f"export const paymentMethods: PaymentMethod[] = {to_ts(payment_methods)};\n",
    )

    # orders.ts
    write_ts(
        DATA_DIR / "orders.ts",
        "import { Order } from '../types';",
        f"export const initialOrders: Order[] = {to_ts(orders)};\n\n"
        f"export const ordersByStatus = (status: string) =>\n"
        f"  initialOrders.filter((o) => o.status === status);\n\n"
        f"export const findOrder = (id: string) =>\n"
        f"  initialOrders.find((o) => o.id === id);\n",
    )

    # searchSeeds.ts
    write_ts(
        DATA_DIR / "searchSeeds.ts",
        "",
        f"export const popularSearches: string[] = {to_ts(search_seeds['popularSearches'])};\n\n"
        f"export const trendingTags: string[] = {to_ts(search_seeds['trendingTags'])};\n",
    )

    # aiResponses.ts
    quick_ts = to_ts(ai_responses["quick"])
    kw = ai_responses["keywordResponses"]
    kw_ts = "[\n" + ",\n".join(f"  [{to_ts_string(k)}, {to_ts_string(v)}]" for k, v in kw) + ",\n]"
    fb_ts = to_ts(ai_responses["fallback"])
    write_ts(
        DATA_DIR / "aiResponses.ts",
        "import { AIQuickAction } from '../types';",
        textwrap.dedent(
            f"""\
            export const aiQuickReplies: AIQuickAction[] = {quick_ts};

            const keywordResponses: [string, string][] = {kw_ts};

            const fallbackResponses: string[] = {fb_ts};

            export const generateAIResponse = (input: string): string => {{
              const text = input.toLowerCase();
              for (const [needle, reply] of keywordResponses) {{
                if (text.includes(needle)) {{
                  return reply;
                }}
              }}
              const idx = Math.floor(Math.random() * fallbackResponses.length);
              return fallbackResponses[idx];
            }};
            """
        ),
    )

    # notifications.ts
    write_ts(
        DATA_DIR / "notifications.ts",
        "import { AppNotification } from '../types';",
        f"export const notifications: AppNotification[] = {to_ts(notifications)};\n",
    )


if __name__ == "__main__":
    main()
