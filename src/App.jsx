import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const userModules = [
  { id: "billingCounter", title: "Billing Counter", icon: "💳", userRole: "Cashier / Billing Staff", purpose: "Fast POS billing with sales dashboard, product availability and kitchen status." },
  { id: "selfKiosk", title: "Self Desk Kiosk", icon: "🖥️", userRole: "Customer Self-Service", purpose: "Customer ordering screen showing only available products." },
  { id: "kotManagement", title: "KOT Management", icon: "🧾", userRole: "Kitchen Dispatcher", purpose: "Manage kitchen tickets, preparation status and delivery handover." },
  { id: "productionManagement", title: "Production + Requisition", icon: "🏭", userRole: "Production Supervisor", purpose: "Convert KOT and batch demand into production orders and raw material requisitions." },
  { id: "productionPlanning", title: "Production Planning", icon: "📈", userRole: "Planning Manager", purpose: "Plan item-wise and hour-wise production using sales average and recipe batches." },
  { id: "storeManagement", title: "Store Management", icon: "🏬", userRole: "Store Keeper", purpose: "Manage stock issue, shelf life, reorder levels and requisition fulfilment." },
  { id: "purchase", title: "Purchase", icon: "🛒", userRole: "Purchase Manager", purpose: "Handle PR, vendor quotes, PO and GRN comparison." },
];

const menuItems = [
  { id: 1, name: "Kerala Meals", counter: "Meals", price: 160, kitchen: "Meals Kitchen", status: "Active", image: "🍛" },
  { id: 2, name: "Veg Biryani", counter: "Main Course", price: 180, kitchen: "Main Kitchen", status: "Active", image: "🍚" },
  { id: 3, name: "Ghee Roast Dosa", counter: "Breakfast", price: 95, kitchen: "Breakfast Counter", status: "Active", image: "🥞" },
  { id: 4, name: "Paneer Butter Masala", counter: "North Indian", price: 220, kitchen: "North Indian Kitchen", status: "Active", image: "🍲" },
  { id: 5, name: "Fresh Lime", counter: "Beverage", price: 45, kitchen: "Beverage Counter", status: "Active", image: "🥤" },
  { id: 6, name: "Evening Chai", counter: "Beverage", price: 20, kitchen: "Beverage Counter", status: "Active", image: "☕" },
];

const kitchenAvailability = [
  { kitchen: "Meals Kitchen", status: "Open", reason: "Lunch service active", nextOpen: "Now" },
  { kitchen: "Main Kitchen", status: "Open", reason: "Production available", nextOpen: "Now" },
  { kitchen: "Breakfast Counter", status: "Closed", reason: "Breakfast service closed", nextOpen: "Tomorrow 7:00 AM" },
  { kitchen: "North Indian Kitchen", status: "Open", reason: "Dinner prep running", nextOpen: "Now" },
  { kitchen: "Beverage Counter", status: "Open", reason: "Beverage service active", nextOpen: "Now" },
];

const billingOrders = [
  { billNo: "BILL-1001", source: "Counter", token: "A114", customer: "Walk-in", amount: 455, payment: "UPI", status: "Paid", time: "08:20" },
  { billNo: "BILL-1002", source: "Self Kiosk", token: "K021", customer: "Kiosk Guest", amount: 320, payment: "Card", status: "Paid", time: "12:35" },
  { billNo: "BILL-1003", source: "Counter", token: "A115", customer: "Walk-in", amount: 610, payment: "Cash", status: "Paid", time: "13:10" },
  { billNo: "BILL-1004", source: "Self Kiosk", token: "K022", customer: "Kiosk Guest", amount: 225, payment: "UPI", status: "Pending", time: "16:05" },
  { billNo: "BILL-1005", source: "Counter", token: "A116", customer: "Walk-in", amount: 780, payment: "UPI", status: "Paid", time: "19:30" },
  { billNo: "BILL-1006", source: "Counter", token: "A117", customer: "Walk-in", amount: 260, payment: "Cash", status: "Paid", time: "17:15" },
];

const billingLineItems = [
  { billNo: "BILL-1001", item: "Ghee Roast Dosa", qty: 3, amount: 285, time: "08:20" },
  { billNo: "BILL-1001", item: "Fresh Lime", qty: 2, amount: 90, time: "08:20" },
  { billNo: "BILL-1002", item: "Kerala Meals", qty: 2, amount: 320, time: "12:35" },
  { billNo: "BILL-1003", item: "Veg Biryani", qty: 2, amount: 360, time: "13:10" },
  { billNo: "BILL-1003", item: "Fresh Lime", qty: 2, amount: 90, time: "13:10" },
  { billNo: "BILL-1003", item: "Evening Chai", qty: 8, amount: 160, time: "13:10" },
  { billNo: "BILL-1004", item: "Fresh Lime", qty: 5, amount: 225, time: "16:05" },
  { billNo: "BILL-1005", item: "Paneer Butter Masala", qty: 2, amount: 440, time: "19:30" },
  { billNo: "BILL-1005", item: "Veg Biryani", qty: 1, amount: 180, time: "19:30" },
  { billNo: "BILL-1005", item: "Kerala Meals", qty: 1, amount: 160, time: "19:30" },
  { billNo: "BILL-1006", item: "Evening Chai", qty: 8, amount: 160, time: "17:15" },
  { billNo: "BILL-1006", item: "Fresh Lime", qty: 2, amount: 90, time: "17:15" },
];

const kotTickets = [
  { kotNo: "KOT-501", token: "A114", item: "Kerala Meals", qty: 2, kitchen: "Meals Kitchen", status: "Preparing" },
  { kotNo: "KOT-502", token: "K021", item: "Veg Biryani", qty: 2, kitchen: "Main Kitchen", status: "Ready" },
  { kotNo: "KOT-503", token: "A115", item: "Paneer Butter Masala", qty: 3, kitchen: "North Indian Kitchen", status: "Preparing" },
  { kotNo: "KOT-504", token: "K022", item: "Fresh Lime", qty: 5, kitchen: "Beverage Counter", status: "Queued" },
];

const productionPlan = [
  { item: "Kerala Meals", forecast: 310, readyStock: 42, productionQty: 299, batches: 3, plannedOutput: 300, batchSize: 100 },
  { item: "Veg Biryani", forecast: 238, readyStock: 28, productionQty: 234, batches: 5, plannedOutput: 250, batchSize: 50 },
  { item: "Ghee Roast Dosa", forecast: 195, readyStock: 36, productionQty: 179, batches: 3, plannedOutput: 240, batchSize: 80 },
  { item: "Paneer Butter Masala", forecast: 150, readyStock: 18, productionQty: 147, batches: 4, plannedOutput: 160, batchSize: 40 },
  { item: "Fresh Lime", forecast: 295, readyStock: 60, productionQty: 265, batches: 4, plannedOutput: 300, batchSize: 75 },
];

const requisitions = [
  { item: "Raw Rice", unit: "kg", requiredQty: 54, availableQty: 240, issueQty: 54, shortageQty: 0, status: "Issue Ready" },
  { item: "Paneer", unit: "kg", requiredQty: 32, availableQty: 12, issueQty: 12, shortageQty: 20, status: "Shortage" },
  { item: "Mixed Vegetables", unit: "kg", requiredQty: 50, availableQty: 16, issueQty: 16, shortageQty: 34, status: "Shortage" },
  { item: "Lime", unit: "pcs", requiredQty: 360, availableQty: 120, issueQty: 120, shortageQty: 240, status: "Shortage" },
];

const storeAlerts = [
  { item: "Raw Rice", unit: "kg", current: 240, reorderLevel: 80, shelfLifeDays: 180, reorderStatus: "OK", shelfLifeStatus: "Normal" },
  { item: "Paneer", unit: "kg", current: 12, reorderLevel: 15, shelfLifeDays: 5, reorderStatus: "Reorder", shelfLifeStatus: "Use First" },
  { item: "Mixed Vegetables", unit: "kg", current: 16, reorderLevel: 20, shelfLifeDays: 3, reorderStatus: "Reorder", shelfLifeStatus: "Use First" },
  { item: "Lime", unit: "pcs", current: 120, reorderLevel: 200, shelfLifeDays: 7, reorderStatus: "Reorder", shelfLifeStatus: "Normal" },
];

const purchaseRequisition = [
  { item: "Paneer", unit: "kg", qty: 20, reason: "Production shortage" },
  { item: "Mixed Vegetables", unit: "kg", qty: 34, reason: "Production shortage" },
  { item: "Lime", unit: "pcs", qty: 240, reason: "Reorder + production shortage" },
];

const vendors = [
  { name: "Fresh Farm Traders", category: "Vegetables", rating: 4.6, leadTime: "1 day" },
  { name: "Kerala Rice Depot", category: "Grains", rating: 4.4, leadTime: "2 days" },
  { name: "Dairy Best Supplies", category: "Dairy", rating: 4.7, leadTime: "Same day" },
];

const quotationComparison = [
  { item: "Paneer", bestVendor: "Dairy Best Supplies", bestRate: 310, quotes: [{ vendor: "Dairy Best Supplies", qty: 40, unit: "kg", rate: 310, total: 12400, selected: true }, { vendor: "Fresh Farm Traders", qty: 40, unit: "kg", rate: 325, total: 13000, selected: false }] },
  { item: "Lime", bestVendor: "Fresh Farm Traders", bestRate: 4.2, quotes: [{ vendor: "Fresh Farm Traders", qty: 300, unit: "pcs", rate: 4.2, total: 1260, selected: true }, { vendor: "Dairy Best Supplies", qty: 300, unit: "pcs", rate: 4.8, total: 1440, selected: false }] },
];

const grnComparison = [
  { poNo: "PO-7001", vendor: "Dairy Best Supplies", item: "Paneer", orderedQty: 40, receivedQty: 38, unit: "kg", qtyVariance: -2, grnStatus: "Variance" },
  { poNo: "PO-7002", vendor: "Fresh Farm Traders", item: "Lime", orderedQty: 300, receivedQty: 300, unit: "pcs", qtyVariance: 0, grnStatus: "Matched" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function getModuleById(moduleId) {
  return userModules.find((module) => module.id === moduleId) || userModules[0];
}

function getSellableProducts(items, kitchens, mode = "counter") {
  const kitchenMap = kitchens.reduce((map, kitchen) => ({ ...map, [kitchen.kitchen]: kitchen }), {});
  return items
    .map((item) => {
      const kitchen = kitchenMap[item.kitchen];
      const isAvailable = kitchen?.status === "Open" && item.status === "Active";
      return { ...item, isAvailable, kitchenReason: kitchen?.reason || "Kitchen not mapped" };
    })
    .filter((item) => (mode === "kiosk" ? item.isAvailable : true));
}

function getCartTotals(cartItems) {
  const qty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  return { qty, subtotal, tax, total: subtotal + tax };
}

function getMealSlot(time) {
  const [hour, minute] = time.split(":").map(Number);
  const value = hour * 60 + minute;
  if (value >= 360 && value < 660) return "Breakfast";
  if (value >= 660 && value < 930) return "Lunch";
  if (value >= 930 && value < 1110) return "Evening Coffee";
  return "Dinner";
}

function getBillingDashboardData() {
  const paidOrders = billingOrders.filter((order) => order.status === "Paid");
  const totalSales = paidOrders.reduce((sum, order) => sum + order.amount, 0);
  const customersBilled = paidOrders.length;
  const averageBill = customersBilled === 0 ? 0 : Math.round(totalSales / customersBilled);
  const pendingKot = kotTickets.filter((kot) => !["Delivered", "Completed"].includes(kot.status)).length;
  const productMap = new Map();
  billingLineItems.forEach((item) => {
    const current = productMap.get(item.item) || { item: item.item, qty: 0, amount: 0 };
    current.qty += item.qty;
    current.amount += item.amount;
    productMap.set(item.item, current);
  });
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  const slots = ["Breakfast", "Lunch", "Evening Coffee", "Dinner"];
  const slotSummary = slots.map((slot) => {
    const slotOrders = paidOrders.filter((order) => getMealSlot(order.time) === slot);
    const slotBills = new Set(slotOrders.map((order) => order.billNo));
    const slotItems = billingLineItems.filter((item) => slotBills.has(item.billNo));
    return { slot, sales: slotOrders.reduce((sum, order) => sum + order.amount, 0), customers: slotOrders.length, bills: slotOrders.length, qty: slotItems.reduce((sum, item) => sum + item.qty, 0) };
  });
  return { totalSales, customersBilled, averageBill, pendingKot, topProducts, slotSummary };
}

function runSelfTests() {
  const kioskProducts = getSellableProducts(menuItems, kitchenAvailability, "kiosk");
  console.assert(!kioskProducts.some((item) => item.kitchen === "Breakfast Counter"), "Closed kitchen products should not appear in kiosk mode");
  const totals = getCartTotals([{ price: 100, qty: 2 }, { price: 50, qty: 1 }]);
  console.assert(totals.subtotal === 250 && totals.tax === 13 && totals.total === 263, "Cart totals should calculate subtotal, GST and total");
  const dashboard = getBillingDashboardData();
  console.assert(dashboard.customersBilled === 5, "Dashboard should count paid customers only");
  console.assert(dashboard.topProducts[0].item === "Fresh Lime", "Dashboard should rank most sold products by quantity");
}
runSelfTests();

function Card({ children, className = "" }) {
  return <div className={`border border-[#d8e5e7] bg-white ${className}`}>{children}</div>;
}

function Button({ children, active = false, disabled = false, className = "", ...props }) {
  return <button type="button" disabled={disabled} className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#abffae]/60 disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-[#00262b] text-white hover:bg-[#0b363b]" : "border border-[#abffae] bg-white text-[#0b363b] hover:bg-[#eafde8]"} ${className}`} {...props}>{children}</button>;
}

function Badge({ status }) {
  const tone = ["Paid", "Ready", "Issue Ready", "OK", "Matched", "GRN Matched", "Active", "Selected", "Open", "Available"].includes(status)
    ? "border-[#abffae] bg-[#eafde8] text-[#0b363b]"
    : ["High", "Queued", "Preparing", "Use First", "Watch"].includes(status)
      ? "border-[#feefe8] bg-[#feefe8] text-[#8b3911]"
      : "border-[#e0f4ff] bg-[#e0f4ff] text-[#0a3890]";
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function StatCard({ icon, label, value, sub }) {
  return <div className="border border-[#d8e5e7] bg-white p-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase text-[#4f6466]">{label}</p><h3 className="mt-2 text-2xl font-semibold text-[#00262b]">{value}</h3><p className="mt-1 text-xs text-[#354d51]">{sub}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e0f4ff] text-xl">{icon}</div></div></div>;
}

function SectionHeader({ icon, title, subtitle }) {
  return <div className="mb-6 flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#d8e5e7] bg-[#fafafa] text-xl">{icon}</div><div><h2 className="text-2xl font-semibold text-[#00262b]">{title}</h2><p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#354d51]">{subtitle}</p></div></div>;
}

function DataTable({ columns, rows, renderCell }) {
  return <div className="overflow-x-auto border border-[#d8e5e7] bg-white"><table className="w-full min-w-[860px] text-left text-sm"><thead className="bg-[#fafafa] text-xs uppercase text-[#4f6466]"><tr>{columns.map((column) => <th key={column.key} className="border-b border-[#d8e5e7] p-3 font-semibold">{column.label}</th>)}</tr></thead><tbody className="divide-y divide-[#eef4f5] bg-white text-[#00262b]">{rows.map((row, index) => <tr key={row.id || row.item || row.billNo || row.kotNo || row.poNo || row.name || index} className="hover:bg-[#fafafa]">{columns.map((column) => <td key={column.key} className="p-3 align-middle">{renderCell ? renderCell(row, column.key) : row[column.key]}</td>)}</tr>)}</tbody></table></div>;
}

function EmptyState({ icon = "🧭", title, subtitle }) {
  return <div className="border border-dashed border-[#a1c2c6] bg-[#fafafa] p-8 text-center"><div className="text-4xl">{icon}</div><h3 className="mt-3 text-xl font-semibold text-[#00262b]">{title}</h3><p className="mt-1 text-sm text-[#354d51]">{subtitle}</p></div>;
}

function SidebarNavigation({ activeModule, setActiveModule }) {
  return <aside className="hidden w-80 shrink-0 border-r border-[#d8e5e7] bg-white p-6 lg:block"><div className="mb-8 border border-[#d8e5e7] bg-[#fafafa] p-6"><div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#00262b] text-2xl text-white">🍽️</div><h1 className="mt-5 text-2xl font-semibold text-[#00262b]">Food Court ERP</h1><p className="mt-2 text-sm leading-relaxed text-[#354d51]">Role-based screens for billing, kitchen, store and purchase.</p></div><div className="mb-3 px-1 text-xs font-semibold uppercase text-[#4f6466]">Work areas</div><nav className="space-y-2">{userModules.map((module) => { const isActive = activeModule === module.id; return <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`group flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition ${isActive ? "bg-[#00262b] text-white" : "text-[#0b363b] hover:bg-[#eafde8]"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl ${isActive ? "bg-white/10" : "bg-[#fafafa] group-hover:bg-white"}`}>{module.icon}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{module.title}</span><span className={`block truncate text-xs ${isActive ? "text-[#e0f4ff]" : "text-[#4f6466]"}`}>{module.userRole}</span></span></button>; })}</nav></aside>;
}

function MobileModuleTabs({ activeModule, setActiveModule }) {
  return <div className="mb-6 overflow-x-auto lg:hidden"><div className="flex min-w-max gap-2">{userModules.map((module) => <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeModule === module.id ? "bg-[#00262b] text-white" : "border border-[#abffae] bg-white text-[#0b363b]"}`}>{module.icon} {module.title}</button>)}</div></div>;
}

function BillingDashboardModule() {
  const data = getBillingDashboardData();
  const maxTopQty = Math.max(...data.topProducts.map((item) => item.qty), 1);
  return <div className="space-y-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard icon="💰" label="Total Sales Today" value={formatCurrency(data.totalSales)} sub="Paid bills only" /><StatCard icon="👥" label="Customers Billed" value={data.customersBilled} sub="Completed bills today" /><StatCard icon="🧾" label="Pending KOT" value={data.pendingKot} sub="Kitchen orders not closed" /><StatCard icon="📊" label="Average Bill" value={formatCurrency(data.averageBill)} sub="Sales ÷ customers" /></div><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]"><Card><div className="p-5 md:p-6"><SectionHeader icon="⏱️" title="Sales by Service Time" subtitle="Breakfast, lunch, evening coffee and dinner performance" /><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{data.slotSummary.map((slot) => <div key={slot.slot} className="rounded-3xl border border-[#d8e5e7] bg-[#fafafa] p-4"><p className="text-sm font-black text-[#00262b]">{slot.slot}</p><p className="mt-3 text-2xl font-black text-[#00262b]">{formatCurrency(slot.sales)}</p><div className="mt-3 grid grid-cols-3 gap-2 text-xs text-[#4f6466]"><span>{slot.customers} customers</span><span>{slot.bills} bills</span><span>{slot.qty} qty</span></div></div>)}</div></div></Card><Card><div className="p-5 md:p-6"><SectionHeader icon="🔥" title="KOT Live Status" subtitle="Instant kitchen load visibility" /><div className="grid gap-3">{["Queued", "Preparing", "Ready"].map((status) => <div key={status} className="flex items-center justify-between rounded-2xl border border-[#d8e5e7] bg-[#fafafa] p-4"><div><p className="font-black text-[#00262b]">{status}</p><p className="text-xs text-[#4f6466]">Kitchen tickets</p></div><span className="text-3xl font-black text-[#00262b]">{kotTickets.filter((kot) => kot.status === status).length}</span></div>)}</div></div></Card></div><Card><div className="p-5 md:p-6"><SectionHeader icon="🏆" title="Most Selling Products" subtitle="Products ranked by quantity sold today" /><div className="space-y-3">{data.topProducts.map((product, index) => <div key={product.item} className="rounded-2xl border border-[#d8e5e7] bg-white p-4"><div className="mb-2 flex items-center justify-between gap-3"><div><p className="font-black text-[#00262b]">#{index + 1} {product.item}</p><p className="text-xs text-[#4f6466]">{product.qty} sold • {formatCurrency(product.amount)}</p></div><span className="rounded-full bg-[#eafde8] px-3 py-1 text-xs font-black text-[#0b363b]">{product.qty} qty</span></div><div className="h-3 rounded-full bg-[#ebebeb]"><div className="h-3 rounded-full bg-[#00262b]" style={{ width: `${Math.max((product.qty / maxTopQty) * 100, 8)}%` }} /></div></div>)}</div></div></Card></div>;
}

function BillingCounterModule() {
  const [billingTab, setBillingTab] = useState("dashboard");
  return <div className="space-y-5"><div className="flex flex-wrap gap-2"><Button active={billingTab === "dashboard"} onClick={() => setBillingTab("dashboard")}>Dashboard</Button><Button active={billingTab === "billing"} onClick={() => setBillingTab("billing")}>Billing</Button></div>{billingTab === "dashboard" ? <BillingDashboardModule /> : <BillingKioskModule defaultMode="counter" />}</div>;
}

function SelfKioskModule() { return <BillingKioskModule defaultMode="kiosk" />; }

function BillingKioskModule({ defaultMode = "counter" }) {
  const [selectedCounter, setSelectedCounter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const billingMode = defaultMode;
  const counters = useMemo(() => ["All", ...new Set(menuItems.map((item) => item.counter))], []);
  const products = useMemo(() => getSellableProducts(menuItems, kitchenAvailability, billingMode).filter((item) => (selectedCounter === "All" || item.counter === selectedCounter) && (item.name.toLowerCase().includes(searchText.toLowerCase()) || item.counter.toLowerCase().includes(searchText.toLowerCase()))), [billingMode, selectedCounter, searchText]);
  const totals = useMemo(() => getCartTotals(cart), [cart]);
  const isKiosk = billingMode === "kiosk";
  function addToCart(product) { if (!product.isAvailable) return; setCart((current) => { const existing = current.find((item) => item.id === product.id); if (existing) return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)); return [...current, { id: product.id, name: product.name, price: product.price, kitchen: product.kitchen, qty: 1 }]; }); }
  function updateCartQty(productId, change) { setCart((current) => current.map((item) => (item.id === productId ? { ...item, qty: item.qty + change } : item)).filter((item) => item.qty > 0)); }
  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]"><div className="space-y-5 min-w-0"><Card className="overflow-hidden border-none"><div className="bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white"><div className="flex items-start gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-3xl">{isKiosk ? "🖥️" : "💳"}</div><div><h2 className="text-2xl font-black">{isKiosk ? "Self Desk Kiosk" : "Billing Counter"}</h2><p className="mt-1 text-sm text-slate-300">{isKiosk ? "Customer-facing view. Closed-kitchen products are hidden." : "Large product buttons, live kitchen availability and a sticky bill panel."}</p></div></div></div><div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{kitchenAvailability.map((kitchen) => <div key={kitchen.kitchen} className={`rounded-3xl border p-4 ${kitchen.status === "Open" ? "border-[#abffae] bg-[#eafde8]" : "border-rose-200 bg-rose-50"}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-black text-[#00262b]">{kitchen.kitchen.replace(" Kitchen", "")}</p><Badge status={kitchen.status} /></div><p className="mt-2 text-xs text-[#4f6466]">{kitchen.reason}</p></div>)}</div></Card><Card className="border-none"><div className="p-5"><div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex flex-wrap gap-2">{counters.map((counter) => <Button key={counter} active={selectedCounter === counter} onClick={() => setSelectedCounter(counter)}>{counter}</Button>)}</div><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search food item..." className="w-full rounded-2xl border border-[#d8e5e7] bg-[#fafafa] px-4 py-3 text-sm font-semibold outline-none focus:bg-white xl:w-80" /></div>{isKiosk && <div className="mb-4 rounded-3xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">Closed-kitchen items are hidden in kiosk mode.</div>}{products.length === 0 ? <EmptyState icon="🍽️" title="No products available" subtitle="Try another counter or check kitchen availability." /> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{products.map((product) => <button key={product.id} type="button" onClick={() => addToCart(product)} disabled={!product.isAvailable} className={`group rounded-3xl border p-4 text-left transition ${product.isAvailable ? "border-[#d8e5e7] bg-white hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/70" : "cursor-not-allowed border-[#d8e5e7] bg-[#ebebeb] opacity-60"}`}><div className="flex items-start justify-between gap-3"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-4xl group-hover:scale-105">{product.image}</div><Badge status={product.isAvailable ? "Available" : "Unavailable"} /></div><h3 className="mt-4 text-lg font-black text-[#00262b]">{product.name}</h3><p className="mt-1 text-xs font-semibold text-[#4f6466]">{product.counter} • {product.kitchen}</p><div className="mt-5 flex items-end justify-between gap-3"><p className="text-3xl font-black tracking-[0.008px] text-[#00262b]">{formatCurrency(product.price)}</p><span className="rounded-full bg-[#ebebeb] px-3 py-1 text-xs font-black text-[#354d51]">Add</span></div></button>)}</div>}</div></Card></div><div className="xl:sticky xl:top-5 xl:self-start"><Card className="overflow-hidden border-none shadow-xl shadow-slate-200/80"><div className="bg-[#00262b] p-5 text-white"><div className="flex items-center justify-between"><div><h3 className="text-2xl font-black">Current Bill</h3><p className="text-sm text-slate-300">{isKiosk ? "Kiosk order" : "Counter sale"}</p></div><button type="button" onClick={() => setCart([])} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">Clear</button></div></div><div className="max-h-[430px] space-y-3 overflow-y-auto bg-white p-4">{cart.length > 0 ? cart.map((item) => <div key={item.id} className="rounded-3xl border border-slate-100 bg-[#fafafa] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#00262b]">{item.name}</p><p className="text-xs text-[#4f6466]">{formatCurrency(item.price)} × {item.qty}</p></div><p className="font-black">{formatCurrency(item.price * item.qty)}</p></div><div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => updateCartQty(item.id, -1)} className="h-10 w-10 rounded-2xl border border-[#d8e5e7] bg-white font-black">-</button><span className="w-8 text-center font-black">{item.qty}</span><button type="button" onClick={() => updateCartQty(item.id, 1)} className="h-10 w-10 rounded-2xl border border-[#d8e5e7] bg-white font-black">+</button></div></div>) : <EmptyState icon="🛒" title="Cart is empty" subtitle="Tap a product to add it to the bill." />}</div><div className="border-t border-slate-100 bg-white p-5"><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-[#4f6466]">Items</span><strong>{totals.qty}</strong></div><div className="flex justify-between"><span className="text-[#4f6466]">Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div><div className="flex justify-between"><span className="text-[#4f6466]">GST 5%</span><strong>{formatCurrency(totals.tax)}</strong></div><div className="flex justify-between border-t border-slate-100 pt-4 text-2xl"><span className="font-black">Total</span><strong>{formatCurrency(totals.total)}</strong></div></div><div className="mt-5 grid gap-2"><Button active className="w-full py-4 text-base" disabled={cart.length === 0}>Generate Bill & KOT</Button><Button className="w-full" disabled={cart.length === 0}>Hold Bill</Button></div></div></Card></div></div>;
}

function KotModule({ kotDemand }) { return <div className="grid gap-6 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="p-5 md:p-6"><SectionHeader icon="🧾" title="KOT Management" subtitle="Section-wise ticket status for production and delivery" /><DataTable columns={[{ key: "kotNo", label: "KOT" }, { key: "token", label: "Token" }, { key: "item", label: "Item" }, { key: "qty", label: "Qty" }, { key: "kitchen", label: "Kitchen" }, { key: "status", label: "Status" }]} rows={kotTickets} renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : row[key]} /></div></Card><Card><div className="p-5 md:p-6"><SectionHeader icon="🔥" title="KOT Production Demand" subtitle="Live production demand from pending tickets" /><div className="space-y-3">{kotDemand.map((item) => <div key={item.item} className="rounded-2xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between"><p className="font-semibold">{item.item}</p><span className="text-lg font-bold">{item.qty}</span></div><p className="mt-1 text-sm text-[#4f6466]">{item.kitchen} • {item.tickets} KOT</p></div>)}</div></div></Card></div>; }
function ProductionPlanningModule() { return <Card><div className="p-5 md:p-6"><SectionHeader icon="📈" title="Production Planning" subtitle="Average sales converted into item-wise production and batches" /><DataTable columns={[{ key: "item", label: "Item" }, { key: "forecast", label: "Forecast" }, { key: "readyStock", label: "Ready Stock" }, { key: "productionQty", label: "Production Qty" }, { key: "batches", label: "Batches" }, { key: "plannedOutput", label: "Planned Output" }]} rows={productionPlan} /></div></Card>; }
function ProductionManagementModule() { return <div className="grid gap-6 xl:grid-cols-[1fr_560px]"><Card><div className="p-5 md:p-6"><SectionHeader icon="🏭" title="Production Management" subtitle="Batch production orders and kitchen-wise execution" /><div className="grid gap-3 md:grid-cols-2">{productionPlan.map((batch) => <div key={batch.item} className="rounded-2xl bg-purple-50 p-4"><p className="font-semibold text-purple-950">{batch.item}</p><p className="text-sm text-purple-800">Production qty: {batch.productionQty}</p><p className="text-sm text-purple-800">Batches: {batch.batches}</p></div>)}</div></div></Card><Card><div className="p-5 md:p-6"><SectionHeader icon="📋" title="Production Requisition" subtitle="Material requisition generated from recipe batch requirements" /><DataTable columns={[{ key: "item", label: "Material" }, { key: "requiredQty", label: "Required" }, { key: "availableQty", label: "Available" }, { key: "issueQty", label: "Issue" }, { key: "shortageQty", label: "Shortage" }, { key: "status", label: "Status" }]} rows={requisitions} renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : ["requiredQty", "availableQty", "issueQty", "shortageQty"].includes(key) ? `${row[key]} ${row.unit}` : row[key]} /></div></Card></div>; }
function StoreManagementModule() { return <div className="grid gap-6 xl:grid-cols-[1fr_560px]"><Card><div className="p-5 md:p-6"><SectionHeader icon="🏬" title="Store Management" subtitle="Stock level, reorder level and shelf-life planning" /><DataTable columns={[{ key: "item", label: "Material" }, { key: "current", label: "Current" }, { key: "reorderLevel", label: "Reorder Level" }, { key: "shelfLifeDays", label: "Shelf Life" }, { key: "reorderStatus", label: "Reorder" }, { key: "shelfLifeStatus", label: "Shelf Life Status" }]} rows={storeAlerts} renderCell={(row, key) => key === "reorderStatus" || key === "shelfLifeStatus" ? <Badge status={row[key]} /> : ["current", "reorderLevel"].includes(key) ? `${row[key]} ${row.unit}` : key === "shelfLifeDays" ? `${row[key]} days` : row[key]} /></div></Card><Card><div className="p-5 md:p-6"><SectionHeader icon="📦" title="Purchase Request" subtitle="Generated from shortages and reorder alerts" /><div className="grid gap-2 md:grid-cols-2">{purchaseRequisition.map((item) => <div key={`${item.item}-${item.unit}`} className="rounded-xl bg-white p-3 text-sm"><strong>{item.item}</strong>: {item.qty} {item.unit}<br /><span className="text-[#4f6466]">{item.reason}</span></div>)}</div></div></Card></div>; }
function PurchaseModule() { return <div className="grid gap-6 xl:grid-cols-[1fr_560px]"><Card><div className="p-5 md:p-6"><SectionHeader icon="🤝" title="Vendor & Quotation Comparison" subtitle="Vendor management, quotation comparison and best rate selection" /><div className="mb-5 grid gap-3 md:grid-cols-3">{vendors.map((vendor) => <div key={vendor.name} className="rounded-2xl bg-[#fafafa] p-4"><p className="font-semibold">{vendor.name}</p><p className="text-sm text-[#4f6466]">{vendor.category}</p><p className="text-sm text-[#4f6466]">Rating {vendor.rating} • {vendor.leadTime}</p></div>)}</div>{quotationComparison.map((group) => <div key={group.item} className="mb-4 rounded-2xl border border-[#d8e5e7] p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{group.item}</h3><span className="text-sm text-emerald-700">Best: {group.bestVendor} @ {formatCurrency(group.bestRate)}</span></div><DataTable columns={[{ key: "vendor", label: "Vendor" }, { key: "qty", label: "Qty" }, { key: "rate", label: "Rate" }, { key: "total", label: "Total" }, { key: "selected", label: "Selected" }]} rows={group.quotes} renderCell={(row, key) => key === "rate" || key === "total" ? formatCurrency(row[key]) : key === "selected" ? <Badge status={row.selected ? "Selected" : "Not Selected"} /> : key === "qty" ? `${row.qty} ${row.unit}` : row[key]} /></div>)}</div></Card><Card><div className="p-5 md:p-6"><SectionHeader icon="📦" title="Purchase Order & GRN" subtitle="Goods receipt generation with PO comparison" /><DataTable columns={[{ key: "poNo", label: "PO" }, { key: "vendor", label: "Vendor" }, { key: "item", label: "Item" }, { key: "orderedQty", label: "PO Qty" }, { key: "receivedQty", label: "GRN Qty" }, { key: "qtyVariance", label: "Variance" }, { key: "grnStatus", label: "Status" }]} rows={grnComparison} renderCell={(row, key) => key === "grnStatus" ? <Badge status={row[key]} /> : ["orderedQty", "receivedQty", "qtyVariance"].includes(key) ? `${row[key]} ${row.unit}` : row[key]} /></div></Card></div>; }

function RoleModuleContent({ activeModule, kotDemand }) { switch (activeModule) { case "billingCounter": return <BillingCounterModule />; case "selfKiosk": return <SelfKioskModule />; case "kotManagement": return <KotModule kotDemand={kotDemand} />; case "productionManagement": return <ProductionManagementModule />; case "productionPlanning": return <ProductionPlanningModule />; case "storeManagement": return <StoreManagementModule />; case "purchase": return <PurchaseModule />; default: return <BillingCounterModule />; } }

export default function FoodCourtCateringManagementApp() {
  const [activeModule, setActiveModule] = useState("billingCounter");
  const active = getModuleById(activeModule);
  const kotDemand = useMemo(() => {
    const map = new Map();
    kotTickets.forEach((ticket) => { const existing = map.get(ticket.item) || { item: ticket.item, qty: 0, kitchen: ticket.kitchen, tickets: 0 }; existing.qty += ticket.qty; existing.tickets += 1; map.set(ticket.item, existing); });
    return Array.from(map.values());
  }, []);
  const totalSales = billingOrders.filter((bill) => bill.status === "Paid").reduce((sum, bill) => sum + bill.amount, 0);
  const totalShortages = requisitions.filter((item) => item.shortageQty > 0).length;
  const reorderCount = storeAlerts.filter((item) => item.reorderStatus === "Reorder").length;
  return <div className="min-h-screen bg-[#ebebeb] font-sans text-[#00262b]"><div className="flex min-h-screen"><SidebarNavigation activeModule={activeModule} setActiveModule={setActiveModule} /><main className="min-w-0 flex-1 p-3 md:p-5"><div className="mx-auto max-w-[1500px]"><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8 border border-[#d8e5e7] bg-white"><div className="grid gap-0 xl:grid-cols-[1fr_560px]"><div className="bg-white p-8 md:p-10"><div className="mb-4 inline-flex rounded-full border border-[#abffae] bg-[#eafde8] px-3 py-1 text-sm font-semibold text-[#0b363b]">{active.userRole}</div><h1 className="max-w-4xl text-5xl font-semibold tracking-[0.008px] text-[#00262b] md:text-6xl">{active.title}</h1><p className="mt-4 max-w-3xl text-base leading-[1.38] tracking-[0.014px] text-[#354d51]">{active.purpose}</p></div><div className="grid grid-cols-2 gap-0 border-l border-[#d8e5e7] bg-[#fafafa] p-5 md:grid-cols-2"><StatCard icon="💳" label="Sales" value={formatCurrency(totalSales)} sub="Today" /><StatCard icon="🧾" label="KOT" value={kotTickets.length} sub="Open tickets" /><StatCard icon="📋" label="Shortage" value={totalShortages} sub="Materials" /><StatCard icon="🏬" label="Reorder" value={reorderCount} sub="Alerts" /></div></div></motion.div><MobileModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} /><div className="space-y-5"><RoleModuleContent activeModule={activeModule} kotDemand={kotDemand} /></div></div></main></div></div>;
}
