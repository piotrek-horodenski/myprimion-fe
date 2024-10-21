<script setup lang="ts">

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import Toaster from '@/components/ui/toast/Toaster.vue'
import { routes } from '@/routes'
import { useIncidentsStore } from '@/stores/incidents.store'

const route = useRoute()
const { isLoading } = storeToRefs(useIncidentsStore())
const toggled = ref(true)

const routesActive = computed(() => routes
  .map(r => {
    const isActive = r.name === route.name
    return {
      ...r,
      isActive,
      classes: {
        'selected': isActive,
      },
    }
  })
)

function toggle() {
  toggled.value = !toggled.value
}

</script>

<template>
<div class="flex">
  <template v-if="isLoading">
    please wait
  </template>
  <template v-else>
    <main
      :class="{
        'toggled': toggled,
      }"
    >
      <div
        v-if="$route.name !== 'map'"
        class="black-header"
      >
        {{ $route.meta.label }}
      </div>
      <div class="route-wrapper">
        <RouterView />
      </div>
    </main>
    <nav
      class="justify-left"
      :class="{
        'toggled': toggled,
      }"
    >
      <div class="nav-wrapper">
        <div class="logo">
          <img src="/logo.png" alt="My Primion" />
        </div>
        <ul>
          <li
            v-for="(route, index) in routes"
            :key="route.path"
          >
            <RouterLink
              :class="routesActive[index].classes"
              :to="route.path"
            ><em class="material-symbols-outlined">{{ route.meta.icon }}</em> {{ route.meta.label }}</RouterLink>
          </li>
        </ul>
      </div>
      <div
        class="toggle"
        :class="{
          'toggled': toggled,
        }"
        @click="toggle"
      >
        <em class="material-symbols-outlined">{{ toggled ? 'chevron_left' : 'chevron_right' }}</em>
      </div>
    </nav>
  </template>
  <Toaster />
</div>
</template>
<style lang="scss" scoped>

main {
  background-color: hsl(var(--background));
  box-shadow: inset 6px 0 12px rgba(0, 0, 0, .14);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  order: 1;
  min-height: 300px;
  min-height: 100vh;
  height: 100vh;
  transition: width .4s ease-in-out;
}

.route-wrapper {
  flex-grow: 1;
}

nav {
  background-color: var(--background);
  border-right: 1.5px solid hsl(var(--border));
  flex-shrink: 0;
  order: 0;
  position: relative;
  width: 10px;
  transition: width .4s ease-in-out;

  .nav-wrapper {
    position: relative;
    width: 320px;
    left: -310px;
    transition: left .4s ease-in-out;
  }

  &.toggled {
    width: 320px;

    .nav-wrapper {
      left: 0;
    }
  }

  ul {
    margin: 0 15px 0 0;
    width: calc(100% - 15px);
    overflow: hidden;

    >li {
      margin-bottom: 8px;
      width: 100%;

      > a {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        color: hsl(var(--muted-foreground));
        display: block;
        font-weight: bold;
        padding: 10px;
        width: 100%;

        &.selected {
          background-color: hsl(var(--border));
          color: hsl(var(--foreground));
        }

        > em {
          line-height: 10px;
          margin-right: 5px;
          position: relative;
          top: 5px;
        }
      }
    }
  }
}

.logo {
  border-bottom: 1.5px solid hsl(var(--border));
  margin: 0 15px 15px 0;
  padding: 40px 40px 40px 40px;
  overflow: hidden;

  >img {
    width: 230px;
  }
}

.toggle {
  background-color: hsl(var(--background));
  border-radius: 15px;
  border: 1px solid hsl(var(--border));
  box-shadow: 1px 2px 12px rgba(0, 0, 0, .14);
  cursor: pointer;
  display: block;
  position: absolute;
  top: 80px;
  right: -12px;
  height: 24px;
  width: 24px;
  text-align: center;
  z-index: 1000;

  >em {
    line-height: 24px;
    position: relative;
    top: 0;
    left: 1px;
  }

  &.toggled {
    >em {
      left: -1px;
    }
  }
}

.black-header {
  background-color: hsl(var(--foreground));
  color: hsl(var(--background));
  height: 170px;
  padding: 15px;
  flex-shrink: 0;
  font-size: 1.8em;
  font-weight: bold;
  display: flex;
  align-items: flex-end;
}

</style>