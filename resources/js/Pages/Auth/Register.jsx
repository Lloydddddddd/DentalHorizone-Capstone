import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        is_admin: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Register</h2>}>
            <Head title="Register" />

            <div className="max-w-lg mx-auto mt-10 bg-white shadow rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Create an Account
                </h1>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Fill in the details below to register
                </p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Username */}
                    <div>
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            name="username"
                            value={data.username}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                        <InputError message={errors.username} className="mt-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Account Type */}
                    <div>
                        <InputLabel htmlFor="is_admin" value="Account Type" />
                        <select
                            id="is_admin"
                            name="is_admin"
                            value={data.is_admin}
                            onChange={(e) => setData('is_admin', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select type</option>
                            <option value="0">Regular User</option>
                            <option value="1">Admin</option>
                        </select>
                        <InputError message={errors.is_admin} className="mt-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Already registered?
                        </Link>
                        <PrimaryButton disabled={processing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
