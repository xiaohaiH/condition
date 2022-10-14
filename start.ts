import { ChildProcess, exec, ExecOptions, ExecOptionsWithStringEncoding, execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { chdir, cwd } from 'process';

const args = process.argv.splice(2);

let vueVersion = '3.2.40';
main();
async function main() {
    const idx = args.findIndex((v) => v.startsWith('mode='));
    if (idx !== -1) {
        vueVersion = args[idx].split('=')[1];
        args.splice(idx, 1);
    }

    const fileBuffer = await readFile(resolve(__dirname, './package.json'));
    const pkg = JSON.parse(fileBuffer.toString());
    if (pkg.devDependencies.vue !== vueVersion) {
        await execPromise(`pnpm i -wD vue@${vueVersion}`).promise;
    }
    chdir(resolve(cwd(), './example/'));

    const { cp, promise } = execPromise('pnpm dev ' + args.toString());
}
/**
 * @description: 将执行函数转为异步
 * @param {String} command: 命令
 */
function execPromise(command: string, option?: ExecOptions) {
    let cp: ChildProcess;
    const promise = new Promise((resolve, reject) => {
        const a = exec(command, option, (error, stdout, stderr) => {
            if (error) {
                // console.error('\x1B[31m%s\x1B[0m', `exec error: ${error}`);
                reject(error);
                return;
            }
            // \x1B 是转义序列(做兼容的)
            // %s 表示参数
            // \\x1B[0m 重置为默认颜色
            // 颜色参考
            // {
            //     bright: '\x1B[1m', // 亮色
            //     grey: '\x1B[2m', // 灰色
            //     italic: '\x1B[3m', // 斜体
            //     underline: '\x1B[4m', // 下划线
            //     reverse: '\x1B[7m', // 反向
            //     hidden: '\x1B[8m', // 隐藏
            //     black: '\x1B[30m', // 黑色
            //     red: '\x1B[31m', // 红色
            //     green: '\x1B[32m', // 绿色
            //     yellow: '\x1B[33m', // 黄色
            //     blue: '\x1B[34m', // 蓝色
            //     magenta: '\x1B[35m', // 品红
            //     cyan: '\x1B[36m', // 青色
            //     white: '\x1B[37m', // 白色
            //     blackBG: '\x1B[40m', // 背景色为黑色
            //     redBG: '\x1B[41m', // 背景色为红色
            //     greenBG: '\x1B[42m', // 背景色为绿色
            //     yellowBG: '\x1B[43m', // 背景色为黄色
            //     blueBG: '\x1B[44m', // 背景色为蓝色
            //     magentaBG: '\x1B[45m', // 背景色为品红
            //     cyanBG: '\x1B[46m', // 背景色为青色
            //     whiteBG: '\x1B[47m', // 背景色为白色
            // }

            // stdout && console.log('\x1B[32m%s\x1B[0m', `stdout: ${stdout}`);
            // stderr && console.log('\x1B[33m%s\x1B[0m', `stderr: ${stderr}`);
            resolve({ stdout, stderr });
        });
        // 对内部的打印实时输出
        a.stdout?.on('data', console.log.bind(null, 'stdout - data'));
        a.stderr?.on('data', console.error.bind(null, '\x1B[31m', 'stderr - data'));
        cp = a;
    });
    return { promise, cp: cp! };
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
