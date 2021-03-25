<template>
  <transition name="msgbox-fade">
    <div
      v-show="visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      @click.self="handleWrapperClick"
    >
      <div
        class="el-message-box"
        :class="[customClass, center && 'el-message-box--center']"
      >
        <div class="el-message-box__header" v-if="title !== null">
          <div class="el-message-box__title">
            <div
              :class="['el-message-box__status', icon]"
              v-if="icon && center"
            ></div>
            <span>{{ title }}</span>
          </div>
          <button
            type="button"
            class="el-message-box__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
            @keydown.enter="
              handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
            "
          >
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__container">
            <div
              :class="['el-message-box__status', icon]"
              v-if="icon && !center && message !== ''"
            ></div>
            <div class="el-message-box__message" v-if="message !== ''">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">
                  {{ message }}
                </p>

                <p v-else v-html="message"></p>
              </slot>
            </div>
          </div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input
              @keydown.enter="handleInputEnter"
              :type="inputType"
              v-model="inputValue"
              :placeholder="inputPlaceholder"
              ref="input"
            ></el-input>
            <div
              :style="{
                visibility: !!editorErrorMessage ? 'visible' : 'hidden'
              }"
              class="el-message-box__errormsg"
            >
              {{ editorErrorMessage }}
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            size="small"
            :round="roundButton"
            @click="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
            :class="[cancelButtonClass]"
            v-show="showCancelButton"
          >
            {{ cancelButtonText }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            size="small"
            ref="confirm"
            :round="roundButton"
            @click="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
            :class="['el-button--primary', confirmButtonClass]"
            v-show="showConfirmButton"
          >
            {{ confirmButtonText }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import { defineComponent, reactive, toRefs, getCurrentInstance, ref } from 'vue'
import propsObject from './props.js'

import { ElInput } from '../../Input'
import { ElButton } from '../../Button'
import validateFunction from './validate'
import { useHandleList, watchElement, classIcon } from './use'
export default defineComponent({
  props: propsObject,
  components: {
    ElInput,
    ElButton
  },
  setup(props) {
    const confirmButtonLoading = ref(false)
    const state = reactive({
      action: null,
      visible: true,
      ...props
    })
    const instance = getCurrentInstance()
    const { iconClass, type } = toRefs(state)
    const { validate, editorErrorMessage } = validateFunction(state, instance)
    const {
      closeHandle,
      handleAction,
      handleInputEnter,
      handleWrapperClick
    } = useHandleList(state, instance, validate)
    const icon = classIcon(iconClass, type)
    watchElement(state, handleAction, closeHandle)
    return {
      ...toRefs(state),
      editorErrorMessage,
      icon,
      handleAction,
      handleInputEnter,
      handleWrapperClick,
      closeHandle,
      confirmButtonLoading
    }
  }
})
</script>
