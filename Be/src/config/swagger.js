import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EV & Battery Trading Platform API',
            version: '1.0.0',
            description: `
        <h2>Second-hand Electric Vehicle & Battery Trading Platform</h2>
        <p>RESTful API cho nền tảng giao dịch xe điện và pin đã qua sử dụng</p>
        <h3>Tính năng chính:</h3>
        <ul>
          <li>🔐 Xác thực và phân quyền (Guest, Member, Admin)</li>
          <li>🚗 Quản lý xe điện (CRUD, tìm kiếm, lọc)</li>
          <li>🔋 Quản lý pin (CRUD, tìm kiếm, lọc)</li>
          <li>💰 Quản lý giao dịch mua bán</li>
          <li>📊 Dashboard quản trị</li>
          <li>🤖 Gợi ý giá thông minh (AI)</li>
        </ul>
        <h3>Hướng dẫn sử dụng:</h3>
        <ol>
          <li>Đăng ký/Đăng nhập để lấy JWT token</li>
          <li>Click nút "Authorize" và nhập: <code>Bearer &lt;token&gt;</code></li>
          <li>Test các API endpoints</li>
        </ol>
      `,
            contact: {
                name: 'API Support',
                email: 'support@evplatform.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server',
            },
            {
                url: 'https://api.evplatform.com',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token in format: Bearer <token>',
                },
            },
            schemas: {
                // User Schema
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        fullName: { type: 'string', example: 'Nguyễn Văn A' },
                        email: { type: 'string', example: 'nguyenvana@gmail.com' },
                        phone: { type: 'string', example: '0901234567' },
                        role: { type: 'string', enum: ['guest', 'member', 'admin'], example: 'member' },
                        avatar: { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg' },
                        address: { type: 'string', example: 'Hà Nội, Việt Nam' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                // Vehicle Schema
                Vehicle: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string', example: 'VinFast VF8 2023' },
                        brand: { type: 'string', example: 'VinFast' },
                        model: { type: 'string', example: 'VF8' },
                        year: { type: 'number', example: 2023 },
                        price: { type: 'number', example: 850000000 },
                        mileage: { type: 'number', example: 15000 },
                        batteryCapacity: { type: 'number', example: 87.7 },
                        batteryHealth: { type: 'number', example: 95 },
                        condition: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'excellent' },
                        description: { type: 'string', example: 'Xe điện VinFast VF8 như mới' },
                        images: { type: 'array', items: { type: 'string' } },
                        status: { type: 'string', enum: ['available', 'sold', 'reserved'], example: 'available' },
                        seller: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        location: { type: 'string', example: 'Hà Nội' },
                    },
                },
                // Battery Schema
                Battery: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string', example: 'Pin VinFast VF8 87.7kWh' },
                        brand: { type: 'string', example: 'VinFast' },
                        capacity: { type: 'number', example: 87.7 },
                        health: { type: 'number', example: 92 },
                        voltage: { type: 'number', example: 403 },
                        chemistry: { type: 'string', example: 'LFP' },
                        cycleCount: { type: 'number', example: 500 },
                        price: { type: 'number', example: 150000000 },
                        condition: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], example: 'good' },
                        warranty: { type: 'number', example: 12 },
                        status: { type: 'string', enum: ['available', 'sold', 'reserved'], example: 'available' },
                    },
                },
                // Transaction Schema
                Transaction: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        buyer: { type: 'string' },
                        seller: { type: 'string' },
                        itemType: { type: 'string', enum: ['vehicle', 'battery'], example: 'vehicle' },
                        itemId: { type: 'string' },
                        price: { type: 'number', example: 850000000 },
                        commission: { type: 'number', example: 42500000 },
                        status: { type: 'string', enum: ['pending', 'approved', 'completed', 'cancelled'], example: 'pending' },
                    },
                },
                // Error Response
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        errors: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: '🔐 Xác thực người dùng - Đăng ký, đăng nhập, quản lý profile'
            },
            {
                name: 'Vehicles',
                description: '🚗 Quản lý xe điện - Tìm kiếm, đăng bán, cập nhật thông tin xe'
            },
            {
                name: 'Batteries',
                description: '🔋 Quản lý pin - Tìm kiếm, đăng bán, cập nhật thông tin pin'
            },
            {
                name: 'Transactions',
                description: '💰 Quản lý giao dịch - Tạo đơn hàng, theo dõi trạng thái'
            },
            {
                name: 'Admin',
                description: '👨‍💼 Quản trị hệ thống - Dashboard, quản lý users, duyệt sản phẩm'
            },
        ],
    },
    apis: ['src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
