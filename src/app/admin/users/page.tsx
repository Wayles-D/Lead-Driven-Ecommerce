import { getAdminUsers } from "@/actions/analytics";
import { UserTable } from "@/components/admin/UserTable";
import { Users as UsersIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Management | Admin",
};

export default async function AdminUsersPage() {
    const users = await getAdminUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <UsersIcon className="text-primary" />
                        Users
                    </h1>
                    <p className="text-muted-foreground">Manage and monitor customer base and activity.</p>
                </div>
                <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Total Users</p>
                        <p className="text-xl font-bold">{users.length}</p>
                    </div>
                </div>
            </div>

            <UserTable initialUsers={users} />
        </div>
    );
}
