import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
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

export default function InlineForm({
    patient = {},
    onSuccess = null,
    onCancel = null,
}) {
    const isNew = !patient || !patient.id;

    const { data, setData, post, put, processing, errors } = useForm({
        patient_name: patient?.patient_name || '',
        age: patient?.age || '',
        occupation: patient?.occupation || '',
        telephone: patient?.telephone || '',
        address: patient?.address || '',
        email: patient?.email || '',
    });

    function submit(e) {
        e.preventDefault();
        const done = (page) => {
            onSuccess ? onSuccess(page) : router.visit(route('patients.index'));
        };
        if (isNew) post(route('patients.store'), { onSuccess: done });
        else put(route('patients.update', patient.id), { onSuccess: done });
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <Field label="Name" error={errors.patient_name}>
                <TextInput
                    variant="clinic"
                    value={data.patient_name}
                    onChange={(e) => setData('patient_name', e.target.value)}
                    placeholder="Enter patient name"
                    required
                    disabled={processing}
                />
            </Field>

            <div className="grid grid-cols-2 gap-5">
                <Field label="Age" error={errors.age}>
                    <TextInput
                        variant="clinic"
                        type="number"
                        value={data.age}
                        onChange={(e) => setData('age', e.target.value)}
                        placeholder="Age"
                        disabled={processing}
                    />
                </Field>
                <Field label="Occupation" error={errors.occupation}>
                    <TextInput
                        variant="clinic"
                        value={data.occupation}
                        onChange={(e) => setData('occupation', e.target.value)}
                        placeholder="Enter occupation"
                        disabled={processing}
                    />
                </Field>
            </div>

            <Field label="Contact number" error={errors.telephone}>
                <TextInput
                    variant="clinic"
                    value={data.telephone}
                    onChange={(e) => setData('telephone', e.target.value)}
                    placeholder="+63"
                    disabled={processing}
                />
            </Field>

            <Field label="Email" error={errors.email}>
                <TextInput
                    variant="clinic"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="name@example.com"
                    disabled={processing}
                />
            </Field>

            <Field label="Address" error={errors.address}>
                <TextInput
                    variant="clinic"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Enter complete address"
                    disabled={processing}
                />
            </Field>

            <div className="flex items-center justify-end gap-3 border-t border-clinic-line pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-clinic-line bg-white px-6 py-3 text-[14px] font-semibold text-clinic-ink transition hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-2 rounded-xl bg-clinic-navy px-6 py-3 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#0f3a5c] disabled:opacity-60"
                >
                    {processing && (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                    )}
                    {processing
                        ? isNew
                            ? 'Creating...'
                            : 'Saving...'
                        : isNew
                          ? 'Create patient'
                          : 'Save changes'}
                </button>
            </div>
        </form>
    );
}