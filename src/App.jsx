import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const modules = [
  {
    id: "billing",
    title: "Billing Counter & Self Kiosk",
    icon: "💳",
    purpose: "Counter billing, self-desk kiosk ordering, token generation and payment status.",
    inputs: ["Menu master", "Customer order", "Payment mode", "Counter / kiosk source"],
    outputs: ["Bill", "Token", "KOT", "Sales data"],
  },
  {
    id: "kot",
    title: "KOT Management",
    icon: "🧾",
    purpose: "Kitchen order ticket control for production, counter delivery and order tracking.",
    inputs: ["Bill token", "Ordered items", "Quantity", "Kitchen section"],
    outputs: ["Section-wise KOT", "Production queue", "Delivery status"],
  },
  {
    id: "production",
    title: "Production Management from KOT",
    icon: "🏭",
    purpose: "Convert pending KOT demand into kitchen-wise production requirement.",
    inputs: ["Pending KOT", "Ready stock", "Kitchen capacity"],
    outputs: ["Production order", "Priority list", "Batch requirement"],
  },
  {
    id: "planning",
    title: "Hourly Sales-Based Production Planning",
    icon: "📈",
    purpose: "Plan day production using average hourly sales, live KOT trend and expected rush hours.",
    inputs: ["Average sales per hour", "Day type", "Buffer %", "Current stock"],
    outputs: ["Hourly production plan", "Batch plan", "Requisition demand"],
  },
  {
    id: "recipe",
    title: "Recipe & Batch Management",
    icon: "📖",
    purpose: "Maintain recipe master, input quantity, output quantity and batch size for every item.",
    inputs: ["Finished item", "Batch output", "Raw material quantity", "Yield standard"],
    outputs: ["Batch recipe", "Raw material requirement", "Expected output"],
  },
  {
    id: "requisition",
    title: "Production Requisition",
    icon: "📋",
    purpose: "Generate raw material requisition from production planning and recipe batch requirements.",
    inputs: ["Batch plan", "Recipe ingredients", "Available kitchen stock"],
    outputs: ["Store requisition", "Shortage report", "Issue request"],
  },
  {
    id: "store",
    title: "Store Management",
    icon: "🏬",
    purpose: "Issue material to production, track stock, shelf life and reorder levels.",
    inputs: ["Store requisition", "GRN stock", "Issue quantity", "Expiry / shelf life"],
    outputs: ["Material issue", "Current stock", "Reorder alert", "Expiry alert"],
  },
  {
    id: "purchase",
    title: "Purchase Management",
    icon: "🛒",
    purpose: "Purchase requisition, vendor quotation, comparison, purchase order and GRN validation.",
    inputs: ["Reorder alert", "Purchase requisition", "Vendor quotes", "PO"],
    outputs: ["Quotation comparison", "Purchase order", "GRN", "PO vs GRN variance"],
  },
];

const menuItems = [
  { id: 1, name: "Kerala Meals", counter: "Meals", price: 160, kitchen: "Meals Kitchen", status: "Active" },
  { id: 2, name: "Veg Biryani", counter: "Main Course", price: 180, kitchen: "Main Kitchen", status: "Active" },
  { id: 3, name: "Ghee Roast Dosa", counter: "Breakfast", price: 95, kitchen: "Breakfast Counter", status: "Active" },
  { id: 4, name: "Paneer Butter Masala", counter: "North Indian", price: 220, kitchen: "North Indian Kitchen", status: "Active" },
  { id: 5, name: "Fresh Lime", counter: "Beverage", price: 45, kitchen: "Beverage Counter", status: "Active" },
];

const billingOrders = [
  { billNo: "BILL-1001", source: "Counter", token: "A114", customer: "Walk-in", amount: 455, payment: "UPI", status: "Paid" },
  { billNo: "BILL-1002", source: "Self Kiosk", token: "K021", customer: "Kiosk Guest", amount: 320, payment: "Card", status: "Paid" },
  { billNo: "BILL-1003", source: "Counter", token: "A115", customer: "Walk-in", amount: 610, payment: "Cash", status: "Paid" },
  { billNo: "BILL-1004", source: "Self Kiosk", token: "K022", customer: "Kiosk Guest", amount: 225, payment: "UPI", status: "Pending" },
];

const kotTickets = [
  { kotNo: "KOT-501", token: "A114", item: "Kerala Meals", qty: 2, kitchen: "Meals Kitchen", status: "Preparing", priority: "Normal" },
  { kotNo: "KOT-502", token: "K021", item: "Veg Biryani", qty: 2, kitchen: "Main Kitchen", status: "Ready", priority: "High" },
  { kotNo: "KOT-503", token: "A115", item: "Paneer Butter Masala", qty: 3, kitchen: "North Indian Kitchen", status: "Preparing", priority: "High" },
  { kotNo: "KOT-504", token: "K022", item: "Fresh Lime", qty: 5, kitchen: "Beverage Counter", status: "Queued", priority: "Normal" },
];

const hourlySalesPlan = [
  { hour: "07-08", KeralaMeals: 0, VegBiryani: 0, GheeRoastDosa: 45, PaneerButterMasala: 0, FreshLime: 20 },
  { hour: "08-09", KeralaMeals: 0, VegBiryani: 8, GheeRoastDosa: 65, PaneerButterMasala: 0, FreshLime: 35 },
  { hour: "12-13", KeralaMeals: 120, VegBiryani: 70, GheeRoastDosa: 15, PaneerButterMasala: 35, FreshLime: 80 },
  { hour: "13-14", KeralaMeals: 150, VegBiryani: 85, GheeRoastDosa: 10, PaneerButterMasala: 45, FreshLime: 95 },
  { hour: "19-20", KeralaMeals: 40, VegBiryani: 75, GheeRoastDosa: 60, PaneerButterMasala: 70, FreshLime: 65 },
];

const readyStock = {
  "Kerala Meals": 42,
  "Veg Biryani": 28,
  "Ghee Roast Dosa": 36,
  "Paneer Butter Masala": 18,
  "Fresh Lime": 60,
};

const recipeMasters = [
  {
    item: "Kerala Meals",
    batchSize: 100,
    outputUnit: "plates",
    batchTime: "2 hr 30 min",
    workstation: "Meals Kitchen",
    ingredients: [
      { name: "Raw Rice", qtyPerBatch: 18, unit: "kg" },
      { name: "Sambar Vegetables", qtyPerBatch: 22, unit: "kg" },
      { name: "Dal", qtyPerBatch: 7, unit: "kg" },
      { name: "Curd", qtyPerBatch: 10, unit: "L" },
      { name: "Banana Leaf", qtyPerBatch: 100, unit: "pcs" },
    ],
  },
  {
    item: "Veg Biryani",
    batchSize: 50,
    outputUnit: "portions",
    batchTime: "1 hr 45 min",
    workstation: "Main Kitchen",
    ingredients: [
      { name: "Basmati Rice", qtyPerBatch: 8, unit: "kg" },
      { name: "Mixed Vegetables", qtyPerBatch: 10, unit: "kg" },
      { name: "Curd", qtyPerBatch: 3, unit: "L" },
      { name: "Ghee", qtyPerBatch: 1.5, unit: "kg" },
      { name: "Biryani Masala", qtyPerBatch: 0.8, unit: "kg" },
    ],
  },
  {
    item: "Ghee Roast Dosa",
    batchSize: 80,
    outputUnit: "servings",
    batchTime: "45 min",
    workstation: "Breakfast Counter",
    ingredients: [
      { name: "Dosa Batter", qtyPerBatch: 18, unit: "kg" },
      { name: "Ghee", qtyPerBatch: 2.4, unit: "kg" },
      { name: "Coconut Chutney", qtyPerBatch: 5, unit: "kg" },
      { name: "Sambar", qtyPerBatch: 18, unit: "L" },
    ],
  },
  {
    item: "Paneer Butter Masala",
    batchSize: 40,
    outputUnit: "portions",
    batchTime: "1 hr 20 min",
    workstation: "North Indian Kitchen",
    ingredients: [
      { name: "Paneer", qtyPerBatch: 8, unit: "kg" },
      { name: "Tomato", qtyPerBatch: 10, unit: "kg" },
      { name: "Onion", qtyPerBatch: 5, unit: "kg" },
      { name: "Butter", qtyPerBatch: 2, unit: "kg" },
      { name: "Cream", qtyPerBatch: 3, unit: "L" },
    ],
  },
  {
    item: "Fresh Lime",
    batchSize: 75,
    outputUnit: "glasses",
    batchTime: "30 min",
    workstation: "Beverage Counter",
    ingredients: [
      { name: "Lime", qtyPerBatch: 90, unit: "pcs" },
      { name: "Sugar Syrup", qtyPerBatch: 5, unit: "L" },
      { name: "Salt", qtyPerBatch: 0.25, unit: "kg" },
      { name: "Drinking Water", qtyPerBatch: 18, unit: "L" },
    ],
  },
];

const storeStock = [
  { item: "Raw Rice", unit: "kg", current: 240, reorderLevel: 80, shelfLifeDays: 180, receivedDate: "Apr 20, 2026" },
  { item: "Paneer", unit: "kg", current: 12, reorderLevel: 15, shelfLifeDays: 5, receivedDate: "Apr 29, 2026" },
  { item: "Tomato", unit: "kg", current: 28, reorderLevel: 25, shelfLifeDays: 4, receivedDate: "Apr 30, 2026" },
  { item: "Onion", unit: "kg", current: 90, reorderLevel: 30, shelfLifeDays: 20, receivedDate: "Apr 25, 2026" },
  { item: "Mixed Vegetables", unit: "kg", current: 16, reorderLevel: 20, shelfLifeDays: 3, receivedDate: "Apr 30, 2026" },
  { item: "Lime", unit: "pcs", current: 120, reorderLevel: 200, shelfLifeDays: 7, receivedDate: "Apr 28, 2026" },
];

const vendors = [
  { name: "Fresh Farm Traders", category: "Vegetables", rating: 4.6, leadTime: "1 day", payment: "7 days" },
  { name: "Kerala Rice Depot", category: "Grains", rating: 4.4, leadTime: "2 days", payment: "15 days" },
  { name: "Dairy Best Supplies", category: "Dairy", rating: 4.7, leadTime: "Same day", payment: "7 days" },
];

const quotations = [
  { item: "Paneer", vendor: "Dairy Best Supplies", qty: 40, unit: "kg", rate: 310, delivery: "Same day", selected: true },
  { item: "Paneer", vendor: "Fresh Farm Traders", qty: 40, unit: "kg", rate: 325, delivery: "1 day", selected: false },
  { item: "Lime", vendor: "Fresh Farm Traders", qty: 300, unit: "pcs", rate: 4.2, delivery: "1 day", selected: true },
  { item: "Lime", vendor: "Dairy Best Supplies", qty: 300, unit: "pcs", rate: 4.8, delivery: "Same day", selected: false },
];

const purchaseOrders = [
  { poNo: "PO-7001", vendor: "Dairy Best Supplies", item: "Paneer", orderedQty: 40, receivedQty: 38, unit: "kg", rate: 310, status: "GRN Variance" },
  { poNo: "PO-7002", vendor: "Fresh Farm Traders", item: "Lime", orderedQty: 300, receivedQty: 300, unit: "pcs", rate: 4.2, status: "GRN Matched" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function normalizeName(name) {
  return name.replace(/\s+/g, "");
}

function getHourlyProductionPlan(hourlyPlan, recipes, stock, bufferPercent = 10) {
  const itemTotals = recipes.map((recipe) => {
    const forecastQty = hourlyPlan.reduce((sum, row) => sum + (row[normalizeName(recipe.item)] || 0), 0);
    const bufferQty = Math.ceil((forecastQty * bufferPercent) / 100);
    const totalRequired = forecastQty + bufferQty;
    const availableStock = stock[recipe.item] || 0;
    const productionQty = Math.max(totalRequired - availableStock, 0);
    const batchesRequired = productionQty === 0 ? 0 : Math.ceil(productionQty / recipe.batchSize);
    const plannedOutput = batchesRequired * recipe.batchSize;
    return { ...recipe, forecastQty, bufferQty, totalRequired, availableStock, productionQty, batchesRequired, plannedOutput };
  });

  return itemTotals;
}

function getKotProductionDemand(kots) {
  const map = new Map();
  kots.forEach((kot) => {
    const existing = map.get(kot.item) || { item: kot.item, qty: 0, kitchen: kot.kitchen, tickets: 0 };
    existing.qty += kot.qty;
    existing.tickets += 1;
    map.set(kot.item, existing);
  });
  return Array.from(map.values());
}

function getBatchPlan(productionPlan) {
  return productionPlan.map((item) => ({
    item: item.item,
    workstation: item.workstation,
    batchSize: item.batchSize,
    productionQty: item.productionQty,
    batchesRequired: item.batchesRequired,
    plannedOutput: item.plannedOutput,
    excessQty: Math.max(item.plannedOutput - item.productionQty, 0),
    ingredientsRequired: item.ingredients.map((ingredient) => ({ ...ingredient, totalQty: Number((ingredient.qtyPerBatch * item.batchesRequired).toFixed(2)) })),
  }));
}

function getRequisitionFromBatchPlan(batchPlan, store) {
  const requisitionMap = new Map();
  batchPlan.forEach((batch) => {
    batch.ingredientsRequired.forEach((ingredient) => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      const existing = requisitionMap.get(key) || { item: ingredient.name, unit: ingredient.unit, requiredQty: 0, usedIn: [] };
      existing.requiredQty = Number((existing.requiredQty + ingredient.totalQty).toFixed(2));
      existing.usedIn = [...new Set([...existing.usedIn, batch.item])];
      requisitionMap.set(key, existing);
    });
  });

  return Array.from(requisitionMap.values()).map((req) => {
    const stockItem = store.find((stockItem) => stockItem.item === req.item && stockItem.unit === req.unit);
    const availableQty = stockItem?.current || 0;
    const issueQty = Math.min(req.requiredQty, availableQty);
    const shortageQty = Math.max(req.requiredQty - availableQty, 0);
    return { ...req, availableQty, issueQty, shortageQty, status: shortageQty > 0 ? "Shortage" : "Issue Ready" };
  });
}

function getStoreAlerts(store) {
  return store.map((item) => ({
    ...item,
    reorderQty: Math.max(item.reorderLevel - item.current, 0),
    reorderStatus: item.current <= item.reorderLevel ? "Reorder" : "OK",
    shelfLifeStatus: item.shelfLifeDays <= 5 ? "Use First" : "Normal",
  }));
}

function getPurchaseRequisition(storeAlerts, requisitions) {
  const reqItems = new Map();
  storeAlerts.filter((item) => item.reorderStatus === "Reorder").forEach((item) => {
    reqItems.set(`${item.item}-${item.unit}`, { item: item.item, unit: item.unit, qty: item.reorderQty, reason: "Reorder level" });
  });
  requisitions.filter((item) => item.shortageQty > 0).forEach((item) => {
    const key = `${item.item}-${item.unit}`;
    const existing = reqItems.get(key);
    reqItems.set(key, { item: item.item, unit: item.unit, qty: Math.max(existing?.qty || 0, item.shortageQty), reason: existing ? "Reorder + production shortage" : "Production shortage" });
  });
  return Array.from(reqItems.values());
}

function getQuotationComparison(quotes) {
  const grouped = quotes.reduce((acc, quote) => {
    acc[quote.item] = acc[quote.item] || [];
    acc[quote.item].push({ ...quote, total: quote.qty * quote.rate });
    return acc;
  }, {});
  return Object.entries(grouped).map(([item, itemQuotes]) => {
    const best = [...itemQuotes].sort((a, b) => a.rate - b.rate)[0];
    return { item, quotes: itemQuotes, bestVendor: best.vendor, bestRate: best.rate, bestTotal: best.total };
  });
}

function getGrnComparison(pos) {
  return pos.map((po) => ({
    ...po,
    qtyVariance: po.receivedQty - po.orderedQty,
    valueVariance: (po.receivedQty - po.orderedQty) * po.rate,
    grnStatus: po.receivedQty === po.orderedQty ? "Matched" : "Variance",
  }));
}

function runSelfTests() {
  const plan = getHourlyProductionPlan(hourlySalesPlan, recipeMasters, readyStock);
  const meals = plan.find((item) => item.item === "Kerala Meals");
  console.assert(meals.forecastQty === 310, "Kerala Meals forecast should total hourly plan");
  console.assert(meals.batchesRequired === 3, "Kerala Meals should need 3 batches after stock and buffer");

  const batchPlan = getBatchPlan(plan);
  const requisition = getRequisitionFromBatchPlan(batchPlan, storeStock);
  const paneer = requisition.find((item) => item.item === "Paneer");
  console.assert(paneer.requiredQty === 24, "Paneer requisition should equal 3 batches x 8 kg");

  const storeAlerts = getStoreAlerts(storeStock);
  const pr = getPurchaseRequisition(storeAlerts, requisition);
  console.assert(pr.some((item) => item.item === "Paneer"), "Purchase requisition should include Paneer");

  const grn = getGrnComparison(purchaseOrders);
  console.assert(grn[0].qtyVariance === -2, "GRN should compare PO qty with received qty");
}

runSelfTests();

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function Button({ children, active = false, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
        active ? "bg-slate-950 text-white shadow-sm hover:bg-slate-800" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ status }) {
  const tone =
    ["Paid", "Ready", "Issue Ready", "OK", "Matched", "GRN Matched", "Active", "Selected"].includes(status)
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : ["High", "Queued", "Preparing", "Use First", "Watch"].includes(status)
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : ["Reorder", "Shortage", "Variance", "GRN Variance", "Pending"].includes(status)
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-slate-50 text-slate-700 border-slate-200";
  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

function StatCard({ icon, label, value, sub }) {
  return (
    <Card className="rounded-2xl bg-white/90">
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
            <p className="mt-1 text-xs text-slate-500">{sub}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-xl text-slate-700">{icon}</div>
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-2xl bg-slate-100 p-3 text-xl">{icon}</div>
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, renderCell }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{columns.map((column) => <th key={column.key} className="p-3">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, index) => (
            <tr key={row.id || row.item || row.billNo || row.kotNo || row.poNo || index} className="hover:bg-orange-50/50">
              {columns.map((column) => <td key={column.key} className="p-3">{renderCell ? renderCell(row, column.key) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ModuleMap({ activeModule, setActiveModule }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {modules.map((module) => (
        <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`rounded-3xl border p-5 text-left shadow-sm transition ${activeModule === module.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-md"}`}>
          <div className="mb-4 text-3xl">{module.icon}</div>
          <h3 className="text-lg font-semibold">{module.title}</h3>
          <p className={`mt-2 text-sm leading-6 ${activeModule === module.id ? "text-slate-300" : "text-slate-500"}`}>{module.purpose}</p>
        </button>
      ))}
    </div>
  );
}

function ModuleDetail({ activeModule }) {
  const module = modules.find((item) => item.id === activeModule) || modules[0];
  return (
    <Card className="mt-6">
      <div className="p-5 md:p-6">
        <SectionHeader icon={module.icon} title={module.title} subtitle={module.purpose} />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <h3 className="font-semibold">Inputs</h3>
            <div className="mt-3 flex flex-wrap gap-2">{module.inputs.map((input) => <span key={input} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700">{input}</span>)}</div>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-4">
            <h3 className="font-semibold text-emerald-950">Outputs</h3>
            <div className="mt-3 flex flex-wrap gap-2">{module.outputs.map((output) => <span key={output} className="rounded-full bg-white px-3 py-1 text-sm text-emerald-800">{output}</span>)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function BillingKioskModule() {
  return (
    <Card>
      <div className="p-5 md:p-6">
        <SectionHeader icon="💳" title="Billing Counter & Self Kiosk" subtitle="Bill generation, kiosk orders, token issue and payment tracking" />
        <DataTable
          columns={[{ key: "billNo", label: "Bill" }, { key: "source", label: "Source" }, { key: "token", label: "Token" }, { key: "amount", label: "Amount" }, { key: "payment", label: "Payment" }, { key: "status", label: "Status" }]}
          rows={billingOrders}
          renderCell={(row, key) => key === "amount" ? formatCurrency(row.amount) : key === "status" ? <Badge status={row.status} /> : row[key]}
        />
      </div>
    </Card>
  );
}

function KotModule({ kotDemand }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <div className="p-5 md:p-6">
          <SectionHeader icon="🧾" title="KOT Management" subtitle="Section-wise ticket status for production and delivery" />
          <DataTable
            columns={[{ key: "kotNo", label: "KOT" }, { key: "token", label: "Token" }, { key: "item", label: "Item" }, { key: "qty", label: "Qty" }, { key: "kitchen", label: "Kitchen" }, { key: "status", label: "Status" }]}
            rows={kotTickets}
            renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : row[key]}
          />
        </div>
      </Card>
      <Card>
        <div className="p-5 md:p-6">
          <SectionHeader icon="🔥" title="KOT Production Demand" subtitle="Live production demand from pending tickets" />
          <div className="space-y-3">
            {kotDemand.map((item) => (
              <div key={item.item} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between"><p className="font-semibold">{item.item}</p><span className="text-lg font-bold">{item.qty}</span></div>
                <p className="mt-1 text-sm text-slate-500">{item.kitchen} • {item.tickets} KOT</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProductionPlanningModule({ productionPlan, batchPlan }) {
  return (
    <Card>
      <div className="p-5 md:p-6">
        <SectionHeader icon="📈" title="Production Planning" subtitle="Average hourly sales plan converted into item-wise production and recipe batches" />
        <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Formula: Forecast from hourly sales + 10% buffer - ready stock = production quantity. Batches = ceiling(production quantity / recipe batch size).
        </div>
        <DataTable
          columns={[{ key: "item", label: "Item" }, { key: "forecastQty", label: "Forecast" }, { key: "bufferQty", label: "Buffer" }, { key: "availableStock", label: "Ready Stock" }, { key: "productionQty", label: "Production Qty" }, { key: "batchesRequired", label: "Batches" }, { key: "plannedOutput", label: "Planned Output" }]}
          rows={productionPlan}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {batchPlan.map((batch) => (
            <div key={batch.item} className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
              <p className="font-semibold text-purple-950">{batch.item}</p>
              <p className="mt-1 text-sm text-purple-800">{batch.batchesRequired} batches × {batch.batchSize}</p>
              <p className="text-sm text-purple-800">Output: {batch.plannedOutput}</p>
              <p className="text-sm text-purple-800">Excess: {batch.excessQty}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function RecipeModule() {
  const [recipeForm, setRecipeForm] = useState({
    item: "New Recipe Item",
    batchSize: 100,
    outputUnit: "plates",
    batchTime: "1 hr",
    workstation: "Main Kitchen",
    ingredients: [{ name: "Raw Material", qtyPerBatch: 10, unit: "kg" }],
  });

  function updateIngredient(index, field, value) {
    setRecipeForm((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient, ingredientIndex) => ingredientIndex === index ? { ...ingredient, [field]: value } : ingredient),
    }));
  }

  return (
    <Card>
      <div className="p-5 md:p-6">
        <SectionHeader icon="📖" title="Recipe & Batch Management" subtitle="Editable recipe input format with batch output and input quantities" />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <label className="block text-sm"><span className="text-xs uppercase text-slate-500">Finished item</span><input value={recipeForm.item} onChange={(event) => setRecipeForm({ ...recipeForm, item: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="mt-3 block text-sm"><span className="text-xs uppercase text-slate-500">Batch output qty</span><input type="number" value={recipeForm.batchSize} onChange={(event) => setRecipeForm({ ...recipeForm, batchSize: Number(event.target.value) })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="mt-3 block text-sm"><span className="text-xs uppercase text-slate-500">Output unit</span><input value={recipeForm.outputUnit} onChange={(event) => setRecipeForm({ ...recipeForm, outputUnit: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
            <label className="mt-3 block text-sm"><span className="text-xs uppercase text-slate-500">Workstation</span><input value={recipeForm.workstation} onChange={(event) => setRecipeForm({ ...recipeForm, workstation: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" /></label>
          </div>
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Ingredient Inputs Per Batch</h3><Button active onClick={() => setRecipeForm({ ...recipeForm, ingredients: [...recipeForm.ingredients, { name: "", qtyPerBatch: 0, unit: "kg" }] })}>+ Add</Button></div>
            <DataTable
              columns={[{ key: "name", label: "Ingredient" }, { key: "qtyPerBatch", label: "Qty / Batch" }, { key: "unit", label: "Unit" }]}
              rows={recipeForm.ingredients.map((ingredient, index) => ({ ...ingredient, id: index }))}
              renderCell={(row, key) => key === "name" ? <input value={row.name} onChange={(event) => updateIngredient(row.id, "name", event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" /> : key === "qtyPerBatch" ? <input type="number" value={row.qtyPerBatch} onChange={(event) => updateIngredient(row.id, "qtyPerBatch", Number(event.target.value))} className="w-full rounded-xl border border-slate-200 px-3 py-2" /> : <input value={row.unit} onChange={(event) => updateIngredient(row.id, "unit", event.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2" />}
            />
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Preview: <strong>{recipeForm.item}</strong> produces <strong>{recipeForm.batchSize} {recipeForm.outputUnit}</strong> per batch using {recipeForm.ingredients.length} ingredients.
        </div>
      </div>
    </Card>
  );
}

function RequisitionStoreModule({ requisitions, storeAlerts, purchaseRequisition }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <div className="p-5 md:p-6">
          <SectionHeader icon="📋" title="Production Requisition" subtitle="Raw material demand generated from recipe batch planning" />
          <DataTable
            columns={[{ key: "item", label: "Material" }, { key: "requiredQty", label: "Required" }, { key: "availableQty", label: "Available" }, { key: "issueQty", label: "Issue" }, { key: "shortageQty", label: "Shortage" }, { key: "status", label: "Status" }]}
            rows={requisitions}
            renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : ["requiredQty", "availableQty", "issueQty", "shortageQty"].includes(key) ? `${row[key]} ${row.unit}` : row[key]}
          />
        </div>
      </Card>
      <Card>
        <div className="p-5 md:p-6">
          <SectionHeader icon="🏬" title="Store Management" subtitle="Stock level, reorder level and vegetable shelf-life planning" />
          <DataTable
            columns={[{ key: "item", label: "Material" }, { key: "current", label: "Current" }, { key: "reorderLevel", label: "Reorder Level" }, { key: "shelfLifeDays", label: "Shelf Life" }, { key: "reorderStatus", label: "Reorder" }, { key: "shelfLifeStatus", label: "Shelf Life Status" }]}
            rows={storeAlerts}
            renderCell={(row, key) => key === "reorderStatus" || key === "shelfLifeStatus" ? <Badge status={row[key]} /> : ["current", "reorderLevel"].includes(key) ? `${row[key]} ${row.unit}` : key === "shelfLifeDays" ? `${row[key]} days` : row[key]}
          />
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <h3 className="font-semibold text-rose-950">Purchase Requisition Generated</h3>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {purchaseRequisition.map((item) => <div key={`${item.item}-${item.unit}`} className="rounded-xl bg-white p-3 text-sm"><strong>{item.item}</strong>: {item.qty} {item.unit}<br /><span className="text-slate-500">{item.reason}</span></div>)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PurchaseModule({ quotationComparison, grnComparison }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <div className="p-5 md:p-6">
          <SectionHeader icon="🤝" title="Vendor & Quotation Comparison" subtitle="Vendor management, quotation comparison and best rate selection" />
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            {vendors.map((vendor) => <div key={vendor.name} className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold">{vendor.name}</p><p className="text-sm text-slate-500">{vendor.category}</p><p className="text-sm text-slate-500">Rating {vendor.rating} • {vendor.leadTime}</p></div>)}
          </div>
          <div className="space-y-4">
            {quotationComparison.map((group) => (
              <div key={group.item} className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{group.item}</h3><span className="text-sm text-emerald-700">Best: {group.bestVendor} @ {formatCurrency(group.bestRate)}</span></div>
                <DataTable columns={[{ key: "vendor", label: "Vendor" }, { key: "qty", label: "Qty" }, { key: "rate", label: "Rate" }, { key: "total", label: "Total" }, { key: "selected", label: "Selected" }]} rows={group.quotes} renderCell={(row, key) => key === "rate" || key === "total" ? formatCurrency(row[key]) : key === "selected" ? <Badge status={row.selected ? "Selected" : "Not Selected"} /> : key === "qty" ? `${row.qty} ${row.unit}` : row[key]} />
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-5 md:p-6">
          <SectionHeader icon="📦" title="Purchase Order & GRN" subtitle="Goods receipt generation with PO comparison" />
          <DataTable
            columns={[{ key: "poNo", label: "PO" }, { key: "vendor", label: "Vendor" }, { key: "item", label: "Item" }, { key: "orderedQty", label: "PO Qty" }, { key: "receivedQty", label: "GRN Qty" }, { key: "qtyVariance", label: "Variance" }, { key: "grnStatus", label: "Status" }]}
            rows={grnComparison}
            renderCell={(row, key) => key === "grnStatus" ? <Badge status={row[key]} /> : ["orderedQty", "receivedQty", "qtyVariance"].includes(key) ? `${row[key]} ${row.unit}` : row[key]}
          />
        </div>
      </Card>
    </div>
  );
}

export default function FoodCourtCateringManagementApp() {
  const [activeModule, setActiveModule] = useState("billing");

  const kotDemand = useMemo(() => getKotProductionDemand(kotTickets), []);
  const productionPlan = useMemo(() => getHourlyProductionPlan(hourlySalesPlan, recipeMasters, readyStock), []);
  const batchPlan = useMemo(() => getBatchPlan(productionPlan), [productionPlan]);
  const requisitions = useMemo(() => getRequisitionFromBatchPlan(batchPlan, storeStock), [batchPlan]);
  const storeAlerts = useMemo(() => getStoreAlerts(storeStock), []);
  const purchaseRequisition = useMemo(() => getPurchaseRequisition(storeAlerts, requisitions), [storeAlerts, requisitions]);
  const quotationComparison = useMemo(() => getQuotationComparison(quotations), []);
  const grnComparison = useMemo(() => getGrnComparison(purchaseOrders), []);

  const totalSales = billingOrders.reduce((sum, bill) => sum + bill.amount, 0);
  const totalBatches = batchPlan.reduce((sum, batch) => sum + batch.batchesRequired, 0);
  const totalShortages = requisitions.filter((item) => item.shortageQty > 0).length;
  const reorderCount = storeAlerts.filter((item) => item.reorderStatus === "Reorder").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-orange-100">🍽️ Food Court ERP Workflow</div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Modular Food Court & Catering Management System</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
                End-to-end modules from billing and self-kiosk KOT to production planning, recipe batch control, store requisition, purchase order and GRN comparison.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur md:min-w-80">
              <div><p className="text-xs text-slate-300">Today Billing</p><p className="text-xl font-semibold">{formatCurrency(totalSales)}</p></div>
              <div><p className="text-xs text-slate-300">Planned Batches</p><p className="text-xl font-semibold">{totalBatches}</p></div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard icon="💳" label="Billing/Kiosk" value={billingOrders.length} sub="Bills and tokens" />
          <StatCard icon="🧾" label="Open KOT" value={kotTickets.length} sub="Kitchen tickets" />
          <StatCard icon="📋" label="Shortages" value={totalShortages} sub="From requisition" />
          <StatCard icon="🏬" label="Reorder Alerts" value={reorderCount} sub="Raw materials" />
        </div>

        <Card className="mb-6">
          <div className="p-5 md:p-6">
            <SectionHeader icon="🔁" title="Suggested Module Flow" subtitle="Data moves from sales to production, store and purchase in this sequence" />
            <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">
              {modules.map((module, index) => (
                <div key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <div className="text-2xl">{module.icon}</div>
                  <p className="mt-2 text-xs font-semibold text-slate-700">{index + 1}. {module.title.split(" ").slice(0, 2).join(" ")}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <ModuleMap activeModule={activeModule} setActiveModule={setActiveModule} />
        <ModuleDetail activeModule={activeModule} />

        <div className="mt-6 space-y-6">
          <BillingKioskModule />
          <KotModule kotDemand={kotDemand} />
          <ProductionPlanningModule productionPlan={productionPlan} batchPlan={batchPlan} />
          <RecipeModule />
          <RequisitionStoreModule requisitions={requisitions} storeAlerts={storeAlerts} purchaseRequisition={purchaseRequisition} />
          <PurchaseModule quotationComparison={quotationComparison} grnComparison={grnComparison} />
        </div>
      </div>
    </div>
  );
}
