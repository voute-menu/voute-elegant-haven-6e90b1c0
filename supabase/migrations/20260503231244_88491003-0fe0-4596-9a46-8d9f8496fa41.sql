-- Branches table
CREATE TABLE public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "branches public read" ON public.branches FOR SELECT USING (true);
CREATE POLICY "branches admin write" ON public.branches FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Product <-> Branch availability
CREATE TABLE public.product_branches (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, branch_id)
);
ALTER TABLE public.product_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_branches public read" ON public.product_branches FOR SELECT USING (true);
CREATE POLICY "product_branches admin write" ON public.product_branches FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Seed 3 default branches
INSERT INTO public.branches (name, sort_order) VALUES
  ('الفرع الرئيسي', 0),
  ('الفرع الثاني', 1),
  ('الفرع الثالث', 2);

-- By default, mark all existing products as available in all branches
INSERT INTO public.product_branches (product_id, branch_id)
SELECT p.id, b.id FROM public.products p CROSS JOIN public.branches b;