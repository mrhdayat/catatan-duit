"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createTransaction, deleteTransaction, updateTransaction, upsertBudget } from "@/lib/actions";
import { useToast, Toast } from "@/components/ui/Toast";
import { format } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Transaction = {
  id: string;
  amount: number;
  type: "DEBIT" | "CREDIT";
  category: string;
  description: string;
  date: Date | string;
  essential: boolean;
};

type Budget = {
  id: string;
  limit: number;
  category: string;
}

export default function DashboardClient({ transactions, userId, budget }: { transactions: Transaction[], userId: string, budget: Budget | null }) {
  const [skeletonMode, setSkeletonMode] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Modal States
  const [showStats, setShowStats] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  // Derived Data
  const displayedTransactions = skeletonMode
    ? transactions.filter((t) => t.essential || t.category === "INCOME" || t.type === "CREDIT")
    : transactions;

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === "CREDIT" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const essentialBalance = transactions.filter(t => t.essential || t.type === "CREDIT").reduce((acc, curr) => {
    return curr.type === "CREDIT" ? acc + curr.amount : acc - curr.amount;
  }, 0);

  // Analysis Data
  const totalSpending = transactions.filter(t => t.type === 'DEBIT').reduce((acc, curr) => acc + curr.amount, 0);
  const essentialSpending = transactions.filter(t => t.type === 'DEBIT' && t.essential).reduce((acc, curr) => acc + curr.amount, 0);

  // Gauge Calculation
  const budgetLimit = budget?.limit || 0;
  // If Skeleton Mode: Show % of Essential Spending vs Total Spending (Efficiency?)
  // If Normal Mode: Show % of Total Spending vs Budget (Usage)
  let gaugeValue = 0;
  let gaugeLabel = "";
  let gaugeSubtext = "";

  if (skeletonMode) {
    // Ratio of Essentials. Higher is "Stricter".
    // E.g. 500 essential / 1000 total = 50% skeleton ratio.
    gaugeValue = totalSpending > 0 ? Math.round((essentialSpending / totalSpending) * 100) : 0;
    gaugeLabel = `${gaugeValue}%`;
    gaugeSubtext = "RATIO PENGELUARAN PENTING";
  } else {
    // Budget Usage
    gaugeValue = budgetLimit > 0 ? Math.round((totalSpending / budgetLimit) * 100) : 0;
    gaugeLabel = `${gaugeValue}%`;
    gaugeSubtext = `DARI BUDGET Rp ${budgetLimit.toLocaleString("id-ID")}`;
  }

  // Stats Data for Chart (Group by Category)
  const statsDataRaw = transactions.filter(t => t.type === 'DEBIT').reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const statsData = Object.entries(statsDataRaw).map(([name, value]) => ({ name, value }));

  async function handleAdd(formData: FormData) {
    const res = await createTransaction(null, formData);
    if (res?.error) {
      addToast(res.error as string, "error");
    } else {
      addToast(res?.success as string, "success");
      formRef.current?.reset();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin mau hapus jejak ini?")) return;
    const formData = new FormData();
    formData.append("id", id);
    const res = await deleteTransaction(formData);
    if (res?.error) addToast(res.error, "error");
    else addToast(res?.success as string, "success");
  }

  async function handleUpdate(formData: FormData) {
    const res = await updateTransaction(formData);
    if (res?.error) addToast(res.error, "error");
    else {
      addToast(res?.success as string, "success");
      setIsEditing(null);
    }
  }

  async function handleBudget(formData: FormData) {
    const res = await upsertBudget(formData);
    if (res?.error) addToast(res.error as string, "error");
    else {
      addToast(res?.success as string, "success");
      setShowBudget(false);
    }
  }

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>

      {/* Control Panel / Header */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-6 gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">
            Markas<span className="text-carbon-500">_Duit</span>
          </h1>
          <p className="font-mono text-xs md:text-sm text-carbon-400">
            {"//"} RECORD: {displayedTransactions.length} DATA
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-carbon-500 block">Sisa Duit Lo</span>
            <span className={`text-3xl md:text-5xl font-mono font-bold ${skeletonMode ? 'text-neon-orange' : 'text-neon-green'}`}>
              Rp {(skeletonMode ? essentialBalance : totalBalance).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono uppercase text-carbon-300">Mode Survival:</label>
            <Button
              variant={skeletonMode ? "neon" : "outline"}
              onClick={() => setSkeletonMode(!skeletonMode)}
              className="text-xs py-2"
            >
              {skeletonMode ? "ON (MISKIN MODE)" : "OFF (NORMAL)"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: List & Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Add Transaction Form */}
          <Card variant="concrete" className="p-4">
            <h3 className="font-bold mb-4 uppercase text-sm border-b border-gray-600 pb-2">Tambah Catatan Baru</h3>
            <form ref={formRef} action={handleAdd} className="grid grid-cols-2 gap-4">
              <input type="hidden" name="userId" value={userId} />
              <div className="col-span-2">
                <input name="description" placeholder="Beli apa lo?" required className="w-full bg-carbon-900 border border-carbon-600 p-2 text-sm font-mono focus:border-neon-green outline-none" />
              </div>
              <div>
                <input name="amount" type="number" step="0.01" placeholder="Harga (Rp)" required className="w-full bg-carbon-900 border border-carbon-600 p-2 text-sm font-mono focus:border-neon-green outline-none" />
              </div>
              <div>
                <input name="category" placeholder="Kategori (Makan/Transport)" required className="w-full bg-carbon-900 border border-carbon-600 p-2 text-sm font-mono focus:border-neon-green outline-none" />
              </div>
              <div>
                <select name="type" className="w-full bg-carbon-900 border border-carbon-600 p-2 text-sm font-mono focus:border-neon-green outline-none">
                  <option value="DEBIT">PENGELUARAN (DEBIT)</option>
                  <option value="CREDIT">PEMASUKAN (CREDIT)</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="essential" id="essential" className="accent-neon-green w-4 h-4" />
                <label htmlFor="essential" className="text-xs font-mono uppercase">PENTING BANGET?</label>
              </div>
              <div className="col-span-2">
                <Button type="submit" variant="outline" className="w-full hover:bg-white hover:text-black">SIMPAN DATA</Button>
              </div>
            </form>
          </Card>

          <div className="relative font-mono text-sm bg-white text-black p-6 shadow-[8px_8px_0_#333] max-w-2xl mx-auto">
            {/* Receipt Styling Details */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMEgwWiIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg==')] bg-contain"></div>
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEwxMCAxMEwyMCAwSDBaIiBmaWxsPSIjMWExYTFhIi8+PC9zdmc+')] bg-contain transform rotate-180 translate-y-full"></div>

            <div className="text-center mb-6 border-b-2 border-dashed border-black pb-4">
              <h4 className="font-bold text-2xl">CATATAN DUIT</h4>
              <p className="text-xs">LAPORAN KEUANGAN PRIBADI</p>
              <p className="text-xs">{new Date().toLocaleDateString("id-ID")}</p>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {displayedTransactions.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-8">BELUM ADA DATA, MISKIN AMAT?</p>
                )}
                {displayedTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-dotted border-gray-400 pb-2 group"
                  >
                    {isEditing === tx.id ? (
                      <form action={handleUpdate} className="flex flex-col gap-2 bg-gray-100 p-2">
                        <input type="hidden" name="id" value={tx.id} />
                        <input name="description" defaultValue={tx.description} className="bg-white border p-1 text-xs" />
                        <input name="amount" type="number" defaultValue={tx.amount} className="bg-white border p-1 text-xs" />
                        <div className="flex gap-2">
                          <Button type="submit" variant="solid" className="py-1 px-2 text-[10px]">SAVE</Button>
                          <button type="button" onClick={() => setIsEditing(null)} className="text-[10px] underline">CANCEL</button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="font-bold uppercase">{tx.description}</span>
                          <span className="text-[10px] text-gray-500">
                            {format(new Date(tx.date), "dd/MM/yyyy HH:mm")} [{tx.category}]
                            {tx.essential && <span className="ml-1 text-red-500 font-bold">*PENTING</span>}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${tx.type === 'DEBIT' ? '' : 'text-green-700'}`}>
                            {tx.type === 'DEBIT' ? '' : '+'}Rp {tx.amount.toLocaleString("id-ID")}
                          </div>
                          <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(tx.id)} className="text-[10px] text-blue-600 hover:underline">EDIT</button>
                            <button onClick={() => handleDelete(tx.id)} className="text-[10px] text-red-600 hover:underline">HAPUS</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-end font-bold text-lg">
              <span>TOTAL</span>
              <span>Rp {(skeletonMode ? essentialBalance : totalBalance).toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="lg:col-span-5 space-y-8">
          <Card variant="concrete" className="min-h-[300px] flex flex-col justify-between p-6">
            <h3 className="font-bold text-carbon-400 border-b border-carbon-700 pb-2">ANALISA SKELETON</h3>

            <div className="flex-1 flex flex-col items-center justify-center py-6">
              {/* Functional Gauge */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#333" strokeWidth="12" fill="transparent" />
                  <circle cx="80" cy="80" r="70" stroke={skeletonMode ? "#39ff14" : (gaugeValue > 100 ? "#ef4444" : "#e0e0e0")} strokeWidth="12" fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * Math.min(gaugeValue, 100) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black">{gaugeLabel}</span>
                  <span className="text-[10px] text-carbon-400 uppercase text-center max-w-[80px] leading-tight mt-1">
                    {skeletonMode ? "ESSENTIAL RATIO" : "BUDGET USED"}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center font-mono text-xs border-t border-carbon-700 pt-4">
              <p className="text-carbon-300 mb-1">{gaugeSubtext}</p>
              <p className={skeletonMode ? "text-neon-green" : "text-white"}>
                {skeletonMode ? "FOKUS KEBUTUHAN POKOK" : (gaugeValue > 100 ? "⚠️ WARNING: OVER BUDGET" : "STATUS: AMAN TERKENDALI")}
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card
              variant="outline"
              className="text-center hover:bg-carbon-800 transition-colors cursor-pointer group flex flex-col items-center justify-center py-8"
              onClick={() => setShowStats(true)}
            >
              <div className="text-4xl mb-2 group-hover:rotate-12 transition-transform">📉</div>
              <h4 className="font-bold text-sm">STATISTIK</h4>
            </Card>
            <Card
              variant="outline"
              className="text-center hover:bg-carbon-800 transition-colors cursor-pointer group flex flex-col items-center justify-center py-8"
              onClick={() => setShowBudget(true)}
            >
              <div className="text-4xl mb-2 group-hover:rotate-12 transition-transform">⚓</div>
              <h4 className="font-bold text-sm">ATUR BUDGET</h4>
            </Card>
          </div>
        </div>
      </div>

      {/* STATISTICS MODAL */}
      <Modal title="Statistik Pengeluaran" isOpen={showStats} onClose={() => setShowStats(false)}>
        <div className="h-[300px] w-full text-xs font-mono">
          {statsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#666" hide />
                <YAxis dataKey="name" type="category" stroke="#fff" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #fff' }}
                  itemStyle={{ color: '#39ff14' }}
                  formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}
                />
                <Bar dataKey="value" fill="#333" barSize={20}>
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'ESSENTIAL' ? '#39ff14' : '#e0e0e0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-carbon-500">
              BELUM ADA DATA TRANSAKSI
            </div>
          )}
        </div>
        <div className="mt-4 text-center text-xs text-carbon-400">
          * Data berdasarkan kategori pengeluaran
        </div>
      </Modal>

      {/* BUDGET MODAL */}
      <Modal title="Atur Limit Bulanan" isOpen={showBudget} onClose={() => setShowBudget(false)}>
        <form action={handleBudget} className="space-y-6 p-2">
          <input type="hidden" name="userId" value={userId} />

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-carbon-300">Target Maksimal (Rp)</label>
            <input
              name="limit"
              type="number"
              defaultValue={budget?.limit || 0}
              className="w-full bg-black border-2 border-carbon-600 p-4 text-xl font-mono text-neon-green focus:border-neon-green outline-none"
              placeholder="0"
            />
            <p className="text-[10px] text-carbon-500">Isi &apos;0&apos; kalau mau unlimited (Bahaya bos!).</p>
          </div>

          <div className="bg-carbon-900/50 p-4 border border-dashed border-carbon-700 text-xs">
            <p className="mb-2"><strong>RULES:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-carbon-400">
              <li>Kalau lewat limit, indikator bakal merah.</li>
              <li>Budget ini berlaku global (semua kategori).</li>
              <li>Jujur sama diri sendiri itu kunci.</li>
            </ul>
          </div>

          <Button type="submit" variant="neon" className="w-full">
            SIMPAN BUDGET
          </Button>
        </form>
      </Modal>

    </div>
  );
}
