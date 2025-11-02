import { User } from '../models/userModel.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * @desc    Đăng ký tài khoản mới
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email đã được sử dụng');
    }

    // Kiểm tra phone nếu có
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return errorResponse(res, 400, 'Số điện thoại đã được sử dụng');
      }
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role === 'admin' ? 'member' : role || 'member', // Không cho đăng ký admin
    });

    // Tạo token
    const token = generateToken(user._id);

    return successResponse(res, 201, 'Đăng ký thành công', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Đăng nhập
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user và include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra account active
    if (!user.isActive) {
      return errorResponse(res, 401, 'Tài khoản đã bị khóa');
    }

    // Kiểm tra password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return errorResponse(res, 401, 'Email hoặc mật khẩu không đúng');
    }

    // Tạo token
    const token = generateToken(user._id);

    return successResponse(res, 200, 'Đăng nhập thành công', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Lấy thông tin user hiện tại
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    return successResponse(res, 200, 'Lấy thông tin thành công', { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Cập nhật thông tin user
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateMe = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, 'User không tồn tại');
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;

    await user.save();

    return successResponse(res, 200, 'Cập nhật thông tin thành công', {
      user,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

/**
 * @desc    Đổi mật khẩu
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Kiểm tra mật khẩu hiện tại
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return errorResponse(res, 400, 'Mật khẩu hiện tại không đúng');
    }

    // Không cho phép đặt mật khẩu mới trùng mật khẩu hiện tại
    if (currentPassword === newPassword) {
      return errorResponse(res, 400, 'Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Đổi mật khẩu thành công');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
