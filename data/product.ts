export type ColorId = "haki-krem" | "petrol-krem" | "gulkurusu-bej" | "lila";

export type ColorVariant = {
  id: ColorId;
  name: string;
  hex: string;
  images: string[];
};

export type RelatedProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  href: string;
  colors?: string[];
};

export const SITE_URL = "https://www.entarim.com";

export const product = {
  slug: "e186-hamile-sifon-elbise-4",
  name: "HAMİLE ŞİFON ELBİSE",
  category: "Hamile Elbisesi",
  categoryHref: `${SITE_URL}/hamile-elbise`,
  sku: "E186",
  price: 2950,
  currency: "TRY",
  sizes: ["38", "40", "42", "44", "46"],
  description: [
    "Rahat kesimi ve esnek şifon kumaşı ile hamilelik sürecinde konforlu bir kullanım sunar.",
    "Zarif ve şık tasarımıyla özel günlerde veya günlük kullanımda tercih edilebilir.",
    "Hamilelik boyunca değişen vücut hatlarına uyum sağlar, rahat hareket etme olanağı tanır.",
    "Hafif ve nefes alabilen yapısıyla sıcak havalarda bile serinlik sağlar.",
    "Kolay bakım imkanı sunar, çabuk kurur ve kırışmaz.",
    "Farklı renk ve desen seçenekleriyle kişisel zevke uygun kombinler yapılabilir.",
    "Elbisenin boyu 100 cm olup içi astarlıdır.",
  ],
  shipping: {
    title: "Ücretsiz Kargo",
    detail: "2.500 TL ve üzeri alışverişlerde ücretsiz kargo.",
  },
  exchange: {
    title: "Kolay Değişim",
    detail: "Beden desteği.",
  },
  payment: {
    title: "Güvenli Ödeme",
    detail: "SSL korumalı.",
  },
  sizeGuide: "/demo-assets/brand/beden.jpg",
  colors: [
    {
      id: "haki-krem",
      name: "HAKİ-KREM",
      hex: "#a3a89f",
      images: [
        "/demo-assets/product/haki/01.jpg",
        "/demo-assets/product/haki/02.jpg",
        "/demo-assets/product/haki/03.jpg",
        "/demo-assets/product/haki/04.jpg",
        "/demo-assets/product/haki/05.jpg",
      ],
    },
    {
      id: "petrol-krem",
      name: "PETROL-KREM",
      hex: "#2281aa",
      images: [
        "/demo-assets/product/petrol/01.jpg",
        "/demo-assets/product/petrol/02.jpg",
        "/demo-assets/product/petrol/03.jpg",
        "/demo-assets/product/petrol/04.jpg",
        "/demo-assets/product/petrol/05.jpg",
      ],
    },
    {
      id: "gulkurusu-bej",
      name: "GÜLKURUSU -BEJ",
      hex: "#c1aebb",
      images: [
        "/demo-assets/product/gulkurusu/01.jpg",
        "/demo-assets/product/gulkurusu/02.jpg",
        "/demo-assets/product/gulkurusu/03.jpg",
        "/demo-assets/product/gulkurusu/04.jpg",
        "/demo-assets/product/gulkurusu/05.jpg",
      ],
    },
    {
      id: "lila",
      name: "LİLA",
      hex: "#ddb6db",
      images: [
        "/demo-assets/product/lila/01.jpg",
        "/demo-assets/product/lila/02.jpg",
        "/demo-assets/product/lila/03.jpg",
        "/demo-assets/product/lila/04.jpg",
      ],
    },
  ] satisfies ColorVariant[],
} as const;

export const relatedProducts: RelatedProduct[] = [
  {
    id: "20",
    name: "HAMİLE ELBİSE- Çizgili Pamuk Dokuma+Düz Dokuma",
    category: "Hamile Elbisesi",
    price: 1995,
    originalPrice: 2650,
    image: "/demo-assets/related/cizgili-pamuk.jpg",
    hoverImage: "/demo-assets/related/cizgili-pamuk-2.jpg",
    href: "/e185-hamile-duz-orme-cizgili-dokuma-pamuklu-elbise",
    colors: ["#1406e0"],
  },
  {
    id: "32",
    name: "HAMİLE VİSKON ELBİSE",
    category: "Hamile Elbisesi",
    price: 2295,
    originalPrice: 2750,
    image: "/demo-assets/related/viskon-pembe.jpg",
    hoverImage: "/demo-assets/related/viskon-pembe-2.jpg",
    href: "/e175-hamile-viskon-kumas-elbise",
  },
  {
    id: "18",
    name: "VİSKON HAMİLE ELBİSE",
    category: "Hamile Elbisesi",
    price: 2450,
    originalPrice: 2750,
    image: "/demo-assets/related/viskon-siyah.jpg",
    hoverImage: "/demo-assets/related/viskon-siyah-2.jpg",
    href: "/e176-viskon-hamile-elbise",
  },
  {
    id: "16",
    name: "HAMİLE PAMUK KETEN ELBİSE",
    category: "Hamile Elbisesi",
    price: 2750,
    originalPrice: 3150,
    image: "/demo-assets/related/pamuk-keten.jpg",
    hoverImage: "/demo-assets/related/pamuk-keten-2.jpg",
    href: "/e174-hamile-pamuk-keten-elbise",
  },
  {
    id: "34",
    name: "HAMİLE EKOSE ELBİSE",
    category: "Hamile Elbisesi",
    price: 1750,
    originalPrice: 2250,
    image: "/demo-assets/related/ekose-kirmizi.jpg",
    href: "/e177-hamile-ekose-elbise",
  },
  {
    id: "30",
    name: "HAMİLE ELBİSE- Viskon Kumaş-Maksi boy",
    category: "Hamile Elbisesi",
    price: 2895,
    image: "/demo-assets/related/viskon-maxi.jpg",
    href: "/e178-hamile-viskon-maksi-elbise",
  },
  {
    id: "54",
    name: "HAMİLE ELBİSE PAMUK",
    category: "Hamile Elbisesi",
    price: 2395,
    image: "/demo-assets/related/pamuk-siyah.jpg",
    href: "/e166-hamile-elbise-pamuk",
  },
  {
    id: "62",
    name: "HAMİLE ŞİFON UZUN ELBİSE",
    category: "Hamile Elbisesi",
    price: 1995,
    image: "/demo-assets/related/sifon-uzun.jpg",
    href: "/6019-m010-hamile-uzun-sifon-elbise",
  },
  {
    id: "63",
    name: "HAMİLE EKOSE ELBİSE: E114",
    category: "Hamile Elbisesi",
    price: 990,
    image: "/demo-assets/related/ekose-e114.jpg",
    href: "/e114-m04-hamile-elbise-ekose",
  },
  {
    id: "37",
    name: "HAMİLE ŞİFON ELBİSE",
    category: "Hamile Elbisesi",
    price: 2950,
    image: "/demo-assets/related/sifon-3.jpg",
    href: "/e188-hamile-sifon-elbise-3",
    colors: ["#c3b6b6", "#2a8293", "#010005"],
  },
];

export const navItems = [
  {
    label: "Hamile Elbise",
    href: `${SITE_URL}/hamile-elbise`,
    icon: "sparkle",
    children: [
      {
        label: "Günlük Elbiseler",
        detail: "Gün boyu rahatlık sağlayan yumuşak kumaşlı elbiseler.",
        href: `${SITE_URL}/gunluk-hamile-elbiseleri`,
      },
      {
        label: "Özel Gün Elbiseleri",
        detail: "Davet, kutlama ve çekimler için zarif seçenekler.",
        href: `${SITE_URL}/ozel-gun-hamile-elbiseleri`,
      },
      {
        label: "Yazlık Elbiseler",
        detail: "Hafif, nefes alan ve ferah yazlık modeller.",
        href: `${SITE_URL}/yazlik-hamile-elbiseleri`,
      },
      {
        label: "Kışlık Elbiseler",
        detail: "Mevsime uygun sıcak ve konforlu elbiseler.",
        href: `${SITE_URL}/kislik-hamile-elbiseleri`,
      },
    ],
  },
  {
    label: "Emzirmeye uygun-Giyim",
    href: `${SITE_URL}/emzirmeye-uygun-giyim`,
    icon: "heart",
    children: [
      {
        label: "Emzirme işlevli Bluzlar",
        detail: "Pratik emzirme detaylı bluz seçenekleri.",
        href: `${SITE_URL}/emzirme-bluzlari`,
      },
      {
        label: "Emzirme Elbiseleri",
        detail: "Doğum sonrası da kullanılabilen rahat elbiseler.",
        href: `${SITE_URL}/emzirme-elbiseleri`,
      },
    ],
  },
  {
    label: "Hamile Tunik & Bluz",
    href: `${SITE_URL}/tunik-bluz`,
    icon: "shirt",
    children: [
      {
        label: "Hamile Tunik",
        detail: "Rahat kesimli günlük tunik modelleri.",
        href: `${SITE_URL}/hamile-tunik`,
      },
      {
        label: "Hamile Bluz",
        detail: "Yumuşak kumaşlı bluz seçenekleri.",
        href: `${SITE_URL}/hamile-bluz`,
      },
      {
        label: "Gömlek & Üst Giyim",
        detail: "Ofis ve günlük stile uygun üst giyim.",
        href: `${SITE_URL}/hamile-gomlek-ust-giyim`,
      },
    ],
  },
  {
    label: "Lohusa",
    href: `${SITE_URL}/lohusa`,
    icon: "gift",
    children: [
      {
        label: "Hastane Çıkışı",
        detail: "Doğum sonrası ilk günler için zarif seçimler.",
        href: `${SITE_URL}/hastane-cikisi`,
      },
    ],
  },
  {
    label: "Yeni Sezon",
    href: `${SITE_URL}/yeni-sezon`,
    icon: "sparkle2",
  },
] as const;

export function getColor(id: ColorId): ColorVariant {
  return product.colors.find((color) => color.id === id) ?? product.colors[0];
}

export function getVariantImage(color: ColorVariant, index: number) {
  return color.images[index] ?? color.images[0];
}

export function getMaxImageCount() {
  return Math.max(...product.colors.map((color) => color.images.length));
}
