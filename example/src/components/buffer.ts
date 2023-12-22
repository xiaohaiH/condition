if (typeof Buffer === 'undefined') {
    // @ts-ignore
    window.Buffer = {};
}
if (typeof Buffer.isBuffer === 'undefined') {
    Buffer.isBuffer = (obj: any): obj is Buffer => false;
}
