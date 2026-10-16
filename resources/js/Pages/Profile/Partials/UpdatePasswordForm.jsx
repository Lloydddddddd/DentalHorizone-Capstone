import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

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

export default function UpdatePasswordForm() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errs.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-5">
            <Field label="Current password" error={errors.current_password}>
                <TextInput
                    variant="clinic"
                    type="password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="New password" error={errors.password}>
                    <TextInput
                        variant="clinic"
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                </Field>

                <Field label="Confirm password" error={errors.password_confirmation}>
                    <TextInput
                        variant="clinic"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        autoComplete="new-password"
                    />
                </Field>
            </div>

            <div className="flex items-center gap-4 pt-1">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c] disabled:opacity-60"
                >
                    Update password
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