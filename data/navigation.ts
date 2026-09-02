export type NavChild = {
  label: string;
  detail: string;
  href: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: "sparkle" | "heart" | "shirt" | "gift" | "sparkle2";
  children?: NavChild[];
};

export const navItems: NavItem[] = [
  {
    label: "Hamile Elbise",
    href: "/hamile-elbise",
    icon: "sparkle",
    children: [
      {
        label: "Günlük Elbiseler",
        detail: "Gün boyu rahatlık sağlayan yumuşak kumaşlı elbiseler.",
        href: "/gunluk-hamile-elbiseleri",
      },
      {
        label: "Özel Gün Elbiseleri",
        detail: "Davet, kutlama ve çekimler için zarif seçenekler.",
        href: "/ozel-gun-hamile-elbiseleri",
      },
      {
        label: "Yazlık Elbiseler",
        detail: "Hafif, nefes alan ve ferah yazlık modeller.",
        href: "/yazlik-hamile-elbiseleri",
      },
      {
        label: "Kışlık Elbiseler",
        detail: "Mevsime uygun sıcak ve konforlu elbiseler.",
        href: "/kislik-hamile-elbiseleri",
      },
    ],
  },
  {
    label: "Emzirmeye uygun-Giyim",
    href: "/emzirmeye-uygun-giyim",
    icon: "heart",
    children: [
      {
        label: "Emzirme işlevli Bluzlar",
        detail: "Pratik emzirme detaylı bluz seçenekleri.",
        href: "/emzirme-bluzlari",
      },
      {
        label: "Emzirme Elbiseleri",
        detail: "Doğum sonrası da kullanılabilen rahat elbiseler.",
        href: "/emzirme-elbiseleri",
      },
    ],
  },
  {
    label: "Hamile Tunik & Bluz",
    href: "/tunik-bluz",
    icon: "shirt",
    children: [
      {
        label: "Hamile Tunik",
        detail: "Rahat kesimli günlük tunik modelleri.",
        href: "/hamile-tunik",
      },
      {
        label: "Hamile Bluz",
        detail: "Yumuşak kumaşlı bluz seçenekleri.",
        href: "/hamile-bluz",
      },
      {
        label: "Gömlek & Üst Giyim",
        detail: "Ofis ve günlük stile uygun üst giyim.",
        href: "/hamile-gomlek-ust-giyim",
      },
    ],
  },
  {
    label: "Lohusa",
    href: "/lohusa",
    icon: "gift",
    children: [
      {
        label: "Hastane Çıkışı",
        detail: "Doğum sonrası ilk günler için zarif seçimler.",
        href: "/hastane-cikisi",
      },
    ],
  },
  {
    label: "Yeni Sezon",
    href: "/yeni-sezon",
    icon: "sparkle2",
  },
];

export const categoryMeta: Record<
  string,
  { title: string; eyebrow?: string; description: string }
> = {
  "hamile-elbise": {
    title: "Hamile Elbise",
    description: "Hamilelik süresince günlük ve özel günlerde giyebileceğiniz rahat, konforlu ve zarif elbiseler.",
  },
  "gunluk-hamile-elbiseleri": {
    title: "Günlük Elbiseler",
    description: "Gün boyu rahatlık sağlayan yumuşak kumaşlı hamile elbiseleri.",
  },
  "ozel-gun-hamile-elbiseleri": {
    title: "Özel Gün Elbiseleri",
    description: "Davet, kutlama ve çekimler için zarif hamile elbise seçenekleri.",
  },
  "yazlik-hamile-elbiseleri": {
    title: "Yazlık Elbiseler",
    description: "Hafif, nefes alan ve ferah yazlık hamile elbiseleri.",
  },
  "kislik-hamile-elbiseleri": {
    title: "Kışlık Elbiseler",
    description: "Mevsime uygun sıcak ve konforlu hamile elbiseleri.",
  },
  "emzirmeye-uygun-giyim": {
    title: "Emzirmeye uygun-Giyim",
    description: "Doğum sonrası emzirme için pratik, kullanışlı ve şık giysiler.",
  },
  "emzirme-giyim": {
    title: "Emzirme Giyim",
    description: "Emzirme dostu bluz, tunik ve elbise seçenekleri.",
  },
  "emzirme-bluzlari": {
    title: "Emzirme işlevli Bluzlar",
    description: "Pratik emzirme detaylı bluz seçenekleri.",
  },
  "emzirme-elbiseleri": {
    title: "Emzirme Elbiseleri",
    description: "Doğum sonrası da kullanılabilen rahat elbiseler.",
  },
  "tunik-bluz": {
    title: "Hamile Tunik & Bluz",
    description: "Yumuşak kumaşlı, günlük kullanıma uygun üst giyim seçenekleri.",
  },
  "hamile-tunik": {
    title: "Hamile Tunik",
    description: "Rahat kesimli günlük tunik modelleri.",
  },
  "hamile-bluz": {
    title: "Hamile Bluz",
    description: "Yumuşak kumaşlı bluz seçenekleri.",
  },
  "hamile-gomlek-ust-giyim": {
    title: "Gömlek & Üst Giyim",
    description: "Ofis ve günlük stile uygun üst giyim.",
  },
  lohusa: {
    title: "Lohusa",
    description: "Doğum sonrası konforlu ve zarif tamamlayıcılar.",
  },
  "hastane-cikisi": {
    title: "Hastane Çıkışı",
    description: "Doğum sonrası ilk günler için zarif seçimler.",
  },
  "yeni-sezon": {
    title: "Yeni Sezon",
    description: "Sezonun öne çıkan hamile giyim parçaları.",
  },
  "pantolon-tayt": {
    title: "Pantolon & Tayt",
    description: "Rahat kesimli hamile pantolon ve tayt seçenekleri.",
  },
  kategoriler: {
    title: "Kategoriler",
    description: "Entarim hamile giyim koleksiyonundaki tüm kategoriler.",
  },
};

export const homepageCategories = [
  {
    href: "/hamile-elbise",
    title: "Hamile Elbise",
    badge: "Koleksiyon",
    image: "/entarim/homepage/hamile-keten-elbise.jpg",
    featured: true,
    description:
      "Hamileliğiniz süresince, günlük ve özel günlerde giyebileceğiniz rahat, konforlu ve zarif elbiseler.",
  },
  {
    href: "/emzirmeye-uygun-giyim",
    title: "Emzirmeye uygun-Giyim",
    badge: "Koleksiyon",
    image: "/entarim/homepage/emzirme-detayli-bluz.jpg",
    description: "Doğum sonrası bebeği emzirmek için de kullanabileceğiniz pratik, kullanışlı ve şık giysiler.",
  },
  {
    href: "/tunik-bluz",
    title: "Hamile Tunik & Bluz",
    badge: "Koleksiyon",
    image: "/entarim/homepage/hamile-koton-tunik.jpg",
    description: "Yumuşak kumaşlı, günlük kullanıma uygun üst giyim seçenekleri.",
  },
  {
    href: "/lohusa",
    title: "Lohusa",
    badge: "Koleksiyon",
    image: "/entarim/homepage/hamile-elbise-belmando.jpg",
    description: "Doğum sonrası konforlu ve zarif tamamlayıcılar.",
  },
  {
    href: "/yeni-sezon",
    title: "Yeni Sezon",
    badge: "Koleksiyon",
    image: "/entarim/homepage/emzirme-detayli-bluz.jpg",
    description: "Sezonun öne çıkan hamile giyim parçaları.",
  },
];

export const extraInfoPages = [
  { slug: "cayma-hakki", title: "Cayma Hakkı" },
  { slug: "sss", title: "Sıkça Sorulan Sorular" },
  { slug: "satici-bilgileri", title: "Satıcı Bilgileri" },
  { slug: "guvenli-odeme", title: "Güvenli Ödeme" },
  { slug: "kullanim-kosullari", title: "Kullanım Koşulları" },
  { slug: "mesafeli-satis-sozlesmesi", title: "Mesafeli Satış Sözleşmesi" },
  { slug: "on-bilgilendirme-formu", title: "Ön Bilgilendirme Formu" },
  { slug: "uyelik-sozlesmesi", title: "Üyelik Sözleşmesi" },
  { slug: "cerez-politikasi", title: "Çerez Politikası" },
  { slug: "siparis-takibi", title: "Sipariş Takibi" },
];
