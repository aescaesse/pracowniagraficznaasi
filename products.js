/**
 * Katalog produktów — Pracownia graficzna Asi
 * Zawiera dane produktów, zdjęcia główne oraz ujęcia detalu (tekstury papieru/złocenia),
 * a także konfigurację wariantów z dynamiczną kalkulacją ceny.
 */
const PRODUCTS_DATA = [
  {
    id: 'art-botanica-01',
    category: 'prints',
    categoryLabel: 'Wydruki A3/A4',
    title: 'Cisza Poranka — Studium Botaniczne',
    subtitle: 'Druk pigmentowy Giclée na papierze bawełnianym',
    basePrice: 85,
    badge: 'Limitowana edycja',
    imageMain: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=85',
    description: 'Autorska ilustracja botaniczna drukowana tuszami archiwalnymi o trwałości powyżej 100 lat. Głęboka matowa powierzchnia wydobywa subtelne przejścia tonalne i strukturę włókien bawełny.',
    specs: ['Papier Hahnemühle Photo Rag 308g', 'Tusz pigmentowy UltraChrome', 'Sygnowany odręcznie na odwrocie'],
    variants: {
      size: [
        { label: 'A4 (21 × 29,7 cm)', priceMod: 0 },
        { label: 'A3 (29,7 × 42 cm)', priceMod: 45 },
        { label: 'B2 (50 × 70 cm)', priceMod: 115 }
      ],
      paper: [
        { label: 'Bawełna 308g (Ciepła biel)', priceMod: 0 },
        { label: 'Papier czerpany z brzegiem rwanym', priceMod: 35 }
      ]
    },
    minQty: 1,
    stepQty: 1
  },
  {
    id: 'wed-linen-02',
    category: 'stationery',
    categoryLabel: 'Ślub i Papeteria',
    title: 'Kolekcja „Len i Złoto” — Zaproszenie Ślubne',
    subtitle: 'Hot-stamping złotą folią + koperta z lakiem',
    basePrice: 14,
    badge: 'Bestseller',
    imageMain: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85',
    description: 'Dwukartowe zaproszenie ślubne na szlachetnym papierze o strukturze naturalnego lnu. Imiona pary młodej uszlachetnione metodą hot-stampingu (tłoczenie na gorąco matowym złotem). W komplecie koperta B6 z ręcznie odciskaną pieczęcią lakową.',
    specs: ['Karton Gmund Cotton 350g', 'Złocenie matowe Hot-Stamping', 'Koperta C6/B6 z wklejką w zestawie'],
    variants: {
      size: [
        { label: 'Karta główna + RSVP', priceMod: 0 },
        { label: 'Pełny zestaw (Karta + RSVP + Info + Lak)', priceMod: 6 }
      ],
      paper: [
        { label: 'Gmund Cotton Krem 350g', priceMod: 0 },
        { label: 'Bawełna z wtrąceniami kwiatowymi 300g', priceMod: 3 }
      ]
    },
    minQty: 20,
    stepQty: 5
  },
  {
    id: 'plot-topper-03',
    category: 'plotter',
    categoryLabel: 'Ploter i Detale',
    title: 'Ażurowe Winietki i Toppery na Tort',
    subtitle: 'Precyzyjne cięcie ploterowe w papierze barwionym w masie',
    basePrice: 6.50,
    badge: 'Personalizacja',
    imageMain: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85',
    description: 'Delikatne, wycinane ploterowo imiona gości oraz detale dekoracyjne na stół. Papier Sirio Color barwiony w masie gwarantuje brak białych krawędzi na linii cięcia.',
    specs: ['Papier barwiony w masie 290g', 'Cięcie ploterem z dokładnością 0,1 mm', 'Dostępne w 12 odcieniach ziemi'],
    variants: {
      size: [
        { label: 'Winietka na kieliszek / talerz', priceMod: 0 },
        { label: 'Zawieszka na alkohol (z dziurką)', priceMod: 0.50 },
        { label: 'Topper dekoracyjny (20 cm)', priceMod: 28.50 }
      ],
      paper: [
        { label: 'Szałwia (Sage Green 290g)', priceMod: 0 },
        { label: 'Terakota (Terracotta 290g)', priceMod: 0 },
        { label: 'Złoty lustrzany 300g', priceMod: 2 }
      ]
    },
    minQty: 10,
    stepQty: 5
  },
  {
    id: 'art-forma-04',
    category: 'prints',
    categoryLabel: 'Wydruki A3/A4',
    title: 'Forma Organiczna No. 04',
    subtitle: 'Minimalistyczna grafika strukturalna',
    basePrice: 95,
    badge: null,
    imageMain: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85',
    description: 'Kompozycja inspirowana ceramiką i grą cienia na wapiennym tynku. Wydruk na fakturowanym papierze akwarelowym, który nadaje bryłom niemal trójwymiarową głębię.',
    specs: ['Papier Torchon 285g (faktura filcu)', 'Certyfikat autentyczności', 'Pakowane na płasko lub w tubę'],
    variants: {
      size: [
        { label: 'A4 (21 × 29,7 cm)', priceMod: 0 },
        { label: 'A3 (29,7 × 42 cm)', priceMod: 45 },
        { label: 'B2 (50 × 70 cm)', priceMod: 120 }
      ],
      paper: [
        { label: 'Faktura akwarelowa 285g', priceMod: 0 },
        { label: 'Gładka bawełna matowa 308g', priceMod: 0 }
      ]
    },
    minQty: 1,
    stepQty: 1
  },
  {
    id: 'wed-menu-05',
    category: 'stationery',
    categoryLabel: 'Ślub i Papeteria',
    title: 'Menu Weselne z Rwanym Brzegiem i Kalką',
    subtitle: 'Warstwowa papeteria z półprzezroczystą kalką architektoniczną',
    basePrice: 11,
    badge: 'Nowość',
    imageMain: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85',
    description: 'Połączenie grubego, ręcznie rwanego kartonu bawełnianego z półtransparentną kalką 160g spiętą złotym nitem kaletniczym. Subtelna gra warstw na nakryciu każdego gościa.',
    specs: ['Karton bawełniany 320g + Kalka 160g', 'Ręcznie rwane krawędzie', 'Mosiężny nit w komplecie'],
    variants: {
      size: [
        { label: 'Format DL (10 × 21 cm)', priceMod: 0 },
        { label: 'Format A5 (14,8 × 21 cm)', priceMod: 2.50 }
      ],
      paper: [
        { label: 'Biel śmietankowa + kalka mleczna', priceMod: 0 },
        { label: 'Piaskowy beż + kalka ze złotym nadrukiem', priceMod: 3.50 }
      ]
    },
    minQty: 20,
    stepQty: 5
  },
  {
    id: 'plot-stickers-06',
    category: 'plotter',
    categoryLabel: 'Ploter i Detale',
    title: 'Arkusz Etykiet i Naklejek Brandingowych',
    subtitle: 'Cięcie po obrysie (Kiss-Cut) na papierze fakturowanym',
    basePrice: 38,
    badge: null,
    imageMain: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=85',
    imageDetail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=85',
    description: 'Zestaw 24 etykiet wycinanych po dowolnym obrysie na arkuszu A4. Idealne do pakowania paczek, słoików, świec sojowych oraz kopert firmowych.',
    specs: ['Papier samoprzylepny Tintoretto Gesso', 'Nacinanie kiss-cut (łatwe odklejanie)', 'Możliwość wgrania własnego logo'],
    variants: {
      size: [
        { label: '2 arkusze A4 (ok. 48 naklejek)', priceMod: 0 },
        { label: '5 arkuszy A4 (ok. 120 naklejek)', priceMod: 42 },
        { label: '10 arkuszy A4 (ok. 240 naklejek)', priceMod: 95 }
      ],
      paper: [
        { label: 'Papier fakturowany Tintoretto (mat)', priceMod: 0 },
        { label: 'Papier Kraft prążkowany (eko)', priceMod: 4 }
      ]
    },
    minQty: 1,
    stepQty: 1
  }
];