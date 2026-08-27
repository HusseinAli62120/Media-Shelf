// Top 5 states
let openTopFiveDrawer = ref<boolean>(false);
let isReplace = ref<boolean>(false);
// ID of the item being replaced
let replacedId = ref<string | null>(null);
let loading = ref<boolean>(false);
let slotNumber = ref<number | null>(null);

export default function useTopFive() {
  const topFive = useState<TopFive[]>("topFive", () => []);
  // Composables
  const toast = useToast();

  const addTopFive = async ({
    mediaId,
    slotNumber,
  }: {
    mediaId: number;
    slotNumber: number;
  }) => {
    if (topFive.value?.length >= 5) {
      toast?.add({
        title: "Limit Reached",
        description: "You have already added 5 movies to your top five.",
        color: "warning",
      });
      return;
    }

    try {
      loading.value = true;
      isReplace.value = false;
      replacedId.value = null;

      const res = await $fetch("/api/topFive/add", {
        method: "POST",
        body: {
          mediaId,
          slotNumber,
        },
      });

      if (res?.statusCode === 200 || res?.statusCode === 304) {
        // Update local state
        topFive.value = res?.topFive || [];

        // Close the drawer
        openTopFiveDrawer.value = false;

        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error?.statusCode === 409) {
        toast.add({
          title: "Already Added",
          description: error?.data?.statusMessage,
          color: "warning",
        });

        return;
      }
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const removeTopFive = async ({ id }: { id: string }) => {
    try {
      loading.value = true;

      const res = await $fetch("/api/topFive/removeEntry", {
        method: "DELETE",
        body: {
          id,
        },
      });

      if (res?.statusCode === 200 || res?.statusCode === 304) {
        // Delete from local state
        topFive.value = topFive.value.filter((topFive) => topFive.id !== id);

        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  const replaceTopFive = async ({
    id,
    mediaId,
  }: {
    id: string;
    mediaId: number;
  }) => {
    try {
      loading.value = true;

      const res = await $fetch("/api/topFive/replaceEntry", {
        method: "PUT",
        body: {
          id,
          mediaId,
        },
      });

      if (res?.statusCode === 200 || res?.statusCode === 304) {
        // Replace in local state
        topFive.value = res?.topFive || [];

        // Reset the values
        replacedId.value = null;
        isReplace.value = false;

        // Close the drawer
        openTopFiveDrawer.value = false;

        toast.add({
          title: "Success",
          description: res?.statusMessage,
          color: "success",
        });
      }
    } catch (error: any) {
      console.log(error);

      if (error?.statusCode === 409) {
        toast.add({
          title: "Already Added",
          description: error?.data?.statusMessage,
          color: "warning",
        });

        return;
      }
      toast.add({
        title: "Error",
        description: error?.data?.statusMessage,
        color: "error",
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    topFive,
    openTopFiveDrawer,
    replaceTopFive,
    removeTopFive,
    addTopFive,
    loading,
    isReplace,
    slotNumber,
    replacedId,
  };
}
