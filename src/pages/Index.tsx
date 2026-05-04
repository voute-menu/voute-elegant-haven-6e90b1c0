import { useEffect, useState } from "react";
import { Instagram, MapPin, Music2, Coffee, Gift } from "lucide-react";
import vouteLogo from "@/assets/voute-logo.png";
import { supabase } from "@/integrations/supabase/client";

// Auto-reveal elements with .reveal class on scroll
const useScrollReveal = (deps: unknown[] = []) => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

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
type Branch = { id: string; name: string; sort_order: number; address?: string | null; maps_url?: string | null };

const Index = () => {
  const [cats, setCats] = useState<Category[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pb, setPb] = useState<{ product_id: string; branch_id: string }[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const [{ data: c }, { data: p }, { data: b }, { data: m }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").eq("is_available", true).order("sort_order"),
        supabase.from("branches").select("*").order("sort_order"),
        supabase.from("product_branches").select("*"),
      ]);
      setCats(c ?? []);
      setProds(p ?? []);
      setBranches(b ?? []);
      setPb(m ?? []);
    };
    load();
  }, []);

  useScrollReveal([cats.length, prods.length, branches.length, activeCat]);

  const branchesForProduct = (pid: string) =>
    pb.filter((x) => x.product_id === pid).map((x) => branches.find((b) => b.id === x.branch_id)?.name).filter(Boolean) as string[];

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
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
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
              ولاء
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
          <div className="text-center mb-16 reveal">
            <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-4">M E N U</p>
            <h2 className="font-display text-4xl md:text-5xl text-coffee">المنيو</h2>
            <div className="gold-divider mt-4">
              <span className="text-gold">❖</span>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto mt-4">
              حقيقية تُروى بكوب قهوة.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cats.filter((c) => activeCat === "all" || c.id === activeCat).map((cat) => {
              const items = prods.filter((p) => p.category_id === cat.id);
              const cover = cat.image_url || items.find((i) => i.image_url)?.image_url;
              return (
                <div key={cat.id} className="menu-card reveal overflow-hidden !p-0 flex flex-col">
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
                      {items.map((item) => {
                        const itemBranches = branchesForProduct(item.id);
                        const limited = branches.length > 0 && itemBranches.length > 0 && itemBranches.length < branches.length;
                        return (
                        <div
                          key={item.id}
                          className="bg-background/60 rounded-xl border border-border/60 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow relative"
                        >
                          {limited && (
                            <div className="absolute top-2 right-2 z-10 bg-gold/95 text-cream text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-gold">
                              {itemBranches.length === 1 ? itemBranches[0] : `${itemBranches.length} فروع`}
                            </div>
                          )}
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
                              {Number(item.price).toFixed(2)} <span className="text-[10px]">ر.س</span>
                            </span>
                            {limited && (
                              <span className="text-[10px] text-muted-foreground line-clamp-1">
                                متوفر في: {itemBranches.join("، ")}
                              </span>
                            )}
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* BRANCHES */}
      <section id="branches" className="relative py-20 md:py-24 bg-card">
        <div className="absolute inset-0 sadu-pattern opacity-40 pointer-events-none" />
        <div className="container relative">
          <div className="text-center mb-12 reveal">
            <p className="text-gold tracking-[0.4em] text-xs md:text-sm mb-4">BRANCHES</p>
            <h2 className="font-display text-4xl md:text-5xl text-coffee">فروعنا</h2>
            <div className="gold-divider mt-4">
              <span className="text-gold">❖</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {branches.map((b) => (
              <div key={b.id} className="menu-card reveal text-center flex flex-col items-center gap-3">
                <MapPin className="w-7 h-7 text-gold" />
                <h3 className="font-display text-2xl text-coffee">{b.name}</h3>
                {b.address && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.address}</p>
                )}
                {b.maps_url && (
                  <a
                    href={b.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-gold text-cream text-sm font-semibold tracking-wider shadow-gold hover:scale-105 transition-transform"
                  >
                    <MapPin className="w-4 h-4" />
                    افتح في الخرائط
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


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

          <div className="flex items-center justify-center gap-8 md:gap-12 mt-56 md:mt-64">
            <a
              href="https://www.instagram.com/voutecafe?igsh=Z2FlM2RndThvYWNo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="إنستقرام"
              className="social-icon"
            >
              <Instagram className="w-9 h-9 md:w-11 md:h-11" strokeWidth={1.8} />
            </a>
            <a
              href="https://www.tiktok.com/@vooute"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيك توك"
              className="social-icon"
            >
              <Music2 className="w-9 h-9 md:w-11 md:h-11" strokeWidth={1.8} />
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-cream/10">
            <p className="font-display text-2xl text-gold tracking-widest">VOUTE</p>
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
