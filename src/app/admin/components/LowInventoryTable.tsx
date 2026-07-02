import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface LowInventoryTableProps {
  products: any[];
}

export default function LowInventoryTable({
  products,
}: LowInventoryTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Low Stock Alerts</h3>
            <p className="text-xs text-gray-500">
              Items requiring immediate replenishment
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
          {products.length} Items Warning
        </span>
      </div>

      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm font-medium">
            All catalog items are securely stocked!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-semibold text-xs tracking-wider uppercase border-b border-gray-100">
                <th className="p-4">Product Name</th>
                <th className="p-4">Variant/Size</th>
                <th className="p-4">Available Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.slice(0, 5).map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-900">
                    {product.name}
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {product.variants
                      ?.map((v: any) => `${v.size || "Standard"}`)
                      .join(", ")}
                  </td>
                  <td className="p-4">
                    {product.variants?.map((v: any) => (
                      <span
                        key={v.id}
                        className={`inline-block mr-2 px-2 py-0.5 rounded text-xs font-bold ${
                          v.stock <= 3
                            ? "bg-red-100 text-red-700 animate-pulse"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {v.stock} left
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Restock <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
