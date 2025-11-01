import { Vehicle } from '../models/vehicleModel.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { QueryHelper } from '../utils/queryHelper.js';

/**
 * @desc    Lấy danh sách tất cả xe (có filter, sort, pagination)
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getVehicles = async (req, res) => {
  try {
    // Build query
    const queryHelper = new QueryHelper(Vehicle.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Thêm search
    if (req.query.search) {
      queryHelper.query = Vehicle.find({
        $text: { $search: req.query.search },
      });
    }

    // Chỉ hiển thị xe available và đã được duyệt (isVerified) cho guest/member
    if (!req.user || req.user.role !== 'admin') {
      queryHelper.query = queryHelper.query.find({ status: 'available', isVerified: true });
    }

    // Populate seller info
    queryHelper.query = queryHelper.query.populate('sellerId', 'name email phone avatar');

    const vehicles = await queryHelper.query;

    // Count total theo cùng filter của query hiện tại
    const total = await Vehicle.countDocuments(
      queryHelper.query.getFilter ? queryHelper.query.getFilter() : {}
    );

    return successResponse(res, 200, 'Lấy danh sách xe thành công', {
      vehicles,
      total,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Lấy chi tiết 1 xe
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      'sellerId',
      'name email phone avatar'
    );

    if (!vehicle) {
      return errorResponse(res, 404, 'Xe không tồn tại');
    }

    // Nếu tin chưa được admin duyệt, chỉ cho phép chủ sở hữu hoặc admin xem
    if (!vehicle.isVerified) {
      const user = req.user;
      const isAdmin = user && user.role === 'admin';
      const sellerId =
        vehicle.sellerId && vehicle.sellerId._id ? vehicle.sellerId._id : vehicle.sellerId;
      const isOwner = user && sellerId && sellerId.toString() === user._id.toString();
      if (!isAdmin && !isOwner) {
        return errorResponse(res, 403, 'Tin chưa được admin duyệt');
      }
    }

    // Tăng view count
    vehicle.viewCount += 1;
    await vehicle.save();

    return successResponse(res, 200, 'Lấy thông tin xe thành công', {
      vehicle,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Tạo tin đăng bán xe mới
 * @route   POST /api/vehicles
 * @access  Private (Member, Admin)
 */
export const createVehicle = async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      sellerId: req.user._id,
    };

    // AI suggest price (mô phỏng đơn giản)
    if (!vehicleData.suggestedPrice) {
      vehicleData.suggestedPrice = calculateSuggestedPrice(vehicleData);
    }

    const vehicle = await Vehicle.create(vehicleData);

    return successResponse(res, 201, 'Đăng tin bán xe thành công', {
      vehicle,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Cập nhật thông tin xe
 * @route   PUT /api/vehicles/:id
 * @access  Private (Owner hoặc Admin)
 */
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return errorResponse(res, 404, 'Xe không tồn tại');
    }

    // Kiểm tra quyền (chỉ owner hoặc admin mới được update)
    if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Bạn không có quyền cập nhật xe này');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 200, 'Cập nhật thông tin xe thành công', {
      vehicle: updatedVehicle,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Xóa xe
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Owner hoặc Admin)
 */
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return errorResponse(res, 404, 'Xe không tồn tại');
    }

    // Kiểm tra quyền
    if (vehicle.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Bạn không có quyền xóa xe này');
    }

    // Không cho phép xóa nếu xe đang giao dịch hoặc đã bán (áp dụng cho user; admin có thể override)
    if (req.user.role !== 'admin' && (vehicle.status === 'pending' || vehicle.status === 'sold')) {
      return errorResponse(res, 400, 'Không thể xóa tin khi đang giao dịch (pending) hoặc đã bán');
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    return successResponse(res, 200, 'Xóa xe thành công');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Lấy xe của user hiện tại
 * @route   GET /api/vehicles/my-vehicles
 * @access  Private
 */
export const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ sellerId: req.user._id }).sort('-createdAt');

    return successResponse(res, 200, 'Lấy danh sách xe của bạn thành công', {
      vehicles,
      total: vehicles.length,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * Hàm tính giá gợi ý (mô phỏng AI)
 */
function calculateSuggestedPrice(vehicleData) {
  const { price, year, mileage, batteryHealth, condition } = vehicleData;

  if (!price) return null;

  let suggestedPrice = price;

  // Giảm giá theo năm sản xuất (5% mỗi năm)
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  suggestedPrice -= suggestedPrice * (age * 0.05);

  // Giảm giá theo km đã đi
  if (mileage) {
    suggestedPrice -= (mileage / 10000) * 1000000; // Giảm 1tr mỗi 10k km
  }

  // Giảm giá theo tình trạng pin
  if (batteryHealth) {
    const healthDecrease = (100 - batteryHealth) * 0.01;
    suggestedPrice -= suggestedPrice * healthDecrease;
  }

  // Điều chỉnh theo condition
  const conditionMultiplier = {
    new: 1.0,
    'like-new': 0.95,
    good: 0.85,
    fair: 0.7,
  };
  suggestedPrice *= conditionMultiplier[condition] || 0.85;

  return Math.round(suggestedPrice);
}
