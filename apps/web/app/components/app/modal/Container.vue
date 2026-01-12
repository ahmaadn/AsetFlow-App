<script setup lang="ts">
const { modals, close, getVariantConfig, getClassConfirmButton } = useModal();

const handleConfirm = (modal: Modal, value?: string) => {
  modal.onConfirm?.(value);
  close(modal.id);
};

const handleCancel = (modal: Modal) => {
  modal.onCancel?.();
  close(modal.id);
};

const handleClose = (modal: Modal) => {
  if (modal.closable) {
    close(modal.id);
  }
};

const handleButtonClick = async (button: ModalButton, modal: Modal) => {
  if (button.action) {
    await button.action();
  }
  if (button.closeOnClick !== false) {
    handleClose(modal);
  }
};
</script>

<template>
  <div id="modal-container" class="fixed z-50">
    <TransitionGroup name="modal" tag="div">
      <UiModalContainer
        v-for="modal in modals"
        :key="modal.id"
        :teleport-to="null"
        :z-index="50 + modals.indexOf(modal)"
        :model-value="true"
        @close="handleClose(modal)"
      >
        <div class="flex items-start justify-between mb-4">
          <!-- Header -->
          <div class="flex items-center gap-3">
            <Icon
              :name="modal.icon"
              :class="['size-8', getVariantConfig(modal.variant).iconColor]"
            />
            <UiModalTitle>
              {{ modal.title }}
            </UiModalTitle>
          </div>
          <!-- Button Close -->
          <button
            v-if="modal.closable"
            class="btn btn-sm btn-circle btn-ghost"
            @click="handleClose(modal)"
          >
            <Icon name="ri:close-line" class="size-5" />
          </button>
        </div>
        <UiModalContent>
          <div class="mb-6">
            <p v-if="modal.message" class="text-base text-base-content/80">
              {{ modal.message }}
            </p>
          </div>

          <!-- Modal berjenis input -->
          <template v-if="modal.type === 'input'">
            <UiModalRequiredInput
              v-slot="{ canConfirm, inputValue }"
              :input-value="modal.inputValue"
              :input-required-value="modal.inputRequiredValue"
              class="text-base font-medium"
            >
              <UiModalAction>
                <button class="btn" @click="handleCancel(modal)">
                  {{ modal.cancelText }}
                </button>
                <button
                  :class="['btn', getClassConfirmButton(modal)]"
                  :disabled="!canConfirm"
                  @click="
                    () => {
                      if (canConfirm) handleConfirm(modal, inputValue);
                    }
                  "
                >
                  {{ modal.confirmText }}
                </button>
              </UiModalAction>
            </UiModalRequiredInput>
          </template>

          <!-- Modal berjenis timer  -->
          <template v-else-if="modal.type === 'timer'">
            <UiModalTimer
              v-slot="{ canConfirm, countdown }"
              :confirm-delay="modal.confirmDelay"
            >
              <UiModalAction>
                <button class="btn" @click="handleCancel(modal)">
                  {{ modal.cancelText }}
                </button>
                <button
                  :class="['btn', getClassConfirmButton(modal)]"
                  :disabled="!canConfirm"
                  @click="
                    () => {
                      if (canConfirm) handleConfirm(modal);
                    }
                  "
                >
                  <span v-if="!canConfirm"> {{ countdown }}s </span>
                  {{ modal.confirmText }}
                </button>
              </UiModalAction>
            </UiModalTimer>
          </template>

          <!-- Action Khusus unyuk modal basic, confirm, dan promise -->
          <template v-else>
            <UiModalAction
              v-if="modal.buttons.length > 0 && modal.type !== 'promise'"
            >
              <button
                v-for="(button, index) in modal.buttons"
                :key="index"
                :class="['btn', button.variant ? `btn-${button.variant}` : '']"
                @click="handleButtonClick(button, modal)"
              >
                {{ button.text }}
              </button>
            </UiModalAction>
            <UiModalAction v-else>
              <button
                v-if="modal.cancelText || modal.type === 'promise'"
                class="btn"
                @click="handleCancel(modal)"
              >
                {{ modal.cancelText }}
              </button>
              <button
                v-if="modal.type !== 'promise'"
                :class="['btn', getClassConfirmButton(modal)]"
                @click="handleConfirm(modal)"
              >
                {{ modal.confirmText }}
              </button>
            </UiModalAction>
          </template>
        </UiModalContent>
      </UiModalContainer>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.9);
}
</style>
