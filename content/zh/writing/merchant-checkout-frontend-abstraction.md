---
title: "商家收银台前端能力抽象"
date: "2022-08-12"
type: "思考"

---

<aside>
ℹ️

此篇文章抽象出了行业中常见的商户收银台前端能力，支付方式在售卖及受理揽客时，应考虑针对不同类别的商户能力制定不同的露出策略，并相应调整自己的受理标识、品牌教育和营销信息。

</aside>

### 容器自由类

指的是商户前端对于每一个渠道Logo的容器都是自由的，页面上下的素材都是自动排列的，不会对支付方式受理素材形成过多的限制，甚至可以展示营销、用教文案和超链接按钮，如：

![[thehut.com](http://thehut.com/) - 为The Hut Group旗下商户，使用THG通用电商能力](/assets/images/merchant-checkout-frontend-abstraction/thehut.webp)

<aside>
ℹ️

此种商户收银台多缺乏一致性

</aside>

### 方块容器给定尺寸

指的是商户前端对于每个渠道都是用一个固定尺寸的按钮、选项承载的，上面理论上只能摆放一个Logo，如：

![Farfetch, Drop和GooglePay选择绑卡页面](/assets/images/merchant-checkout-frontend-abstraction/farfetchdropgooglepay.webp)

### 每个渠道位定高，宽度自适应

指的是商户的前端要求每个渠道必须在特定高度内展示，宽度在不超过页面边缘的前提下不做限制，A+聚合logo多需要以左右摆放形式露出在收银台，如：

![UnivaPaycast - 日本的一家收单机构](/assets/images/merchant-checkout-frontend-abstraction/univapaycast.webp)

### 前端页面由多个复杂元素组成

指的是商户自身有复杂的前端框架以渲染父集、子集渠道（信用卡于卡组标），如：

![[allbirds.com](http://allbirds.com) - 使用Shopify建站](/assets/images/merchant-checkout-frontend-abstraction/allbirds.webp)

### 图片位为极小icon

指的是商户上仅用一个方块+文字代表支付渠道，多出现在移动端

![Trainline, Yamibuy 和 Gojek](/assets/images/merchant-checkout-frontend-abstraction/trainlineyamibuygojek.webp)
### 需要进行筛选的收银台

指的是商户的支付渠道是分层的，用户需要先选父集，再选子集，如：

![[thehut.com](http://thehut.com/) - 为The Hut Group旗下商户，使用THG通用电商能力](/assets/images/merchant-checkout-frontend-abstraction/thehut2.webp)

### 数娱类暗黑模式UI

游戏、视频、音乐等行业商户的整体UI多位暗色模式，因此收银台的渠道展示需要进行单独的加白底色处理：

![[2Game.com](2game.com) - 2Game是一个全球展业的游戏内容分销商](/assets/images/merchant-checkout-frontend-abstraction/2game.webp)

### 没有图片位类

指的是商户自身不具备图片展示任何支付渠道，多见于日本