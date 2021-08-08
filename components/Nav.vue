<template>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="text-white">
        <b-navbar-brand href="#">
            <NuxtLink class="navbar-brand" to="/">
                Firengii
            </NuxtLink>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse" >
        </b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item >
                    <NuxtLink to="/products" class="nav-link">
                    Products 

                    <span class="sr-only">
                        (current)
                    </span>
                </NuxtLink>
                </b-nav-item>

                <b-nav-item>
                    <NuxtLink to="/my-items" class="nav-link">
                        My Items 

                        <span class="sr-only">
                            (current)
                        </span>
                    </NuxtLink>
                </b-nav-item>
             </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>
    .padding {
        padding: 1.5rem;
        background-color: black
    }
    .nav-left {
        margin-left: auto;
    }
</style>