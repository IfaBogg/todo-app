type Props = {
    role: string;
};

export default function RoleBadge({ role }: Props) {
    const isAdmin = role?.toUpperCase() === "ADMIN";
    return (
        <span
            className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${isAdmin
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600"
                }`}
        >
            {isAdmin ? "👑 ADMIN" : "👤 USER"}
        </span>
    );
}