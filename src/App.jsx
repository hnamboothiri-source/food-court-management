import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const userModules = [
  { id: "billingCounter", title: "Billing Counter", icon: "💳", userRole: "Cashier", purpose: "Fast POS billing with full kitchen visibility.", permissions: ["Create bill", "Hold bill", "Generate KOT"] },
  { id: "selfKiosk", title: "Self Desk Kiosk", icon: "🖥️", userRole: "Customer", purpose: "Customer ordering screen showing only available products.", permissions: ["Order", "Pay", "Print token"] },
  { id: "kotManagement", title: "KOT Management", icon: "🧾", userRole: "Kitchen Dispatcher", purpose: "Manage kitchen tickets and delivery status.", permissions: ["View KOT", "Mark ready", "Mark delivered"] },
  { id: "productionManagement", title: "Production + Requisition", icon: "🏭", userRole: "Production Supervisor", purpose: "Convert KOT and batch demand into production and material requisition.", permissions: ["Create production", "Request materials", "Close production"] },
  { id: "productionPlanning", title: "Production Planning", icon: "📈", userRole: "Planning Manager", purpose: "Plan item-wise output from hourly sales average and recipe batches.", permissions: ["Create plan", "Edit forecast", "Approve plan"] },
  { id: "storeManagement", title: "Store Management", icon: "🏬", userRole: "Store Keeper", purpose: "Issue stock, manage reorder levels and shelf life.", permissions: ["Issue stock", "Track expiry", "Raise shortage"] },
  { id: "purchase", title: "Purchase", icon: "🛒", userRole: "Purchase Manager", purpose: "Manage PR, vendor quotes, PO and GRN comparison.", permissions: ["Create PR", "Compare quote", "Verify GRN"] },
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
  { billNo: "BILL-1001", source: "Counter", token: "A114", amount: 455, payment: "UPI", status: "Paid" },
  { billNo: "BILL-1002", source: "Self Kiosk", token: "K021", amount: 320, payment: "Card", status: "Paid" },
  { billNo: "BILL-1003", source: "Counter", token: "A115", amount: 610, payment: "Cash", status: "Paid" },
  { billNo: "BILL-1004", source: "Self Kiosk", token: "K022", amount: 225, payment: "UPI", status: "Pending" },
];

const kotTickets = [
  { kotNo: "KOT-501", token: "A114", item: "Kerala Meals", qty: 2, kitchen: "Meals Kitchen", status: "Preparing" },
  { kotNo: "KOT-502", token: "K021", item: "Veg Biryani", qty: 2, kitchen: "Main Kitchen", status: "Ready" },
  { kotNo: "KOT-503", token: "A115", item: "Paneer Butter Masala", qty: 3, kitchen: "North Indian Kitchen", status: "Preparing" },
  { kotNo: "KOT-504", token: "K022", item: "Fresh Lime", qty: 5, kitchen: "Beverage Counter", status: "Queued" },
];

const recipes = [
  { item: "Kerala Meals", batchSize: 100, workstation: "Meals Kitchen", ingredients: [{ name: "Raw Rice", qtyPerBatch: 18, unit: "kg" }, { name: "Sambar Vegetables", qtyPerBatch: 22, unit: "kg" }] },
  { item: "Veg Biryani", batchSize: 50, workstation: "Main Kitchen", ingredients: [{ name: "Basmati Rice", qtyPerBatch: 8, unit: "kg" }, { name: "Mixed Vegetables", qtyPerBatch: 10, unit: "kg" }] },
  { item: "Ghee Roast Dosa", batchSize: 80, workstation: "Breakfast Counter", ingredients: [{ name: "Dosa Batter", qtyPerBatch: 18, unit: "kg" }, { name: "Ghee", qtyPerBatch: 2.4, unit: "kg" }] },
  { item: "Paneer Butter Masala", batchSize: 40, workstation: "North Indian Kitchen", ingredients: [{ name: "Paneer", qtyPerBatch: 8, unit: "kg" }, { name: "Tomato", qtyPerBatch: 10, unit: "kg" }] },
  { item: "Fresh Lime", batchSize: 75, workstation: "Beverage Counter", ingredients: [{ name: "Lime", qtyPerBatch: 90, unit: "pcs" }, { name: "Sugar Syrup", qtyPerBatch: 5, unit: "L" }] },
];

const hourlySalesPlan = [
  { item: "Kerala Meals", forecast: 310, readyStock: 42 },
  { item: "Veg Biryani", forecast: 238, readyStock: 28 },
  { item: "Ghee Roast Dosa", forecast: 195, readyStock: 36 },
  { item: "Paneer Butter Masala", forecast: 150, readyStock: 18 },
  { item: "Fresh Lime", forecast: 295, readyStock: 60 },
];

const storeStock = [
  { item: "Raw Rice", unit: "kg", current: 240, reorderLevel: 80, shelfLifeDays: 180 },
  { item: "Paneer", unit: "kg", current: 12, reorderLevel: 15, shelfLifeDays: 5 },
  { item: "Tomato", unit: "kg", current: 28, reorderLevel: 25, shelfLifeDays: 4 },
  { item: "Mixed Vegetables", unit: "kg", current: 16, reorderLevel: 20, shelfLifeDays: 3 },
  { item: "Lime", unit: "pcs", current: 120, reorderLevel: 200, shelfLifeDays: 7 },
];

const vendors = [
  { name: "Fresh Farm Traders", category: "Vegetables", rating: 4.6, leadTime: "1 day" },
  { name: "Kerala Rice Depot", category: "Grains", rating: 4.4, leadTime: "2 days" },
  { name: "Dairy Best Supplies", category: "Dairy", rating: 4.7, leadTime: "Same day" },
];

const quotations = [
  { item: "Paneer", vendor: "Dairy Best Supplies", qty: 40, unit: "kg", rate: 310, selected: true },
  { item: "Paneer", vendor: "Fresh Farm Traders", qty: 40, unit: "kg", rate: 325, selected: false },
  { item: "Lime", vendor: "Fresh Farm Traders", qty: 300, unit: "pcs", rate: 4.2, selected: true },
  { item: "Lime", vendor: "Dairy Best Supplies", qty: 300, unit: "pcs", rate: 4.8, selected: false },
];

const purchaseOrders = [
  { poNo: "PO-7001", vendor: "Dairy Best Supplies", item: "Paneer", orderedQty: 40, receivedQty: 38, unit: "kg", rate: 310 },
  { poNo: "PO-7002", vendor: "Fresh Farm Traders", item: "Lime", orderedQty: 300, receivedQty: 300, unit: "pcs", rate: 4.2 },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function getKitchenStatusMap(kitchens) {
  return kitchens.reduce((map, kitchen) => ({ ...map, [kitchen.kitchen]: kitchen }), {});
}

function getSellableProducts(items, kitchens, mode = "counter") {
  const kitchenMap = getKitchenStatusMap(kitchens);
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

function getProductionPlan() {
  return hourlySalesPlan.map((row) => {
    const recipe = recipes.find((item) => item.item === row.item);
    const buffer = Math.ceil(row.forecast * 0.1);
    const productionQty = Math.max(row.forecast + buffer - row.readyStock, 0);
    const batches = recipe ? Math.ceil(productionQty / recipe.batchSize) : 0;
    return { ...row, buffer, productionQty, batchSize: recipe?.batchSize || 0, batches, plannedOutput: batches * (recipe?.batchSize || 0), workstation: recipe?.workstation || "Unmapped" };
  });
}

function getRequisitions(batchPlan) {
  const map = new Map();
  batchPlan.forEach((plan) => {
    const recipe = recipes.find((item) => item.item === plan.item);
    recipe?.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      const current = map.get(key) || { item: ingredient.name, unit: ingredient.unit, requiredQty: 0 };
      current.requiredQty = Number((current.requiredQty + ingredient.qtyPerBatch * plan.batches).toFixed(2));
      map.set(key, current);
    });
  });
  return Array.from(map.values()).map((req) => {
    const stock = storeStock.find((item) => item.item === req.item && item.unit === req.unit);
    const availableQty = stock?.current || 0;
    const shortageQty = Math.max(req.requiredQty - availableQty, 0);
    return { ...req, availableQty, issueQty: Math.min(req.requiredQty, availableQty), shortageQty, status: shortageQty > 0 ? "Shortage" : "Issue Ready" };
  });
}

function getStoreAlerts() {
  return storeStock.map((item) => ({
    ...item,
    reorderStatus: item.current <= item.reorderLevel ? "Reorder" : "OK",
    shelfLifeStatus: item.shelfLifeDays <= 5 ? "Use First" : "Normal",
  }));
}

function getPurchaseRequisition(storeAlerts, requisitions) {
  const items = new Map();
  storeAlerts.filter((item) => item.reorderStatus === "Reorder").forEach((item) => items.set(`${item.item}-${item.unit}`, { item: item.item, unit: item.unit, qty: item.reorderLevel - item.current, reason: "Reorder level" }));
  requisitions.filter((item) => item.shortageQty > 0).forEach((item) => {
    const key = `${item.item}-${item.unit}`;
    const existing = items.get(key);
    items.set(key, { item: item.item, unit: item.unit, qty: Math.max(existing?.qty || 0, item.shortageQty), reason: existing ? "Reorder + production shortage" : "Production shortage" });
  });
  return Array.from(items.values());
}

function getQuotationComparison() {
  const grouped = quotations.reduce((acc, quote) => {
    acc[quote.item] = acc[quote.item] || [];
    acc[quote.item].push({ ...quote, total: quote.qty * quote.rate });
    return acc;
  }, {});
  return Object.entries(grouped).map(([item, quotes]) => {
    const best = [...quotes].sort((a, b) => a.rate - b.rate)[0];
    return { item, quotes, bestVendor: best.vendor, bestRate: best.rate };
  });
}

function getGrnComparison() {
  return purchaseOrders.map((po) => ({ ...po, qtyVariance: po.receivedQty - po.orderedQty, grnStatus: po.receivedQty === po.orderedQty ? "Matched" : "Variance" }));
}

function getModuleById(moduleId) {
  return userModules.find((module) => module.id === moduleId) || userModules[0];
}

function runSelfTests() {
  const kioskProducts = getSellableProducts(menuItems, kitchenAvailability, "kiosk");
  console.assert(!kioskProducts.some((item) => item.kitchen === "Breakfast Counter"), "Closed kitchen products should not appear in kiosk mode");
  const counterProducts = getSellableProducts(menuItems, kitchenAvailability, "counter");
  console.assert(counterProducts.some((item) => item.kitchen === "Breakfast Counter" && !item.isAvailable), "Counter should see closed kitchen items as unavailable");
  const totals = getCartTotals([{ price: 100, qty: 2 }, { price: 50, qty: 1 }]);
  console.assert(totals.subtotal === 250 && totals.tax === 13 && totals.total === 263, "Cart totals should calculate subtotal, GST and total");
  console.assert(getProductionPlan().find((item) => item.item === "Kerala Meals").batches === 3, "Kerala Meals should require three batches");
  console.assert(getModuleById("missing").id === "billingCounter", "Invalid module should fall back to Billing Counter");
}

runSelfTests();

function Card({ children, className = "" }) {
  return <div className={`border border-[#d8e5e7] bg-white ${className}`}>{children}</div>;
}

function Button({ children, active = false, disabled = false, className = "", ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#abffae]/60 disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-[#00262b] text-white hover:bg-[#0b363b]" : "border border-[#abffae] bg-white text-[#0b363b] hover:bg-[#eafde8]"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ status }) {
  const tone = ["Paid", "Ready", "Issue Ready", "OK", "Matched", "Active", "Selected", "Open", "Available"].includes(status)
    ? "border-[#abffae] bg-[#eafde8] text-[#0b363b]"
    : ["High", "Queued", "Preparing", "Use First", "Watch"].includes(status)
      ? "border-[#feefe8] bg-[#feefe8] text-[#8b3911]"
      : "border-[#e0f4ff] bg-[#e0f4ff] text-[#0a3890]";
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="border border-[#d8e5e7] bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[#4f6466]">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#00262b]">{value}</h3>
          <p className="mt-1 text-xs text-[#354d51]">{sub}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e0f4ff] text-xl">{icon}</div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#d8e5e7] bg-[#fafafa] text-xl">{icon}</div>
      <div>
        <h2 className="text-2xl font-semibold text-[#00262b]">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#354d51]">{subtitle}</p>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, renderCell }) {
  return (
    <div className="overflow-x-auto border border-[#d8e5e7] bg-white">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-[#fafafa] text-xs uppercase text-[#4f6466]">
          <tr>{columns.map((column) => <th key={column.key} className="border-b border-[#d8e5e7] p-3 font-semibold">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-[#eef4f5] bg-white text-[#00262b]">
          {rows.map((row, index) => (
            <tr key={row.id || row.item || row.billNo || row.kotNo || row.poNo || row.name || index} className="hover:bg-[#fafafa]">
              {columns.map((column) => <td key={column.key} className="p-3 align-middle">{renderCell ? renderCell(row, column.key) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ icon = "🧭", title, subtitle }) {
  return <div className="border border-dashed border-[#a1c2c6] bg-[#fafafa] p-8 text-center"><div className="text-4xl">{icon}</div><h3 className="mt-3 text-xl font-semibold text-[#00262b]">{title}</h3><p className="mt-1 text-sm text-[#354d51]">{subtitle}</p></div>;
}

function SidebarNavigation({ activeModule, setActiveModule }) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-[#d8e5e7] bg-white p-6 lg:block">
      <div className="mb-8 border border-[#d8e5e7] bg-[#fafafa] p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#00262b] text-2xl text-white">🍽️</div>
        <h1 className="mt-5 text-2xl font-semibold text-[#00262b]">Food Court ERP</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#354d51]">Role-based screens for billing, kitchen, store and purchase.</p>
      </div>
      <div className="mb-3 px-1 text-xs font-semibold uppercase text-[#4f6466]">Work areas</div>
      <nav className="space-y-2">
        {userModules.map((module) => {
          const isActive = activeModule === module.id;
          return <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`group flex w-full items-center gap-3 rounded-full px-4 py-3 text-left transition ${isActive ? "bg-[#00262b] text-white" : "text-[#0b363b] hover:bg-[#eafde8]"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl ${isActive ? "bg-white/10" : "bg-[#fafafa] group-hover:bg-white"}`}>{module.icon}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{module.title}</span><span className={`block truncate text-xs ${isActive ? "text-[#e0f4ff]" : "text-[#4f6466]"}`}>{module.userRole}</span></span></button>;
        })}
      </nav>
    </aside>
  );
}

function MobileModuleTabs({ activeModule, setActiveModule }) {
  return <div className="mb-6 overflow-x-auto lg:hidden"><div className="flex min-w-max gap-2">{userModules.map((module) => <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeModule === module.id ? "bg-[#00262b] text-white" : "border border-[#abffae] bg-white text-[#0b363b]"}`}>{module.icon} {module.title}</button>)}</div></div>;
}

function UserWorkflowGrid({ activeModule, setActiveModule }) {
  const activeIndex = userModules.findIndex((module) => module.id === activeModule);
  return (
    <Card className="mb-8 bg-white">
      <div className="p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><h3 className="text-2xl font-semibold text-[#00262b]">Choose your work area</h3><p className="mt-1 text-sm text-[#354d51]">Each role opens one focused operational screen.</p></div>
          <div className="rounded-full border border-[#abffae] bg-[#eafde8] px-4 py-2 text-sm font-semibold text-[#0b363b]">Active: {getModuleById(activeModule).title}</div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          {userModules.map((module, index) => {
            const isActive = activeModule === module.id;
            const isDone = index < activeIndex;
            return <button key={module.id} type="button" onClick={() => setActiveModule(module.id)} className={`border p-4 text-left transition ${isActive ? "border-[#00262b] bg-[#00262b] text-white" : "border-[#d8e5e7] bg-[#fafafa] text-[#00262b] hover:border-[#0b363b] hover:bg-white"}`}><div className="flex items-start justify-between gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-md text-2xl ${isActive ? "bg-white/10" : "bg-white"}`}>{module.icon}</span><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isActive ? "bg-white/10 text-white" : isDone ? "bg-[#eafde8] text-[#0b363b]" : "bg-white text-[#4f6466]"}`}>{isDone ? "Done" : index + 1}</span></div><p className={`mt-4 text-sm font-semibold leading-5 ${isActive ? "text-white" : "text-[#00262b]"}`}>{module.title}</p><p className={`mt-1 text-xs leading-5 ${isActive ? "text-[#e0f4ff]" : "text-[#354d51]"}`}>{module.userRole}</p></button>;
          })}
        </div>
      </div>
    </Card>
  );
}

function ModuleDetail({ activeModule }) {
  const module = getModuleById(activeModule);
  return <Card className="mb-8 bg-white"><div className="p-8"><div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between"><div className="flex items-start gap-5"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-[#00262b] text-3xl text-white">{module.icon}</div><div><div className="mb-3 inline-flex rounded-full border border-[#abffae] bg-[#eafde8] px-3 py-1 text-xs font-semibold uppercase text-[#0b363b]">{module.userRole}</div><h2 className="text-4xl font-semibold text-[#00262b]">{module.title}</h2><p className="mt-3 max-w-4xl text-base leading-relaxed text-[#354d51]">{module.purpose}</p></div></div><div className="grid gap-2 sm:grid-cols-3 xl:w-[520px]">{module.permissions.slice(0, 3).map((permission) => <div key={permission} className="border border-[#d8e5e7] bg-[#fafafa] px-3 py-3 text-center text-xs font-semibold text-[#354d51]">{permission}</div>)}</div></div></div></Card>;
}

function RoleModuleContent(props) {
  switch (props.activeModule) {
    case "billingCounter": return <BillingKioskModule defaultMode="counter" />;
    case "selfKiosk": return <BillingKioskModule defaultMode="kiosk" />;
    case "kotManagement": return <KotModule kotDemand={props.kotDemand} />;
    case "productionManagement": return <ProductionManagementModule batchPlan={props.batchPlan} requisitions={props.requisitions} kotDemand={props.kotDemand} />;
    case "productionPlanning": return <ProductionPlanningModule productionPlan={props.productionPlan} batchPlan={props.batchPlan} />;
    case "storeManagement": return <StoreManagementModule requisitions={props.requisitions} storeAlerts={props.storeAlerts} purchaseRequisition={props.purchaseRequisition} />;
    case "purchase": return <PurchaseModule quotationComparison={props.quotationComparison} grnComparison={props.grnComparison} />;
    default: return <BillingKioskModule defaultMode="counter" />;
  }
}

function BillingKioskModule({ defaultMode = "counter" }) {
  const [selectedCounter, setSelectedCounter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const billingMode = defaultMode;
  const counters = useMemo(() => ["All", ...new Set(menuItems.map((item) => item.counter))], []);
  const products = useMemo(() => getSellableProducts(menuItems, kitchenAvailability, billingMode).filter((item) => (selectedCounter === "All" || item.counter === selectedCounter) && (item.name.toLowerCase().includes(searchText.toLowerCase()) || item.counter.toLowerCase().includes(searchText.toLowerCase()))), [billingMode, selectedCounter, searchText]);
  const totals = useMemo(() => getCartTotals(cart), [cart]);
  const isKiosk = billingMode === "kiosk";

  function addToCart(product) {
    if (!product.isAvailable) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...current, { id: product.id, name: product.name, price: product.price, kitchen: product.kitchen, qty: 1 }];
    });
  }

  function updateCartQty(productId, change) {
    setCart((current) => current.map((item) => (item.id === productId ? { ...item, qty: item.qty + change } : item)).filter((item) => item.qty > 0));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
      <div className="space-y-5">
        <Card>
          <div className="bg-[#00262b] p-6 text-white"><SectionHeader icon={isKiosk ? "🖥️" : "💳"} title={isKiosk ? "Self Desk Kiosk" : "Billing Counter"} subtitle={isKiosk ? "Only available products are visible to customers." : "Counter staff can see unavailable products as disabled."} /></div>
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">{kitchenAvailability.map((kitchen) => <div key={kitchen.kitchen} className={`border p-4 ${kitchen.status === "Open" ? "border-[#abffae] bg-[#eafde8]" : "border-[#e0f4ff] bg-[#e0f4ff]"}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-[#00262b]">{kitchen.kitchen.replace(" Kitchen", "")}</p><Badge status={kitchen.status} /></div><p className="mt-2 text-xs text-[#354d51]">{kitchen.reason}</p></div>)}</div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex flex-wrap gap-2">{counters.map((counter) => <Button key={counter} active={selectedCounter === counter} onClick={() => setSelectedCounter(counter)}>{counter}</Button>)}</div><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search food item..." className="w-full border border-[#d8e5e7] bg-[#fafafa] px-4 py-3 text-sm font-semibold outline-none focus:bg-white xl:w-80" /></div>
            {isKiosk && <div className="mb-4 border border-[#d8e5e7] bg-[#fafafa] px-4 py-3 text-sm font-semibold text-[#354d51]">Closed-kitchen items are hidden in kiosk mode.</div>}
            {products.length === 0 ? <EmptyState icon="🍽️" title="No products available" subtitle="Try another counter or check kitchen availability." /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product) => <button key={product.id} type="button" onClick={() => addToCart(product)} disabled={!product.isAvailable} className={`border p-4 text-left transition ${product.isAvailable ? "border-[#d8e5e7] bg-white hover:border-[#0b363b]" : "cursor-not-allowed border-[#d8e5e7] bg-[#fafafa] opacity-60"}`}><div className="flex items-start justify-between gap-3"><div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#fafafa] text-4xl">{product.image}</div><Badge status={product.isAvailable ? "Available" : "Unavailable"} /></div><h3 className="mt-4 text-lg font-semibold text-[#00262b]">{product.name}</h3><p className="mt-1 text-xs font-semibold text-[#354d51]">{product.counter} • {product.kitchen}</p><div className="mt-5 flex items-end justify-between gap-3"><p className="text-3xl font-semibold tracking-tight text-[#00262b]">{formatCurrency(product.price)}</p><span className="rounded-full bg-[#eafde8] px-3 py-1 text-xs font-semibold text-[#0b363b]">Add</span></div></button>)}</div>}
          </div>
        </Card>
      </div>
      <div className="xl:sticky xl:top-5 xl:self-start"><Card><div className="bg-[#00262b] p-5 text-white"><div className="flex items-center justify-between"><div><h3 className="text-2xl font-semibold">Current Bill</h3><p className="text-sm text-[#e0f4ff]">{isKiosk ? "Kiosk order" : "Counter sale"}</p></div><button type="button" onClick={() => setCart([])} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">Clear</button></div></div><div className="max-h-[430px] space-y-3 overflow-y-auto bg-white p-4">{cart.length > 0 ? cart.map((item) => <div key={item.id} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#00262b]">{item.name}</p><p className="text-xs text-[#354d51]">{formatCurrency(item.price)} × {item.qty}</p></div><p className="font-semibold">{formatCurrency(item.price * item.qty)}</p></div><div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => updateCartQty(item.id, -1)} className="h-10 w-10 border border-[#d8e5e7] bg-white font-semibold">-</button><span className="w-8 text-center font-semibold">{item.qty}</span><button type="button" onClick={() => updateCartQty(item.id, 1)} className="h-10 w-10 border border-[#d8e5e7] bg-white font-semibold">+</button></div></div>) : <EmptyState icon="🛒" title="Cart is empty" subtitle="Tap a product to add it to the bill." />}</div><div className="border-t border-[#d8e5e7] bg-white p-5"><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-[#354d51]">Items</span><strong>{totals.qty}</strong></div><div className="flex justify-between"><span className="text-[#354d51]">Subtotal</span><strong>{formatCurrency(totals.subtotal)}</strong></div><div className="flex justify-between"><span className="text-[#354d51]">GST 5%</span><strong>{formatCurrency(totals.tax)}</strong></div><div className="flex justify-between border-t border-[#d8e5e7] pt-4 text-2xl"><span className="font-semibold">Total</span><strong>{formatCurrency(totals.total)}</strong></div></div><div className="mt-5 grid gap-2"><Button active className="w-full py-4 text-base" disabled={cart.length === 0}>Generate Bill & KOT</Button><Button className="w-full" disabled={cart.length === 0}>Hold Bill</Button></div></div></Card></div>
    </div>
  );
}

function KotModule({ kotDemand }) {
  return <div className="grid gap-6 xl:grid-cols-3"><Card className="xl:col-span-2"><div className="p-6"><SectionHeader icon="🧾" title="KOT Management" subtitle="Section-wise ticket status for production and delivery." /><DataTable columns={[{ key: "kotNo", label: "KOT" }, { key: "token", label: "Token" }, { key: "item", label: "Item" }, { key: "qty", label: "Qty" }, { key: "kitchen", label: "Kitchen" }, { key: "status", label: "Status" }]} rows={kotTickets} renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : row[key]} /></div></Card><Card><div className="p-6"><SectionHeader icon="🔥" title="KOT Demand" subtitle="Live production demand." /><div className="space-y-3">{kotDemand.map((item) => <div key={item.item} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><div className="flex items-center justify-between"><p className="font-semibold">{item.item}</p><span className="text-lg font-semibold">{item.qty}</span></div><p className="mt-1 text-sm text-[#354d51]">{item.kitchen} • {item.tickets} KOT</p></div>)}</div></div></Card></div>;
}

function ProductionPlanningModule({ productionPlan, batchPlan }) {
  return <Card><div className="p-6"><SectionHeader icon="📈" title="Production Planning" subtitle="Average hourly sales converted into item-wise production and batches." /><DataTable columns={[{ key: "item", label: "Item" }, { key: "forecast", label: "Forecast" }, { key: "buffer", label: "Buffer" }, { key: "readyStock", label: "Ready Stock" }, { key: "productionQty", label: "Production Qty" }, { key: "batches", label: "Batches" }, { key: "plannedOutput", label: "Planned Output" }]} rows={productionPlan} /><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{batchPlan.map((batch) => <div key={batch.item} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><p className="font-semibold text-[#00262b]">{batch.item}</p><p className="mt-1 text-sm text-[#354d51]">{batch.batches} batches × {batch.batchSize}</p><p className="text-sm text-[#354d51]">Output: {batch.plannedOutput}</p></div>)}</div></div></Card>;
}

function ProductionManagementModule({ kotDemand, batchPlan, requisitions }) {
  return <div className="grid gap-6 xl:grid-cols-2"><Card><div className="p-6"><SectionHeader icon="🏭" title="Production Management" subtitle="KOT demand, batch production and kitchen execution." /><div className="grid gap-3 md:grid-cols-2">{batchPlan.map((batch) => <div key={batch.item} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><p className="font-semibold">{batch.item}</p><p className="text-sm text-[#354d51]">Production: {batch.productionQty}</p><p className="text-sm text-[#354d51]">Batches: {batch.batches}</p></div>)}</div></div></Card><Card><div className="p-6"><SectionHeader icon="📋" title="Production Requisition" subtitle="Material requirements from recipe batches." /><DataTable columns={[{ key: "item", label: "Material" }, { key: "requiredQty", label: "Required" }, { key: "availableQty", label: "Available" }, { key: "issueQty", label: "Issue" }, { key: "shortageQty", label: "Shortage" }, { key: "status", label: "Status" }]} rows={requisitions} renderCell={(row, key) => key === "status" ? <Badge status={row.status} /> : ["requiredQty", "availableQty", "issueQty", "shortageQty"].includes(key) ? `${row[key]} ${row.unit}` : row[key]} /></div></Card></div>;
}

function StoreManagementModule({ requisitions, storeAlerts, purchaseRequisition }) {
  return <div className="grid gap-6 xl:grid-cols-2"><Card><div className="p-6"><SectionHeader icon="🏬" title="Store Management" subtitle="Stock, reorder level and shelf-life planning." /><DataTable columns={[{ key: "item", label: "Material" }, { key: "current", label: "Current" }, { key: "reorderLevel", label: "Reorder Level" }, { key: "shelfLifeDays", label: "Shelf Life" }, { key: "reorderStatus", label: "Reorder" }, { key: "shelfLifeStatus", label: "Shelf Life" }]} rows={storeAlerts} renderCell={(row, key) => key.includes("Status") ? <Badge status={row[key]} /> : ["current", "reorderLevel"].includes(key) ? `${row[key]} ${row.unit}` : key === "shelfLifeDays" ? `${row[key]} days` : row[key]} /></div></Card><Card><div className="p-6"><SectionHeader icon="📦" title="Purchase Request" subtitle="Generated from shortages and reorder alerts." /><div className="grid gap-3 md:grid-cols-2">{purchaseRequisition.map((item) => <div key={`${item.item}-${item.unit}`} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><p className="font-semibold">{item.item}</p><p className="text-sm text-[#354d51]">{item.qty} {item.unit}</p><p className="text-xs text-[#354d51]">{item.reason}</p></div>)}</div></div></Card></div>;
}

function PurchaseModule({ quotationComparison, grnComparison }) {
  return <div className="grid gap-6 xl:grid-cols-2"><Card><div className="p-6"><SectionHeader icon="🤝" title="Vendor & Quotation" subtitle="Compare supplier rates and choose best quote." /><div className="mb-5 grid gap-3 md:grid-cols-3">{vendors.map((vendor) => <div key={vendor.name} className="border border-[#d8e5e7] bg-[#fafafa] p-4"><p className="font-semibold">{vendor.name}</p><p className="text-sm text-[#354d51]">{vendor.category}</p><p className="text-sm text-[#354d51]">Rating {vendor.rating} • {vendor.leadTime}</p></div>)}</div>{quotationComparison.map((group) => <div key={group.item} className="mb-4 border border-[#d8e5e7] p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">{group.item}</h3><span className="text-sm text-[#0b363b]">Best: {group.bestVendor} @ {formatCurrency(group.bestRate)}</span></div><DataTable columns={[{ key: "vendor", label: "Vendor" }, { key: "qty", label: "Qty" }, { key: "rate", label: "Rate" }, { key: "total", label: "Total" }, { key: "selected", label: "Selected" }]} rows={group.quotes} renderCell={(row, key) => key === "rate" || key === "total" ? formatCurrency(row[key]) : key === "selected" ? <Badge status={row.selected ? "Selected" : "Not Selected"} /> : key === "qty" ? `${row.qty} ${row.unit}` : row[key]} /></div>)}</div></Card><Card><div className="p-6"><SectionHeader icon="📦" title="Purchase Order & GRN" subtitle="Compare ordered and received quantity." /><DataTable columns={[{ key: "poNo", label: "PO" }, { key: "vendor", label: "Vendor" }, { key: "item", label: "Item" }, { key: "orderedQty", label: "PO Qty" }, { key: "receivedQty", label: "GRN Qty" }, { key: "qtyVariance", label: "Variance" }, { key: "grnStatus", label: "Status" }]} rows={grnComparison} renderCell={(row, key) => key === "grnStatus" ? <Badge status={row[key]} /> : ["orderedQty", "receivedQty", "qtyVariance"].includes(key) ? `${row[key]} ${row.unit}` : row[key]} /></div></Card></div>;
}

export default function FoodCourtCateringManagementApp() {
  const [activeModule, setActiveModule] = useState("billingCounter");
  const productionPlan = useMemo(() => getProductionPlan(), []);
  const batchPlan = productionPlan;
  const requisitions = useMemo(() => getRequisitions(batchPlan), [batchPlan]);
  const storeAlerts = useMemo(() => getStoreAlerts(), []);
  const purchaseRequisition = useMemo(() => getPurchaseRequisition(storeAlerts, requisitions), [storeAlerts, requisitions]);
  const kotDemand = useMemo(() => {
    const map = new Map();
    kotTickets.forEach((ticket) => {
      const existing = map.get(ticket.item) || { item: ticket.item, qty: 0, kitchen: ticket.kitchen, tickets: 0 };
      existing.qty += ticket.qty;
      existing.tickets += 1;
      map.set(ticket.item, existing);
    });
    return Array.from(map.values());
  }, []);
  const quotationComparison = useMemo(() => getQuotationComparison(), []);
  const grnComparison = useMemo(() => getGrnComparison(), []);
  const active = getModuleById(activeModule);
  const totalSales = billingOrders.reduce((sum, bill) => sum + bill.amount, 0);
  const totalBatches = batchPlan.reduce((sum, batch) => sum + batch.batches, 0);
  const totalShortages = requisitions.filter((item) => item.shortageQty > 0).length;
  const reorderCount = storeAlerts.filter((item) => item.reorderStatus === "Reorder").length;

  return (
    <div className="min-h-screen bg-[#ebebeb] font-sans text-[#00262b]">
      <div className="flex min-h-screen">
        <SidebarNavigation activeModule={activeModule} setActiveModule={setActiveModule} />
        <main className="min-w-0 flex-1 p-3 md:p-5">
          <div className="mx-auto max-w-[1500px]">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mb-8 border border-[#d8e5e7] bg-white">
              <div className="grid gap-0 xl:grid-cols-[1fr_560px]"><div className="bg-white p-8 md:p-10"><div className="mb-4 inline-flex rounded-full border border-[#abffae] bg-[#eafde8] px-3 py-1 text-sm font-semibold text-[#0b363b]">{active.userRole}</div><h1 className="max-w-4xl text-5xl font-semibold text-[#00262b] md:text-6xl">{active.title}</h1><p className="mt-4 max-w-3xl text-base leading-relaxed text-[#354d51]">{active.purpose}</p></div><div className="grid grid-cols-2 border-l border-[#d8e5e7] bg-[#fafafa] p-5"><StatCard icon="💳" label="Sales" value={formatCurrency(totalSales)} sub="Today" /><StatCard icon="🧾" label="KOT" value={kotTickets.length} sub="Open tickets" /><StatCard icon="📋" label="Shortage" value={totalShortages} sub="Materials" /><StatCard icon="🏬" label="Reorder" value={reorderCount} sub="Alerts" /></div></div>
            </motion.div>
            <MobileModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />
            <UserWorkflowGrid activeModule={activeModule} setActiveModule={setActiveModule} />
            <ModuleDetail activeModule={activeModule} />
            <RoleModuleContent activeModule={activeModule} kotDemand={kotDemand} productionPlan={productionPlan} batchPlan={batchPlan} requisitions={requisitions} storeAlerts={storeAlerts} purchaseRequisition={purchaseRequisition} quotationComparison={quotationComparison} grnComparison={grnComparison} />
          </div>
        </main>
      </div>
    </div>
  );
}
