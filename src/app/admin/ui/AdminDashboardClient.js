"use client";

export default function AdminDashboardClient() {
  return (
    <div className="min-h-screen p-6 pt-28">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <a
            href="/api/admin/logout"
            className="px-3 py-2 text-sm rounded border hover:bg-gray-50"
          >
            Sign out
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/products" className="border rounded p-4 hover:bg-gray-50">
            <h2 className="font-medium mb-1">Products</h2>
            <p className="text-sm text-gray-600">Create, edit, and delete products.</p>
          </a>
          <a href="/admin/categories" className="border rounded p-4 hover:bg-gray-50">
            <h2 className="font-medium mb-1">Categories</h2>
            <p className="text-sm text-gray-600">Manage product categories.</p>
          </a>
        </div>
      </div>
    </div>
  );
}
