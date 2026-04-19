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
  {p:'北京市',     c:'北京',   lng:116.4074, lat:39.9042},
  {p:'天津市',     c:'天津',   lng:117.1901, lat:39.1255},
  {p:'河北省',     c:'石家庄', lng:114.5149, lat:38.0428},
  {p:'河北省',     c:'唐山',   lng:118.1807, lat:39.6300},
  {p:'河北省',     c:'保定',   lng:115.4648, lat:38.8736},
  {p:'山西省',     c:'太原',   lng:112.5489, lat:37.8706},
  {p:'山西省',     c:'大同',   lng:113.3000, lat:40.0767},
  {p:'内蒙古自治区', c:'呼和浩特', lng:111.7525, lat:40.8415},
  {p:'内蒙古自治区', c:'包头',   lng:109.8405, lat:40.6571},
  {p:'辽宁省',     c:'沈阳',   lng:123.4315, lat:41.8057},
  {p:'辽宁省',     c:'大连',   lng:121.6147, lat:38.9140},
  {p:'辽宁省',     c:'鞍山',   lng:122.9950, lat:41.1106},
  {p:'吉林省',     c:'长春',   lng:125.3245, lat:43.8868},
  {p:'吉林省',     c:'吉林市', lng:126.5500, lat:43.8378},
  {p:'黑龙江省',   c:'哈尔滨', lng:126.5358, lat:45.8022},
  {p:'黑龙江省',   c:'齐齐哈尔', lng:123.9540, lat:47.3543},
  {p:'上海市',     c:'上海',   lng:121.4737, lat:31.2304},
  {p:'江苏省',     c:'南京',   lng:118.7969, lat:32.0603},
  {p:'江苏省',     c:'苏州',   lng:120.6196, lat:31.2994},
  {p:'江苏省',     c:'无锡',   lng:120.3119, lat:31.4912},
  {p:'江苏省',     c:'扬州',   lng:119.4127, lat:32.3912},
  {p:'江苏省',     c:'南通',   lng:120.8641, lat:32.0160},
  {p:'江苏省',     c:'徐州',   lng:117.1851, lat:34.2692},
  {p:'浙江省',     c:'杭州',   lng:120.1551, lat:30.2741},
  {p:'浙江省',     c:'宁波',   lng:121.5500, lat:29.8750},
  {p:'浙江省',     c:'温州',   lng:120.6723, lat:28.0000},
  {p:'浙江省',     c:'绍兴',   lng:120.5802, lat:30.0316},
  {p:'安徽省',     c:'合肥',   lng:117.2272, lat:31.8206},
  {p:'安徽省',     c:'芜湖',   lng:118.3760, lat:31.3330},
  {p:'福建省',     c:'福州',   lng:119.2965, lat:26.0745},
  {p:'福建省',     c:'厦门',   lng:118.0894, lat:24.4798},
  {p:'福建省',     c:'泉州',   lng:118.6766, lat:24.8740},
  {p:'江西省',     c:'南昌',   lng:115.8582, lat:28.6829},
  {p:'山东省',     c:'济南',   lng:117.0009, lat:36.6758},
  {p:'山东省',     c:'青岛',   lng:120.3826, lat:36.0671},
  {p:'山东省',     c:'烟台',   lng:121.4485, lat:37.4638},
  {p:'山东省',     c:'潍坊',   lng:119.1619, lat:36.7069},
  {p:'河南省',     c:'郑州',   lng:113.6254, lat:34.7466},
  {p:'河南省',     c:'洛阳',   lng:112.4539, lat:34.6202},
  {p:'河南省',     c:'开封',   lng:114.3414, lat:34.7972},
  {p:'湖北省',     c:'武汉',   lng:114.3054, lat:30.5931},
  {p:'湖北省',     c:'宜昌',   lng:111.2900, lat:30.6923},
  {p:'湖南省',     c:'长沙',   lng:112.9388, lat:28.2282},
  {p:'湖南省',     c:'株洲',   lng:113.1340, lat:27.8274},
  {p:'广东省',     c:'广州',   lng:113.2644, lat:23.1291},
  {p:'广东省',     c:'深圳',   lng:114.0579, lat:22.5431},
  {p:'广东省',     c:'佛山',   lng:113.1220, lat:23.0218},
  {p:'广东省',     c:'珠海',   lng:113.5768, lat:22.2710},
  {p:'广东省',     c:'东莞',   lng:113.7518, lat:23.0207},
  {p:'广西壮族自治区', c:'南宁', lng:108.3669, lat:22.8170},
  {p:'海南省',     c:'海口',   lng:110.3312, lat:20.0442},
  {p:'海南省',     c:'三亚',   lng:109.5119, lat:18.2525},
  {p:'重庆市',     c:'重庆',   lng:106.5516, lat:29.5630},
  {p:'四川省',     c:'成都',   lng:104.0668, lat:30.5728},
  {p:'四川省',     c:'绵阳',   lng:104.6792, lat:31.4670},
  {p:'贵州省',     c:'贵阳',   lng:106.7135, lat:26.5783},
  {p:'云南省',     c:'昆明',   lng:102.7123, lat:25.0406},
  {p:'西藏自治区', c:'拉萨',   lng:91.1145,  lat:29.6445},
  {p:'陕西省',     c:'西安',   lng:108.9398, lat:34.3416},
  {p:'陕西省',     c:'咸阳',   lng:108.7055, lat:34.3296},
  {p:'甘肃省',     c:'兰州',   lng:103.8343, lat:36.0611},
  {p:'青海省',     c:'西宁',   lng:101.7782, lat:36.6171},
  {p:'宁夏回族自治区', c:'银川', lng:106.2782, lat:38.4681},
  {p:'新疆维吾尔自治区', c:'乌鲁木齐', lng:87.6168, lat:43.8256},
  {p:'新疆维吾尔自治区', c:'喀什', lng:75.9901, lat:39.4704},
];

// ══════════════════════════════════════
// 五行逻辑函数
// ══════════════════════════════════════

// 某五行对日主的关系
function getRelation(elemWx, dayWx) {
  if (elemWx === dayWx) return 'bijie';           // 比劫——帮扶
  if (GENERATES[elemWx] === dayWx) return 'yin';  // 印星——帮扶
  if (GENERATES[dayWx] === elemWx) return 'shishang'; // 食伤——克泄
  if (RESTRICTS[dayWx] === elemWx) return 'cai';  // 财星——克泄
  if (RESTRICTS[elemWx] === dayWx) return 'guansha'; // 官杀——克泄
  return null;
}

// 旺衰分析：返回分析结果对象
function analyzeQiangRuo(rt) {
  const dayIdx  = rt['tg'][2];
  const dayWx   = STEM_WX[dayIdx];
  const monBrIdx = rt['dz'][1]; // 月支
  const monWx   = BRANCH_WX[monBrIdx];

  // 月令得令 = 月支同气 or 月支生日主
  const deling = (monWx === dayWx) || (GENERATES[monWx] === dayWx);

  let helpers = 0, opponents = 0;

  for (let i = 0; i < 4; i++) {
    const stemWx = STEM_WX[rt['tg'][i]];
    const brWx   = BRANCH_WX[rt['dz'][i]];

    // 天干（跳过日干本身）
    if (i !== 2) {
      const rel = getRelation(stemWx, dayWx);
      if (rel === 'yin' || rel === 'bijie') helpers++;
      else opponents++;
    }
    // 地支（全部计入）
    const brRel = getRelation(brWx, dayWx);
    if (brRel === 'yin' || brRel === 'bijie') helpers++;
    else opponents++;
  }

  // 得令等效帮扶 +2
  const effectiveHelpers = helpers + (deling ? 2 : 0);
  const isQiang = effectiveHelpers > opponents;

  return { isQiang, dayIdx, dayWx, monBrIdx, monWx, deling, helpers, opponents };
}

// 喜用神五行列表（按重要性排序）
function getXiYongShen(analysis) {
  const { isQiang, dayWx } = analysis;
  const xys = [];

  if (isQiang) {
    // 强日主：喜食伤、财、官杀（泄耗克制）
    xys.push(GENERATES[dayWx]);                       // 食伤
    xys.push(RESTRICTS[dayWx]);                       // 财
    // 官杀 = 克日主的五行
    const guansha = Object.keys(RESTRICTS).find(k => RESTRICTS[k] === dayWx);
    if (guansha) xys.push(guansha);
  } else {
    // 弱日主：喜印、比劫（生扶）
    // 印 = 生日主的五行
    const yin = Object.keys(GENERATES).find(k => GENERATES[k] === dayWx);
    if (yin) xys.push(yin);
    xys.push(dayWx); // 比劫
  }
  return [...new Set(xys)]; // 去重
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

function renderAnalysis(analysis, xiyongshens) {
  const { isQiang, dayIdx, dayWx, monBrIdx, monWx, deling, helpers, opponents } = analysis;
  const dayName = STEMS[dayIdx];
  const monName = BRANCHES[monBrIdx];
  const wxInfo = WX_INFO[dayWx];
  const strength = isQiang ? '偏旺' : '偏弱';
  const strengthColor = isQiang ? '#C84B31' : '#2B5F8A';

  const delingText = deling
    ? `月令${monName}（${monWx}），${GENERATES[monWx] === dayWx ? `${monWx}生${dayWx}，` : ''}日主得令`
    : `月令${monName}（${monWx}），未能扶助日主，日主失令`;

  let html = `
  <div class="analysis-block">
    <div class="analysis-row">
      <span class="label">日主</span>
      <span class="value day-master" style="color:${WX_COLOR[dayWx]}">${dayName}（${dayWx}）</span>
    </div>
    <div class="analysis-row">
      <span class="label">月令</span>
      <span class="value">${delingText}</span>
    </div>
    <div class="analysis-row">
      <span class="label">帮扶</span>
      <span class="value">${helpers} 个印星·比劫 vs ${opponents} 个食伤·财·官杀</span>
    </div>
    <div class="analysis-row">
      <span class="label">旺衰</span>
      <span class="value strength" style="color:${strengthColor}">日主${strength}</span>
    </div>
    <div class="analysis-row xys-row">
      <span class="label">喜用神</span>
      <span class="value">
        ${xiyongshens.map(wx => `<span class="wx-badge" style="background:${WX_COLOR[wx]}">${WX_INFO[wx].icon} ${wx}</span>`).join('')}
      </span>
    </div>
  </div>
  <div class="wx-detail">
    ${xiyongshens.slice(0,2).map(wx => `
    <div class="wx-detail-item" style="border-left-color:${WX_COLOR[wx]}">
      <div class="wx-detail-header" style="border-color:${WX_COLOR[wx]}">
        <span style="color:${WX_COLOR[wx]}">${WX_INFO[wx].icon} ${WX_INFO[wx].title}</span>
        <span class="wx-nature">${WX_INFO[wx].nature}</span>
      </div>
      <p class="wx-trait">${WX_INFO[wx].trait}</p>
      <p class="wx-region">对应方位：${WX_INFO[wx].region}</p>
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

  const analysis    = analyzeQiangRuo(rt);
  const xiyongshens = getXiYongShen(analysis);
  const cities      = recommendCities(xiyongshens);

  // 渲染
  document.getElementById('bazi-display').innerHTML    = renderBaziCard(rt);
  document.getElementById('analysis-display').innerHTML = renderAnalysis(analysis, xiyongshens);
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
