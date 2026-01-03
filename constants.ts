import { Holiday, StylePreset } from './types';

export const DEFAULT_STYLES: StylePreset[] = [
  { id: 'realism', name: '极度写实 (Photorealistic)', promptSuffix: 'photorealistic, 8k, highly detailed, shot on Sony A7R IV, 85mm lens, cinematic lighting' },
  { id: 'phone', name: '手机抓拍 (Phone Snap)', promptSuffix: 'candid shot, iPhone photo, amateur photography, slight motion blur, natural lighting, posted on instagram' },
  { id: 'film', name: '电影历史 (Cinematic History)', promptSuffix: 'cinematic still, vintage film look, kodak portra 400, historical drama atmosphere, grain, dramatic shadows' },
  { id: 'oil', name: '古典油画 (Classic Oil)', promptSuffix: 'oil painting, textured brushstrokes, classical composition, chiaroscuro, masterpiece, renaissance style' },
  { id: 'cyber', name: '赛博朋克 (Cyberpunk)', promptSuffix: 'cyberpunk, neon lights, rain, futuristic city, high contrast, blue and pink palette, digital art' },
  { id: 'anime', name: '日系动漫 (Anime)', promptSuffix: 'anime style, makoto shinkai style, vibrant colors, clean lines, atmospheric clouds, 2D animation' },
];

export const SHOT_TYPES = [
  { value: 'default', label: '默认 (AI决定)' },
  { value: 'wide_angle', label: '广角大场景 (Wide Angle)' },
  { value: 'close_up', label: '面部特写 (Close-up)' },
  { value: 'drone_shot', label: '上帝视角/航拍 (Drone Shot)' },
  { value: 'eye_level', label: '平视/人眼视角 (Eye Level)' },
  { value: 'low_angle', label: '低角度仰拍 (Low Angle)' },
  { value: 'macro', label: '微距细节 (Macro Detail)' },
  { value: 'over_shoulder', label: '过肩视角 (Over the Shoulder)' },
];

export const ENVIRONMENTS = [
  { value: 'default', label: '默认 (AI决定)' },
  { value: 'church_interior', label: '教堂内部 (Church Interior)' },
  { value: 'church_exterior', label: '教堂外观/广场 (Church Exterior)' },
  { value: 'vietnamese_home', label: '越南家庭内部 (Vietnamese Home)' },
  { value: 'street_procession', label: '街道游行 (Street Procession)' },
  { value: 'rice_paddy', label: '稻田/乡村 (Rice Field)' },
  { value: 'cemetery', label: '墓地 (Cemetery)' },
  { value: 'shrine', label: '圣母/圣人朝圣地 (Shrine)' },
];

export const ACTIVITIES = [
  { value: 'default', label: '默认 (AI决定)' },
  { value: 'celebrating_mass', label: '举行弥撒 (Celebrating Mass)' },
  { value: 'procession', label: '抬轿游行 (Procession)' },
  { value: 'praying_rosary', label: '诵念玫瑰经 (Praying Rosary)' },
  { value: 'flower_offering', label: '献花舞蹈 (Flower Offering)' },
  { value: 'family_meal', label: '家庭团聚用餐 (Family Meal)' },
  { value: 'confession', label: '告解 (Confession)' },
  { value: 'choir_singing', label: '唱诗班歌唱 (Choir Singing)' },
  { value: 'incense_offering', label: '进香礼 (Incense Offering)' },
];

export const LITURGICAL_COLORS = [
  { value: 'default', label: '自动 (根据节日)' },
  { value: 'Green', label: '绿色 (常年期)' },
  { value: 'Red', label: '红色 (殉道/圣神)' },
  { value: 'White', label: '白色/金色 (庆典/圣诞/复活)' },
  { value: 'Purple', label: '紫色 (四旬期/将临期/追思)' },
  { value: 'Rose', label: '粉色 (喜乐主日)' },
  { value: 'Black', label: '黑色 (追思/葬礼 - 传统)' },
];

// Detailed Vietnamese Catholic Holidays Database
export const VIETNAMESE_HOLIDAYS: Holiday[] = [
  {
    id: 'tet_nguyen_dan',
    name: '农历新年 (Tết Nguyên Đán) - 新春弥撒',
    date: '农历正月初一至初三',
    significance: '越南最重要的节日，天主教徒将民族传统与信仰结合，通过弥撒祈求新一年的平安。',
    priestActivity: '神父通常穿着金色或红色的祭衣（象征喜庆）。在弥撒结束时，神父会主持“采圣言”（Hái Lộc Thánh）仪式，祝圣装有圣经金句的红包或卷轴。',
    believerActivity: '信徒穿着传统的奥黛（Áo Dài）和头巾（Khăn Đóng）。参加新春弥撒，排队领取“圣言禄”（Lộc Thánh）。家庭祭坛会摆放鲜花、粽子（Bánh Chưng）和五果盘供奉祖先。',
    visualElements: 'Gold/Red Chasuble, Yellow Apricot Blossoms (Hoa Mai), Peach Blossoms (Hoa Dao), Lucky Red Envelopes, Incense smoke, Traditional Ao Dai, Festive Crowds.',
    defaultVestmentColor: 'Gold'
  },
  {
    id: 'le_tro',
    name: '圣灰礼仪 (Lễ Tro)',
    date: '四旬期开始（复活节前40天）',
    significance: '标志着悔改和四旬期的开始，提醒人生命的短暂。',
    priestActivity: '神父身着紫色祭衣。在讲道后，用祝圣过的灰烬在信徒额头上画十字，念“人啊，你原来是土，将来还要归于土”。',
    believerActivity: '信徒全天守斋（禁食肉类）。在教堂排队接受擦灰礼。许多老年信徒、修女会在额头上保留灰烬十字一整天。表情庄重，教堂灯光通常较暗。',
    visualElements: 'Purple Vestments, Ash Cross on Foreheads, Dim Lighting, Somber Atmosphere, Long Queues, Traditional Vietnamese Elderly Women praying.',
    defaultVestmentColor: 'Purple'
  },
  {
    id: 'thanh_giuse',
    name: '大圣若瑟瞻礼 (Lễ Thánh Giuse)',
    date: '3月19日',
    significance: '越南教会非常敬礼圣若瑟，他是越南教会的主保圣人之一，也是众多男教友的主保。',
    priestActivity: '神父穿着白色祭衣，主持隆重弥撒。讲道主题围绕父亲的责任与家庭。',
    believerActivity: '许多堂区的“家主会”（Hội Gia Trưởng - 由父亲们组成的团体）会举行特别聚会和游行。男士们通常穿白色衬衫或西装，佩戴圣若瑟勋章。',
    visualElements: 'White Vestments, St. Joseph Statue with Lily/Tools, Men in White Shirts, Procession of Fathers, Solemn but masculine atmosphere.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'tuan_thanh',
    name: '圣周 (Tuần Thánh) - 圣枝主日与受难日',
    date: '复活节前的一周',
    significance: '纪念耶稣的受难与死亡。越南天主教社区通常有非常盛大的游行和真人苦路。',
    priestActivity: '圣枝主日：祝圣棕榈枝。圣周五：身穿红色祭衣，行五体投地礼（俯伏在祭台前），主持拜苦路。',
    believerActivity: '圣枝主日：信徒手持编织成复杂形状的棕榈枝游行。圣周五：义安、裴朱等教区会有真人扮演的耶稣受难游行，信徒身穿黑色衣服，痛哭，亲吻十字架。',
    visualElements: 'Red Vestments (Good Friday), Palm Branches woven into crosses, Priest prostrate on floor, Live Passion Play, Black mourning clothes, Large Wooden Cross.',
    defaultVestmentColor: 'Red'
  },
  {
    id: 'phuc_sinh',
    name: '复活节 (Lễ Phục Sinh)',
    date: '春分月圆后的第一个主日',
    significance: '庆祝耶稣复活，礼仪年最高峰。',
    priestActivity: '守夜礼中祝圣新火、复活蜡烛。高唱《逾越颂》。穿着最隆重的白色或金色祭衣。',
    believerActivity: '信徒手持点燃的蜡烛，跟随复活蜡烛游行进入黑暗的教堂。参与洗礼。弥撒后互祝平安，教区可能分发彩蛋。',
    visualElements: 'Darkness to Light, Paschal Candle, White/Gold Vestments, Joyous Faces, Flowers (Lilies) on Altar, Holy Water Sprinkling.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'long_chua_thuong_xot',
    name: '救主慈悲主日 (Chúa Nhật Lòng Chúa Thương Xót)',
    date: '复活节后第一个主日',
    significance: '特别敬礼耶稣的慈悲，越南信徒对此敬礼非常热衷。',
    priestActivity: '穿着白色祭衣，供奉慈悲耶稣画像（红白光芒）。',
    believerActivity: '下午3点（慈悲时刻）举行特别祈祷。信徒诵念慈悲串经，许多人触摸或亲吻慈悲耶稣像。',
    visualElements: 'White Vestments, Divine Mercy Image (Red/White Rays), 3PM Clock, Kneeling Crowds, Rosary Beads.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'dang_hoa',
    name: '五月献花月 (Tháng Dâng Hoa)',
    date: '整个五月',
    significance: '特别敬礼圣母玛利亚，越南教会极具特色的传统活动，融合了越南宫廷舞蹈元素。',
    priestActivity: '主持献花仪式，通常坐在祭台旁观礼，最后降福。',
    believerActivity: '“献花队”（Đội Dâng Hoa）由穿着统一色彩鲜艳奥黛的少女、妇女甚至儿童组成。她们伴随圣歌，手持鲜花、蜡烛、扇子或香炉，在祭台前跳编排好的礼仪舞蹈。',
    visualElements: 'Colorful Ao Dai Uniforms, Floral Dance, Synchronized Movements, Flower Baskets, Incense Burners, Statue of Mary, White/Blue Themes.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'minh_thanh_chua',
    name: '基督圣体圣血节 (Lễ Mình Máu Thánh Chúa)',
    date: '五六月间',
    significance: '公开宣认耶稣真实存在于圣体中。',
    priestActivity: '神父身穿金色祭衣或披风，手持巨大的圣体光（Monstrance），在华盖（Canopy）下进行户外圣体游行。',
    believerActivity: '盛大的街道游行。儿童沿途撒花瓣。辅祭生摇铃和提香炉。信徒在道路两旁跪拜圣体经过。',
    visualElements: 'Gold Monstrance, Eucharistic Procession, Canopy held by 4 men, Flower Petals on road, Incense smoke, Kneeling crowds on street.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'la_vang',
    name: '拉望圣母朝圣节 (Đại hội Đức Mẹ La Vang)',
    date: '8月15日 (圣母升天节) 前后',
    significance: '纪念1798年圣母在广治省拉望森林显现。越南最大的天主教朝圣活动。',
    priestActivity: '数百位主教和神父在户外巨大的拉望圣母像前共祭。穿着白色祭衣。',
    believerActivity: '成千上万来自全球的越南信徒聚集。户外露营，通宵祈祷，诵念玫瑰经，盛大的烛光游行。',
    visualElements: 'Massive Outdoor Crowd, Statue of Our Lady of La Vang (Asian features, holding baby), Hundreds of Priests, Camping Tents, Night Candlelight Procession.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'tet_trung_thu',
    name: '中秋节 (Tết Trung Thu) - 儿童以此敬礼耶稣',
    date: '农历八月十五',
    significance: '虽然是民俗节日，但越南教会通常将其作为“儿童节”，举行特别弥撒祈祷。',
    priestActivity: '神父通常穿着白色祭衣。弥撒后会分发糖果和月饼给儿童。',
    believerActivity: '儿童提着各种形状的灯笼（星星、鲤鱼）在教堂院子里游行。舞狮表演（Múa Lân）在教堂前举行。唱圣歌感谢天主赏赐丰收。',
    visualElements: 'Star-shaped Lanterns, Children Procession at Night, Lion Dance near Church, Mooncakes, Joyful Chaos, Bright Colors.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'thang_man_coi',
    name: '十月玫瑰月 (Tháng Mân Côi)',
    date: '整个十月',
    significance: '鼓励信徒多念玫瑰经。',
    priestActivity: '带领这一周的特别玫瑰经祈祷，通常有烛光游行。',
    believerActivity: '每晚在教堂或家庭中轮流念玫瑰经。特别是10月7日玫瑰圣母节，会有大型的圣母像游行（Kiệu Đức Mẹ），轿子装饰非常华丽。',
    visualElements: 'Rosary Beads, Procession of Mary Statue, Decorated Palanquin (Kiệu), Candles, Evening Setting.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'cac_dang',
    name: '追思已亡节 (Lễ Các Đẳng)',
    date: '11月2日',
    significance: '特别纪念已故亲友和炼狱灵魂。',
    priestActivity: '穿着紫色或黑色（传统）祭衣。通常前往教会墓地（Vườn Thánh）主持露天弥撒。',
    believerActivity: '信徒前往墓地扫墓，修剪杂草，粉刷墓碑。墓地在晚上会被成千上万的蜡烛照亮，极其壮观。这是越南孝道文化的体现。',
    visualElements: 'Cemetery at Night, Thousands of Candles on Graves, Incense, Purple/Black Vestments, Outdoor Mass, Melancholic Beauty.',
    defaultVestmentColor: 'Purple'
  },
  {
    id: 'tu_dao',
    name: '越南殉道圣人庆日 (Lễ Các Thánh Tử Đạo Việt Nam)',
    date: '11月24日',
    significance: '纪念18-19世纪在越南殉道的117位圣人。展现越南教会的刚毅。',
    priestActivity: '穿着红色祭衣（象征鲜血）。讲道中讲述殉道故事。',
    believerActivity: '游行队伍抬着装有圣人遗骨（圣髑）的红色轿子。信徒穿着红色衣服或戴红围巾。大型庆典会有击鼓表演（Trống）和吹号，气氛激昂。',
    visualElements: 'Red Vestments, Reliquary Box, Red Flags/Banners, Traditional Vietnamese Drums, Intense Cultural Pride, Procession.',
    defaultVestmentColor: 'Red'
  },
  {
    id: 'giang_sinh',
    name: '圣诞节 (Lễ Giáng Sinh)',
    date: '12月24日夜间至25日',
    significance: '庆祝耶稣诞生。在越南是一个全民狂欢的节日。',
    priestActivity: '主持子夜弥撒。将圣婴耶稣像游行安放在马槽中。',
    believerActivity: '教友花数周制作巨大的马槽（Hang Đá），有的甚至有人造瀑布。平安夜教堂周围人山人海。弥撒后有圣剧（Diễn Nguyện）。',
    visualElements: 'Elaborate Nativity Cave, LED Christmas Lights everywhere, Crowded Church Exterior, Baby Jesus Statue, Choir, Festive Night.',
    defaultVestmentColor: 'White'
  },
  {
    id: 'thanh_gia_that',
    name: '圣家节 (Lễ Thánh Gia Thất)',
    date: '圣诞节后的主日',
    significance: '家庭的主保节日，许多夫妇在此日重发婚姻誓愿。',
    priestActivity: '神父祝福在场的夫妇，特别是庆祝银婚、金婚的夫妇。',
    believerActivity: '全家人一起参加弥撒。夫妇穿着整齐（西装/奥黛）手牵手重宣婚誓。',
    visualElements: 'Couples holding hands, Wedding Anniversary renewal, White Vestments, Family gathering inside church.',
    defaultVestmentColor: 'White'
  }
];