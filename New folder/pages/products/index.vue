<script>
import ProductsList from '@/mixins/products/list'

export default {
  name: 'ProductsIndex',
  mixins: [ProductsList],
  meta: {
    modules: [
      'products'
    ]
  }
}
</script>
