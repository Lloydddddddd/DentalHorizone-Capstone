import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function DeleteUserForm() {
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-xl bg-[#d94a4a] px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#c03f3f]"
            >
                Delete account
            </button>

            <Modal show={confirming} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="p-8">
                    <h2 className="text-[18px] font-semibold text-clinic-ink">
                        Are you sure you want to delete your account?
                    </h2>
                    <p className="mt-2 text-[14px] text-slate-500">
                        Once your account is deleted, all of its resources and data will be permanently deleted.
                        Please enter your password to confirm.
                    </p>

                    <div className="mt-6">
                        <label className="mb-2 block text-[13px] font-semibold text-clinic-ink">
                            Password
                        </label>
                        <TextInput
                            variant="clinic"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            isFocused
                            placeholder="Password"
                        />
                        <InputError message={errors.password} className="mt-1.5 text-[12px]" />
                    </div>

                    <div className="mt-7 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border border-clinic-line bg-white px-6 py-3 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#d94a4a] px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#c03f3f] disabled:opacity-60"
                        >
                            Delete account
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}