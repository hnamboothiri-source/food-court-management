import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Utensils,
  ShoppingCart,
  CalendarDays,
  Users,
  ChefHat,
  Truck,
  IndianRupee,
  Plus,
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
} from 'lucide-react';

const menuItems = [
  { id: 1, name: 'Kerala Meals', category: 'Lunch', price: 160, stock: 42, status: 'Available' },
  { id: 2, name: 'Veg Biryani', category: 'Main Course', price: 180, stock: 28, status: 'Available' },
  { id: 3, name: 'Ghee Roast Dosa', category: 'Breakfast', price: 95, stock: 36, status: 'Available' },
  { id: 4, name: 'Paneer Butter Masala', category: 'Curry', price: 220, stock: 18, status: 'Low Stock' },
  { id: 5, name: 'Fresh Lime', category: 'Beverage', price: 45, stock: 60, status: 'Available' },
];

const cateringOrders = [
  {
    id: 'CAT-1024',
    customer: 'Sreedhareeyam Corporate Event',
    date: 'May 4, 2026',
    guests: 180,
    value: 126000,
    status: 'Confirmed',
  },
  {
    id: 'CAT-1025',
    customer: 'Wedding Lunch - Tripunithura',
    date: 'May 7, 2026',
    guests: 350,
    value: 287500,
    status: 'Planning',
  },
  {
    id: 'CAT-1026',
    customer: 'College Seminar Catering',
    date: 'May 11, 2026',
    guests: 120,
    value: 72000,
    status: 'Quotation Sent',
  },
];

const foodCourtOrders = [
  { token: 'A114', counter: 'South Indian', items: 3, amount: 295, status: 'Preparing', eta: '8 min' },
  { token: 'B087', counter: 'Meals', items: 2, amount: 320, status: 'Ready', eta: 'Now' },
  { token: 'C021', counter: 'Beverages', items: 4, amount: 180, status: 'Delivered', eta: 'Done' },
  { token: 'A115', counter: 'North Indian', items: 5, amount: 610, status: 'Preparing', eta: '14 min' },
];

const inventory = [
  { item: 'Rice', qty: '240 kg', reorder: '80 kg', health: 'Good' },
  { item: 'Coconut Oil', qty: '46 L', reorder: '30 L', health: 'Good' },
  { item: 'Paneer', qty: '12 kg', reorder: '15 kg', health: 'Reorder' },
  { item: 'Banana Leaf', qty: '420 pcs', reorder: '300 pcs', health: 'Good' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function Button({ children, active, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-slate-950 text-white shadow-sm hover:bg-slate-800'
          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="bg-white/90">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
            <p className="mt-1 text-xs text-slate-500">{sub}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }) {
  const tone =
    status === 'Ready' || status === 'Confirmed' || status === 'Available' || status === 'Good'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'Delivered'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : status === 'Low Stock' || status === 'Reorder'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : 'bg-amber-50 text-amber-700 border-amber-200';

  return <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('Dashboard');

  const filteredMenu = useMemo(() => {
    const q = query.toLowerCase();
    return menuItems.filter((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [query]);

  const todaySales = foodCourtOrders.reduce((sum, order) => sum + order.amount, 0) + 48500;
  const cateringPipeline = cateringOrders.reduce((sum, order) => sum + order.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-orange-100">
                <Utensils className="h-4 w-4" /> Food Court & Catering Management
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Operations dashboard for daily sales, catering orders, menu and stock
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Manage counters, kitchen tokens, catering bookings, guest counts, inventory alerts and daily revenue from one simple app.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur md:min-w-72">
              <div>
                <p className="text-xs text-slate-300">Today</p>
                <p className="text-xl font-semibold">{formatCurrency(todaySales)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-300">Pipeline</p>
                <p className="text-xl font-semibold">{formatCurrency(cateringPipeline)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {['Dashboard', 'Food Court', 'Catering', 'Inventory'].map((view) => (
              <Button key={view} onClick={() => setActiveView(view)} active={activeView === view}>
                {view}
              </Button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu or category"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-orange-200 focus:ring-4"
            />
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
          Current view: <strong>{activeView}</strong>. This starter is frontend-ready and can be connected to a backend/API next.
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard icon={ShoppingCart} label="Food court orders" value="146" sub="32 active kitchen tokens" />
          <StatCard icon={CalendarDays} label="Catering bookings" value="12" sub="Next 14 days" />
          <StatCard icon={Users} label="Guests planned" value="1,840" sub="Confirmed catering count" />
          <StatCard icon={IndianRupee} label="Monthly revenue" value="₹18.6L" sub="Food court + catering" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Live food court orders</h2>
                  <p className="text-sm text-slate-500">Kitchen token tracking by counter</p>
                </div>
                <Button active>
                  <Plus className="mr-2 h-4 w-4" /> New order
                </Button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Token</th>
                      <th className="p-3">Counter</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">ETA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {foodCourtOrders.map((order) => (
                      <tr key={order.token} className="hover:bg-orange-50/60">
                        <td className="p-3 font-semibold">{order.token}</td>
                        <td className="p-3">{order.counter}</td>
                        <td className="p-3">{order.items}</td>
                        <td className="p-3">{formatCurrency(order.amount)}</td>
                        <td className="p-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3 text-slate-500">{order.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 md:p-6">
              <h2 className="text-xl font-semibold">Kitchen priorities</h2>
              <div className="mt-5 space-y-4">
                <div className="flex gap-3 rounded-2xl bg-amber-50 p-4">
                  <Clock className="mt-1 h-5 w-5 text-amber-700" />
                  <div>
                    <p className="font-medium">Prepare 350 guest wedding menu</p>
                    <p className="text-sm text-slate-500">Finalize purchase list by tomorrow.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-medium">Meals counter running smoothly</p>
                    <p className="text-sm text-slate-500">Average delivery time is 9 minutes.</p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-rose-50 p-4">
                  <AlertCircle className="mt-1 h-5 w-5 text-rose-700" />
                  <div>
                    <p className="font-medium">Paneer below reorder level</p>
                    <p className="text-sm text-slate-500">Raise purchase request today.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <ChefHat className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-semibold">Menu management</h2>
                  <p className="text-sm text-slate-500">Search, pricing and availability</p>
                </div>
              </div>
              <div className="space-y-3">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        {item.category} • Stock {item.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price)}</p>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <Truck className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-semibold">Catering pipeline</h2>
                  <p className="text-sm text-slate-500">Bookings, quotations and guest count</p>
                </div>
              </div>
              <div className="space-y-3">
                {cateringOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{order.customer}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {order.id} • {order.date} • {order.guests} guests
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-3 text-lg font-semibold">{formatCurrency(order.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-6">
          <div className="p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <Package className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-semibold">Inventory control</h2>
                <p className="text-sm text-slate-500">Stock quantity, reorder levels and alerts</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {inventory.map((stock) => (
                <div key={stock.item} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <ClipboardList className="h-5 w-5 text-slate-500" />
                    <StatusBadge status={stock.health} />
                  </div>
                  <p className="font-semibold">{stock.item}</p>
                  <p className="mt-1 text-sm text-slate-500">Current: {stock.qty}</p>
                  <p className="text-sm text-slate-500">Reorder: {stock.reorder}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
