CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  image         TEXT NOT NULL,
  description   TEXT NOT NULL,
  price         BIGINT NOT NULL
);

CREATE TABLE orders (
  id            SERIAL PRIMARY KEY,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE order_details (
  -- FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  -- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,  -- Foreign key, having 2 foreign keys = many to many model
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity      INTEGER NOT NULL DEFAULT 1,
  discount      INTEGER,
  PRIMARY KEY (order_id, product_id) --composite primary key
);
