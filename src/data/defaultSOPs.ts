import { ServiceStep } from '../types';

export interface ServiceSOPData {
  benefitsSummary: string;
  targetSkinType: string;
  preparationSteps: string[];
  steps: ServiceStep[];
  contraindications: string;
  homeCareNotes: string;
}

export const DETOX_60M_SOP: ServiceSOPData = {
  benefitsSummary:
    'Giúp loại bỏ các gốc tự do & độc tố, làm sạch sâu bề mặt da, mang lại làn da săn chắc & tăng khả năng hấp thụ dưỡng chất. Công thức dưỡng chất dạng gel sinh học mang lại làn da tươi trẻ, rạng rỡ.',
  targetSkinType: 'Chiết xuất tự nhiên dịu nhẹ, phù hợp với mọi loại da (da dầu, da hỗn hợp, da mệt mỏi xỉn màu).',
  preparationSteps: [
    'Sát khuẩn tay kỹ thuật viên & kiểm tra bộ dụng cụ tiệt trùng 1 lần.',
    'Bật máy xông hơi mặt trước 3-5 phút (nhiệt độ xông tiêu chuẩn 40°C).',
    'Chuẩn bị 2 viên đá nóng Spa giữ nhiệt ở 45°C & khăn bông ấm 42°C.',
    'Chuẩn bị bộ kem Detox DBH, bọt rửa mặt & mặt nạ Cooling.'
  ],
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Tẩy trang',
      durationMinutes: 3,
      description: 'Dùng nước tẩy trang dịu nhẹ lau sạch lớp trang điểm, kem chống nắng và bụi bẩn bề mặt quanh mắt, môi và toàn bộ da mặt.',
      productsUsed: 'Nước tẩy trang dịu nhẹ / Micellar Water',
      toolsUsed: 'Bông tẩy trang tiệt trùng',
      notes: 'Thao tác từ trong ra ngoài, từ dưới lên trên. Không chà xát mạnh.'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Sữa rửa mặt (kết hợp vs xông hơi)',
      durationMinutes: 5,
      description: 'Tạo bọt sữa rửa mặt chuyên dụng, massage xoay tròn nhẹ nhàng toàn mặt kết hợp mở máy xông hơi nóng ở khoảng cách 25cm giúp mở lỗ chân lông.',
      productsUsed: 'Sữa rửa mặt tạo bọt sinh học DBH',
      toolsUsed: 'Máy xông hơi nóng 40°C',
      notes: 'Tránh xông quá gần mặt khách. Lau lại sạch bằng bọt biển ấm.'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Tẩy tế bào chết',
      durationMinutes: 4,
      description: 'Thoa gel tẩy tế bào chết dạng enzym thực vật, massage nhẹ nhàng vùng chữ T và hai bên má để loại bỏ lớp sừng già tích tụ.',
      productsUsed: 'Gel tẩy tế bào chết Enzym thực vật',
      toolsUsed: 'Bọt biển bọt tuyết tiệt trùng',
      notes: 'Nên thao tác nhẹ tay khu vực da mỏng quanh mắt.'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Hút dầu nhờn & mụn cám',
      durationMinutes: 5,
      description: 'Sử dụng đầu hút mụn chân không đi nhẹ nhàng vùng mũi, cằm và trán để làm sạch sợi bã nhờn và mụn cám.',
      productsUsed: 'Nước hoa hồng cân bằng pH',
      toolsUsed: 'Máy hút mụn chân không & Khăn ấm',
      notes: 'Di chuyển đầu hút liên tục, không giữ cố định 1 chỗ quá 2 giây tránh thâm tím da.'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Massage kem detox DBH = đá nóng (lau lại vs khăn nóng)',
      durationMinutes: 15,
      description: 'Thoa đều kem Detox sinh học DBH lên mặt. Dùng 2 viên đá nóng basalt di chuyển theo đường kinh lạc nâng cơ từ cằm lên thái dương, sau đó lau sạch bằng khăn nóng 42°C.',
      productsUsed: 'Kem Detox sinh học DBH',
      toolsUsed: '2 viên đá nóng Basalt 45°C & Khăn nóng ấm',
      notes: 'Kiểm tra nhiệt độ đá nóng trên cổ tay trước khi chạm vào mặt khách.'
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Đắp mặt nạ cooling',
      durationMinutes: 15,
      description: 'Pha và thoa đều mặt nạ Cooling làm dịu mát da toàn bộ khuôn mặt, giúp se khít lỗ chân lông và khóa dưỡng chất detox vừa thẩm thấu.',
      productsUsed: 'Mặt nạ Cooling dẻo làm dịu mát da',
      toolsUsed: 'Cọ thoa mặt nạ & Bát trộn tiệt trùng',
      notes: 'Để mặt nạ thư giãn trong 15 phút. Có thể phủ gạc ẩm lên mắt khách.'
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'Massage đầu vai cổ = đá nóng',
      durationMinutes: 10,
      description: 'Trong lúc chờ mặt nạ khô, thực hiện massage bấm huyệt vùng đầu, ấn huyệt vai cổ gáy kết hợp đá nóng giúp giải tỏa căng thẳng và lưu thông khí huyết.',
      productsUsed: 'Tinh dầu thảo mộc dưỡng thể',
      toolsUsed: 'Đá nóng vai cổ gáy',
      notes: 'Ấn huyệt Phong Trì, Kiên Tỉnh với lực vừa phải theo yêu cầu của khách.'
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: 'Xịt khoáng',
      durationMinutes: 1,
      description: 'Sau khi gỡ mặt nạ và lau sạch, phun sương xịt khoáng khoáng chất tự nhiên để cấp ẩm tức thì và cân bằng pH cho da.',
      productsUsed: 'Xịt khoáng khoáng chất dịu nhẹ',
      toolsUsed: 'Máy phun sương nano / Chai xịt phun sương',
      notes: 'Xịt cách mặt khách khoảng 20cm.'
    },
    {
      id: 'step-9',
      stepNumber: 9,
      title: 'Kem dưỡng + kem chống nắng',
      durationMinutes: 2,
      description: 'Thoa một lớp kem dưỡng ẩm mỏng nhẹ, sau đó thoa kem chống nắng vật lý SPF 50+ vỗ nhẹ để bảo vệ làn da tươi mới.',
      productsUsed: 'Kem dưỡng ẩm phục hồi DBH & Kem chống nắng SPF 50+',
      toolsUsed: 'Găng tay y tế / Tay sát khuẩn sạch',
      notes: 'Vỗ nhẹ cho kem thẩm thấu đều, không miết mạnh.'
    },
    {
      id: 'step-10',
      stepNumber: 10,
      title: 'Dặn dò',
      durationMinutes: 2,
      description: 'Mời khách ngồi dậy, mời trà thảo mộc ấm. Hướng dẫn dặn dò khách chăm sóc da tại nhà, tránh nắng và uống đủ 2 lít nước.',
      productsUsed: 'Trà thảo mộc dưỡng nhan',
      toolsUsed: 'Tách trà ấm & Phiếu dặn dò chăm sóc',
      notes: 'Dặn khách không rửa mặt bằng nước quá nóng trong 24 giờ đầu.'
    }
  ],
  contraindications: 'Không dùng cho da đang có vết thương hở lớn, da vừa thực hiện xâm lấn laser/vi kim trong vòng 48 giờ.',
  homeCareNotes: 'Uống nhiều nước sau khi detox để hỗ trợ đào thải độc tố. Thoa kem chống nắng mỗi sáng và dưỡng ẩm đều đặn.'
};

export const ACNE_TREATMENT_SOP: ServiceSOPData = {
  benefitsSummary:
    'Phác đồ điều trị mụn y khoa chuẩn 12 bước: Lấy sạch nhân mụn chuẩn y khoa, diệt khuẩn P.Acnes bằng điện tím & ánh sáng sinh học Blue Light, ngăn ngừa thâm sẹo.',
  targetSkinType: 'Da bị mụn ẩn, mụn viêm, mụn cám, mụn đầu đen, da nhiều bã nhờn.',
  preparationSteps: [
    'Tiệt trùng tay & đeo găng tay y tế sử dụng 1 lần.',
    'Chuẩn bị bộ lấy mụn y khoa (kim tạo đường dẫn, cây nặn mụn tiệt trùng 100%).',
    'Chuẩn bị máy điện tím & máy chiếu đèn sinh học Omega Light.',
    'Dung dịch Povidine sát khuẩn & gạc y tế.'
  ],
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Tẩy trang y khoa',
      durationMinutes: 3,
      description: 'Tẩy sạch bụi bẩn và dầu thừa bằng dung dịch tẩy trang không chứa cồn.',
      productsUsed: 'Nước tẩy trang Y Khoa Dermato',
      toolsUsed: 'Bông tiệt trùng'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Rửa mặt kiềm dầu',
      durationMinutes: 3,
      description: 'Rửa mặt làm sạch sâu bã nhờn bằng sữa rửa mặt BHA/Tràm trà dịu nhẹ.',
      productsUsed: 'Sữa rửa mặt BHA Tea Tree',
      toolsUsed: 'Bọt biển y tế'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Tẩy tế bào chết BHA nhẹ',
      durationMinutes: 3,
      description: 'Tẩy sừng nhẹ làm thông thoáng cổ bọt lông.',
      productsUsed: 'Gel tẩy sừng dịu nhẹ',
      toolsUsed: 'Bông gòn'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Xông hơi mền cồi mụn & Hút bã nhờn',
      durationMinutes: 5,
      description: 'Xông hơi nóng kết hợp ấn dung dịch ủ mụn giúp cồi mụn mềm và dễ lấy.',
      productsUsed: 'Dung dịch ủ mụn cám',
      toolsUsed: 'Máy xông hơi & Máy hút mụn'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Sát khuẩn da mặt lần 1',
      durationMinutes: 2,
      description: 'Lau sát khuẩn bề mặt da bằng Povidine/Povidone Iodine pha loãng và nước muối sinh lý.',
      productsUsed: 'Povidine 10% + Nước muối sinh lý',
      toolsUsed: 'Gạc y tế tiệt trùng'
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Lấy nhân mụn chuẩn y khoa',
      durationMinutes: 20,
      description: 'Dùng kim y khoa mở đầu mụn và dùng cây nặn mụn/gạc đè lấy sạch gốc cồi mụn già mà không làm dập nát mô da.',
      productsUsed: 'Nước muối sinh lý 0.9%',
      toolsUsed: 'Kim tạo đường dẫn 30G & Cây lấy mụn y khoa',
      notes: 'Tuyệt đối không cố lấy mụn viêm nang quá sâu chưa chín.'
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: 'Sát khuẩn Povidine lần 2 & Lau sạch',
      durationMinutes: 2,
      description: 'Sát khuẩn lại tổn thương sau khi lấy nhân mụn để tránh nhiễm trùng lây lan.',
      productsUsed: 'Povidine + Nước muối sinh lý',
      toolsUsed: 'Gạc tiệt trùng'
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: 'Di điện tím diệt khuẩn P.Acnes',
      durationMinutes: 5,
      description: 'Dùng đầu nấm điện tím di chuyển khắp mặt để làm khô cồi mụn, diệt vi khuẩn anaerobic.',
      productsUsed: 'Serum kháng viêm tràm trà',
      toolsUsed: 'Máy điện tím High Frequency'
    },
    {
      id: 'step-9',
      stepNumber: 9,
      title: 'Thoa tinh chất kháng viêm mụn',
      durationMinutes: 2,
      description: 'Thoa serum trị mụn kiềm dầu, giảm sưng đỏ tức thì.',
      productsUsed: 'Serum Trị Mụn BHA + Zinc PCA',
      toolsUsed: 'Cọ tiệt trùng'
    },
    {
      id: 'step-10',
      stepNumber: 10,
      title: 'Đắp mặt nạ tràm trà giảm sưng',
      durationMinutes: 15,
      description: 'Đắp mặt nạ làm dịu da gạc lạnh kiềm dầu tràm trà giúp giảm sưng và se khít vết lấy mụn.',
      productsUsed: 'Mặt nạ tràm trà giảm sưng mụn',
      toolsUsed: 'Bát & cọ'
    },
    {
      id: 'step-11',
      stepNumber: 11,
      title: 'Chiếu đèn sinh học Blue Light 415nm',
      durationMinutes: 10,
      description: 'Chiếu ánh sáng xanh lục diệt khuẩn và điều hòa tuyến bã nhờn.',
      productsUsed: 'Kính bảo vệ mắt',
      toolsUsed: 'Vòm đèn Omega Light Blue'
    },
    {
      id: 'step-12',
      stepNumber: 12,
      title: 'Dặn dò hướng dẫn chăm sóc y khoa tại nhà',
      durationMinutes: 3,
      description: 'Hướng dẫn khách rửa mặt bằng nước muối sinh lý 24h đầu, thoa chấm mụn và kiêng ăn đồ cay nóng.',
      productsUsed: 'Tờ dặn dò trị mụn',
      toolsUsed: 'Phiếu chăm sóc'
    }
  ],
  contraindications: 'Không áp dụng cho người đang dùng Isotretinoin liều cao trong 3 tháng gần nhất.',
  homeCareNotes: 'Giữ vệ sinh vỏ gối, không tự ý sờ tay lên mặt. Rửa mặt nước muối sinh lý trong 24h đầu.'
};

export const MASSAGE_BODY_SOP: ServiceSOPData = {
  benefitsSummary:
    'Liệu pháp massage đá nóng basalt kết hợp tinh dầu gừng ấm, giúp thư giãn cơ sâu, giảm đau nhức cổ vai gáy & lưu thông khí huyết toàn thân.',
  targetSkinType: 'Phù hợp cho người làm việc văn phòng, đau mỏi cơ, căng thẳng mất ngủ.',
  preparationSteps: [
    'Ấm đá nóng basalt ở nhiệt độ 50°C trong nồi hấp đá chuyên dụng.',
    'Bật nhạc tần số chữa lành 432Hz & đốt tinh dầu sả chanh thư giãn.',
    'Chuẩn bị 2 ga khăn trải giường sạch tiệt trùng & tinh dầu gừng ấm.'
  ],
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Ấn huyệt khởi động thư giãn',
      durationMinutes: 10,
      description: 'Khách nằm sấp. Phủ khăn bông mỏng, kỹ thuật viên thực hiện ấn huyệt toàn thân dọc sống lưng và bắp chân.',
      productsUsed: 'Tinh dầu thơm',
      toolsUsed: 'Khăn phủ trải'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Thoa tinh dầu gừng & Massage lưng',
      durationMinutes: 15,
      description: 'Thoa tinh dầu gừng ấm lên lưng, miết dọc cơ sống lưng và giải xơ cơ vùng vai gáy.',
      productsUsed: 'Tinh dầu gừng trị liệu',
      toolsUsed: 'Khăn lau ấm'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Đi đá nóng vùng lưng & Đặt đá dọc sống lưng',
      durationMinutes: 15,
      description: 'Dùng cặp đá nóng trượt dọc thanh cơ lưng, xoay tròn vùng thắt lưng. Xếp 6 viên đá nóng dọc đường kinh lạc sống lưng.',
      productsUsed: 'Tinh dầu gừng',
      toolsUsed: '6 viên đá nóng Basalt 50°C'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Massage đá nóng chân & bắp đùi',
      durationMinutes: 15,
      description: 'Massage miết dọc cơ đùi sau, bắp chân kết hợp đi đá nóng vuốt đẩy nhịp nhàng.',
      productsUsed: 'Tinh dầu gừng',
      toolsUsed: '2 viên đá nóng'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Nằm ngửa massage tay & đầu vai cổ',
      durationMinutes: 15,
      description: 'Khách nằm ngửa. Massage ấn huyệt hai tay, vai cổ gáy và ấn huyệt Thái Dương.',
      productsUsed: 'Tinh dầu dưỡng',
      toolsUsed: 'Khăn chườm mắt'
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Lau sạch tinh dầu bằng khăn ấm & Dặn dò',
      durationMinutes: 5,
      description: 'Dùng khăn ấm 45°C lau sạch tinh dầu thừa trên cơ thể. Mời khách ngồi dậy và dùng trà gừng ấm.',
      productsUsed: 'Trà gừng mật ong ấm',
      toolsUsed: 'Khăn ấm to'
    }
  ],
  contraindications: 'Không massage đá nóng cho phụ nữ mang thai dưới 3 tháng, người đang sốt cao hoặc có vết thương hở.',
  homeCareNotes: 'Nên giữ ấm cơ thể sau khi massage, không tắm lại bằng nước lạnh ngay trong vòng 2 giờ.'
};

export const SPIRULINA_FACIAL_SOP: ServiceSOPData = {
  benefitsSummary:
    'Cấy tảo xoắn tươi nguyên chất kết hợp Marine Collagen sinh học giúp phục hồi da mỏng yếu, cấp ẩm căng bóng và làm sáng hồng tự nhiên.',
  targetSkinType: 'Da khô, da thiếu ẩm, da sạm màu, da sau tái tạo mỏng yếu.',
  preparationSteps: [
    'Pha tảo xoắn tươi nguyên chất với dung dịch Marine Collagen sinh học.',
    'Chuẩn bị máy cấy tảo đầu kim Nano tròn tiệt trùng.',
    'Chuẩn bị búa lạnh dập đỏ 5°C.'
  ],
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: 'Tẩy trang & Rửa mặt',
      durationMinutes: 5,
      description: 'Làm sạch bụi bẩn và bã nhờn bề mặt bằng sản phẩm dịu nhẹ.',
      productsUsed: 'Sữa rửa mặt dịu nhẹ',
      toolsUsed: 'Bọt biển'
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: 'Tẩy tế bào chết enzym',
      durationMinutes: 5,
      description: 'Tẩy sừng nhẹ nhàng lấy đi tế bào chết.',
      productsUsed: 'Gel enzym thực vật',
      toolsUsed: 'Bọt biển'
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: 'Cấy tảo xoắn tươi Nano',
      durationMinutes: 20,
      description: 'Thoa hỗn hợp tảo xoắn tươi & Collagen. Dùng đầu Nano di xoắn tròn khắp mặt để đưa dưỡng chất sâu vào hạ bì.',
      productsUsed: 'Tảo xoắn tươi & Marine Collagen',
      toolsUsed: 'Máy phi kim đầu Nano tròn tiệt trùng'
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: 'Đắp mặt nạ tảo dịu da',
      durationMinutes: 15,
      description: 'Đắp mặt nạ dẻo tảo xoắn giữ ẩm và phục hồi.',
      productsUsed: 'Mặt nạ dẻo Tảo biển',
      toolsUsed: 'Cọ thoa'
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: 'Di điện di búa lạnh 5°C',
      durationMinutes: 10,
      description: 'Di búa lạnh làm dịu mát da, khóa chặt tinh chất tảo vừa cấy.',
      productsUsed: 'HA Serum',
      toolsUsed: 'Búa lạnh Cryo 5°C'
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: 'Kem dưỡng & Chống nắng',
      durationMinutes: 5,
      description: 'Khóa ẩm và bảo vệ da.',
      productsUsed: 'Kem chống nắng sinh học',
      toolsUsed: 'Tay sát khuẩn'
    }
  ],
  contraindications: 'Không dùng cho da đang mụn mủ bọc bùng phát nặng.',
  homeCareNotes: 'Thoa kem chống nắng mỗi ngày, uống đủ 2L nước để da căng bóng mịn màng.'
};

/**
 * Returns pre-populated SOP data for any service based on keyword matching.
 */
export function getDefaultSOPForService(serviceName: string, category: string = ''): ServiceSOPData {
  const text = (serviceName + ' ' + category).toLowerCase();

  if (text.includes('detox') || text.includes('đá nóng') && text.includes('face')) {
    return DETOX_60M_SOP;
  }
  if (text.includes('mụn') || text.includes('acne')) {
    return ACNE_TREATMENT_SOP;
  }
  if (text.includes('massage') || text.includes('body') || text.includes('đá nóng')) {
    return MASSAGE_BODY_SOP;
  }
  if (text.includes('tảo') || text.includes('spirulina') || text.includes('cấy')) {
    return SPIRULINA_FACIAL_SOP;
  }

  // Fallback default Detox 60m SOP (matching user's uploaded image sheet!)
  return DETOX_60M_SOP;
}
