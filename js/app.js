'use strict';

// ══════════════════════════════════════
// 五行基础数据
// ══════════════════════════════════════

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// 天干五行：甲0乙1丙2丁3戊4己5庚6辛7壬8癸9
const STEM_WX = ['木','木','火','火','土','土','金','金','水','水'];
// 地支五行：子0丑1寅2卯3辰4巳5午6未7申8酉9戌10亥11
const BRANCH_WX = ['水','土','木','木','土','火','火','土','金','金','土','水'];

// 五行相生（A生B）
const GENERATES = {'木':'火','火':'土','土':'金','金':'水','水':'木'};
// 五行相克（A克B）
const RESTRICTS = {'木':'土','土':'水','水':'火','火':'金','金':'木'};

// ══════════════════════════════════════
// 调候用神表（天干×季节）
// 来源：Horosa-Web-App / xuan-utils-pro BaZiJiChuMap.java XI_YONG_SHEN
// 季节映射（按月支索引）：
//   四季末(1丑/4辰/7未/10戌) 冬(0子/11亥) 春(2寅/3卯) 夏(5巳/6午) 秋(8申/9酉)
// ══════════════════════════════════════
const XI_YONG_SHEN_TABLE = {
  '甲': { '春':['火','土','金'], '夏':['水','木'], '秋':['水','木'], '冬':['火','金'], '四季末':['水','土'] },
  '乙': { '春':['火','土','金'], '夏':['水','木'], '秋':['水','木'], '冬':['火','金'], '四季末':['水','土'] },
  '丙': { '春':['水','土'],      '夏':['金','水'], '秋':['木','火'], '冬':['木','火','土'], '四季末':['木','火','金'] },
  '丁': { '春':['水','土'],      '夏':['金','水'], '秋':['木','火'], '冬':['木','火','土'], '四季末':['木','火','金'] },
  '戊': { '春':['火','土'],      '夏':['金','水','木'], '秋':['火','土'], '冬':['火','土'], '四季末':['木','金','水'] },
  '己': { '春':['火','土'],      '夏':['金','水','木'], '秋':['火','土'], '冬':['火','土'], '四季末':['木','金','水'] },
  '庚': { '春':['土','金'],      '夏':['土','水','金'], '秋':['火','木','水'], '冬':['火','土','金'], '四季末':['水','木','火'] },
  '辛': { '春':['土','金'],      '夏':['土','水','金'], '秋':['火','木','水'], '冬':['火','土','金'], '四季末':['水','木','火'] },
  '壬': { '春':['金','水'],      '夏':['金','水'], '秋':['木','火','土'], '冬':['木','火','土'], '四季末':['金','水'] },
  '癸': { '春':['金','水'],      '夏':['金','水'], '秋':['木','火','土'], '冬':['木','火','土'], '四季末':['金','水'] },
};

// 五行颜色
const WX_COLOR = {'木':'#5C8A4A','火':'#C84B31','土':'#8B6914','金':'#B8A040','水':'#2B5F8A'};

// 五行特质说明
const WX_INFO = {
  '木': { icon:'🌿', title:'木', nature:'生发·创造·向上',
    trait:'善于开拓进取，适合创业、文化、教育、互联网、传媒相关行业',
    region:'东方华东·寅卯辰方位' },
  '火': { icon:'🔥', title:'火', nature:'热情·活力·光明',
    trait:'社交活跃，商业嗅觉敏锐，适合销售、市场、餐饮、娱乐、投资相关行业',
    region:'南方华南·巳午未方位' },
  '土': { icon:'⛰️', title:'土', nature:'稳健·厚重·包容',
    trait:'脚踏实地，积累型人格，适合政务、传统制造、房地产、建筑相关行业',
    region:'中原腹地·辰戌丑未四隅' },
  '金': { icon:'⚡', title:'金', nature:'效率·严谨·决断',
    trait:'执行力强，重规则秩序，适合金融、法律、制造、工程、管理相关行业',
    region:'西方西北·申酉戌方位' },
  '水': { icon:'💧', title:'水', nature:'智慧·灵活·流动',
    trait:'思维灵活，善于变通，适合IT、学术、传媒、金融、贸易相关行业',
    region:'北方华北·亥子丑方位' },
};

// ══════════════════════════════════════
// 推荐城市数据（按喜用神五行分类）
// ══════════════════════════════════════

const CITIES = {
  '木': [
    { name:'青岛', province:'山东', wuxing:'木', desc:'卯木正东，山东半岛海港，创业氛围浓，生机勃发' },
    { name:'济南', province:'山东', wuxing:'木', desc:'卯木正东，泉城，文化传承深厚，稳中求进' },
    { name:'大连', province:'辽宁', wuxing:'木', desc:'寅木东北，辽东海港，东北经济核心，向上生长' },
    { name:'沈阳', province:'辽宁', wuxing:'木', desc:'寅木东北，燕地北境，工业重镇，踏实进取' },
    { name:'合肥', province:'安徽', wuxing:'木', desc:'辰木豫皖，科教新城，近年创新活力极强' },
    { name:'郑州', province:'河南', wuxing:'木', desc:'辰木中原，交通枢纽，中原崛起势头强劲' },
  ],
  '火': [
    { name:'广州', province:'广东', wuxing:'火', desc:'午火正南，千年商都，商业最为旺盛，财富汇聚' },
    { name:'深圳', province:'广东', wuxing:'火', desc:'午火南境，创新之都，年轻活力，资本最活跃' },
    { name:'长沙', province:'湖南', wuxing:'火', desc:'巳火楚地，传媒娱乐发达，互联网内容产业崛起' },
    { name:'武汉', province:'湖北', wuxing:'火', desc:'巳火荆州，九省通衢，江汉平原经济战略要地' },
    { name:'成都', province:'四川', wuxing:'火', desc:'未火蜀地，天府之国，休闲之都，营商环境极佳' },
    { name:'厦门', province:'福建', wuxing:'火', desc:'午火南境，宜居之城，对外开放程度高，品质生活' },
  ],
  '土': [
    { name:'郑州', province:'河南', wuxing:'土', desc:'中原之心，天下之中，土气最盛，稳健发展核心地带' },
    { name:'洛阳', province:'河南', wuxing:'土', desc:'十三朝古都，积厚流光，历史沉淀最深，厚积薄发' },
    { name:'西安', province:'陕西', wuxing:'土', desc:'周秦汉唐古都，关中平原，历史厚重，西部战略中心' },
    { name:'武汉', province:'湖北', wuxing:'土', desc:'九省通衢，四通八达，稳健积累，中部崛起中心' },
    { name:'成都', province:'四川', wuxing:'土', desc:'益州蜀地，盆地土壤丰厚，宜居安家，稳步积累' },
  ],
  '金': [
    { name:'西安', province:'陕西', wuxing:'金', desc:'酉金雍州，关中古都，历史底蕴深，西北中心城市' },
    { name:'太原', province:'山西', wuxing:'金', desc:'申金晋地，晋商故里，能源之城，传统根基深厚' },
    { name:'兰州', province:'甘肃', wuxing:'金', desc:'酉金雍地，黄河穿城，西北枢纽，一带一路要冲' },
    { name:'银川', province:'宁夏', wuxing:'金', desc:'戌金冀魏，塞上江南，政策红利大，发展潜力足' },
    { name:'呼和浩特', province:'内蒙古', wuxing:'金', desc:'戌金草原，生态辽阔，资源丰厚，能源产业发达' },
  ],
  '水': [
    { name:'北京', province:'北京', wuxing:'水', desc:'子水正北，燕地幽州，政治文化中心，人才与资源高度集聚' },
    { name:'杭州', province:'浙江', wuxing:'水', desc:'丑土吴越，水乡泽国，互联网高地，文创产业全国领先' },
    { name:'苏州', province:'江苏', wuxing:'水', desc:'丑土吴越，江南水乡，经济持续强劲，生活品质极高' },
    { name:'南京', province:'江苏', wuxing:'水', desc:'吴越六朝古都，文化厚重，科教资源丰富，人才云集' },
    { name:'哈尔滨', province:'黑龙江', wuxing:'水', desc:'亥水北境，苍茫北国，厚积薄发，独特文化风情' },
    { name:'宁波', province:'浙江', wuxing:'水', desc:'吴越海港，民营经济活跃，商贸发达，生活品质高' },
  ],
};

// ══════════════════════════════════════
// 出生地城市数据（用于真太阳时计算）
// ══════════════════════════════════════

const BIRTH_CITIES = [
  // ── 直辖市 ──
  {p:'北京市',   c:'北京',   lng:116.4074, lat:39.9042},
  {p:'天津市',   c:'天津',   lng:117.1901, lat:39.1255},
  {p:'上海市',   c:'上海',   lng:121.4737, lat:31.2304},
  {p:'重庆市',   c:'重庆',   lng:106.5516, lat:29.5630},
  // ── 河北省 ──
  {p:'河北省', c:'石家庄', lng:114.5149, lat:38.0428},
  {p:'河北省', c:'唐山',   lng:118.1807, lat:39.6300},
  {p:'河北省', c:'秦皇岛', lng:119.5997, lat:39.9354},
  {p:'河北省', c:'邯郸',   lng:114.4895, lat:36.6253},
  {p:'河北省', c:'邢台',   lng:114.5044, lat:37.0682},
  {p:'河北省', c:'保定',   lng:115.4648, lat:38.8736},
  {p:'河北省', c:'张家口', lng:114.8795, lat:40.8270},
  {p:'河北省', c:'承德',   lng:117.9639, lat:40.9517},
  {p:'河北省', c:'沧州',   lng:116.8387, lat:38.3042},
  {p:'河北省', c:'廊坊',   lng:116.6836, lat:39.5382},
  {p:'河北省', c:'衡水',   lng:115.6713, lat:37.7348},
  // ── 山西省 ──
  {p:'山西省', c:'太原',   lng:112.5489, lat:37.8706},
  {p:'山西省', c:'大同',   lng:113.3000, lat:40.0767},
  {p:'山西省', c:'阳泉',   lng:113.5832, lat:37.8570},
  {p:'山西省', c:'长治',   lng:113.1165, lat:36.1914},
  {p:'山西省', c:'晋城',   lng:112.8516, lat:35.4906},
  {p:'山西省', c:'朔州',   lng:112.4328, lat:39.3312},
  {p:'山西省', c:'晋中',   lng:112.7524, lat:37.6895},
  {p:'山西省', c:'运城',   lng:111.0079, lat:35.0273},
  {p:'山西省', c:'忻州',   lng:112.7338, lat:38.4178},
  {p:'山西省', c:'临汾',   lng:111.5196, lat:36.0880},
  {p:'山西省', c:'吕梁',   lng:111.1442, lat:37.5240},
  // ── 内蒙古自治区 ──
  {p:'内蒙古自治区', c:'呼和浩特', lng:111.7525, lat:40.8415},
  {p:'内蒙古自治区', c:'包头',     lng:109.8405, lat:40.6571},
  {p:'内蒙古自治区', c:'乌海',     lng:106.7930, lat:39.6832},
  {p:'内蒙古自治区', c:'赤峰',     lng:118.8888, lat:42.2579},
  {p:'内蒙古自治区', c:'通辽',     lng:122.2440, lat:43.6522},
  {p:'内蒙古自治区', c:'鄂尔多斯', lng:109.9817, lat:39.8164},
  {p:'内蒙古自治区', c:'呼伦贝尔', lng:119.7580, lat:49.2148},
  {p:'内蒙古自治区', c:'巴彦淖尔', lng:107.3882, lat:40.7432},
  {p:'内蒙古自治区', c:'乌兰察布', lng:113.1121, lat:41.0225},
  // ── 辽宁省 ──
  {p:'辽宁省', c:'沈阳',   lng:123.4315, lat:41.8057},
  {p:'辽宁省', c:'大连',   lng:121.6147, lat:38.9140},
  {p:'辽宁省', c:'鞍山',   lng:122.9950, lat:41.1106},
  {p:'辽宁省', c:'抚顺',   lng:123.9574, lat:41.8796},
  {p:'辽宁省', c:'本溪',   lng:123.7741, lat:41.3029},
  {p:'辽宁省', c:'丹东',   lng:124.3541, lat:40.1288},
  {p:'辽宁省', c:'锦州',   lng:121.1268, lat:41.0950},
  {p:'辽宁省', c:'营口',   lng:122.2353, lat:40.6672},
  {p:'辽宁省', c:'阜新',   lng:121.6700, lat:42.0218},
  {p:'辽宁省', c:'辽阳',   lng:123.2300, lat:41.2769},
  {p:'辽宁省', c:'盘锦',   lng:122.0695, lat:41.1199},
  {p:'辽宁省', c:'铁岭',   lng:123.7263, lat:42.2237},
  {p:'辽宁省', c:'朝阳',   lng:120.4511, lat:41.5671},
  {p:'辽宁省', c:'葫芦岛', lng:120.8361, lat:40.7100},
  // ── 吉林省 ──
  {p:'吉林省', c:'长春',   lng:125.3245, lat:43.8868},
  {p:'吉林省', c:'吉林市', lng:126.5500, lat:43.8378},
  {p:'吉林省', c:'四平',   lng:124.3706, lat:43.1682},
  {p:'吉林省', c:'辽源',   lng:125.1458, lat:42.9237},
  {p:'吉林省', c:'通化',   lng:125.9356, lat:41.7277},
  {p:'吉林省', c:'白山',   lng:126.4213, lat:41.9418},
  {p:'吉林省', c:'松原',   lng:124.8238, lat:45.1354},
  {p:'吉林省', c:'白城',   lng:122.8381, lat:45.6196},
  {p:'吉林省', c:'延边',   lng:129.5086, lat:42.9119},
  // ── 黑龙江省 ──
  {p:'黑龙江省', c:'哈尔滨',   lng:126.5358, lat:45.8022},
  {p:'黑龙江省', c:'齐齐哈尔', lng:123.9540, lat:47.3543},
  {p:'黑龙江省', c:'牡丹江',   lng:129.6328, lat:44.5523},
  {p:'黑龙江省', c:'佳木斯',   lng:130.3649, lat:46.8130},
  {p:'黑龙江省', c:'大庆',     lng:125.1117, lat:46.5957},
  {p:'黑龙江省', c:'伊春',     lng:128.9107, lat:47.7278},
  {p:'黑龙江省', c:'鸡西',     lng:130.9695, lat:45.2950},
  {p:'黑龙江省', c:'鹤岗',     lng:130.2974, lat:47.3504},
  {p:'黑龙江省', c:'双鸭山',   lng:131.1572, lat:46.6467},
  {p:'黑龙江省', c:'七台河',   lng:131.0154, lat:45.7717},
  {p:'黑龙江省', c:'黑河',     lng:127.4984, lat:50.2439},
  {p:'黑龙江省', c:'绥化',     lng:126.9933, lat:46.6354},
  // ── 江苏省 ──
  {p:'江苏省', c:'南京',   lng:118.7969, lat:32.0603},
  {p:'江苏省', c:'无锡',   lng:120.3119, lat:31.4912},
  {p:'江苏省', c:'徐州',   lng:117.1851, lat:34.2692},
  {p:'江苏省', c:'常州',   lng:119.9741, lat:31.7774},
  {p:'江苏省', c:'苏州',   lng:120.6196, lat:31.2994},
  {p:'江苏省', c:'南通',   lng:120.8641, lat:32.0160},
  {p:'江苏省', c:'连云港', lng:119.2213, lat:34.5963},
  {p:'江苏省', c:'淮安',   lng:119.0152, lat:33.5972},
  {p:'江苏省', c:'盐城',   lng:120.1392, lat:33.3774},
  {p:'江苏省', c:'扬州',   lng:119.4127, lat:32.3912},
  {p:'江苏省', c:'镇江',   lng:119.4526, lat:32.1644},
  {p:'江苏省', c:'泰州',   lng:119.9230, lat:32.4654},
  {p:'江苏省', c:'宿迁',   lng:118.2747, lat:33.9634},
  // ── 浙江省 ──
  {p:'浙江省', c:'杭州',   lng:120.1551, lat:30.2741},
  {p:'浙江省', c:'宁波',   lng:121.5500, lat:29.8750},
  {p:'浙江省', c:'温州',   lng:120.6723, lat:28.0000},
  {p:'浙江省', c:'嘉兴',   lng:120.7508, lat:30.7522},
  {p:'浙江省', c:'湖州',   lng:120.0877, lat:30.8939},
  {p:'浙江省', c:'绍兴',   lng:120.5802, lat:30.0316},
  {p:'浙江省', c:'金华',   lng:119.6497, lat:29.0830},
  {p:'浙江省', c:'衢州',   lng:118.8741, lat:28.9693},
  {p:'浙江省', c:'舟山',   lng:122.2072, lat:29.9855},
  {p:'浙江省', c:'台州',   lng:121.4207, lat:28.6563},
  {p:'浙江省', c:'丽水',   lng:119.9218, lat:28.4671},
  // ── 安徽省 ──
  {p:'安徽省', c:'合肥',   lng:117.2272, lat:31.8206},
  {p:'安徽省', c:'芜湖',   lng:118.3760, lat:31.3330},
  {p:'安徽省', c:'蚌埠',   lng:117.3633, lat:32.9168},
  {p:'安徽省', c:'淮南',   lng:116.9990, lat:32.6252},
  {p:'安徽省', c:'马鞍山', lng:118.5068, lat:31.6702},
  {p:'安徽省', c:'淮北',   lng:116.7986, lat:33.9552},
  {p:'安徽省', c:'铜陵',   lng:117.8167, lat:30.9454},
  {p:'安徽省', c:'安庆',   lng:117.0439, lat:30.5083},
  {p:'安徽省', c:'黄山',   lng:118.3382, lat:29.7140},
  {p:'安徽省', c:'滁州',   lng:118.3179, lat:32.2545},
  {p:'安徽省', c:'阜阳',   lng:115.8163, lat:32.9003},
  {p:'安徽省', c:'宿州',   lng:116.9846, lat:33.6464},
  {p:'安徽省', c:'六安',   lng:116.4976, lat:31.7532},
  {p:'安徽省', c:'亳州',   lng:115.7793, lat:33.8443},
  {p:'安徽省', c:'池州',   lng:117.4918, lat:30.6601},
  {p:'安徽省', c:'宣城',   lng:118.7581, lat:30.9400},
  // ── 福建省 ──
  {p:'福建省', c:'福州',   lng:119.2965, lat:26.0745},
  {p:'福建省', c:'厦门',   lng:118.0894, lat:24.4798},
  {p:'福建省', c:'莆田',   lng:119.0078, lat:25.4507},
  {p:'福建省', c:'三明',   lng:117.6347, lat:26.2649},
  {p:'福建省', c:'泉州',   lng:118.6766, lat:24.8740},
  {p:'福建省', c:'漳州',   lng:117.6610, lat:24.5115},
  {p:'福建省', c:'南平',   lng:118.1614, lat:26.6428},
  {p:'福建省', c:'龙岩',   lng:117.0298, lat:25.0924},
  {p:'福建省', c:'宁德',   lng:119.5481, lat:26.6694},
  // ── 江西省 ──
  {p:'江西省', c:'南昌',   lng:115.8582, lat:28.6829},
  {p:'江西省', c:'景德镇', lng:117.1780, lat:29.2690},
  {p:'江西省', c:'萍乡',   lng:113.8537, lat:27.6226},
  {p:'江西省', c:'九江',   lng:115.9925, lat:29.7063},
  {p:'江西省', c:'新余',   lng:114.9167, lat:27.8174},
  {p:'江西省', c:'鹰潭',   lng:117.0700, lat:28.2642},
  {p:'江西省', c:'赣州',   lng:114.9330, lat:25.8309},
  {p:'江西省', c:'吉安',   lng:114.9862, lat:27.1119},
  {p:'江西省', c:'宜春',   lng:114.3912, lat:27.8174},
  {p:'江西省', c:'抚州',   lng:116.3580, lat:27.9539},
  {p:'江西省', c:'上饶',   lng:117.9438, lat:28.4549},
  // ── 山东省 ──
  {p:'山东省', c:'济南',   lng:117.0009, lat:36.6758},
  {p:'山东省', c:'青岛',   lng:120.3826, lat:36.0671},
  {p:'山东省', c:'淄博',   lng:118.0548, lat:36.8131},
  {p:'山东省', c:'枣庄',   lng:117.3214, lat:34.8119},
  {p:'山东省', c:'东营',   lng:118.6749, lat:37.4346},
  {p:'山东省', c:'烟台',   lng:121.4485, lat:37.4638},
  {p:'山东省', c:'潍坊',   lng:119.1619, lat:36.7069},
  {p:'山东省', c:'济宁',   lng:116.5871, lat:35.4150},
  {p:'山东省', c:'泰安',   lng:117.0877, lat:36.2090},
  {p:'山东省', c:'威海',   lng:122.1161, lat:37.5130},
  {p:'山东省', c:'日照',   lng:119.5269, lat:35.4164},
  {p:'山东省', c:'临沂',   lng:118.3556, lat:35.1042},
  {p:'山东省', c:'德州',   lng:116.3574, lat:37.4360},
  {p:'山东省', c:'聊城',   lng:115.9855, lat:36.4567},
  {p:'山东省', c:'滨州',   lng:117.9706, lat:37.3806},
  {p:'山东省', c:'菏泽',   lng:115.4804, lat:35.2334},
  // ── 河南省 ──
  {p:'河南省', c:'郑州',   lng:113.6254, lat:34.7466},
  {p:'河南省', c:'开封',   lng:114.3414, lat:34.7972},
  {p:'河南省', c:'洛阳',   lng:112.4539, lat:34.6202},
  {p:'河南省', c:'平顶山', lng:113.1919, lat:33.7659},
  {p:'河南省', c:'安阳',   lng:114.3521, lat:36.1030},
  {p:'河南省', c:'鹤壁',   lng:114.2972, lat:35.7478},
  {p:'河南省', c:'新乡',   lng:113.9267, lat:35.3037},
  {p:'河南省', c:'焦作',   lng:113.2419, lat:35.2154},
  {p:'河南省', c:'濮阳',   lng:115.0294, lat:35.7681},
  {p:'河南省', c:'许昌',   lng:113.8526, lat:34.0354},
  {p:'河南省', c:'漯河',   lng:114.0495, lat:33.5817},
  {p:'河南省', c:'三门峡', lng:111.2009, lat:34.7731},
  {p:'河南省', c:'南阳',   lng:112.5286, lat:33.0083},
  {p:'河南省', c:'商丘',   lng:115.6566, lat:34.4141},
  {p:'河南省', c:'信阳',   lng:114.0750, lat:32.1431},
  {p:'河南省', c:'周口',   lng:114.6497, lat:33.6260},
  {p:'河南省', c:'驻马店', lng:114.0220, lat:33.0138},
  // ── 湖北省 ──
  {p:'湖北省', c:'武汉',   lng:114.3054, lat:30.5931},
  {p:'湖北省', c:'黄石',   lng:115.0384, lat:30.2192},
  {p:'湖北省', c:'十堰',   lng:110.7987, lat:32.6472},
  {p:'湖北省', c:'宜昌',   lng:111.2900, lat:30.6923},
  {p:'湖北省', c:'襄阳',   lng:112.1221, lat:32.0088},
  {p:'湖北省', c:'鄂州',   lng:114.8905, lat:30.3963},
  {p:'湖北省', c:'荆门',   lng:112.2038, lat:31.0350},
  {p:'湖北省', c:'孝感',   lng:113.9169, lat:30.9240},
  {p:'湖北省', c:'荆州',   lng:112.2336, lat:30.3331},
  {p:'湖北省', c:'黄冈',   lng:114.8795, lat:30.4478},
  {p:'湖北省', c:'咸宁',   lng:114.3229, lat:29.8393},
  {p:'湖北省', c:'随州',   lng:113.3738, lat:31.6900},
  {p:'湖北省', c:'恩施',   lng:109.4807, lat:30.2820},
  // ── 湖南省 ──
  {p:'湖南省', c:'长沙',   lng:112.9388, lat:28.2282},
  {p:'湖南省', c:'株洲',   lng:113.1340, lat:27.8274},
  {p:'湖南省', c:'湘潭',   lng:112.9440, lat:27.8300},
  {p:'湖南省', c:'衡阳',   lng:112.5716, lat:26.8934},
  {p:'湖南省', c:'邵阳',   lng:111.4671, lat:27.2383},
  {p:'湖南省', c:'岳阳',   lng:113.1290, lat:29.3598},
  {p:'湖南省', c:'常德',   lng:111.6981, lat:29.0361},
  {p:'湖南省', c:'张家界', lng:110.4789, lat:29.1180},
  {p:'湖南省', c:'益阳',   lng:112.3552, lat:28.5549},
  {p:'湖南省', c:'郴州',   lng:113.0303, lat:25.7699},
  {p:'湖南省', c:'永州',   lng:111.6128, lat:26.4203},
  {p:'湖南省', c:'怀化',   lng:109.9783, lat:27.5498},
  {p:'湖南省', c:'娄底',   lng:112.0066, lat:27.6901},
  // ── 广东省 ──
  {p:'广东省', c:'广州',   lng:113.2644, lat:23.1291},
  {p:'广东省', c:'深圳',   lng:114.0579, lat:22.5431},
  {p:'广东省', c:'珠海',   lng:113.5768, lat:22.2710},
  {p:'广东省', c:'汕头',   lng:116.7186, lat:23.3534},
  {p:'广东省', c:'佛山',   lng:113.1220, lat:23.0218},
  {p:'广东省', c:'韶关',   lng:113.5979, lat:24.8127},
  {p:'广东省', c:'河源',   lng:114.7000, lat:23.7433},
  {p:'广东省', c:'梅州',   lng:116.1223, lat:24.2883},
  {p:'广东省', c:'惠州',   lng:114.4129, lat:23.1118},
  {p:'广东省', c:'汕尾',   lng:115.3645, lat:22.7788},
  {p:'广东省', c:'东莞',   lng:113.7518, lat:23.0207},
  {p:'广东省', c:'中山',   lng:113.3925, lat:22.5155},
  {p:'广东省', c:'江门',   lng:112.5942, lat:22.5778},
  {p:'广东省', c:'阳江',   lng:111.9821, lat:21.8579},
  {p:'广东省', c:'湛江',   lng:110.3594, lat:21.2707},
  {p:'广东省', c:'茂名',   lng:110.9213, lat:21.6627},
  {p:'广东省', c:'肇庆',   lng:112.4728, lat:23.0468},
  {p:'广东省', c:'清远',   lng:113.0508, lat:23.6816},
  {p:'广东省', c:'潮州',   lng:116.6225, lat:23.6567},
  {p:'广东省', c:'揭州',   lng:116.3555, lat:23.5542},
  {p:'广东省', c:'云浮',   lng:112.0445, lat:22.9159},
  // ── 广西壮族自治区 ──
  {p:'广西壮族自治区', c:'南宁',   lng:108.3669, lat:22.8170},
  {p:'广西壮族自治区', c:'柳州',   lng:109.4282, lat:24.3267},
  {p:'广西壮族自治区', c:'桂林',   lng:110.2899, lat:25.2736},
  {p:'广西壮族自治区', c:'梧州',   lng:111.2797, lat:23.4831},
  {p:'广西壮族自治区', c:'北海',   lng:109.1197, lat:21.4815},
  {p:'广西壮族自治区', c:'防城港', lng:108.3552, lat:21.6862},
  {p:'广西壮族自治区', c:'钦州',   lng:108.6550, lat:21.9737},
  {p:'广西壮族自治区', c:'贵港',   lng:109.5990, lat:23.0866},
  {p:'广西壮族自治区', c:'玉林',   lng:110.1628, lat:22.6540},
  {p:'广西壮族自治区', c:'百色',   lng:106.6179, lat:23.9036},
  {p:'广西壮族自治区', c:'贺州',   lng:111.5522, lat:24.4027},
  {p:'广西壮族自治区', c:'河池',   lng:108.0854, lat:24.6926},
  {p:'广西壮族自治区', c:'来宾',   lng:109.2274, lat:23.7519},
  {p:'广西壮族自治区', c:'崇左',   lng:107.3641, lat:22.3761},
  // ── 海南省 ──
  {p:'海南省', c:'海口',   lng:110.3312, lat:20.0317},
  {p:'海南省', c:'三亚',   lng:109.5120, lat:18.2524},
  {p:'海南省', c:'三沙',   lng:112.3480, lat:16.8310},
  {p:'海南省', c:'儋州',   lng:109.5766, lat:19.5212},
  // ── 四川省 ──
  {p:'四川省', c:'成都',   lng:104.0668, lat:30.5728},
  {p:'四川省', c:'自贡',   lng:104.7790, lat:29.3392},
  {p:'四川省', c:'攀枝花', lng:101.7164, lat:26.5818},
  {p:'四川省', c:'泸州',   lng:105.4432, lat:28.8717},
  {p:'四川省', c:'德阳',   lng:104.3980, lat:31.1267},
  {p:'四川省', c:'绵阳',   lng:104.6792, lat:31.4678},
  {p:'四川省', c:'广元',   lng:105.8438, lat:32.4357},
  {p:'四川省', c:'遂宁',   lng:105.5926, lat:30.5328},
  {p:'四川省', c:'内江',   lng:105.0586, lat:29.5797},
  {p:'四川省', c:'乐山',   lng:103.7660, lat:29.5523},
  {p:'四川省', c:'南充',   lng:106.1108, lat:30.7952},
  {p:'四川省', c:'眉山',   lng:103.8317, lat:30.0592},
  {p:'四川省', c:'宜宾',   lng:104.6420, lat:28.7521},
  {p:'四川省', c:'广安',   lng:106.6333, lat:30.4758},
  {p:'四川省', c:'达州',   lng:107.4998, lat:31.2096},
  {p:'四川省', c:'雅安',   lng:103.0010, lat:30.0146},
  {p:'四川省', c:'巴中',   lng:106.7479, lat:31.8578},
  {p:'四川省', c:'资阳',   lng:104.6274, lat:30.1228},
  // ── 贵州省 ──
  {p:'贵州省', c:'贵阳',   lng:106.6302, lat:26.6477},
  {p:'贵州省', c:'六盘水', lng:104.8462, lat:26.5931},
  {p:'贵州省', c:'遵义',   lng:107.0298, lat:27.7250},
  {p:'贵州省', c:'安顺',   lng:105.9462, lat:26.2380},
  {p:'贵州省', c:'毕节',   lng:105.2853, lat:27.3013},
  {p:'贵州省', c:'铜仁',   lng:109.1911, lat:27.7260},
  {p:'贵州省', c:'黔西南', lng:104.8993, lat:25.0877},
  {p:'贵州省', c:'黔东南', lng:107.9820, lat:26.5837},
  {p:'贵州省', c:'黔南',   lng:107.5226, lat:26.2588},
  // ── 云南省 ──
  {p:'云南省', c:'昆明',   lng:102.7123, lat:25.0460},
  {p:'云南省', c:'曲靖',   lng:103.7971, lat:25.4915},
  {p:'云南省', c:'玉溪',   lng:102.5492, lat:24.3520},
  {p:'云南省', c:'保山',   lng:99.1681,  lat:25.1122},
  {p:'云南省', c:'昭通',   lng:103.7175, lat:27.3381},
  {p:'云南省', c:'丽江',   lng:100.2256, lat:26.8721},
  {p:'云南省', c:'普洱',   lng:100.9666, lat:22.8250},
  {p:'云南省', c:'临沧',   lng:100.0887, lat:23.8845},
  {p:'云南省', c:'楚雄',   lng:101.5282, lat:25.0444},
  {p:'云南省', c:'红河',   lng:103.3750, lat:23.3643},
  {p:'云南省', c:'文山',   lng:104.2453, lat:23.3736},
  {p:'云南省', c:'西双版纳', lng:100.7984, lat:22.0082},
  {p:'云南省', c:'大理',   lng:100.2677, lat:25.6065},
  {p:'云南省', c:'德宏',   lng:98.5887,  lat:24.4368},
  {p:'云南省', c:'怒江',   lng:99.7041,  lat:25.8222},
  {p:'云南省', c:'迪庆',   lng:99.7064,  lat:27.8262},
  // ── 西藏自治区 ──
  {p:'西藏自治区', c:'拉萨',   lng:91.1409, lat:29.6497},
  {p:'西藏自治区', c:'日喀则', lng:88.8857, lat:29.2657},
  {p:'西藏自治区', c:'昌都',   lng:97.1785, lat:31.1365},
  {p:'西藏自治区', c:'林芝',   lng:94.3610, lat:29.6520},
  {p:'西藏自治区', c:'山南',   lng:91.7733, lat:29.2371},
  {p:'西藏自治区', c:'那曲',   lng:92.0517, lat:31.4761},
  {p:'西藏自治区', c:'阿里',   lng:80.1058, lat:30.4044},
  // ── 陕西省 ──
  {p:'陕西省', c:'西安',   lng:108.9398, lat:34.3416},
  {p:'陕西省', c:'铜川',   lng:109.0428, lat:34.8966},
  {p:'陕西省', c:'宝鸡',   lng:107.2376, lat:34.3636},
  {p:'陕西省', c:'咸阳',   lng:108.7099, lat:34.3295},
  {p:'陕西省', c:'渭南',   lng:109.5125, lat:34.4998},
  {p:'陕西省', c:'延安',   lng:109.4898, lat:36.5853},
  {p:'陕西省', c:'汉中',   lng:107.0283, lat:33.0668},
  {p:'陕西省', c:'榆林',   lng:109.7348, lat:38.2856},
  {p:'陕西省', c:'安康',   lng:109.0298, lat:32.6840},
  {p:'陕西省', c:'商洛',   lng:109.9397, lat:33.8708},
  // ── 甘肃省 ──
  {p:'甘肃省', c:'兰州',   lng:103.8343, lat:36.0611},
  {p:'甘肃省', c:'嘉峪关', lng:98.2775,  lat:39.7720},
  {p:'甘肃省', c:'金昌',   lng:102.1880, lat:38.5214},
  {p:'甘肃省', c:'白银',   lng:104.1389, lat:36.5441},
  {p:'甘肃省', c:'天水',   lng:105.7245, lat:34.5806},
  {p:'甘肃省', c:'武威',   lng:102.6380, lat:37.9280},
  {p:'甘肃省', c:'张掖',   lng:100.4519, lat:38.9256},
  {p:'甘肃省', c:'平凉',   lng:106.6650, lat:35.5419},
  {p:'甘肃省', c:'酒泉',   lng:98.5197,  lat:39.7323},
  {p:'甘肃省', c:'庆阳',   lng:107.6366, lat:35.7107},
  {p:'甘肃省', c:'定西',   lng:104.6269, lat:35.5806},
  {p:'甘肃省', c:'陇南',   lng:105.7299, lat:33.4000},
  {p:'甘肃省', c:'临夏',   lng:103.2108, lat:35.6014},
  {p:'甘肃省', c:'甘南',   lng:102.9113, lat:34.9861},
  // ── 青海省 ──
  {p:'青海省', c:'西宁',   lng:101.7782, lat:36.6171},
  {p:'青海省', c:'海东',   lng:102.4045, lat:36.5021},
  {p:'青海省', c:'海北',   lng:100.9011, lat:36.9604},
  {p:'青海省', c:'黄南',   lng:102.0097, lat:35.5218},
  {p:'青海省', c:'海南',   lng:100.6218, lat:36.2841},
  {p:'青海省', c:'果洛',   lng:100.2449, lat:34.4780},
  {p:'青海省', c:'玉树',   lng:97.0079,  lat:33.0046},
  {p:'青海省', c:'海西',   lng:97.3706,  lat:37.3748},
  // ── 宁夏回族自治区 ──
  {p:'宁夏回族自治区', c:'银川',   lng:106.2782, lat:38.4663},
  {p:'宁夏回族自治区', c:'石嘴山', lng:106.3761, lat:39.0259},
  {p:'宁夏回族自治区', c:'吴忠',   lng:106.1993, lat:37.9854},
  {p:'宁夏回族自治区', c:'固原',   lng:106.2855, lat:36.0143},
  {p:'宁夏回族自治区', c:'中卫',   lng:105.1946, lat:37.5143},
  // ── 新疆维吾尔自治区 ──
  {p:'新疆维吾尔自治区', c:'乌鲁木齐', lng:87.6168, lat:43.8256},
  {p:'新疆维吾尔自治区', c:'克拉玛依', lng:84.8690, lat:45.5796},
  {p:'新疆维吾尔自治区', c:'吐鲁番',   lng:89.1840, lat:42.9473},
  {p:'新疆维吾尔自治区', c:'哈密',     lng:93.5153, lat:42.8333},
  {p:'新疆维吾尔自治区', c:'昌吉',     lng:87.3082, lat:44.0111},
  {p:'新疆维吾尔自治区', c:'博尔塔拉', lng:82.0598, lat:44.9068},
  {p:'新疆维吾尔自治区', c:'巴音郭楞', lng:86.1506, lat:41.7641},
  {p:'新疆维吾尔自治区', c:'阿克苏',   lng:80.2652, lat:41.1677},
  {p:'新疆维吾尔自治区', c:'克孜勒苏', lng:76.1746, lat:39.7142},
  {p:'新疆维吾尔自治区', c:'喀什',     lng:75.9929, lat:39.4707},
  {p:'新疆维吾尔自治区', c:'和田',     lng:79.9223, lat:37.1143},
  {p:'新疆维吾尔自治区', c:'伊犁',     lng:81.3178, lat:43.9218},
  {p:'新疆维吾尔自治区', c:'塔城',     lng:82.9855, lat:46.7474},
  {p:'新疆维吾尔自治区', c:'阿勒泰',   lng:88.1398, lat:47.8447},
  {p:'新疆维吾尔自治区', c:'石河子',   lng:86.0418, lat:44.3068},
];

// ══════════════════════════════════════
// 五行逻辑函数
// ══════════════════════════════════════

// 某五行对日主的关系
function getRelation(elemWx, dayWx) {
  if (elemWx === dayWx) return 'bijie';
  if (GENERATES[elemWx] === dayWx) return 'yin';
  if (GENERATES[dayWx] === elemWx) return 'shishang';
  if (RESTRICTS[dayWx] === elemWx) return 'cai';
  if (RESTRICTS[elemWx] === dayWx) return 'guansha';
  return null;
}

// 季节判断（月支索引 0-11）
// 月支: 子0丑1寅2卯3辰4巳5午6未7申8酉9戌10亥11
function getSeason(monBrIdx) {
  if ([1, 4, 7, 10].includes(monBrIdx)) return '四季末'; // 丑辰未戌（土支过渡月）
  if ([11, 0].includes(monBrIdx)) return '冬';            // 亥子
  if ([2, 3].includes(monBrIdx)) return '春';             // 寅卯
  if ([5, 6].includes(monBrIdx)) return '夏';             // 巳午
  if ([8, 9].includes(monBrIdx)) return '秋';             // 申酉
  return '春';
}

// 极端气候 = 冬（亥子）或 夏（巳午），需调候急救
function isExtreme(season) { return season === '冬' || season === '夏'; }

// ── 加权积分法判断旺衰 ──────────────────────────────────────────
// 来源：Horosa BaZi.java getShenTiQiangRuo()
// 权重：月支40 + 月干12 + 日支12 + 时干12 + 时支12 + 年干8 + 年支4 = 100
function analyzeQiangRuo(rt) {
  const dayIdx   = rt['tg'][2];
  const dayWx    = STEM_WX[dayIdx];
  const monBrIdx = rt['dz'][1];
  const monWx    = BRANCH_WX[monBrIdx];

  const items = [
    { wx: STEM_WX[rt['tg'][0]],   w: 8  }, // 年干
    { wx: BRANCH_WX[rt['dz'][0]], w: 4  }, // 年支
    { wx: STEM_WX[rt['tg'][1]],   w: 12 }, // 月干
    { wx: BRANCH_WX[rt['dz'][1]], w: 40 }, // 月支（最重要）
    { wx: BRANCH_WX[rt['dz'][2]], w: 12 }, // 日支
    { wx: STEM_WX[rt['tg'][3]],   w: 12 }, // 时干
    { wx: BRANCH_WX[rt['dz'][3]], w: 12 }, // 时支
  ];

  let score = 0; // 帮扶积分（满分100）
  items.forEach(({ wx, w }) => {
    const rel = getRelation(wx, dayWx);
    if (rel === 'yin' || rel === 'bijie') score += w;
  });

  let qiangRuo;
  if (score >= 60)      qiangRuo = '身强';
  else if (score >= 40) qiangRuo = '平衡';
  else                  qiangRuo = '身弱';

  return { qiangRuo, score, dayIdx, dayWx, monBrIdx, monWx };
}

// 扶抑法喜用神（旺衰确定后使用）
function getFuyiXys(analysis) {
  const { qiangRuo, dayWx } = analysis;
  const xys = new Set();
  if (qiangRuo === '身强') {
    xys.add(GENERATES[dayWx]);  // 食伤
    xys.add(RESTRICTS[dayWx]);  // 财
    const guansha = Object.keys(RESTRICTS).find(k => RESTRICTS[k] === dayWx);
    if (guansha) xys.add(guansha); // 官杀
  } else {
    const yin = Object.keys(GENERATES).find(k => GENERATES[k] === dayWx);
    if (yin) xys.add(yin); // 印
    xys.add(dayWx);        // 比劫
  }
  return [...xys];
}

// 综合喜用神：调候优先原则
// 冬/夏月：调候绝对优先（先救命）+ 扶抑补充
// 春/秋/四季末 身强弱：扶抑为主 + 调候参考
// 春/秋/四季末 平衡：调候为主
function getXiYongShenFull(rt) {
  const analysis = analyzeQiangRuo(rt);
  const { qiangRuo, score, dayIdx, dayWx, monBrIdx } = analysis;
  const dayGan   = STEMS[dayIdx];
  const season   = getSeason(monBrIdx);
  const extreme  = isExtreme(season);
  const tiaohou  = XI_YONG_SHEN_TABLE[dayGan]?.[season] || [];
  const fuyi     = qiangRuo === '平衡' ? [] : getFuyiXys(analysis);

  let xys, method, detail;

  if (extreme) {
    // 极端气候：调候绝对优先，扶抑中不冲突的元素追加
    xys = [...tiaohou];
    fuyi.forEach(w => {
      if (!xys.includes(w) && !tiaohou.some(t => RESTRICTS[t] === w || RESTRICTS[w] === t))
        xys.push(w);
    });
    method = '调候优先';
    const seasonLabel = season === '冬' ? '寒冬' : '盛夏';
    detail = `${seasonLabel}极端气候，调候急救优先；`
           + (fuyi.length ? `扶抑（${fuyi.join('/')}）中与调候方向不冲突者一并取用` : '');

  } else if (qiangRuo === '平衡') {
    // 气候温和且平衡：直接用调候表
    xys = [...tiaohou];
    method = '调候为主';
    detail = `气候${season}，日主趋于平衡（积分${score}/100），以调候查表为主要依据`;

  } else {
    // 气候温和且有明显旺弱：扶抑为主，调候参考
    xys = [...fuyi];
    // 调候中主用神若与扶抑不冲突，纳入参考
    tiaohou.slice(0, 1).forEach(w => {
      if (!xys.includes(w) && !fuyi.some(f => RESTRICTS[w] === f || RESTRICTS[f] === w))
        xys.push(w);
    });
    method = '扶抑为主';
    detail = `气候${season}，日主${qiangRuo}（积分${score}/100），以旺衰扶抑为主；调候作参考`;
  }

  return { xys: [...new Set(xys)], method, season, extreme, qiangRuo, score, analysis, detail };
}

// 推荐城市（取前两个喜用神的城市，各3个）
function recommendCities(xiyongshens) {
  const result = [];
  const seen = new Set();
  xiyongshens.slice(0, 2).forEach(wx => {
    const list = CITIES[wx] || [];
    list.slice(0, 3).forEach(city => {
      const key = city.name + city.province;
      if (!seen.has(key)) { seen.add(key); result.push({ ...city, matchWx: wx }); }
    });
  });
  return result;
}

// ══════════════════════════════════════
// UI 初始化
// ══════════════════════════════════════

function buildProvinceSelect() {
  const sel = document.getElementById('province');
  const provinces = [...new Set(BIRTH_CITIES.map(c => c.p))];
  provinces.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    sel.appendChild(opt);
  });
}

function updateCitySelect() {
  const province = document.getElementById('province').value;
  const sel = document.getElementById('birth-city');
  sel.innerHTML = '';
  BIRTH_CITIES.filter(c => c.p === province).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.c; opt.textContent = c.c;
    sel.appendChild(opt);
  });
}

function buildYearSelect() {
  const sel = document.getElementById('year');
  const cur = new Date().getFullYear();
  for (let y = cur - 1; y >= 1940; y--) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = y + '年';
    if (y === 1990) opt.selected = true;
    sel.appendChild(opt);
  }
}

// ══════════════════════════════════════
// 结果渲染
// ══════════════════════════════════════

function renderBaziCard(rt) {
  const labels = ['年柱','月柱','日柱','时柱'];
  let html = '<div class="bazi-pillars">';
  for (let i = 0; i < 4; i++) {
    html += `<div class="pillar">
      <div class="pillar-label">${labels[i]}</div>
      <div class="pillar-stem" style="color:${WX_COLOR[STEM_WX[rt['tg'][i]]]}">${rt['ctg'][i]}</div>
      <div class="pillar-branch" style="color:${WX_COLOR[BRANCH_WX[rt['dz'][i]]]}">${rt['cdz'][i]}</div>
      <div class="pillar-wx">${STEM_WX[rt['tg'][i]]}·${BRANCH_WX[rt['dz'][i]]}</div>
    </div>`;
  }
  html += '</div>';
  // 额外信息
  html += `<div class="bazi-meta">
    <span>生肖：${rt['sx']}</span>
    <span>星座：${rt['xz']}</span>
    <span>性别：${rt['xb']}</span>
  </div>`;
  return html;
}

function renderAnalysis(xysResult) {
  const { xys, method, season, qiangRuo, score, analysis, detail } = xysResult;
  const { dayIdx, dayWx, monBrIdx, monWx } = analysis;

  const dayName = STEMS[dayIdx];
  const monName = BRANCHES[monBrIdx];

  const seasonLabels = { '冬':'寒冬（亥子月）', '夏':'盛夏（巳午月）',
    '春':'春季（寅卯月）', '秋':'秋季（申酉月）', '四季末':'季末（辰未戌丑月）' };
  const seasonColors = { '冬':'#2B5F8A', '夏':'#C84B31', '春':'#5C8A4A', '秋':'#B8A040', '四季末':'#8B6914' };
  const qiangColors  = { '身强':'#C84B31', '平衡':'#5C8A4A', '身弱':'#2B5F8A' };
  const methodLabels = { '调候优先':'调候优先（先救命）', '调候为主':'调候为主（平衡局）', '扶抑为主':'扶抑为主（调强弱）' };

  // 积分条
  const barFill = Math.round(score);
  const barColor = score >= 60 ? '#C84B31' : score >= 40 ? '#5C8A4A' : '#2B5F8A';

  let html = `
  <div class="analysis-block">
    <div class="analysis-row">
      <span class="label">日主</span>
      <span class="value day-master" style="color:${WX_COLOR[dayWx]}">${dayName}（${dayWx}）</span>
    </div>
    <div class="analysis-row">
      <span class="label">月令</span>
      <span class="value">${monName}（${monWx}）</span>
    </div>
    <div class="analysis-row">
      <span class="label">季节</span>
      <span class="value" style="color:${seasonColors[season]}">${seasonLabels[season]}</span>
    </div>
    <div class="analysis-row">
      <span class="label">旺衰</span>
      <span class="value">
        <span class="score-bar-wrap">
          <span class="score-bar" style="width:${barFill}%;background:${barColor}"></span>
        </span>
        <span style="color:${qiangColors[qiangRuo]}">  ${qiangRuo}</span>
      </span>
    </div>
    <div class="analysis-row xys-row">
      <span class="label">喜用神</span>
      <span class="value">
        ${xys.map(wx => `<span class="wx-badge" style="background:${WX_COLOR[wx]}">${WX_INFO[wx].icon} ${wx}</span>`).join('')}
      </span>
    </div>
  </div>
  <div class="wx-detail">
    ${xys.slice(0,2).map(wx => `
    <div class="wx-detail-item" style="border-left-color:${WX_COLOR[wx]}">
      <div class="wx-detail-header">
        <span style="color:${WX_COLOR[wx]}">${WX_INFO[wx].icon} ${WX_INFO[wx].title}（${WX_INFO[wx].nature}）</span>
      </div>
      <p class="wx-trait">${WX_INFO[wx].trait}</p>
      <p class="wx-region">分野方位：${WX_INFO[wx].region}</p>
    </div>`).join('')}
  </div>`;
  return html;
}

function renderCityCards(cities) {
  let html = '';
  cities.forEach(city => {
    const color = WX_COLOR[city.wuxing];
    html += `
    <div class="city-card" style="border-top-color:${color}">
      <div class="city-card-header">
        <div class="city-name">${city.name}</div>
        <div class="city-province">${city.province}</div>
        <div class="city-badge" style="background:${color}">${WX_INFO[city.wuxing].icon} ${city.wuxing}系城市</div>
      </div>
      <p class="city-desc">${city.desc}</p>
    </div>`;
  });
  return html;
}

// ══════════════════════════════════════
// 主流程
// ══════════════════════════════════════

function calculate(e) {
  e.preventDefault();

  const year    = parseInt(document.getElementById('year').value);
  const month   = parseInt(document.getElementById('month').value);
  const day     = parseInt(document.getElementById('day').value);
  const hourVal  = parseInt(document.getElementById('hour').value);
  const minuteVal = parseInt(document.getElementById('minute').value);
  const gender  = parseInt(document.getElementById('gender').value); // 0=男 1=女

  const provinceSel = document.getElementById('province').value;
  const citySel     = document.getElementById('birth-city').value;
  const cityObj     = BIRTH_CITIES.find(c => c.p === provinceSel && c.c === citySel)
                   || BIRTH_CITIES.find(c => c.p === provinceSel)
                   || { lng: 116.4074, lat: 39.9042 };

  // 调用 paipan.js 的 fatemaps（window.p 由 paipan.js 末尾初始化）
  const rt = p.fatemaps(gender, year, month, day, hourVal, minuteVal, 0, cityObj.lng, cityObj.lat);
  if (!rt) {
    alert('日期输入有误，请检查后重试');
    return;
  }

  const xysResult   = getXiYongShenFull(rt);
  const xiyongshens = xysResult.xys;
  const cities      = recommendCities(xiyongshens);

  // 渲染
  document.getElementById('bazi-display').innerHTML    = renderBaziCard(rt);
  document.getElementById('analysis-display').innerHTML = renderAnalysis(xysResult);
  document.getElementById('city-display').innerHTML    = renderCityCards(cities);

  // 显示结果区
  const resultEl = document.getElementById('result');
  resultEl.style.display = 'block';
  setTimeout(() => resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ══════════════════════════════════════
// 页面加载
// ══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  buildYearSelect();
  buildProvinceSelect();
  updateCitySelect();

  document.getElementById('province').addEventListener('change', updateCitySelect);
  document.getElementById('bazi-form').addEventListener('submit', calculate);
});
