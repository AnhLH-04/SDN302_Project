import { useState } from 'react';
import { createVehicle, createBattery } from '../../services/productService';
import styles from './AddProductPage.module.css';

const AddProductPage = () => {
  const [type, setType] = useState('vehicle');
  const [form, setForm] = useState({
    name: '',
    price: '',
    brand: '',
    model: '',
    description: '',
    location: '',
    condition: '',
    images: '',
    // Vehicle fields
    year: '',
    mileage: '',
    batteryCapacity: '',
    batteryHealth: '',
    range: '',
    color: '',
    // Battery fields
    batteryType: '',
    capacity: '',
    health: '',
    cycleCount: '',
    manufactureYear: '',
    warranty: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Parse images từ string thành array
      const imageArray = form.images
        ? form.images.split(',').map((url) => url.trim()).filter((url) => url)
        : [];

      const payload = {
        title: form.name,
        brand: form.brand || 'VinFast',
        model: form.model,
        price: parseFloat(form.price),
        condition: form.condition || 'good',
        description: form.description || '',
        location: form.location || 'Hà Nội',
        images: imageArray,
      };

      if (type === 'vehicle') {
        // Dữ liệu cho xe điện
        payload.year = parseInt(form.year);
        payload.mileage = parseInt(form.mileage) || 0;
        payload.batteryCapacity = parseFloat(form.batteryCapacity) || 70;
        payload.batteryHealth = parseFloat(form.batteryHealth) || 100;
        payload.range = parseFloat(form.range) || 400;
        payload.color = form.color || 'Trắng';

        await createVehicle(payload);
      } else {
        // Dữ liệu cho pin
        payload.brand = form.brand || 'CATL';
        payload.type = form.batteryType || 'LFP';
        payload.capacity = parseFloat(form.capacity) || 60;
        payload.health = parseFloat(form.health) || 100;
        payload.cycleCount = parseInt(form.cycleCount) || 0;
        payload.manufactureYear = parseInt(form.manufactureYear) || new Date().getFullYear();
        payload.warranty = form.warranty || 'Còn 1 năm';

        await createBattery(payload);
      }

      setSuccess('✅ Đăng tin thành công!');
      setForm({
        name: '',
        price: '',
        brand: '',
        model: '',
        description: '',
        location: '',
        condition: '',
        images: '',
        year: '',
        mileage: '',
        batteryCapacity: '',
        batteryHealth: '',
        range: '',
        color: '',
        batteryType: '',
        capacity: '',
        health: '',
        cycleCount: '',
        manufactureYear: '',
        warranty: '',
      });
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.message || 'Đăng tin thất bại';
      setError('❌ ' + errorMsg);
    }

    setLoading(false);
  };

  return (
    <div className={styles['add-product-container']}>
      <h1 className={styles['add-product-title']}>Đăng tin bán xe/pin</h1>
      <p className={styles['add-product-subtitle']}>Điền thông tin chi tiết để đăng tin</p>

      <select
        className={styles['type-select']}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="vehicle">🚗 Xe điện</option>
        <option value="battery">🔋 Pin</option>
      </select>

      <form
        onSubmit={handleSubmit}
        className={styles['add-product-form']}
      >
        {/* Thông tin chung */}
        <input
          name="name"
          placeholder="Tên sản phẩm *"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="model"
          placeholder="Model (VD: Tesla Model 3, CATL 60kWh)"
          value={form.model}
          onChange={handleChange}
        />

        <input
          name="brand"
          placeholder="Hãng (VD: Tesla, VinFast, CATL)"
          value={form.brand}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Giá (VNĐ) *"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Mô tả sản phẩm"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className={styles['textarea']}
        />

        <input
          name="location"
          placeholder="Địa chỉ *"
          value={form.location}
          onChange={handleChange}
          required
        />

        {/* URL hình ảnh */}
        <div className={styles['image-input-section']}>
          <label className={styles['image-label']}>
            📸 URL hình ảnh (phân cách bằng dấu phẩy):
          </label>
          <textarea
            name="images"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            value={form.images}
            onChange={handleChange}
            rows="3"
            className={styles['textarea']}
          />
          <small className={styles['help-text']}>
            💡 Mẹo: Upload ảnh lên <a href="https://imgur.com" target="_blank" rel="noopener noreferrer">Imgur</a> hoặc <a href="https://postimages.org" target="_blank" rel="noopener noreferrer">PostImages</a> để lấy URL
          </small>
        </div>

        {/* Thông tin riêng cho xe điện */}
        {type === 'vehicle' && (
          <>
            <input
              name="year"
              placeholder="Năm sản xuất (VD: 2022) *"
              type="number"
              value={form.year}
              onChange={handleChange}
              required
            />

            <input
              name="mileage"
              placeholder="Số km đã đi (VD: 15000)"
              type="number"
              value={form.mileage}
              onChange={handleChange}
            />

            <input
              name="batteryCapacity"
              placeholder="Dung lượng pin (kWh) * (VD: 75)"
              type="number"
              step="0.1"
              value={form.batteryCapacity}
              onChange={handleChange}
              required
            />

            <input
              name="batteryHealth"
              placeholder="Tình trạng pin (%) * (VD: 95)"
              type="number"
              min="0"
              max="100"
              value={form.batteryHealth}
              onChange={handleChange}
              required
            />

            <input
              name="range"
              placeholder="Quãng đường (km) (VD: 400)"
              type="number"
              value={form.range}
              onChange={handleChange}
            />

            <input
              name="color"
              placeholder="Màu sắc (VD: Trắng, Đen)"
              value={form.color}
              onChange={handleChange}
            />

            <select name="condition" value={form.condition} onChange={handleChange} required>
              <option value="">Chọn tình trạng xe *</option>
              <option value="new">Mới (New)</option>
              <option value="like-new">Như mới (Like New)</option>
              <option value="good">Tốt (Good)</option>
              <option value="fair">Khá (Fair)</option>
            </select>
          </>
        )}

        {/* Thông tin riêng cho pin */}
        {type === 'battery' && (
          <>
            <input
              name="batteryType"
              placeholder="Loại pin (VD: LFP, NMC, NCA)"
              value={form.batteryType}
              onChange={handleChange}
            />

            <input
              name="capacity"
              placeholder="Dung lượng (kWh) * (VD: 60)"
              type="number"
              step="0.1"
              value={form.capacity}
              onChange={handleChange}
              required
            />

            <input
              name="health"
              placeholder="Độ chai pin (%) * (VD: 92)"
              type="number"
              min="0"
              max="100"
              value={form.health}
              onChange={handleChange}
              required
            />

            <input
              name="cycleCount"
              placeholder="Số chu kỳ sạc (VD: 500)"
              type="number"
              value={form.cycleCount}
              onChange={handleChange}
            />

            <input
              name="manufactureYear"
              placeholder="Năm sản xuất (VD: 2023)"
              type="number"
              value={form.manufactureYear}
              onChange={handleChange}
            />

            <input
              name="warranty"
              placeholder="Bảo hành (VD: Còn 2 năm)"
              value={form.warranty}
              onChange={handleChange}
            />

            <select name="condition" value={form.condition} onChange={handleChange} required>
              <option value="">Chọn tình trạng pin *</option>
              <option value="new">Mới (New)</option>
              <option value="like-new">Như mới (Like New)</option>
              <option value="good">Tốt (Good)</option>
              <option value="fair">Khá (Fair)</option>
            </select>
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className={styles['loading-spinner']}></span>
              Đang đăng tin...
            </>
          ) : (
            '📤 Đăng tin'
          )}
        </button>

        {error && <div className={styles['error-message']}>{error}</div>}
        {success && <div className={styles['success-message']}>{success}</div>}
      </form>
    </div>
  );
};

export default AddProductPage;
