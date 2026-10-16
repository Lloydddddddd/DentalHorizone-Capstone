import { router } from '@inertiajs/react';

export default function SignOutSection() {
    const submit = () => {
        router.post(route('logout'));
    };

    return (
        <div className="flex justify-end">
            <button
                type="button"
                onClick={submit}
                className="rounded-xl border border-red-200 bg-white px-6 py-3 text-[14px] font-semibold text-[#d94a4a] transition hover:bg-red-50"
            >
                Sign out
            </button>
        </div>
    );
}