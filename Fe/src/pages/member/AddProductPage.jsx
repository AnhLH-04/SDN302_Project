import { useEffect, useState } from 'react';
import { createVehicle, createBattery } from '../../services/productService';
import { fetchBrands } from '../../services/brandService';
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
    images: [],
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
  const [uploadingImages, setUploadingImages] = useState(false);
  // Load Cloudinary Upload Widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [batteryBrands, setBatteryBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  useEffect(() => {
    // Fetch brands based on current type
    setBrandsLoading(true);
    const t = type === 'vehicle' ? 'vehicle' : 'battery';
    fetchBrands(t)
      .then((res) => {
        const list = res?.data?.data?.brands || [];
        if (t === 'vehicle') {
          setVehicleBrands(list);
          if (!form.brand && list.length > 0) setForm((f) => ({ ...f, brand: list[0].name }));
        } else {
          setBatteryBrands(list);
          if (!form.brand && list.length > 0) setForm((f) => ({ ...f, brand: list[0].name }));
        }
      })
      .catch(() => {
        if (t === 'vehicle') setVehicleBrands([]);
        else setBatteryBrands([]);
      })
      .finally(() => setBrandsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Cloudinary Upload Widget
  const openUploadWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary chưa tải xong, vui lòng thử lại');
      return;
    }

    // Lấy config từ env hoặc dùng default
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dcb9ycbhl';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    setUploadingImages(true);

    window.cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 10,
        maxImageFileSize: 5000000, // 5MB
        cropping: false,
        folder: 'ev-platform/products',
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
        showSkipCropButton: false,
      },
      (error, result) => {
        setUploadingImages(false);

        if (error) {
          console.error('Upload error:', error);
          setError('Lỗi khi upload ảnh: ' + error.message);
          return;
        }

        if (result.event === 'success') {
          const newImageUrl = result.info.secure_url;
          setForm((f) => ({
            ...f,
            images: [...f.images, newImageUrl],
          }));
        }

        if (result.event === 'close') {
          console.log('Upload widget closed');
        }
      }
    );
  };

  const removeImage = (indexToRemove) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Images đã là array rồi, không cần parse
      const imageArray = form.images;
      // Parse images từ string thành array
      //       const imageArray = form.images
      //         ? form.images
      //             .split(',')
      //             .map((url) => url.trim())
      //             .filter((url) => url)
      //         : [];

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
        images: [],
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

      <form onSubmit={handleSubmit} className={styles['add-product-form']}>
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

        {type === 'vehicle' ? (
          <select name="brand" value={form.brand} onChange={handleChange} required>
            <option value="">Chọn hãng xe *</option>
            {vehicleBrands.map((b) => (
              <option key={`${b._id}-${b.name}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        ) : (
          <select name="brand" value={form.brand} onChange={handleChange} required>
            <option value="">Chọn hãng pin *</option>
            {batteryBrands.map((b) => (
              <option key={`${b._id}-${b.name}`} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        )}

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
          <label className={styles['image-label']}>📸 Hình ảnh sản phẩm:</label>

          <button
            type="button"
            onClick={openUploadWidget}
            disabled={uploadingImages || form.images.length >= 10}
            className={styles['upload-btn']}
          >
            {uploadingImages ? '⏳ Đang tải...' : '📤 Upload ảnh'}
          </button>

          {form.images.length > 0 && (
            <div className={styles['image-preview-grid']}>
              {form.images.map((url, index) => (
                <div key={index} className={styles['image-preview-item']}>
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles['remove-image-btn']}
                    title="Xóa ảnh"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <small className={styles['help-text']}>
            💡 Bạn có thể upload tối đa 10 ảnh. Định dạng: JPG, PNG, WEBP (Max 5MB/ảnh)
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
              <option value="excellent">Xuất sắc (Excellent)</option>
              <option value="good">Tốt (Good)</option>
              <option value="fair">Khá (Fair)</option>
              <option value="poor">Kém (Poor)</option>
            </select>
          </>
        )}

        <button type="submit" disabled={loading || (type === 'vehicle' && brandsLoading)}>
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
        {type === 'vehicle' && !brandsLoading && vehicleBrands.length === 0 && (
          <div className={styles['error-message']}>
            Hiện chưa có thương hiệu xe. Vui lòng liên hệ quản trị viên để thêm brand.
          </div>
        )}
        {type === 'battery' && !brandsLoading && batteryBrands.length === 0 && (
          <div className={styles['error-message']}>
            Hiện chưa có thương hiệu pin. Vui lòng liên hệ quản trị viên để thêm brand.
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProductPage;
