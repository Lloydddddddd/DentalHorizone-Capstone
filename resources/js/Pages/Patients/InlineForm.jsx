import React from 'react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { LoaderIcon } from "lucide-react";   // ← Added

export default function InlineForm({ patient = {}, onSuccess = null }) {
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
        const successHandler = (page) => {
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(page);
            } else {
                router.visit(route('patients.index'));
            }
        };

        if (isNew) {
            post(route('patients.store'), { onSuccess: successHandler });
        } else {
            put(route('patients.update', patient.id), { onSuccess: successHandler });
        }
    }

    return (
        <div className="relative">   {/* Wrapper for overlay */}
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel>Name</InputLabel>
                    <TextInput 
                        value={data.patient_name} 
                        onChange={(e) => setData('patient_name', e.target.value)} 
                        className="mt-1 w-full" 
                        required 
                        disabled={processing}
                    />
                    <InputError message={errors.patient_name} />
                </div>

                <div>
                    <InputLabel>Age</InputLabel>
                    <TextInput 
                        type="number" 
                        value={data.age} 
                        onChange={(e) => setData('age', e.target.value)} 
                        className="mt-1 w-40" 
                        disabled={processing}
                    />
                    <InputError message={errors.age} />
                </div>

                <div>
                    <InputLabel>Occupation</InputLabel>
                    <TextInput 
                        value={data.occupation} 
                        onChange={(e) => setData('occupation', e.target.value)} 
                        className="mt-1 w-full" 
                        disabled={processing}
                    />
                    <InputError message={errors.occupation} />
                </div>

                <div>
                    <InputLabel>Contact Number</InputLabel>
                    <TextInput 
                        value={data.telephone} 
                        onChange={(e) => setData('telephone', e.target.value)} 
                        className="mt-1 w-full" 
                        disabled={processing}
                    />
                    <InputError message={errors.telephone} />
                </div>

                <div>
                    <InputLabel>Email</InputLabel>
                    <TextInput 
                        type="email" 
                        value={data.email} 
                        onChange={(e) => setData('email', e.target.value)} 
                        className="mt-1 w-full" 
                        disabled={processing}
                    />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <InputLabel>Address</InputLabel>
                    <TextInput 
                        value={data.address} 
                        onChange={(e) => setData('address', e.target.value)} 
                        className="mt-1 w-full" 
                        disabled={processing}
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="mt-4">
                    <PrimaryButton 
                        type="submit"
                        disabled={processing}
                        className="relative"
                    >
                        {processing ? (
                            <>
                                <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                                {isNew ? 'Creating...' : 'Saving...'}
                            </>
                        ) : (
                            isNew ? 'Create' : 'Save'
                        )}
                    </PrimaryButton>
                </div>
            </form>

            {/* Overlay Spinner (centered over the whole form) */}
            {processing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-md z-10">
                    <div className="flex flex-col items-center gap-3">
                        <LoaderIcon className="w-10 h-10 animate-spin text-indigo-600" />
                        <p className="text-sm text-gray-600 font-medium">
                            {isNew ? 'Adding patient...' : 'Updating patient...'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}