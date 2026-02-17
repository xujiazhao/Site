---
title: "移动在线支付 · 案例分析"
date: "2020-06-18"
type: "案例分析"

---

# 移动在线支付 · 案例分析

Created: June 18, 2020
Tags: Case Study
Language: 中文

<aside>
<img src="https://www.notion.so/icons/info-alternate_yellow.svg" alt="https://www.notion.so/icons/info-alternate_yellow.svg" width="40px" /> 这份调研是我做的第一份支付行业相关研究。

</aside>

## 绑定**银行卡（信用卡）并支付**

银行卡支付**是欧美市场最为主流也是最为常见的支付方式**，同时在用户感知上，银行卡绑卡不论在什么平台（钱包、电商）行为都是非常类似的，流程也相对简单。在多数平台中**通过银行卡付款是默认（或第一位）选项**，我选取了部分主流平台进行进一步观察。

Apple Pay和Google Pay均有添加银行卡的场景，但由于二者**都不可在结算过程中临时添加银行卡，**故不放在此节中。

### Uber Eats

![标准支付流程](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled.png)

标准支付流程

- 卡片选项在第一位；
- 可以照片扫描添加卡；
- 有卡bin识别（也会自动设置安全码位数）；
- 在卡信息输入页面，光标在用户输入过期时间后可以自动跳到CVV，然后可以跳到Zip Code，但输入完卡号则不行；
- 卡号不标准会提示（下图）；
- 这部分不需要持卡人姓名也不需要Billing Address，可能从用户信息提取？如果是别人的卡呢（如夫妻）？
- 界面标题是“Add Card”但是下方按钮是“SAVE”（应该是和直接添加银行卡用的一样的界面，所以内容一样）；
- 点击小问号是到期日和CVV的指引，但是用户必须要点击OK才能关闭指引，点击屏幕上方灰色部分不可以；
- 刚刚更新的，现在强制要求用户设置小费（最后一图）。

![几个分支/异常页面](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_1.png)

几个分支/异常页面

### Target （超级市场）

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_2.png)

- 第一个界面点开Select之后如果用户还没有绑定卡片则可以点击“Add payment card”（多余的灰色save按钮），如果有卡片则可以从绑定的多个卡片中选择。那么对于新用户来说可以不可以直接Add payment card？
- 支付方式仅支持卡片，或者可以直接在购物车界面使用Apple Pay支付；
- 整体形式是上滑浮窗；
- 有卡Bin识别（也会自动设置安全码位数）；
- 相比Uber，需要输入持卡人姓名；
- 光标自动跳动做的比Uber Eats好，在输入卡号到16位后也会跳动；
- 可视窗口非常小，但内容包括卡信息和Billing Address，字号也不小，所以内部需要滑动内容需要滑动；
- 按钮文案也是“SAVE”。

### GrabHub （外卖）

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_3.png)

- 卡信息输入后做脱敏；
- 日期输入使用用滚轮非常不方便；
- 按钮文案“save and proceed”有Moving Forward的感觉；
- 第二个界面相当多余；
- 卡片可以选择取消“Save my credit card information”以设置单次使用；
- required提醒有些不明所以，难道还有不requred的section吗？不过很可能欧美用户比较笨吧。

### 小结

在欧美市场，添加银行卡支付是绝对主流，部分平台甚至仅支持银行卡支付。其优势在于**免除了一切第三方登陆需要**，而劣势在于**卡号很长**，多数情况下用户需要将卡备在身边才能够输入卡号（扫卡或者手动输入），且账单地址等信息也很长。但对于任意一款钱包产品来说，添加银行卡绝对也是必不可少的流程。如有必要，则上文中Target和Uber的案例则非常有参考价值，**交互流程应尽量简短，索要信息应尽量少（查看下方对比图，选择支付渠道和添加支付渠道可以合并为一次交互）**，尽可能通过其他渠道获取持卡人信息和账户地址（如平台账户）。并且协助用户更快的输入信息。

在欧美市场之外，添加银行卡**可能需要额外的流程**。（如持卡人手机号验证等）

在欧美市场绑卡没有任何安全环境标示，我个人也觉得它无伤大雅，这一习惯在发展中国家可能并不存在。

## 绑定钱包支付

### **Paypal on Walmart （新用户）**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_4.png)

- Walmart 的文案“Enter”很奇怪；
- PayPal 被非常卑微的放在“+More”的section内，这可能是因为**Walmart的主要用户群都是美国中低产人口**，拥有信用卡都很难，更不要提钱包服务了；
- PayPal 服务是锁区的，不清楚它是否会判断访问IP来源，但是中美账户不互通，卡片跨国添加也有难度（根据个人经验，国内Visa卡片无法绑定美区PayPal账户）；
- Footer 中总会有**“Cancel and Return to Walmart.com”**链接，这个细节非常友好（同时暴露了Walmart的iOS App应该是WebApp直接封装的）；
- PayPal 新用户首先输入卡信息，再输入账号信息，这和PayPal官网的逻辑是相反的，说明它确实对于结账场景做了流程调整；
- 国家/地区根据IP自动选择，不同国家和地区索要的信息不一样，比如相比美国，中国账户注册还需要用户输入合法身份证件（身份证、驾驶证或者护照）；
- 国家选择非常不友好，这和其官网的国家选择页面（[https://www.paypal.com/welcome/signup/#/email_password](https://www.paypal.com/welcome/signup/#/email_password)）的两百个国家堆在一起一样不友好，但**显示语言会跟随国家选择做出改变**；

### **Paypal on Walmart （老用户）**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_5.png)

- 当登陆环境安全时，PayPal支付还是非常快捷的，在输入账户密码后（如果是二次登陆则还可以记录邮箱地址），并直接进入Pay with卡/银行账户列表，在这一界面底端有Chase Credit Card 的推广，用户也可以添加新的支付方式；
- Cancel and return to Walmart.com 按钮没有了；
- Chase Pay logo提示用户使用这张卡可以积累积分；
- **PayPal账户会保留在Walmart App 内**；
- 在支付成功后，PayPal App会推送支付成功提醒；
- 当账户设置了二次验证时，PayPal会在输入账密后要求验证身份，可以通过短信OTP或Authorator进行二次验证，但若此时登陆环境不安全（如VPN环境、新IP环境）会有概率无法登陆并在这一流程内反复循环，**最终支付失败，体验极差（如下图）**。

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_6.png)

### **VISA Checkout on Walmart（新用户）**

VISA Checkout 是 Visa 提供的线上支付渠道，首先很奇怪的是它全程并没有出现VISA Checkout 的Logo，这和他官网文案“Online buying is evolving. Now when you see this icon （右图）online checkout logo. at any site that accepts Visa, you can enjoy an easy, smart and secure checkout experience.”相悖。

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_7.png)

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_8.png)

- VISA Checkout 也被放在“+More”内；
- 点击按钮后Loading 界面会刷新两次，给用户造成了一定的困惑，且在Loading结束后，**上划浮窗会转化为Walmart页面内置浏览器，延续性不好**；
- 如果软件没有缓存，界面是会直接进入图三界面，要求用户直接填写邮箱地址，在此步骤并**不区分新老用户**，个人认为这一逻辑值得参考；
- 底部也有“Cancel and return to Walmart”；
- 界面样式比较奇怪，多余的横线和奇怪的黄线，online是个widow，强迫症表示爆炸；
- 新用户输入邮箱后直接进入卡信息界面，按照常规流程需要添加银行卡，添加界面设计非常中规中矩，除了下方地址有自动补全外，没有任何输入辅助，地址补全非常方便，**一次点击可以直接自动填充城市、州和邮编信息；**
- 点击下一步后，才会要求用户输入密码创建账户，但我点击SIGN UP后直接卡机，系统没有任何反应，等待很长时间后会跳出提示“Service is unavailable”，算是支付失败了，且无法返回Walmart 界面，必须重启应用。

### **VISA Checkout on Walmart（老用户）**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_9.png)

- 老用户进入登陆页面后，VISA会直接发送邮件OTP给用户**（无需用户发起请求）**，并且在顶端会有提示，在邮件服务比较快捷的环境下还算方便，但如果是网易、AOL这种邮箱服务我觉得可能会有延迟，同时系统默认勾选“在此设备上记住我”；
- 登陆后会直接显示用户已经绑定的卡片，此时如果直接点击继续会跳回Walmart完成渠道选择；
- 用户也可以编辑或添加卡片，添加新卡片时Billing Address则不需要重新填写，默认使用用户之前储存的账单地址；
- 返回Walmart后，只提示付款方式是Card ending in ####，**并不显示用户在使用“VISA Checkout”服务**，除非用户再次编辑支付方式，才会将两者关联显示；
- 备注：VISA Checkout 的网页端注册流程还是非常简便的：[https://secure.checkout.visa.com/](https://secure.checkout.visa.com/)

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_10.png)

### **Amazon Pay on Shopify Site (新用户)**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_11.png)

• 新用户直接使用Amazon Pay支付可以说是**相当复杂**的（左右横跳），我不认为一个完全没有Amazon账号的用户会主动选择使用Amazon Pay，在此不作详细分析。

### **Amazon Pay on Shopify Site (老用户)**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_12.png)

- 在登陆界面中，**配合Apple Keychain整体体验非常好**，光标会自动定位在邮箱输入框，且下方Keychain 自动跳出已储存账号信息，一次点击自动输入；
- 回到商户页面，嵌入Amazon Wallet的窗口尺寸非常大，并不会根据内容调节大小、**邮寄地址和缴费渠道确认会在商户界面处理**；
- Amazon体系下的UI元素非常容易识别，但并不漂亮；
- 下方系列图为额外安全验证（若登陆环境不安全则会在登陆后弹出），安全验证过程除了短信OTP之外，还可以将验证渠道推送到用户登陆过Amazon App（图3图4）的其他移动设备（这类验证方式很不普遍），在图2 Amzon App会推提醒，用户点击就可以切屏；
- 登陆后Amazon App还会推送登陆安全警报。

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_13.png)

### 小结

个人认为用户对于浏览器网购和App内网购还是会有**很大的认知差**，但很有可能在商户端二者的实现方式是一致的（Walmart App和Walmart.com界面和交互流程都是一致的），设计过程中则要考虑到用户的安全感，**多次切换/跳跃会对用户安全感造成很大的冲击**。PayPal如果没有恼人的安全验证，整体流程应是最为理想的，但其登陆界面并没有激活Apple Keychain，需要用户手动点击，是一个遗憾。卡添加在这类支付里也是一个相关环节，如有需要应参考前文内容。

多数情况下，**只要用户不卸载App，或清除浏览器Cache，商户都可以记忆用户绑定的支付方式，并在日后继续使用**。

特别值得注意的是，欧美市场类似服务几乎（99%）没有支付密码这一概念。

## 跳转钱包支付

### **GrabPay on Zalora**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_14.png)

- 不论新老用户，登陆界面都有使用条款确认，如果是法务需求则可以理解，**但感觉多一次点击有些多余**，老用户是否可以跳过？Next应该是如果是陌生手机号则进入新账号注册流程；
- 在页面顶端又一个临时的余额不足提醒（但并不现实当前账户余额？？），并引导用户充值，并且在这一界面会显示本次支付的金额数和奖励；
- 支付渠道**只能选择GrabPay余额**？？；
- 进入充值页面，下方显示充值卡片，并且可以进入后编辑充值卡片；
- 确认支付上面又显示一次使用条款确认，重复；
- 回到商户，整体支付逻辑和PayPal与VISA Checkout非常不同（我个人甚至没有见过任何类似的场景），二者的支付节点在商户，渠道仅仅是被绑定在单次结算中的，而Zalora支付节点在弹出的GrabPay页面中，模式更类似大陆的微信支付宝；

### Google Pay on Instacart

*安卓环境禁止用户截屏*

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_15.png)

- Google Pay的**Branding非常醒目**；
- Google 并不支持无Google 账户使用者支付，在北美使用电商平台用户应该是人手一个Google账户，同时其账户ID是从安卓系统抓取的；
- Google Pay内的支付渠道可以使用银行卡和PayPal，用户也可以选择添加银行卡，其实Google Pay后台还可以绑定银行结算账户，但这类消费并不支持；
- 添加银行卡时会**自动从Google Pay账户获取个人姓名和账单地址；**
- 如果用户只有Google 账户但没有Google Pay账户，则会要求用户添加银行卡和账单地址，姓名则自动从Google账户获取（可以编辑），并且在下方防止使用条款勾选框（默认勾选），**这一流程应该是最流畅的新用户转化流程**；
- 最后点击**“Continue”后会直接下单付款，有些猝不及防，**这一设定让我不得不去提交退款申请。ps：我的理解是前面商户内已经有了Buy with Google Pay的文案，所以这里就是完成这一操作而已，目前不确定单一账号/单一银行卡的的场景下是否可以一件下单；
- 目前我不了解更新款的安卓机是否能够有更快捷的用户交互流程。

### Apple Pay on Doordash

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_16.png)

- Apple Pay在移动端的交互流程都是统一的，不论是在Apple体系内进行支付还是在Apple体系外进行支付，再或者是线下支付；
- 如果用户的Apple Pay是设定好的，则可以一键调出认证页面，并且使用face ID或者Passcode支付，在页面中有**明确的账单信息**，这也是我使用过的**唯一一个调用硬件设备的支付流程**；
- iOS13.5为口罩做了优化，现在可以探测口罩并且缩短无效的扫脸时间；

### 小结

Apple在支付体验上摔同行几条街，但这主要还是要归结于其能够将**操作系统和硬件集合到用户交互流程中。**

用户认知上，不太可能将上述三种支付放到一类，GarbPay很明显就是调用了一个新的界面，而Google Pay则给了用户一定误导，这也是我最后勿下单的原因，而Apple Pay则是有非常明确的按钮文案，且配合保留在后层的商户界面提醒用户还在Loop里，认知会更加明确。

GrabPay这类跳出支付我个人只在大陆和东南亚见到过。

## BNPL

### **Klarna**

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_17.png)

- Klarna是一个定位欧美的Buy now Pay later 服务，它集成钱包、分期、和网购于一身，是一个商业模式比较创新的网购工具；
- 它自身**没有任何电商平台**，全部内容又系统从互联网抓去并投放给用户，在App内点击商品会弹出内置浏览器访问该商户网站进行操作，这意味着用户**不能跨站点购买，Klarna也没有自带收银台**；
- 当内置浏览器到达结算界面时，特别是要输入支付信息（银行卡，这也体现了Klarna定位欧美的属性），Klarna会嗅探到并引导用户点击“Pay with Klarna”，Klarna还会自动记录本次交易价格，并提醒用户价格可能不含税，是否添加10%的消费税金额（但美国部分地区最高消费税是10.25%）；
- klarna的模式是将单次消费分三周四期，并建立一张虚拟信用卡，建立瞬间会从用户预先设定的银行卡扣除1/4的金额，此处动画很酷；
- 回到商户页面Klarna也会自动将虚拟卡信息填充给商户，允许用户进行结算；
- 每一笔消费会有一张专门的虚拟卡、Klarna添加银行卡的界面非常简单（如下图）。

![Untitled](/assets/images/mobile-online-payment-case-study/移动在线支付-案例分析-Untitled_18.png)

- 在美国Affirm和Klarna等类似服务都在迅猛增长，当然超前消费本身就符合欧美消费者习惯，**甚至Klarna这是一个套娃，虚拟信用卡套真实信用卡**；
- 类似业务恐怕很难在发展中地区推行；
- 整体体验来讲对于刚上手的用户非常不友善，因为**交互流程完全没有参考和现有习惯**，我看了Youtube视频才明白Klarna是怎么使用的，服务本身也听起来像是诈骗；
- **消费主义陷阱！**