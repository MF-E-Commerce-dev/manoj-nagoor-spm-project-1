(() => {
  function svgDataUri({ bg1, bg2, label, sub }) {
    const safeLabel = String(label ?? "").slice(0, 2);
    const safeSub = String(sub ?? "").slice(0, 18);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="720" height="480" rx="28" fill="url(#g)"/>
  <circle cx="140" cy="110" r="90" fill="rgba(255,255,255,0.22)" filter="url(#blur)"/>
  <circle cx="640" cy="60" r="120" fill="rgba(255,255,255,0.12)" filter="url(#blur)"/>
  <circle cx="600" cy="390" r="130" fill="rgba(0,0,0,0.10)" filter="url(#blur)"/>
  <rect x="46" y="46" width="628" height="388" rx="22" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.16)"/>
  <text x="86" y="250" font-size="160" font-weight="800" fill="rgba(255,255,255,0.92)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">${safeLabel}</text>
  <text x="86" y="320" font-size="30" font-weight="600" fill="rgba(255,255,255,0.92)" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">${safeSub}</text>
</svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Shared product catalog for both pages.
  // Category mapping requirement:
  // - Women: beauty products
  // - Men: men-related products (grooming/apparel/accessories)
  // - Kids: kids-related products (toys/apparel)
  const PRODUCTS = [
    // Women (Beauty)
    {
      id: "w-beauty-rose-serum",
      name: "Rose Hydrating Serum",
      category: "Women",
      type: "Beauty",
      price: 299,
      description:
        "A lightweight rose serum that helps hydrate and brighten for a healthy-looking glow.",
      highlights: ["Lightweight feel", "Hydration boost", "Fresh rose scent"],
      image: "https://i.ebayimg.com/images/g/A6EAAOSwuShjyc1w/s-l400.jpg",
      inStock: true,
    },
    {
      id: "w-beauty-vitc-cream",
      name: "Vitamin C Brightening Cream",
      category: "Women",
      type: "Beauty",
      price: 350,
      description:
        "Daily vitamin C cream designed to support a more even-looking complexion and radiant finish.",
      highlights: ["Supports brightness", "Moisturizes", "Smooth finish"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdn5zPj_h2AWcXTWJo6TQeIr1F4TA3qu1cPg&s",
      inStock: true,
    },
    {
      id: "w-beauty-makeup-brush-set",
      name: "Makeup Brush Set (8pc)",
      category: "Women",
      type: "Beauty",
      price: 259,
      description:
        "A soft, easy-to-use brush set for flawless blends—powder, foundation, and everything in between.",
      highlights: ["Soft bristles", "Easy blending", "Travel-ready case"],
      image: "https://m.media-amazon.com/images/I/617ICzoiPlL._AC_UF1000,1000_QL80_.jpg",
      inStock: true,
    },
    // Women (Fashion)
    {
      id: "w-fashion-silk-scarf",
      name: "Silk-Look Scarf (Square)",
      category: "Women",
      type: "Accessories",
      price: 210,
      description:
        "A chic scarf with a smooth silk-like finish—perfect for styling hair, bags, and necks.",
      highlights: ["Soft drape", "Easy styling", "All-season wear"],
      image: "https://editorialist.com/thumbnails/300/2025/8/038/036/278/38036278~chain_1763353154640_0.webp",
      inStock: true,
    },
    {
      id: "w-fashion-stud-earrings",
      name: "Gold-Tone Stud Earrings",
      category: "Women",
      type: "Accessories",
      price: 599,
      description:
        "Small, elegant gold-tone studs that add effortless shine to everyday outfits.",
      highlights: ["Everyday wear", "Lightweight", "Secure backing"],
      image: "https://shop.southindiajewels.com/wp-content/uploads/2024/01/Gold-Plated-Polki-Studs-Earrings-ABDIE00400-04-300x400.jpg",
      inStock: true,
    },
    // Men (Men-related)
    {
      id: "m-grooming-shaving-kit",
      name: "Classic Shaving Kit",
      category: "Men",
      type: "Grooming",
      price: 450,
      description:
        "A classic shaving kit with an easy lather soap and a comfortable razor-ready brush.",
      highlights: ["Comfort grip", "Gentle formula", "Travel pouch included"],
      image: "https://i.ebayimg.com/images/g/~qgAAOSwRj5k88qU/s-l400.jpg",
      inStock: true,
    },
    {
      id: "m-fragrance-cologne",
      name: "Wood & Citrus Cologne",
      category: "Men",
      type: "Grooming",
      price: 650,
      description:
        "An energetic wood-and-citrus scent designed for day-to-night freshness.",
      highlights: ["Long-lasting", "Fresh citrus top", "Warm woody base"],
      image: "https://www.fashionbeans.com/wp-content/uploads/2022/11/Bently_Intense_WoodyColognes.jpg",
      inStock: true,
    },
    {
      id: "m-apparel-hoodie",
      name: "Everyday Hoodie (Unisex Fit)",
      category: "Men",
      type: "Apparel",
      price: 399,
      description:
        "A cozy hoodie with a clean look and durable stitching—built for everyday comfort.",
      highlights: ["Soft fleece feel", "Easy layering", "Durable seams"],
      image: "https://i.ebayimg.com/images/g/mnAAAOSwh~BkLGgI/s-l400.jpg",
      inStock: true,
    },
    {
      id: "m-accessories-leather-belt",
      name: "Genuine Leather Belt",
      category: "Men",
      type: "Accessories",
      price: 249,
      description:
        "A genuine leather belt with a classic buckle—style it with denim or tailored trousers.",
      highlights: ["Genuine leather", "Classic buckle", "Smooth finish"],
      image: "https://www.azibo.in/images/product_thumb/bfdacfddf4031bb8efeecfe6afc87e93047746e6.png",
      inStock: true,
    },
    {
      id: "m-tech-backpack",
      name: "Laptop-Friendly Backpack",
      category: "Men",
      type: "Accessories",
      price: 799,
      description:
        "A sleek backpack with padded straps and a laptop compartment for work or travel.",
      highlights: ["Padded laptop sleeve", "Organized pockets", "Comfort straps"],
      image: "https://thefoschini.vtexassets.com/arquivos/ids/225819679-300-400/09e003db-f915-47db-b112-b6d7104e18a3.png?v=639118459439400000",
      inStock: true,
    },
    // Kids (Kids-related)
    {
      id: "k-toy-building-blocks",
      name: "Building Blocks (120pc)",
      category: "Kids",
      type: "Toys",
      price: 876,
      description:
        "A colorful 120-piece set that sparks imagination and builds lots of fun creations.",
      highlights: ["Bright colors", "Easy-to-hold pieces", "Endless builds"],
      image: "https://i.ebayimg.com/images/g/XaEAAOSw2IxfPFCI/s-l400.jpg",
      inStock: true,
    },
    {
      id: "k-toy-musical-rattle",
      name: "Musical Rattle (0-3Y)",
      category: "Kids",
      type: "Toys",
      price: 120,
      description:
        "A gentle musical rattle designed for tiny hands, with soft sounds and a comfy grip.",
      highlights: ["Soft sound", "Comfort grip", "Baby-friendly materials"],
      image: "https://i.ebayimg.com/images/g/~LgAAOSwPAJjh9dm/s-l400.jpg",
      inStock: true,
    },
    {
      id: "k-apparel-tshirt-set",
      name: "Kids T-Shirt Set (3-Pack)",
      category: "Kids",
      type: "Apparel",
      price: 278,
      description:
        "A breathable 3-pack set with fun prints—easy to mix, match, and wear all day.",
      highlights: ["Breathable fabric", "Fun prints", "Soft inside feel"],
      image: "https://deal20one.com/wp-content/uploads/2026/04/74826aa2-9790-46fa-a2fc-2b5f2f882c97-300x400.jpg",
      inStock: true,
    },
    {
      id: "k-book-storytime",
      name: "Storytime Picture Book",
      category: "Kids",
      type: "Books",
      price: 289,
      description:
        "A delightful picture book made for reading together—perfect for calm bedtime routines.",
      highlights: ["Big, clear pictures", "Kid-friendly story", "Bedtime ready"],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_SuqsBPfNP2CkCGUmbUg9mRz8B2bHpMU8Rg&s",
      inStock: true,
    },
    {
      id: "k-outdoor-rain-boots",
      name: "Waterproof Rain Boots",
      category: "Kids",
      type: "Outdoor",
      price: 354,
      description:
        "Stay comfortable in wet weather with waterproof rain boots made for everyday adventures.",
      highlights: ["Waterproof design", "Comfort lining", "Easy on/off"],
      image: "https://i.ebayimg.com/images/g/SY8AAeSw6zhpvtDm/s-l400.jpg",
      inStock: true,
    },
    // A few more to make grids richer
    {
      id: "w-beauty-lip-gloss",
      name: "Glow Lip Gloss",
      category: "Women",
      type: "Beauty",
      price: 390,
      description:
        "A smooth, glossy finish with a comfortable feel—adds instant shine without stickiness.",
      highlights: ["Comfort wear", "Non-sticky feel", "Shiny finish"],
      image: "https://m.media-amazon.com/images/S/aplus-media/sota/de90000e-ece3-4557-8604-8966c1a2be24.__CR104,0,470,626_PT0_SX300_V1___.png",
      inStock: true,
    },
    {
      id: "m-apparel-graphic-tee",
      name: "Graphic Tee (Slim Fit)",
      category: "Men",
      type: "Apparel",
      price: 499,
      description:
        "A comfortable graphic tee with a modern slim fit—perfect for casual everyday looks.",
      highlights: ["Soft feel", "Modern style", "Easy everyday wear"],
      image: "https://images-static.nykaa.com/media/catalog/product/2/4/240ed97913789-Black_1.jpg?tr=cm-pad_resize,w-300,h-400",
      inStock: true,
    },
    {
      id: "k-toy-robot-kit",
      name: "Mini Robot Kit (Build & Play)",
      category: "Kids",
      type: "Toys",
      price: 388,
      description:
        "Build a mini robot and explore creative play—hands-on fun for curious minds.",
      highlights: ["Build & play", "STEM-inspired", "Great group activity"],
      image: "https://www.robotlab.com/hs-fs/hubfs/300x400.jpg?width=700&name=300x400.jpg",
      inStock: true,
    },
  ];

  window.PRODUCTS = PRODUCTS;
})();

