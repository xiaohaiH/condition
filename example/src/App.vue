<script lang="ts">
import Content from './components/content.vue';
const { defineComponent, markRaw, ref, version } = window.Vue;

export default defineComponent({
    name: 'BBC',
    template: `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
            <ElAlert type="error" style="flex: none; margin-bottom: 10px" :closable="false">
                vue 版本: {{ vueVersion }}
            </ElAlert>
            <Content></Content>
        </div>
    `,
    components: {
        Content,
    },
    setup() {
        return {
            vueVersion: version,
        };
    },
});
</script>

<style scoped></style>
