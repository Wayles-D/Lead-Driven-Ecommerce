"use client";

import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpDown, Mail, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HorizontalTable } from "@/components/ui/HorizontalTable";

interface UserRow {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: Date;
    totalOrders: number;
    totalSpent: number;
    isActive: boolean;
}

export function UserTable({ initialUsers }: { initialUsers: UserRow[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [sortConfig, setSortConfig] = useState<{ key: keyof UserRow; direction: "asc" | "desc" } | null>(null);

    const sortData = (key: keyof UserRow) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedUsers = [...users].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setUsers(sortedUsers);
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
            <HorizontalTable minWidth={1000}>
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
                                onClick={() => sortData("email")}
                            >
                                <div className="flex items-center gap-2">
                                    Contact
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
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-secondary/10 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{user.firstName} {user.lastName}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono">#{user.id.slice(0, 8)}</span>
                                        </div>
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
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-sm font-medium">
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
        </div>
    );
}
