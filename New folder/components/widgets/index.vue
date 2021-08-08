<template>
  <div>
    <div
      v-for="w in widgets"
      :key="w.id"
      :id="getWidgetId(w.viewData)"
      :class="[w.viewData, { 'parallax': isParallaxWidget(w) }]"
      :style="isParallaxWidget(w) ? `background-image: url('${$config.files.staticServerUrl}/${w.image}')` : null"
    >
      <component
        :is="getWidgetName(w)"
        :widget="w"
        :class="{ 'container': hasClass(w.viewData, 'container-inside') }"
        :data-aos="getAosAnimation(w.viewData)"
        data-aos-duration="750"
        data-aos-mirror="true"
        data-aos-anchor-placement="top-center"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Widgets',
  components: {
    AdsDefault: () => import('@/components/widgets/ads/Default'),
    BrandsDefault: () => import('@/components/widgets/brands/Default'),
    ComponentDefault: () => import('@/components/widgets/component/Default'),
    ComponentFooter: () => import('@/components/widgets/component/Footer'),
    ContactFormDefault: () => import('@/components/widgets/contactForm/Default'),
    ContactInfoDefault: () => import('@/components/widgets/contactInfo/Default'),
    ContactInfoFooter: () => import('@/components/widgets/contactInfo/Footer'),
    CountDownDefault: () => import('@/components/widgets/countDown/Default'),
    DateAndTimeDefault: () => import('@/components/widgets/dateAndTime/Default'),
    DealsDefault: () => import('@/components/widgets/deals/default'),
    FaqsDefault: () => import('@/components/widgets/faqs/default'),
    FormDefault: () => import('@/components/widgets/form/Default'),
    HeaderDefault: () => import('@/components/widgets/header/Default'),
    ItemsDefault: () => import('@/components/widgets/items/Default'),
    ItemsMetro: () => import('./items/Metro'),
    ItemsSocial: () => import('./items/Social'),
    NavDefault: () => import('@/components/widgets/nav/Default'),
    NavFooter: () => import('@/components/widgets/nav/Footer'),
    NotificationSubscriptionDefault: () => import('@/components/widgets/notificationSubscription/Default'),
    PortfolioDefault: () => import('@/components/widgets/portfolio/Default'),
    PostsDefault: () => import('@/components/widgets/posts/Default'),
    ProductCategoriesDefault: () => import('@/components/widgets/productCategories/Default'),
    ProductCategoriesNav: () => import('@/components/widgets/productCategories/Nav'),
    ProductGroupsDefault: () => import('@/components/widgets/productGroups/Default'),
    ProductsDefault: () => import('@/components/widgets/products/default'),
    ProductSetsDefault: () => import('@/components/widgets/productSets/default'),
    ProductSetsGrid: () => import('@/components/widgets/productSets/grid'),
    ProductSetTypesDefault: () => import('@/components/widgets/productSetTypes/Default'),
    ServicesDefault: () => import('@/components/widgets/services/Default'),
    SliderDefault: () => import('@/components/widgets/slider/Default'),
    TextDefault: () => import('@/components/widgets/text/Default'),
    TextFooter: () => import('./text/Footer'),
    TextImgLeft: () => import('./text/ImgLeft'),
    TextImgRight: () => import('./text/ImgRight'),
    TextParallax: () => import('@/components/widgets/text/Parallax'),
    VideoDefault: () => import('@/components/widgets/video/Default'),
    VideoHeader: () => import('@/components/widgets/video/Header')
  },
  props: ['widgets'],
  data () {
    return {
      widgetTypes: [
        'AdsDefault',
        'BrandsDefault',
        'ComponentDefault',
        'ComponentFooter',
        'ContactFormDefault',
        'ContactInfoDefault',
        'ContactInfoFooter',
        'CountDownDefault',
        'DateAndTimeDefault',
        'DealsDefault',
        'FaqsDefault',
        'FormDefault',
        'HeaderDefault',
        'ItemsDefault',
        'ItemsMetro',
        'ItemsSocial',
        'NavDefault',
        'NavFooter',
        'NotificationSubscriptionDefault',
        'PortfolioDefault',
        'PostsDefault',
        'ProductCategoriesDefault',
        'ProductCategoriesNav',
        'ProductGroupsDefault',
        'ProductsDefault',
        'ProductSetsDefault',
        'ProductSetsGrid',
        'ProductSetTypesDefault',
        'ServicesDefault',
        'SliderDefault',
        'TextDefault',
        'TextFooter',
        'TextImgLeft',
        'TextImgRight',
        'TextParallax',
        'VideoDefault',
        'VideoHeader'
      ]
    }
  },
  methods: {
    getWidgetName (item) {
      let name = item.type

      if (item.view && this.widgetTypes.find(value => value === `${item.type}${this.capitalizeFirstLetter(item.view)}`))
        name += this.capitalizeFirstLetter(item.view)
      else
        name += 'Default'

      return name
    },
    capitalizeFirstLetter (item) {
      return item.charAt(0).toUpperCase() + item.substring(1)
    },
    hasClass (viewData, key) {
      return viewData && viewData.includes(key)
    },
    getAosAnimation (viewData) {
      const aosClass = viewData && viewData.match(/aos\S+/g)
      return aosClass && aosClass[0] && aosClass[0].substring(4)
    },
    isParallaxWidget (w) {
      return (w.type === 'Text' && w.view && this.capitalizeFirstLetter(w.view) === 'Parallax') ||
        w.type === 'CountDown' ||
        this.hasClass(w.viewData, 'parallax')
    },
    getWidgetId (viewData) {
      const value = viewData && viewData.match(/id\S+/g)
      return value && value[0] && value[0].substring(3)
    }
  }
}
</script>
