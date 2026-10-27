import { usePage } from '@inertiajs/react';
import { ChevronDown, Menu } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import initials from '@/lib/initials';

const CLINIC_HOURS = { open: 9, close: 18 };

function formatHour(hour24) {
    const suffix = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    return `${hour12}:00 ${suffix}`;
}

function clinicStatus() {
    const hour =
        Number(
            new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Manila' }).format(new Date())
        ) % 24;
    const isOpen = hour >= CLINIC_HOURS.open && hour < CLINIC_HOURS.close;

    return isOpen
        ? { isOpen, text: `Clinic is open until ${formatHour(CLINIC_HOURS.close)}` }
        : { isOpen, text: `Clinic is closed · opens ${formatHour(CLINIC_HOURS.open)}` };
}

export default function ClinicTopbar({ onOpenMenu }) {
    const user = usePage().props.auth.user;
    const status = clinicStatus();

    return (
        <header className="relative z-20 flex h-[92px] shrink-0 items-center justify-between border-b border-clinic-line bg-white px-5 lg:px-16">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onOpenMenu}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${status.isOpen ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </span>
                <div className="leading-tight">
                    <p className="text-[17px] font-semibold text-clinic-ink">Dental Horizone</p>
                    <p className="text-[14px] text-slate-500">{status.text}</p>
                </div>
            </div>

            <Dropdown>
                <Dropdown.Trigger>
                    <button type="button" className="flex items-center gap-3 rounded-xl p-1 hover:bg-slate-50">
                        <span className="hidden text-left leading-tight sm:block">
                            <span className="block text-[15px] font-semibold text-clinic-ink">{user.name}</span>
                            <span className="block text-[13px] text-slate-500">
                                {user.is_admin ? 'Clinic administrator' : 'Clinic staff'}
                            </span>
                        </span>
                        <ChevronDown className="hidden h-5 w-5 text-slate-400 sm:block" />
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>

                    {user.is_admin && <Dropdown.Link href={route('register')}>Create New Account</Dropdown.Link>}

                    <Dropdown.Link href={route('landing')}>Back to Landing</Dropdown.Link>

                    <Dropdown.Link href={route('logout')} method="post" as="button">
                        Log Out
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </header>
    );
}