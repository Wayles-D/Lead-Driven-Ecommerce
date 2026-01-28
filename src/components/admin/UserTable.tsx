"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpDown, Mail, Calendar, Phone, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HorizontalTable } from "@/components/ui/HorizontalTable";

interface UserRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    createdAt: Date;
    totalOrders: number;
    totalSpent: number;
    isActive: boolean;
}

export function UserTable({ initialUsers }: { initialUsers: UserRow[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserRow; direction: "asc" | "desc" } | null>(null);

    // Filter users based on search query
    const filteredUsers = initialUsers.filter((user) => {
        const query = searchQuery.toLowerCase();
        return (
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone.toLowerCase().includes(query) ||
            user.id.toLowerCase().includes(query)
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const sortData = (key: keyof UserRow) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, email, phone or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 h-12 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
                <HorizontalTable minWidth={1100}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/20 border-b border-border">
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => sortData("firstName")}
                                >
                                    <div className="flex items-center gap-2">
                                        User
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => sortData("phone")}
                                >
                                    <div className="flex items-center gap-2">
                                        Phone
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => sortData("email")}
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => sortData("role")}
                                >
                                    <div className="flex items-center gap-2">
                                        Role
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors"
                                    onClick={() => sortData("createdAt")}
                                >
                                    <div className="flex items-center gap-2">
                                        Joined
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors text-right"
                                    onClick={() => sortData("totalOrders")}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Orders
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th 
                                    className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground cursor-pointer hover:bg-secondary/30 transition-colors text-right"
                                    onClick={() => sortData("totalSpent")}
                                >
                                    <div className="flex items-center justify-end gap-2">
                                        Spent
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {sortedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm whitespace-nowrap">{user.firstName} {user.lastName}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">#{user.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium whitespace-nowrap">
                                            <Phone size={14} className="text-primary/40" />
                                            {user.phone}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                            <Mail size={14} className="text-primary/40" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tight">
                                                {user.role}
                                            </Badge>
                                            {!user.isActive && (
                                                <Badge variant="destructive" className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-tight">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm font-medium whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary/40" />
                                            {format(user.createdAt, "MMM d, yyyy")}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="font-bold text-sm bg-secondary/30 px-3 py-1 rounded-full border border-border/50">
                                            {user.totalOrders}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className="font-bold text-base tracking-tighter text-primary">
                                            {formatCurrency(user.totalSpent)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </HorizontalTable>
                
                {sortedUsers.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <p className="text-muted-foreground font-medium">No users match your search criteria.</p>
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="text-primary font-bold hover:underline"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
