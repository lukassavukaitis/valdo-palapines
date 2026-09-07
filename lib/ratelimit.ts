import { LRUCache } from "lru-cache";

/**
 * Paprastas fiksuoto lango IP rate-limiteris atmintyje. Tinka vienam Docker
 * konteineriui (šis deploy). Jei kada mastelinsi į kelias replikas — pakeisk į
 * @upstash/ratelimit su Redis (bendra būsena tarp replikų).
 */
type Options = { uniqueTokenPerInterval?: number; interval?: number };

const cache = new LRUCache<string, number>({
  max: 5000, // sekamų IP kiekis
  ttl: 60_000, // 1 min langas
});

/**
 * @param ip     kliento IP
 * @param limit  kiek užklausų leidžiama per langą
 * @returns { success, remaining }
 */
export function rateLimit(ip: string, limit = 5) {
  const count = (cache.get(ip) ?? 0) + 1;
  cache.set(ip, count);
  return { success: count <= limit, remaining: Math.max(0, limit - count) };
}

/** Ištraukia kliento IP iš užklausos antraščių (Caddy prideda X-Forwarded-For). */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}
