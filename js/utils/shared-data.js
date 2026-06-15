// Shared vendor and product data for marketplace
const VENDORS = [
  // Electronics
  {id:'TG',name:'TechGuru Lagos',cat:'Electronics',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Lagos Island','Victoria Island','Lekki Phase 1','Ajah','Ikoyi'],rating:4.7,orders:89,verified:true,source:false,operationMode:'stock',bg:'#E6F1FB',tc:'#0C447C',desc:'Brand new phones, laptops and accessories. Sealed items only, with receipts.',completion:95},
  {id:'KE',name:'Kemi Electronics',cat:'Electronics',state:'Oyo',zone:'Ibadan',neighbourhood:'Ibadan North',deliveryZones:['Ibadan North','Ibadan South','Ido'],rating:4.6,orders:64,verified:true,source:false,operationMode:'stock',bg:'#E6F1FB',tc:'#0C447C',desc:'Televisions, sound systems and home electronics. Ibadan delivery same day.',completion:94},
  {id:'EC',name:'ElectroMart Nigeria',cat:'Electronics',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland','Oshodi'],rating:4.8,orders:142,verified:true,source:false,operationMode:'stock',bg:'#E6F1FB',tc:'#0C447C',desc:'Power banks, chargers, cables and tech gadgets. All original with warranty.',completion:97},
  
  // Fashion
  {id:'CK',name:'ChiChi Konnect',cat:'Fashion',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland','Oshodi','Mushin'],rating:4.9,orders:240,verified:true,source:false,operationMode:'stock',bg:'#FBEAF0',tc:'#72243E',desc:'Premium Ankara fashion, accessories and handmade bags. All items are in stock and ready to ship.',completion:98},
  {id:'AS',name:'Ankara Sisters',cat:'Fashion',state:'Anambra',zone:'Onitsha',neighbourhood:'Onitsha North',deliveryZones:['Onitsha North','Onitsha South','Ogidi','Awka North'],rating:4.8,orders:115,verified:true,source:false,operationMode:'custom',bg:'#FBEAF0',tc:'#72243E',desc:'Ankara fabrics, ready-to-wear and custom sewing. Ships nationwide.',completion:96},
  {id:'FS',name:'Fashion Store Lekki',cat:'Fashion',state:'Lagos',zone:'Lagos Island',neighbourhood:'Lekki Phase 1',deliveryZones:['Lekki Phase 1','Ajah','Ikoyi','Victoria Island'],rating:4.7,orders:203,verified:true,source:false,operationMode:'stock',bg:'#FBEAF0',tc:'#72243E',desc:'Latest trendy outfits, casual wear and formal attire. Weekly new arrivals.',completion:95},
  
  // Phones
  {id:'OB',name:'Oba Gadgets',cat:'Phones',state:'Abuja (FCT)',zone:'Central',neighbourhood:'Wuse',deliveryZones:['Wuse','Garki','Asokoro','Maitama'],rating:4.6,orders:57,verified:true,source:false,operationMode:'stock',bg:'#FAECE7',tc:'#712B13',desc:'UK-used and brand new phones. Abuja delivery within 6 hours. All phones tested.',completion:92},
  {id:'PH',name:'PhoneHub Nigeria',cat:'Phones',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Lagos Island','Victoria Island','Lekki Phase 1','Ikoyi'],rating:4.8,orders:178,verified:true,source:false,operationMode:'stock',bg:'#FAECE7',tc:'#712B13',desc:'Official Samsung, iPhone and Tecno distributor. Genuine phones with warranty cards.',completion:99},
  {id:'MP',name:'Mobile Point Express',cat:'Phones',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Ikeja',deliveryZones:['Ikeja','Surulere','Maryland','Mushin','Oshodi'],rating:4.5,orders:92,verified:true,source:true,operationMode:'source',bg:'#FAECE7',tc:'#712B13',desc:'Phone cases, screen protectors, chargers and power banks. Same-day delivery in Lagos.',completion:94},
  
  // Food
  {id:'FP',name:'FreshPick Foods',cat:'Food',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland'],rating:4.8,orders:312,verified:true,source:true,operationMode:'source',bg:'#EAF3DE',tc:'#27500A',desc:'Farm-fresh produce sourced daily from Mile 12 market. Orders fulfilled within 24 hours.',completion:97},
  {id:'GR',name:'Grocerify Store',cat:'Food',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Victoria Island','Lekki Phase 1','Ajah','Ikoyi'],rating:4.7,orders:156,verified:true,source:false,operationMode:'stock',bg:'#EAF3DE',tc:'#27500A',desc:'Premium groceries, spices, grains and imported food items. Delivery within 2 hours.',completion:98},
  {id:'MK',name:'Mile Twelve Market Express',cat:'Food',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Mushin',deliveryZones:['Mushin','Oshodi','Ikeja','Surulere','Yaba'],rating:4.6,orders:87,verified:false,source:true,operationMode:'source',bg:'#EAF3DE',tc:'#27500A',desc:'Fresh vegetables, fruits and grains. Best wholesale prices. Bulk discounts available.',completion:92},
  
  // Beauty
  {id:'GG',name:'GlowUp Beauty',cat:'Beauty',state:'Lagos',zone:'Lagos Island',neighbourhood:'Ikoyi',deliveryZones:['Lagos Island','Victoria Island','Lekki Phase 1','Ikoyi','Ajah'],rating:4.9,orders:178,verified:true,source:false,operationMode:'stock',bg:'#FFE8F5',tc:'#7D1B3D',desc:'100% authentic skincare and makeup. No fakes, no UK-used. Direct brand imports.',completion:99},
  {id:'SK',name:'SkinCare Kingdom',cat:'Beauty',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland','Oshodi'],rating:4.7,orders:134,verified:true,source:false,operationMode:'stock',bg:'#FFE8F5',tc:'#7D1B3D',desc:'Dermatologist-approved skincare products. Acne solutions and anti-aging creams.',completion:96},
  {id:'BH',name:'Beauty Haven Lagos',cat:'Beauty',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Victoria Island','Lekki Phase 1','Ikoyi','Ajah'],rating:4.8,orders:201,verified:true,source:false,operationMode:'stock',bg:'#FFE8F5',tc:'#7D1B3D',desc:'Hair care, makeup and beauty tools. Weekly discount on selected items.',completion:97},
  
  // Health & Wellness
  {id:'HW',name:'HealthWell Pharmacy',cat:'Health & Wellness',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland','Oshodi','Mushin'],rating:4.6,orders:223,verified:true,source:false,operationMode:'stock',bg:'#E8F5E9',tc:'#1B5E20',desc:'Licensed pharmacy. All drugs have validity. Vitamins, supplements and first aid kits.',completion:98},
  {id:'VT',name:'Vital Trends Wellness',cat:'Health & Wellness',state:'Lagos',zone:'Lagos Island',neighbourhood:'Lekki Phase 1',deliveryZones:['Lekki Phase 1','Ajah','Victoria Island','Ikoyi'],rating:4.7,orders:89,verified:true,source:false,operationMode:'stock',bg:'#E8F5E9',tc:'#1B5E20',desc:'Organic supplements, vitamins and wellness products. Expert recommendations available.',completion:97},
  
  // Home
  {id:'NQ',name:'NaijaQuick Store',cat:'Home',state:'Rivers',zone:'Port Harcourt',neighbourhood:'Port Harcourt City',deliveryZones:['Port Harcourt City','Obio/Akpor','Okrika'],rating:4.5,orders:33,verified:false,source:true,operationMode:'source',bg:'#FAEEDA',tc:'#633806',desc:'Home appliances sourced from Alaba market. Prices are negotiable for bulk orders.',completion:88},
  {id:'HL',name:'HomeLife Essentials',cat:'Home',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Ikeja',deliveryZones:['Ikeja','Surulere','Maryland','Mushin','Oshodi'],rating:4.7,orders:145,verified:true,source:false,operationMode:'stock',bg:'#FAEEDA',tc:'#633806',desc:'Bedding, kitchenware, cleaning supplies and home decor items. Same-day delivery available.',completion:96},
  {id:'KC',name:'Kitchen City',cat:'Home',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Victoria Island','Lekki Phase 1','Ikoyi','Ajah'],rating:4.8,orders:112,verified:true,source:false,operationMode:'stock',bg:'#FAEEDA',tc:'#633806',desc:'Premium kitchen utensils, pots, pans and cooking tools. Lifetime warranty on select items.',completion:98},
  
  // Furniture
  {id:'FB',name:'Furniture Box Lagos',cat:'Furniture',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Mushin',deliveryZones:['Mushin','Oshodi','Ikeja','Surulere'],rating:4.6,orders:67,verified:true,source:false,operationMode:'stock',bg:'#D7CCC8',tc:'#3E2723',desc:'Modern and traditional furniture. Free delivery and installation within Lagos.',completion:94},
  {id:'FD',name:'FurniDesign Studio',cat:'Furniture',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Victoria Island','Lekki Phase 1','Ikoyi','Ajah'],rating:4.8,orders:98,verified:true,source:false,operationMode:'custom',bg:'#D7CCC8',tc:'#3E2723',desc:'Designer furniture and interior pieces. Customization available. 2-year warranty.',completion:97},
  
  // Books & Education
  {id:'BK',name:'BookHub Nigeria',cat:'Books & Education',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland'],rating:4.7,orders:156,verified:true,source:false,operationMode:'stock',bg:'#F3E5F5',tc:'#4A148C',desc:'Textbooks, storybooks and educational materials. School supplies in stock.',completion:96},
  {id:'ES',name:'EduStore Online',cat:'Books & Education',state:'Lagos',zone:'Lagos Island',neighbourhood:'Lekki Phase 1',deliveryZones:['Lekki Phase 1','Ajah','Victoria Island','Ikoyi'],rating:4.6,orders:89,verified:true,source:false,operationMode:'stock',bg:'#F3E5F5',tc:'#4A148C',desc:'WAEC, JAMB and school textbooks. Exam guides and past questions available.',completion:95},
  
  // Sports & Outdoors
  {id:'SP',name:'SportZone Nigeria',cat:'Sports & Outdoors',state:'Lagos',zone:'Lagos Island',neighbourhood:'Lekki Phase 1',deliveryZones:['Lekki Phase 1','Ajah','Victoria Island','Ikoyi','Surulere'],rating:4.7,orders:123,verified:true,source:false,operationMode:'stock',bg:'#E3F2FD',tc:'#01579B',desc:'Gym equipment, sports gear and fitness accessories. Free delivery on orders over ₦50k.',completion:97},
  {id:'AT',name:'Active Time Store',cat:'Sports & Outdoors',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Ikeja',deliveryZones:['Ikeja','Surulere','Maryland','Mushin'],rating:4.5,orders:76,verified:true,source:false,operationMode:'stock',bg:'#E3F2FD',tc:'#01579B',desc:'Bicycles, skateboard and outdoor equipment. Professional assembly service available.',completion:94},
  
  // Automotive
  {id:'AM',name:'AutoMart Nigeria',cat:'Automotive',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland','Oshodi','Mushin'],rating:4.6,orders:198,verified:true,source:false,operationMode:'stock',bg:'#EFEBE9',tc:'#3E2723',desc:'Original car parts, oils and batteries. Certified and guaranteed quality.',completion:96},
  {id:'CT',name:'CarTech Supplies',cat:'Automotive',state:'Lagos',zone:'Lagos Island',neighbourhood:'Victoria Island',deliveryZones:['Victoria Island','Lekki Phase 1','Ikoyi','Ajah'],rating:4.8,orders:145,verified:true,source:false,operationMode:'stock',bg:'#EFEBE9',tc:'#3E2723',desc:'Car accessories, tools and maintenance products. Expert advice available.',completion:98},
  
  // Crafts & Gifts
  {id:'CG',name:'Craft Gallery Lagos',cat:'Crafts & Gifts',state:'Lagos',zone:'Lagos Mainland',neighbourhood:'Yaba',deliveryZones:['Yaba','Surulere','Ikeja','Maryland'],rating:4.7,orders:112,verified:true,source:false,operationMode:'custom',bg:'#FCE4EC',tc:'#880E4F',desc:'Handmade crafts, decorative items and unique gift ideas. Perfect for all occasions.',completion:96},
  {id:'GB',name:'GiftBox Express',cat:'Crafts & Gifts',state:'Lagos',zone:'Lagos Island',neighbourhood:'Lekki Phase 1',deliveryZones:['Lekki Phase 1','Ajah','Victoria Island','Ikoyi'],rating:4.8,orders:167,verified:true,source:false,operationMode:'stock',bg:'#FCE4EC',tc:'#880E4F',desc:'Premium gift sets, greeting cards and party decorations. Same-day gift wrapping.',completion:97},
];

const PRODUCTS = [
  // Electronics
  {name:'Samsung 43" Smart TV',price:280000,cat:'Electronics',vendor:'TechGuru Lagos',state:'Lagos',img:'📺',bg:'#EBF4FF',rating:4.7,verified:true,source:false},
  {name:'JBL Speaker',price:38000,cat:'Electronics',vendor:'Kemi Electronics',state:'Oyo',img:'🔊',bg:'#EBF4FF',rating:4.6,verified:true,source:false},
  {name:'Laptop Stand Metal',price:15000,cat:'Electronics',vendor:'ElectroMart Nigeria',state:'Lagos',img:'💻',bg:'#EBF4FF',rating:4.8,verified:true,source:false},
  {name:'Power Bank 20000mAh',price:8500,cat:'Electronics',vendor:'ElectroMart Nigeria',state:'Lagos',img:'🔌',bg:'#EBF4FF',rating:4.7,verified:true,source:false},
  {name:'HDMI Cable 5M',price:3000,cat:'Electronics',vendor:'TechGuru Lagos',state:'Lagos',img:'🔗',bg:'#EBF4FF',rating:4.6,verified:true,source:false},
  {name:'USB Hub 7-Port',price:12000,cat:'Electronics',vendor:'ElectroMart Nigeria',state:'Lagos',img:'🔌',bg:'#EBF4FF',rating:4.7,verified:true,source:false},
  
  // Fashion
  {name:'Ankara Tote Bag',price:8500,cat:'Fashion',vendor:'ChiChi Konnect',state:'Lagos',img:'👜',bg:'#FFF0F5',rating:4.9,verified:true,source:false},
  {name:'Adire Maxi Dress',price:22000,cat:'Fashion',vendor:'ChiChi Konnect',state:'Lagos',img:'👗',bg:'#FFF0F5',rating:4.9,verified:true,source:false},
  {name:'Beaded Necklace',price:4200,cat:'Fashion',vendor:'Ankara Sisters',state:'Anambra',img:'📿',bg:'#FFF0F5',rating:4.8,verified:true,source:false},
  {name:'Casual Shirt Navy Blue',price:12500,cat:'Fashion',vendor:'Fashion Store Lekki',state:'Lagos',img:'👕',bg:'#FFF0F5',rating:4.7,verified:true,source:false},
  {name:'Ankara Blazer Jacket',price:28000,cat:'Fashion',vendor:'ChiChi Konnect',state:'Lagos',img:'🧥',bg:'#FFF0F5',rating:4.8,verified:true,source:false},
  {name:'Leather Crossbody Bag',price:18500,cat:'Fashion',vendor:'Fashion Store Lekki',state:'Lagos',img:'👜',bg:'#FFF0F5',rating:4.8,verified:true,source:false},
  
  // Phones
  {name:'Infinix Hot 40 Pro',price:135000,cat:'Phones',vendor:'TechGuru Lagos',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.7,verified:true,source:false},
  {name:'Tecno Camon 20',price:95000,cat:'Phones',vendor:'TechGuru Lagos',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.7,verified:true,source:false},
  {name:'iPhone 13 (UK used)',price:310000,cat:'Phones',vendor:'Oba Gadgets',state:'Abuja (FCT)',img:'📱',bg:'#FFF4EB',rating:4.6,verified:true,source:false},
  {name:'Samsung Galaxy A53',price:165000,cat:'Phones',vendor:'PhoneHub Nigeria',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.8,verified:true,source:false},
  {name:'iPhone 14 Pro Max',price:950000,cat:'Phones',vendor:'PhoneHub Nigeria',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.9,verified:true,source:false},
  {name:'Phone Case Premium',price:5500,cat:'Phones',vendor:'Mobile Point Express',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.7,verified:true,source:false},
  {name:'Screen Protector 5-pack',price:3500,cat:'Phones',vendor:'Mobile Point Express',state:'Lagos',img:'📱',bg:'#FFF4EB',rating:4.6,verified:true,source:false},
  
  // Food
  {name:'Fresh Tomatoes 5kg',price:3200,cat:'Food',vendor:'FreshPick Foods',state:'Lagos',img:'🍅',bg:'#EDFFF4',rating:4.8,verified:true,source:true},
  {name:'Yam Flour 10kg',price:7500,cat:'Food',vendor:'FreshPick Foods',state:'Lagos',img:'🌾',bg:'#EDFFF4',rating:4.8,verified:true,source:true},
  {name:'White Rice 50kg',price:28000,cat:'Food',vendor:'Grocerify Store',state:'Lagos',img:'🍚',bg:'#EDFFF4',rating:4.7,verified:true,source:false},
  {name:'Ginger Fresh 1kg',price:2500,cat:'Food',vendor:'FreshPick Foods',state:'Lagos',img:'🌶️',bg:'#EDFFF4',rating:4.8,verified:true,source:true},
  {name:'Imported Olive Oil 500ml',price:8900,cat:'Food',vendor:'Grocerify Store',state:'Lagos',img:'🫒',bg:'#EDFFF4',rating:4.8,verified:true,source:false},
  {name:'Fresh Cucumber 3pcs',price:1800,cat:'Food',vendor:'Mile Twelve Market Express',state:'Lagos',img:'🥒',bg:'#EDFFF4',rating:4.6,verified:false,source:true},
  {name:'Garlic Fresh 500g',price:1500,cat:'Food',vendor:'Mile Twelve Market Express',state:'Lagos',img:'🧄',bg:'#EDFFF4',rating:4.6,verified:false,source:true},
  
  // Beauty
  {name:'Fenty Beauty Set',price:45000,cat:'Beauty',vendor:'GlowUp Beauty',state:'Lagos',img:'💄',bg:'#FFE8F5',rating:4.9,verified:true,source:false},
  {name:'Face Moisturizer 50ml',price:15000,cat:'Beauty',vendor:'SkinCare Kingdom',state:'Lagos',img:'💆',bg:'#FFE8F5',rating:4.7,verified:true,source:false},
  {name:'Facial Cleanser Gel',price:8500,cat:'Beauty',vendor:'GlowUp Beauty',state:'Lagos',img:'🧴',bg:'#FFE8F5',rating:4.9,verified:true,source:false},
  {name:'Hair Shampoo Premium',price:12000,cat:'Beauty',vendor:'Beauty Haven Lagos',state:'Lagos',img:'🧴',bg:'#FFE8F5',rating:4.8,verified:true,source:false},
  {name:'Lipstick Matte',price:9500,cat:'Beauty',vendor:'Beauty Haven Lagos',state:'Lagos',img:'💄',bg:'#FFE8F5',rating:4.8,verified:true,source:false},
  {name:'Face Mask Sheet 10pcs',price:6000,cat:'Beauty & Personal Care',vendor:'SkinCare Kingdom',state:'Lagos',img:'😷',bg:'#FFE8F5',rating:4.7,verified:true,source:false},
  
  // Health & Wellness
  {name:'Vitamin C Tablet 30pcs',price:5500,cat:'Health & Wellness',vendor:'HealthWell Pharmacy',state:'Lagos',img:'💊',bg:'#E8F5E9',rating:4.6,verified:true,source:false},
  {name:'Multivitamin Tablet 60pcs',price:8900,cat:'Health & Wellness',vendor:'Vital Trends Wellness',state:'Lagos',img:'💊',bg:'#E8F5E9',rating:4.7,verified:true,source:false},
  {name:'Omega-3 Fish Oil 30caps',price:9500,cat:'Health & Wellness',vendor:'Vital Trends Wellness',state:'Lagos',img:'💊',bg:'#E8F5E9',rating:4.8,verified:true,source:false},
  {name:'First Aid Kit Complete',price:12500,cat:'Health & Wellness',vendor:'HealthWell Pharmacy',state:'Lagos',img:'🩹',bg:'#E8F5E9',rating:4.6,verified:true,source:false},
  {name:'Hand Sanitizer 500ml',price:2500,cat:'Health & Wellness',vendor:'HealthWell Pharmacy',state:'Lagos',img:'🧼',bg:'#E8F5E9',rating:4.7,verified:true,source:false},
  
  // Home & Living
  {name:'Rice Cooker 1.8L',price:12000,cat:'Home & Living',vendor:'NaijaQuick Store',state:'Rivers',img:'🍳',bg:'#FAEEDA',rating:4.5,verified:false,source:true},
  {name:'Bedsheet Set Cotton',price:18000,cat:'Home & Living',vendor:'HomeLife Essentials',state:'Lagos',img:'🛏️',bg:'#FAEEDA',rating:4.7,verified:true,source:false},
  {name:'Pillow Comfort Pack 2pcs',price:14000,cat:'Home & Living',vendor:'HomeLife Essentials',state:'Lagos',img:'🛏️',bg:'#FAEEDA',rating:4.7,verified:true,source:false},
  {name:'Stainless Steel Pot Set',price:22000,cat:'Home & Living',vendor:'Kitchen City',state:'Lagos',img:'🍲',bg:'#FAEEDA',rating:4.8,verified:true,source:false},
  {name:'Non-stick Frying Pan',price:9500,cat:'Home & Living',vendor:'Kitchen City',state:'Lagos',img:'🍳',bg:'#FAEEDA',rating:4.8,verified:true,source:false},
  {name:'Rug Carpet 6x9ft',price:25000,cat:'Home & Living',vendor:'HomeLife Essentials',state:'Lagos',img:'🧵',bg:'#FAEEDA',rating:4.6,verified:true,source:false},
  
  // Furniture
  {name:'Office Chair Mesh',price:45000,cat:'Furniture',vendor:'Furniture Box Lagos',state:'Lagos',img:'🪑',bg:'#D7CCC8',rating:4.6,verified:true,source:false},
  {name:'Dining Table 6-seater',price:120000,cat:'Furniture',vendor:'FurniDesign Studio',state:'Lagos',img:'🪑',bg:'#D7CCC8',rating:4.8,verified:true,source:false},
  {name:'Wooden Bed Frame Queen',price:85000,cat:'Furniture',vendor:'Furniture Box Lagos',state:'Lagos',img:'🛏️',bg:'#D7CCC8',rating:4.7,verified:true,source:false},
  {name:'Bookshelf Storage',price:35000,cat:'Furniture',vendor:'FurniDesign Studio',state:'Lagos',img:'📚',bg:'#D7CCC8',rating:4.8,verified:true,source:false},
  {name:'Coffee Table Wood',price:28000,cat:'Furniture',vendor:'Furniture Box Lagos',state:'Lagos',img:'🪑',bg:'#D7CCC8',rating:4.6,verified:true,source:false},
  
  // Books & Education
  {name:'JAMB Past Questions 2023',price:3500,cat:'Books & Education',vendor:'BookHub Nigeria',state:'Lagos',img:'📚',bg:'#F3E5F5',rating:4.7,verified:true,source:false},
  {name:'English Textbook SS3',price:4200,cat:'Books & Education',vendor:'EduStore Online',state:'Lagos',img:'📚',bg:'#F3E5F5',rating:4.6,verified:true,source:false},
  {name:'Mathematics Tutorial Guide',price:5500,cat:'Books & Education',vendor:'BookHub Nigeria',state:'Lagos',img:'📐',bg:'#F3E5F5',rating:4.8,verified:true,source:false},
  {name:'WAEC Practice Papers',price:6000,cat:'Books & Education',vendor:'EduStore Online',state:'Lagos',img:'📚',bg:'#F3E5F5',rating:4.7,verified:true,source:false},
  {name:'Story Book Collection',price:12000,cat:'Books & Education',vendor:'BookHub Nigeria',state:'Lagos',img:'📖',bg:'#F3E5F5',rating:4.9,verified:true,source:false},
  
  // Sports & Outdoors
  {name:'Dumbbell Set 20kg',price:35000,cat:'Sports & Outdoors',vendor:'SportZone Nigeria',state:'Lagos',img:'💪',bg:'#E3F2FD',rating:4.7,verified:true,source:false},
  {name:'Yoga Mat Premium',price:12500,cat:'Sports & Outdoors',vendor:'Active Time Store',state:'Lagos',img:'🧘',bg:'#E3F2FD',rating:4.5,verified:true,source:false},
  {name:'Running Shoes Unisex',price:28000,cat:'Sports & Outdoors',vendor:'SportZone Nigeria',state:'Lagos',img:'👟',bg:'#E3F2FD',rating:4.8,verified:true,source:false},
  {name:'Bicycle Mountain Bike',price:95000,cat:'Sports & Outdoors',vendor:'Active Time Store',state:'Lagos',img:'🚲',bg:'#E3F2FD',rating:4.6,verified:true,source:false},
  {name:'Sports Water Bottle',price:5500,cat:'Sports & Outdoors',vendor:'SportZone Nigeria',state:'Lagos',img:'🍶',bg:'#E3F2FD',rating:4.7,verified:true,source:false},
  
  // Automotive
  {name:'Car Engine Oil 5L',price:15000,cat:'Automotive',vendor:'AutoMart Nigeria',state:'Lagos',img:'🛢️',bg:'#EFEBE9',rating:4.6,verified:true,source:false},
  {name:'Car Air Filter',price:8500,cat:'Automotive',vendor:'AutoMart Nigeria',state:'Lagos',img:'🔧',bg:'#EFEBE9',rating:4.7,verified:true,source:false},
  {name:'Car Battery 12V 100Ah',price:85000,cat:'Automotive',vendor:'CarTech Supplies',state:'Lagos',img:'🔋',bg:'#EFEBE9',rating:4.8,verified:true,source:false},
  {name:'Car Seat Covers Set',price:22000,cat:'Automotive',vendor:'CarTech Supplies',state:'Lagos',img:'🪑',bg:'#EFEBE9',rating:4.7,verified:true,source:false},
  {name:'Tool Box 86-piece',price:28000,cat:'Automotive',vendor:'CarTech Supplies',state:'Lagos',img:'🧰',bg:'#EFEBE9',rating:4.8,verified:true,source:false},
  
  // Crafts & Gifts
  {name:'Photo Frame Set',price:6500,cat:'Crafts & Gifts',vendor:'Craft Gallery Lagos',state:'Lagos',img:'🖼️',bg:'#FCE4EC',rating:4.7,verified:true,source:false},
  {name:'Decorative Candle Set',price:9500,cat:'Crafts & Gifts',vendor:'GiftBox Express',state:'Lagos',img:'🕯️',bg:'#FCE4EC',rating:4.8,verified:true,source:false},
  {name:'Handmade Soap 6-bar',price:7500,cat:'Crafts & Gifts',vendor:'Craft Gallery Lagos',state:'Lagos',img:'🧼',bg:'#FCE4EC',rating:4.8,verified:true,source:false},
  {name:'Gift Hamper Deluxe',price:35000,cat:'Crafts & Gifts',vendor:'GiftBox Express',state:'Lagos',img:'🎁',bg:'#FCE4EC',rating:4.9,verified:true,source:false},
  {name:'Wall Art Poster Set',price:12000,cat:'Crafts & Gifts',vendor:'Craft Gallery Lagos',state:'Lagos',img:'🎨',bg:'#FCE4EC',rating:4.7,verified:true,source:false},
];
