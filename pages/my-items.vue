<template>
    <b-container>
        <MyItem 
            v-for="rental in myRentals"
            :key="rental.id"
            :item="rental"
        />
    </b-container>
</template>

<script>
import { mapState } from 'vuex'

    export default {
        layout: "no-nav",
        computed: {
            ...mapState([
                'myRentals'
            ])
        }
    }
</script>
