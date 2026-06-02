import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Neutral background */}
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                {/* Login card with theme accents */}
                <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border-t-4 border-blue-600">
                    
                    {/* Title with separate accent line */}
                    <h1 className="text-3xl font-bold text-center text-blue-700">
                        Dental Horizone
                    </h1>
                    <div className="w-16 h-1 bg-orange-500 mx-auto mt-2 mb-4"></div>

                    <p className="text-sm text-gray-600 text-center mb-6">
                        Sign in to manage patient records
                    </p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-600 focus:ring-blue-600 rounded-md"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                    className="accent-orange-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-105"
                            disabled={processing}
                        >
                            {processing ? 'Logging in...' : 'Log in'}
                        </PrimaryButton>
                    </form>

                    
                </div>
            </div>
        </GuestLayout>
    );
}
