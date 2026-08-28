---
# places 请按卡片展示顺序排列；routes 单独维护曲线与光点的移动顺序。
# coordinates 使用 [纬度, 经度]；image 和 instagram 可以留空或整行删除。
routes:
  - from:
      location: { zh: "北京", en: "Beijing" }
      coordinates: [39.9042, 116.4074]
    to:
      location: { zh: "洛杉矶", en: "Los Angeles" }
      coordinates: [34.1478, -118.1445]

  - from:
      location: { zh: "洛杉矶", en: "Los Angeles" }
      coordinates: [34.1478, -118.1445]
    to:
      location: { zh: "芝加哥", en: "Chicago" }
      coordinates: [41.8781, -87.6298]

  - from:
      location: { zh: "芝加哥", en: "Chicago" }
      coordinates: [41.8781, -87.6298]
    to:
      location: { zh: "洛杉矶", en: "Los Angeles" }
      coordinates: [34.1478, -118.1445]

  - from:
      location: { zh: "洛杉矶", en: "Los Angeles" }
      coordinates: [34.1478, -118.1445]
    to:
      location: { zh: "新加坡", en: "Singapore" }
      coordinates: [1.3521, 103.8198]

  - from:
      location: { zh: "新加坡", en: "Singapore" }
      coordinates: [1.3521, 103.8198]
    to:
      location: { zh: "上海", en: "Shanghai" }
      coordinates: [31.2304, 121.4737]

  - from:
      location: { zh: "上海", en: "Shanghai" }
      coordinates: [31.2304, 121.4737]
    to:
      location: { zh: "北京", en: "Beijing" }
      coordinates: [39.9042, 116.4074]

  - from:
      location: { zh: "北京", en: "Beijing" }
      coordinates: [39.9042, 116.4074]
    to:
      location: { zh: "米兰", en: "Milan" }
      coordinates: [45.4642, 9.19]

places:
  - coordinates: [39.9042, 116.4074]
    location:
      zh: "北京"
      en: "Beijing"
    time: "1998 - 2016"
    title:
      zh: "在北京长大"
      en: "Growing up in Beijing"
    instagram: ""
    content:
      zh: "我在北京度过了童年和少年时代，从小学到中学，这座城市装着我最早的记忆，也塑造了我认识世界的起点。"
      en: "I spent my childhood and teenage years in Beijing, from primary school through high school. The city holds my earliest memories and shaped the place from which I first understood the world."

  - coordinates: [48.8566, 2.3522]
    location:
      zh: "巴黎"
      en: "Paris"
    time:
      zh: "小学六年级"
      en: "Sixth grade"
    title:
      zh: "第一次走出国门"
      en: "My first trip abroad"
    instagram: ""
    content:
      zh: "小学六年级时，我第一次走出国门，跟着一次欧洲旅行来到巴黎。那是我第一次亲眼看到熟悉生活之外的世界。"
      en: "In sixth grade, I traveled abroad for the first time on a trip through Europe that brought me to Paris. It was my first glimpse of the world beyond everything familiar to me."

  - coordinates: [34.1478, -118.1445]
    location:
      zh: "洛杉矶"
      en: "Los Angeles"
    time: "2016.9 - 2021.4"
    title:
      zh: "艺术中心设计学院"
      en: "ArtCenter College of Design"
    instagram: ""
    image: "/assets/cover-image/ArtCenter.webp"
    content:
      zh: "我在 ArtCenter 度过了四年，把对设计的好奇变成了真正的手艺。这是一段亦痛亦幻、也重塑了我的追梦之路。"
      en: "I spent four years at ArtCenter, turning my curiosity about design into a real craft. It was an intense, dreamlike journey that reshaped how I pursue what matters to me."
    href: "/{lang}/experience/artcenter-college-of-design"

  - coordinates: [36.1069, -112.1129]
    location:
      zh: "大峡谷"
      en: "Grand Canyon"
    time:
      zh: "2019 · 实习前"
      en: "2019 · Before my internship"
    title:
      zh: "从洛杉矶开往芝加哥"
      en: "Driving from Los Angeles to Chicago"
    instagram: "https://www.instagram.com/p/B15gluwBGtY/"
    content:
      zh: "去芝加哥实习之前，我从洛杉矶出发一路向东自驾。大峡谷是这段横穿美国旅程中最难忘的停靠点之一。"
      en: "Before beginning my internship near Chicago, I drove east from Los Angeles. The Grand Canyon became one of the most unforgettable stops on that journey across the United States."

  - coordinates: [41.8781, -87.6298]
    location:
      zh: "芝加哥"
      en: "Chicago"
    time: "2019.9 - 2019.12"
    title:
      zh: "科勒公司实习"
      en: "Internship at Kohler"
    instagram: ""
    content:
      zh: "2019 年秋天，我在芝加哥附近的科勒公司实习。这是我第一次在美国中西部生活，也让我在校园之外体验真实的工作环境。"
      en: "In the fall of 2019, I interned at Kohler near Chicago. It was my first time living in the American Midwest and experiencing a professional environment beyond campus."

  - coordinates: [1.3521, 103.8198]
    location:
      zh: "新加坡"
      en: "Singapore"
    time: "2020.1 - 2023.5"
    title:
      zh: "欧洲工商管理学院"
      en: "INSEAD Business School"
    instagram: ""
    image: "/assets/cover-image/INSEAD.webp"
    content:
      zh: "我在 INSEAD 把设计思维带进课堂，与来自世界各地的人一起讨论，如何用设计的方法理解商业与真实的人。"
      en: "At INSEAD, I brought design thinking into the classroom and explored with people from around the world how design can help us understand business and real human needs."
    href: "/{lang}/experience/insead-business-school"

  - coordinates: [31.2304, 121.4737]
    location:
      zh: "上海"
      en: "Shanghai"
    time: "2020.4 - 2022.12"
    title:
      zh: "蚂蚁国际"
      en: "Ant International"
    instagram: ""
    image: "/assets/cover-image/Ant.webp"
    content:
      zh: "我在蚂蚁国际走进全球支付的复杂世界，开始理解每一次看似简单的付款背后，产品、技术与信任是如何共同运转的。"
      en: "At Ant International, I stepped into the complex world of global payments and learned how product, technology, and trust work together behind every seemingly simple transaction."
    href: "/{lang}/experience/ant-international"

  - coordinates: [39.9042, 116.4074]
    location:
      zh: "北京"
      en: "Beijing"
    time: "2023.1 - 2026.6"
    title:
      zh: "微软"
      en: "Microsoft"
    instagram: ""
    image: "/assets/images/microsoft/microsoft-IMG_0350.webp"
    content:
      zh: "我在微软把自己投入 AI 浪潮，在变化最快的地方做产品，也不断重新思考人与智能工具应该如何一起工作。"
      en: "At Microsoft, I went all in on AI—building products at the center of rapid change and continually rethinking how people and intelligent tools should work together."
    href: "/{lang}/experience/microsoft"

  - coordinates: [37.7749, -122.4194]
    location:
      zh: "旧金山"
      en: "San Francisco"
    time: "2024.5"
    title:
      zh: "满心好奇地重返加州"
      en: "A curious return to California"
    instagram: ""
    bubble:
      zh: "如果当时选择了另一班飞机？"
      en: "What if I took the other flight?"
    image: "/assets/images/2024-california-trip/2024-加州之行-Untitled.webp"
    content:
      zh: "我用一周重返加州，在自驾、海岸、旧餐厅和漫长交谈之间，重新想象那些人生岔路，以及自己可能成为的另一种样子。"
      en: "I returned to California for a week of driving, coastlines, old restaurants, and long conversations. Along the way, I revisited the turns my life had taken and imagined who else I might have become."
    href: "/{lang}/writing/2024-california-trip"


  - coordinates: [39.9042, 116.4074]
    location:
      zh: "北京"
      en: "Beijing"
    time:
      zh: "2024.9 - 至今"
      en: "2024.9 - Now"
    title:
      zh: "清华大学全球MBA"
      en: "Tsinghua Global MBA"
    instagram: ""
    image: "/assets/cover-image/SEM.webp"
    content:
      zh: "我在清华经管攻读全球 MBA，把多年产品与设计实践带回课堂，也用商业视角重新审视自己熟悉的问题。"
      en: "I am pursuing the Global MBA at Tsinghua SEM, bringing years of product and design practice back into the classroom while revisiting familiar problems through a business lens."
    href: "/{lang}/experience/tsinghua-global-mba"

  - coordinates: [40.8426, 111.7492]
    location:
      zh: "呼和浩特"
      en: "Hohhot"
    time: "2025.4"
    title:
      zh: "开车去内蒙古草原"
      en: "Driving to the Inner Mongolian grasslands"
    instagram: "https://www.instagram.com/p/DMP8jVJSWHB"
    content:
      zh: "2025 年 4 月，我驾车去往呼和浩特和内蒙古草原。公路不断伸向远方，城市的边界逐渐被开阔的天空和草原取代。"
      en: "In April 2025, I drove to Hohhot and the grasslands of Inner Mongolia. The road kept reaching toward the horizon as the edges of the city gave way to open sky and grassland."

  - coordinates: [45.4642, 9.19]
    location:
      zh: "米兰"
      en: "Milan"
    time: "2025"
    title:
      zh: "博科尼商学院交换"
      en: "Exchange at Bocconi University"
    instagram: "https://www.instagram.com/p/DKRe4jltQN1"
    content:
      zh: "2025 年，我来到米兰的博科尼商学院交换学习。短暂进入另一所学校和另一座城市，也让我从新的文化与商业语境重新看待熟悉的问题。"
      en: "In 2025, I studied abroad at Bocconi University in Milan. Spending time in a different school and city let me revisit familiar questions through a new cultural and business context."

  - coordinates: [43.7102, 7.262]
    location:
      zh: "尼斯"
      en: "Nice"
    time: "2025"
    title:
      zh: "我很爱尼斯的海"
      en: "The sea I loved in Nice"
    instagram: "https://www.instagram.com/p/DKXnSf6t8Zx"
    content:
      zh: "2025 年，我去法国尼斯旅行。我很爱那里的海——开阔、明亮，又有一种让时间慢下来的蓝。"
      en: "In 2025, I traveled to Nice, France. I fell in love with its sea—open, luminous, and a shade of blue that seemed to slow time down."

  - coordinates: [40.7128, -74.0060]
    location:
      zh: "东岸"
      en: "The East Coast"
    time: "2025.10"
    title:
      zh: "美国东岸之行"
      en: "First time in New York"
    instagram: "https://www.instagram.com/p/DPnXVBeDQB9"
    content:
      zh: "第一次去美国东岸，我走过纽约和波士顿，也来到瓦尔登湖边看星空。相比纽约的密集与喧闹，我尤其喜欢波士顿郊外的安静、树林和开阔夜空。"
      en: "On my first trip to the American East Coast, I explored New York and Boston and watched the stars by Walden Pond. Beyond New York’s density and energy, I especially loved the quiet woods, open skies, and slower rhythm outside Boston."

  - coordinates: [29.563, 106.5516]
    location:
      zh: "重庆"
      en: "Chongqing"
    time: "2026.4"
    title:
      zh: "在长江上坐船"
      en: "Sailing along the Yangtze"
    instagram: "https://www.instagram.com/p/DX3qZlnGsxF"
    content:
      zh: "2026 年 4 月，我在重庆坐船沿长江穿过城市。从江面看两岸层叠生长的建筑，让我看到了一座与陆地视角完全不同的重庆。"
      en: "In April 2026, I took a boat along the Yangtze through Chongqing. Seeing the city rise in layers from both riverbanks revealed a completely different Chongqing from the one seen on land."

---

这个文件是个人地球仪唯一且完整的内容数据源。Atlas 不会读取履历或其他内容文件来补全字段，正文不会显示在网站上。

- 每条记录填写 `coordinates`、`location`、`time`、`title` 和 `content`；`location` 只写城市名，不附加国家或地区；`image`、`bubble`、`href`、`instagram` 可选。
- `image` 可以直接复用 `public/assets/` 下的现有素材。
- `href` 可以填写站内链接，并用 `{lang}` 作为当前语言占位符，例如 `/{lang}/experience/microsoft`；同一坐标下只要有一条记录填写了 `href`，该地点就会被归类为经历点，并以较大的圆点显示。
- `instagram` 填写完整的公开帖子、Reel 或 Instagram TV 链接；填写后卡片会显示 `Instagram ↗`。它不会参与经历点分类，也不会在页面中加载 Instagram 嵌入脚本。
- `bubble` 建议控制在一句短问句以内；只在显式填写时随机出现。
- 同一地点可以维护多条记录；请为它们填写完全相同的 `coordinates`，地球会合并点位，但底部故事卡仍按数据顺序分别展示。
- `places` 的顺序只控制底部故事卡轨道，不再控制地球曲线。
- `routes` 用显式的 `from` / `to` 单独维护曲线和光点的移动顺序；只有这里列出的路线会被渲染。路线端点可以不对应故事卡或兴趣点，例如芝加哥。
