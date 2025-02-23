export function $time (date: Date | number | string = new Date()) {
    const dt = new Date(date);
    return Math.floor(Number(dt) / 1000);
}