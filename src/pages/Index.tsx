import { useEffect, useState } from "react";
import { Instagram, MapPin, Music2, Coffee, Gift } from "lucide-react";
import vouteLogo from "@/assets/voute-logo.png";
import { supabase } from "@/integrations/supabase/client";

type Category = { id: string; name: string; sort_order: number; image_url?: string | null };
type Product = {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
};

const Index = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").eq("is_available", true).order("sort_order"),
      ]);
      setCats(c ?? []);
      setProds(p ?? []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-background">
        <div className="absolute inset-0">
          <div className="absolute inset-0 sadu-pattern opacity-70" />
          <img
            src={vouteLogo}
            alt="شعار كافيه ڤوت VOUTE"
            className="absolute inset-0 m-auto w-[70%] max-w-[520px] opacity-[0.06] object-contain"
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
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#menu"
              className="inline-block px-10 py-3 rounded-full bg-gradient-gold text-cream font-semibold tracking-wider shadow-gold hover:scale-105 transition-transform duration-500 animate-fade-in"
              style={{ animationDelay: "1s", opacity: 0 }}
            >
              تصفّح المنيو
            </a>
            <a
              href="https://easymenu.site/loyalty-wallet/Voute/branch/CODE1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-card text-coffee border-2 border-gold/70 font-semibold tracking-wider hover:bg-gradient-gold hover:text-cream hover:border-transparent hover:scale-105 transition-all duration-500 animate-fade-in shadow-elegant"
              style={{ animationDelay: "1.2s", opacity: 0 }}
            >
              <Gift className="w-5 h-5" />
              برنامج الولاء
            </a>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="relative py-24 md:py-32">
        <div className="absolute inset-0 sadu-pattern opacity-60 pointer-events-none" />
        <img
          src={vouteLogo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 m-auto w-[55%] max-w-[420px] opacity-[0.05] object-contain pointer-events-none"
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

          {/* Category filter buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
            <button
              onClick={() => setActiveCat("all")}
              className={`px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-semibold tracking-wider transition-all duration-500 border ${
                activeCat === "all"
                  ? "bg-gradient-gold text-cream border-transparent shadow-gold scale-105"
                  : "bg-card text-coffee border-border hover:border-gold/60 hover:-translate-y-0.5"
              }`}
            >
              الكل
            </button>
            {cats.slice(0, 3).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-6 md:px-8 py-2.5 rounded-full text-sm md:text-base font-semibold tracking-wider transition-all duration-500 border ${
                  activeCat === cat.id
                    ? "bg-gradient-gold text-cream border-transparent shadow-gold scale-105"
                    : "bg-card text-coffee border-border hover:border-gold/60 hover:-translate-y-0.5"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cats.filter((c) => activeCat === "all" || c.id === activeCat).map((cat) => {
              const items = prods.filter((p) => p.category_id === cat.id);
              const cover = cat.image_url || items.find((i) => i.image_url)?.image_url;
              return (
                <div key={cat.id} className="menu-card overflow-hidden !p-0 flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-muted">
                    {cover ? (
                      <img
                        src={cover}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee className="w-10 h-10 text-gold/60" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  </div>
                  <div className="p-5 pt-3 flex-1 flex flex-col">
                    <h3 className="font-display text-2xl text-center text-coffee mb-2">
                      {cat.name}
                    </h3>
                    <div className="gold-divider !my-3">
                      <span className="text-gold text-sm">❖</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {items.length === 0 && (
                        <div className="col-span-2 text-center text-sm text-muted-foreground py-6">
                          لا توجد منتجات بعد
                        </div>
                      )}
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-background/60 rounded-xl border border-border/60 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                        >
                          {item.image_url ? (
                            <div className="aspect-square overflow-hidden bg-muted">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square flex items-center justify-center bg-muted">
                              <Coffee className="w-8 h-8 text-gold/50" />
                            </div>
                          )}
                          <div className="p-2.5 flex flex-col items-center text-center gap-1">
                            <span className="font-medium text-sm text-foreground line-clamp-1">{item.name}</span>
                            <span className="text-gold font-semibold text-sm">
                              {item.price} <span className="text-[10px]">ر.س</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* SOCIAL */}
      <section className="relative py-24 md:py-28 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 sadu-pattern opacity-30 pointer-events-none" />
        <img
          src={vouteLogo}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 m-auto w-[55%] max-w-[420px] opacity-[0.08] object-contain pointer-events-none invert"
        />
        <div className="container relative text-center">
          <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-4">CONNECT</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream">تواصل معنا</h2>
          <div className="gold-divider mt-4">
            <span className="text-gold">❖</span>
          </div>
          <p className="text-cream/70 max-w-md mx-auto mt-4">
            تابعنا وشارك تجربتك
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
