import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import DHLogo from '@/Components/DHLogo'; // import your logo component
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

            {/* Page background image */}
            <div 
                className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
                style={{ backgroundImage: "url('/images/DentalPic.jpg')" }}
            >
                {/* White overlay to soften the background */}
                <div className="absolute inset-0 bg-white bg-opacity-30"></div>

                {/* Login card with its own background image */}
                <div 
                    className="relative z-10 w-full max-w-md shadow-xl rounded-xl p-8 border-t-4 border-blue-600 overflow-hidden"
                    style={{ backgroundImage: "url('/images/DentalPic.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
                >
                    {/* Overlay inside the card */}
                    <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl"></div>

                    {/* Content above overlay */}
                    <div className="relative z-10">
                        {/* Logo instead of text heading */}
                        <div className="flex flex-col items-center">
                            <DHLogo size={90} className="mb-2" />
                            <div className="w-16 h-1 bg-orange-500 mx-auto mb-4"></div>
                        </div>

                        <p className="text-sm text-gray-700 text-center mb-6">
                            Sign in to manage patient records
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
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

                            {/* Password */}
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

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="accent-orange-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
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

                            {/* Button */}
                            <PrimaryButton
                                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-semibold py-2 rounded-md shadow-md transition-transform transform hover:scale-105"
                                disabled={processing}
                            >
                                {processing ? 'Logging in...' : 'Log in'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
