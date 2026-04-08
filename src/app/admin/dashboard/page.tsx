'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Download, Eye, EyeOff, Search, X, ChevronLeft, ChevronRight, LogOut, Edit2, Settings, Star } from 'lucide-react';
import { AdminStats } from '@/components/admin-stats';
import { FeaturedProductsSelector } from '@/components/featured-products-selector';
import { LastVideoProductsAdmin } from '@/components/last-video-products-admin';
import { useAdminProducts } from '@/hooks/use-admin-products';
import { products as initialProducts, getSortedCategories, type Product } from '@/lib/products-import';

const ITEMS_PER_PAGE = 50;

type AdminTab = 'products' | 'featured' | 'last-video';

export default function AdminPanel() {
  const router = useRouter();
  const admin = useAdminProducts(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const sortedCategories = getSortedCategories();

  // Check session on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // All hooks must be called unconditionally
  const filteredProducts = useMemo(() => {
    if (!admin.isMounted) return [];
    return admin.getDisplayProducts().filter((product) => {
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.buyLink.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || product.category === filterCategory;
      const matchesGender = !filterGender || product.gender === filterGender;
      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [admin, searchQuery, filterCategory, filterGender, admin.isMounted]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [searchQuery, filterCategory, filterGender]);

  if (!admin.isMounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map((p) => p.id)));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.size} products?`)) {
      admin.bulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-display font-bold text-primary">Admin Panel</h1>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
              {activeTab === 'products' && (
                <>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                  <button
                    onClick={admin.exportAsJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition"
                  >
                    <Download size={18} />
                    Export
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-border/40">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 font-medium text-sm transition border-b-2 ${
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-3 font-medium text-sm transition border-b-2 flex items-center gap-2 ${
                activeTab === 'featured'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Star size={16} />
              Featured Products
            </button>
            <button
              onClick={() => setActiveTab('last-video')}
              className={`px-4 py-3 font-medium text-sm transition border-b-2 flex items-center gap-2 ${
                activeTab === 'last-video'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Plus size={16} />
              Products from Last Video
            </button>
          </div>
        </div>
      </header>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          {/* Search Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search by name, brand, or link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
              <select
                value={filterCategory || ''}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="px-4 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {sortedCategories.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={filterGender || ''}
                onChange={(e) => setFilterGender(e.target.value || null)}
                className="px-4 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Genders</option>
                <option value="Women">👩 Women</option>
                <option value="Men">👨 Men</option>
                <option value="Unisex">👥 Unisex</option>
              </select>
            </div>
          </div>

          {/* Add Product Form */}
          {showAddForm && (
            <AddProductForm
              onAdd={(product) => {
                admin.addProduct(product);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Bulk Edit Modal */}
          {showBulkEditModal && selectedIds.size > 0 && (
            <BulkEditModal
              selectedCount={selectedIds.size}
              categories={sortedCategories.map((c) => c.name)}
              onSave={(updates) => {
                admin.bulkUpdate(Array.from(selectedIds), updates);
                setShowBulkEditModal(false);
                setSelectedIds(new Set());
              }}
              onCancel={() => setShowBulkEditModal(false)}
            />
          )}

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Bulk Actions */}
            {selectedIds.size > 0 && (
              <div className="mb-6 p-4 bg-muted rounded">
                <p className="font-medium mb-3">
                  ✓ {selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowBulkEditModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
                  >
                    <Settings size={18} />
                    Edit All ({selectedIds.size})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:opacity-90 transition"
                  >
                    <Trash2 size={18} className="inline mr-2" />
                    Delete All ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mb-6 p-4 bg-muted rounded flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>
                <p className="text-xs text-muted-foreground">
                  Total in database: {admin.products.length} | Active: {admin.activeProducts.size}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* Products Table */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterCategory(null);
                    setFilterGender(null);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-border/40 rounded">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedIds.size === paginatedProducts.length && paginatedProducts.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Active</th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Brand</th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Price</th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Category</th>
                        <th className="px-4 py-3 text-left font-medium text-xs">Gender</th>
                        <th className="px-4 py-3 text-center font-medium text-xs">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          isSelected={selectedIds.has(product.id)}
                          isActive={admin.activeProducts.has(product.id)}
                          isEditing={editingId === product.id}
                          onToggleSelect={() => handleToggleSelect(product.id)}
                          onToggleActive={() => admin.markActive(product.id, !admin.activeProducts.has(product.id))}
                          onEdit={() => setEditingId(product.id)}
                          onSave={(updates) => {
                            admin.editProduct(product.id, updates);
                            setEditingId(null);
                          }}
                          onDelete={() => {
                            if (confirm('Delete this product?')) {
                              admin.deleteProduct(product.id);
                            }
                          }}
                          onCancel={() => setEditingId(null)}
                          categories={sortedCategories.map((c) => c.name)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded font-medium transition ${
                            currentPage === page
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* Featured Products Tab */}
      {activeTab === 'featured' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FeaturedProductsSelector />
        </main>
      )}

      {activeTab === 'last-video' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2 font-display">
              Products from Last Video
            </h2>
            <p className="text-muted-foreground">
              Manage products to display on the homepage. Changes auto-save and sync across all devices.
            </p>
          </div>
          <LastVideoProductsAdmin />
        </main>
      )}
    </div>
  );
}

function AddProductForm({
  onAdd,
  onCancel,
}: {
  onAdd: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}) {
  type FormData = Omit<Product, 'id'>;
  const initialFormData: FormData = {
    name: '',
    brand: '',
    price: 0,
    category: 'JACKETS',
    gender: 'Unisex',
    image: '',
    buyLink: 'https://litbuy.com',
    qcLink: '#',
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const sortedCategories = getSortedCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData(initialFormData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold">Add New Product</h2>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {sortedCategories.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => {
                  const val = e.target.value as 'Women' | 'Men' | 'Unisex';
                  setFormData({ ...formData, gender: val });
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Women">👩 Women</option>
                <option value="Men">👨 Men</option>
                <option value="Unisex">👥 Unisex</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Buy Link</label>
            <input
              type="url"
              value={formData.buyLink}
              onChange={(e) => setFormData({ ...formData, buyLink: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://litbuy.com/product/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">QC Link</label>
            <input
              type="url"
              value={formData.qcLink}
              onChange={(e) => setFormData({ ...formData, qcLink: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BulkEditModal({
  selectedCount,
  categories,
  onSave,
  onCancel,
}: {
  selectedCount: number;
  categories: string[];
  onSave: (updates: Partial<Product>) => void;
  onCancel: () => void;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [gender, setGender] = useState<'Women' | 'Men' | 'Unisex' | null>(null);
  const [priceMultiplier, setPriceMultiplier] = useState<number | null>(null);
  const [buyLink, setBuyLink] = useState<string>('');
  const [qcLink, setQcLink] = useState<string>('');

  const handleSave = () => {
    const updates: Partial<Product> = {};
    if (category) updates.category = category;
    if (gender) updates.gender = gender;
    if (buyLink) updates.buyLink = buyLink;
    if (qcLink) updates.qcLink = qcLink;

    if (Object.keys(updates).length === 0) {
      alert('Please select at least one field to update');
      return;
    }

    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold">Bulk Edit Products</h2>
            <p className="text-sm text-muted-foreground">Editing {selectedCount} product{selectedCount !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-muted rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={category !== null}
                onChange={(e) => setCategory(e.target.checked ? 'JACKETS' : null)}
                className="w-4 h-4 cursor-pointer"
              />
              Change Category
            </label>
            {category !== null && (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={gender !== null}
                onChange={(e) => setGender(e.target.checked ? 'Unisex' : null)}
                className="w-4 h-4 cursor-pointer"
              />
              Change Gender
            </label>
            {gender !== null && (
              <div className="flex gap-2">
                {(['Women', 'Men', 'Unisex'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 px-3 py-2 rounded font-medium transition ${
                      gender === g
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {g === 'Women' ? '👩 Women' : g === 'Men' ? '👨 Men' : '👥 Unisex'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy Link */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={buyLink !== ''}
                onChange={(e) => setBuyLink(e.target.checked ? 'https://litbuy.com' : '')}
                className="w-4 h-4 cursor-pointer"
              />
              Change Buy Link
            </label>
            {buyLink !== '' && (
              <input
                type="url"
                value={buyLink}
                onChange={(e) => setBuyLink(e.target.value)}
                placeholder="https://litbuy.com/product/..."
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            )}
          </div>

          {/* QC Link */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={qcLink !== ''}
                onChange={(e) => setQcLink(e.target.checked ? '' : '')}
                className="w-4 h-4 cursor-pointer"
              />
              Change QC Link
            </label>
            {qcLink !== '' && (
              <input
                type="url"
                value={qcLink}
                onChange={(e) => setQcLink(e.target.value)}
                placeholder="https://example.com/qc/..."
                className="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              />
            )}
          </div>

          {/* Summary */}
          <div className="p-4 bg-muted rounded">
            <p className="text-sm font-medium mb-2">Changes to apply:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              {category && <li>✓ Category → {category}</li>}
              {gender && <li>✓ Gender → {gender}</li>}
              {buyLink && <li>✓ Buy Link → Updated</li>}
              {qcLink && <li>✓ QC Link → Updated</li>}
              {!category && !gender && !buyLink && !qcLink && <li className="text-foreground">No changes selected</li>}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 transition disabled:opacity-50"
              disabled={!category && !gender && !buyLink && !qcLink}
            >
              Apply to {selectedCount} Product{selectedCount !== 1 ? 's' : ''}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded font-medium hover:bg-muted/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  product,
  isSelected,
  isActive,
  isEditing,
  onToggleSelect,
  onToggleActive,
  onEdit,
  onSave,
  onDelete,
  onCancel,
  categories,
}: {
  product: Product;
  isSelected: boolean;
  isActive: boolean;
  isEditing: boolean;
  onToggleSelect: () => void;
  onToggleActive: () => void;
  onEdit: () => void;
  onSave: (updates: Partial<Product>) => void;
  onDelete: () => void;
  onCancel: () => void;
  categories: string[];
}) {
  const [editData, setEditData] = useState(product);

  if (isEditing) {
    return (
      <tr className="border-b border-border bg-primary/5">
        <td colSpan={8} className="px-4 py-4">
          <div className="space-y-3">
            <h3 className="font-medium text-primary">Edit Product</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <label className="text-xs font-medium">Brand</label>
                <input
                  type="text"
                  value={editData.brand}
                  onChange={(e) => setEditData({ ...editData, brand: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs font-medium">Gender</label>
                <select
                  value={editData.gender}
                  onChange={(e) => {
                    const val = e.target.value as 'Women' | 'Men' | 'Unisex';
                    setEditData({ ...editData, gender: val });
                  }}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                >
                  <option value="Women">👩 Women</option>
                  <option value="Men">👨 Men</option>
                  <option value="Unisex">👥 Unisex</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Image URL</label>
                <input
                  type="url"
                  value={editData.image}
                  onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs font-medium">Buy Link (where to purchase)</label>
                <input
                  type="url"
                  value={editData.buyLink}
                  onChange={(e) => setEditData({ ...editData, buyLink: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm font-mono text-xs"
                  placeholder="https://litbuy.com/product/..."
                />
              </div>
              <div>
                <label className="text-xs font-medium">QC Link (quality check)</label>
                <input
                  type="url"
                  value={editData.qcLink}
                  onChange={(e) => setEditData({ ...editData, qcLink: e.target.value })}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onSave(editData)}
                className="flex-1 px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium hover:opacity-90"
              >
                Save Changes
              </button>
              <button
                onClick={onCancel}
                className="flex-1 px-3 py-1 bg-muted text-foreground rounded text-sm font-medium hover:bg-muted/80"
              >
                Cancel
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`border-b border-border hover:bg-muted/30 ${isSelected ? 'bg-primary/10' : ''} ${isActive ? 'bg-primary/5' : ''}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onToggleActive}
          className={`p-1 rounded transition ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          title={isActive ? 'Click to hide' : 'Click to show'}
        >
          {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </td>
      <td className="px-4 py-3 text-sm font-medium">{product.brand}</td>
      <td className="px-4 py-3 text-sm line-clamp-2">{product.name}</td>
      <td className="px-4 py-3 text-sm font-medium text-primary">${product.price.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm">{product.category}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          product.gender === 'Women' ? 'bg-pink-600/20 text-pink-700' :
          product.gender === 'Men' ? 'bg-blue-600/20 text-blue-700' :
          'bg-purple-600/20 text-purple-700'
        }`}>
          {product.gender === 'Women' ? '👩 Women' : product.gender === 'Men' ? '👨 Men' : '👥 Unisex'}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-primary/20 text-primary rounded transition"
            title="Edit product details"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-600/20 text-red-600 rounded transition"
            title="Delete product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
