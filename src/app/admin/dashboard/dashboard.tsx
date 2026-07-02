"use client";

import { useEffect, useState } from "react";
import StatCard from "./statCard";
import LowInventoryTable from "../components/LowInventoryTable"; // Verify import path matches your folder tree structure
import {
  Package,
  FolderTree,
  ShoppingCart,
  CreditCard,
  Star,
  IndianRupee,
  Truck,
  Clock3,
} from "lucide-react";
import { dashboardService } from "@/app/services/dashboard.service";
import { useRouter } from "next/navigation";
import OrderStatusChart from "./orderStatusCart";
import PaymentStatusChart from "./paymentStatusCard";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import { toast } from "sonner";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  useEffect(() => {
    if (isAuthenticated === false) {
      toast.dismiss();
      toast.error("Session missing or expired. Please log in.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
        toast.error("Error connecting to microservices gateway.");
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  if (!stats) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <h2 className="text-sm font-semibold text-gray-500">
            Loading metrics...
          </h2>
        </div>
      </div>
    );
  }

  const orderStatusData = [
    { name: "Pending", value: stats.pendingOrders },
    { name: "Confirmed", value: stats.confirmedOrders },
    { name: "Delivered", value: stats.deliveredOrders },
    { name: "Cancelled", value: stats.cancelledOrders },
  ];

  const paymentStatusData = [
    { name: "Pending", value: stats.pendingPayments },
    { name: "Success", value: stats.successPayments },
    { name: "Failed", value: stats.failedPayments },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Dashboard Overviews
        </h1>
        <p className="text-sm text-gray-500">
          Real-time status metrics from your active e-commerce cluster platform.
        </p>
      </div>

      {/* Dynamic Metric Grid Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          onClick={() => router.push("/admin/products")}
          title="Products"
          value={stats.products}
          icon={Package}
          trend={stats.trends?.products}
          description="Total active catalog items"
        />

        <StatCard
          onClick={() => router.push("/admin/category")}
          title="Categories"
          value={stats.categories}
          icon={FolderTree}
          description="Product navigation taxonomies"
        />

        <StatCard
          onClick={() => router.push("/admin/orders")}
          title="Orders"
          value={stats.orders}
          icon={ShoppingCart}
          trend={stats.trends?.orders}
          description="Lifetime purchase operations"
        />

        <StatCard
          onClick={() => router.push("/admin/payments")}
          title="Payments"
          value={stats.payments}
          icon={CreditCard}
          description="Aggregated transaction counts"
        />

        <StatCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          trend={stats.trends?.revenue}
          description="Settled successful payments"
        />

        <StatCard
          title="Delivered"
          value={stats.deliveredOrders}
          icon={Truck}
          description="Successfully fulfilled items"
        />

        <StatCard
          title="Pending Queue"
          value={stats.pendingOrders}
          icon={Clock3}
          description="Awaiting processing sequence"
        />

        <StatCard
          title="Reviews"
          value={stats.reviews}
          icon={Star}
          trend={stats.trends?.reviews}
          description="User feedback score signals"
        />
      </div>

      {/* Split Operational Control Panel & Charts View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side: Analytical Charts Group */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
              Order Distributions
            </h3>
            <OrderStatusChart data={orderStatusData} />
          </div>
          <div className="flex flex-col justify-between h-full">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
              Payment Status Breakdown
            </h3>
            <PaymentStatusChart data={paymentStatusData} />
          </div>
        </div>

        {/* Right Side: Pro low stock inventory monitoring panel */}
        <div className="lg:col-span-1">
          <LowInventoryTable products={stats.lowStockItems || []} />
        </div>
      </div>
    </div>
  );
}
