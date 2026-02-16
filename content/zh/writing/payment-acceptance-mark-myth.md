---
title: "支付受理标迷思"
date: "2022-08-05"
---

# 支付受理标迷思

Created: August 5, 2022
Tags: Thinking
Language: 中文

<aside>
<img src="https://www.notion.so/icons/info-alternate_yellow.svg" alt="https://www.notion.so/icons/info-alternate_yellow.svg" width="40px" /> 这篇文章是我关于支付受理标的思考。

</aside>

支付受理标（Acceptance Mark），顾名思义，是在支付场景中向用户告知特定支付方式可以被受理的标识，这一概念伴随着银行卡行业的发展逐步成型，逐渐成为了各大银行、卡组展示品牌+拉动支付的重要媒介之一。对于他们来讲，用户需要被学习教育“见受理标即可付”。

![现在随处可见的各式各样的支付受理标](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled.png)

现在随处可见的各式各样的支付受理标

### **最初的受理标**

支付受理标的概念和名称出现甚晚，甚至于到现在Acceptance Mark这一名词都不是非常通行的行业名词，但这一事物是早早就出现的，下图中我们可以看到，VISA还叫BankAmericard（1977年前）以及MasterCard还叫Master Charge（1979年前）的时候，就已经在线下门店的门口张贴LOGO揽客了

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_1.png)

### **受理标与品牌**

而在这之中，MasterCard可谓煞费苦心，2019年最新版本的品牌是其斥800万美元巨资委托全球知名设计事务所Pentagram设计的：[Master Card 品牌设计成果｜Pentagram](https://www.pentagram.com/work/mastercard)

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_2.png)

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_3.png)

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_4.png)

### **银行电子化带来的困境**

而随着支付电子化和电商行业的发展，支付受理标也要开始面对来自网页和手机页面的挑战，不同于有一整面玻璃和柜台的线下场景，线上页面寸土寸金，而如何在有效的页面容器里展示清楚自己的受理标识成为了一个难题，牺牲大的，像MasterCard最新版本的品牌直接拿掉了文字，还有如美国运通American Express一样牺牲自己品牌名称的操作，只为消费者可以一眼看出这是AMEX：

![ezgif-1-909207c7da.gif](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-ezgif-1-909207c7da.gif)

值得一提的是，AmericanExpress最新的品牌设计方也是Pentagram（注）：[AMEX 品牌设计成果｜Pentagram](https://www.pentagram.com/work/american-express-1)

而在对比之下，可以看到新版的受理标识确实在线上的支付场景更加可读了：

![老版本](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_5.png)

老版本

![新版本](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_6.png)

新版本

（注：Pentagram几乎参与了北美所有大型金融企业的品牌设计项目，同时收费极高，[作品展示](https://www.pentagram.com/work/sector/banking-finance)）

### **电子时代群魔乱舞**

随着越来越多的电子钱包的推出，支付受理标识也越来越多，目前全世界能数得过名字的电子支付平台就有300余家，而他们的受理标识也各不相同，而这也给支付行业带来了很多困扰。在最早期，各种支付受理标识的维护都是人工的，而相应的素材也都是线下传递的，因此发卡方品牌更新并不能及时影响到最前线，就比如PayPal Logo Center现在维护的受理标识都还在使用最古早的Visa MasterCard受理标素材（给他们的售卖团队打零分！）：

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_7.png)

访问Logo Center：[PayPal Logo Center](https://www.paypal.com/us/webapps/mpp/logo-center)

各大平台为了解决这类问题花样百出，以Shopify为例，他们在Github上维护了一个开源受理标库，以支持全球所有使用Shopify的商家渲染相应支付方式，他们安排专门的审核员对全球各式各样的“payment icon”进行审核，并严格要求了所有支付受理标的制图样式。（Alipay+也负责在上面维护我们的入网钱包），目前Shopify共开源维护支付受理标355个。

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_8.png)

查看该项目维护的所有标识：[Shopify Payment Icon 开源库](https://github.com/activemerchant/payment_icons/tree/master/app/assets/images/payment_icons)

### 小结：支付受理标设计原则

1. 内容清晰可见，适合小容器展示
2. 单一色调，颜色鲜明；或明确的对冲色区块拼合
3. 包含明确的品牌元素信息

**一些常见受理标识**

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_9.png)

所以，中国大陆常见的几种支付方式，受理标识的设计都尚可，支付宝的为最佳，“支”字的体现，和抓人眼球的蓝色都可以让用户快速识别到支付宝的元素，而微信支付的问题则在于其标识本身并不体现微信元素。PayPal目前的品牌规范要求必须露出PayPal字样，所以受理标在小容器中的可识别性较低。

![Untitled](/assets/images/payment-acceptance-mark-myth/支付受理标迷思-Untitled_10.png)

全球范围内一些并不理想的案例（从左至右分别是：Touch ‘n Go eWallet, Samsung Pay, DBS PayLah, Paytm, Rabbit LINE Pay, TrueMoney Wallet）