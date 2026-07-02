import { productService } from "./product.service";
import { categoryService } from "./category.service";
import { orderService } from "./order.service";
import { paymentService } from "./payment.service";
import { reviewService } from "./review.service";

export const dashboardService = {
  async getDashboardStats() {
    const [
      productsData,
      categoriesData,
      ordersData,
      paymentsData,
      reviewsData,
    ] = await Promise.all([
      productService.getProducts(),
      categoryService.getCategories(),
      orderService.getOrders(),
      paymentService.getPayments(),
      reviewService.getReviews(),
    ]);

    const lowStockProducts = productsData.products.filter((product: any) => {
      return product.variants?.some((v: any) => v.stock <= 10);
    });

    return {
      products: productsData.products.length,
      categories: categoriesData.categories.length,
      orders: ordersData.orders.length,
      payments: paymentsData.payments.length,
      reviews: reviewsData.reviews.length,
      lowStockItems: lowStockProducts, // Forwarding data block downward to render panel

      pendingPayments: paymentsData.payments.filter(
        (p: any) => p.paymentstatus === "PENDING",
      ).length,
      successPayments: paymentsData.payments.filter(
        (p: any) => p.paymentstatus === "SUCCESS",
      ).length,
      failedPayments: paymentsData.payments.filter(
        (p: any) => p.paymentstatus === "FAILED",
      ).length,

      pendingOrders: ordersData.orders.filter(
        (o: any) => o.status === "PENDING",
      ).length,
      deliveredOrders: ordersData.orders.filter(
        (o: any) => o.status === "DELIVERED",
      ).length,
      confirmedOrders: ordersData.orders.filter(
        (o: any) => o.status === "CONFIRMED",
      ).length,
      shippedOrders: ordersData.orders.filter(
        (o: any) => o.status === "SHIPPED",
      ).length,
      cancelledOrders: ordersData.orders.filter(
        (o: any) => o.status === "CANCELLED",
      ).length,

      revenue: paymentsData.payments
        .filter((p: any) => p.paymentstatus === "SUCCESS")
        .reduce((sum: number, p: any) => sum + p.amount, 0),

      trends: {
        revenue: { value: 12.4, isPositive: true },
        orders: { value: 8.2, isPositive: true },
        products: { value: 1.5, isPositive: true },
        reviews: { value: 4.3, isPositive: false },
      },
    };
  },
};
