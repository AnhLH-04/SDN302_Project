import { Brand } from '../models/brandModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

// Public: GET /api/brands?type=vehicle|battery
export const getBrands = async (req, res) => {
  try {
    const type = (req.query.type || 'vehicle').toLowerCase();
    const types = type === 'battery' ? ['battery', 'both'] : ['vehicle', 'both'];
    const brands = await Brand.find({ isActive: true, type: { $in: types } })
      .sort({ name: 1 })
      .lean();

    return successResponse(res, 200, 'Lấy danh sách thương hiệu thành công', {
      brands,
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Admin: POST /api/admin/brands
export const createBrand = async (req, res) => {
  try {
    const { name, type = 'vehicle', isActive = true } = req.body;
    if (!name) return errorResponse(res, 400, 'Tên thương hiệu là bắt buộc');
    const payload = {
      name: name.trim(),
      type: ['vehicle', 'battery', 'both'].includes(type) ? type : 'vehicle',
      isActive: !!isActive,
      createdBy: req.user?._id,
    };

    const brand = await Brand.create(payload);
    return successResponse(res, 201, 'Tạo thương hiệu thành công', { brand });
  } catch (err) {
    if (err.code === 11000) {
      return errorResponse(res, 400, 'Thương hiệu đã tồn tại cho loại này');
    }
    return errorResponse(res, 500, err.message);
  }
};

// Admin: GET /api/admin/brands - list all brands (optionally filter by type)
export const getAllBrands = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && ['vehicle', 'battery', 'both'].includes(type)) {
      filter.type = type;
    }
    const brands = await Brand.find(filter).sort({ type: 1, name: 1 }).lean();
    return successResponse(res, 200, 'Lấy danh sách thương hiệu (admin) thành công', { brands });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Admin: PATCH /api/admin/brands/:id - update name/type/isActive
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const update = {};
    if (typeof req.body.name === 'string' && req.body.name.trim())
      update.name = req.body.name.trim();
    if (['vehicle', 'battery', 'both'].includes(req.body.type)) update.type = req.body.type;
    if (typeof req.body.isActive === 'boolean') update.isActive = req.body.isActive;

    if (Object.keys(update).length === 0) {
      return errorResponse(res, 400, 'Không có dữ liệu cập nhật hợp lệ');
    }

    const brand = await Brand.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!brand) return errorResponse(res, 404, 'Thương hiệu không tồn tại');
    return successResponse(res, 200, 'Cập nhật thương hiệu thành công', { brand });
  } catch (err) {
    if (err.code === 11000) {
      return errorResponse(res, 400, 'Thương hiệu đã tồn tại cho loại này');
    }
    return errorResponse(res, 500, err.message);
  }
};
