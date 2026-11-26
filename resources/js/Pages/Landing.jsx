import React, { useState, useRef } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";
import { ArrowRight, Check, X, Menu, MapPin, Phone } from "lucide-react";
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

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        setMobileMenuOpen(false);
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
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link href="/" className="flex items-center">
                        <div className="flex items-center gap-3">
                            <span className="leading-tight">
                                <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-300">Dental</span>
                                <span className="block text-[18px] sm:text-[20px] font-semibold tracking-tight">
                                    Horiz<span className="text-orange-500">o</span>ne
                                </span>
                            </span>
                        </div>
                    </Link>
                    
                    <div className="hidden items-center gap-8 text-[14px] font-medium md:flex">
                        <button onClick={() => scrollTo("services")} className="hover:text-orange-400 transition-colors">Services</button>
                        <button onClick={() => scrollTo("contact")} className="hover:text-orange-400 transition-colors">Contact</button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="rounded-full bg-white px-4 sm:px-5 py-2 text-[13px] sm:text-[14px] font-semibold text-clinic-navy transition hover:bg-slate-100"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <button
                                    onClick={() => scrollTo("contact")}
                                    className="hidden sm:flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-clinic-navy transition hover:bg-slate-100"
                                >
                                    Book a visit <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden rounded-lg p-2 text-white hover:bg-white/10"
                                    aria-label="Toggle menu"
                                >
                                    {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-clinic-navy px-4 py-3 space-y-1">
                        <button onClick={() => scrollTo("services")} className="block w-full text-left rounded-lg px-3 py-2.5 text-[14px] font-medium hover:bg-white/10">Services</button>
                        <button onClick={() => scrollTo("contact")} className="block w-full text-left rounded-lg px-3 py-2.5 text-[14px] font-medium hover:bg-white/10">Contact</button>
                        <button onClick={() => scrollTo("contact")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-clinic-navy">
                            Book a visit <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </nav>

            {/* ── MAIN CONTENT ─────────── */}
            <div className="flex-1 pt-[64px] sm:pt-[72px]">
                
                {/* ── INTRO SECTION ───────────────────────────────────── */}
                <section id="home" className="relative mx-auto mt-4 sm:mt-6 max-w-[1400px] px-3 sm:px-4">
                    <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[32px] bg-clinic-navy shadow-xl flex items-center min-h-[420px] sm:min-h-[480px] md:h-[600px]">
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                            style={{ backgroundImage: "url('/images/DentalPic.jpg')" }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-clinic-navy via-clinic-navy/80 to-transparent" />

                        <div className="relative z-10 w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14 md:px-16">
                            <div className="max-w-2xl text-white">
                                <p className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-orange-400">
                                    <span className="h-[2px] w-5 sm:w-6 bg-orange-400" />
                                    Modern care. Warmer experience.
                                </p>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.15] sm:leading-[1.1] tracking-tight">
                                    Your best smile starts with feeling at ease.
                                </h1>
                                <p className="mt-4 sm:mt-6 max-w-lg text-[14px] sm:text-[16px] leading-relaxed text-slate-300">
                                    Thoughtful dentistry, clear guidance, and modern treatment in a space designed around your comfort.
                                </p>
                                
                                <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6">
                                    <button
                                        onClick={() => scrollTo("contact")}
                                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 sm:px-7 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Make an appointment <ArrowRight className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => scrollTo("services")}
                                        className="w-full sm:w-auto text-center sm:text-left text-[14px] sm:text-[15px] font-semibold text-white underline underline-offset-8 decoration-slate-500 hover:decoration-white transition"
                                    >
                                        Explore our services
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── FLOATING STATS BAR ───────────── */}
                    <div className="relative mx-auto -mt-10 px-3 sm:px-0 md:absolute md:-bottom-16 md:left-1/2 md:mt-0 md:w-[90%] md:max-w-4xl md:-translate-x-1/2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                            <div className="px-6 sm:px-10 py-5 sm:py-8">
                                <p className="text-3xl sm:text-4xl font-bold text-clinic-navy">12+</p>
                                <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-1 sm:mt-2">Years of trusted care</p>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 bg-[#f8fafc] px-6 sm:px-10 py-5 sm:py-8 border-t sm:border-t-0 sm:border-l border-slate-100">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-100 text-emerald-600">
                                    <Check className="h-5 w-5" />
                                </span>
                                <p className="text-[13px] sm:text-[14px] font-semibold text-slate-700 leading-snug">Personalized treatment, never rushed.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SERVICES SECTION ───────────────────────────────────── */}
                <section id="services" className="bg-[#f8fafc] py-16 sm:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                            <div>
                                <p className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-orange-500">
                                    <span className="h-[2px] w-5 sm:w-6 bg-orange-500" />
                                    Our Services
                                </p>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-clinic-navy">
                                    Everything your smile needs.
                                </h2>
                            </div>
                            <button onClick={() => scrollTo("contact")} className="self-start md:self-auto text-[13px] sm:text-[14px] font-semibold text-clinic-navy flex items-center gap-2 hover:text-orange-500 transition pb-0 md:pb-2">
                                View all treatments <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            {services.length > 0 ? services.map((service, idx) => (
                                <div key={service.id} className="group flex items-start sm:items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6 last:border-0 hover:bg-slate-50 transition">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-8 w-full">
                                        <span className="text-[12px] sm:text-[13px] font-bold text-orange-500 w-5 sm:w-6 shrink-0 pt-0.5 sm:pt-0">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-1 md:gap-4 md:items-center">
                                            <h4 className="text-[15px] sm:text-[16px] font-semibold text-clinic-navy">{service.name}</h4>
                                            <p className="text-[13px] sm:text-[14px] text-slate-500 md:line-clamp-1">
                                                {service.description || "Professional dental care tailored to your needs."}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => scrollTo("contact")} className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition group-hover:border-clinic-navy group-hover:bg-clinic-navy group-hover:text-white">
                                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </button>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-500">No services available at the moment.</div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── CONTACT / BOOKING SECTION ──────────────────────────── */}
                <section id="contact" className="bg-clinic-navy py-16 sm:py-24 relative">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6">
                        <div className="mb-8 sm:mb-12">
                            <p className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-orange-400">
                                <span className="h-[2px] w-5 sm:w-6 bg-orange-400" />
                                Ready when you are
                            </p>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-[1.15] sm:leading-[1.1]">
                                Let's make your next visit<br className="hidden sm:block" /> something to smile about.
                            </h2>
                            <p className="mt-4 sm:mt-6 text-[14px] sm:text-base text-slate-400 max-w-lg">Share a few details and our team will get in touch to confirm your appointment.</p>
                        </div>

                        {/* Form Card */}
                        <div className="rounded-[20px] sm:rounded-[24px] bg-white p-5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 sm:w-2 h-full bg-orange-500"></div>

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10 gap-4 pl-1">
                                <div>
                                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-orange-500 mb-1 sm:mb-2">Appointment Request</p>
                                    <h3 className="text-2xl sm:text-3xl font-semibold text-clinic-navy">Book your visit</h3>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-4 sm:space-y-6 relative z-10">
                                
                                {/* Row 1: Name & Age */}
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Full name</label>
                                        <input
                                            type="text"
                                            value={data.patient_name}
                                            onChange={(e) => setData("patient_name", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your full name"
                                            required
                                        />
                                        {errors.patient_name && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.patient_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Age</label>
                                        <input
                                            type="number"
                                            value={data.age}
                                            onChange={(e) => setData("age", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your age"
                                            min="1"
                                            required
                                        />
                                        {errors.age && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.age}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Contact & Email */}
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Contact number</label>
                                        <input
                                            type="tel"
                                            value={data.telephone}
                                            onChange={(e) => setData("telephone", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="+63 900 000 0000"
                                            required
                                        />
                                        {errors.telephone && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.telephone}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Email address</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="you@example.com"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Occupation & Address */}
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Occupation</label>
                                        <input
                                            type="text"
                                            value={data.occupation}
                                            onChange={(e) => setData("occupation", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your occupation"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Address</label>
                                        <input
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            placeholder="Your complete address"
                                        />
                                    </div>
                                </div>

                                {/* Row 4: Date & Service */}
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Preferred appointment date and time</label>
                                        <input
                                            type="datetime-local"
                                            value={data.next_appointment}
                                            onChange={(e) => {
                                                setData("next_appointment", e.target.value);
                                                checkSlotAvailability(e.target.value);
                                            }}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                            required
                                        />
                                        <p className="mt-1.5 text-[10px] sm:text-[11px] text-slate-400">Choose an available date, hour, and minute.</p>

                                        {/* Availability feedback */}
                                        {checkingSlot && (
                                            <p className="mt-1.5 text-[11px] sm:text-[12px] text-slate-400">Checking availability...</p>
                                        )}

                                        {!checkingSlot && slotInfo && (
                                            <div className="mt-2">
                                                {!slotInfo.exists || slotInfo.is_closed ? (
                                                    <p className="text-[12px] sm:text-[13px] font-medium text-red-600">
                                                        This day is not available for booking.
                                                    </p>
                                                ) : slotInfo.remaining === 0 ? (
                                                    <p className="text-[12px] sm:text-[13px] font-medium text-red-600">
                                                        Fully booked for this day.
                                                    </p>
                                                ) : (
                                                    <p className="text-[12px] sm:text-[13px] font-medium text-emerald-600">
                                                        {slotInfo.remaining} slot{slotInfo.remaining !== 1 ? "s" : ""} remaining out of {slotInfo.max_slots}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {errors.next_appointment && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.next_appointment}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">Service</label>
                                        <select
                                            value={data.services[0] || ""}
                                            onChange={(e) => setData("services", [e.target.value])}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select a treatment</option>
                                            {services.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        {errors.services && (
                                            <p className="mt-1 text-[12px] sm:text-[13px] text-red-600">{errors.services}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 5: Note */}
                                <div>
                                    <label className="mb-1.5 sm:mb-2 block text-[12px] sm:text-[13px] font-semibold text-slate-700">How can we help?</label>
                                    <textarea
                                        value={data.complaint}
                                        onChange={(e) => setData("complaint", e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                                        rows={3}
                                        placeholder="Tell us about any concerns or requests (optional)"
                                    />
                                </div>

                                <div className="pt-2 sm:pt-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                                    <p className="text-[11px] sm:text-[12px] text-slate-500 text-center md:text-left">By submitting, you agree to be contacted by our clinic team.</p>
                                    <button
                                        type="submit"
                                        disabled={processing || isDayUnavailable}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 sm:px-8 py-3 sm:py-3.5 text-[14px] sm:text-[15px] font-bold text-white transition hover:bg-orange-600 disabled:opacity-70 shadow-lg shadow-orange-500/30"
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
            <footer className="bg-[#082b46] py-10 sm:py-12 mt-auto border-t border-white/10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                    {/* Brand */}
                    <div className="w-full md:w-1/3 flex justify-center md:justify-start">
                        <div className="flex flex-col justify-center leading-none text-center md:text-left">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                                Dental
                            </span>
                            <span className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-white">
                                Horiz<span className="text-orange-500">o</span>ne
                            </span>
                            <p className="mt-2 text-[13px] sm:text-[14px] text-slate-400">
                                Modern dentistry. Genuine care.
                            </p>
                        </div>
                    </div>

                    {/* Address & Contact */}
                    <div className="w-full md:w-1/3 flex flex-col items-center gap-2 text-center">
                        <div className="flex items-start gap-2 text-[13px] sm:text-[14px] text-slate-300">
                            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-orange-400" />
                            <span>Magsaysay St., Brgy Miputak, Dipolog City</span>
                        </div>
                        <a
                            href="tel:09551761691"
                            className="flex items-center gap-2 text-[13px] sm:text-[14px] font-medium text-slate-300 hover:text-orange-400 transition-colors"
                        >
                            <Phone className="h-4 w-4 shrink-0 text-orange-400" />
                            <span>0955 176 1691</span>
                        </a>
                    </div>

                    {/* Hours */}
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                        <p className="text-[13px] sm:text-[14px] font-medium text-slate-400 text-center md:text-right">
                            Mon–Sat · 8:00 AM–6:00 PM
                        </p>
                    </div>
                </div>
            </footer>

            {/* ── RECEIPT MODAL ─────────────────────────────────────────────── */}
            {showReceipt && submittedData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-clinic-navy/80 backdrop-blur-sm p-3 sm:p-4">
                    <div className="flex flex-col w-full max-w-2xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                        
                        {/* Modal Header (Not printed) */}
                        <div className="flex items-start justify-between bg-white px-5 sm:px-8 pt-5 sm:pt-8 pb-3 sm:pb-4 shrink-0">
                            <div>
                                <p className="text-[10px] sm:text-[12px] font-bold uppercase tracking-widest text-orange-500 mb-1">Request Received</p>
                                <h2 className="text-2xl sm:text-3xl font-semibold text-clinic-navy">Appointment Receipt</h2>
                            </div>
                            <button 
                                onClick={() => setShowReceipt(false)}
                                className="rounded-lg p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="px-5 sm:px-8 pb-3 sm:pb-4 shrink-0">
                            <p className="text-[13px] sm:text-[14px] text-slate-600">This receipt is issued once. Please download or screenshot it as proof of your appointment request.</p>
                            <div className="mt-3 sm:mt-4 h-0.5 w-full bg-orange-500"></div>
                        </div>

                        {/* Scrollable Receipt Body (This is what gets captured) */}
                        <div className="overflow-y-auto px-4 sm:px-8 pb-6 sm:pb-8">
                            <div ref={receiptRef} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-8 mt-2">
                                
                                {/* Receipt Header */}
                                <div className="flex justify-between items-end border-b border-slate-100 pb-4 mb-6 gap-3">
                                    <h3 className="text-lg sm:text-xl font-semibold text-clinic-navy">Appointment receipt</h3>
                                    <span className="text-[11px] sm:text-[13px] font-medium text-slate-400 text-right">Ref: DH-{Date.now().toString().slice(-8)}</span>
                                </div>

                                {/* Receipt Data Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 sm:gap-y-6 text-[13px] sm:text-[14px]">
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Name</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.patient_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Age</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.age}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contact</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.telephone}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
                                        <p className="font-semibold text-clinic-navy break-words">{submittedData.email}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Occupation</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.occupation || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Address</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.address || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date</p>
                                        <p className="font-semibold text-clinic-navy">{formatReceiptDate(submittedData.next_appointment)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Preferred Time</p>
                                        <p className="font-semibold text-clinic-navy">{formatReceiptTime(submittedData.next_appointment)}</p>
                                    </div>

                                    <div className="sm:col-span-2 mt-2">
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Service Requested</p>
                                        <p className="font-semibold text-clinic-navy text-[14px] sm:text-[15px]">{submittedData.service_name}</p>
                                    </div>

                                    <div className="sm:col-span-2 mt-2">
                                        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Concern / Request</p>
                                        <p className="font-semibold text-clinic-navy">{submittedData.complaint || "None provided"}</p>
                                    </div>
                                </div>

                                {/* Receipt Footer */}
                                <div className="mt-8 sm:mt-10 border-t border-slate-100 pt-5 sm:pt-6 text-center">
                                    <p className="text-[11px] sm:text-[12px] text-slate-400">
                                        Thank you for choosing Dental Horizonte.<br/>
                                        Our team will contact you to confirm your visit.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                            <button
                                onClick={handleDownloadReceipt}
                                className="w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-emerald-600 order-2 sm:order-1"
                            >
                                Download as JPEG
                            </button>
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="w-full sm:w-auto rounded-xl bg-slate-200 px-6 py-2.5 text-[14px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-300 order-1 sm:order-2"
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