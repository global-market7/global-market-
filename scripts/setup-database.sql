-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  desc_en TEXT,
  desc_ar TEXT,
  price NUMERIC(10,2) NOT NULL,
  old_price NUMERIC(10,2),
  moq INTEGER DEFAULT 1,
  stock INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  seller_id TEXT,
  seller_name TEXT,
  seller_country TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  origin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT,
  product_image TEXT,
  qty INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  qty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products are readable by everyone
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Orders: users can see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Favorites: users manage their own
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Cart items: users manage their own
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Seed products
INSERT INTO products (name_en, name_ar, desc_en, desc_ar, price, old_price, moq, stock, category, images, seller_id, seller_name, seller_country, rating, reviews, sold, verified, featured, origin)
VALUES
  ('Professional Wireless Bluetooth Headphones', 'سماعات بلوتوث لاسلكية احترافية', 'High quality wireless headphones with noise cancellation and 40h battery', 'سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء وبطارية تدوم 40 ساعة', 25.00, 45.00, 100, 5000, 'electronics', ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], 's1', 'TechFactory', 'CN', 4.8, 256, 15000, true, true, 'China'),
  ('Cotton T-Shirts Bulk', 'تيشيرتات قطنية بالجملة', '100% cotton t-shirts all sizes and colors', 'تيشيرتات 100% قطن جميع المقاسات والألوان', 3.50, NULL, 500, 50000, 'fashion', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], 's2', 'BD Textiles', 'BD', 4.5, 128, 500000, true, false, 'Bangladesh'),
  ('Luxury Modern Sofa Set', 'طقم كنب مودرن فاخر', 'Genuine leather sofa set with Italian luxury design', 'طقم كنب جلد طبيعي تصميم إيطالي فاخر', 450.00, 650.00, 5, 100, 'home', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'], 's3', 'Turkish Furniture', 'TR', 4.9, 89, 500, true, true, 'Turkey'),
  ('Organic Skincare Cream', 'كريم عناية بالبشرة عضوي', '100% natural moisturizer free of chemicals', 'كريم مرطب طبيعي 100% خالي من المواد الكيميائية', 8.00, NULL, 500, 50000, 'beauty', ARRAY['https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=500'], 's4', 'K-Beauty Lab', 'KR', 4.7, 445, 8900, true, false, 'South Korea'),
  ('Industrial LED Panel Lights', 'ألواح إضاءة LED صناعية', 'Energy efficient LED panels for commercial use', 'ألواح إضاءة LED موفرة للطاقة للاستخدام التجاري', 15.00, NULL, 200, 10000, 'industrial', ARRAY['https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500'], 's5', 'VN LED Solutions', 'VN', 4.6, 67, 8000, true, false, 'Vietnam'),
  ('Complete Gym Equipment Set', 'أجهزة رياضية متكاملة', 'Home gym equipment set including installation', 'مجموعة أجهزة رياضية للمنزل شاملة التركيب', 120.00, 180.00, 20, 500, 'sports', ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'], 's6', 'CN Sports MFG', 'CN', 4.4, 45, 800, false, false, 'China'),
  ('Educational Toys Bulk', 'ألعاب تعليمية للأطفال بالجملة', 'Safe educational toys for children 3-10 years', 'ألعاب تعليمية آمنة للأطفال 3-10 سنوات', 8.00, NULL, 300, 15000, 'electronics', ARRAY['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500'], 's7', 'ID Toys Factory', 'ID', 4.6, 178, 25000, true, true, 'Indonesia'),
  ('Car Parts Wholesale', 'قطع غيار سيارات بالجملة', 'OEM and aftermarket parts for all brands', 'قطع غيار أصلية وبديلة لجميع الماركات', 50.00, NULL, 100, 8000, 'auto', ARRAY['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500'], 's8', 'TR Auto Parts', 'TR', 4.5, 92, 5000, true, false, 'Turkey'),
  ('Premium Saudi Dates Bulk', 'تمور فاخرة سعودية بالجملة', 'Premium Saudi dates with international certificates', 'تمور سعودية فاخرة مع شهادات دولية', 12.00, NULL, 100, 10000, 'food', ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500'], 's9', 'Saudi Dates Co', 'SA', 4.9, 312, 50000, true, true, 'Saudi Arabia'),
  ('Premium Indian Silk Fabric', 'حرير هندي فاخر بالمتر', 'Authentic Indian silk fabric in multiple colors', 'أقمشة حرير هندي أصيل بألوان متعددة', 18.00, NULL, 50, 3000, 'fashion', ARRAY['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=500'], 's10', 'India Silk House', 'IN', 4.7, 156, 12000, true, false, 'India'),
  ('Premium Brazilian Coffee', 'قهوة برازيلية فاخرة', '100% organic Brazilian coffee beans', 'حبوب قهوة برازيلية عضوية 100%', 22.00, 30.00, 50, 5000, 'food', ARRAY['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500'], 's11', 'Brazil Coffee Export', 'BR', 4.8, 234, 18000, true, false, 'Brazil'),
  ('Professional Business Laptop', 'لابتوب أعمال احترافي', 'Laptop i7 12th Gen 16GB RAM 14" FHD display', 'لابتوب i7 جيل 12 رام 16GB شاشة 14 بوصة', 850.00, 1100.00, 10, 200, 'electronics', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'], 's12', 'US Tech Wholesale', 'US', 4.6, 89, 3000, true, true, 'USA')
ON CONFLICT DO NOTHING;
