<template>
    <b-container>
        <b-row>
            <b-col>
                <h1 class="header">
                    Find your Fire Extinguisher
                </h1>

                <p class="snippet">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste iusto illum quidem asperiores, cum nisi aperiam eius ipsa sapiente odit!
                </p>
            </b-col>

            <b-col>
                <img class="image" src="~assets/svg/fire-extinguisher.svg" alt="fire extinguisher">
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'Hero'
}
</script>

<style scoped>
    .text-container {
        width: 50%;
        margin-top: 4rem;
    }

    .header {
        font-weight: 900;
        font-size: 5rem;
    }

    .snippet {
        color: grey;
        font-size: 1.25rem;
    }

    .image {
        width: 27.5rem;
        margin-top: 2rem;
    }
</style>