<script setup lang="ts">
import type { ContextMenuItem } from "@nuxt/ui";
import { useWindowSize } from "@vueuse/core";

const { item, last, deleteEntry } = defineProps<{
  item: DiaryData;
  last: boolean;
  deleteEntry: ({ id }: { id: string }) => Promise<void>;
}>();

// Composables
const colorMode = useColorMode();
const { width } = useWindowSize();

// Delete states
let isDeleting = ref(false);
let modalOpen = ref(false);

// Context menu
const contextMenuItems = ref<ContextMenuItem[][]>([
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash",
      onSelect: () => {
        modalOpen.value = true;
      },
    },
  ],
]);
</script>

<template>
  <UContextMenu :items="contextMenuItems">
    <div class="w-full flex flex-col items-center">
      <!-- Card -->
      <div class="flex flex-row w-full space-x-4">
        <!-- Poster -->
        <div
          class="w-20 h-28 xs:w-24 xs:h-32 shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-md hover:scale-105 transition-all duration-300"
        >
          <img
            v-if="item?.imgURL"
            :src="item.imgURL"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div
            class="w-full h-full flex items-center justify-center bg-neutral-950"
          >
            <UIcon name="i-lucide-film" class="h-8 w-8 text-neutral-600" />
          </div>
        </div>
        <!-- Info -->
        <div class="flex flex-col w-full">
          <!-- Title & Date -->
          <div class="flex flex-col items-start space-y-2">
            <h6
              class="text-base xs:text-lg font-bold tracking-tight text-foreground line-clamp-3"
            >
              {{ item?.name }} {{ last }}
            </h6>
            <p class="font-bold text-xs text-muted-foreground">
              {{
                formatDateTime({ timestamp: item?.createdAt?.toString() })
                  ?.dateTime
              }}
            </p>
          </div>
          <div class="w-full flex flex-row items-center space-x-2 my-5">
            <UAccordion
              v-if="item?.review && item?.review?.length > 0"
              :ui="{
                trigger: 'w-full p-0 flex flex-row items-center',
                body: 'py-3.5',
                trailingIcon: 'text-muted-foreground',
              }"
              :items="[
                {
                  label: 'Review',
                  content: item?.review,
                },
              ]"
            >
              <NuxtRating
                :read-only="true"
                border-color="#db8403"
                active-color="#ffa41c"
                :inactive-color="
                  colorMode.preference === 'light' ? '#cecece' : '#fff'
                "
                :border-width="0"
                :rating-value="Number(item?.rating)"
                :rating-size="width < 400 ? 16 : 20"
              />
            </UAccordion>
            <NuxtRating
              v-else
              :read-only="true"
              border-color="#db8403"
              active-color="#ffa41c"
              :inactive-color="
                colorMode.preference === 'light' ? '#cecece' : '#fff'
              "
              :border-width="0"
              :rating-value="Number(item?.rating)"
              :rating-size="width < 400 ? 16 : 20"
            />
          </div>
        </div>
      </div>
      <!-- Delete Icon for smaller screens -->
      <div class="md:hidden w-full flex flex-row justify-end">
        <UButton
          @click="
            () => {
              modalOpen = true;
            }
          "
          size="sm"
          variant="link"
          color="neutral"
        >
          <UIcon name="i-heroicons-trash" class="w-3 h-3" /> Delete
        </UButton>
      </div>
    </div>
  </UContextMenu>

  <!-- Seperator for all but last card -->
  <USeparator v-if="!last" class="w-full my-6" orientation="horizontal" />

  <!-- Confirmation Modal -->
  <UModal v-model:open="modalOpen">
    <template #title>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-trash" class="w-5 h-5 text-error" />
        <span>Delete Entry</span>
      </div>
    </template>

    <template #body>
      <div class="text-base text-error flex flex-col items-start space-y-5">
        <p>Are you sure you want to delete this entry?</p>
        <!-- Entry Details -->
        <div class="flex flex-row w-full items-center space-x-4">
          <!-- Poster -->
          <div
            class="w-20 h-28 xs:w-24 xs:h-32 shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-md hover:scale-105 transition-all duration-300"
          >
            <img
              v-if="item?.imgURL"
              :src="item.imgURL"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <div
              class="w-full h-full flex items-center justify-center bg-neutral-950"
            >
              <UIcon name="i-lucide-film" class="h-8 w-8 text-neutral-600" />
            </div>
          </div>
          <!-- Info -->
          <div class="flex flex-col w-full">
            <!-- Title & Date -->
            <div class="flex flex-col items-start space-y-2">
              <h6
                class="text-base xs:text-lg font-bold tracking-tight text-foreground line-clamp-3"
              >
                {{ item?.name }} {{ last }}
              </h6>
              <p class="font-bold text-xs text-muted-foreground">
                {{
                  formatDateTime({ timestamp: item?.createdAt?.toString() })
                    ?.dateTime
                }}
              </p>
            </div>
            <NuxtRating
              class="my-5"
              :read-only="true"
              border-color="#db8403"
              active-color="#ffa41c"
              :inactive-color="
                colorMode.preference === 'light' ? '#cecece' : '#fff'
              "
              :border-width="0"
              :rating-value="Number(item?.rating)"
              :rating-size="width < 400 ? 16 : 20"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full flex justify-end gap-2">
        <UButton
          class="cursor-pointer"
          color="neutral"
          variant="soft"
          @click="
            () => {
              modalOpen = false;
            }
          "
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
          Cancel
        </UButton>
        <UButton
          class="cursor-pointer"
          variant="soft"
          color="error"
          @click="
            async () => {
              isDeleting = true;
              await deleteEntry({ id: item?.id });
              isDeleting = false;
              modalOpen = false;
            }
          "
          :disabled="isDeleting"
        >
          <UIcon
            :name="isDeleting ? 'i-lucide-loader-2' : 'i-lucide-trash'"
            :class="isDeleting ? 'animate-spin' : ''"
            class="w-4 h-4"
          />
          {{ isDeleting ? "Deleting..." : "Delete" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
