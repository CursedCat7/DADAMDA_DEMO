-- Resets the demo tables to a known-good state for local dev / Kakao Map
-- verification: 모래내시장 (1 market) + 13 stores across every
-- StoreCategory, each with 1-2 products at varying discount levels.
--
-- Usage (from the repo root, dev stack running):
--   docker compose exec -T postgres psql -U dadamda -d dadamda < scripts/seed_demo_data.sql
--
-- Destructive on purpose: this truncates reservation/product/store/market/
-- esg data first so re-running it always produces the same state. Never
-- run this against anything but a disposable local/dev database.

TRUNCATE reservation_items, reservations, products, stores, markets, esg_stats
  RESTART IDENTITY CASCADE;

-- Demo pickup window: today 19:00-20:00 KST, regardless of the DB
-- server's own timezone setting.
\set pickup_start '(((now() AT TIME ZONE ''Asia/Seoul'')::date + TIME ''19:00'') AT TIME ZONE ''Asia/Seoul'')'
\set pickup_end '(((now() AT TIME ZONE ''Asia/Seoul'')::date + TIME ''20:00'') AT TIME ZONE ''Asia/Seoul'')'

INSERT INTO markets (id, name, address, latitude, longitude, thumbnail, created_at) VALUES
  (1, '모래내시장', '인천 남동구 호구포로810번길 42-8', 37.454125, 126.721461, '/images/market/1.jpg', now());

INSERT INTO stores (id, market_id, name, category, description, created_at) VALUES
  (1,  1, '영희반찬',       'BANCHAN',     '매일 아침 만드는 정갈한 밑반찬',        now()),
  (2,  1, '모래내정육점',   'MEAT',        '1++한우와 국내산 돼지고기 전문',        now()),
  (3,  1, '바다생선가게',   'FISH',        '매일 새벽 경매로 들여온 활어',          now()),
  (4,  1, '싱싱과일가게',   'FRUIT',       '제철 과일만 골라 담았어요',             now()),
  (5,  1, '정성떡집',       'RICE_CAKE',   '주문 즉시 뽑는 가래떡과 인절미',        now()),
  (6,  1, '명동분식',       'STREET_FOOD', '떡볶이, 순대, 튀김 3대장',              now()),
  (7,  1, '푸른야채가게',   'VEGETABLE',   '농약 걱정 없는 유기농 채소',            now()),
  (8,  1, '고향반찬',       'BANCHAN',     '고향의 손맛 그대로',                    now()),
  (9,  1, '든든정육',       'MEAT',        '삼겹살, 목살 특가 매일 진행',           now()),
  (10, 1, '동해수산',       'FISH',        '고등어, 갈치 전문',                     now()),
  (11, 1, '제철과일당',     'FRUIT',       '당도 선별 과일',                        now()),
  (12, 1, '우리쌀떡',       'RICE_CAKE',   '국내산 쌀로만 만든 떡',                 now()),
  (13, 1, '골목분식',       'STREET_FOOD', '즉석 김밥과 라면',                      now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (
  id, store_id, title, description, original_price, discount_price,
  discount_percent, remain_quantity, pickup_start, pickup_end, status,
  image_url, created_at, updated_at
) VALUES
  (1,  1,  '제육볶음',       '매콤한 제육볶음',           8000,  5600, 30, 3, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/1.jpg',  now(), now()),
  (2,  1,  '잡채',           '명절 잡채',                10000, 6000, 40, 2, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/2.jpg',  now(), now()),
  (3,  2,  '한우 등심',      '1++ 등급',                 35000, 21000,40, 2, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/3.jpg',  now(), now()),
  (4,  3,  '고등어구이',     '손질 완료',                 12000, 6000, 50, 4, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/4.jpg',  now(), now()),
  (5,  4,  '사과 한 박스',   '부사 5kg',                  15000, 9000, 40, 5, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/5.jpg',  now(), now()),
  (6,  5,  '인절미',         '수제 인절미',                6000, 4200, 30, 6, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/6.jpg',  now(), now()),
  (7,  6,  '떡볶이 1인분',   '즉석 떡볶이',                5000, 3000, 40, 8, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/7.jpg',  now(), now()),
  (8,  7,  '유기농 상추',    '무농약',                    4000, 2400, 40, 7, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/8.jpg',  now(), now()),
  (9,  8,  '나물 3종 세트',  '고사리/도라지/시금치',       9000, 6300, 30, 3, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/9.jpg',  now(), now()),
  (10, 9,  '삼겹살 500g',    '국내산',                   14000, 8400, 40, 4, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/10.jpg', now(), now()),
  (11, 10, '갈치 2마리',     '제주 갈치',                 20000, 12000,40, 2, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/11.jpg', now(), now()),
  (12, 11, '샤인머스캣',     '당도 선별',                 18000, 10800,40, 3, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/12.jpg', now(), now()),
  (13, 12, '가래떡',         '국내산 쌀',                  7000, 4900, 30, 5, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/13.jpg', now(), now()),
  (14, 13, '참치김밥',       '당일 제조',                  3500, 2100, 40, 9, :pickup_start, :pickup_end, 'ON_SALE', '/images/products/14.jpg', now(), now())
ON CONFLICT (id) DO NOTHING;

-- saved_food_kg avoids 18 (a widely-recognized profanity-adjacent number
-- in Korean, "십팔"/"18" reading like 씨발) showing up standalone as
-- "18kg" in the ESG widget.
INSERT INTO esg_stats (id, market_id, saved_food_kg, saved_co2, saved_money, created_at) VALUES
  (1, 1, 24, 4.3, 182000, now())
ON CONFLICT (id) DO NOTHING;
