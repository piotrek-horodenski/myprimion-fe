<script setup lang="ts">

import EventsTable from './EventsTable.vue'
import EventsCharts from './EventsCharts.vue'

</script>
<template>
<div class="flex flex-col gap-4 pt-8">
  <div class="m-8 p-8">
    <EventsCharts />
  </div>
  <EventsTable />
</div>
</template>
<style scoped>

</style>