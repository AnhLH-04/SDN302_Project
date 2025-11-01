import mongoose from 'mongoose';
import { Favorite } from '../models/favoriteModel.js';
import { Vehicle } from '../models/vehicleModel.js';
import { Battery } from '../models/batteryModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

const toModelName = (type) => {
  if (!type) return undefined;
  const t = String(type).toLowerCase();
  if (t === 'vehicle') return 'Vehicle';
  if (t === 'battery') return 'Battery';
  // Also allow passing already-capitalized names
  if (type === 'Vehicle' || type === 'Battery') return type;
  return undefined;
};

/**
 * GET /api/favorites
 * Query: itemType?=vehicle|battery
 */
export const getFavorites = async (req, res) => {
  try {
    const { itemType } = req.query;
    const filter = { userId: req.user._id };
    if (itemType) {
      const modelName = toModelName(itemType);
      if (!modelName) return errorResponse(res, 400, 'itemType không hợp lệ');
      filter.itemType = { $in: [modelName, modelName.toLowerCase()] };
    }

    const favorites = await Favorite.find(filter).sort({ createdAt: -1 });

    // Batch fetch items to avoid refPath casing issues; support legacy lowercase values
    const vehicleIds = favorites
      .filter((f) => String(f.itemType).toLowerCase() === 'vehicle')
      .map((f) => f.itemId);
    const batteryIds = favorites
      .filter((f) => String(f.itemType).toLowerCase() === 'battery')
      .map((f) => f.itemId);

    // Guard against legacy/invalid ObjectId values to prevent CastError
    const validVehicleIds = vehicleIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const validBatteryIds = batteryIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    const [vehicleDocs, batteryDocs] = await Promise.all([
      validVehicleIds.length ? Vehicle.find({ _id: { $in: validVehicleIds } }) : [],
      validBatteryIds.length ? Battery.find({ _id: { $in: validBatteryIds } }) : [],
    ]);
    const vMap = new Map(vehicleDocs.map((d) => [String(d._id), d]));
    const bMap = new Map(batteryDocs.map((d) => [String(d._id), d]));

    const data = favorites
      .map((f) => {
        const typeLower = String(f.itemType).toLowerCase();
        const id = String(f.itemId);
        const item = typeLower === 'vehicle' ? vMap.get(id) : bMap.get(id);
        if (!item) return null;
        return {
          _id: f._id,
          itemType: typeLower,
          itemId: item._id,
          item,
          createdAt: f.createdAt,
        };
      })
      .filter(Boolean);

    return successResponse(res, 200, 'Lấy danh sách yêu thích thành công', data);
  } catch (err) {
    // Optional: surface minimal detail in server logs to aid debugging
    console.error('getFavorites error:', err?.message || err);
    return errorResponse(res, 500, 'Không thể lấy danh sách yêu thích');
  }
};

/**
 * GET /api/favorites/ids?itemType=vehicle|battery
 * Trả về danh sách itemId đã favorite theo loại
 */
export const getFavoriteIds = async (req, res) => {
  try {
    const { itemType } = req.query;
    const modelName = toModelName(itemType);
    if (!modelName) {
      return errorResponse(res, 400, 'itemType không hợp lệ');
    }
    const favs = await Favorite.find({
      userId: req.user._id,
      itemType: { $in: [modelName, modelName.toLowerCase()] },
    }).select('itemId');
    const ids = favs.map((f) => f.itemId.toString());
    return successResponse(res, 200, 'OK', { itemType: String(itemType).toLowerCase(), ids });
  } catch (err) {
    return errorResponse(res, 500, 'Không thể lấy danh sách ID yêu thích');
  }
};

/**
 * POST /api/favorites
 * Body: { itemType: 'vehicle'|'battery', itemId: string }
 */
export const addFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.body || {};
    const modelName = toModelName(itemType);
    if (!modelName) return errorResponse(res, 400, 'itemType không hợp lệ');
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'itemId không hợp lệ');
    }

    // Ensure item exists
    const Model = modelName === 'Vehicle' ? Vehicle : Battery;
    const item = await Model.findById(itemId).select('_id');
    if (!item) return errorResponse(res, 404, 'Sản phẩm không tồn tại');

    const created = await Favorite.create({
      userId: req.user._id,
      itemType: modelName,
      itemId,
    });
    return successResponse(res, 201, 'Đã thêm vào yêu thích', created);
  } catch (err) {
    if (err?.code === 11000) {
      return errorResponse(res, 409, 'Bạn đã yêu thích sản phẩm này');
    }
    return errorResponse(res, 500, 'Không thể thêm vào yêu thích');
  }
};

/**
 * DELETE /api/favorites/:itemType/:itemId
 */
export const removeFavorite = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const modelName = toModelName(itemType);
    if (!modelName) return errorResponse(res, 400, 'itemType không hợp lệ');
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'itemId không hợp lệ');
    }

    const deleted = await Favorite.findOneAndDelete({
      userId: req.user._id,
      itemType: { $in: [modelName, modelName.toLowerCase()] },
      itemId,
    });
    if (!deleted) return errorResponse(res, 404, 'Mục yêu thích không tồn tại');
    return successResponse(res, 200, 'Đã xóa khỏi yêu thích');
  } catch (err) {
    return errorResponse(res, 500, 'Không thể xóa khỏi yêu thích');
  }
};
