import { formatInvoiceDate } from "../format.js";
export function renderInvoice(inv) {
  return `Invoice ${inv.id} - ${formatInvoiceDate(inv.date)} - ${inv.amount} EUR`;
}
