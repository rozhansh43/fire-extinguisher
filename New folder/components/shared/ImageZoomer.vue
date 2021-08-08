<template>
  <div class="d-flex justify-content-center">
    <div class="position-relative" @mouseenter="showResult" @mouseleave="hideResult">
      <thumbnail
        id="image-zoom-image"
        :link="false"
        :width="width"
        :height="height"
        :path="path"
        :alt="alt"
        :fluid-grow="fluidGrow"
        class="rounded"
        :image-class="imageClass"
      />
    </div>
    
    <div
      id="image-zoom-result"
      class="card shadow-lg d-none"
      :style="`background-image: url('${imageSrc}')`"
    ></div>
  </div>
</template>

<script>
import Thumbnail from '@/components/shared/Thumbnail'
import { getThumbnailUrl } from '@/lib/thumbnail.js'

export default {
  name: 'ImageZoomer',
  components: {
    Thumbnail
  },
  props: {
    width: { type: Number, default: 426 },
    height: { type: Number, default: 426 },
    lensWidth: { type: Number, default: 296 },
    lensHeight: { type: Number, default: 296 },
    resultWidth: { type: Number, default: 500 },
    resultHeight: { type: Number, default: 500 },
    path: { type: String, required: true },
    alt: String,
    fluidGrow: { type: Boolean, default: false },
    imageClass: String
  },
  data () {
    return {
      imageSrc: null
    }
  },
  watch: {
    path () {
      this.getImageSrc()
      .then(url => {
        this.imageSrc = url
      })
    }
  },
  mounted () {
    if (window.innerWidth >= 992) { // lg
      setTimeout(() => {
        this.imageZoom()
        
        this.getImageSrc()
        .then(url => {
          this.imageSrc = url
        })
      }, 500)
    }
  },
  methods: {
    getImageSrc () {
      return getThumbnailUrl({
        $config: this.$config,
        path: this.path,
        width: Math.round(this.width * (this.resultWidth / this.lensWidth)),
        height: Math.round(this.height * (this.resultHeight / this.lensHeight))
      })
    },
    imageZoom () {
      const image = document.getElementById('image-zoom-image')
      const result = document.getElementById('image-zoom-result')

      // Create lens
      const lens = document.createElement('div')
      lens.setAttribute('id', 'image-zoom-lens')
      lens.classList.add('d-none', 'rounded')
      lens.style.width = `${this.lensWidth}px`
      lens.style.height = `${this.lensHeight}px`
      
      // Insert lens
      image.parentElement.insertBefore(lens, image)
      
      // Calculate the ratio between result DIV and lens
      const cx = this.resultWidth / this.lensWidth
      const cy = this.resultHeight / this.lensHeight
      
      // Set properties for the result DIV
      result.style.backgroundSize = `${Math.round(image.width * cx)}px ${Math.round(image.height * cy)}px`
      result.style.width = `${this.resultWidth}px`
      result.style.height = `${this.resultHeight}px`

      // Execute a function when someone moves the cursor over the image, or the lens
      lens.addEventListener('mousemove', (e) => this.moveLens(e, lens, image, result, cx, cy))
      image.addEventListener('mousemove', (e) => this.moveLens(e, lens, image, result, cx, cy))
      
      // And also for touch screens
      lens.addEventListener('touchmove', (e) => this.moveLens(e, lens, image, result, cx, cy))
      image.addEventListener('touchmove', (e) => this.moveLens(e, lens, image, result, cx, cy))
    },
    moveLens (e, lens, image, result, cx, cy) {
      // Prevent any other actions that may occur when moving over the image
      e.preventDefault()
      
      // Get the cursor's x and y positions
      const pos = this.getCursorPos(e, image)
      
      // Calculate the position of the lens
      let x = pos.x - (lens.offsetWidth / 2)
      let y = pos.y - (lens.offsetHeight / 2)
      
      // Prevent the lens from being positioned outside the image
      if (x > image.width - lens.offsetWidth) { x = image.width - lens.offsetWidth }
      if (x < 0) { x = 0 }
      if (y > image.height - lens.offsetHeight) { y = image.height - lens.offsetHeight }
      if (y < 0) { y = 0 }
      
      // Set the position of the lens
      lens.style.left = `${x}px`
      lens.style.top = `${y}px`
      
      // Display what the lens sees
      result.style.backgroundPosition = `-${(x * cx)}px -${(y * cy)}px`
    },
    getCursorPos (e, image) {
      let x = 0
      let y = 0
      
      e = e || window.event
      
      // Get the x and y positions of the image
      const a = image.getBoundingClientRect()
      
      // Calculate the cursor's x and y coordinates, relative to the image
      x = e.pageX - a.left
      y = e.pageY - a.top
      
      // Consider any page scrolling
      x = x - window.pageXOffset
      y = y - window.pageYOffset
      
      return { x, y }
    },
    showResult () {
      if (window.innerWidth >= 992) { // lg
        const result = document.getElementById('image-zoom-result')
        const lens = document.getElementById('image-zoom-lens')

        if (result) result.classList.remove('d-none')
        if (lens) lens.classList.remove('d-none')
      }
    },
    hideResult () {
      if (window.innerWidth >= 992) { // lg
        const result = document.getElementById('image-zoom-result')
        const lens = document.getElementById('image-zoom-lens')
        
        if (result) result.classList.add('d-none')
        if (lens) lens.classList.add('d-none')
      }
    }
  }
}
</script>

<style lang="scss">
#image-zoom-lens {
  position: absolute;
  border: 1px solid var(--primary);
  cursor: crosshair;
}

#image-zoom-result {
  left: 100%;
  right: unset;
  top: 0;
  z-index: 1;
  position: absolute;
  
  *[dir="rtl"] & {
    right: 100%;
    left: unset;
  }
}
</style>
