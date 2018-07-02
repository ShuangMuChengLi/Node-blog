<template>
    <div>
        <cms-left></cms-left>
    </div>
</template>

<script>

    export default {
        created() {

        },
        mounted() {

        },
        directives: {},
        components: {
            "cms-left": () => import('./common/cms-left.vue'),
        },
        data() {
            return {}
        }
    }
</script>

<style scoped lang="less">

</style>
