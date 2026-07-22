let client = null;
let schemaReady = false;

export function isTursoConfigured() {
  return Boolean(
    process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN
  );
}

export async function getDb() {
  if (!isTursoConfigured()) {
    return null;
  }
  if (!client) {
    const { createClient } = await import("@libsql/client");
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function ensureSchema() {
  const db = await getDb();
  if (!db) return false;
  if (schemaReady) return true;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS gold_prices (
      date TEXT NOT NULL,
      source TEXT NOT NULL,
      sell_1g INTEGER NOT NULL,
      buyback_1g INTEGER,
      created_at TEXT NOT NULL,
      PRIMARY KEY (date, source)
    )
  `);

  schemaReady = true;
  return true;
}

/**
 * Upsert one daily price row and prune rows older than 90 days.
 */
export async function upsertTodayPrice({
  date,
  source,
  sell1g,
  buyback1g = null,
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Turso is not configured");
  }
  await ensureSchema();

  const createdAt = new Date().toISOString();

  await db.execute({
    sql: `
      INSERT INTO gold_prices (date, source, sell_1g, buyback_1g, created_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(date, source) DO UPDATE SET
        sell_1g = excluded.sell_1g,
        buyback_1g = excluded.buyback_1g,
        created_at = excluded.created_at
    `,
    args: [date, source, sell1g, buyback1g, createdAt],
  });

  await db.execute({
    sql: `
      DELETE FROM gold_prices
      WHERE source = ?
        AND date < date(?, '-90 days')
    `,
    args: [source, date],
  });

  return { date, source, sell1g, buyback1g };
}

export async function getHistoryCount(source) {
  const db = await getDb();
  if (!db) return 0;
  await ensureSchema();

  const result = await db.execute({
    sql: `
      SELECT COUNT(*) AS count
      FROM gold_prices
      WHERE source = ?
    `,
    args: [source],
  });

  return Number(result.rows[0]?.count || 0);
}

/**
 * Return up to `days` rows ascending by date for charting.
 */
export async function getHistory(source, days = 30) {
  const db = await getDb();
  if (!db) return [];
  await ensureSchema();

  const result = await db.execute({
    sql: `
      SELECT date, source, sell_1g, buyback_1g, created_at
      FROM gold_prices
      WHERE source = ?
      ORDER BY date DESC
      LIMIT ?
    `,
    args: [source, days],
  });

  return result.rows
    .map((row) => ({
      date: String(row.date),
      source: String(row.source),
      sell1g: Number(row.sell_1g),
      buyback1g: row.buyback_1g == null ? null : Number(row.buyback_1g),
      createdAt: String(row.created_at),
    }))
    .reverse();
}
