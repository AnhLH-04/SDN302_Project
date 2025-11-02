import { Battery } from '../models/batteryModel.js';
import { Brand } from '../models/brandModel.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { QueryHelper } from '../utils/queryHelper.js';

/**
 * @desc    Lấy danh sách tất cả pin
 * @route   GET /api/batteries
 * @access  Public
 */
export const getBatteries = async (req, res) => {
  try {
    const queryHelper = new QueryHelper(Battery.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (req.query.search) {
      queryHelper.query = Battery.find({
        $text: { $search: req.query.search },
      });
    }

    // Chỉ hiển thị pin available và đã được duyệt cho guest/member
    if (!req.user || req.user.role !== 'admin') {
      queryHelper.query = queryHelper.query.find({ status: 'available', isVerified: true });
    }

    queryHelper.query = queryHelper.query.populate('sellerId', 'name email phone avatar');

    const batteries = await queryHelper.query;
    // Count tổng theo cùng filter của query hiện tại
    const total = await Battery.countDocuments(
      queryHelper.query.getFilter ? queryHelper.query.getFilter() : {}
    );

    return successResponse(res, 200, 'Lấy danh sách pin thành công', {
      batteries,
      total,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Lấy chi tiết 1 pin
 * @route   GET /api/batteries/:id
 * @access  Public
 */
export const getBatteryById = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id).populate(
      'sellerId',
      'name email phone avatar'
    );

    if (!battery) {
      return errorResponse(res, 404, 'Pin không tồn tại');
    }

    // Nếu tin chưa được duyệt, chỉ cho phép chủ sở hữu hoặc admin xem
    if (!battery.isVerified) {
      const user = req.user;
      const isAdmin = user && user.role === 'admin';
      const sellerId =
        battery.sellerId && battery.sellerId._id ? battery.sellerId._id : battery.sellerId;
      const isOwner = user && sellerId && sellerId.toString() === user._id.toString();
      if (!isAdmin && !isOwner) {
        return errorResponse(res, 403, 'Tin chưa được admin duyệt');
      }
    }

    return successResponse(res, 200, 'Lấy thông tin pin thành công', {
      battery,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Tạo tin đăng bán pin mới
 * @route   POST /api/batteries
 * @access  Private (Member, Admin)
 */
export const createBattery = async (req, res, next) => {
  try {
    const batteryData = {
      ...req.body,
      sellerId: req.user._id,
    };

    // Yêu cầu brand: phải được chọn và tồn tại trong Brand (type battery/both)
    if (!batteryData.brand) {
      return errorResponse(res, 400, 'Vui lòng chọn thương hiệu pin');
    }
    const brandDoc = await Brand.findOne({
      name: batteryData.brand,
      isActive: true,
      type: { $in: ['battery', 'both'] },
    });
    if (!brandDoc) {
      return errorResponse(res, 400, 'Thương hiệu pin không hợp lệ, vui lòng chọn trong danh sách');
    }

    if (!batteryData.suggestedPrice) {
      batteryData.suggestedPrice = calculateBatterySuggestedPrice(batteryData);
    }

    const battery = await Battery.create(batteryData);

    return successResponse(res, 201, 'Đăng tin bán pin thành công', {
      battery,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Cập nhật thông tin pin
 * @route   PUT /api/batteries/:id
 * @access  Private (Owner hoặc Admin)
 */
export const updateBattery = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id);

    if (!battery) {
      return errorResponse(res, 404, 'Pin không tồn tại');
    }

    if (battery.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Bạn không có quyền cập nhật pin này');
    }

    const updatedBattery = await Battery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Cập nhật thông tin pin thành công', {
      battery: updatedBattery,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Xóa pin
 * @route   DELETE /api/batteries/:id
 * @access  Private (Owner hoặc Admin)
 */
export const deleteBattery = async (req, res) => {
  try {
    const battery = await Battery.findById(req.params.id);

    if (!battery) {
      return errorResponse(res, 404, 'Pin không tồn tại');
    }

    if (battery.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Bạn không có quyền xóa pin này');
    }

    // Không cho phép xóa nếu pin đang giao dịch hoặc đã bán (áp dụng cho user; admin có thể override)
    if (req.user.role !== 'admin' && (battery.status === 'pending' || battery.status === 'sold')) {
      return errorResponse(res, 400, 'Không thể xóa tin khi đang giao dịch (pending) hoặc đã bán');
    }

    await Battery.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Xóa pin thành công');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Lấy pin của user hiện tại
 * @route   GET /api/batteries/my-batteries
 * @access  Private
 */
export const getMyBatteries = async (req, res) => {
  try {
    const batteries = await Battery.find({ sellerId: req.user._id }).sort('-createdAt');

    return successResponse(res, 200, 'Lấy danh sách pin của bạn thành công', {
      batteries,
      total: batteries.length,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Hàm tính giá gợi ý cho pin
 */
function calculateBatterySuggestedPrice(batteryData) {
  const { price, health, cycleCount, condition, manufactureYear } = batteryData;

  if (!price) return null;

  let suggestedPrice = price;

  // Giảm giá theo độ chai pin
  if (health) {
    const healthDecrease = (100 - health) * 0.015;
    suggestedPrice -= suggestedPrice * healthDecrease;
  }

  // Giảm giá theo số chu kỳ sạc
  if (cycleCount) {
    suggestedPrice -= (cycleCount / 100) * 500000; // Giảm 500k mỗi 100 chu kỳ
  }

  // Giảm giá theo năm sản xuất
  if (manufactureYear) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - manufactureYear;
    suggestedPrice -= suggestedPrice * (age * 0.08);
  }

  // Điều chỉnh theo condition
  const conditionMultiplier = {
    excellent: 1.0,
    good: 0.85,
    fair: 0.7,
    poor: 0.5,
  };
  suggestedPrice *= conditionMultiplier[condition] || 0.85;

  return Math.round(suggestedPrice);
}
