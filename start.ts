import {
    ChildProcess,
    exec,
    ExecOptions,
    ExecOptionsWithStringEncoding,
    execSync,
    spawn,
    spawnSync,
} from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { chdir, cwd } from 'process';
import pkg from './package.json';

const args = process.argv.splice(2);
/** 提取版本号的前两位数字 */
function versionToNum(version: string) {
    return Number(version.split('.').join('').slice(0, 2));
}
/** 两个版本是否相同 */
function isSameVersion(version1: string, version2: string) {
    /** 都是 v3 版本 */
    if (version1[0] === '3' && version2[0] === '3') return true;
    const v1 = versionToNum(version1);
    const v2 = versionToNum(version2);
    /** 都是 v2.7 版本 */
    if (Math.min(v1, v2) >= 27 && Math.max(v1, v2) < 30) return true;
    /** 都是 v2.0 版本 */
    if (Math.min(v1, v2) >= 20 && Math.max(v1, v2) < 27) return true;
    return false;
}
/** 获取 vue 版本后缀(2, 2.7, 3) */
function getVersionSuffix(version: string) {
    const _version = versionToNum(version);
    return _version >= 30 ? '3' : _version >= 27 ? '2.7' : '2';
}

// 监听输入信息
process.stdin.isTTY && process.stdin.setRawMode(true);
const childProcess: ChildProcess[] = [];
process.stdin
    .on('data', (chunk: string) => {
        childProcess.forEach((v) => v.stdin?.write(chunk));
        if (chunk === '\x03' || chunk === '\x04' || chunk === 'q') {
            process.exit();
            // cp ? exec(`taskkill /PID ${cp.pid} /T /F`, () => process.exit(0)) : process.exit(0);
            // exec(`taskkill /PID ${process.pid} /T /F`, (error, stdout, stderr) => {});
        }
    })
    .setEncoding('utf-8')
    .resume();

main();
async function main() {
    // 需要执行的命令后缀
    let commandSuffix = getVersionSuffix(pkg.pnpm.overrides.vue);
    const idx = args.findIndex((v) => v.startsWith('version='));
    if (idx !== -1) {
        const version = args[idx].split('=')[1];
        args.splice(idx, 1);
        if (!isSameVersion(pkg.pnpm.overrides.vue, version)) {
            pkg.pnpm.overrides.vue = version;
            // 处理 vue2 相关的依赖 - start
            version[0] === '2'
                ? // @ts-ignore
                  (pkg.pnpm.overrides['vue-template-compiler'] = version)
                : // @ts-ignore
                  delete pkg.pnpm.overrides['vue-template-compiler'];
            // 处理 vue2 相关的依赖 - end
            commandSuffix = getVersionSuffix(version);
            // 更新包依赖, 并重新安装
            writeFile(resolve(__dirname, './package.json'), JSON.stringify(pkg, null, 4) + '\n');
            await execPromise('pnpm', ['i']).promise;
            // await execPromise('pnpm', [`switch${commandSuffix}`]).promise;
            // try {
            //     // el 组件打包 ts 会报错
            // await execPromise('pnpm', [`build:v${commandSuffix}`]).promise;
            // } catch (error) {}
        }
    }
    // 仅切换版本, 不启动服务
    if (args.includes('--only-switch')) return process.exit(0);
    execPromise('pnpm', ['--filter', 'example', `vue${commandSuffix}`, ...args]);
}
/**
 * @description: 将执行函数转为异步
 * @param {String} command: 命令
 */
function execPromise(command: string, args: string[]) {
    const result = { command: null, promise: null } as unknown as { command: ChildProcess; promise: Promise<void> };
    result.promise = new Promise<void>((resolve, reject) => {
        function exit(cb: (r?: any) => void) {
            return (...args: any[]) => {
                const idx = childProcess.indexOf(cli);
                idx !== -1 && childProcess.splice(idx, 1);
                return cb(...args);
            };
        }
        const cli = spawn(command, args, {
            stdio: ['pipe', 'inherit', 'inherit'],
        });
        childProcess.push((result.command = cli));
        cli.on('exit', exit(resolve));
        cli.on('close', exit(resolve));
        cli.on('reject', exit(reject));

        /* const a = exec(command, option, (error, stdout, stderr) => {
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
                resolve({ stdout, stderr, cp });
            }); */
    });
    return result;
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
