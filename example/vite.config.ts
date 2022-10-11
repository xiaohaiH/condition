import { defineConfig, type UserConfig } from 'vite';
import { isVue2 } from 'vue-demi';

// https://vitejs.dev/config/
export default defineConfig(async (env) => {
    let options: UserConfig = {};
    try {
        // 无法动态加载 ts 文件
        // 做判断同时静态加载 vue2 和 vue3 的 ts 文件会报错
        const name = isVue2 ? './vue2.config.js' : './vue3.config.js';
        options = (await import(name)).default as UserConfig;
    } catch (error) {
        console.log('------ start ------');
        console.log(`配置加载失败: \n 环境: ${isVue2 ? 'vue2' : 'vue3'}\n 错误信息: `, error);
        console.log('------ end ------');
    }

    return options;
});
