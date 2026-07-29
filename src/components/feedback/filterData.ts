// Cascading data definitions for filters

export interface CascadeNode {
  label: string;
  children?: CascadeNode[];
}

// AI标签 - 5 levels
export const aiTagOptions: CascadeNode[] = [
  {
    label: "产品体验",
    children: [
      {
        label: "通话/信号/数据网络",
        children: [
          { label: "短信" },
          {
            label: "网络信号/数字传输",
            children: [
              {
                label: "网络信号体验",
                children: [
                  { label: "长期无信号" },
                  { label: "无5G信号" },
                  { label: "信号弱" },
                  { label: "信号不稳定" },
                  { label: "网络信号体验其他问题" },
                ],
              },
              { label: "数据网络功能" },
              { label: "数据网络体验" },
            ],
          },
          { label: "通话质量" },
          { label: "eSIM" },
          { label: "网络信号设置" },
          { label: "卫星通信" },
        ],
      },
      { label: "充电体验" },
      { label: "系统升级/系统更新" },
      { label: "性能功耗热体验" },
      { label: "稳定性" },
      { label: "系统易用性" },
    ],
  },
  { label: "服务" },
  { label: "移动互联网" },
  { label: "移动互联网 Internet" },
];

// 品牌
export const brandOptions: CascadeNode[] = [
  { label: "OPPO" },
  { label: "OnePlus" },
  { label: "realme" },
  { label: "VIVO" },
  { label: "华为" },
  { label: "荣耀" },
  { label: "小米" },
  { label: "红米" },
];

// 机型营销名 - 3 levels
export const marketingNameOptions: CascadeNode[] = [
  { label: "OnePlus" },
  {
    label: "OPPO",
    children: [
      {
        label: "A 系列",
        children: [
          { label: "A73" },
          { label: "OPPO A11" },
          { label: "OPPO A11K" },
          { label: "OPPO A11n" },
          { label: "OPPO A11t" },
          { label: "OPPO A11X" },
        ],
      },
      { label: "Find N 系列" },
      { label: "Find X 系列" },
      { label: "K 系列" },
      { label: "OPPO手表" },
      { label: "Reno 系列" },
    ],
  },
  { label: "vivo" },
  { label: "红米" },
  { label: "荣耀" },
  { label: "小米" },
];

// OS版本
export const osVersionOptions: CascadeNode[] = [
  { label: "17.1" },
  { label: "17.0.0" },
  { label: "16.1" },
  { label: "16.0.1" },
  { label: "16.0.0" },
  { label: "15.1" },
  { label: "15.0.2" },
  { label: "15.0.1" },
];

// 反馈来源 - 4 levels
export const feedbackSourceOptions: CascadeNode[] = [
  {
    label: "国内",
    children: [
      {
        label: "线上普通渠道",
        children: [
          { label: "logkit" },
          { label: "NPS" },
          { label: "VOC预警" },
          {
            label: "帮助与反馈",
            children: [
              { label: "录屏" },
              { label: "录音" },
              { label: "屏幕共享" },
              { label: "全局搜索" },
              { label: "全搜桌面搜索" },
              { label: "日历" },
            ],
          },
          { label: "电商评论" },
          { label: "机器人客服" },
        ],
      },
      { label: "VIP渠道" },
      { label: "线下普通渠道" },
    ],
  },
  { label: "海外" },
];

// 国家/地区
export const countryOptions: CascadeNode[] = [
  { label: "多米尼加共和国-DO" },
  { label: "台北-TW" },
  { label: "斯瓦尔巴和扬马延-SJ" },
  { label: "圣诞岛-CX" },
  { label: "英属维尔京群岛-VG" },
  { label: "圣文森特和格林纳丁斯-VC" },
  { label: "皮特凯恩群岛-PN" },
  { label: "津巴布韦-ZW" },
];

// 不良类型
export const defectTypeOptions: CascadeNode[] = [
  { label: "功能异常" },
  { label: "性能问题" },
  { label: "体验问题" },
  { label: "兼容性问题" },
  { label: "稳定性问题" },
  { label: "安全问题" },
];

// 内外销
export const domesticExportOptions: CascadeNode[] = [
  { label: "内销" },
  { label: "外销" },
];

// 社媒类型
export const socialMediaTypeOptions: CascadeNode[] = [
  { label: "原文" },
  { label: "评论" },
  { label: "回复" },
];

// 预警重要度
export const warningImportanceOptions: CascadeNode[] = [
  { label: "最高" },
  { label: "高" },
  { label: "较高" },
  { label: "中" },
  { label: "低" },
];

// 粉丝量运算符
export const fanCountOperators: CascadeNode[] = [
  { label: "大于" },
  { label: "大于等于" },
  { label: "小于" },
  { label: "小于等于" },
];

// OTA版本
export const otaVersionOptions: CascadeNode[] = [
  { label: "PJZ110_15.0.0.500(CN01)" },
  { label: "PJZ110_15.0.0.420(CN01)" },
  { label: "PHY110_14.0.1.700(CN01)" },
  { label: "PHY110_14.0.1.620(CN01)" },
  { label: "CPH2581_15.0.0.300(EX01)" },
  { label: "CPH2581_15.0.0.210(EX01)" },
];
