import React, { useState, useRef } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import { ArrowRight, CheckCircle2, Check, X } from "lucide-react";
import html2canvas from "html2canvas";

export default function Landing() {
    const { services, flash, auth } = usePage().props;
    const [activeSection, setActiveSection] = useState("home");
    
    // Receipt State
    const [showReceipt, setShowReceipt] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const receiptRef = useRef(null);

    // Slot availability state
    const [slotInfo, setSlotInfo] = useState(null);
    const [checkingSlot, setCheckingSlot] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        patient_name: "",
        age: "",
        telephone: "",
        email: "",
        occupation: "",
        address: "",
        next_appointment: "",
        services: [], 
        complaint: "",
        note: "",
    });

    // Check remaining slots for the selected date
    const checkSlotAvailability = async (dateTimeValue) => {
        if (!dateTimeValue) {
            setSlotInfo(null);
            return;
        }

        const dateOnly = dateTimeValue.split("T")[0];

        setCheckingSlot(true);
        try {
            const res = await fetch(`/slots/check?date=${dateOnly}`);
            const json = await res.json();
            setSlotInfo(json);
        } catch (err) {
            setSlotInfo(null);
        } finally {
            setCheckingSlot(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        const selectedServiceId = data.services[0];
        const selectedService = services.find(s => String(s.id) === String(selectedServiceId));

        post(route("appointments.publicStore"), {
            onSuccess: () => {
                setSubmittedData({
                    ...data,
                    service_name: selectedService?.name || "Not specified"
                });
                setShowReceipt(true);
                reset();
                setSlotInfo(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    };

    const scrollTo = (id) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDownloadReceipt = async () => {
        if (!receiptRef.current) return;
        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
            });
            const link = document.createElement("a");
            link.download = `Appointment_Receipt_${submittedData.patient_name?.replace(/\s+/g, "_") || "Patient"}.jpg`;
            link.href = canvas.toDataURL("image/jpeg", 0.92);
            link.click();
        } catch (error) {
            console.error("Failed to generate receipt:", error);
            alert("Failed to download receipt. Please try again.");
        }
    };

    // Format Date and Time for the receipt
    const formatReceiptDate = (dateString) => {
        if (!dateString) return "Not specified";
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };
    
    const formatReceiptTime = (dateString) => {
        if (!dateString) return "Not specified";
        const d = new Date(dateString);
        return d.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
    };

    // Disable submit when day is full / closed / not set
    const isDayUnavailable =
        slotInfo &&
        (!slotInfo.exists || slotInfo.is_closed || slotInfo.remaining === 0);

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-orange-500/30">
            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-clinic-navy text-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <Link href="/" className="flex items-center">
                        <div className="flex items-center gap-3">
                            <span className="leading-tight">
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-300">Dental</span>
                                <span className="block text-[20px] font-semibold tracking-tight">
                                    Horiz<span className="text-orange-500">o</span>ne
                                </span>
                            </span>
                        </div>
                    </Link>
                    
                    <div className="hidden items-center gap-8 text-[14px] font-medium md:flex">
                        <button onClick={() => scrollTo("services")} className="hover:text-orange-400 transition-colors">Services</button>
                        <button onClick={() => scrollTo("why-us")} className="hover:text-orange-400 transition-colors">Why us</button>
                        <button onClick={() => scrollTo("contact")} className="hover:text-orange-400 transition-colors">Contact</button>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-clinic-navy transition hover:bg-slate-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => scrollTo("contact")}
                                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-clinic-navy transition hover:bg-slate-100"
                            >
                                Book a visit <ArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── MAIN CONTENT ─────────── */}
            <div className="flex-1 pt-[72px]">
                
                {/* ── INTRO SECTION ───────────────────────────────────── */}
                <section id="home" className="relative mx-auto mt-6 max-w-[1400px] px-4">
                    <div className="relative h-[600px] w-full overflow-hidden rounded-[32px] bg-clinic-navy shadow-xl flex items-center">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                            style={{ backgroundImage: "url('/images/DentalPic.jpg')" }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-clinic-navy via-clinic-navy/80 to-transparent" />

                        <div className="relative z-10 w-full max-w-3xl px-8 md:px-16">
                            <div className="max-w-2xl text-white">
                                <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-orange-400">
                                    <span className="h-[2px] w-6 bg-orange-400" />
                                    Modern care. Warmer experience.
                                </p>
                                <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight md:text-[64px]">
                                    Your best smile starts with feeling at ease.
                                </h1>
                                <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-slate-300">
                                    Thoughtful dentistry, clear guidance, and modern treatment in a space designed around your comfort.
                                </p>
                                
                                <div className="mt-10 flex flex-wrap items-center gap-6">
                                    <button
                                        onClick={() => scrollTo("contact")}
                                        className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Make an appointment <ArrowRight className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollTo("services")}
                                        className="text-[15px] font-semibold text-white underline underline-offset-8 decoration-slate-500 hover:decoration-white transition"
                                    >
                                        Explore our services
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── FLOATING STATS BAR ───────────── */}
                    <div className="absolute -bottom-16 left-1/2 w-[90%] max-w-4xl -translate-x-1/2">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                            <div className="px-10 py-8">
                                <p className="text-4xl font-bold text-clinic-navy">12+</p>
                                <p className="text-[13px] font-medium text-slate-500 mt-2">Years of trusted care</p>
                            </div>
                            <div className="flex items-center gap-4 bg-[#f8fafc] px-10 py-8">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-100 text-emerald-600">
                                    <Check className="h-5 w-5" />
                                </span>
                                <p className="text-[14px] font-semibold text-slate-700 leading-snug">Personalized treatment,<br />never rushed.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── WHY US SECTION ─────────────────────────────────────── */}
                <section id="why-us" className="mx-auto max-w-7xl px-6 pt-40 pb-24">
                    <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
                        <div>
                            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-orange-500">
                                <span className="h-[2px] w-6 bg-orange-500" />
                                Why Dental Horizonte
                            </p>
                            <h2 className="text-4xl font-semibold leading-tight text-clinic-navy md:text-5xl">
                                Care that feels refreshingly human.
                            </h2>
                        </div>
                        <div className="md:pt-10">
                            <p className="text-[16px] leading-relaxed text-slate-600 max-w-md">
                                We pair clinical expertise with honest communication, so every decision feels simple and every visit feels comfortable.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col justify-between rounded-3xl bg-clinic-navy p-8 text-white h-[300px]">
                            <span className="text-[12px] font-bold text-slate-400">01</span>
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Comfort comes first</h3>
                                <p className="text-[14px] leading-relaxed text-slate-300">
                                    A calm environment and a team that listens before we treat.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 h-[300px]">
                            <span className="text-[12px] font-bold text-slate-300">02</span>
                            <div>
                                <h3 className="text-xl font-semibold text-clinic-navy mb-3">Modern by design</h3>
                                <p className="text-[14px] leading-relaxed text-slate-500">
                                    Up-to-date technology for efficient, precise dental care.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between rounded-3xl bg-[#fdf1e1] p-8 h-[300px]">
                            <span className="text-[12px] font-bold text-orange-400">03</span>
                            <div>
                                <h3 className="text-xl font-semibold text-clinic-navy mb-3">Clear at every step</h3>
                                <p className="text-[14px] leading-relaxed text-slate-600">
                                    Transparent options and pricing with no unexpected surprises.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SERVICES SECTION ───────────────────────────────────── */}
                <section id="services" className="bg-[#f8fafc] py-24">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-orange-500">
                                    <span className="h-[2px] w-6 bg-orange-500" />
                                    Our Services
                                </p>
                                <h2 className="text-4xl font-semibold text-clinic-navy md:text-5xl">
                                    Everything your smile needs.
                                </h2>
                            </div>
                            <button onClick={() => scrollTo("contact")} className="text-[14px] font-semibold text-clinic-navy flex items-center gap-2 hover:text-orange-500 transition pb-2">
                                View all treatments <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            {services.length > 0 ? services.map((service, idx) => (
                                <div key={service.id} className="group flex items-center justify-between border-b border-slate-100 p-6 last:border-0 hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-8 w-full">
                                        <span className="text-[13px] font-bold text-orange-500 w-6">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 grid md:grid-cols-2 gap-4 items-center">
                                            <h4 className="text-[16px] font-semibold text-clinic-navy">{service.name}</h4>
                                            <p className="text-[14px] text-slate-500 md:line-clamp-1">
                                                {service.description || "Professional dental care tailored to your needs."}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => scrollTo("contact")} className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-clinic-navy group-hover:bg-clinic-navy group-hover:text-white">
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-500">No services available at the moment.</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── CONTACT / BOOKING SECTION ──────────────────────────── */}
                <section id="contact" className="bg-clinic-navy py-24 relative">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="mb-12">
                            <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-orange-400">
                                <span className="h-[2px] w-6 bg-orange-400" />
                                Ready when you are
                            </p>
                            <h2 className="text-4xl font-semibold text-white md:text-5xl leading-[1.1]">
                                Let’s make your next visit<br />something to smile about.
                            </h2>
                            <p className="mt-6 text-slate-400 max-w-lg">Share a few details and our team will get in touch to confirm your appointment.</p>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-[24px] bg-white p-8 shadow-2xl md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500 mb-2">Appointment Request</p>
                                    <h3 className="text-3xl font-semibold text-clinic-navy">Book your visit</h3>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6 relative z-10">
                                
                                {/* Row 1: Name & Age */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Full name</label>
                                        <input
                                            type="text"
                                            value={data.patient_name}
                                            onChange={(e) => setData("patient_name", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your full name"
                                            required
                                        />
                                        {errors.patient_name && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.patient_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Age</label>
                                        <input
                                            type="number"
                                            value={data.age}
                                            onChange={(e) => setData("age", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your age"
                                            min="1"
                                            required
                                        />
                                        {errors.age && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.age}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Contact & Email */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Contact number</label>
                                        <input
                                            type="tel"
                                            value={data.telephone}
                                            onChange={(e) => setData("telephone", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="+63 900 000 0000"
                                            required
                                        />
                                        {errors.telephone && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.telephone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Email address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="you@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Occupation & Address */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Occupation</label>
                                        <input
                                            type="text"
                                            value={data.occupation}
                                            onChange={(e) => setData("occupation", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your occupation"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Address</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your complete address"
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Date & Service */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Preferred appointment date and time</label>
                                        <input
                                            type="datetime-local"
                                            value={data.next_appointment}
                                            onChange={(e) => {
                                                setData("next_appointment", e.target.value);
                                                checkSlotAvailability(e.target.value);
                                            }}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            required
                                        />
                                        <p className="mt-1.5 text-[11px] text-slate-400">Choose an available date, hour, and minute.</p>

                                        {/* Availability feedback */}
                                        {checkingSlot && (
                                            <p className="mt-1.5 text-[12px] text-slate-400">Checking availability...</p>
                                        )}

                                        {!checkingSlot && slotInfo && (
                                            <div className="mt-2">
                                                {!slotInfo.exists || slotInfo.is_closed ? (
                                                    <p className="text-[13px] font-medium text-red-600">
                                                        This day is not available for booking.
                                                    </p>
                                                ) : slotInfo.remaining === 0 ? (
                                                    <p className="text-[13px] font-medium text-red-600">
                                                        Fully booked for this day.
                                                    </p>
                                                ) : (
                                                    <p className="text-[13px] font-medium text-emerald-600">
                                                        {slotInfo.remaining} slot{slotInfo.remaining !== 1 ? "s" : ""} remaining out of {slotInfo.max_slots}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {errors.next_appointment && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.next_appointment}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-[13px] font-semibold text-slate-700">Service</label>
                                        <select
                                            value={data.services[0] || ""}
                                            onChange={(e) => setData("services", [e.target.value])}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select a treatment</option>
                                            {services.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        {errors.services && (
                                            <p className="mt-1 text-[13px] text-red-600">{errors.services}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 5: Note */}
                                <div>
                                    <label className="mb-2 block text-[13px] font-semibold text-slate-700">How can we help?</label>
                                    <textarea
                                        value={data.complaint}
                                        onChange={(e) => setData("complaint", e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                                        rows={3}
                                        placeholder="Tell us about any concerns or requests (optional)"
                                    />
                                </div>

                                <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <p className="text-[12px] text-slate-500">By submitting, you agree to be contacted by our clinic team.</p>
                                    <button
                                        type="submit"
                                        disabled={processing || isDayUnavailable}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 py-3.5 text-[15px] font-bold text-white transition hover:bg-orange-600 disabled:opacity-70 shadow-lg shadow-orange-500/30"
                                    >
                                        {processing ? "Requesting..." : "Request appointment"} <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>

            {/* ── FOOTER ─────────────────────────────────────────────── */}
            <footer className="bg-[#082b46] py-12 mt-auto border-t border-white/10">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                        <div className="flex flex-col justify-center leading-none text-left">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                                Dental
                            </span>
                            <span className="text-[22px] font-semibold tracking-tight text-white">
                                Horiz<span className="text-orange-500">o</span>ne
                            </span>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <p className="text-[14px] text-slate-400">Modern dentistry. Genuine care.</p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                        <p className="text-[14px] font-medium text-slate-400">
                            Mon–Sat · 8:00 AM–6:00 PM
                        </p>
                    </div>
                </div>
            </footer>

            {/* ── RECEIPT MODAL ─────────────────────────────────────────────── */}
            {showReceipt && submittedData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-clinic-navy/80 backdrop-blur-sm p-4">
                    <div className="flex flex-col w-full max-w-2xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                        
                        {/* Modal Header (Not printed) */}
                        <div className="flex items-start justify-between bg-white px-8 pt-8 pb-4 shrink-0">
                            <div>
                                <p className="text-[12px] font-bold uppercase tracking-widest text-orange-500 mb-1">Request Received</p>
                                <h2 className="text-3xl font-semibold text-clinic-navy">Appointment Receipt</h2>
                            </div>
                            <button 
                                onClick={() => setShowReceipt(false)}
                                className="rounded-lg p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="px-8 pb-4 shrink-0">
                            <p className="text-[14px] text-slate-600">This receipt is issued once. Please download or screenshot it as proof of your appointment request.</p>
                            <div className="mt-4 h-0.5 w-full bg-orange-500"></div>
                        </div>

                        {/* Scrollable Receipt Body (This is what gets captured) */}
                        <div className="overflow-y-auto px-8 pb-8">
                            <div ref={receiptRef} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mt-2">
                                
                                {/* Receipt Header */}
                                <div className="flex justify-between items-end border-b border-slate-100 pb-4 mb-6">
                                    <h3 className="text-xl font-semibold text-clinic-navy">Appointment receipt</h3>
                                    <span className="text-[13px] font-medium text-slate-400">Ref: DH-{Date.now().toString().slice(-8)}</span>
                                </div>

                                {/* Receipt Data Grid */}
                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-[14px]">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Name</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.patient_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Age</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.age}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.telephone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Occupation</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.occupation || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.address || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</p>
                                        <p className="font-semibold text-clinic-navy">{formatReceiptDate(submittedData.next_appointment)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preferred Time</p>
                                        <p className="font-semibold text-clinic-navy">{formatReceiptTime(submittedData.next_appointment)}</p>
                                    </div>

                                    <div className="col-span-2 mt-2">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Service Requested</p>
                                        <p className="font-semibold text-clinic-navy text-[15px]">{submittedData.service_name}</p>
                                    </div>

                                    <div className="col-span-2 mt-2">
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Concern / Request</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.complaint || "None provided"}</p>
                                    </div>
                                </div>

                                {/* Receipt Footer */}
                                <div className="mt-10 border-t border-slate-100 pt-6 text-center">
                                    <p className="text-[12px] text-slate-400">
                                        Thank you for choosing Dental Horizonte.<br/>
                                        Our team will contact you to confirm your visit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="bg-slate-50 border-t border-slate-200 px-8 py-5 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={handleDownloadReceipt}
                                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                            >
                                Download as JPEG
                            </button>
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="rounded-xl bg-slate-200 px-6 py-2.5 text-[14px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    );
}