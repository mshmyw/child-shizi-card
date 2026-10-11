/* ============================================================================
   识字卡片 · 内容资源（数据 + 美术）
   ----------------------------------------------------------------------------
   本文件只有「内容」，没有逻辑。日常维护基本都改这里：

   · 加一个新字：在对应分类数组里加一条
       { char:'伞', words:['雨伞','打伞'], tip:'伞就是<b>下雨天的雨伞</b>', pic: SVG_HEAD + PIC_BG + `...SVG...` + SVG_TAIL },
     再把它加进 MOTION 表（决定卡片背面它是浮、是摆、还是转）。
   · 改组词 / 改解释：直接改 words 和 tip（tip 里可以用 <b> 高亮）。
   · 改插画：改 pic 里的 SVG 即可，画布固定 200×200，配色用 P.xxx。
   · 加一个分类：加一个 CAT('新分类', [...]) 数组，再在文件底部 DATA 和 CATS 里各加一处。
   ============================================================================ */

/* =======================================================================
   识字卡片
   每条数据：char 汉字 / words 组词 / tip 形象化解释 / pic 内联 SVG
   组词只写词语本身（4 岁孩子还用不到拼音），cat 由 CAT() 自动打标签
   ======================================================================= */
const P = { // 统一配色
  ink:'#6b5a3e', ink2:'#8c7350', line:'#a98d68',
  green:'#57c98b', greenD:'#3fae72', pink:'#ff8fa8', pinkD:'#e8617f',
  red:'#f2704f', redD:'#d9502f', orange:'#ffb03c', orangeD:'#e08c1c',
  blue:'#5bb8e8', blueD:'#3d9fd4', yellow:'#ffd455', grey:'#b9b1a4',
  white:'#fffdf7', brown:'#a9713f', purple:'#9b7bf0'
};
/* 插画统一画在 200×200 的 SVG 画布上 */
const SVG_HEAD = '<svg class="pic" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
const SVG_TAIL = '</svg>';
/* 每张插画都画在 200×200 的画布上·PIC_BG 是统一的圆角底板 */
const PIC_BG = '<rect class="pic-bg" x="0" y="0" width="200" height="200" rx="26" fill="#fffaf0"/>';

/* 插画运动性格：float 浮 / sway 摆 / wiggle 摇 / spin 转 / pulse 跳 / bob 点头 */
const MOTION = {
  // 会飞的、飘的、发光的 -> 浮
  日:'pulse', 月:'float', 雨:'float', 云:'float', 鸟:'float', 羽:'sway', 伞:'sway',
  鲸:'float', 灯:'pulse', 花:'sway', 草:'sway', 竹:'sway', 木:'sway', 萱:'sway',
  // 水里的 -> 摆
  鱼:'sway', 贝:'pulse', 蟹:'wiggle', 水:'pulse',
  // 会跑的、会转的 -> 摇 / 转
  马:'bob', 牛:'bob', 羊:'bob', 狗:'wiggle', 猫:'wiggle', 兔:'bob', 鸡:'bob', 车:'spin',
  // 剩下的默认轻柔浮动
};
const motionOf = ch => MOTION[ch] || 'float';
const CAT = (label, list) => list.map(d => ({ ...d, cat: label }));

/* ---------------------- 基础象形字 ---------------------- */
const BASE = CAT('基础', [
  { char:'日', words:['日出','日子','生日'],
    tip:'日就是<b>太阳</b>，圆圆的、暖洋洋的',
    pic: SVG_HEAD + PIC_BG + `
      <g stroke="${P.orangeD}" stroke-width="8" stroke-linecap="round">
        <line x1="100" y1="10" x2="100" y2="26"/><line x1="100" y1="174" x2="100" y2="190"/>
        <line x1="10" y1="100" x2="26" y2="100"/><line x1="174" y1="100" x2="190" y2="100"/>
        <line x1="33" y1="33" x2="45" y2="45"/><line x1="155" y1="155" x2="167" y2="167"/>
        <line x1="167" y1="33" x2="155" y2="45"/><line x1="45" y1="155" x2="33" y2="167"/>
      </g>
      <circle cx="100" cy="100" r="46" fill="${P.yellow}" stroke="${P.orange}" stroke-width="7"/>
      <circle cx="84" cy="92" r="5" fill="#7a5a20"/><circle cx="116" cy="92" r="5" fill="#7a5a20"/>
      <path d="M84 112 q16 16 32 0" stroke="#7a5a20" stroke-width="6" fill="none" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'月', words:['月亮','月光','月饼'],
    tip:'月就是<b>月亮</b>，晚上挂在天空，弯弯的',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#2f3a5e"/>
      <circle cx="42" cy="42" r="4" fill="#fff"/><circle cx="62" cy="30" r="3" fill="#ffe9a8"/>
      <circle cx="160" cy="150" r="3.5" fill="#fff"/><circle cx="32" cy="150" r="3" fill="#ffe9a8"/>
      <path d="M138 44 a60 60 0 0 0 -8 112 a78 78 0 0 1 8 -112 Z" fill="#ffe9a8" stroke="#f0cf7a" stroke-width="5"/>
      <g stroke="#dfe6ff" stroke-width="5" stroke-linecap="round" opacity=".9">
        <line x1="46" y1="120" x2="30" y2="140"/><line x1="58" y1="130" x2="42" y2="150"/>
      </g>` + SVG_TAIL },

  { char:'山', words:['大山','山峰','爬山'],
    tip:'山就是<b>高高的山峰</b>，三个尖尖连在一起',
    pic: SVG_HEAD + PIC_BG + `
      <circle cx="170" cy="42" r="16" fill="${P.orange}"/>
      <path d="M22 166 L70 74 L118 166 Z" fill="${P.greenD}"/>
      <path d="M70 74 L86 104 L54 104 Z" fill="${P.white}"/>
      <path d="M82 166 L134 58 L186 166 Z" fill="${P.green}"/>
      <path d="M134 58 L152 92 L116 92 Z" fill="${P.white}"/>
      <path d="M4 166 L42 104 L80 166 Z" fill="#8fd9ae"/>
      <line x1="6" y1="168" x2="194" y2="168" stroke="${P.greenD}" stroke-width="6" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'水', words:['喝水','水果','雨水'],
    tip:'水就是<b>会流动的水</b>，中间一条，两边溅开',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M0 128 q25 -20 50 0 t50 0 t50 0 t50 0 V200 H0 Z" fill="${P.blue}" opacity=".35"/>
      <path d="M100 22 C120 52 140 68 140 92 a40 40 0 0 1 -80 0 C60 68 80 52 100 22 Z"
            fill="${P.blue}" stroke="${P.blueD}" stroke-width="5"/>
      <path d="M88 78 a20 24 0 0 1 12 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M0 152 q25 -20 50 0 t50 0 t50 0 t50 0 V200 H0 Z" fill="${P.blueD}" opacity=".45"/>` + SVG_TAIL },

  { char:'火', words:['火苗','火车','大火'],
    tip:'火就是<b>红红的火焰</b>，往上蹿，很烫',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M100 24 C132 62 150 86 150 112 a50 50 0 0 1 -100 0 C50 86 68 62 100 24 Z"
            fill="${P.red}" stroke="${P.redD}" stroke-width="5"/>
      <path d="M100 70 C116 92 124 100 124 116 a24 24 0 0 1 -48 0 C76 100 84 92 100 70 Z"
            fill="${P.yellow}" stroke="${P.orange}" stroke-width="4"/>
      <path d="M100 100 C108 110 110 114 110 122 a10 10 0 0 1 -20 0 C90 114 92 110 100 100 Z" fill="#fff6cc"/>
      <g stroke="${P.orangeD}" stroke-width="5" stroke-linecap="round">
        <line x1="40" y1="150" x2="34" y2="170"/><line x1="160" y1="150" x2="166" y2="170"/>
      </g>` + SVG_TAIL },

  { char:'人', words:['大人','人们','人口'],
    tip:'人就是<b>站着的人</b>，左边一撇是腿，右边一捺是身子',
    pic: SVG_HEAD + PIC_BG + `
      <circle cx="100" cy="44" r="22" fill="#ffdcae" stroke="${P.ink}" stroke-width="5"/>
      <path d="M80 30 a22 22 0 0 1 40 0 a26 26 0 0 0 -40 0" fill="${P.ink}"/>
      <path d="M100 66 V116" stroke="${P.blue}" stroke-width="16" stroke-linecap="round"/>
      <path d="M100 78 L66 112" stroke="${P.blue}" stroke-width="14" stroke-linecap="round"/>
      <path d="M100 78 L134 112" stroke="${P.blue}" stroke-width="14" stroke-linecap="round"/>
      <path d="M100 116 L82 158" stroke="${P.ink2}" stroke-width="14" stroke-linecap="round"/>
      <path d="M100 116 L118 158" stroke="${P.ink2}" stroke-width="14" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'口', words:['开口','门口','人口'],
    tip:'口就是<b>张开的嘴巴</b>，方方的一圈',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="100" cy="104" rx="56" ry="44" fill="${P.pink}" stroke="${P.pinkD}" stroke-width="6"/>
      <path d="M44 104 q56 44 112 0 q-56 22 -112 0 Z" fill="#c94a68"/>
      <path d="M56 92 h88" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
      <g stroke="${P.pinkD}" stroke-width="5" stroke-linecap="round" opacity=".85">
        <line x1="24" y1="60" x2="10" y2="44"/><line x1="34" y1="44" x2="26" y2="24"/>
        <line x1="176" y1="60" x2="190" y2="44"/><line x1="166" y1="44" x2="174" y2="24"/>
      </g>` + SVG_TAIL },

  { char:'手', words:['小手','拍手','手心'],
    tip:'手就是<b>我们的手</b>，五个手指头',
    pic: SVG_HEAD + PIC_BG + `
      <g fill="#ffdcae" stroke="${P.ink}" stroke-width="5" stroke-linejoin="round">
        <rect x="58" y="86" width="84" height="76" rx="26"/>
        <rect x="62" y="30" width="20" height="70" rx="10"/>
        <rect x="86" y="20" width="20" height="80" rx="10"/>
        <rect x="110" y="26" width="20" height="74" rx="10"/>
        <rect x="133" y="44" width="20" height="58" rx="10"/>
        <rect x="30" y="98" width="34" height="20" rx="10" transform="rotate(-24 47 108)"/>
      </g>
      <path d="M74 116 q14 10 28 0" stroke="${P.ink2}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>` + SVG_TAIL },

  { char:'目', words:['目光','耳目','目录'],
    tip:'目就是<b>眼睛</b>，古代人的眼睛画成竖着的',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M18 100 q82 -60 164 0 q-82 60 -164 0 Z" fill="#fff" stroke="${P.ink}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="100" cy="100" r="30" fill="${P.brown}"/>
      <circle cx="100" cy="100" r="14" fill="#2b2b2b"/>
      <circle cx="90" cy="90" r="7" fill="#fff"/>
      <g stroke="${P.ink}" stroke-width="6" stroke-linecap="round">
        <line x1="34" y1="70" x2="24" y2="54"/><line x1="100" y1="58" x2="100" y2="40"/>
        <line x1="166" y1="70" x2="176" y2="54"/>
      </g>` + SVG_TAIL },

  { char:'木', words:['树木','木头','木马'],
    tip:'木就是<b>一棵树</b>，上面是枝叶，下面是树根',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M88 166 h24 V70 h-24 Z" fill="${P.brown}"/>
      <path d="M60 92 L100 58 L140 92 Z" fill="${P.green}" stroke="${P.greenD}" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="62" cy="84" r="20" fill="${P.green}"/>
      <circle cx="138" cy="84" r="20" fill="${P.green}"/>
      <circle cx="100" cy="62" r="24" fill="${P.greenD}"/>
      <path d="M100 118 L64 146" stroke="${P.brown}" stroke-width="10" stroke-linecap="round"/>
      <path d="M100 118 L136 146" stroke="${P.brown}" stroke-width="10" stroke-linecap="round"/>
      <line x1="52" y1="168" x2="148" y2="168" stroke="${P.greenD}" stroke-width="6" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'羽', words:['羽毛','马羽萱','羽翼'],
    tip:'羽就是<b>一根羽毛</b>，鸟儿靠它飞上天',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M64 150 C112 128 150 94 166 44" stroke="#c9b28c" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M64 150 C40 112 56 46 104 28 C134 18 166 34 166 44 C152 100 114 136 64 150 Z"
            fill="${P.blue}" stroke="${P.blueD}" stroke-width="4" stroke-linejoin="round"/>
      <g stroke="#e6f6ff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".9">
        <path d="M78 132 C96 110 106 86 108 62"/>
        <path d="M92 142 C112 120 126 96 128 70"/>
        <path d="M108 146 C128 126 144 102 148 74"/>
        <path d="M126 144 C144 126 158 102 162 74"/>
      </g>
      <path d="M64 150 L58 176" stroke="#c9b28c" stroke-width="6" stroke-linecap="round"/>` + SVG_TAIL },
]);

/* ---------------------- 动物 ---------------------- */
const ANIMAL = CAT('动物', [
  { char:'鸟', words:['小鸟','鸟窝','飞鸟'],
    tip:'鸟就是<b>长着翅膀的小鸟</b>，有尖嘴巴和尾巴',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="92" cy="118" rx="46" ry="40" fill="${P.blue}" stroke="${P.blueD}" stroke-width="5"/>
      <path d="M62 122 q30 26 62 2 q-30 34 -62 -2 Z" fill="#cdeaf8" stroke="${P.blueD}" stroke-width="4"/>
      <circle cx="60" cy="78" r="26" fill="${P.blue}" stroke="${P.blueD}" stroke-width="5"/>
      <circle cx="52" cy="72" r="5" fill="#2b2b2b"/><circle cx="50" cy="70" r="1.8" fill="#fff"/>
      <path d="M36 80 L14 88 L36 94 Z" fill="${P.orange}" stroke="${P.orangeD}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M134 108 q34 -14 50 -40" stroke="${P.blueD}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M84 152 v14 M104 152 v14" stroke="${P.orangeD}" stroke-width="6" stroke-linecap="round"/>
      <path d="M78 158 h14 M98 158 h14" stroke="${P.orangeD}" stroke-width="6" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'马', words:['小马','马羽萱','木马'],
    tip:'马就是<b>会跑的马</b>，头上有鬃毛，跑得飞快',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="90" cy="120" rx="52" ry="32" fill="${P.brown}" stroke="${P.ink2}" stroke-width="5"/>
      <g stroke="${P.ink2}" stroke-width="9" stroke-linecap="round">
        <path d="M60 146 L54 174"/><path d="M84 148 L80 176"/>
        <path d="M108 148 L114 176"/><path d="M132 142 L140 168"/>
      </g>
      <path d="M128 100 L146 58 L164 66 L150 116 Z" fill="${P.brown}" stroke="${P.ink2}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M132 74 Q136 34 160 40 Q174 46 166 72 Z" fill="${P.ink}"/>
      <path d="M166 48 L160 26 L180 38 Z" fill="${P.ink}"/>
      <path d="M138 64 l-8 -10 l14 -2 Z" fill="${P.brown}" stroke="${P.ink2}" stroke-width="3"/>
      <circle cx="156" cy="50" r="4.5" fill="#fff"/><circle cx="157" cy="50" r="2.2" fill="#2b2b2b"/>
      <path d="M40 112 q-24 8 -16 30 q10 18 26 4" fill="none" stroke="${P.ink2}" stroke-width="9" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'牛', words:['小牛','牛奶','水牛'],
    tip:'牛就是<b>头上有两只角的牛</b>，会产牛奶',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="106" cy="116" rx="52" ry="34" fill="#fffdf7" stroke="${P.ink}" stroke-width="5"/>
      <g fill="${P.ink}" opacity=".85">
        <ellipse cx="92" cy="112" rx="11" ry="8"/><ellipse cx="130" cy="124" rx="9" ry="7"/>
      </g>
      <circle cx="62" cy="86" r="30" fill="#fffdf7" stroke="${P.ink}" stroke-width="5"/>
      <path d="M44 66 q-16 -14 -6 -26 q14 6 16 20 Z" fill="${P.grey}" stroke="${P.ink}" stroke-width="4"/>
      <path d="M80 66 q16 -14 6 -26 q-14 6 -16 20 Z" fill="${P.grey}" stroke="${P.ink}" stroke-width="4"/>
      <circle cx="52" cy="84" r="4.5" fill="#2b2b2b"/><circle cx="72" cy="84" r="4.5" fill="#2b2b2b"/>
      <ellipse cx="62" cy="106" rx="16" ry="12" fill="${P.pink}" stroke="${P.pinkD}" stroke-width="4"/>
      <circle cx="56" cy="104" r="3" fill="${P.pinkD}"/><circle cx="68" cy="104" r="3" fill="${P.pinkD}"/>
      <g stroke="${P.ink}" stroke-width="9" stroke-linecap="round">
        <path d="M78 142 L74 172"/><path d="M132 144 L136 172"/>
      </g>` + SVG_TAIL },

  { char:'羊', words:['小羊','山羊','羊毛'],
    tip:'羊就是<b>毛卷卷的羊</b>，头上两只角弯弯的',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="106" cy="118" rx="54" ry="38" fill="${P.white}" stroke="${P.ink}" stroke-width="5"/>
      <g fill="#fff" stroke="${P.ink}" stroke-width="3">
        <circle cx="70" cy="106" r="16"/><circle cx="104" cy="96" r="17"/>
        <circle cx="140" cy="106" r="16"/><circle cx="86" cy="134" r="15"/><circle cx="124" cy="134" r="15"/>
      </g>
      <circle cx="62" cy="88" r="24" fill="#3a3a3a" stroke="#2b2b2b" stroke-width="4"/>
      <path d="M46 74 q-18 -8 -14 -24 q16 0 22 14" fill="none" stroke="${P.grey}" stroke-width="8" stroke-linecap="round"/>
      <path d="M78 74 q18 -8 14 -24 q-16 0 -22 14" fill="none" stroke="${P.grey}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="54" cy="86" r="4" fill="#fff"/><circle cx="72" cy="86" r="4" fill="#fff"/>
      <g stroke="#2b2b2b" stroke-width="9" stroke-linecap="round">
        <path d="M82 150 L78 174"/><path d="M132 150 L136 174"/>
      </g>` + SVG_TAIL },

  { char:'鸡', words:['小鸡','公鸡','鸡蛋'],
    tip:'鸡就是<b>喔喔叫的公鸡</b>，有红冠子和尖嘴巴',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#fff7e6"/>
      <g fill="#3f6b8f" stroke="#2f5470" stroke-width="4" stroke-linejoin="round">
        <path d="M124 100 Q160 76 172 44 Q180 66 168 96 Q158 122 132 130 Z"/>
        <path d="M126 118 Q166 108 180 84 Q180 108 162 130 Q148 146 128 144 Z"/>
      </g>
      <ellipse cx="96" cy="132" rx="44" ry="40" fill="#f5a23c" stroke="${P.orangeD}" stroke-width="5"/>
      <path d="M100 138 C76 128 56 138 48 158 C72 164 96 158 100 138 Z" fill="#ffcd7a" stroke="${P.orangeD}" stroke-width="3"/>
      <path d="M92 192 v10 M108 192 v10" stroke="${P.orangeD}" stroke-width="7" stroke-linecap="round"/>
      <path d="M80 200 h20 M100 200 h20" stroke="${P.orangeD}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="90" cy="92" r="30" fill="#f5a23c" stroke="${P.orangeD}" stroke-width="5"/>
      <path d="M74 68 Q70 46 90 52 Q104 58 96 70 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M98 64 Q104 44 116 54 Q124 64 112 72 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M78 78 C70 68 74 54 88 48 C90 62 86 72 78 78 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M100 44 Q104 34 114 38 Q110 48 100 44 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M66 96 L42 102 L66 110 Z" fill="${P.orange}" stroke="${P.orangeD}" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="86" cy="88" r="4.5" fill="#2b2b2b"/><circle cx="100" cy="88" r="4.5" fill="#2b2b2b"/>
      <path d="M88 116 q8 8 16 0" stroke="${P.orangeD}" stroke-width="4" fill="none" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'狗', words:['小狗','狗窝','狗尾巴'],
    tip:'狗就是<b>汪汪叫的小狗</b>，耳朵耷拉着，尾巴会摇',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M126 118 q28 -20 30 -46" stroke="${P.brown}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <ellipse cx="92" cy="128" rx="52" ry="38" fill="${P.brown}" stroke="${P.ink2}" stroke-width="5"/>
      <path d="M62 156 L56 178" stroke="${P.ink2}" stroke-width="10" stroke-linecap="round"/>
      <path d="M118 158 L124 178" stroke="${P.ink2}" stroke-width="10" stroke-linecap="round"/>
      <path d="M74 120 q18 14 36 0" stroke="${P.white}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".75"/>
      <circle cx="58" cy="74" r="28" fill="${P.brown}" stroke="${P.ink2}" stroke-width="5"/>
      <path d="M36 54 q-14 4 -12 24 q14 2 20 -12 Z" fill="${P.ink2}"/>
      <path d="M80 54 q14 4 12 24 q-14 2 -20 -12 Z" fill="${P.ink2}"/>
      <circle cx="48" cy="70" r="4.5" fill="#2b2b2b"/><circle cx="68" cy="70" r="4.5" fill="#2b2b2b"/>
      <ellipse cx="58" cy="90" rx="14" ry="10" fill="${P.ink2}"/>
      <path d="M44 96 q14 14 28 0" stroke="${P.pinkD}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M58 100 v8" stroke="${P.pinkD}" stroke-width="4" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'猫', words:['小猫','猫叫','花猫'],
    tip:'猫就是<b>喵喵叫的小猫</b>，有尖耳朵和长胡子',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#fdf7ec"/>
      <path d="M148 152 q26 -12 20 -48" stroke="${P.ink2}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <ellipse cx="96" cy="140" rx="48" ry="30" fill="${P.ink}" stroke="#3a3a3a" stroke-width="5"/>
      <g stroke="${P.white}" stroke-width="6" stroke-linecap="round" opacity=".85">
        <path d="M46 164 v12"/><path d="M76 176 v12"/><path d="M120 176 v12"/><path d="M150 164 v12"/>
      </g>
      <path d="M56 68 L46 26 L86 50 Z" fill="${P.ink}" stroke="#3a3a3a" stroke-width="4" stroke-linejoin="round"/>
      <path d="M132 68 L142 26 L102 50 Z" fill="${P.ink}" stroke="#3a3a3a" stroke-width="4" stroke-linejoin="round"/>
      <path d="M58 64 L52 38 L78 54 Z" fill="${P.pink}"/>
      <path d="M130 64 L136 38 L110 54 Z" fill="${P.pink}"/>
      <circle cx="94" cy="96" r="42" fill="${P.ink}" stroke="#3a3a3a" stroke-width="5"/>
      <ellipse cx="76" cy="90" rx="9" ry="11" fill="#ffe9a8"/>
      <ellipse cx="112" cy="90" rx="9" ry="11" fill="#ffe9a8"/>
      <ellipse cx="76" cy="90" rx="3" ry="9" fill="#2b2b2b"/>
      <ellipse cx="112" cy="90" rx="3" ry="9" fill="#2b2b2b"/>
      <path d="M88 110 h12 l-6 8 Z" fill="${P.pinkD}"/>
      <g stroke="#3a3a3a" stroke-width="4" stroke-linecap="round">
        <path d="M52 104 h-24"/><path d="M52 114 h-22"/>
        <path d="M136 104 h24"/><path d="M136 114 h22"/>
      </g>` + SVG_TAIL },

  { char:'兔', words:['小兔','兔子','白兔'],
    tip:'兔就是<b>长耳朵的小兔子</b>，爱吃萝卜和青菜',
    pic: SVG_HEAD + PIC_BG + `
      <ellipse cx="118" cy="150" rx="44" ry="30" fill="${P.white}" stroke="${P.ink}" stroke-width="5"/>
      <circle cx="168" cy="146" r="14" fill="#fff" stroke="${P.ink}" stroke-width="5"/>
      <ellipse cx="66" cy="112" rx="40" ry="38" fill="${P.white}" stroke="${P.ink}" stroke-width="5"/>
      <ellipse cx="52" cy="44" rx="14" ry="42" fill="${P.white}" stroke="${P.ink}" stroke-width="5" transform="rotate(-10 52 44)"/>
      <ellipse cx="52" cy="44" rx="6" ry="30" fill="${P.pink}" transform="rotate(-10 52 44)"/>
      <ellipse cx="86" cy="40" rx="14" ry="44" fill="${P.white}" stroke="${P.ink}" stroke-width="5" transform="rotate(6 86 40)"/>
      <ellipse cx="86" cy="40" rx="6" ry="32" fill="${P.pink}" transform="rotate(6 86 40)"/>
      <circle cx="52" cy="106" r="6" fill="#2b2b2b"/><circle cx="80" cy="106" r="6" fill="#2b2b2b"/>
      <ellipse cx="66" cy="126" rx="9" ry="7" fill="${P.pink}" stroke="${P.pinkD}" stroke-width="4"/>
      <path d="M58 122 q-16 -6 -22 4 M58 130 q-16 4 -22 12" stroke="${P.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M74 122 q16 -6 22 4 M74 130 q16 4 22 12" stroke="${P.ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="120" cy="172" r="7" fill="#fff" stroke="${P.ink}" stroke-width="4"/>` + SVG_TAIL },
]);

/* ---------------------- 植物 ---------------------- */
const PLANT = CAT('植物', [
  { char:'花', words:['花朵','开花','红花'],
    tip:'花就是<b>开在草里的花朵</b>，有花瓣和绿叶',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M0 176 q30 -22 60 0 t60 0 t60 0 V200 H0 Z" fill="${P.green}" opacity=".4"/>
      <line x1="100" y1="108" x2="100" y2="176" stroke="${P.greenD}" stroke-width="8" stroke-linecap="round"/>
      <path d="M100 144 q-30 -6 -34 -26 q28 -4 34 26 Z" fill="${P.green}" stroke="${P.greenD}" stroke-width="4"/>
      <path d="M100 158 q30 -6 34 -26 q-28 -4 -34 26 Z" fill="${P.green}" stroke="${P.greenD}" stroke-width="4"/>
      <g fill="${P.pink}" stroke="${P.pinkD}" stroke-width="4">
        <circle cx="100" cy="52" r="21"/><circle cx="68" cy="82" r="21"/>
        <circle cx="132" cy="82" r="21"/><circle cx="82" cy="114" r="21"/><circle cx="118" cy="114" r="21"/>
      </g>
      <circle cx="100" cy="88" r="18" fill="${P.yellow}" stroke="${P.orange}" stroke-width="4"/>` + SVG_TAIL },

  { char:'草', words:['小草','草地','青草'],
    tip:'草就是<b>绿绿的青草</b>，一根一根从土里长出来',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="152" width="200" height="48" fill="#c9a06a"/>
      <rect x="0" y="166" width="200" height="34" fill="#b98d55"/>
      <g stroke="${P.greenD}" stroke-width="7" fill="none" stroke-linecap="round">
        <path d="M100 150 C98 116 92 96 74 78"/>
        <path d="M100 150 C104 112 114 96 132 82"/>
        <path d="M100 150 C100 120 100 100 100 74"/>
      </g>
      <g stroke="#6fd79b" stroke-width="7" fill="none" stroke-linecap="round">
        <path d="M60 152 C56 128 48 116 34 106"/>
        <path d="M140 152 C144 128 152 116 166 106"/>
      </g>
      <g stroke="${P.green}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9">
        <path d="M74 78 q-12 -6 -16 -18"/><path d="M132 82 q12 -8 14 -20"/>
      </g>` + SVG_TAIL },

  { char:'竹', words:['竹子','竹林','竹叶'],
    tip:'竹就是<b>一节一节的竹子</b>，熊猫最爱吃',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="66" y="14" width="22" height="172" rx="9" fill="${P.green}" stroke="${P.greenD}" stroke-width="5"/>
      <rect x="122" y="24" width="18" height="162" rx="8" fill="#6fd79b" stroke="${P.greenD}" stroke-width="5"/>
      <g stroke="${P.greenD}" stroke-width="6" stroke-linecap="round">
        <line x1="62" y1="64" x2="92" y2="64"/><line x1="62" y1="118" x2="92" y2="118"/>
        <line x1="118" y1="86" x2="144" y2="86"/><line x1="118" y1="142" x2="144" y2="142"/>
      </g>
      <g fill="${P.green}" stroke="${P.greenD}" stroke-width="4" stroke-linejoin="round">
        <path d="M92 50 C126 36 154 44 166 60 C140 72 110 68 92 50 Z"/>
        <path d="M62 104 C28 92 10 100 4 116 C30 126 54 122 62 104 Z"/>
        <path d="M92 150 C122 142 146 150 156 166 C130 176 104 170 92 150 Z"/>
      </g>` + SVG_TAIL },

  { char:'果', words:['水果','果树','苹果'],
    tip:'果就是<b>树上的果子</b>，圆圆的、甜甜的',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M100 40 C100 24 108 16 118 14" stroke="${P.brown}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M100 44 C74 42 56 70 56 104 C56 142 80 170 100 170 C120 170 144 142 144 104 C144 70 126 42 100 44 Z"
            fill="${P.red}" stroke="${P.redD}" stroke-width="5"/>
      <path d="M104 42 C114 22 138 18 150 26 C140 46 118 52 104 42 Z" fill="${P.green}" stroke="${P.greenD}" stroke-width="4"/>
      <path d="M80 80 a34 30 0 0 1 14 -20" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>` + SVG_TAIL },

  { char:'萱', words:['萱草','马羽萱'],
    tip:'萱就是<b>萱草花</b>，也叫忘忧草，花瓣像小喇叭',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#fff5e0"/>
      <line x1="98" y1="96" x2="98" y2="176" stroke="${P.greenD}" stroke-width="7" stroke-linecap="round"/>
      <path d="M98 150 q-32 -8 -38 -30 q30 -2 38 30 Z" fill="${P.green}" stroke="${P.greenD}" stroke-width="4"/>
      <g stroke="${P.orangeD}" stroke-width="6" stroke-linecap="round">
        <path d="M98 68 C80 50 66 40 52 40"/>
        <path d="M98 68 C80 54 62 52 46 58"/>
        <path d="M98 68 C82 62 64 64 50 76"/>
      </g>
      <g fill="${P.orange}" stroke="${P.orangeD}" stroke-width="4" stroke-linejoin="round">
        <path d="M98 68 C76 46 46 42 34 54 C48 72 78 78 98 68 Z"/>
        <path d="M98 68 C78 56 50 58 40 74 C58 88 84 84 98 68 Z"/>
        <path d="M98 68 C82 64 60 72 56 92 C76 98 94 86 98 68 Z"/>
      </g>
      <circle cx="98" cy="70" r="7" fill="${P.yellow}" stroke="${P.orangeD}" stroke-width="3"/>` + SVG_TAIL },
]);

/* ---------------------- 海洋 ---------------------- */
const SEA = CAT('海洋', [
  { char:'鱼', words:['小鱼','金鱼','鱼汤'],
    tip:'鱼就是<b>水里的鱼</b>，有鳞片、尾巴和鳍',
    pic: SVG_HEAD + PIC_BG + `
      <path d="M0 140 q25 -18 50 0 t50 0 t50 0 t50 0 V200 H0 Z" fill="${P.blue}" opacity=".28"/>
      <path d="M30 104 q46 -44 108 0 q-62 44 -108 0 Z" fill="${P.orange}" stroke="${P.orangeD}" stroke-width="5"/>
      <path d="M138 104 L178 74 V134 Z" fill="${P.orangeD}"/>
      <circle cx="54" cy="98" r="8" fill="#fff"/><circle cx="54" cy="98" r="4" fill="#2b2b2b"/>
      <g stroke="#fff" stroke-width="4" fill="none" opacity=".8">
        <path d="M78 88 q10 16 0 32"/><path d="M98 86 q10 18 0 36"/><path d="M118 88 q10 16 0 32"/>
      </g>` + SVG_TAIL },

  { char:'贝', words:['贝壳','宝贝','海贝'],
    tip:'贝就是<b>海边的贝壳</b>，两片壳合在一起',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#eaf6ff"/>
      <path d="M100 168 L34 126 C34 74 64 34 100 34 C136 34 166 74 166 126 Z"
            fill="#ffd9e6" stroke="${P.pinkD}" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="${P.pinkD}" stroke-width="4" fill="none" opacity=".75">
        <path d="M100 168 V36"/><path d="M100 168 L68 44"/><path d="M100 168 L132 44"/>
        <path d="M100 168 L48 74"/><path d="M100 168 L152 74"/>
      </g>
      <circle cx="100" cy="168" r="9" fill="${P.pink}" stroke="${P.pinkD}" stroke-width="4"/>` + SVG_TAIL },

  { char:'蟹', words:['螃蟹','河蟹','蟹壳'],
    tip:'蟹就是<b>横着走的螃蟹</b>，举着两只大钳子',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#eef8ff"/>
      <g stroke="${P.redD}" stroke-width="8" stroke-linecap="round" fill="none">
        <path d="M62 106 L30 86"/><path d="M62 122 L28 116"/><path d="M62 136 L32 148"/>
        <path d="M138 106 L170 86"/><path d="M138 122 L172 116"/><path d="M138 136 L168 148"/>
      </g>
      <ellipse cx="100" cy="122" rx="44" ry="32" fill="${P.red}" stroke="${P.redD}" stroke-width="5"/>
      <rect x="74" y="104" width="22" height="16" rx="6" fill="${P.white}" opacity=".9"/>
      <rect x="104" y="104" width="22" height="16" rx="6" fill="${P.white}" opacity=".9"/>
      <ellipse cx="78" cy="92" rx="13" ry="11" fill="${P.red}" stroke="${P.redD}" stroke-width="4"/>
      <ellipse cx="122" cy="92" rx="13" ry="11" fill="${P.red}" stroke="${P.redD}" stroke-width="4"/>
      <circle cx="78" cy="90" r="5" fill="#2b2b2b"/><circle cx="122" cy="90" r="5" fill="#2b2b2b"/>
      <path d="M56 106 Q28 70 44 52 Q64 58 66 96 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M52 62 L36 46" stroke="${P.redD}" stroke-width="8" stroke-linecap="round"/>
      <path d="M144 106 Q172 70 156 52 Q136 58 134 96 Z" fill="${P.red}" stroke="${P.redD}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M148 62 L164 46" stroke="${P.redD}" stroke-width="8" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'鲸', words:['鲸鱼','蓝鲸','鲸鱼喷水'],
    tip:'鲸就是<b>会喷水的大鲸鱼</b>，住在深深的海里',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#e8f4ff"/>
      <g stroke="${P.blue}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".85">
        <path d="M96 72 C90 52 104 46 100 28"/>
        <path d="M96 72 C82 56 66 58 60 42"/>
      </g>
      <circle cx="100" cy="20" r="7" fill="${P.blue}"/>
      <circle cx="58" cy="36" r="6" fill="${P.blue}"/>
      <circle cx="126" cy="30" r="5" fill="${P.blue}"/>
      <path d="M40 122 C60 90 130 88 158 112 C168 118 168 136 158 142 C130 164 62 158 40 138 Z"
            fill="${P.blue}" stroke="${P.blueD}" stroke-width="5"/>
      <path d="M154 112 q22 -22 46 -26 q-14 22 -36 32 Z" fill="${P.blue}" stroke="${P.blueD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M154 142 q22 22 46 26 q-14 -22 -36 -32 Z" fill="${P.blue}" stroke="${P.blueD}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M96 140 C92 154 82 162 70 166 C88 170 102 160 106 142 Z" fill="${P.blue}" stroke="${P.blueD}" stroke-width="4"/>
      <circle cx="60" cy="118" r="5.5" fill="#2b2b2b"/>
      <path d="M44 130 q16 10 32 2" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".8"/>
      <rect x="0" y="176" width="200" height="24" fill="${P.blue}" opacity=".3"/>` + SVG_TAIL },
]);

/* ---------------------- 物品 ---------------------- */
const THING = CAT('物品', [
  { char:'车', words:['汽车','火车','车子'],
    tip:'车就是<b>有轮子的车</b>，跑得稳又跑得快',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#f2f7fb"/>
      <rect x="96" y="34" width="34" height="30" rx="6" fill="${P.red}"/>
      <rect x="100" y="38" width="26" height="20" rx="4" fill="${P.blue}"/>
      <rect x="94" y="74" width="38" height="24" rx="6" fill="${P.red}"/>
      <rect x="98" y="78" width="30" height="16" rx="4" fill="#cdeaf8"/>
      <rect x="56" y="42" width="46" height="28" rx="10" fill="#ff7a59" stroke="${P.redD}" stroke-width="5"/>
      <rect x="42" y="86" width="122" height="46" rx="16" fill="${P.red}" stroke="${P.redD}" stroke-width="5"/>
      <rect x="84" y="94" width="40" height="26" rx="8" fill="#cdeaf8"/>
      <rect x="36" y="102" width="20" height="14" rx="7" fill="#ffe08a" stroke="${P.orange}" stroke-width="4"/>
      <circle cx="70" cy="140" r="20" fill="#3f3f3f" stroke="#2b2b2b" stroke-width="5"/>
      <circle cx="70" cy="140" r="7" fill="${P.grey}"/>
      <circle cx="140" cy="140" r="20" fill="#3f3f3f" stroke="#2b2b2b" stroke-width="5"/>
      <circle cx="140" cy="140" r="7" fill="${P.grey}"/>
      <line x1="12" y1="166" x2="188" y2="166" stroke="${P.grey}" stroke-width="6" stroke-linecap="round"/>` + SVG_TAIL },

  { char:'门', words:['大门','门口','开门'],
    tip:'门就是<b>家里的门</b>，两扇门板可以打开关上',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#fdf3e0"/>
      <rect x="50" y="48" width="12" height="122" rx="6" fill="#c96a2a"/>
      <rect x="138" y="48" width="12" height="122" rx="6" fill="#c96a2a"/>
      <rect x="62" y="48" width="38" height="122" rx="4" fill="${P.brown}" stroke="${P.ink2}" stroke-width="4"/>
      <rect x="100" y="48" width="38" height="122" rx="4" fill="${P.brown}" stroke="${P.ink2}" stroke-width="4"/>
      <rect x="130" y="104" width="9" height="9" rx="4.5" fill="${P.yellow}" stroke="${P.orangeD}" stroke-width="2.5"/>
      <rect x="60" y="104" width="9" height="9" rx="4.5" fill="${P.yellow}" stroke="${P.orangeD}" stroke-width="2.5"/>
      <rect x="44" y="166" width="112" height="12" rx="6" fill="${P.grey}"/>` + SVG_TAIL },

  { char:'伞', words:['雨伞','打伞','伞花'],
    tip:'伞就是<b>下雨天的雨伞</b>，撑开像一朵蘑菇',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#eaf6ff"/>
      <path d="M100 30 C120 30 136 46 140 90 H60 C64 46 80 30 100 30 Z" fill="#cdeaf8"/>
      <path d="M100 30 C138 30 170 60 178 90 H22 C30 60 62 30 100 30 Z" fill="none" stroke="${P.blueD}" stroke-width="5" stroke-linejoin="round"/>
      <g stroke="${P.blueD}" stroke-width="3.5" fill="none" opacity=".7">
        <path d="M60 90 C66 52 80 32 100 30"/><path d="M140 90 C134 52 120 32 100 30"/>
      </g>
      <g fill="${P.blue}">
        <path d="M22 90 q17 20 34 0 Z"/><path d="M56 90 q22 22 44 0 Z"/>
        <path d="M100 90 q17 20 34 0 Z"/><path d="M134 90 q11 20 22 0 Z"/>
      </g>
      <path d="M100 34 V150" stroke="${P.ink2}" stroke-width="6" stroke-linecap="round"/>
      <path d="M100 150 q0 22 20 22 q12 0 12 -12" stroke="${P.ink2}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <g fill="${P.blue}" opacity=".8">
        <circle cx="34" cy="130" r="5"/><circle cx="170" cy="142" r="5"/><circle cx="46" cy="160" r="4"/>
      </g>` + SVG_TAIL },

  { char:'灯', words:['台灯','电灯','路灯'],
    tip:'灯就是<b>会发光的台灯</b>，一按开关就亮',
    pic: SVG_HEAD + PIC_BG + `
      <rect x="0" y="0" width="200" height="200" rx="26" fill="#fff6d8"/>
      <path d="M100 26 L148 78 H52 Z" fill="${P.blue}" stroke="${P.blueD}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M100 26 L126 78 H74 Z" fill="#ffe9a8" opacity=".9"/>
      <circle cx="100" cy="92" r="16" fill="#ffe9a8"/>
      <g stroke="${P.orange}" stroke-width="5" stroke-linecap="round" opacity=".9">
        <path d="M100 108 v10"/><path d="M72 98 l-10 6"/><path d="M128 98 l10 6"/>
        <path d="M62 128 l-10 6"/><path d="M138 128 l10 6"/>
      </g>
      <path d="M100 34 V150" stroke="${P.ink2}" stroke-width="7" stroke-linecap="round"/>
      <rect x="62" y="150" width="76" height="12" rx="6" fill="${P.ink2}"/>
      <path d="M70 162 h60 l10 14 H60 Z" fill="${P.brown}" stroke="${P.ink2}" stroke-width="4" stroke-linejoin="round"/>` + SVG_TAIL },
]);

const DATA = [...BASE, ...ANIMAL, ...PLANT, ...SEA, ...THING];
const CATS = [
  { label:'全部', icon:'🌈' },
  { label:'基础', icon:'🖐' },
  { label:'动物', icon:'🐾' },
  { label:'植物', icon:'🌿' },
  { label:'海洋', icon:'🐟' },
  { label:'物品', icon:'🎒' },
];

window.HANZI_CARDS = { DATA, CATS, motionOf };
