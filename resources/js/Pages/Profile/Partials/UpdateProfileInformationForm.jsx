import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import initials from '@/lib/initials';

function Field({ label, error, children }) {
    return (
        <div>
            <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                {label}
            </label>
            {children}
            <InputError message={error} className="mt-1.5 text-[12px]" />
        </div>
    );
}

export default function UpdateProfileInformation({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            username: user.username,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit}>
            {/* Fields */}
            <div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Display name" error={errors.name}>
                        <TextInput
                            variant="clinic"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                        />
                    </Field>

                    <Field label="Username" error={errors.username}>
                        <TextInput
                            variant="clinic"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            required
                            autoComplete="username"
                            disabled
                            className="bg-slate-100 cursor-not-allowed"
                        />
                    </Field>
                </div>

                <Field label="Email address" error={errors.email}>
                    <TextInput
                        variant="clinic"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-[13px] text-amber-800">
                        Your email address is unverified.
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="ml-1 font-semibold underline"
                        >
                            Re-send the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-semibold text-emerald-700">
                                A new verification link has been sent.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-7 flex items-center gap-4 border-t border-clinic-line pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c] disabled:opacity-60"
                >
                    Save changes
                </button>
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-[13px] text-emerald-700">Saved.</p>
                </Transition>
            </div>
        </form>
    );
}