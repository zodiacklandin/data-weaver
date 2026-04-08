'use client';

import { useState, useRef } from 'react';
import { GripVertical, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useLastVideoProducts, LastVideoProduct } from '@/hooks/use-last-video-products';

export function LastVideoProductsAdmin() {
  const {
    products,
    isLoading,
    syncError,
    addProduct,
    updateProduct,
    removeProduct,
    reorderProducts,
  } = useLastVideoProducts();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    link: '',
  });
  const [editValues, setEditValues] = useState<Partial<LastVideoProduct>>({});

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.link) {
      alert('Please fill in all fields');
      return;
    }

    addProduct({
      id: `prod_${Date.now()}`,
      ...newProduct,
    });

    setNewProduct({ name: '', price: '', image: '', link: '' });
    setIsAddingNew(false);
  };

  const handleUpdateProduct = (id: string) => {
    if (editValues.name || editValues.price || editValues.image || editValues.link) {
      updateProduct(id, editValues);
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleStartEdit = (product: LastVideoProduct) => {
    setEditingId(product.id);
    setEditValues({
      name: product.name,
      price: product.price,
      image: product.image,
      link: product.link,
    });
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = products.findIndex((p) => p.id === draggedItem);
    const targetIndex = products.findIndex((p) => p.id === targetId);

    const newOrder = [...products];
    const [draggedProduct] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedProduct);

    reorderProducts(newOrder);
    setDraggedItem(null);
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {syncError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-700 text-sm">
          {syncError}
        </div>
      )}

      {/* Add New Product Button */}
      <button
        onClick={() => setIsAddingNew(!isAddingNew)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
      >
        <Plus size={18} />
        Add New Product
      </button>

      {/* Add New Product Form */}
      {isAddingNew && (
        <div className="p-4 border border-border rounded bg-muted/50 space-y-4">
          <h3 className="font-semibold">New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Price (e.g., $29.99)"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Product Link (URL)"
              value={newProduct.link}
              onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              <Check size={18} />
              Save
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setNewProduct({ name: '', price: '', image: '', link: '' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 transition"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded">
            No products added yet. Click "Add New Product" to get started.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              draggable
              onDragStart={() => handleDragStart(product.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(product.id)}
              className={`p-4 border border-border rounded bg-muted/30 transition ${
                draggedItem === product.id ? 'opacity-50' : ''
              }`}
            >
              {editingId === product.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={editValues.name || ''}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={editValues.price || ''}
                      onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={editValues.image || ''}
                      onChange={(e) => setEditValues({ ...editValues, image: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Product Link"
                      value={editValues.link || ''}
                      onChange={(e) => setEditValues({ ...editValues, link: e.target.value })}
                      className="px-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateProduct(product.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      <Check size={18} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditValues({});
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e5e7eb" width="80" height="80"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow">
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.price}</p>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline truncate block"
                    >
                      {product.link}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleStartEdit(product)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {products.length > 0 && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
          💡 Drag products to reorder • Changes auto-save • Synced across all devices
        </div>
      )}
    </div>
  );
}
