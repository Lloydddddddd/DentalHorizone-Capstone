import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    Eye,
    EyeOff,
    Loader2,
    Mail,
    ShieldCheck,
    Users,
} from 'lucide-react';

function Feature({ icon: Icon, title, text }) {
    return (
        <li className="flex items-start gap-3.5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-clinic-accent ring-1 ring-inset ring-white/10">
                <Icon className="h-5 w-5" />
            </span>
            <div>
                <p className="text-[14px] font-semibold text-white">{title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-white/50">{text}</p>
            </div>
        </li>
    );
}

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* background image */}
            <div
                className="relative flex min-h-screen items-center justify-center bg-clinic-navy bg-cover bg-center px-4 py-10 sm:px-6 lg:px-8"
                style={{ backgroundImage: "url('/images/DentalPic.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-clinic-navy/95 via-clinic-navy/80 to-clinic-navy/55" />

                <div className="relative z-10 w-full max-w-[1080px]">
                    <div className="overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_40px_100px_-30px_rgba(4,20,34,0.85)]">
                        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                            {/* Brand panel */}
                            <div className="relative flex flex-col justify-between overflow-hidden bg-clinic-navy px-7 py-9 sm:px-10 lg:px-12 lg:py-14">
                                <div
                                    className="pointer-events-none absolute inset-0 opacity-[0.35]"
                                    style={{
                                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)',
                                        backgroundSize: '22px 22px',
                                    }}
                                />
                                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clinic-accent/15 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-clinic-blue/30 blur-3xl" />

                                {/* Wordmark */}
                                <div className="relative flex flex-col items-start">
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
                                        Dental
                                    </span>
                                    <span className="mt-1 text-[28px] font-bold leading-none tracking-tight text-white">
                                        Horiz<span className="text-clinic-accent">o</span>ne
                                    </span>
                                    <span className="mt-4 h-1 w-12 rounded-full bg-clinic-accent" />
                                </div>

                                {/* Welcome copy */}
                                <div className="relative mt-10 lg:mt-0">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-clinic-accent">
                                        Clinic management
                                    </p>
                                    <h2 className="mt-3 text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white lg:text-[2.4rem]">
                                        Welcome back.
                                    </h2>
                                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
                                        Sign in to keep patients, appointments, and billing in one calm place.
                                    </p>
                                </div>

                                <ul className="relative mt-10 hidden space-y-5 lg:block">
                                    <Feature
                                        icon={Users}
                                        title="Patient records"
                                        text="Charts, notes, and history in one place."
                                    />
                                    <Feature
                                        icon={CalendarDays}
                                        title="Appointments"
                                        text="Today's schedule and requests at a glance."
                                    />
                                    <Feature
                                        icon={CreditCard}
                                        title="Billing"
                                        text="Payments and monthly revenue, tracked."
                                    />
                                </ul>

                                <div className="relative mt-10 flex items-center gap-2 text-[12px] text-white/40 lg:mt-0">
                                    <ShieldCheck className="h-4 w-4 text-white/50" />
                                    Authorized clinic staff only
                                </div>
                            </div>

                            {/* Form panel */}
                            <div className="flex flex-col justify-center bg-white px-6 py-9 sm:px-10 lg:px-14 lg:py-14">
                                <div className="mx-auto w-full max-w-[400px]">
                                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-clinic-accent">
                                        Secure sign in
                                    </p>
                                    <h1 className="mt-2.5 text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-clinic-ink">
                                        Sign in to your workspace
                                    </h1>
                                    <p className="mt-2 text-[14.5px] text-slate-500">
                                        Enter your clinic account details to continue.
                                    </p>

                                    {status && (
                                        <div
                                            role="status"
                                            className="mt-6 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{status}</span>
                                        </div>
                                    )}

                                    {(errors.email || errors.password) && (
                                        <div
                                            role="alert"
                                            className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] text-red-700"
                                        >
                                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>We couldn&rsquo;t sign you in. Please check your details and try again.</span>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="mt-7 space-y-5">
                                        {/* Email */}
                                        <div>
                                            <InputLabel
                                                htmlFor="email"
                                                value="Email address"
                                                className="text-[13px] font-semibold text-clinic-ink"
                                            />
                                            <div className="relative mt-2">
                                                <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                                                <TextInput
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    variant="clinic"
                                                    value={data.email}
                                                    className="pl-11"
                                                    placeholder="you@dentalhorizone.com"
                                                    autoComplete="username"
                                                    isFocused={true}
                                                    aria-invalid={errors.email ? 'true' : undefined}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Password"
                                                className="text-[13px] font-semibold text-clinic-ink"
                                            />
                                            <div className="relative mt-2">
                                                <TextInput
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    variant="clinic"
                                                    value={data.password}
                                                    className="pr-12"
                                                    placeholder="Enter your password"
                                                    autoComplete="current-password"
                                                    aria-invalid={errors.password ? 'true' : undefined}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-clinic-ink focus:outline-none focus:ring-2 focus:ring-clinic-blue/20"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    aria-pressed={showPassword}
                                                >
                                                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        {/* Remember + Forgot */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                            <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-slate-600">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="h-4 w-4 rounded border-clinic-line text-clinic-navy focus:ring-clinic-blue/30"
                                                />
                                                Remember me
                                            </label>

                                            {canResetPassword && (
                                                <Link
                                                    href={route('password.request')}
                                                    className="text-[13.5px] font-semibold text-clinic-blue transition hover:text-clinic-navy"
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-clinic-navy px-4 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-14px_rgba(8,43,70,0.9)] transition hover:bg-clinic-navy-soft focus:outline-none focus:ring-4 focus:ring-clinic-blue/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Signing in&hellip;
                                                </>
                                            ) : (
                                                <>
                                                    Sign in
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-7 flex items-center gap-3">
                                        <span className="h-px flex-1 bg-clinic-line" />
                                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Dental Horizone
                                        </span>
                                        <span className="h-px flex-1 bg-clinic-line" />
                                    </div>
                                    <p className="mt-4 text-center text-[12.5px] leading-relaxed text-slate-400">
                                        Trouble signing in? Contact your clinic administrator.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[12px] text-white/50">
                        &copy; {new Date().getFullYear()} Dental Horizone &middot; Clinic management system
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
