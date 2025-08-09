export function cld(url, opts = {}) {
    if (!url || !url.includes("/upload/")) return url;

    const { width } = opts;
    const parts = url.split("/upload/");
    const base = parts[0];
    const rest = parts[1];
    const targetW = width ? Math.max(320, Math.min(width, 1600)) : null;
    const wPart = targetW ? `,w_${targetW},c_limit` : "";
    const transforms = `a_exif,f_auto,q_auto${wPart}`;

    return `${base}/upload/${transforms}/${rest}`;
}