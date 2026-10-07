const User = require('../models/User');
const { revokeAllUserTokens } = require('../utils/tokenUtils');

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (SuperAdmin only)
 * @access  SuperAdmin
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users.',
    });
  }
};

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Update user role (SuperAdmin only)
 * @access  SuperAdmin
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['SuperAdmin', 'Manager', 'Employee'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be SuperAdmin, Manager, or Employee.',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role.',
      });
    }

    user.role = role;
    await user.save();

    // Revoke all tokens to force re-login with new role
    await revokeAllUserTokens(user._id);

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}. User must re-login.`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role.',
    });
  }
};

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user (SuperAdmin only)
 * @access  SuperAdmin
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account.',
      });
    }

    // Revoke all tokens before deletion
    await revokeAllUserTokens(user._id);

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `User ${user.email} deleted successfully.`,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user.',
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};
