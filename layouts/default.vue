<template>
  <div>
    <ClientOnly>
      <div class="sticky z-10 top-0 left-0 right-0">
        <Menubar :model="items" class="bg-[#151b23]">
          <template #item="{ item, props, hasSubmenu }">
            <NuxtLink
              v-if="item.route"
              v-slot="{ href, navigate }"
              :to="item.route"
              custom
            >
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                <span :class="item.icon" />
                <span>{{ item.label }}</span>
              </a>
            </NuxtLink>
            <a
              v-else
              v-ripple
              :href="item.url"
              :target="item.target"
              v-bind="props.action"
            >
              <span :class="item.icon" />
              <span>{{ item.label }}</span>
              <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
            </a>
          </template>
          <template #end>
            <Button
              v-if="!user"
              severity="success"
              variant="text"
              label="Login"
              icon="pi pi-sign-in"
              @click="signInWithGoogle"
            />
            <Button
              v-else
              severity="danger"
              variant="text"
              label="Logout"
              icon="pi pi-sign-out"
              @click="signOut"
            />
          </template>
        </Menubar>
      </div>
    </ClientOnly>
    <slot />
    <TimerFinishedDialog
      v-if="finishedTimer"
      v-model="isDialogVisible"
      :timer="finishedTimer"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimersStore } from "~/stores/timers";
import TimerFinishedDialog from "~/components/TimerFinishedDialog.vue";
import { useTimerSound } from "~/composables/useTimerSound";
import { GoogleLogin } from "~/composables/GoogleLogin";

const { user, signInWithGoogle, signOut } = GoogleLogin();

const timersStore = useTimersStore();
const { finishedTimerId, timers } = storeToRefs(timersStore);

const historyStore = useHistoryStore();
watch(
  user,
  (currentUser) => {
    if (currentUser) {
      historyStore.fetchRecords();
    }
  },
  { immediate: true }
);

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/",
  },
  {
    label: "TimeChart",
    icon: "pi pi-calendar-clock",
    route: "/timeLine",
  },
]);

const isDialogVisible = computed({
  get: () => finishedTimerId.value !== null,
  set: (value) => {
    if (!value) {
      timersStore.clearFinishedTimer();
    }
  },
});

const finishedTimer = computed(() => {
  if (finishedTimerId.value === null) return undefined;
  return timers.value.find((t) => t.id === finishedTimerId.value);
});

const { startAlarm, stopAlarm } = useTimerSound();

watch(finishedTimerId, (newId) => {
  if (newId !== null) {
    startAlarm();
  } else {
    stopAlarm();
  }
});
</script>

<style scoped></style>
