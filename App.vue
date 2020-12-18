<template>
    <date-piker :date="date"/>
</template>
<script>
import DatePiker from './DatePiker.vue'
export default {
    data(){
        return {
            date:new Date()
        }
    },
    components: {
        DatePiker
    }
}
</script>