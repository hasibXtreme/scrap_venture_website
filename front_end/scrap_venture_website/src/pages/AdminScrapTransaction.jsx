import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminScrapTransaction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [customerPhone, setCustomerPhone] = useState(searchParams.get('customer_phone') || '');
  const [collectorPhone, setCollectorPhone] = useState(searchParams.get('collector_phone') || '');

  // Multi-item scrap rows
  const [items, setItems] = useState([
    {
      id: 1,
      scrap_id: '',
      scrap_type: searchParams.get('scrap_type') || '',
      weight: searchParams.get('weight') || '',
      price: '',
    },
  ]);

  const [availableScraps, setAvailableScraps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    apiRequest('/api/admindashboard/scrap/display')
      .catch(() => apiRequest('/api/scrap-materials/display'))
      .then((data) => {
        const scraps = data?.scrap_materials || [];
        setAvailableScraps(scraps);

        // If initial item has scrap_type from URL query, find its ID and calculate initial price
        const initialType = searchParams.get('scrap_type');
        if (scraps.length > 0 && initialType) {
          const found = scraps.find((s) => s.name === initialType);
          if (found) {
            const initialWeight = searchParams.get('weight') || '';
            const p = initialWeight && found.price ? (parseFloat(initialWeight) * parseFloat(found.price)).toFixed(2) : '';
            setItems([{ id: 1, scrap_id: found.id, scrap_type: found.name, weight: initialWeight, price: p }]);
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load scrap materials:', err);
      });
  }, []);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        scrap_id: '',
        scrap_type: '',
        weight: '',
        price: '',
      },
    ]);
  };

  const handleRemoveItem = (idToRemove) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Auto-calculate price when scrap_id or weight changes
        if (field === 'scrap_id') {
          const scrapIdNum = Number(value);
          const found = availableScraps.find((s) => Number(s.id) === scrapIdNum);
          updated.scrap_id = scrapIdNum || '';
          updated.scrap_type = found?.name || '';
          if (found?.price && updated.weight && !isNaN(updated.weight)) {
            updated.price = (parseFloat(updated.weight) * parseFloat(found.price)).toFixed(2);
          }
        } else if (field === 'weight') {
          const found = availableScraps.find((s) => Number(s.id) === Number(updated.scrap_id));
          if (found?.price && value && !isNaN(value)) {
            updated.price = (parseFloat(value) * parseFloat(found.price)).toFixed(2);
          }
        }

        return updated;
      })
    );
    setError('');
  };

  // Cumulative calculations
  const totalWeight = items.reduce((acc, it) => acc + (parseFloat(it.weight) || 0), 0);
  const totalPrice = items.reduce((acc, it) => acc + (parseFloat(it.price) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerPhone.trim() || !collectorPhone.trim()) {
      setError('Customer and Collector phone numbers are required');
      return;
    }

    if (items.length === 0) {
      setError('At least one scrap item must be added to the transaction');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.scrap_id || !it.weight || !it.price) {
        setError(`Please select scrap material, measured weight, and price for item #${i + 1}`);
        return;
      }
      if (parseFloat(it.weight) <= 0) {
        setError(`Weight for item #${i + 1} must be greater than 0 kg`);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        collector_phone_number: collectorPhone.trim(),
        customer_phone_number: customerPhone.trim(),
        items: items.map((it) => ({
          scrap_id: Number(it.scrap_id),
          weight: parseFloat(it.weight),
          price: parseFloat(it.price),
        })),
      };

      await apiRequest('/api/admindashboard/scrap-transaction/post', {
        method: 'POST',
        body: payload,
      });

      // If tied to a specific doorstep order, update its status to completed
      if (orderId) {
        apiRequest(`/api/admindashboard/scrap-orders/status/${orderId}`, {
          method: 'PUT',
          body: { status: 'completed' },
        }).catch((err) => {
          console.warn('Could not update order status:', err);
        });
      }

      setSuccess(
        `✓ Transaction Logged Successfully! Recorded ${items.length} scrap stream(s) totaling ${totalWeight.toFixed(2)} kg with payout of ৳${totalPrice.toFixed(2)}.`
      );

      // Reset form
      setCustomerPhone('');
      setCollectorPhone('');
      setItems([{ id: Date.now(), scrap_id: '', scrap_type: '', weight: '', price: '' }]);
    } catch (err) {
      setError(
        err?.data?.message || err?.message || 'Failed to record scrap transaction. Check registered phone numbers.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[
        { label: 'Admin Portal', to: '/admin/dashboard' },
        { label: 'Scrap Orders', to: '/admin/scrap-orders' },
        { label: 'Record Transaction' },
      ]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Record Scrap Transaction</h1>
          <p>
            Officially submit verified scrap transaction records for collector pickups. Support multiple scrap material types in a single customer handover.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            to="/admin/scrap-types"
            className="portal-btn-sm"
            style={{ textDecoration: 'none', background: '#0f172a', color: '#fff' }}
          >
            ⚙️ Manage Scrap Rates
          </Link>
          <Link to="/admin/scrap-orders" className="portal-btn-sm" style={{ textDecoration: 'none' }}>
            ← Scrap Orders
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div className="portal-table-card" style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
              Log Doorstep Handover &amp; Customer Payout
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              {orderId ? `Fulfilling Pickup Order #${orderId}. ` : ''}
              Input the measured weights and calculated prices for every scrap type sold during this collector transaction.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '14px 18px',
                borderRadius: 10,
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Participants Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                padding: '18px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                marginBottom: 24,
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Customer Phone Number *
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 01711000001"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    background: '#fff',
                  }}
                  required
                />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Must match registered customer account
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Scrap Collector Phone Number *
                </label>
                <input
                  type="text"
                  value={collectorPhone}
                  onChange={(e) => {
                    setCollectorPhone(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 01811000001"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    background: '#fff',
                  }}
                  required
                />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Must match registered scrap collector fleet
                </span>
              </div>
            </div>

            {/* Scrap Materials Table Section */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 2px 0' }}>
                    Scrap Materials Handover Items ({items.length})
                  </h3>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                    Enter weights and prices for each individual scrap type sold in this single transaction.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Link
                    to="/admin/scrap-types"
                    style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}
                  >
                    + Add New Scrap Type
                  </Link>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="portal-btn-sm"
                    style={{
                      background: '#ecfdf5',
                      color: '#065f46',
                      borderColor: '#a7f3d0',
                      fontWeight: 700,
                      fontSize: 12,
                      padding: '6px 14px',
                    }}
                  >
                    + Add Another Scrap Type
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 10 }}>
                <table className="portal-table" style={{ margin: 0 }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>SCRAP MATERIAL CATEGORY</th>
                      <th style={{ width: 140 }}>MEASURED WEIGHT (KG)</th>
                      <th style={{ width: 120 }}>UNIT RATE</th>
                      <th style={{ width: 160 }}>PRICE PAID (BDT ৳)</th>
                      <th style={{ width: 60, textAlign: 'center' }}>REMOVE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => {
                      const selectedMaterial = availableScraps.find((s) => s.name === it.scrap_type);

                      return (
                        <tr key={it.id}>
                          <td style={{ fontWeight: 700, color: '#94a3b8' }}>{idx + 1}</td>
                          <td>
                            {availableScraps.length > 0 ? (
                              <select
                                value={it.scrap_id || ''}
                                onChange={(e) => handleItemChange(it.id, 'scrap_id', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: 6,
                                  border: '1px solid #cbd5e1',
                                  fontSize: 13,
                                  background: '#fff',
                                }}
                                required
                              >
                                <option value="">Select Scrap Material...</option>
                                {availableScraps.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.name} (৳{parseFloat(s.price).toFixed(2)}/kg)
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={it.scrap_type}
                                onChange={(e) => handleItemChange(it.id, 'scrap_type', e.target.value)}
                                placeholder="Loading scrap materials catalog..."
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: 6,
                                  border: '1px solid #cbd5e1',
                                  fontSize: 13,
                                }}
                                required
                              />
                            )}
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={it.weight}
                              onChange={(e) => handleItemChange(it.id, 'weight', e.target.value)}
                              placeholder="e.g. 15.5"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                fontSize: 13,
                              }}
                              required
                            />
                          </td>
                          <td>
                            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                              {selectedMaterial?.price
                                ? `৳${parseFloat(selectedMaterial.price).toFixed(2)}/kg`
                                : '—'}
                            </span>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={it.price}
                              onChange={(e) => handleItemChange(it.id, 'price', e.target.value)}
                              placeholder="e.g. 279.00"
                              style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: 6,
                                border: '1px solid #cbd5e1',
                                fontSize: 13,
                                fontWeight: 700,
                                color: '#16a34a',
                              }}
                              required
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              disabled={items.length <= 1}
                              onClick={() => handleRemoveItem(it.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: items.length <= 1 ? '#cbd5e1' : '#ef4444',
                                cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                                fontSize: 16,
                                padding: '4px 8px',
                              }}
                              title={items.length <= 1 ? 'Must have at least one item' : 'Delete item row'}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary Receipt Box */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#f0fdf4',
                borderRadius: 12,
                border: '1px solid #bbf7d0',
                marginBottom: 24,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                  Transaction Totals
                </div>
                <div style={{ fontSize: 13, color: '#15803d' }}>
                  {items.length} scrap category stream(s) entered
                </div>
              </div>

              <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>CUMULATIVE WEIGHT</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                    {totalWeight.toFixed(2)} kg
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#166534', fontWeight: 600 }}>TOTAL PAYOUT TO CITIZEN</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#15803d' }}>
                    ৳{totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Link
                to="/admin/scrap-orders"
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="portal-btn-sm portal-btn-sm--approve"
                style={{
                  padding: '10px 24px',
                  fontSize: 14,
                  fontWeight: 700,
                  minWidth: 240,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Recording All Items...' : '✓ Record Scrap Transaction'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
