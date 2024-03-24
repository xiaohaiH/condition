<script lang="ts">
import Content from './components/content.vue';
import Content2 from './components/content2.vue';
const { defineComponent, markRaw, ref, version } = window.Vue;

export default defineComponent({
    name: 'App',
    template: `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
            <ElAlert type="warning" style="flex: none; margin-bottom: 10px" :closable="false">
                vue 版本: {{ vueVersion }} - 表单校验
            </ElAlert>
            <Content2></Content2>
            <ElAlert type="error" style="flex: none; margin-bottom: 10px" :closable="false">
                vue 版本: {{ vueVersion }} - 条件
            </ElAlert>
            <Content></Content>
        </div>
    `,
    components: {
        Content,
        Content2,
    },
    setup() {
        return {
            vueVersion: version,
        };
    },
});
</script>

<style scoped></style>
