import { invoices } from "../db/store.js";
export function monthlyReport() { return invoices.map(i => ({ id: i.id, amount: i.amount })); }
