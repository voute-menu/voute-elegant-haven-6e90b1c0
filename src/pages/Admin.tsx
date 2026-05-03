import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Pencil, Plus, LogOut, ArrowRight, Image as ImageIcon } from "lucide-react";

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

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [prods, setProds] = useState<Product[]>([]);

  // forms
  const [newCat, setNewCat] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState("");

  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCat, setPCat] = useState<string>("");
  const [pFile, setPFile] = useState<File | null>(null);
  const [pSubmitting, setPSubmitting] = useState(false);

  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/auth");
        return;
      }
      const uid = sess.session.user.id;
      if (!mounted) return;
      setUserId(uid);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      let admin = !!roles?.some((r) => r.role === "admin");
      if (!admin) {
        const { data: claimed } = await supabase.rpc("claim_first_admin");
        if (claimed) admin = true;
      }
      setIsAdmin(admin);
      await loadData();
      setLoading(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const loadData = async () => {
    const [{ data: c }, { data: p }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("sort_order"),
    ]);
    setCats(c ?? []);
    setProds(p ?? []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Categories
  const addCategory = async () => {
    if (!newCat.trim()) return;
    const { error } = await supabase
      .from("categories")
      .insert({ name: newCat.trim(), sort_order: cats.length });
    if (error) return toast.error(error.message);
    setNewCat("");
    toast.success("تمت إضافة الفئة");
    loadData();
  };
  const updateCategory = async (id: string) => {
    const { error } = await supabase.from("categories").update({ name: editingCatName }).eq("id", id);
    if (error) return toast.error(error.message);
    setEditingCatId(null);
    loadData();
  };
  const deleteCategory = async (id: string) => {
    if (!confirm("حذف الفئة وكل منتجاتها؟")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    loadData();
  };

  // Products
  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) {
      toast.error(error.message);
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };
  const updateCategoryImage = async (id: string, file: File | null) => {
    let image_url: string | null = null;
    if (file) {
      image_url = await uploadImage(file);
      if (!image_url) return;
    }
    const { error } = await supabase.from("categories").update({ image_url }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(file ? "تم تحديث الصورة" : "تم إزالة الصورة");
    loadData();
  };

  const addProduct = async () => {
    if (!pName.trim() || !pCat) return toast.error("الاسم والفئة مطلوبة");
    setPSubmitting(true);
    let image_url: string | null = null;
    if (pFile) image_url = await uploadImage(pFile);
    const { error } = await supabase.from("products").insert({
      name: pName.trim(),
      price: Number(pPrice) || 0,
      category_id: pCat,
      image_url,
      sort_order: prods.filter((p) => p.category_id === pCat).length,
    });
    setPSubmitting(false);
    if (error) return toast.error(error.message);
    setPName("");
    setPPrice("");
    setPFile(null);
    toast.success("تمت إضافة المنتج");
    loadData();
  };

  const saveEdit = async () => {
    if (!editingProd) return;
    let image_url = editingProd.image_url;
    if (editFile) {
      const url = await uploadImage(editFile);
      if (url) image_url = url;
    }
    const { error } = await supabase
      .from("products")
      .update({
        name: editingProd.name,
        price: editingProd.price,
        category_id: editingProd.category_id,
        is_available: editingProd.is_available,
        image_url,
      })
      .eq("id", editingProd.id);
    if (error) return toast.error(error.message);
    setEditingProd(null);
    setEditFile(null);
    loadData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("حذف المنتج؟")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    loadData();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8 space-y-4">
          <h2 className="font-display text-2xl">لا تملك صلاحية الإدارة</h2>
          <p className="text-muted-foreground text-sm">
            تواصل مع المالك لإضافتك كأدمن.
          </p>
          <Button onClick={logout} variant="outline">تسجيل الخروج</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-foreground">لوحة إدارة ڤوت</h1>
            <p className="text-sm text-muted-foreground">إدارة الفئات والمنتجات</p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm"><ArrowRight className="w-4 h-4 ml-1" /> الموقع</Button>
            </Link>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 ml-1" /> خروج
            </Button>
          </div>
        </header>

        {/* Categories */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl">الفئات</h2>
          <div className="flex gap-2">
            <Input
              placeholder="اسم فئة جديدة"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <Button onClick={addCategory} className="bg-gold text-cream hover:opacity-90">
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </div>
          <ul className="divide-y divide-border">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 gap-3">
                {editingCatId === c.id ? (
                  <>
                    <Input
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                    />
                    <Button size="sm" onClick={() => updateCategory(c.id)}>حفظ</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCatId(null)}>إلغاء</Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {c.image_url ? (
                          <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label htmlFor={`cat-img-${c.id}`} className="cursor-pointer text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted">
                        {c.image_url ? "تغيير الصورة" : "رفع صورة"}
                      </Label>
                      <input
                        id={`cat-img-${c.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) updateCategoryImage(c.id, f);
                        }}
                      />
                      {c.image_url && (
                        <Button size="sm" variant="ghost" onClick={() => updateCategoryImage(c.id, null)}>
                          إزالة
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => { setEditingCatId(c.id); setEditingCatName(c.name); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteCategory(c.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Add product */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl">إضافة منتج</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>الاسم</Label>
              <Input value={pName} onChange={(e) => setPName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>السعر (ر.س)</Label>
              <Input type="number" step="0.01" value={pPrice} onChange={(e) => setPPrice(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>الفئة</Label>
              <Select value={pCat} onValueChange={setPCat}>
                <SelectTrigger><SelectValue placeholder="اختر فئة" /></SelectTrigger>
                <SelectContent>
                  {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>صورة المنتج</Label>
              <Input type="file" accept="image/*" onChange={(e) => setPFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
          <Button onClick={addProduct} disabled={pSubmitting} className="bg-gold text-cream hover:opacity-90">
            <Plus className="w-4 h-4 ml-1" /> {pSubmitting ? "جاري..." : "إضافة المنتج"}
          </Button>
        </section>

        {/* Products list */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display text-xl">المنتجات</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prods.map((p) => {
              const cat = cats.find((c) => c.id === p.category_id);
              const editing = editingProd?.id === p.id;
              return (
                <div key={p.id} className="border border-border rounded-xl overflow-hidden bg-background">
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    {editing ? (
                      <>
                        <Input value={editingProd!.name} onChange={(e) => setEditingProd({ ...editingProd!, name: e.target.value })} />
                        <Input type="number" step="0.01" value={editingProd!.price} onChange={(e) => setEditingProd({ ...editingProd!, price: Number(e.target.value) })} />
                        <Select value={editingProd!.category_id} onValueChange={(v) => setEditingProd({ ...editingProd!, category_id: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Input type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files?.[0] ?? null)} />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={saveEdit} className="bg-gold text-cream">حفظ</Button>
                          <Button size="sm" variant="outline" onClick={() => { setEditingProd(null); setEditFile(null); }}>إلغاء</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold">{p.name}</h3>
                          <span className="text-gold font-semibold">{p.price} ر.س</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{cat?.name}</p>
                        <div className="flex gap-1 pt-1">
                          <Button size="icon" variant="ghost" onClick={() => setEditingProd(p)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteProduct(p.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
