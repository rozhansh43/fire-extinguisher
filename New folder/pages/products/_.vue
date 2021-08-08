<script>
import ProductsList from '@/mixins/products/list'

export default {
  name: 'ProductsSearch',
  mixins: [ProductsList],
  meta: {
    modules: [
      'products'
    ]
  }
}
</script>
