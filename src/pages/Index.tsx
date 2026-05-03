import { Instagram, MapPin, Music2 } from "lucide-react";
import vouteLogo from "@/assets/voute-logo.png";
import hotCoffee from "@/assets/hot-coffee.jpg";
import coldCoffee from "@/assets/cold-coffee.jpg";
import specialtyDrinks from "@/assets/specialty-drinks.jpg";

const menu = [
  {
    category: "قهوة ساخنة",
    image: hotCoffee,
    items: [
      { name: "إسبريسو", price: "10" },
      { name: "أمريكانو", price: "12" },
      { name: "كابتشينو", price: "15" },
      { name: "لاتيه", price: "16" },
      { name: "فلات وايت", price: "16" },
      { name: "في 60", price: "20" },
    ],
  },
  {
    category: "قهوة باردة",
    image: coldCoffee,
    items: [
      { name: "آيس أمريكانو", price: "14" },
      { name: "آيس لاتيه", price: "17" },
      { name: "آيس سبانيش لاتيه", price: "19" },
      { name: "كولد برو", price: "18" },
      { name: "آيس موكا", price: "20" },
      { name: "في 60 بارد", price: "22" },
    ],
  },
  {
    category: "إضافات ومشروبات",
    image: specialtyDrinks,
    items: [
      { name: "ماتشا لاتيه", price: "22" },
      { name: "شوكولاتة ساخنة", price: "18" },
      { name: "شاي كرك", price: "10" },
      { name: "حليب نباتي", price: "+3" },
      { name: "شوت إضافي", price: "+3" },
      { name: "نكهات", price: "+2" },
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-background">
        <div className="absolute inset-0">
          <div className="absolute inset-0 sadu-pattern opacity-50" />
          <img
            src={vouteLogo}
            alt="شعار كافيه ڤوت VOUTE"
            className="absolute inset-0 m-auto w-[80%] max-w-[600px] opacity-[0.07] object-contain"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <img
            src={vouteLogo}
            alt="شعار ڤوت"
            className="w-24 md:w-28 mx-auto mb-6 animate-fade-in-slow"
          />
          <p className="text-gold tracking-[0.5em] text-sm md:text-base mb-4 animate-fade-in-slow">
            VOUTE • ڤـوت
          </p>
          <div className="gold-divider animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <span className="text-gold text-xl">❖</span>
          </div>
          <h1
            className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight text-coffee mt-4 animate-fade-in"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            نُقدّم لك فنّاً
            <br />
            في كلّ كوب
          </h1>
          <p
            className="mt-8 text-muted-foreground text-base md:text-lg animate-fade-in"
            style={{ animationDelay: "0.7s", opacity: 0 }}
          >
            قهوة مختصة بلمسة تراثية سعودية، حيث تلتقي الأصالة بالذوق الرفيع.
          </p>
          <a
            href="#menu"
            className="inline-block mt-10 px-10 py-3 rounded-full bg-gradient-gold text-cream font-semibold tracking-wider shadow-gold hover:scale-105 transition-transform duration-500 animate-fade-in"
            style={{ animationDelay: "1s", opacity: 0 }}
          >
            تصفّح المنيو
          </a>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="relative py-24 md:py-32">
        <div className="absolute inset-0 sadu-pattern opacity-40 pointer-events-none" />
        <img
          src={vouteLogo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 m-auto w-[60%] max-w-[500px] opacity-[0.04] object-contain pointer-events-none"
        />
        <div className="container relative">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-4">M E N U</p>
            <h2 className="font-display text-4xl md:text-5xl text-coffee">المنيو</h2>
            <div className="gold-divider mt-4">
              <span className="text-gold">❖</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto mt-4">
              مختاراتنا من القهوة المختصة، محضّرة بحب وشغف.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menu.map((cat) => (
              <div key={cat.category} className="menu-card overflow-hidden !p-0 flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.category}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                </div>
                <div className="p-5 pt-3 flex-1 flex flex-col">
                  <h3 className="font-display text-2xl text-center text-coffee mb-2">
                    {cat.category}
                  </h3>
                  <div className="gold-divider !my-3">
                    <span className="text-gold text-sm">❖</span>
                  </div>
                  <ul className="space-y-4 mt-2">
                    {cat.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-baseline justify-between gap-3 text-foreground"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="flex-1 border-b border-dashed border-border/70 mx-2" />
                        <span className="text-gold font-semibold whitespace-nowrap">
                          {item.price} <span className="text-xs">ر.س</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="relative py-24 md:py-28 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 sadu-pattern opacity-20 pointer-events-none" />
        <img
          src={vouteLogo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 m-auto w-[60%] max-w-[500px] opacity-[0.05] object-contain pointer-events-none invert"
        />
        <div className="container relative text-center">
          <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-4">CONNECT</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream">تواصل معنا</h2>
          <div className="gold-divider mt-4">
            <span className="text-gold">❖</span>
          </div>
          <p className="text-cream/70 max-w-md mx-auto mt-4">
            تابعنا على منصات التواصل وزُر فرعنا.
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-10 mt-12">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="إنستقرام"
              className="social-icon"
            >
              <Instagram className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيك توك"
              className="social-icon"
            >
              <Music2 className="w-6 h-6 md:w-7 md:h-7" />
            </a>
            <a
              href="https://maps.app.goo.gl/LxvH6QnXXkyr3k1cA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="الموقع على قوقل ماب"
              className="social-icon"
            >
              <MapPin className="w-6 h-6 md:w-7 md:h-7" />
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-cream/10">
            <p className="font-display text-2xl text-gold tracking-widest">VOUTE • ڤـوت</p>
            <p className="text-cream/50 text-sm mt-2">
              © {new Date().getFullYear()} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
