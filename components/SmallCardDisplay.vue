<template>
    <b-container>
        <h3 class="header">
            {{ cardsSection.title }}
        </h3>

        <div class="card-container">
            <SmallCard 
                v-for="card in cardsSection.cards"
                :key="card.id"
                :card="card"
            />
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'smallCardDispay',
    props: ["cardsSection"]
}
</script>

<style scoped>
    .header {
        font-weight: 700;
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    .card-container {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>