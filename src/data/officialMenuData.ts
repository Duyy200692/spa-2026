import { Service, ServiceStep, InventoryItem } from '../types';

export const OFFICIAL_SPA_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-01',
    code: 'BTT-200',
    name: 'Bông tẩy trang tiệt trùng cao cấp',
    category: 'Vật tư tiêu hao',
    brand: 'Spa Medical Care',
    packageType: 'Hộp 200 miếng',
    packageUnit: 'Hộp',
    subUnitsPerPackage: 200,
    subUnitName: 'miếng',
    packagePurchasePrice: 50000,
    costPerSubUnit: 250,
    stockPackages: 25,
    stockSubUnits: 5000,
    minThresholdSubUnits: 500,
    expiryDate: '2027-12-31',
    supplier: 'Công ty Thiết Bị & Vật Tư Y Tế Bảo An',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'miếng',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 250,
    lastRestockedDate: '2026-09-01',
    notes: 'Bông cotton 100% không xơ, tiệt trùng y tế'
  },
  {
    id: 'inv-02',
    code: 'TT-500',
    name: 'Nước tẩy trang dịu nhẹ Micellar làm sạch sâu',
    category: 'Mỹ phẩm chăm sóc',
    brand: 'Bioderma Pro',
    packageType: 'Chai 500ml',
    packageUnit: 'Chai',
    subUnitsPerPackage: 500,
    subUnitName: 'ml',
    packagePurchasePrice: 180000,
    costPerSubUnit: 360,
    stockPackages: 10,
    stockSubUnits: 5000,
    minThresholdSubUnits: 500,
    expiryDate: '2027-12-31',
    supplier: 'Nhà Phân Phối Dược Mỹ Phẩm Pháp Việt',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 360,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-03',
    code: 'SRM-200',
    name: 'Sữa rửa mặt sinh học làm dịu da nhạy cảm & kiềm dầu',
    category: 'Mỹ phẩm chăm sóc',
    brand: 'Dermaceutic Bio',
    packageType: 'Tuýp 200ml',
    packageUnit: 'Tuýp',
    subUnitsPerPackage: 200,
    subUnitName: 'ml',
    packagePurchasePrice: 220000,
    costPerSubUnit: 1100,
    stockPackages: 12,
    stockSubUnits: 2400,
    minThresholdSubUnits: 300,
    expiryDate: '2027-12-31',
    supplier: 'Nhà Phân Phối Dược Mỹ Phẩm Pháp Việt',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 1100,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-04',
    code: 'TBC-200',
    name: 'Gel tẩy tế bào chết Enzym sinh học đa tầng',
    category: 'Mỹ phẩm chăm sóc',
    brand: 'Medipeel Pro',
    packageType: 'Tuýp 200ml',
    packageUnit: 'Tuýp',
    subUnitsPerPackage: 200,
    subUnitName: 'ml',
    packagePurchasePrice: 260000,
    costPerSubUnit: 1300,
    stockPackages: 8,
    stockSubUnits: 1600,
    minThresholdSubUnits: 200,
    expiryDate: '2027-12-31',
    supplier: 'Công ty Mỹ Phẩm Hàn Quốc K-Beauty',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 1300,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-05',
    code: 'TON-500',
    name: 'Nước hoa hồng xịt khoáng cân bằng pH',
    category: 'Mỹ phẩm chăm sóc',
    brand: 'Rose Water Natural',
    packageType: 'Chai 500ml',
    packageUnit: 'Chai',
    subUnitsPerPackage: 500,
    subUnitName: 'ml',
    packagePurchasePrice: 200000,
    costPerSubUnit: 400,
    stockPackages: 10,
    stockSubUnits: 5000,
    minThresholdSubUnits: 500,
    expiryDate: '2027-12-31',
    supplier: 'Công ty TNHH Thảo Dược Thiên Nhiên',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 400,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-06',
    code: 'NAM-NANO',
    name: 'Tinh chất điều trị nám chuyên sâu cấy Nano Melano-Off',
    category: 'Tinh chất đặc trị',
    brand: 'Histolab Nano Core',
    packageType: 'Hộp 10 ống',
    packageUnit: 'Hộp',
    subUnitsPerPackage: 10,
    subUnitName: 'ống',
    packagePurchasePrice: 650000,
    costPerSubUnit: 65000,
    stockPackages: 15,
    stockSubUnits: 150,
    minThresholdSubUnits: 20,
    expiryDate: '2027-12-31',
    supplier: 'Dược Phẩm Da Liễu Dermamedic',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ống',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 65000,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-07',
    code: 'MN-COOL',
    name: 'Mặt nạ làm dịu mát da phục hồi Cooling Gel Mask',
    category: 'Mặt nạ điều trị',
    brand: 'Medi-Peel Cooling',
    packageType: 'Hộp 20 miếng',
    packageUnit: 'Hộp',
    subUnitsPerPackage: 20,
    subUnitName: 'miếng',
    packagePurchasePrice: 400000,
    costPerSubUnit: 20000,
    stockPackages: 20,
    stockSubUnits: 400,
    minThresholdSubUnits: 40,
    expiryDate: '2027-12-31',
    supplier: 'Công ty Mỹ Phẩm Hàn Quốc K-Beauty',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'miếng',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 20000,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-08',
    code: 'KCN-100',
    name: 'Kem chống nắng sinh học vật lý SPF50+ PA++++',
    category: 'Mỹ phẩm chăm sóc',
    brand: 'Cell Fusion C Pro',
    packageType: 'Tuýp 100ml',
    packageUnit: 'Tuýp',
    subUnitsPerPackage: 100,
    subUnitName: 'ml',
    packagePurchasePrice: 380000,
    costPerSubUnit: 3800,
    stockPackages: 10,
    stockSubUnits: 1000,
    minThresholdSubUnits: 100,
    expiryDate: '2027-12-31',
    supplier: 'Nhà Phân Phối Dược Mỹ Phẩm Pháp Việt',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 3800,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-09',
    code: 'DG-BK5000',
    name: 'Dầu gội bồ kết thảo dược thiên nhiên nấu cô đặc',
    category: 'Dầu gội & Chăm sóc tóc',
    brand: 'Dưỡng Sinh Cổ Mộc',
    packageType: 'Can 5000ml',
    packageUnit: 'Can',
    subUnitsPerPackage: 5000,
    subUnitName: 'ml',
    packagePurchasePrice: 450000,
    costPerSubUnit: 90,
    stockPackages: 6,
    stockSubUnits: 30000,
    minThresholdSubUnits: 3000,
    expiryDate: '2027-12-31',
    supplier: 'Xưởng Dược Liệu Dưỡng Sinh Việt Nam',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 90,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-10',
    code: 'DX-TM5000',
    name: 'Dầu xả thảo mộc mềm mượt tóc & dưỡng ngọn',
    category: 'Dầu gội & Chăm sóc tóc',
    brand: 'Dưỡng Sinh Cổ Mộc',
    packageType: 'Can 5000ml',
    packageUnit: 'Can',
    subUnitsPerPackage: 5000,
    subUnitName: 'ml',
    packagePurchasePrice: 480000,
    costPerSubUnit: 96,
    stockPackages: 5,
    stockSubUnits: 25000,
    minThresholdSubUnits: 2500,
    expiryDate: '2027-12-31',
    supplier: 'Xưởng Dược Liệu Dưỡng Sinh Việt Nam',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 96,
    lastRestockedDate: '2026-09-01'
  },
  {
    id: 'inv-11',
    code: 'TD-BODY1000',
    name: 'Tinh dầu massage body thảo mộc thư giãn gừng & quế',
    category: 'Tinh dầu & Massage',
    brand: 'Pure Herbal Aroma',
    packageType: 'Chai 1000ml',
    packageUnit: 'Chai',
    subUnitsPerPackage: 1000,
    subUnitName: 'ml',
    packagePurchasePrice: 320000,
    costPerSubUnit: 320,
    stockPackages: 8,
    stockSubUnits: 8000,
    minThresholdSubUnits: 800,
    expiryDate: '2027-12-31',
    supplier: 'Công ty Tinh Dầu & Hương Liệu Á Châu',
    lastRestocked: '2026-09-01',
    costCalculationUnit: 'ml',
    usageQuantityPerSubUnit: 1,
    costPerUsageUnit: 320,
    lastRestockedDate: '2026-09-01'
  }
];

export const OFFICIAL_SPA_SERVICES: Service[] = [
  // 1/ QUY TRÌNH CHĂM SÓC DA NÁM
  {
    id: 'srv-nam-nano',
    code: 'DN-01',
    shortName: 'Chăm Sóc Da Nám',
    name: 'Quy trình chăm sóc da nám',
    category: 'Chăm sóc & Điều trị da mặt',
    durationMinutes: 75,
    price: 450000,
    description: 'Quy trình chuẩn 9 bước: Tẩy trang, Rửa mặt, Tẩy tbc, Xông hơi hút mụn, Xịt dưỡng nước hoa hồng, Đắp mặt nạ, Cấy nanno (tinh chất nám), Điện di lạnh, Thoa kem chống nắng.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 70000,
    otherOverheads: 25000,
    totalCalculatedCost: 195000,
    grossProfit: 255000,
    profitMarginPercent: 56.7,
    targetSkinType: 'Da nám mảng, nám chân sâu, da không đều màu, đồi mồi sạm màu do tác hại ánh nắng và nội tiết.',
    benefitsSummary: 'Làm sạch sâu nang lông, cấy vi điểm nano tinh chất nám thẩm thấu sâu hạ bì, điện di lạnh khóa hoạt chất ức chế Melanin và bảo vệ da toàn diện.',
    contraindications: 'Không dùng cho da đang có vết thương hở lở loét, da đang kích ứng viêm da tiếp xúc nặng.',
    homeCareNotes: 'Thoa kem chống nắng đều đặn mỗi ngày, tránh tiếp xúc trực tiếp ánh nắng gay gắt, uống nhiều nước và dưỡng ẩm thường xuyên.',
    preparationSteps: [
      'Kiểm tra sát khuẩn tay kỹ thuật viên & đeo khẩu trang y tế.',
      'Chuẩn bị đầu nano tròn tiệt trùng sử dụng 1 lần và ống tinh chất nám chuyên sâu.',
      'Khởi động máy xông hơi nóng & búa điện di lạnh Cryo.'
    ],
    steps: [
      {
        id: 'dn-step-1',
        stepNumber: 1,
        title: 'Tẩy trang',
        durationMinutes: 4,
        description: 'Dùng nước tẩy trang dịu nhẹ lau sạch lớp trang điểm, bụi bẩn bề mặt và bã nhờn.',
        productsUsed: 'Nước tẩy trang Micellar Water',
        toolsUsed: 'Bông tẩy trang tiệt trùng'
      },
      {
        id: 'dn-step-2',
        stepNumber: 2,
        title: 'Rửa mặt',
        durationMinutes: 5,
        description: 'Tạo bọt sữa rửa mặt dịu nhẹ, massage nhẹ nhàng làm sạch sâu nang lông toàn bộ khuôn mặt.',
        productsUsed: 'Sữa rửa mặt sinh học',
        toolsUsed: 'Bọt biển y tế ấm'
      },
      {
        id: 'dn-step-3',
        stepNumber: 3,
        title: 'Tẩy tbc',
        durationMinutes: 5,
        description: 'Thoa gel tẩy tế bào chết enzym sinh học, loại bỏ lớp sừng già cỗi bám trên bề mặt da.',
        productsUsed: 'Gel tẩy TBC Enzym',
        toolsUsed: 'Bọt biển ấm'
      },
      {
        id: 'dn-step-4',
        stepNumber: 4,
        title: 'Xông hơi hút mụn',
        durationMinutes: 8,
        description: 'Mở máy xông hơi nóng giãn nở lỗ chân lông, kết hợp máy hút mụn chân không hút sạch bã nhờn và mụn cám.',
        productsUsed: 'Khăn ấm thảo mộc',
        toolsUsed: 'Máy xông hơi nóng & Đầu hút chân không'
      },
      {
        id: 'dn-step-5',
        stepNumber: 5,
        title: 'Xịt dưỡng nước hoa hồng',
        durationMinutes: 3,
        description: 'Phun sương nước hoa hồng tinh khiết làm dịu mát da, cân bằng độ pH tức thì.',
        productsUsed: 'Nước hoa hồng cân bằng pH',
        toolsUsed: 'Máy phun sương nano / Chai xịt khoáng'
      },
      {
        id: 'dn-step-6',
        stepNumber: 6,
        title: 'Đắp mặt nạ',
        durationMinutes: 15,
        description: 'Đắp mặt nạ dưỡng chất làm dịu, phục hồi màng ẩm và bổ sung dưỡng chất cho tế bào da.',
        productsUsed: 'Mặt nạ phục hồi Cooling Mask',
        toolsUsed: 'Cọ quét mặt nạ tiệt trùng'
      },
      {
        id: 'dn-step-7',
        stepNumber: 7,
        title: 'Cấy nanno (tinh chất nám)',
        durationMinutes: 20,
        description: 'Sử dụng đầu kim nano tròn cấy vi điểm tinh chất đặc trị nám chuyên sâu đều khắp bề mặt da, giúp hoạt chất thẩm thấu sâu xuống lớp đáy biểu bì.',
        productsUsed: 'Tinh chất đặc trị nám chuyên sâu Melano-Off',
        toolsUsed: 'Máy cấy Nano tiệt trùng (đầu tròn không xâm lấn)'
      },
      {
        id: 'dn-step-8',
        stepNumber: 8,
        title: 'Điện di lạnh',
        durationMinutes: 10,
        description: 'Đi máy điện di lạnh Cryo giúp khóa chặt tinh chất nám vừa cấy, se khít lỗ chân lông và làm dịu mát da tức thì.',
        productsUsed: 'Gel khóa ẩm lạnh',
        toolsUsed: 'Búa điện di lạnh Cryo (-5°C)'
      },
      {
        id: 'dn-step-9',
        stepNumber: 9,
        title: 'Thoa kem chống nắng',
        durationMinutes: 5,
        description: 'Thoa đều kem chống nắng vật lý SPF50+ vỗ nhẹ bảo vệ tối đa làn da non sau điều trị.',
        productsUsed: 'Kem chống nắng sinh học SPF50+',
        toolsUsed: 'Găng tay vô trùng'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-01',
        name: 'Bông tẩy trang tiệt trùng',
        unit: 'miếng',
        quantityUsed: 4,
        costPerUnit: 250,
        totalCost: 1000
      },
      {
        inventoryItemId: 'inv-02',
        name: 'Nước tẩy trang Micellar',
        unit: 'ml',
        quantityUsed: 10,
        costPerUnit: 360,
        totalCost: 3600
      },
      {
        inventoryItemId: 'inv-03',
        name: 'Sữa rửa mặt sinh học',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1100,
        totalCost: 5500
      },
      {
        inventoryItemId: 'inv-04',
        name: 'Gel tẩy TBC Enzym',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1300,
        totalCost: 6500
      },
      {
        inventoryItemId: 'inv-05',
        name: 'Nước hoa hồng cân bằng',
        unit: 'ml',
        quantityUsed: 6,
        costPerUnit: 400,
        totalCost: 2400
      },
      {
        inventoryItemId: 'inv-06',
        name: 'Tinh chất nám Nano chuyên sâu',
        unit: 'ống',
        quantityUsed: 1,
        costPerUnit: 65000,
        totalCost: 65000
      },
      {
        inventoryItemId: 'inv-07',
        name: 'Mặt nạ phục hồi Cooling',
        unit: 'miếng',
        quantityUsed: 1,
        costPerUnit: 20000,
        totalCost: 20000
      },
      {
        inventoryItemId: 'inv-08',
        name: 'Kem chống nắng sinh học',
        unit: 'ml',
        quantityUsed: 3,
        costPerUnit: 3800,
        totalCost: 11400
      }
    ]
  },

  // 2/ QUY TRÌNH CHĂM SÓC DA MỤN
  {
    id: 'srv-mun-y-khoa',
    code: 'DM-02',
    shortName: 'Chăm Sóc Da Mụn',
    name: 'Quy trình chăm sóc da mụn',
    category: 'Chăm sóc & Điều trị da mặt',
    durationMinutes: 90,
    price: 390000,
    description: 'Quy trình chuẩn y khoa 11 bước: Tẩy trang, Srm, Tẩy tbc, Xông hơi + hút mụn, Sát khuẩn + nước muối, Nặn mụn, Điện tím, Phun nuóc hoa hồng, Đắp mặt nạ, Điện di lạnh, Chiếu đèn kem chống nắng.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e604f32c?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 65000,
    otherOverheads: 25000,
    totalCalculatedCost: 153000,
    grossProfit: 237000,
    profitMarginPercent: 60.8,
    targetSkinType: 'Da mụn ẩn, mụn đầu đen, mụn viêm, da bít tắc nang lông và tiết nhiều dầu nhờn.',
    benefitsSummary: 'Lấy sạch tận gốc nhân mụn già cỗi không để lại sẹo thâm, tiệt trùng ổ viêm P.acnes với tia điện tím và ánh sáng sinh học, làm dịu da cấp ẩm phục hồi.',
    contraindications: 'Không nặn ép các nốt mụn bọc lớn đang sưng đau dữ dội chưa gom cồi.',
    homeCareNotes: 'Giữ vệ sinh tay, không tự ý sờ tay lên mặt, thay vỏ gối định kỳ và bôi serum ngừa thâm theo hướng dẫn của chuyên viên.',
    preparationSteps: [
      'Khử trùng bộ dụng cụ lấy mụn y khoa bằng nồi hấp tiệt trùng.',
      'Chuẩn bị dung dịch sát khuẩn Povidine pha loãng & nước muối sinh lý vô trùng NaCl 0.9%.',
      'Kiểm tra máy điện tím & máy chiếu ánh sáng sinh học Bio-Light.'
    ],
    steps: [
      {
        id: 'dm-step-1',
        stepNumber: 1,
        title: 'Tẩy trang',
        durationMinutes: 4,
        description: 'Làm sạch bụi bẩn, bã nhờn và lớp chống nắng bằng dung dịch micellar dịu nhẹ cho da mụn.',
        productsUsed: 'Nước tẩy trang kiềm dầu dịu nhẹ',
        toolsUsed: 'Bông tẩy trang tiệt trùng'
      },
      {
        id: 'dm-step-2',
        stepNumber: 2,
        title: 'Srm',
        durationMinutes: 5,
        description: 'Rửa mặt bằng sữa rửa mặt y khoa tạo bọt mịn, làm sạch sâu nang lông và kháng khuẩn.',
        productsUsed: 'Sữa rửa mặt kháng khuẩn sinh học',
        toolsUsed: 'Bọt biển y tế tiệt trùng'
      },
      {
        id: 'dm-step-3',
        stepNumber: 3,
        title: 'Tẩy tbc',
        durationMinutes: 4,
        description: 'Tẩy tế bào chết bằng gel enzym dịu nhẹ không hạt, tránh làm trầy xước tổn thương vùng da mụn.',
        productsUsed: 'Gel tẩy TBC sinh học',
        toolsUsed: 'Bọt biển ấm'
      },
      {
        id: 'dm-step-4',
        stepNumber: 4,
        title: 'Xông hơi + hút mụn',
        durationMinutes: 8,
        description: 'Xông hơi nóng làm mềm cồi mụn kết hợp hút sạch bã nhờn thừa vùng chữ T.',
        productsUsed: 'Nước xông hơi thảo dược tinh khiết',
        toolsUsed: 'Máy xông hơi nóng & Máy hút chân không'
      },
      {
        id: 'dm-step-5',
        stepNumber: 5,
        title: 'Sát khuẩn + nước muối',
        durationMinutes: 4,
        description: 'Sát khuẩn toàn bộ khuôn mặt bằng dung dịch sát trùng y khoa và lau sạch lại bằng nước muối sinh lý vô trùng.',
        productsUsed: 'Povidine pha loãng & Nước muối sinh lý NaCl 0.9%',
        toolsUsed: 'Gạc y tế vô trùng'
      },
      {
        id: 'dm-step-6',
        stepNumber: 6,
        title: 'Nặn mụn',
        durationMinutes: 25,
        description: 'Kỹ thuật viên sử dụng que nặn mụn tiệt trùng và kim tạo đường dẫn lấy sạch nhân mụn già, chuẩn xác, không đau, không để lại sẹo rỗ.',
        productsUsed: 'Nước muối sinh lý',
        toolsUsed: 'Bộ que nặn mụn & kim y tế tiệt trùng 1 lần'
      },
      {
        id: 'dm-step-7',
        stepNumber: 7,
        title: 'Điện tím',
        durationMinutes: 6,
        description: 'Đi tia điện tím tần số cao sát khuẩn sâu vết thương hở sau khi nặn, làm se cồi và chống viêm nhiễm lan rộng.',
        productsUsed: 'Oxy hoạt tính',
        toolsUsed: 'Đầu máy tia điện tím diệt khuẩn'
      },
      {
        id: 'dm-step-8',
        stepNumber: 8,
        title: 'Phun nuóc hoa hồng',
        durationMinutes: 3,
        description: 'Phun sương nước hoa hồng làm mát dịu da, giảm đỏ và cân bằng độ pH nang lông.',
        productsUsed: 'Nước hoa hồng trà xanh / tràm trà',
        toolsUsed: 'Máy phun oxy sương mịn'
      },
      {
        id: 'dm-step-9',
        stepNumber: 9,
        title: 'Đắp mặt nạ',
        durationMinutes: 15,
        description: 'Đắp mặt nạ tràm trà giảm sưng viêm, cấp ẩm và thúc đẩy phục hồi mô da tổn thương.',
        productsUsed: 'Mặt nạ thảo dược trị mụn',
        toolsUsed: 'Cọ đắp mặt nạ tiệt trùng'
      },
      {
        id: 'dm-step-10',
        stepNumber: 10,
        title: 'Điện di lạnh',
        durationMinutes: 10,
        description: 'Đi máy điện di lạnh Cryo se khít lỗ chân lông, làm dịu da tức thì và giảm sưng tấy sau nặn mụn.',
        productsUsed: 'Tinh chất làm dịu phục hồi da mụn',
        toolsUsed: 'Búa điện di lạnh Cryo'
      },
      {
        id: 'dm-step-11',
        stepNumber: 11,
        title: 'Chiếu đèn kem chống nắng',
        durationMinutes: 6,
        description: 'Chiếu ánh sáng sinh học Bio-Light màu xanh kháng khuẩn P.acnes, sau đó thoa kem chống nắng kiềm dầu bảo vệ da.',
        productsUsed: 'Kem chống nắng sinh học kiềm dầu',
        toolsUsed: 'Vòm ánh sáng sinh học Bio-Light Blue'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-01',
        name: 'Bông tiệt trùng & gạc y tế',
        unit: 'miếng',
        quantityUsed: 6,
        costPerUnit: 250,
        totalCost: 1500
      },
      {
        inventoryItemId: 'inv-02',
        name: 'Nước tẩy trang dịu nhẹ',
        unit: 'ml',
        quantityUsed: 10,
        costPerUnit: 360,
        totalCost: 3600
      },
      {
        inventoryItemId: 'inv-03',
        name: 'Sữa rửa mặt kháng khuẩn',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1100,
        totalCost: 5500
      },
      {
        inventoryItemId: 'inv-04',
        name: 'Gel tẩy TBC Enzym',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1300,
        totalCost: 6500
      },
      {
        inventoryItemId: 'inv-05',
        name: 'Nước hoa hồng tràm trà',
        unit: 'ml',
        quantityUsed: 8,
        costPerUnit: 400,
        totalCost: 3200
      },
      {
        inventoryItemId: 'inv-07',
        name: 'Mặt nạ tràm trà giảm sưng',
        unit: 'miếng',
        quantityUsed: 1,
        costPerUnit: 20000,
        totalCost: 20000
      },
      {
        inventoryItemId: 'inv-08',
        name: 'Kem chống nắng kiềm dầu',
        unit: 'ml',
        quantityUsed: 3,
        costPerUnit: 3800,
        totalCost: 11400
      }
    ]
  },

  // 3/ QUY TRÌNH CHĂM SÓC DA LÃO HÓA, DA KHÔ, NHẠY CẢM
  {
    id: 'srv-lao-hoa-kho',
    code: 'LH-03',
    shortName: 'Da Lão Hóa & Nhạy Cảm',
    name: 'Quy trinh chăm sóc da lão hoá, da khô, nhạy cảm',
    category: 'Chăm sóc & Điều trị da mặt',
    durationMinutes: 75,
    price: 420000,
    description: 'Quy trình chuẩn 8 bước: Tẩy trang, Srm, Tẩy tbc, Xông hơi hút mụn, Massa mặt đá nóng, Đắp mặt nạ, Điện di lạnh, Kem chống nắng.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 65000,
    otherOverheads: 25000,
    totalCalculatedCost: 163000,
    grossProfit: 257000,
    profitMarginPercent: 61.2,
    targetSkinType: 'Da xuất hiện nếp nhăn chùng nhão, da khô ráp bong tróc, da mỏng đỏ giãn mao mạch hoặc nhạy cảm thời tiết.',
    benefitsSummary: 'Kích thích tăng sinh collagen & elastin tự nhiên, nâng cơ định hình viền hàm bằng đá nóng Bazan, khóa ẩm đa tầng và phục hồi màng bảo vệ da.',
    contraindications: 'Không dùng đá quá nóng trên làn da đang kích ứng phát ban cấp tính.',
    homeCareNotes: 'Cấp nước đầy đủ, tránh dùng nước nóng rửa mặt, thoa serum phục hồi và kem chống nắng mỗi sáng.',
    preparationSteps: [
      'Hấp nóng 2 viên đá nóng Bazan chuyên dụng cho mặt ở nhiệt độ 42-45°C.',
      'Chuẩn bị sữa rửa mặt dịu nhẹ không bọt & mặt nạ collagen tươi.',
      'Bật búa điện di lạnh Cryo.'
    ],
    steps: [
      {
        id: 'lh-step-1',
        stepNumber: 1,
        title: 'Tẩy trang',
        durationMinutes: 4,
        description: 'Tẩy trang nhẹ nhàng lấy sạch bụi bẩn và bã nhờn mà không làm khô ráp da.',
        productsUsed: 'Nước tẩy trang dịu nhẹ Micellar',
        toolsUsed: 'Bông cotton tiệt trùng mềm'
      },
      {
        id: 'lh-step-2',
        stepNumber: 2,
        title: 'Srm',
        durationMinutes: 5,
        description: 'Dùng sữa rửa mặt phục hồi dịu nhẹ, cân bằng độ pH tự nhiên của màng lipid da.',
        productsUsed: 'Sữa rửa mặt dưỡng ẩm sinh học',
        toolsUsed: 'Bọt biển mềm ấm'
      },
      {
        id: 'lh-step-3',
        stepNumber: 3,
        title: 'Tẩy tbc',
        durationMinutes: 4,
        description: 'Tẩy tế bào chết bằng enzym dịu nhẹ không hạt, làm sáng mịn da mà không bào mòn da nhạy cảm.',
        productsUsed: 'Gel tẩy TBC enzym thực vật',
        toolsUsed: 'Bọt biển ấm'
      },
      {
        id: 'lh-step-4',
        stepNumber: 4,
        title: 'Xông hơi hút mụn',
        durationMinutes: 6,
        description: 'Xông hơi ẩm nhẹ nhàng kết hợp hút sạch bã nhờn vùng chữ T.',
        productsUsed: 'Hơi nước tinh khiết ấm',
        toolsUsed: 'Máy xông hơi nóng & Đầu hút nhỏ'
      },
      {
        id: 'lh-step-5',
        stepNumber: 5,
        title: 'Massa mặt đá nóng',
        durationMinutes: 20,
        description: 'Massage nâng cơ chống chảy xệ bằng 2 viên đá nóng Bazan kết hợp tinh dầu organic phục hồi, kích thích lưu thông máu và sản sinh collagen.',
        productsUsed: 'Tinh dầu dưỡng ẩm Organic',
        toolsUsed: '2 viên đá nóng mặt Basalt 45°C & Khăn ấm'
      },
      {
        id: 'lh-step-6',
        stepNumber: 6,
        title: 'Đắp mặt nạ',
        durationMinutes: 15,
        description: 'Đắp mặt nạ collagen / HA sinh học cấp ẩm sâu, phục hồi màng ẩm bảo vệ và làm săn chắc da.',
        productsUsed: 'Mặt nạ phục hồi Collagen sinh học',
        toolsUsed: 'Cọ quét tiệt trùng'
      },
      {
        id: 'lh-step-7',
        stepNumber: 7,
        title: 'Điện di lạnh',
        durationMinutes: 15,
        description: 'Điện di lạnh khóa chặt độ ẩm và dưỡng chất chống lão hóa, se khít lỗ chân lông và làm dịu mát da.',
        productsUsed: 'Serum HA / Ceramide',
        toolsUsed: 'Búa điện di lạnh Cryo'
      },
      {
        id: 'lh-step-8',
        stepNumber: 8,
        title: 'Kem chống nắng',
        durationMinutes: 6,
        description: 'Thoa kem dưỡng ẩm phục hồi và kem chống nắng vật lý màng bảo vệ dịu nhẹ chống tia UV.',
        productsUsed: 'Kem chống nắng sinh học SPF50+',
        toolsUsed: 'Tay sát khuẩn sạch'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-01',
        name: 'Bông tẩy trang tiệt trùng',
        unit: 'miếng',
        quantityUsed: 4,
        costPerUnit: 250,
        totalCost: 1000
      },
      {
        inventoryItemId: 'inv-02',
        name: 'Nước tẩy trang dịu nhẹ',
        unit: 'ml',
        quantityUsed: 10,
        costPerUnit: 360,
        totalCost: 3600
      },
      {
        inventoryItemId: 'inv-03',
        name: 'Sữa rửa mặt dịu nhẹ',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1100,
        totalCost: 5500
      },
      {
        inventoryItemId: 'inv-04',
        name: 'Gel tẩy TBC Enzym',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1300,
        totalCost: 6500
      },
      {
        inventoryItemId: 'inv-07',
        name: 'Mặt nạ Collagen cấp ẩm sâu',
        unit: 'miếng',
        quantityUsed: 1,
        costPerUnit: 20000,
        totalCost: 20000
      },
      {
        inventoryItemId: 'inv-08',
        name: 'Kem chống nắng sinh học',
        unit: 'ml',
        quantityUsed: 3,
        costPerUnit: 3800,
        totalCost: 11400
      }
    ]
  },

  // 4/ QUY TRÌNH GỘI 75
  {
    id: 'srv-goi-75',
    code: 'GD-75',
    shortName: 'Gội Dưỡng Sinh 75 Phút',
    name: 'Quy trình gội 75',
    category: 'Gội đầu dưỡng sinh & Chăm sóc tóc',
    durationMinutes: 75,
    price: 250000,
    description: 'Quy trình dưỡng sinh 13 bước: Làm ấm bụng, vai, chân; Massa đầu khô; Đi máy massa; Chải lược gusha; Massa mặt; Rửa mặt; Đắp mặt nạ; Gội lần 1; Gội lần 2; Dầu xã; Bóp vai khô; Sấy tóc; Dùng nước đậu đỏ + mứt gừng.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 50000,
    otherOverheads: 20000,
    totalCalculatedCost: 125000,
    grossProfit: 125000,
    profitMarginPercent: 50.0,
    targetSkinType: 'Mọi khách hàng cần thư giãn, người đau mỏi cổ vai gáy, mệt mỏi căng thẳng đầu óc, tóc gãy rụng gàu ngứa.',
    benefitsSummary: 'Đả thông 10 đường kinh lạc vùng đầu, giảm căng thẳng mất ngủ, phục hồi mái tóc bồng bềnh sạch gàu và bồi bổ khí huyết với trà đậu đỏ mứt gừng.',
    contraindications: 'Khách hàng đang sốt cao hoặc có vết mổ hở vùng đầu cổ.',
    homeCareNotes: 'Giữ ấm cơ thể sau gội, không tắm nước lạnh ngay, hạn chế thức khuya.',
    preparationSteps: [
      'Đun túi chườm thảo mộc ấm vùng bụng, vai và chân.',
      'Nấu nước thảo mộc bồ kết cô đặc ấm 40°C.',
      'Chuẩn bị máy massage đầu rung sóng, lược Guasha sừng thiên nhiên.',
      'Chuẩn bị sẵn ly nước đậu đỏ ấm và mứt gừng thơm.'
    ],
    steps: [
      {
        id: 'g75-step-1',
        stepNumber: 1,
        title: 'Làm ấm bụng , vai , chân',
        durationMinutes: 5,
        description: 'Đặt túi chườm thảo dược ấm lên vùng bụng, vai và chân giúp làm ấm tạng phủ, kích thích lưu thông tuần hoàn máu.',
        productsUsed: 'Túi chườm thảo mộc ấm nóng',
        toolsUsed: 'Bộ túi chườm thảo dược giữ nhiệt'
      },
      {
        id: 'g75-step-2',
        stepNumber: 2,
        title: 'Massa đầu khô',
        durationMinutes: 8,
        description: 'Massage ấn huyệt khô vùng đầu: Bách Hội, Thái Dương, Phong Trì giúp giải tỏa áp lực và căng thẳng tức thì.',
        productsUsed: 'Tinh dầu bạc hà / thảo mộc',
        toolsUsed: 'Kỹ thuật tay chuyên sâu'
      },
      {
        id: 'g75-step-3',
        stepNumber: 3,
        title: 'Đi máy massa',
        durationMinutes: 6,
        description: 'Đi máy massage trị liệu chuyên dụng giúp rung vi điểm đả thông các bó cơ da đầu bị co cứng.',
        productsUsed: 'Không',
        toolsUsed: 'Máy massage rung trị liệu chuyên dụng'
      },
      {
        id: 'g75-step-4',
        stepNumber: 4,
        title: 'Chải lược gusha',
        durationMinutes: 6,
        description: 'Chải lược sừng Guasha theo các đường kinh lạc từ chân trán ra sau gáy, khai thông huyệt đạo và kích thích mọc tóc.',
        productsUsed: 'Không',
        toolsUsed: 'Lược Guasha sừng tự nhiên'
      },
      {
        id: 'g75-step-5',
        stepNumber: 5,
        title: 'Massa mặt',
        durationMinutes: 8,
        description: 'Massage bấm huyệt nâng cơ mặt thư giãn nhẹ nhàng, tăng cường tuần hoàn vi mạch.',
        productsUsed: 'Tinh dầu massage mặt dịu nhẹ',
        toolsUsed: 'Thao tác tay bấm huyệt'
      },
      {
        id: 'g75-step-6',
        stepNumber: 6,
        title: 'Rửa mặt',
        durationMinutes: 4,
        description: 'Rửa mặt sạch sâu loại bỏ bã nhờn và bụi bẩn bằng sản phẩm dịu nhẹ.',
        productsUsed: 'Sữa rửa mặt dịu nhẹ',
        toolsUsed: 'Bọt biển ấm'
      },
      {
        id: 'g75-step-7',
        stepNumber: 7,
        title: 'Đắp mặt nạ',
        durationMinutes: 10,
        description: 'Đắp mặt nạ thảo mộc dưỡng ẩm và nuôi dưỡng làn da sáng mịn trong suốt liệu trình.',
        productsUsed: 'Mặt nạ thảo mộc dưỡng ẩm',
        toolsUsed: 'Cọ quét tiệt trùng'
      },
      {
        id: 'g75-step-8',
        stepNumber: 8,
        title: 'Gội lần 1',
        durationMinutes: 7,
        description: 'Gội sạch bụi bẩn và dầu nhờn trên da đầu với nước thảo mộc bồ kết cô đặc lần 1.',
        productsUsed: 'Nước dầu gội bồ kết thảo dược',
        toolsUsed: 'Vòi sen dưỡng sinh & gáo nước thảo mộc'
      },
      {
        id: 'g75-step-9',
        stepNumber: 9,
        title: 'Gội lần 2',
        durationMinutes: 8,
        description: 'Gội lần 2 kết hợp gãi cào thư giãn, ấn huyệt chân tóc nuôi dưỡng nang tóc chắc khỏe.',
        productsUsed: 'Dầu gội bồ kết thảo dược cô đặc',
        toolsUsed: 'Thao tác tay gội dưỡng sinh'
      },
      {
        id: 'g75-step-10',
        stepNumber: 10,
        title: 'Dầu xã',
        durationMinutes: 5,
        description: 'Thoa dầu xả thảo mộc làm mềm mượt từ thân tóc đến ngọn tóc, xả sạch với nước ấm.',
        productsUsed: 'Dầu xả thảo mộc mềm mượt tóc',
        toolsUsed: 'Nước ấm'
      },
      {
        id: 'g75-step-11',
        stepNumber: 11,
        title: 'Bóp vai khô',
        durationMinutes: 5,
        description: 'Khách ngồi dậy, kỹ thuật viên thực hiện bóp vai, cổ gáy và cánh tay khô giải tỏa cơn nhức mỏi.',
        productsUsed: 'Không',
        toolsUsed: 'Thao tác tay trị liệu cổ vai gáy'
      },
      {
        id: 'g75-step-12',
        stepNumber: 12,
        title: 'Sấy tóc',
        durationMinutes: 5,
        description: 'Lau ráo nước, sấy khô tóc chế độ ấm mát vừa phải và thoa tinh dầu dưỡng bóng tóc.',
        productsUsed: 'Tinh dầu dưỡng bóng tóc',
        toolsUsed: 'Máy sấy ion chuyên dụng & lược tròn'
      },
      {
        id: 'g75-step-13',
        stepNumber: 13,
        title: 'Dùng nước đậu đỏ + mứt gừng',
        durationMinutes: 3,
        description: 'Mời khách thưởng thức ly nước đậu đỏ rang thơm ấm thanh nhiệt bổ huyết cùng mứt gừng nồng ấm kết thúc liệu trình.',
        productsUsed: 'Nước đậu đỏ rang ấm & Mứt gừng dẻo',
        toolsUsed: 'Ly sứ dưỡng sinh & đĩa mứt'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-09',
        name: 'Dầu gội bồ kết cô đặc',
        unit: 'ml',
        quantityUsed: 40,
        costPerUnit: 90,
        totalCost: 3600
      },
      {
        inventoryItemId: 'inv-10',
        name: 'Dầu xả thảo mộc',
        unit: 'ml',
        quantityUsed: 25,
        costPerUnit: 96,
        totalCost: 2400
      },
      {
        inventoryItemId: 'inv-03',
        name: 'Sữa rửa mặt dịu nhẹ',
        unit: 'ml',
        quantityUsed: 4,
        costPerUnit: 1100,
        totalCost: 4400
      },
      {
        inventoryItemId: 'inv-07',
        name: 'Mặt nạ thảo mộc dưỡng ẩm',
        unit: 'miếng',
        quantityUsed: 1,
        costPerUnit: 20000,
        totalCost: 20000
      }
    ]
  },

  // 5/ QUY TRÌNH GỘI 120 PHÚT
  {
    id: 'srv-goi-120',
    code: 'GD-120',
    shortName: 'Gội Hoàng Cung 120 Phút',
    name: 'Quy trình gội 120phút',
    category: 'Gội đầu dưỡng sinh & Chăm sóc tóc',
    durationMinutes: 120,
    price: 390000,
    description: 'Quy trình hoàng cung chuyên sâu 14 bước: Làm ấm bụng, vai, chân; Massa đầu khô; Máy massa; Chải lược gusha; Massa mặt; Rửa mắt; Đắp mặt nạ; Tẩy tế bào chết + xông hơi; Gội lần 1; Gội lần 2; Hấp tóc (massa tay); Bóp vai khố; Sấy khô; Dùng nước đậu đen + mứt gừng.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 85000,
    otherOverheads: 28000,
    totalCalculatedCost: 195000,
    grossProfit: 195000,
    profitMarginPercent: 50.0,
    targetSkinType: 'Khách hàng mất ngủ mãn tính, căng thẳng thần kinh, đau nhức mỏi cổ vai gáy nặng, tóc khô xơ hư tổn cần tái tạo.',
    benefitsSummary: 'Liệu trình hoàng cung đại thư giãn: giải phóng toàn bộ tắc nghẽn kinh lạc đầu cổ gáy, xông hơi tẩy da chết da đầu, ủ hấp phục hồi tóc kết hợp massage cánh tay êm dịu.',
    contraindications: 'Người đang sốt cao hoặc có vấn đề viêm da đầu cấp tính mưng mủ.',
    homeCareNotes: 'Nên uống nước ấm sau buổi gội, ngủ đủ giấc để dưỡng khí huyết.',
    preparationSteps: [
      'Ủ túi chườm thảo mộc ấm bụng, vai và chân.',
      'Chuẩn bị dung dịch vệ sinh làm sạch mắt và gel tẩy da chết da đầu.',
      'Máy xông hơi da đầu & nón hấp tóc nano.',
      'Nấu nước đậu đen rang thơm nóng và chuẩn bị đĩa mứt gừng.'
    ],
    steps: [
      {
        id: 'g120-step-1',
        stepNumber: 1,
        title: 'Làm ấm bụng,vai, chân',
        durationMinutes: 8,
        description: 'Chườm túi thảo dược ấm lên các vùng bụng, vai và chân giúp điều hòa khí huyết toàn thân.',
        productsUsed: 'Túi chườm thảo dược ấm',
        toolsUsed: 'Bộ chườm giữ nhiệt cao cấp'
      },
      {
        id: 'g120-step-2',
        stepNumber: 2,
        title: 'Massa đầu khô',
        durationMinutes: 12,
        description: 'Massage ấn huyệt chuyên sâu toàn bộ vùng đầu, giải tỏa tắc nghẽn kinh lạc và làm dịu thần kinh.',
        productsUsed: 'Tinh dầu thảo dược thư giãn',
        toolsUsed: 'Kỹ thuật ấn huyệt chuyên sâu'
      },
      {
        id: 'g120-step-3',
        stepNumber: 3,
        title: 'Máy massa',
        durationMinutes: 8,
        description: 'Sử dụng máy massage trị liệu đa điểm rung thư giãn sâu từng chân tóc.',
        productsUsed: 'Không',
        toolsUsed: 'Máy massage rung vi điểm đầu'
      },
      {
        id: 'g120-step-4',
        stepNumber: 4,
        title: 'Chải lược gusha',
        durationMinutes: 8,
        description: 'Chải lược ngọc Guasha khai thông các đường kinh dương trên da đầu, kích thích tuần hoàn não bộ.',
        productsUsed: 'Không',
        toolsUsed: 'Lược Guasha ngọc / sừng'
      },
      {
        id: 'g120-step-5',
        stepNumber: 5,
        title: 'Massa mặt',
        durationMinutes: 12,
        description: 'Massage bấm huyệt nâng cơ mặt chuyên sâu, giúp thon gọn và thư thái cơ mặt.',
        productsUsed: 'Tinh dầu massage mặt',
        toolsUsed: 'Thao tác tay bấm huyệt mặt'
      },
      {
        id: 'g120-step-6',
        stepNumber: 6,
        title: 'Rửa mắt',
        durationMinutes: 6,
        description: 'Vệ sinh nhẹ nhàng làm sạch vùng mí mắt và kết hợp rửa mặt làm sạch sâu bụi bẩn.',
        productsUsed: 'Dung dịch rửa mắt thảo dược & Sữa rửa mặt',
        toolsUsed: 'Bông tiệt trùng & Nước ấm'
      },
      {
        id: 'g120-step-7',
        stepNumber: 7,
        title: 'Đắp mặt nạ',
        durationMinutes: 15,
        description: 'Đắp mặt nạ dưỡng chất chuyên sâu cấp ẩm, làm sáng da và săn chắc màng biểu bì.',
        productsUsed: 'Mặt nạ phục hồi Collagen',
        toolsUsed: 'Cọ quét tiệt trùng'
      },
      {
        id: 'g120-step-8',
        stepNumber: 8,
        title: 'Tẩy tế bào chết + xông hơi',
        durationMinutes: 10,
        description: 'Thoa gel tẩy tế bào chết da đầu chuyên dụng kết hợp xông hơi nóng giúp mở nang tóc và thanh lọc bã nhờn tích tụ.',
        productsUsed: 'Gel tẩy TBC da đầu sinh học',
        toolsUsed: 'Máy xông hơi da đầu nóng ấm'
      },
      {
        id: 'g120-step-9',
        stepNumber: 9,
        title: 'Gội lần 1',
        durationMinutes: 8,
        description: 'Gội sạch sâu bằng nước thảo mộc bồ kết cô đặc loại bỏ sạch gàu và bã nhờn vừa tẩy.',
        productsUsed: 'Dầu gội thảo mộc bồ kết',
        toolsUsed: 'Bồn gội dưỡng sinh'
      },
      {
        id: 'g120-step-10',
        stepNumber: 10,
        title: 'Gội lần 2',
        durationMinutes: 10,
        description: 'Gội lần 2 kết hợp vuốt miết, gãi cào thư giãn bấm huyệt vùng thái dương và chẩm gáy.',
        productsUsed: 'Dầu gội thảo dược cô đặc',
        toolsUsed: 'Thao tác tay gội dưỡng sinh'
      },
      {
        id: 'g120-step-11',
        stepNumber: 11,
        title: 'Hấp tóc ( massa tay)',
        durationMinutes: 15,
        description: 'Thoa kem ủ hấp collagen phục hồi lõi tóc, chụp nón ủ hấp nano; đồng thời kỹ thuật viên massage bấm huyệt toàn bộ hai cánh tay và bàn tay cho khách.',
        productsUsed: 'Kem ủ hấp Collagen tươi & Tinh dầu dưỡng tay',
        toolsUsed: 'Nón ủ hấp nano & Khăn ấm'
      },
      {
        id: 'g120-step-12',
        stepNumber: 12,
        title: 'Bóp vai khố',
        durationMinutes: 5,
        description: 'Khách ngồi dậy, kỹ thuật viên xoa bóp vai cổ gáy khô, ấn huyệt Kiên Tỉnh giải tỏa ê ẩm.',
        productsUsed: 'Không',
        toolsUsed: 'Thao tác tay ấn huyệt vai gáy'
      },
      {
        id: 'g120-step-13',
        stepNumber: 13,
        title: 'Sấy khô',
        durationMinutes: 5,
        description: 'Sấy khô tóc bằng chế độ gió ấm mát, tạo kiểu bồng bềnh và vuốt tinh dầu argan bóng tóc.',
        productsUsed: 'Tinh dầu Argan bóng mượt tóc',
        toolsUsed: 'Máy sấy ion chuyên dụng'
      },
      {
        id: 'g120-step-14',
        stepNumber: 14,
        title: 'Dùng nước đậu đen + mứt gừng',
        durationMinutes: 3,
        description: 'Thưởng thức ly nước đậu đen rang ấm thơm bồi bổ thận khí cùng mứt gừng cay ngọt thanh nhã.',
        productsUsed: 'Nước đậu đen rang ấm nóng & Mứt gừng',
        toolsUsed: 'Bộ ly trà dưỡng sinh & Đĩa mứt'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-09',
        name: 'Dầu gội bồ kết cô đặc',
        unit: 'ml',
        quantityUsed: 50,
        costPerUnit: 90,
        totalCost: 4500
      },
      {
        inventoryItemId: 'inv-10',
        name: 'Dầu xả & Kem hấp Collagen',
        unit: 'ml',
        quantityUsed: 40,
        costPerUnit: 96,
        totalCost: 3840
      },
      {
        inventoryItemId: 'inv-03',
        name: 'Sữa rửa mặt sinh học',
        unit: 'ml',
        quantityUsed: 5,
        costPerUnit: 1100,
        totalCost: 5500
      },
      {
        inventoryItemId: 'inv-07',
        name: 'Mặt nạ phục hồi Collagen',
        unit: 'miếng',
        quantityUsed: 1,
        costPerUnit: 20000,
        totalCost: 20000
      }
    ]
  },

  // 6/ MASSA BODY 60
  {
    id: 'srv-body-60',
    code: 'MB-60',
    shortName: 'Massage Body 60 Phút',
    name: 'Massa body 60',
    category: 'Massage trị liệu body & foot',
    durationMinutes: 60,
    price: 300000,
    description: 'Liệu trình massage body thư giãn toàn thân 60 phút: Khởi động ấn huyệt toàn thân, massage lưng vai gáy eo với tinh dầu ấm, massage hai chân sau, massage hai chân trước & tay, bóp vai đầu khô.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 65000,
    otherOverheads: 25000,
    totalCalculatedCost: 125000,
    grossProfit: 175000,
    profitMarginPercent: 58.3,
    targetSkinType: 'Khách hàng nhức mỏi cơ thể, đau cơ bắp lưng vai gáy do ngồi nhiều, stress áp lực công việc.',
    benefitsSummary: 'Làm ấm gân cốt, giải phóng các điểm co cứng cơ lưng và vai gáy, kích thích lưu thông tuần hoàn máu, hồi phục năng lượng thể chất.',
    contraindications: 'Phụ nữ mang thai dưới 3 tháng, người đang sốt cao hoặc có vết thương bầm tím sưng tấy hở.',
    homeCareNotes: 'Giữ ấm cơ thể sau khi massage, uống nhiều nước ấm, không tắm nước lạnh ngay trong 2 giờ đầu.',
    preparationSteps: [
      'Chuẩn bị phòng massage ấm áp 26°C, thắp đèn xông tinh dầu sả chanh dịu nhẹ.',
      'Làm ấm tinh dầu thảo mộc massage body.',
      'Khăn trải giường sạch vô trùng và khăn phủ ấm.'
    ],
    steps: [
      {
        id: 'b60-step-1',
        stepNumber: 1,
        title: 'Khởi động & ấn huyệt toàn thân',
        durationMinutes: 6,
        description: 'Khách nằm sấp, kỹ thuật viên ấn huyệt qua khăn từ thắt lưng xuống chân để làm mềm và giãn cơ.',
        productsUsed: 'Không',
        toolsUsed: 'Khăn phủ ấm & Thao tác bấm huyệt'
      },
      {
        id: 'b60-step-2',
        stepNumber: 2,
        title: 'Massage tinh dầu lưng, vai gáy & thắt lưng',
        durationMinutes: 24,
        description: 'Thoa tinh dầu thảo mộc ấm, vuốt miết và bấm huyệt chuyên sâu dọc cột sống, bả vai và thắt lưng.',
        productsUsed: 'Tinh dầu thảo mộc ấm',
        toolsUsed: 'Kỹ thuật massage Thụy Điển & Bấm huyệt Đông Y'
      },
      {
        id: 'b60-step-3',
        stepNumber: 3,
        title: 'Massage mặt sau hai chân',
        durationMinutes: 12,
        description: 'Xoa bóp, miết cơ bắp chuối, đùi sau và bấm huyệt bàn chân giúp giải mỏi chi dưới.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Thao tác tay miết sâu'
      },
      {
        id: 'b60-step-4',
        stepNumber: 4,
        title: 'Massage chân trước & hai cánh tay',
        durationMinutes: 12,
        description: 'Khách nằm ngửa, xoa bóp bấm huyệt hai cánh tay, bàn tay và mặt trước cẳng chân.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Thao tác tay vuốt giãn cơ'
      },
      {
        id: 'b60-step-5',
        stepNumber: 5,
        title: 'Bóp vai gáy & ấn huyệt đầu khô',
        durationMinutes: 6,
        description: 'Massage thư giãn vai cổ gáy và ấn huyệt vùng đầu khô giúp tinh thần sảng khoái, tỉnh táo.',
        productsUsed: 'Khăn ấm lau tinh dầu',
        toolsUsed: 'Thao tác tay bóp vai đầu khô'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-11',
        name: 'Tinh dầu massage thảo mộc',
        unit: 'ml',
        quantityUsed: 35,
        costPerUnit: 320,
        totalCost: 11200
      }
    ]
  },

  // 7/ MASSA BODY 90
  {
    id: 'srv-body-90',
    code: 'MB-90',
    shortName: 'Massage Body 90 Phút',
    name: 'Massa body 90',
    category: 'Massage trị liệu body & foot',
    durationMinutes: 90,
    price: 420000,
    description: 'Liệu pháp massage body kết hợp đá nóng Bazan tự nhiên 90 phút: Ngâm chân thảo dược, massage tinh dầu ấm chuyên sâu, đi đá nóng đả thông kinh lạc, massage chân sâu, massage tay ngực, bóp vai đầu khô.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 85000,
    otherOverheads: 27000,
    totalCalculatedCost: 160000,
    grossProfit: 260000,
    profitMarginPercent: 61.9,
    targetSkinType: 'Người đau mỏi mãn tính cột sống, thoái hóa khớp nhẹ, trúng gió nhiễm lạnh, mệt mỏi suy nhược cơ thể.',
    benefitsSummary: 'Nhiệt năng từ đá núi lửa Bazan thẩm thấu sâu làm mềm các bó cơ xơ cứng, trục xuất hàn khí, tăng cường lưu thông oxy và xua tan mệt mỏi toàn diện.',
    contraindications: 'Không dùng đá nóng cho người bị huyết áp quá cao chưa ổn định hoặc phụ nữ mang thai.',
    homeCareNotes: 'Uống trà thảo mộc ấm, giữ ấm lưng ngực, không tắm đêm.',
    preparationSteps: [
      'Chuẩn bị 16 viên đá nóng Bazan giữ nhiệt ở 50°C trong nồi hấp đá.',
      'Pha chậu ngâm chân thảo mộc muối khoáng nước ấm 42°C.',
      'Làm ấm tinh dầu gừng trị liệu.'
    ],
    steps: [
      {
        id: 'b90-step-1',
        stepNumber: 1,
        title: 'Ngâm chân thảo mộc & khởi động toàn thân',
        durationMinutes: 8,
        description: 'Ngâm chân thảo dược muối ấm giải độc cơ thể, lau khô chân và khởi động ấn huyệt toàn thân qua khăn.',
        productsUsed: 'Muối khoáng & thảo mộc ngâm chân',
        toolsUsed: 'Bồn gỗ ngâm chân & Khăn phủ ấm'
      },
      {
        id: 'b90-step-2',
        stepNumber: 2,
        title: 'Massage tinh dầu ấm vùng lưng & vai gáy',
        durationMinutes: 25,
        description: 'Thoa tinh dầu thảo mộc ấm, miết sâu các cơ thang, cơ lưng rộng và ấn huyệt dọc hai đường kinh bàng quang.',
        productsUsed: 'Tinh dầu gừng thảo mộc trị liệu',
        toolsUsed: 'Thao tác tay ấn huyệt sâu'
      },
      {
        id: 'b90-step-3',
        stepNumber: 3,
        title: 'Đi đá nóng Bazan tự nhiên & xếp đá luân xa',
        durationMinutes: 20,
        description: 'Trượt các viên đá nóng Bazan dọc sống lưng làm ấm kinh mạch, sau đó đặt đá giữ nhiệt tại các huyệt đạo trọng yếu.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Bộ đá nóng Bazan tự nhiên 50°C'
      },
      {
        id: 'b90-step-4',
        stepNumber: 4,
        title: 'Massage chuyên sâu mặt sau hai chân',
        durationMinutes: 15,
        description: 'Vuốt miết đùi sau, bắp chuối kết hợp đi đá nóng lòng bàn chân giúp kích hoạt huyệt Dũng Tuyền.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Đá nóng bàn chân & tay'
      },
      {
        id: 'b90-step-5',
        stepNumber: 5,
        title: 'Massage tay, ngực & mặt trước chân',
        durationMinutes: 14,
        description: 'Khách nằm ngửa, massage thư giãn hai cánh tay, bàn tay, ngực và mặt trước hai chân với đá ấm.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Đá nóng dẹp & Thao tác tay'
      },
      {
        id: 'b90-step-6',
        stepNumber: 6,
        title: 'Bóp vai gáy & massage bấm huyệt đầu thư thái',
        durationMinutes: 8,
        description: 'Lau sạch tinh dầu bằng khăn ấm thơm thảo dược, xoa bóp ấn huyệt vai cổ gáy và đầu giúp thư thái tinh thần.',
        productsUsed: 'Khăn nóng thơm thảo dược',
        toolsUsed: 'Khăn nóng lớn & Thao tác bóp vai đầu'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-11',
        name: 'Tinh dầu massage thảo mộc trị liệu',
        unit: 'ml',
        quantityUsed: 45,
        costPerUnit: 320,
        totalCost: 14400
      }
    ]
  },

  // 8/ MASSA FOOT 60
  {
    id: 'srv-foot-60',
    code: 'MF-60',
    shortName: 'Massage Foot 60 Phút',
    name: 'Massa foot 60',
    category: 'Massage trị liệu body & foot',
    durationMinutes: 60,
    price: 220000,
    description: 'Liệu trình massage chân thư giãn 60 phút: Ngâm chân bồn gỗ thảo dược ấm, làm sạch chân, bấm huyệt phản xạ lòng bàn chân, massage cẳng chân bắp chuối, chườm khăn ấm & thoa dưỡng thể.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 45000,
    otherOverheads: 18000,
    totalCalculatedCost: 85000,
    grossProfit: 135000,
    profitMarginPercent: 61.4,
    targetSkinType: 'Người di chuyển đi lại nhiều, đứng lâu mỏi chân, phụ nữ hay đi giày cao gót, người lớn tuổi lạnh chân tê bì.',
    benefitsSummary: 'Kích hoạt hơn 60 huyệt đạo phản xạ nội tạng dưới lòng bàn chân, giảm phù nề cẳng chân, kích thích lưu thông máu về tim và ngủ ngon hơn.',
    contraindications: 'Người bị viêm tắc tĩnh mạch chi dưới cấp tính hoặc có vết loét ở bàn chân.',
    homeCareNotes: 'Ngâm chân nước ấm trước khi đi ngủ, giữ ấm chân khi nằm phòng máy lạnh.',
    preparationSteps: [
      'Chuẩn bị chậu ngâm chân nước ấm thảo mộc 42°C chứa sả, gừng và muối biển.',
      'Chuẩn bị cây bấm huyệt gỗ và kem massage chân chuyên dụng.',
      'Khăn ủ ấm chân sạch.'
    ],
    steps: [
      {
        id: 'f60-step-1',
        stepNumber: 1,
        title: 'Ngâm chân thảo mộc ấm & làm sạch chân',
        durationMinutes: 10,
        description: 'Ngâm chân bồn gỗ thảo dược sả gừng nước ấm khử mùi hôi, sát khuẩn và làm mềm biểu bì gót chân.',
        productsUsed: 'Thảo mộc ngâm chân & Muối khoáng',
        toolsUsed: 'Chậu ngâm chân gỗ & Khăn lau chân'
      },
      {
        id: 'f60-step-2',
        stepNumber: 2,
        title: 'Thoa kem dưỡng & làm mềm cơ bàn chân',
        durationMinutes: 5,
        description: 'Thoa kem massage thảo mộc, xoa vuốt làm nóng và mềm cơ toàn bộ bàn chân.',
        productsUsed: 'Kem massage chân thảo mộc',
        toolsUsed: 'Thao tác tay xoa vuốt'
      },
      {
        id: 'f60-step-3',
        stepNumber: 3,
        title: 'Bấm huyệt phản xạ các huyệt đạo lòng bàn chân',
        durationMinutes: 20,
        description: 'Dùng ngón tay và cây bấm huyệt ấn chuẩn xác các vùng phản xạ: tim, thận, dạ dày, phổi và huyệt Dũng Tuyền giải tỏa độc tố.',
        productsUsed: 'Kem dưỡng chân',
        toolsUsed: 'Cây bấm huyệt gỗ & Ngón tay cái kỹ thuật viên'
      },
      {
        id: 'f60-step-4',
        stepNumber: 4,
        title: 'Massage cẳng chân & bắp chuối giảm căng cơ',
        durationMinutes: 15,
        description: 'Vuốt miết sâu các đường gân từ mắt cá chân lên bắp chuối và khớp gối, làm tan nhức mỏi tê bì.',
        productsUsed: 'Kem massage chân',
        toolsUsed: 'Thao tác tay miết cơ bắp'
      },
      {
        id: 'f60-step-5',
        stepNumber: 5,
        title: 'Chườm khăn ấm làm sạch & ấn huyệt vai cổ nhẹ',
        durationMinutes: 10,
        description: 'Quấn khăn nóng ủ ấm hai chân làm sạch kem dưỡng, đồng thời xoa bóp ấn huyệt vai cổ nhẹ nhàng thư giãn.',
        productsUsed: 'Khăn nóng thơm thảo mộc',
        toolsUsed: 'Khăn nóng ấm & Thao tác bóp vai nhẹ'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-11',
        name: 'Kem dưỡng & tinh dầu chân',
        unit: 'ml',
        quantityUsed: 20,
        costPerUnit: 320,
        totalCost: 6400
      }
    ]
  },

  // 9/ MASSA FOOT 90
  {
    id: 'srv-foot-90',
    code: 'MF-90',
    shortName: 'Massage Foot 90 Phút',
    name: 'Massa foot 90',
    category: 'Massage trị liệu body & foot',
    durationMinutes: 90,
    price: 320000,
    description: 'Liệu trình massage chân chuyên sâu kết hợp đá nóng Bazan 90 phút: Ngâm chân bồn gỗ thảo dược & tẩy da chết gót chân, bấm huyệt chuyên sâu, massage cẳng chân & đùi, đi đá nóng bàn chân bắp chân, massage vai gáy tay, đắp khăn ấm.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    technicianCommission: 70000,
    otherOverheads: 20000,
    totalCalculatedCost: 135000,
    grossProfit: 185000,
    profitMarginPercent: 57.8,
    targetSkinType: 'Người đau nhức khớp bàn chân, viêm cân gan chân, tê bì chi dưới, mất ngủ và đau mỏi vai gáy đồng thời.',
    benefitsSummary: 'Khai thông toàn bộ hệ kinh lạc phản xạ bàn chân, tẩy sạch da chết gót chân hồng hào, nhiệt lượng đá nóng giải tỏa tức thì cảm giác nặng nề ở đôi chân.',
    contraindications: 'Người bị vết thương hở sâu tại bàn chân hoặc đang sốt cao.',
    homeCareNotes: 'Giữ ấm chân, uống nhiều nước ấm, thường xuyên ngâm chân thảo mộc tại nhà.',
    preparationSteps: [
      'Pha chậu ngâm chân bồn gỗ thảo mộc hoàng cung ấm 43°C & muối tẩy da chết gót chân.',
      'Bộ 8 viên đá nóng nhỏ cho kẽ ngón và lòng bàn chân.',
      'Khăn ấm thảo dược to và kem massage chuyên sâu.'
    ],
    steps: [
      {
        id: 'f90-step-1',
        stepNumber: 1,
        title: 'Ngâm chân bồn gỗ thảo dược & tẩy da chết gót chân',
        durationMinutes: 12,
        description: 'Ngâm chân thảo dược hoàng cung khử khuẩn, tẩy tế bào chết gót chân làm mềm mại vùng da chai sần.',
        productsUsed: 'Thảo mộc hoàng cung & Muối tẩy da chết chân',
        toolsUsed: 'Chậu gỗ ngâm chân & Bàn chải chà gót'
      },
      {
        id: 'f90-step-2',
        stepNumber: 2,
        title: 'Bấm huyệt phản xạ chuyên sâu trị liệu lòng bàn chân',
        durationMinutes: 25,
        description: 'Ấn huyệt tỉ mỉ từng điểm phản xạ cơ quan nội tạng, giải tỏa độc tố và cân bằng âm dương.',
        productsUsed: 'Kem massage thảo mộc',
        toolsUsed: 'Cây bấm huyệt gỗ & Ngón tay'
      },
      {
        id: 'f90-step-3',
        stepNumber: 3,
        title: 'Massage cẳng chân, bắp chuối & đùi',
        durationMinutes: 18,
        description: 'Massage miết sâu các nhóm cơ từ bàn chân lên đến khớp gối và cơ đùi giúp giải tỏa cảm giác nặng nề ở chi dưới.',
        productsUsed: 'Tinh dầu thảo mộc dưỡng chân',
        toolsUsed: 'Thao tác tay chuyên sâu'
      },
      {
        id: 'f90-step-4',
        stepNumber: 4,
        title: 'Đi đá nóng Bazan bàn chân & bắp chân',
        durationMinutes: 18,
        description: 'Kẹp đá nóng ấm giữa các kẽ ngón chân và lướt đá nóng dọc theo bắp chân giúp giãn nở mạch máu và giảm nhức mỏi.',
        productsUsed: 'Tinh dầu thảo mộc',
        toolsUsed: 'Bộ 8 viên đá nóng Bazan 48°C'
      },
      {
        id: 'f90-step-5',
        stepNumber: 5,
        title: 'Kết hợp xoa bóp bấm huyệt vai cổ gáy & cánh tay',
        durationMinutes: 12,
        description: 'Trong khi hai chân được ủ ấm trong khăn thảo dược, kỹ thuật viên tiến hành massage bấm huyệt vai gáy và hai tay cho khách.',
        productsUsed: 'Không',
        toolsUsed: 'Thao tác tay bóp vai gáy cánh tay'
      },
      {
        id: 'f90-step-6',
        stepNumber: 6,
        title: 'Đắp khăn thảo dược ấm & thoa kem dưỡng gót chân',
        durationMinutes: 5,
        description: 'Lau sạch chân bằng khăn nóng thơm thảo dược và thoa kem làm mềm gót chân hồng hào.',
        productsUsed: 'Khăn nóng thảo mộc & Kem dưỡng gót chân',
        toolsUsed: 'Khăn nóng & Thao tác vỗ nhẹ'
      }
    ],
    costItems: [
      {
        inventoryItemId: 'inv-11',
        name: 'Tinh dầu massage & kem gót chân',
        unit: 'ml',
        quantityUsed: 25,
        costPerUnit: 320,
        totalCost: 8000
      }
    ]
  }
];
