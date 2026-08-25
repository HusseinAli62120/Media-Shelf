<script setup lang="ts">
const isOpen = defineModel<boolean>("open", { default: false });

const { user, fetch: refreshSession } = useUserSession();
const toast = useToast();

// Form state
const userName = ref(user.value?.userName || "");
const description = ref("");

// Image link
const avatarPreview = ref<string | null>(null);
// File
const avatarFile = ref<File | null>(null);
// Ref to trigger file select on button click
const fileInputRef = ref<HTMLInputElement | null>(null);
// Flag to indicate image change
const isImageChanged = ref<boolean>(false);

// Password state
const changePassword = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

// UI state
const isSaving = ref(false);
const isDragging = ref(false);

const maxDescriptionLength = 500;
const charCount = computed(() => description.value?.length || 0);

// Initialize form values when modal opens
watch(isOpen, (newVal) => {
  if (newVal) {
    userName.value = user.value?.userName || "";
    description.value = user.value?.description || "";
    changePassword.value = false;
    currentPassword.value = "";
    newPassword.value = "";
    avatarPreview.value = user?.value?.profileImg || "";
    avatarFile.value = null;
    isImageChanged.value = false;
  }
});

// Handle image selection
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    toast.add({
      title: "Error",
      description: "Please select a valid image file (JPEG, PNG, or JPG).",
      color: "error",
    });
    return;
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      title: "Error",
      description: "Image size cannot exceed 5MB.",
      color: "error",
    });
    return;
  }

  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  isImageChanged.value = true;

  // console.log(avatarFile.value);
};

const removeAvatar = () => {
  avatarFile.value = null;
  avatarPreview.value = null;
  isImageChanged.value = true;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

// Toggle Password section
const togglePasswordSection = () => {
  changePassword.value = !changePassword.value;
  // Reset when closing
  if (!changePassword.value) {
    currentPassword.value = "";
    newPassword.value = "";
  }
};

const handleClose = () => {
  isOpen.value = false;
};

const handleSave = async () => {
  // Check username
  if (!userName.value.trim() || userName.value.trim().length < 4) {
    toast.add({
      title: "Error",
      description: "Username must be at least 4 characters long.",
      color: "error",
    });
    return;
  }

  // If password section is open, validate password fields
  if (changePassword.value) {
    if (!currentPassword.value) {
      toast.add({
        title: "Error",
        description: "Please enter your current password.",
        color: "error",
      });
      return;
    }
    if (!newPassword.value) {
      toast.add({
        title: "Error",
        description: "Please enter a new password.",
        color: "error",
      });
      return;
    }
    if (newPassword.value.length < 8) {
      toast.add({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        color: "error",
      });
      return;
    }
  }

  try {
    isSaving.value = true;

    const formData = new FormData();
    if (avatarFile.value) {
      formData.append("profileImg", avatarFile.value);
    }
    formData.append("userName", userName.value.trim());
    formData.append("description", description.value || "");
    formData.append("isImageChanged", String(isImageChanged.value));
    formData.append("changePassword", String(changePassword.value));

    if (changePassword.value) {
      formData.append("currentPassword", currentPassword.value);
      formData.append("newPassword", newPassword.value);
    }

    const res = await $fetch("/api/user/updateInfo", {
      method: "PUT",
      body: formData,
    });

    if (res.statusCode === 200 || res.statusCode === 304) {
      await refreshSession();
      // console.log(user.value);

      toast.add({
        title: "Success",
        description: "Profile updated successfully.",
        color: "success",
      });
      isOpen.value = false;
    }
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err?.data?.statusMessage || "Failed to update profile.",
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :ui="{
      content: 'sm:max-w-lg overflow-hidden',
      header: 'p-4 sm:p-6 pb-2 sm:pb-3',
      body: 'p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto no-scrollbar',
      footer: 'p-4 sm:p-6 pt-3 sm:pt-4',
    }"
  >
    <!-- Modal Header -->
    <template #title>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/20 border border-muted"
          >
            <UIcon name="i-lucide-user-pen" class="w-5 h-5 text-foreground" />
          </div>
          <div>
            <p class="text-lg font-bold text-foreground tracking-tight">
              Edit Profile
            </p>
            <p class="text-xs text-muted-foreground">
              Update your photo, username, bio, and security settings.
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Body -->
    <template #body>
      <div class="space-y-6">
        <!-- Profile Picture Section -->
        <div
          class="flex flex-col items-center sm:flex-row gap-5 p-4 rounded-2xl bg-muted/20 border border-muted/40"
        >
          <!-- Profile Image -->
          <div
            class="relative group cursor-pointer shrink-0"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <div
              class="relative rounded-full p-1 ring-2 transition-all duration-300"
              :class="
                isDragging
                  ? 'ring-primary-500 ring-offset-2 scale-105'
                  : 'ring-neutral-700/60 group-hover:ring-primary-500/60'
              "
            >
              <UAvatar
                v-if="avatarPreview"
                :src="avatarPreview"
                :alt="userName || 'User'"
                class="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover"
              />
              <div
                v-else
                class="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-muted flex items-center justify-center border border-neutral-700/50 text-neutral-400 group-hover:text-neutral-200 transition-colors"
              >
                <UIcon name="i-lucide-user" class="w-10 h-10" />
              </div>

              <!-- Overlay badge on hover -->
              <div
                class="absolute inset-0 rounded-full bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all duration-200 text-white text-xs font-medium"
              >
                <UIcon name="i-lucide-camera" class="w-5 h-5" />
                <span>Change</span>
              </div>
            </div>

            <!-- Hidden File Input -->
            <input
              ref="fileInputRef"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>

          <!-- Profile Actions -->
          <div
            class="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left"
          >
            <div>
              <h4 class="text-sm font-semibold text-neutral-200">
                Profile Photo
              </h4>
              <p class="text-xs text-neutral-400 mt-0.5">PNG, JPG up to 5MB.</p>
            </div>

            <div class="flex items-center gap-2 mt-1">
              <UButton
                size="xs"
                variant="soft"
                color="neutral"
                class="cursor-pointer font-medium"
                @click="triggerFileInput"
              >
                <UIcon name="i-lucide-upload" class="w-3.5 h-3.5" />
                Upload New
              </UButton>

              <UButton
                v-if="avatarPreview"
                size="xs"
                variant="ghost"
                color="error"
                class="cursor-pointer"
                @click="removeAvatar"
              >
                <UIcon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
                Remove
              </UButton>
            </div>
          </div>
        </div>

        <!-- Username Input -->
        <UFormField label="Username" required>
          <UInput
            v-model="userName"
            placeholder="Enter your username"
            icon="i-lucide-at-sign"
            :ui="{
              leadingIcon: 'w-4 h-4',
            }"
            class="w-full"
            size="md"
          />
        </UFormField>

        <!-- Description Textarea -->
        <UFormField
          label="Bio / Description"
          :description="`Write a short bio about yourself`"
        >
          <div class="relative w-full">
            <UTextarea
              :ui="{
                root: 'flex-1',
                base: 'resize-none! no-scrollbar h-full ',
              }"
              v-model="description"
              :maxlength="maxDescriptionLength"
              :rows="4"
              placeholder="Write a short bio..."
              class="w-full resize-none"
              color="neutral"
              size="md"
            />
            <!-- Character Counter -->
            <div
              class="flex justify-end mt-1.5 text-xs font-mono transition-colors"
              :class="
                charCount >= maxDescriptionLength
                  ? 'text-red-400 font-semibold'
                  : charCount > 450
                    ? 'text-amber-400'
                    : 'text-neutral-400'
              "
            >
              <span>{{ charCount }} / {{ maxDescriptionLength }}</span>
            </div>
          </div>
        </UFormField>

        <!-- Password Toggle Section -->
        <div
          class="rounded-2xl border border-neutral-800/70 bg-neutral-950/40 p-4 transition-all duration-200"
        >
          <div class="flex items-center space-x-3 sm:justify-between">
            <div class="flex items-center gap-2.5">
              <!-- Icon -->
              <div
                class="w-8 h-8 rounded-lg bg-muted/20 border border-muted/40 text-neutral-300 flex items-center justify-center"
              >
                <UIcon name="i-lucide-key-round" class="w-5 h-5" />
              </div>
              <div class="hidden sm:inline">
                <p class="text-sm font-medium text-foreground">
                  Password & Security
                </p>
                <p class="text-xs text-muted">Update your account password</p>
              </div>
            </div>

            <UButton
              type="button"
              size="sm"
              :variant="changePassword ? 'solid' : 'soft'"
              :color="changePassword ? 'primary' : 'neutral'"
              class="cursor-pointer"
              @click="togglePasswordSection"
            >
              <UIcon
                :name="changePassword ? 'i-lucide-chevron-up' : 'i-lucide-lock'"
                class="w-3.5 h-3.5"
              />
              {{ changePassword ? "Hide" : "Change Password" }}
            </UButton>
          </div>

          <!-- Collapsible Password Fields -->
          <div
            v-if="changePassword"
            class="mt-4 pt-4 border-t border-neutral-800/60 space-y-4"
          >
            <!-- Current Password -->
            <UFormField label="Current Password" required>
              <UInput
                v-model="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                placeholder="Current Password"
                icon="i-lucide-lock"
                class="w-full"
                color="neutral"
                size="md"
                :ui="{ trailing: 'pe-1' }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    :icon="
                      showCurrentPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                    "
                    :aria-label="
                      showCurrentPassword ? 'Hide password' : 'Show password'
                    "
                    @click="
                      () => {
                        showCurrentPassword = !showCurrentPassword;
                      }
                    "
                  />
                </template>
              </UInput>
            </UFormField>

            <!-- New Password -->
            <UFormField label="New Password" required>
              <UInput
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="New Password"
                icon="i-lucide-shield-check"
                class="w-full"
                color="neutral"
                size="md"
                :ui="{ trailing: 'pe-1' }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="xs"
                    :icon="
                      showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'
                    "
                    :aria-label="
                      showNewPassword ? 'Hide password' : 'Show password'
                    "
                    @click="
                      () => {
                        showNewPassword = !showNewPassword;
                      }
                    "
                  />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Footer -->
    <template #footer>
      <div class="flex items-center justify-end gap-3 w-full">
        <!-- Cancel -->
        <UButton
          color="neutral"
          variant="soft"
          class="cursor-pointer"
          :disabled="isSaving"
          @click="handleClose"
        >
          Cancel
        </UButton>

        <!-- Save -->
        <UButton
          color="primary"
          variant="solid"
          class="cursor-pointer min-w-28 flex justify-center items-center"
          :disabled="isSaving"
          @click="handleSave"
        >
          <UIcon
            v-if="isSaving"
            name="i-lucide-loader-2"
            class="w-4 h-4 animate-spin"
          />
          <span>{{ isSaving ? "Saving..." : "Save Changes" }}</span>
        </UButton>
      </div>
    </template>
  </UModal>
</template>
