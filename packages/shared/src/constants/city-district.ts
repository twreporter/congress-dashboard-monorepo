import { Option } from '../utils'
import { CITY, City } from './city'

const CITY_DISTRICT = {
  [CITY.taipei]: [
    {
      label: '中正區',
      value: 'zhongzheng-dist',
    },
    {
      label: '大同區',
      value: 'datong-dist',
    },
    {
      label: '中山區',
      value: 'zhongshan-dist',
    },
    {
      label: '松山區',
      value: 'songshan-dist',
    },
    {
      label: '大安區',
      value: 'daan-dist',
    },
    {
      label: '萬華區',
      value: 'wanhua-dist',
    },
    {
      label: '信義區',
      value: 'xinyi-dist',
    },
    {
      label: '士林區',
      value: 'shilin-dist',
    },
    {
      label: '北投區',
      value: 'beitou-dist',
    },
    {
      label: '內湖區',
      value: 'neihu-dist',
    },
    {
      label: '南港區',
      value: 'nangang-dist',
    },
    {
      label: '文山區',
      value: 'wenshan-dist',
    },
  ],
  [CITY.keelung]: [
    {
      label: '仁愛區',
      value: 'renai-dist',
    },
    {
      label: '信義區',
      value: 'xinyi-dist',
    },
    {
      label: '中正區',
      value: 'zhongzheng-dist',
    },
    {
      label: '中山區',
      value: 'zhongshan-dist',
    },
    {
      label: '安樂區',
      value: 'anle-dist',
    },
    {
      label: '暖暖區',
      value: 'nuannuan-dist',
    },
    {
      label: '七堵區',
      value: 'qidu-dist',
    },
  ],
  [CITY.newTaipei]: [
    {
      label: '萬里區',
      value: 'wanli-dist',
    },
    {
      label: '金山區',
      value: 'jinshan-dist',
    },
    {
      label: '板橋區',
      value: 'banqiao-dist',
    },
    {
      label: '汐止區',
      value: 'xizhi-dist',
    },
    {
      label: '深坑區',
      value: 'shenkeng-dist',
    },
    {
      label: '石碇區',
      value: 'shiding-dist',
    },
    {
      label: '瑞芳區',
      value: 'ruifang-dist',
    },
    {
      label: '平溪區',
      value: 'pingxi-dist',
    },
    {
      label: '雙溪區',
      value: 'shuangxi-dist',
    },
    {
      label: '貢寮區',
      value: 'gongliao-dist',
    },
    {
      label: '新店區',
      value: 'xindian-dist',
    },
    {
      label: '坪林區',
      value: 'pinglin-dist',
    },
    {
      label: '烏來區',
      value: 'wulai-dist',
    },
    {
      label: '永和區',
      value: 'yonghe-dist',
    },
    {
      label: '中和區',
      value: 'zhonghe-dist',
    },
    {
      label: '土城區',
      value: 'tucheng-dist',
    },
    {
      label: '三峽區',
      value: 'sanxia-dist',
    },
    {
      label: '樹林區',
      value: 'shulin-dist',
    },
    {
      label: '鶯歌區',
      value: 'yingge-dist',
    },
    {
      label: '三重區',
      value: 'sanchong-dist',
    },
    {
      label: '新莊區',
      value: 'xinzhuang-dist',
    },
    {
      label: '泰山區',
      value: 'taishan-dist',
    },
    {
      label: '林口區',
      value: 'linkou-dist',
    },
    {
      label: '蘆洲區',
      value: 'luzhou-dist',
    },
    {
      label: '五股區',
      value: 'wugu-dist',
    },
    {
      label: '八里區',
      value: 'bali-dist',
    },
    {
      label: '淡水區',
      value: 'tamsui-dist',
    },
    {
      label: '三芝區',
      value: 'sanzhi-dist',
    },
    {
      label: '石門區',
      value: 'shimen-dist',
    },
  ],
  [CITY.lienchiang]: [
    {
      label: '南竿鄉',
      value: 'nangan-township',
    },
    {
      label: '北竿鄉',
      value: 'beigan-township',
    },
    {
      label: '莒光鄉',
      value: 'juguang-township',
    },
    {
      label: '東引鄉',
      value: 'dongyin-township',
    },
  ],
  [CITY.yilan]: [
    {
      label: '宜蘭市',
      value: 'yilan-city',
    },
    {
      label: '頭城鎮',
      value: 'toucheng-township',
    },
    {
      label: '礁溪鄉',
      value: 'jiaoxi-township',
    },
    {
      label: '壯圍鄉',
      value: 'zhuangwei-township',
    },
    {
      label: '員山鄉',
      value: 'yuanshan-township',
    },
    {
      label: '羅東鎮',
      value: 'luodong-township',
    },
    {
      label: '三星鄉',
      value: 'sanxing-township',
    },
    {
      label: '大同鄉',
      value: 'datong-township',
    },
    {
      label: '五結鄉',
      value: 'wujie-township',
    },
    {
      label: '冬山鄉',
      value: 'dongshan-township',
    },
    {
      label: '蘇澳鎮',
      value: 'suao-township',
    },
    {
      label: '南澳鄉',
      value: 'nanao-township',
    },
  ],
  [CITY.hsinchuCity]: [
    {
      label: '東區',
      value: 'east-dist',
    },
    {
      label: '北區',
      value: 'north-dist',
    },
    {
      label: '香山區',
      value: 'xiangshan-dist',
    },
  ],
  [CITY.hsinchuCounty]: [
    {
      label: '竹北市',
      value: 'zhubei-city',
    },
    {
      label: '湖口鄉',
      value: 'hukou-township',
    },
    {
      label: '新豐鄉',
      value: 'xinfeng-township',
    },
    {
      label: '新埔鎮',
      value: 'xinpu-township',
    },
    {
      label: '關西鎮',
      value: 'guanxi-township',
    },
    {
      label: '芎林鄉',
      value: 'qionglin-township',
    },
    {
      label: '寶山鄉',
      value: 'baoshan-township',
    },
    {
      label: '竹東鎮',
      value: 'zhudong-township',
    },
    {
      label: '五峰鄉',
      value: 'wufeng-township',
    },
    {
      label: '橫山鄉',
      value: 'hengshan-township',
    },
    {
      label: '尖石鄉',
      value: 'jianshi-township',
    },
    {
      label: '北埔鄉',
      value: 'beipu-township',
    },
    {
      label: '峨眉鄉',
      value: 'emei-township',
    },
  ],
  [CITY.taoyuan]: [
    {
      label: '中壢區',
      value: 'zhongli-dist',
    },
    {
      label: '平鎮區',
      value: 'pingzhen-dist',
    },
    {
      label: '龍潭區',
      value: 'longtan-dist',
    },
    {
      label: '楊梅區',
      value: 'yangmei-dist',
    },
    {
      label: '新屋區',
      value: 'xinwu-dist',
    },
    {
      label: '觀音區',
      value: 'guanyin-dist',
    },
    {
      label: '桃園區',
      value: 'taoyuan-dist',
    },
    {
      label: '龜山區',
      value: 'guishan-dist',
    },
    {
      label: '八德區',
      value: 'bade-dist',
    },
    {
      label: '大溪區',
      value: 'daxi-dist',
    },
    {
      label: '復興區',
      value: 'fuxing-dist',
    },
    {
      label: '大園區',
      value: 'dayuan-dist',
    },
    {
      label: '蘆竹區',
      value: 'luzhu-dist',
    },
  ],
  [CITY.miaoli]: [
    {
      label: '竹南鎮',
      value: 'zhunan-township',
    },
    {
      label: '頭份市',
      value: 'toufen-city',
    },
    {
      label: '三灣鄉',
      value: 'sanwan-township',
    },
    {
      label: '南庄鄉',
      value: 'nanzhuang-township',
    },
    {
      label: '獅潭鄉',
      value: 'shitan-township',
    },
    {
      label: '後龍鎮',
      value: 'houlong-township',
    },
    {
      label: '通霄鎮',
      value: 'tongxiao-township',
    },
    {
      label: '苑裡鎮',
      value: 'yuanli-township',
    },
    {
      label: '苗栗市',
      value: 'miaoli-city',
    },
    {
      label: '造橋鄉',
      value: 'zaoqiao-township',
    },
    {
      label: '頭屋鄉',
      value: 'touwu-township',
    },
    {
      label: '公館鄉',
      value: 'gongguan-township',
    },
    {
      label: '大湖鄉',
      value: 'dahu-township',
    },
    {
      label: '泰安鄉',
      value: 'taian-township',
    },
    {
      label: '銅鑼鄉',
      value: 'tongluo-township',
    },
    {
      label: '三義鄉',
      value: 'sanyi-township',
    },
    {
      label: '西湖鄉',
      value: 'xihu-township',
    },
    {
      label: '卓蘭鎮',
      value: 'zhuolan-township',
    },
  ],
  [CITY.taichung]: [
    {
      label: '中區',
      value: 'central-dist',
    },
    {
      label: '東區',
      value: 'east-dist',
    },
    {
      label: '南區',
      value: 'south-dist',
    },
    {
      label: '西區',
      value: 'west-dist',
    },
    {
      label: '北區',
      value: 'north-dist',
    },
    {
      label: '北屯區',
      value: 'beitun-dist',
    },
    {
      label: '西屯區',
      value: 'xitun-dist',
    },
    {
      label: '南屯區',
      value: 'nantun-dist',
    },
    {
      label: '太平區',
      value: 'taiping-dist',
    },
    {
      label: '大里區',
      value: 'dali-dist',
    },
    {
      label: '霧峰區',
      value: 'wufeng-dist',
    },
    {
      label: '烏日區',
      value: 'wuri-dist',
    },
    {
      label: '豐原區',
      value: 'fengyuan-dist',
    },
    {
      label: '后里區',
      value: 'houli-dist',
    },
    {
      label: '石岡區',
      value: 'shigang-dist',
    },
    {
      label: '東勢區',
      value: 'dongshi-dist',
    },
    {
      label: '和平區',
      value: 'heping-dist',
    },
    {
      label: '新社區',
      value: 'xinshe-dist',
    },
    {
      label: '潭子區',
      value: 'tanzi-dist',
    },
    {
      label: '大雅區',
      value: 'daya-dist',
    },
    {
      label: '神岡區',
      value: 'shengang-dist',
    },
    {
      label: '大肚區',
      value: 'dadu-dist',
    },
    {
      label: '沙鹿區',
      value: 'shalu-dist',
    },
    {
      label: '龍井區',
      value: 'longjing-dist',
    },
    {
      label: '梧棲區',
      value: 'wuqi-dist',
    },
    {
      label: '清水區',
      value: 'qingshui-dist',
    },
    {
      label: '大甲區',
      value: 'dajia-dist',
    },
    {
      label: '外埔區',
      value: 'waipu-dist',
    },
    {
      label: '大安區',
      value: 'daan-dist',
    },
  ],
  [CITY.changhua]: [
    {
      label: '彰化市',
      value: 'changhua-city',
    },
    {
      label: '芬園鄉',
      value: 'fenyuan-township',
    },
    {
      label: '花壇鄉',
      value: 'huatan-township',
    },
    {
      label: '秀水鄉',
      value: 'xiushui-township',
    },
    {
      label: '鹿港鎮',
      value: 'lukang-township',
    },
    {
      label: '福興鄉',
      value: 'fuxing-township',
    },
    {
      label: '線西鄉',
      value: 'xianxi-township',
    },
    {
      label: '和美鎮',
      value: 'hemei-township',
    },
    {
      label: '伸港鄉',
      value: 'shengang-township',
    },
    {
      label: '員林市',
      value: 'yuanlin-city',
    },
    {
      label: '社頭鄉',
      value: 'shetou-township',
    },
    {
      label: '永靖鄉',
      value: 'yongjing-township',
    },
    {
      label: '埔心鄉',
      value: 'puxin-township',
    },
    {
      label: '溪湖鎮',
      value: 'xihu-township',
    },
    {
      label: '大村鄉',
      value: 'dacun-township',
    },
    {
      label: '埔鹽鄉',
      value: 'puyan-township',
    },
    {
      label: '田中鎮',
      value: 'tianzhong-township',
    },
    {
      label: '北斗鎮',
      value: 'beidou-township',
    },
    {
      label: '田尾鄉',
      value: 'tianwei-township',
    },
    {
      label: '埤頭鄉',
      value: 'pitou-township',
    },
    {
      label: '溪州鄉',
      value: 'xizhou-township',
    },
    {
      label: '竹塘鄉',
      value: 'zhutang-township',
    },
    {
      label: '二林鎮',
      value: 'erlin-township',
    },
    {
      label: '大城鄉',
      value: 'dacheng-township',
    },
    {
      label: '芳苑鄉',
      value: 'fangyuan-township',
    },
    {
      label: '二水鄉',
      value: 'ershui-township',
    },
  ],
  [CITY.nantou]: [
    {
      label: '南投市',
      value: 'nantou-city',
    },
    {
      label: '中寮鄉',
      value: 'zhongliao-township',
    },
    {
      label: '草屯鎮',
      value: 'caotun-township',
    },
    {
      label: '國姓鄉',
      value: 'guoxing-township',
    },
    {
      label: '埔里鎮',
      value: 'puli-township',
    },
    {
      label: '仁愛鄉',
      value: 'renai-township',
    },
    {
      label: '名間鄉',
      value: 'mingjian-township',
    },
    {
      label: '集集鎮',
      value: 'jiji-township',
    },
    {
      label: '水里鄉',
      value: 'shuili-township',
    },
    {
      label: '魚池鄉',
      value: 'yuchi-township',
    },
    {
      label: '信義鄉',
      value: 'xinyi-township',
    },
    {
      label: '竹山鎮',
      value: 'zhushan-township',
    },
    {
      label: '鹿谷鄉',
      value: 'lugu-township',
    },
  ],
  [CITY.chiayiCity]: [
    {
      label: '東區',
      value: 'east-dist',
    },
    {
      label: '西區',
      value: 'west-dist',
    },
  ],
  [CITY.chiayiCounty]: [
    {
      label: '番路鄉',
      value: 'fanlu-township',
    },
    {
      label: '梅山鄉',
      value: 'meishan-township',
    },
    {
      label: '竹崎鄉',
      value: 'zhuqi-township',
    },
    {
      label: '阿里山鄉',
      value: 'alishan-township',
    },
    {
      label: '中埔鄉',
      value: 'zhongpu-township',
    },
    {
      label: '大埔鄉',
      value: 'dapu-township',
    },
    {
      label: '水上鄉',
      value: 'shuishang-township',
    },
    {
      label: '鹿草鄉',
      value: 'lucao-township',
    },
    {
      label: '太保市',
      value: 'taibao-city',
    },
    {
      label: '朴子市',
      value: 'puzi-city',
    },
    {
      label: '東石鄉',
      value: 'dongshi-township',
    },
    {
      label: '六腳鄉',
      value: 'liujiao-township',
    },
    {
      label: '新港鄉',
      value: 'xingang-township',
    },
    {
      label: '民雄鄉',
      value: 'minxiong-township',
    },
    {
      label: '大林鎮',
      value: 'dalin-township',
    },
    {
      label: '溪口鄉',
      value: 'xikou-township',
    },
    {
      label: '義竹鄉',
      value: 'yizhu-township',
    },
    {
      label: '布袋鎮',
      value: 'budai-township',
    },
  ],
  [CITY.yunlin]: [
    {
      label: '斗南鎮',
      value: 'dounan-township',
    },
    {
      label: '大埤鄉',
      value: 'dapi-township',
    },
    {
      label: '虎尾鎮',
      value: 'huwei-township',
    },
    {
      label: '土庫鎮',
      value: 'tuku-township',
    },
    {
      label: '褒忠鄉',
      value: 'baozhong-township',
    },
    {
      label: '東勢鄉',
      value: 'dongshi-township',
    },
    {
      label: '臺西鄉',
      value: 'taixi-township',
    },
    {
      label: '崙背鄉',
      value: 'lunbei-township',
    },
    {
      label: '麥寮鄉',
      value: 'mailiao-township',
    },
    {
      label: '斗六市',
      value: 'douliu-city',
    },
    {
      label: '林內鄉',
      value: 'linnei-township',
    },
    {
      label: '古坑鄉',
      value: 'gukeng-township',
    },
    {
      label: '莿桐鄉',
      value: 'citong-township',
    },
    {
      label: '西螺鎮',
      value: 'xiluo-township',
    },
    {
      label: '二崙鄉',
      value: 'erlun-township',
    },
    {
      label: '北港鎮',
      value: 'beigang-township',
    },
    {
      label: '水林鄉',
      value: 'shuilin-township',
    },
    {
      label: '口湖鄉',
      value: 'kouhu-township',
    },
    {
      label: '四湖鄉',
      value: 'sihu-township',
    },
    {
      label: '元長鄉',
      value: 'yuanzhang-township',
    },
  ],
  [CITY.tainan]: [
    {
      label: '中西區',
      value: 'west-central-dist',
    },
    {
      label: '東區',
      value: 'east-dist',
    },
    {
      label: '南區',
      value: 'south-dist',
    },
    {
      label: '北區',
      value: 'north-dist',
    },
    {
      label: '安平區',
      value: 'anping-dist',
    },
    {
      label: '安南區',
      value: 'annan-dist',
    },
    {
      label: '永康區',
      value: 'yongkang-dist',
    },
    {
      label: '歸仁區',
      value: 'guiren-dist',
    },
    {
      label: '新化區',
      value: 'xinhua-dist',
    },
    {
      label: '左鎮區',
      value: 'zuozhen-dist',
    },
    {
      label: '玉井區',
      value: 'yujing-dist',
    },
    {
      label: '楠西區',
      value: 'nanxi-dist',
    },
    {
      label: '南化區',
      value: 'nanhua-dist',
    },
    {
      label: '仁德區',
      value: 'rende-dist',
    },
    {
      label: '關廟區',
      value: 'guanmiao-dist',
    },
    {
      label: '龍崎區',
      value: 'longqi-dist',
    },
    {
      label: '官田區',
      value: 'guantian-dist',
    },
    {
      label: '麻豆區',
      value: 'madou-dist',
    },
    {
      label: '佳里區',
      value: 'jiali-dist',
    },
    {
      label: '西港區',
      value: 'xigang-dist',
    },
    {
      label: '七股區',
      value: 'qigu-dist',
    },
    {
      label: '將軍區',
      value: 'jiangjun-dist',
    },
    {
      label: '學甲區',
      value: 'xuejia-dist',
    },
    {
      label: '北門區',
      value: 'beimen-dist',
    },
    {
      label: '新營區',
      value: 'xinying-dist',
    },
    {
      label: '後壁區',
      value: 'houbi-dist',
    },
    {
      label: '白河區',
      value: 'baihe-dist',
    },
    {
      label: '東山區',
      value: 'dongshan-dist',
    },
    {
      label: '六甲區',
      value: 'liujia-dist',
    },
    {
      label: '下營區',
      value: 'xiaying-dist',
    },
    {
      label: '柳營區',
      value: 'liuying-dist',
    },
    {
      label: '鹽水區',
      value: 'yanshui-dist',
    },
    {
      label: '善化區',
      value: 'shanhua-dist',
    },
    {
      label: '大內區',
      value: 'danei-dist',
    },
    {
      label: '山上區',
      value: 'shanshang-dist',
    },
    {
      label: '新市區',
      value: 'xinshi-dist',
    },
    {
      label: '安定區',
      value: 'anding-dist',
    },
  ],
  [CITY.kaohsiung]: [
    {
      label: '新興區',
      value: 'xinxing-dist',
    },
    {
      label: '前金區',
      value: 'qianjin-dist',
    },
    {
      label: '苓雅區',
      value: 'lingya-dist',
    },
    {
      label: '鹽埕區',
      value: 'yancheng-dist',
    },
    {
      label: '鼓山區',
      value: 'gushan-dist',
    },
    {
      label: '旗津區',
      value: 'qijin-dist',
    },
    {
      label: '前鎮區',
      value: 'qianzhen-dist',
    },
    {
      label: '三民區',
      value: 'sanmin-dist',
    },
    {
      label: '楠梓區',
      value: 'nanzi-dist',
    },
    {
      label: '小港區',
      value: 'xiaogang-dist',
    },
    {
      label: '左營區',
      value: 'zuoying-dist',
    },
    {
      label: '仁武區',
      value: 'renwu-dist',
    },
    {
      label: '大社區',
      value: 'dashe-dist',
    },
    {
      label: '東沙群島',
      value: 'dongsha-islands',
    },
    {
      label: '南沙群島',
      value: 'nansha-islands',
    },
    {
      label: '岡山區',
      value: 'gangshan-dist',
    },
    {
      label: '路竹區',
      value: 'luzhu-dist',
    },
    {
      label: '阿蓮區',
      value: 'alian-dist',
    },
    {
      label: '田寮區',
      value: 'tianliao-dist',
    },
    {
      label: '燕巢區',
      value: 'yanchao-dist',
    },
    {
      label: '橋頭區',
      value: 'qiaotou-dist',
    },
    {
      label: '梓官區',
      value: 'ziguan-dist',
    },
    {
      label: '彌陀區',
      value: 'mituo-dist',
    },
    {
      label: '永安區',
      value: 'yongan-dist',
    },
    {
      label: '湖內區',
      value: 'hunei-dist',
    },
    {
      label: '鳳山區',
      value: 'fengshan-dist',
    },
    {
      label: '大寮區',
      value: 'daliao-dist',
    },
    {
      label: '林園區',
      value: 'linyuan-dist',
    },
    {
      label: '鳥松區',
      value: 'niaosong-dist',
    },
    {
      label: '大樹區',
      value: 'dashu-dist',
    },
    {
      label: '旗山區',
      value: 'qishan-dist',
    },
    {
      label: '美濃區',
      value: 'meinong-dist',
    },
    {
      label: '六龜區',
      value: 'liugui-dist',
    },
    {
      label: '內門區',
      value: 'neimen-dist',
    },
    {
      label: '杉林區',
      value: 'shanlin-dist',
    },
    {
      label: '甲仙區',
      value: 'jiaxian-dist',
    },
    {
      label: '桃源區',
      value: 'taoyuan-dist',
    },
    {
      label: '那瑪夏區',
      value: 'namaxia-dist',
    },
    {
      label: '茂林區',
      value: 'maolin-dist',
    },
    {
      label: '茄萣區',
      value: 'qieding-dist',
    },
  ],
  [CITY.penghu]: [
    {
      label: '馬公市',
      value: 'magong-city',
    },
    {
      label: '西嶼鄉',
      value: 'xiyu-township',
    },
    {
      label: '望安鄉',
      value: 'wangan-township',
    },
    {
      label: '七美鄉',
      value: 'qimei-township',
    },
    {
      label: '白沙鄉',
      value: 'baisha-township',
    },
    {
      label: '湖西鄉',
      value: 'huxi-township',
    },
  ],
  [CITY.kinmen]: [
    {
      label: '金沙鎮',
      value: 'jinsha-township',
    },
    {
      label: '金湖鎮',
      value: 'jinhu-township',
    },
    {
      label: '金寧鄉',
      value: 'jinning-township',
    },
    {
      label: '金城鎮',
      value: 'jincheng-township',
    },
    {
      label: '烈嶼鄉',
      value: 'lieyu-township',
    },
    {
      label: '烏坵鄉',
      value: 'wuqiu-township',
    },
  ],
  [CITY.pingtung]: [
    {
      label: '屏東市',
      value: 'pingtung-city',
    },
    {
      label: '三地門鄉',
      value: 'sandimen-township',
    },
    {
      label: '霧臺鄉',
      value: 'wutai-township',
    },
    {
      label: '瑪家鄉',
      value: 'majia-township',
    },
    {
      label: '九如鄉',
      value: 'jiuru-township',
    },
    {
      label: '里港鄉',
      value: 'ligang-township',
    },
    {
      label: '高樹鄉',
      value: 'gaoshu-township',
    },
    {
      label: '鹽埔鄉',
      value: 'yanpu-township',
    },
    {
      label: '長治鄉',
      value: 'changzhi-township',
    },
    {
      label: '麟洛鄉',
      value: 'linluo-township',
    },
    {
      label: '竹田鄉',
      value: 'zhutian-township',
    },
    {
      label: '內埔鄉',
      value: 'neipu-township',
    },
    {
      label: '萬丹鄉',
      value: 'wandan-township',
    },
    {
      label: '潮州鎮',
      value: 'chaozhou-township',
    },
    {
      label: '泰武鄉',
      value: 'taiwu-township',
    },
    {
      label: '來義鄉',
      value: 'laiyi-township',
    },
    {
      label: '萬巒鄉',
      value: 'wanluan-township',
    },
    {
      label: '崁頂鄉',
      value: 'kanding-township',
    },
    {
      label: '新埤鄉',
      value: 'xinpi-township',
    },
    {
      label: '南州鄉',
      value: 'nanzhou-township',
    },
    {
      label: '林邊鄉',
      value: 'linbian-township',
    },
    {
      label: '東港鎮',
      value: 'donggang-township',
    },
    {
      label: '琉球鄉',
      value: 'liuqiu-township',
    },
    {
      label: '佳冬鄉',
      value: 'jiadong-township',
    },
    {
      label: '新園鄉',
      value: 'xinyuan-township',
    },
    {
      label: '枋寮鄉',
      value: 'fangliao-township',
    },
    {
      label: '枋山鄉',
      value: 'fangshan-township',
    },
    {
      label: '春日鄉',
      value: 'chunri-township',
    },
    {
      label: '獅子鄉',
      value: 'shizi-township',
    },
    {
      label: '車城鄉',
      value: 'checheng-township',
    },
    {
      label: '牡丹鄉',
      value: 'mudan-township',
    },
    {
      label: '恆春鎮',
      value: 'hengchun-township',
    },
    {
      label: '滿州鄉',
      value: 'manzhou-township',
    },
  ],
  [CITY.taitung]: [
    {
      label: '臺東市',
      value: 'taitung-city',
    },
    {
      label: '綠島鄉',
      value: 'ludao-township',
    },
    {
      label: '蘭嶼鄉',
      value: 'lanyu-township',
    },
    {
      label: '延平鄉',
      value: 'yanping-township',
    },
    {
      label: '卑南鄉',
      value: 'beinan-township',
    },
    {
      label: '鹿野鄉',
      value: 'luye-township',
    },
    {
      label: '關山鎮',
      value: 'guanshan-township',
    },
    {
      label: '海端鄉',
      value: 'haiduan-township',
    },
    {
      label: '池上鄉',
      value: 'chishang-township',
    },
    {
      label: '東河鄉',
      value: 'donghe-township',
    },
    {
      label: '成功鎮',
      value: 'chenggong-township',
    },
    {
      label: '長濱鄉',
      value: 'changbin-township',
    },
    {
      label: '太麻里鄉',
      value: 'taimali-township',
    },
    {
      label: '金峰鄉',
      value: 'jinfeng-township',
    },
    {
      label: '大武鄉',
      value: 'dawu-township',
    },
    {
      label: '達仁鄉',
      value: 'daren-township',
    },
  ],
  [CITY.hualien]: [
    {
      label: '花蓮市',
      value: 'hualien-city',
    },
    {
      label: '新城鄉',
      value: 'xincheng-township',
    },
    {
      label: '秀林鄉',
      value: 'xiulin-township',
    },
    {
      label: '吉安鄉',
      value: 'jian-township',
    },
    {
      label: '壽豐鄉',
      value: 'shoufeng-township',
    },
    {
      label: '鳳林鎮',
      value: 'fenglin-township',
    },
    {
      label: '光復鄉',
      value: 'guangfu-township',
    },
    {
      label: '豐濱鄉',
      value: 'fengbin-township',
    },
    {
      label: '瑞穗鄉',
      value: 'ruisui-township',
    },
    {
      label: '萬榮鄉',
      value: 'wanrong-township',
    },
    {
      label: '玉里鎮',
      value: 'yuli-township',
    },
    {
      label: '卓溪鄉',
      value: 'zhuoxi-township',
    },
    {
      label: '富里鄉',
      value: 'fuli-township',
    },
  ],
} as const

export type DistrictValue = (typeof CITY_DISTRICT)[City][number]['value']

// Type for district option
export type DistrictOption = (typeof CITY_DISTRICT)[City][number]

/**
 * Get all districts for a given city
 * @param city - The city value
 * @returns Array of district options for the city, or empty array if city not found
 */
export function getDistrictsByCity(city: City): readonly Option[] {
  return CITY_DISTRICT[city] ?? []
}

/**
 * Check if a district value exists for a given city
 * @param city - The city value
 * @param district - The district value to validate
 * @returns true if the district exists in the city
 */
export function isValidDistrict(city: City, district: string): boolean {
  const districts = CITY_DISTRICT[city]
  if (!districts) return false
  return districts.some((d) => d.value === district)
}

/**
 * Get district label by value for a given city
 * @param city - The city value
 * @param district - The district value
 * @returns The district label if found, undefined otherwise
 */
export function getDistrictLabel(
  city: City,
  district: string
): string | undefined {
  const districts = CITY_DISTRICT[city]
  if (!districts) return undefined
  return districts.find((d) => d.value === district)?.label
}

/**
 * Get all district values across all cities (flattened)
 * @returns Array of all district values
 */
export function getAllDistrictValues(): string[] {
  return Object.values(CITY_DISTRICT).flatMap((districts) =>
    districts.map((d) => d.value)
  )
}

export default {
  getDistrictsByCity,
  isValidDistrict,
  getDistrictLabel,
  getAllDistrictValues,
}
