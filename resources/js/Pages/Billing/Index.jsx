import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Search, ChevronRight, X, FileText, CreditCard } from "lucide-react";
import ClinicLayout from "@/Layouts/ClinicLayout";
import Modal from "@/Components/Modal";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "paid", label: "Paid" },
    { key: "partial", label: "Partial" },
    { key: "unpaid", label: "Unpaid" },
];

export default function BillingIndex({ bills = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    
    // Modals state
    const [showViewModal, setShowViewModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    
    // Payment form state
    const [paymentAmount, setPaymentAmount] = useState("");
    const [discountInput, setDiscountInput] = useState("0");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [processing, setProcessing] = useState(false);

    // Filter Logic
    const filteredBills = bills.filter(bill => {
        const matchesTab = activeTab === "all" || bill.payment_status.toLowerCase() === activeTab;
        const matchesSearch = bill.patient_name.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // Status Badge Helper
    const getStatusPill = (status) => {
        const styles = {
            paid: "bg-[#dcf2ec] text-[#1f7a63]",
            partial: "bg-[#fcefd7] text-[#a5620d]",
            unpaid: "bg-[#fbe5e5] text-[#c14848]",
        };
        return (
            <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold capitalize ${styles[status] || styles.unpaid}`}>
                {status}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const openView = (bill) => {
        setSelectedBill(bill);
        setShowViewModal(true);
    };

    const openPayment = (bill) => {
        setSelectedBill(bill);
        setPaymentAmount(bill.balance.toString());
        setDiscountInput("0"); // Reset discount on open
        setPaymentMethod("cash");
        setShowPaymentModal(true);
    };

    const handleRecordPayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post(route('billing.pay', selectedBill.id), {
            amount: parseFloat(paymentAmount),
            discount: parseFloat(discountInput) || 0, 
            payment_method: paymentMethod,
        }, {
            onSuccess: () => {
                setShowPaymentModal(false);
                setProcessing(false);
            },
            onError: (errs) => {
                alert(errs.amount || errs.discount || "An error occurred.");
                setProcessing(false);
            }
        });
    };

    // Live calculation for the modal
    const currentDiscount = parseFloat(discountInput) || 0;
    const newTotalAmount = Math.max(0, (selectedBill?.subtotal || 0) - currentDiscount);
    const newBalance = Math.max(0, newTotalAmount - (selectedBill?.amount_paid || 0));
    const finalBalanceAfterPayment = Math.max(0, newBalance - (parseFloat(paymentAmount) || 0));

    return (
        <ClinicLayout>
            <Head title="Billing & Payments" />

            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 lg:px-16">
                {/* Header */}
                <div className="pb-8 flex justify-between items-end">
                    <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">Financials</p>
                        <h1 className="mt-3 text-[2.75rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">Billing & Payments</h1>
                    </div>
                </div>

                {flash.success && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-[14px] text-emerald-800">
                        {flash.success}
                    </div>
                )}

                {/* Card */}
                <div className="rounded-2xl border border-clinic-line bg-white shadow-[0_1px_2px_rgba(15,31,51,0.04)]">
                    
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-clinic-line px-7 py-5">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search patient name..."
                                className="w-full rounded-xl border border-clinic-line bg-white py-2.5 pl-11 pr-4 text-[14px] text-clinic-ink placeholder:text-slate-400 focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                            />
                        </div>

                        <div className="inline-flex items-center gap-1 rounded-xl border border-clinic-line bg-slate-50 p-1">
                            {FILTERS.map((f) => {
                                const active = activeTab === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        onClick={() => setActiveTab(f.key)}
                                        className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition ${
                                            active ? "bg-white text-clinic-ink shadow-sm" : "text-slate-500 hover:text-clinic-ink"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-clinic-line text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                    <th className="px-7 py-4">Patient</th>
                                    <th className="px-7 py-4 text-center">Billing Date</th>
                                    <th className="px-7 py-4 text-right">Total Amount</th>
                                    <th className="px-7 py-4 text-right">Amount Paid</th>
                                    <th className="px-7 py-4 text-right">Balance</th>
                                    <th className="px-7 py-4 text-center">Payment Status</th>
                                    <th className="px-7 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#edf0f4]">
                                {filteredBills.map((bill) => (
                                    <tr key={bill.id} className="transition-colors hover:bg-slate-50/70">
                                        <td className="px-7 py-5">
                                            <p className="text-[15px] font-semibold text-clinic-ink">{bill.patient_name}</p>
                                            <p className="text-[13px] text-slate-500">{bill.service || "Consultation"}</p>
                                        </td>
                                        <td className="px-7 py-5 text-center text-[14px] text-slate-600">
                                            {formatDate(bill.billing_date)}
                                        </td>
                                        <td className="px-7 py-5 text-right text-[14px] font-semibold text-clinic-ink">
                                            ₱{Number(bill.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            {bill.discount > 0 && (
                                                <span className="block text-[11px] font-medium text-slate-400">
                                                    ₱{Number(bill.discount).toLocaleString()} discount
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-7 py-5 text-right text-[14px] text-slate-600">
                                            ₱{Number(bill.amount_paid).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </td>
                                        <td className={`px-7 py-5 text-right text-[14px] font-semibold ${bill.balance > 0 ? 'text-[#c14848]' : 'text-[#1f7a63]'}`}>
                                            ₱{Number(bill.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="px-7 py-5 text-center">
                                            {getStatusPill(bill.payment_status)}
                                        </td>
                                        <td className="px-7 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openView(bill)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-clinic-line bg-white px-4 py-2 text-[13px] font-semibold text-clinic-ink transition hover:border-clinic-blue hover:bg-slate-50"
                                                >
                                                    View <ChevronRight className="h-4 w-4" />
                                                </button>
                                                {bill.balance > 0 && (
                                                    <button
                                                        onClick={() => openPayment(bill)}
                                                        className="inline-flex items-center rounded-xl border border-orange-200 bg-[#fdf1e1] px-4 py-2 text-[13px] font-semibold text-[#a5620d] transition hover:bg-[#fcefd7]"
                                                    >
                                                        Add payment
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── VIEW BILL MODAL (closeable={false}) ─────────────────── */}
            <Modal 
                show={showViewModal} 
                onClose={() => setShowViewModal(false)} 
                maxWidth="2xl"
                closeable={false} 
            >
                {selectedBill && (
                    <div className="flex flex-col">
                        <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                            <div className="flex items-start gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                                    <FileText className="h-6 w-6" />
                                </span>
                                <div>
                                    <h2 className="text-[20px] font-semibold text-clinic-ink">
                                        Bill #{selectedBill.id.toString().padStart(4, '0')}
                                    </h2>
                                    <p className="mt-1 text-[14px] text-slate-500">
                                        Billing record for {selectedBill.patient_name}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowViewModal(false)}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between border-b border-clinic-line px-8 py-6 bg-slate-50/50">
                            <div>
                                <h3 className="text-[18px] font-semibold text-clinic-ink">{selectedBill.patient_name}</h3>
                                <p className="text-[14px] text-slate-500">{selectedBill.service || "Consultation"}</p>
                            </div>
                            {getStatusPill(selectedBill.payment_status)}
                        </div>

                        <div className="grid grid-cols-2 gap-8 px-8 py-7">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Patient ID</p>
                                <p className="text-[14px] font-semibold text-clinic-ink">#{selectedBill.id}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Appointment ID</p>
                                <p className="text-[14px] font-semibold text-clinic-ink">#{selectedBill.id}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Billing Date</p>
                                <p className="text-[14px] font-semibold text-clinic-ink">{formatDate(selectedBill.billing_date)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Last Updated</p>
                                <p className="text-[14px] font-semibold text-clinic-ink">{formatDate(selectedBill.billing_date)}</p>
                            </div>
                        </div>

                        <div className="mx-8 border-t border-dashed border-slate-200"></div>

                        <div className="px-8 py-7">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Payment Breakdown</p>
                            
                            <div className="space-y-4 text-[14px]">
                                {selectedBill.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-slate-600">
                                        <span className="flex items-center gap-2">
                                            {item.qty > 1 ? `${item.qty}x ` : ""}
                                            {item.name}
                                        </span>
                                        <span className="font-semibold text-clinic-ink">
                                            ₱{Number(item.qty * item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </span>
                                    </div>
                                ))}

                                <div className="border-t border-dashed border-slate-200 my-2 pt-2"></div>
                                
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-clinic-ink">
                                        ₱{Number(selectedBill.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Discount</span>
                                    <span className="font-semibold text-[#c14848]">
                                        - ₱{Number(selectedBill.discount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </span>
                                </div>
                                
                                <div className="pt-2">
                                    <div className="flex justify-between text-[15px] font-bold text-clinic-ink mb-4">
                                        <span>Total amount</span>
                                        <span>₱{Number(selectedBill.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px] text-slate-600">
                                        <span>Amount paid</span>
                                        <span className="font-semibold text-clinic-ink">
                                            ₱{Number(selectedBill.amount_paid).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mx-8 mb-4 rounded-xl bg-[#fdf1e1] p-4 flex justify-between items-center">
                            <span className="text-[14px] font-semibold text-[#a5620d]">Balance due</span>
                            <span className="text-[20px] font-bold text-[#a5620d]">
                                ₱{Number(selectedBill.balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </span>
                        </div>

                        <div className="px-8 pb-6 flex justify-between items-center">
                            <p className="text-[11px] text-slate-400">Record created {formatDate(selectedBill.billing_date)}</p>
                            <button
                                type="button"
                                onClick={() => setShowViewModal(false)}
                                className="rounded-xl border border-clinic-line bg-white px-6 py-2.5 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ── RECORD PAYMENT MODAL (closeable={false}) ───────────────── */}
            <Modal 
                show={showPaymentModal} 
                onClose={() => setShowPaymentModal(false)} 
                maxWidth="md"
                closeable={false}
            >
                {selectedBill && (
                    <form onSubmit={handleRecordPayment} className="flex flex-col">
                        <div className="flex items-start justify-between border-b border-clinic-line px-8 py-6">
                            <div className="flex items-start gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf0fb] text-clinic-blue">
                                    <CreditCard className="h-6 w-6" />
                                </span>
                                <div>
                                    <h2 className="text-[20px] font-semibold text-clinic-ink">Record payment</h2>
                                    <p className="mt-1 text-[14px] text-slate-500">
                                        Bill #{selectedBill.id.toString().padStart(4, '0')} · {selectedBill.patient_name}
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={() => setShowPaymentModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-8 py-6 space-y-5">
                            
                            {/* Discount Input */}
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">Discount (₱)</label>
                                <input
                                    type="number"
                                    value={discountInput}
                                    onChange={(e) => {
                                        setDiscountInput(e.target.value);
                                        const newBal = Math.max(0, (selectedBill.subtotal - (parseFloat(e.target.value) || 0)) - selectedBill.amount_paid);
                                        setPaymentAmount(newBal.toString());
                                    }}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                    min="0"
                                    max={selectedBill.subtotal}
                                />
                            </div>

                            {/* Current Balance */}
                            <div className="rounded-xl bg-[#f8fafc] p-4 flex justify-between items-center border border-slate-100">
                                <span className="text-[13px] font-medium text-slate-500">Current balance</span>
                                <span className="text-[16px] font-bold text-[#a5620d]">₱{newBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">Payment amount</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15"
                                    min="0"
                                    max={newBalance}
                                    step="0.01"
                                    required
                                />
                            </div>

                            {/* Method Input */}
                            <div>
                                <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">Payment method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full rounded-xl border border-clinic-line px-4 py-3 text-[15px] text-clinic-ink focus:border-clinic-blue focus:outline-none focus:ring-2 focus:ring-clinic-blue/15 appearance-none"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="gcash">GCash</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>

                            {/* Live Balance After Payment Calculation */}
                            <div className="rounded-xl bg-[#e6f6f2] p-4 flex justify-between items-center">
                                <span className="text-[13px] font-semibold text-[#1f7a63]">Balance after payment</span>
                                <span className="text-[16px] font-bold text-[#1f7a63]">
                                    ₱{finalBalanceAfterPayment.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-clinic-line bg-slate-50/60 px-8 py-5">
                            <button 
                                type="button" 
                                onClick={() => setShowPaymentModal(false)} 
                                className="rounded-xl border border-clinic-line bg-white px-6 py-2.5 text-[14px] font-semibold text-clinic-ink hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="rounded-xl bg-clinic-navy px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#0f3a5c] disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save payment"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </ClinicLayout>
    );
}