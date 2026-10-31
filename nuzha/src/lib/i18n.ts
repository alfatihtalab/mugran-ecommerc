export type Locale = "en" | "ar";
export const locales: Locale[] = ["en", "ar"];
export const isLocale = (v: string): v is Locale => v === "en" || v === "ar";
export const dir = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

const en = {
  brand: "Nuzha",
  tagline: "Shopping, as a stroll.",
  nav: { new: "New", textiles: "Textiles", ceramics: "Ceramics", wood: "Wood", lighting: "Lighting", beauty: "Beauty", sale: "Sale", cart: "Cart", account: "Account", admin: "Admin" },
  home: {
    badge: "New season",
    title: "The autumn edit, now in store.",
    sub: "Ninety objects, chosen slowly. One shipment. Free returns within 30 days.",
    shop: "Shop the edit",
    browse: "Browse all",
    byCategory: "Shop by category",
    allCategories: "All categories",
    newArrivals: "New arrivals",
    viewAll: "View all",
    editorialTitle: "Objects for a slower home.",
    editorialBody: "We buy from small workshops across the region and ship from one warehouse in Riyadh.",
    ourStory: "Our story",
    promises: [
      ["Free returns", "Within 30 days, back to the original payment method."],
      ["Pay how you like", "Mada, cards, Apple Pay, or cash on delivery."],
      ["Fast shipping", "From Riyadh in two days, anywhere in the Kingdom."],
    ],
  },
  collection: { home: "Home", all: "All products", items: "items", sort: "Sort", newest: "Newest", priceLow: "Price: low to high", priceHigh: "Price: high to low", filters: "Filters", colour: "Colour", price: "Price", availability: "Availability", inStock: "In stock", clear: "Clear filters", empty: "Nothing matches these filters." },
  product: { new: "New", limited: "Limited", soldOut: "Sold out", inclVat: "incl. VAT · free shipping over 300", colour: "Colour", size: "Size", sizeGuide: "Size guide", addToCart: "Add to cart", buyNow: "Buy now with Apple Pay", promises: ["In stock · ships from Riyadh in 2 days", "Free returns within 30 days", "Mada, cards, Apple Pay or cash on delivery"], details: "Details & care", shipping: "Shipping & returns", workshop: "The workshop", shippingBody: "Standard delivery is free over 300 SAR and takes 2–3 business days from our Riyadh warehouse. Returns are free for 30 days.", workshopBody: "Every piece is made in a small workshop we have visited. We pay on order, not on sale.", alsoLike: "You may also like", added: "Added to cart", left: "left" },
  cart: { title: "Your cart", empty: "Your cart is empty.", continue: "Continue shopping", subtotal: "Subtotal", shipping: "Shipping", vat: "VAT (15%)", total: "Total", checkout: "Checkout", free: "Free", freeShippingUnlocked: "You’ve unlocked free shipping.", freeShippingRemaining: "Add {n} more for free shipping.", remove: "Remove", qty: "Qty" },
  checkout: {
    title: "Checkout", steps: ["Information", "Shipping", "Payment"],
    contact: "Contact", email: "Email address", phone: "Phone", phoneHelp: "For delivery updates", emailHelp: "We send the receipt here",
    shippingAddress: "Shipping address", fullName: "Full name", address: "Address", city: "City", postal: "Postal code",
    shippingMethod: "Shipping method", methods: [["Standard", "2–3 business days · Riyadh warehouse"], ["Express", "Next business day before 6 pm"], ["Pick up in store", "Nuzha Riyadh · ready in 2 hours"]],
    paymentMethod: "Payment method", pay: { mada: ["Mada", "Mada debit card"], card: ["Credit card", "Visa or Mastercard"], applepay: ["Apple Pay", "Pay with a touch"], cod: ["Cash on delivery", "10.00 SAR fee"] },
    cardNumber: "Card number", expiry: "Expiry", cvc: "Security code", terms: "I agree to the terms and the return policy.",
    back: "Back", continueShipping: "Continue to shipping", continuePayment: "Continue to payment", payNow: "Pay", summary: "Order summary", discount: "Discount code", apply: "Apply", change: "Change", shipTo: "Ship to", required: "Required", invalidEmail: "Enter a valid email address.", codFee: "Cash on delivery fee", processing: "Processing…", discountApplied: "10% off applied", discountInvalid: "Code not recognised",
  },
  confirmation: { thanks: "Thank you, {name}.", body: "Order #{id} is confirmed. A receipt is on its way to {email}, and we’ll message you when it ships from Riyadh.", order: "Order", paid: "Paid", deliveringTo: "Delivering to", arrival: "Estimated arrival", next: "What happens next", steps: [["Confirmed", "Just now · payment captured"], ["Packed", "Within 24 hours at the Riyadh warehouse"], ["Shipped", "Tracking link by SMS and email"], ["Delivered", "Free returns for 30 days after"]], track: "Track order", continue: "Continue shopping", totalPaid: "Total paid", notFound: "We couldn’t find that order." },
  account: { title: "Your orders", empty: "No orders yet. Place one and it will appear here, and in the admin.", view: "View", status: "Status", date: "Date", total: "Total", items: "items" },
  footer: { shop: "Shop", help: "Help", store: "Store", links: { help: [["shipping", "Shipping"], ["returns", "Returns & refunds"], ["payments", "Payment methods"], ["contact", "Contact"]], store: [["about", "About Nuzha"], ["privacy", "Privacy"], ["terms", "Terms"]] }, rights: "© 2026 Nuzha. All rights reserved.", locale: "English · SAR", deployment: "Isolated deployment · Riyadh store" },
  status: { paid: "Paid", fulfilled: "Fulfilled", shipped: "Shipped", refunded: "Refunded", partially_refunded: "Partially refunded", cod: "Cash on delivery", pending: "Pending" },
  currency: "SAR",
  info: {
    shipping: ["Shipping", "Standard delivery is free on orders over 300 SAR and takes 2–3 business days from our Riyadh warehouse. Express delivers the next business day for 25 SAR. You can also pick up in store at Nuzha Riyadh within two hours."],
    returns: ["Returns & refunds", "Return anything within 30 days, no questions asked. Refunds go back to the original payment method within 3–5 business days. Cash on delivery orders are refunded by bank transfer."],
    payments: ["Payment methods", "We accept Mada, Visa, Mastercard, Apple Pay and cash on delivery (10 SAR fee, orders up to 2,000 SAR). All card payments use 3-D Secure."],
    contact: ["Contact", "Write to hello@nuzha.app or message us on +966 55 123 4567, Saturday to Thursday, 9 am to 6 pm."],
    about: ["About Nuzha", "Nuzha means an unhurried stroll. We buy from small workshops across the region, keep ninety objects in stock at a time, and ship from a single warehouse in Riyadh."],
    privacy: ["Privacy", "We store only what an order needs: your name, address and contact details. Nothing is shared with other stores; each Nuzha store runs on its own isolated stack."],
    terms: ["Terms", "Prices include 15% VAT. Orders are confirmed by email. These terms are governed by the laws of the Kingdom of Saudi Arabia."],
  },
};

const ar: typeof en = {
  brand: "نزهة",
  tagline: "تسوّق كما لو كنت في نزهة.",
  nav: { new: "جديد", textiles: "المنسوجات", ceramics: "الفخار", wood: "الخشب", lighting: "الإضاءة", beauty: "العناية", sale: "تخفيضات", cart: "السلة", account: "حسابي", admin: "الإدارة" },
  home: {
    badge: "وصل حديثًا",
    title: "تشكيلة الخريف، الآن في المتجر.",
    sub: "تسعون قطعة مختارة بعناية. شحنة واحدة. إرجاع مجاني خلال 30 يومًا.",
    shop: "تسوّق التشكيلة",
    browse: "تصفّح الكل",
    byCategory: "تسوّق حسب الفئة",
    allCategories: "كل الفئات",
    newArrivals: "وصل حديثًا",
    viewAll: "عرض الكل",
    editorialTitle: "أشياءٌ لبيتٍ أهدأ.",
    editorialBody: "نختار من ورش صغيرة في المنطقة، ونشحن من مستودع واحد في الرياض.",
    ourStory: "قصتنا",
    promises: [
      ["إرجاع مجاني", "خلال 30 يومًا، إلى طريقة الدفع الأصلية."],
      ["ادفع كما تحب", "مدى، بطاقات، Apple Pay، أو الدفع عند الاستلام."],
      ["شحن سريع", "من الرياض خلال يومين إلى كل المملكة."],
    ],
  },
  collection: { home: "الرئيسية", all: "كل المنتجات", items: "قطعة", sort: "ترتيب", newest: "الأحدث", priceLow: "السعر: من الأقل", priceHigh: "السعر: من الأعلى", filters: "تصفية", colour: "اللون", price: "السعر", availability: "التوفر", inStock: "متوفر", clear: "مسح التصفية", empty: "لا توجد نتائج لهذه التصفية." },
  product: { new: "جديد", limited: "كمية محدودة", soldOut: "نفد", inclVat: "شامل الضريبة · شحن مجاني فوق 300", colour: "اللون", size: "المقاس", sizeGuide: "دليل المقاسات", addToCart: "أضف إلى السلة", buyNow: "اشترِ الآن بـ Apple Pay", promises: ["متوفر · يُشحن من الرياض خلال يومين", "إرجاع مجاني خلال 30 يومًا", "مدى، بطاقات، Apple Pay أو الدفع عند الاستلام"], details: "التفاصيل والعناية", shipping: "الشحن والإرجاع", workshop: "الورشة", shippingBody: "التوصيل العادي مجاني فوق 300 ر.س ويستغرق 2–3 أيام عمل من مستودعنا في الرياض. الإرجاع مجاني خلال 30 يومًا.", workshopBody: "كل قطعة مصنوعة في ورشة صغيرة زرناها بأنفسنا. ندفع عند الطلب، لا عند البيع.", alsoLike: "قد يعجبك أيضًا", added: "أُضيف إلى السلة", left: "متبقٍ" },
  cart: { title: "سلتك", empty: "سلتك فارغة.", continue: "متابعة التسوق", subtotal: "المجموع الفرعي", shipping: "الشحن", vat: "ضريبة القيمة المضافة 15%", total: "الإجمالي", checkout: "إتمام الشراء", free: "مجاني", freeShippingUnlocked: "حصلت على شحن مجاني.", freeShippingRemaining: "أضف {n} للحصول على شحن مجاني.", remove: "إزالة", qty: "الكمية" },
  checkout: {
    title: "إتمام الشراء", steps: ["معلوماتك", "الشحن", "الدفع"],
    contact: "التواصل", email: "البريد الإلكتروني", phone: "رقم الجوال", phoneHelp: "لتحديثات التوصيل", emailHelp: "نرسل الإيصال إلى هذا البريد",
    shippingAddress: "عنوان الشحن", fullName: "الاسم الكامل", address: "العنوان", city: "المدينة", postal: "الرمز البريدي",
    shippingMethod: "طريقة الشحن", methods: [["عادي", "2–3 أيام عمل · مستودع الرياض"], ["سريع", "يوم العمل التالي قبل 6 مساءً"], ["استلام من المتجر", "نزهة الرياض · جاهز خلال ساعتين"]],
    paymentMethod: "طريقة الدفع", pay: { mada: ["مدى", "بطاقة مدى البنكية"], card: ["بطاقة ائتمانية", "فيزا أو ماستركارد"], applepay: ["Apple Pay", "ادفع بلمسة"], cod: ["الدفع عند الاستلام", "رسوم 10.00 ر.س"] },
    cardNumber: "رقم البطاقة", expiry: "تاريخ الانتهاء", cvc: "رمز الأمان", terms: "أوافق على الشروط وسياسة الإرجاع.",
    back: "رجوع", continueShipping: "متابعة إلى الشحن", continuePayment: "متابعة إلى الدفع", payNow: "ادفع", summary: "ملخص الطلب", discount: "رمز الخصم", apply: "تطبيق", change: "تغيير", shipTo: "الشحن إلى", required: "مطلوب", invalidEmail: "أدخل بريدًا إلكترونيًا صحيحًا.", codFee: "رسوم الدفع عند الاستلام", processing: "جارٍ المعالجة…", discountApplied: "تم تطبيق خصم 10%", discountInvalid: "الرمز غير معروف",
  },
  confirmation: { thanks: "شكرًا لك، {name}.", body: "تم تأكيد الطلب #{id}. الإيصال في طريقه إلى {email}، وسنراسلك عند الشحن من الرياض.", order: "الطلب", paid: "مدفوع", deliveringTo: "التوصيل إلى", arrival: "الوصول المتوقع", next: "ماذا بعد", steps: [["تم التأكيد", "الآن · تم تحصيل الدفع"], ["التجهيز", "خلال 24 ساعة في مستودع الرياض"], ["الشحن", "رابط التتبع عبر الرسائل والبريد"], ["التوصيل", "إرجاع مجاني لمدة 30 يومًا بعدها"]], track: "تتبّع الطلب", continue: "متابعة التسوق", totalPaid: "الإجمالي المدفوع", notFound: "لم نعثر على هذا الطلب." },
  account: { title: "طلباتك", empty: "لا طلبات بعد. أتمم طلبًا وسيظهر هنا وفي لوحة الإدارة.", view: "عرض", status: "الحالة", date: "التاريخ", total: "الإجمالي", items: "قطع" },
  footer: { shop: "تسوّق", help: "مساعدة", store: "المتجر", links: { help: [["shipping", "الشحن"], ["returns", "الإرجاع والاسترداد"], ["payments", "طرق الدفع"], ["contact", "تواصل معنا"]], store: [["about", "عن نزهة"], ["privacy", "الخصوصية"], ["terms", "الشروط"]] }, rights: "© 2026 نزهة. جميع الحقوق محفوظة.", locale: "العربية · ر.س", deployment: "نشر معزول · متجر الرياض" },
  status: { paid: "مدفوع", fulfilled: "تم التجهيز", shipped: "تم الشحن", refunded: "مسترد", partially_refunded: "مسترد جزئيًا", cod: "الدفع عند الاستلام", pending: "قيد الانتظار" },
  currency: "ر.س",
  info: {
    shipping: ["الشحن", "التوصيل العادي مجاني للطلبات فوق 300 ر.س ويستغرق 2–3 أيام عمل من مستودعنا في الرياض. التوصيل السريع في يوم العمل التالي مقابل 25 ر.س. يمكنك أيضًا الاستلام من متجر نزهة الرياض خلال ساعتين."],
    returns: ["الإرجاع والاسترداد", "أرجع أي قطعة خلال 30 يومًا دون أسئلة. يعود المبلغ إلى طريقة الدفع الأصلية خلال 3–5 أيام عمل. طلبات الدفع عند الاستلام تُسترد بتحويل بنكي."],
    payments: ["طرق الدفع", "نقبل مدى وفيزا وماستركارد وApple Pay والدفع عند الاستلام (رسوم 10 ر.س، للطلبات حتى 2,000 ر.س). جميع مدفوعات البطاقات محمية بـ 3-D Secure."],
    contact: ["تواصل معنا", "راسلنا على hello@nuzha.app أو عبر +966 55 123 4567، من السبت إلى الخميس، 9 صباحًا حتى 6 مساءً."],
    about: ["عن نزهة", "نزهة تعني التجوّل بلا عجلة. نختار من ورش صغيرة في المنطقة، نحتفظ بتسعين قطعة في المخزون في كل مرة، ونشحن من مستودع واحد في الرياض."],
    privacy: ["الخصوصية", "نحتفظ فقط بما يحتاجه الطلب: اسمك وعنوانك وبيانات التواصل. لا نشارك شيئًا مع متاجر أخرى؛ كل متجر نزهة يعمل على بنية معزولة خاصة به."],
    terms: ["الشروط", "الأسعار شاملة ضريبة القيمة المضافة 15%. تُؤكَّد الطلبات بالبريد الإلكتروني. تخضع هذه الشروط لأنظمة المملكة العربية السعودية."],
  },
};

export const dict = { en, ar } as const;
export type Dict = typeof en;
export const t = (l: Locale): Dict => dict[l];
export const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
