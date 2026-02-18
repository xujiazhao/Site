---
title: "Merchant Checkout Frontend Capability Abstraction"
date: "2022-08-12"
type: "Thinking"

---

<aside>
ℹ️

This article abstracts common merchant checkout frontend capabilities found in the industry. When selling and promoting payment methods for acceptance, different exposure strategies should be developed for different types of merchant capabilities, with corresponding adjustments to acceptance marks, brand education, and marketing messages.

</aside>

### Free Container Type

Refers to merchants whose frontend provides a free-form container for each payment channel logo. The elements above and below are automatically arranged, imposing minimal constraints on payment method acceptance assets. They can even display marketing copy, educational text, and hyperlink buttons, such as:

![[thehut.com](http://thehut.com/) - A merchant under The Hut Group, using THG's universal e-commerce capabilities](/assets/images/merchant-checkout-frontend-abstraction/thehut.webp)

<aside>
ℹ️

This type of merchant checkout often lacks consistency

</aside>

### Fixed-Size Block Container

Refers to merchants whose frontend uses a fixed-size button or option to host each payment channel, where theoretically only one logo can be placed, such as:

![Farfetch, Drop, and Google Pay card selection pages](/assets/images/merchant-checkout-frontend-abstraction/farfetchdropgooglepay.webp)

### Fixed Height Per Channel, Auto-Width

Refers to merchants whose frontend requires each channel to be displayed within a specific height, with width unrestricted as long as it doesn't exceed the page boundary. Aggregated logos like A+ need to be displayed side by side on the checkout page, such as:

![UnivaPaycast - A Japanese payment acquirer](/assets/images/merchant-checkout-frontend-abstraction/univapaycast.webp)

### Frontend Page Composed of Multiple Complex Elements

Refers to merchants with complex frontend frameworks for rendering parent and child channels (e.g., credit cards and card network marks), such as:

![[allbirds.com](http://allbirds.com) - Built with Shopify](/assets/images/merchant-checkout-frontend-abstraction/allbirds.webp)

### Extremely Small Icon for Image Slot

Refers to merchants that use only a small square plus text to represent a payment channel, commonly seen on mobile:

![Trainline, Yamibuy, and Gojek](/assets/images/merchant-checkout-frontend-abstraction/trainlineyamibuygojek.webp)

### Checkout Requiring Selection/Filtering

Refers to merchants whose payment channels are layered — users need to select a parent category first, then a sub-category, such as:

![[thehut.com](http://thehut.com/) - A merchant under The Hut Group, using THG's universal e-commerce capabilities](/assets/images/merchant-checkout-frontend-abstraction/thehut2.webp)

### Dark Mode UI for Digital Entertainment

Merchants in gaming, video, music, and other entertainment industries often use dark mode UIs. Therefore, the payment channel display on the checkout page requires separate white background treatment:

![[2Game.com](2game.com) - 2Game is a global game content distributor](/assets/images/merchant-checkout-frontend-abstraction/2game.webp)

### No Image Slot Type

Refers to merchants that do not have the capability to display any payment channel images, commonly seen in Japan
