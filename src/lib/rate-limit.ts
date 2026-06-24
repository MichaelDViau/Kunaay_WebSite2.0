/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Suitable for a single-instance deployment (the common case for this app). It
 * is intentionally dependency-free and self-evicting so the backing map can
 * never grow without bound (which would otherwise be a slow memory-exhaustion
 * DoS vector). For multi-instance / serverless deployments, swap the store for
 * a shared one (e.g. Redis) — see SECURITY notes in the README.
 */

type Bucket = { count: number; resetAt: number };

const stores = new Map<string, Map<string, Bucket>>();

function getStore(namespace: string): Map<string, Bucket> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

/**
 * Records a hit for `key` within `namespace` and reports whether it is allowed.
 *
 * @returns `allowed` (false once the limit is exceeded for the current window)
 *          and `retryAfterSeconds` (seconds until the window resets).
 */
export function rateLimit(
  namespace: string,
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const store = getStore(namespace);
  const now = Date.now();

  // Opportunistic eviction of expired buckets so the map stays bounded.
  if (store.size > 5000) {
    for (const [k, b] of store) {
      if (now > b.resetAt) store.delete(k);
    }
  }

  const bucket = store.get(key);
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count++;
  return { allowed: true, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}

/** Clears a key early (e.g. after a successful login) so it isn't penalised. */
export function rateLimitReset(namespace: string, key: string): void {
  stores.get(namespace)?.delete(key);
}
