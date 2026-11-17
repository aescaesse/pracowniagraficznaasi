const PRODUCTS_DATA = [
  {
    id: 'print-botanical-01',
    title: 'Studium Ciszy — Edycja Limitowana',
    category: 'prints',
    categoryLabel: 'Wydruk Giclée',
    paperInfo: 'Hahnemühle Photo Rag 308g (100% Bawełna)',
    basePrice: 140,
    imagePrimary: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=85',
    description: 'Minimalistyczna kompozycja inspirowana światłocieniem poranka. Druk pigmentowy o archiwalnej trwałości na głębokim, matowym papierze bawełnianym z wyczuwalną strukturą.',
    variants: [
      { id: 'a4', label: 'Format A4 (21 × 29,7 cm)', priceDelta: 0 },
      { id: 'a3', label: 'Format A3 (29,7 × 42 cm)', priceDelta: 60 },
      { id: 'b2', label: 'Format B2 (50 × 70 cm)', priceDelta: 150 }
    ]
  },
  {
    id: 'stationery-suite-verona',
    title: 'Zaproszenie Ślubne „Verona” ze Złoceniem',
    category: 'stationery',
    categoryLabel: 'Papeteria Ślubna',
    paperInfo: 'Gmund Cotton 350g + Hot-Stamping',
    basePrice: 190,
    imagePrimary: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=85',
    description: 'Dwukartowe zaproszenie ślubne z nowoczesną typografią tłoczoną szampańskim złotem. W komplecie ręcznie składana koperta oraz karta RSVP.',
    variants: [
      { id: 'set-20', label: 'Zestaw 20 sztuk (9,50 zł / szt.)', priceDelta: 0 },
      { id: 'set-50', label: 'Zestaw 50 sztuk (8,80 zł / szt.)', priceDelta: 250 },
      { id: 'set-80', label: 'Zestaw 80 sztuk (8,20 zł / szt.)', priceDelta: 466 }
    ]
  },
  {
    id: 'plotter-stickers-botanic',
    title: 'Etykiety & Naklejki Ploterowe „Pracownia Asi”',
    category: 'plotter',
    categoryLabel: 'Ploter i Detale',
    paperInfo: 'Tintoretto Gesso / Folia matowa',
    basePrice: 65,
    imagePrimary: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=85',
    description: 'Precyzyjnie nacinane po obrysie naklejki i plomby na opakowania, świece lub koperty. Odporne na ścieranie, z trwałym klejem akrylowym.',
    variants: [
      { id: 'pack-50', label: 'Arkusz 50 sztuk (śr. 45 mm)', priceDelta: 0 },
      { id: 'pack-100', label: 'Arkusz 100 sztuk (śr. 45 mm)', priceDelta: 45 },
      { id: 'pack-250', label: 'Pakiet 250 sztuk (śr. 45 mm)', priceDelta: 135 }
    ]
  },
  {
    id: 'print-arch-forms',
    title: 'Formy Architektoniczne No. 04',
    category: 'prints',
    categoryLabel: 'Wydruk Giclée',
    paperInfo: 'Munken Polar Rough 300g',
    basePrice: 130,
    imagePrimary: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=800&q=85',
    description: 'Geometryczna kompozycja w industrialnych tonach grafitu i ciepłej szarości. Każdy wydruk sygnowany ręcznie ołówkiem na dolnym marginesie.',
    variants: [
      { id: 'a4', label: 'Format A4 (21 × 29,7 cm)', priceDelta: 0 },
      { id: 'a3', label: 'Format A3 (29,7 × 42 cm)', priceDelta: 55 },
      { id: 'b2', label: 'Format B2 (50 × 70 cm)', priceDelta: 140 }
    ]
  },
  {
    id: 'stationery-placecards-arch',
    title: 'Winietki Łukowe ze Ślepym Tłokiem',
    category: 'stationery',
    categoryLabel: 'Papeteria Ślubna',
    paperInfo: 'Keaykolour 300g + Cięcie ploterowe',
    basePrice: 110,
    imagePrimary: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=85',
    description: 'Stojące winietki wycinane ploterem w kształt klasycznego łuku z personalizacją nazwisk gości i głębokim tłoczeniem bezbarwnym.',
    variants: [
      { id: 'pc-30', label: 'Komplet 30 sztuk', priceDelta: 0 },
      { id: 'pc-60', label: 'Komplet 60 sztuk', priceDelta: 90 },
      { id: 'pc-100', label: 'Komplet 100 sztuk', priceDelta: 190 }
    ]
  },
  {
    id: 'plotter-topper-acrylic',
    title: 'Topper Typograficzny — Akryl Mat / Sklejka',
    category: 'plotter',
    categoryLabel: 'Ploter i Detale',
    paperInfo: 'Akryl satynowy 3mm / Sklejka brzozowa',
    basePrice: 79,
    imagePrimary: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1635405074683-96d6921a2a68?auto=format&fit=crop&w=800&q=85',
    description: 'Autorski napis wycinany precyzyjnie ploterem i laserem. Minimalistyczne zwieńczenie tortu weselnego lub kompozycji florystycznej.',
    variants: [
      { id: 'wood', label: 'Naturalna sklejka brzozowa (16 cm)', priceDelta: 0 },
      { id: 'gold-acrylic', label: 'Akryl szczotkowane złoto (16 cm)', priceDelta: 20 },
      { id: 'sage-acrylic', label: 'Akryl matowa szałwia (16 cm)', priceDelta: 20 }
    ]
  }
];