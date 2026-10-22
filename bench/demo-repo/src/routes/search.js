import { customers } from "../db/store.js";
export function search(q) {
  const byName = customers.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  const byEmail = customers.filter(c => c.email.includes(q));
  return [...byName, ...byEmail];
}
