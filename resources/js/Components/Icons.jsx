import {
    LayoutDashboard,
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    HandCoins,
    FileText,
    ShieldCheck,
    Settings,
    LogOut,
    LandmarkIcon,
    UserRoundCog,
    LogInIcon,
    ShieldUser,
    MapPin,
    MapPinned,
    Phone,
    Mail,
    CheckCheck,
    X,
    Eye,
    Bell,
    ArrowLeftRight,
    EyeOffIcon,
    FileUser,
    Search,
} from "lucide-react";

const icons = {
    dashboard: LayoutDashboard,
    users: Users,
    wallet: Wallet,
    credit: ArrowUpRight,
    debit: ArrowDownLeft,
    loans: HandCoins,
    reports: FileText,
    security: ShieldCheck,
    settings: Settings,
    logout: LogOut,
    bank: LandmarkIcon,
    profile: UserRoundCog,
    login: LogInIcon,
    shield: ShieldUser,
    map: MapPinned,
    phone: Phone,
    mail:Mail,
    check:CheckCheck,
    x:X,
    eye:Eye,
    bell: Bell,
    transaction: ArrowLeftRight,
    loan:HandCoins,
    eyeoff: EyeOffIcon,
    files: FileUser,
    search: Search,

};

export default function Icon({ name, className = "w-5 h-5", ...props }) {
    const LucideIcon = icons[name];

    if (!LucideIcon) return null;

    return <LucideIcon className={className} {...props} />;
}
