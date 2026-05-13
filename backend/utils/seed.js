const { MenuItem, User, Settings, Offer } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await MenuItem.deleteMany({});
    await User.deleteMany({});
    await Settings.deleteMany({});
    await Offer.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@deardesserts.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210'
    });

    // Create staff user
    await User.create({
      name: 'Staff Member',
      email: 'staff@deardesserts.com',
      password: 'staff123',
      role: 'staff',
      phone: '+91 98765 43211'
    });

    console.log('Created users');

    // Create menu items - Dear Desserts Official Menu
    const menuItems = [
      // ==================== WAFFLES ====================
      {
        name: 'Bubble Triple Chocolate',
        description: 'Crispy bubble waffle loaded with triple chocolate goodness',
        price: 139,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 10
      },
      {
        name: 'Fruit Loaded Waffle',
        description: 'Fresh waffle topped with seasonal fruits and cream',
        price: 149,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Triple Chocolate with Ice Cream',
        description: 'Chocolate waffle with chocolate sauce and vanilla ice cream',
        price: 149,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 12
      },
      {
        name: 'Pops Fruit Loaded',
        description: 'Waffle pops loaded with fresh fruits and toppings',
        price: 159,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'KitKat Waffle',
        description: 'Crispy waffle with KitKat pieces and chocolate drizzle',
        price: 149,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1584278860047-22db9ff82bed?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Oreo Waffle',
        description: 'Belgian waffle topped with Oreo crumbles and cream',
        price: 159,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 10
      },
      {
        name: 'Nutella Waffle',
        description: 'Warm waffle generously spread with Nutella and hazelnuts',
        price: 179,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1600353565725-8ea0345cebf0?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Biscoff Waffle',
        description: 'Crispy waffle with Lotus Biscoff spread and cookie crumbs',
        price: 199,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'DD Special Bubble Waffle',
        description: 'Our signature bubble waffle with all premium toppings',
        price: 229,
        category: 'waffles',
        image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        isSpecial: true,
        preparationTime: 15
      },

      // ==================== BROWNIES ====================
      {
        name: 'Brownie Dark Milk Waffle',
        description: 'Rich dark chocolate brownie on crispy waffle',
        price: 69,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'Brownie Strawberry Bowl',
        description: 'Warm brownie bowl topped with fresh strawberries',
        price: 139,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 8
      },
      {
        name: 'Brownie with Ice Cream',
        description: 'Warm fudgy brownie served with vanilla ice cream',
        price: 119,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 8
      },
      {
        name: 'Hazelnut Brownie',
        description: 'Chocolate brownie loaded with crunchy hazelnuts',
        price: 129,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'Biscoff Brownie',
        description: 'Brownie swirled with Lotus Biscoff and cookie pieces',
        price: 139,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'Triple Brownie',
        description: 'Triple layer chocolate brownie for ultimate indulgence',
        price: 79,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Oreo Brownie',
        description: 'Fudgy brownie with Oreo cookies baked inside',
        price: 99,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1612886623828-b5c3ed810e57?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'DD Special Death by Chocolate',
        description: 'Ultimate chocolate overload - brownie, ganache, chips & sauce',
        price: 349,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        isSpecial: true,
        preparationTime: 10
      },
      {
        name: 'Matilda Cake',
        description: 'Inspired by the movie - rich chocolate cake slice',
        price: 149,
        category: 'brownies',
        image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },

      // ==================== POPSICLES ====================
      {
        name: 'Dark Chocolate Popsicle',
        description: 'Creamy dark chocolate ice pop',
        price: 49,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Triple Chocolate Popsicle',
        description: 'Three layers of chocolate goodness on a stick',
        price: 69,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 2
      },
      {
        name: 'Mix Belgium Popsicle',
        description: 'Belgian chocolate mix popsicle',
        price: 59,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'KitKat Popsicle',
        description: 'Creamy popsicle with KitKat chunks',
        price: 79,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Oreo Popsicle',
        description: 'Cookies and cream flavored ice pop',
        price: 79,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Nutella Popsicle',
        description: 'Rich Nutella flavored frozen treat',
        price: 89,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Biscoff Popsicle',
        description: 'Lotus Biscoff spread in frozen form',
        price: 89,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Blueberry Popsicle',
        description: 'Fresh blueberry flavored ice pop',
        price: 99,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1476217592747-691d9f2c3cd4?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Strawberry Popsicle',
        description: 'Sweet strawberry frozen delight',
        price: 99,
        category: 'popsicles',
        image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&q=80',
        isAvailable: true,
        preparationTime: 2
      },

      // ==================== CROISSANTS ====================
      {
        name: 'Oreo Croissant',
        description: 'Buttery croissant filled with Oreo cream',
        price: 119,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'KitKat Croissant',
        description: 'Flaky croissant with KitKat filling',
        price: 129,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Banana Croissant',
        description: 'Fresh croissant with caramelized banana',
        price: 109,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Lotus Biscoff Croissant',
        description: 'Croissant filled with Lotus Biscoff spread',
        price: 139,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1578775887804-699de7086ff9?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 5
      },
      {
        name: 'Brownie Croissant',
        description: 'Unique brownie-filled buttery croissant',
        price: 149,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },
      {
        name: 'Magnum Pistachio Croissant',
        description: 'Premium croissant with pistachio and chocolate',
        price: 179,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1587830075992-881784b010e8?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        isSpecial: true,
        preparationTime: 5
      },
      {
        name: 'Almond Croissant',
        description: 'Classic almond-filled French croissant',
        price: 179,
        category: 'croissants',
        image: 'https://images.unsplash.com/photo-1608198093002-ad4e005f11ca?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },

      // ==================== CHEESECAKES ====================
      {
        name: 'Nutella Cheesecake',
        description: 'Creamy cheesecake swirled with rich Nutella',
        price: 149,
        category: 'cheesecakes',
        image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 5
      },
      {
        name: 'Biscoff Cheesecake',
        description: 'Smooth cheesecake with Lotus Biscoff topping',
        price: 159,
        category: 'cheesecakes',
        image: 'https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 5
      },
      {
        name: 'Blueberry Cheesecake',
        description: 'Classic cheesecake with fresh blueberry compote',
        price: 149,
        category: 'cheesecakes',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80',
        isAvailable: true,
        preparationTime: 5
      },

      // ==================== SAVORY ====================
      {
        name: 'Chicken Popcorn',
        description: 'Crispy bite-sized chicken pieces with dipping sauce',
        price: 129,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 12
      },
      {
        name: 'Chicken Wings',
        description: 'Crispy fried chicken wings with your choice of sauce',
        price: 149,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1608039829572-fa24c8b7d50c?w=500&q=80',
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: 'Lasagna Veg',
        description: 'Layered pasta with vegetables and cheese sauce',
        price: 139,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      },
      {
        name: 'Lasagna Chicken',
        description: 'Classic lasagna with chicken and bechamel sauce',
        price: 159,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 10
      },
      {
        name: 'Chicken Bun',
        description: 'Soft bun filled with seasoned chicken',
        price: 99,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1603064752734-4c48eff53d05?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'French Fries Salt',
        description: 'Classic golden crispy fries with salt',
        price: 79,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'French Fries Peri Peri',
        description: 'Crispy fries tossed in spicy peri peri seasoning',
        price: 89,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80',
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: 'Loaded Fries Chicken',
        description: 'Fries topped with chicken, cheese, and special sauce',
        price: 129,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&q=80',
        isAvailable: true,
        isBestSeller: true,
        preparationTime: 12
      },
      {
        name: 'Cheesy Fries',
        description: 'Golden fries smothered in melted cheese',
        price: 109,
        category: 'savory',
        image: 'https://images.unsplash.com/photo-1459556329701-aff1a03ccd14?w=500&q=80',
        isAvailable: true,
        preparationTime: 10
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('Created menu items');

    // Create settings
    await Settings.create({
      cafeName: 'Dear Desserts',
      tagline: 'Love at First Bite',
      phone: '+91 98765 43210',
      email: 'hello@deardesserts.com',
      address: 'Swathi Road, Bhavanipuram, Opp Sri Balaji Sweets',
      currency: '₹',
      openingHours: {
        monday: { open: '10:00', close: '22:00', isClosed: false },
        tuesday: { open: '10:00', close: '22:00', isClosed: false },
        wednesday: { open: '10:00', close: '22:00', isClosed: false },
        thursday: { open: '10:00', close: '22:00', isClosed: false },
        friday: { open: '10:00', close: '23:00', isClosed: false },
        saturday: { open: '09:00', close: '23:00', isClosed: false },
        sunday: { open: '09:00', close: '22:00', isClosed: false }
      },
      socialMedia: {
        instagram: 'https://instagram.com/deardesserts',
        facebook: 'https://facebook.com/deardesserts'
      }
    });
    console.log('Created settings');

    // Create sample offers
    const offers = [
      {
        code: 'WELCOME10',
        description: '10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 200,
        maxDiscount: 100,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        isActive: true
      },
      {
        code: 'SWEET50',
        description: 'Flat ₹50 off on orders above ₹500',
        discountType: 'flat',
        discountValue: 50,
        minOrderAmount: 500,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true
      },
      {
        code: 'DESSERT20',
        description: '20% off on all desserts (max ₹200)',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 300,
        maxDiscount: 200,
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        isActive: true,
        applicableCategories: ['waffles', 'cakes']
      }
    ];

    await Offer.insertMany(offers);
    console.log('Created offers');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Admin Login:');
    console.log('  Email: admin@deardesserts.com');
    console.log('  Password: admin123\n');
    console.log('Staff Login:');
    console.log('  Email: staff@deardesserts.com');
    console.log('  Password: staff123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase;
