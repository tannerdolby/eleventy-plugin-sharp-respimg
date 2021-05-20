const sharp = require("sharp");
const fs = require("fs");

module.exports = (eleventyConfig, pluginNamespace) => {
    eleventyConfig.namespace(pluginNamespace, () => {
        eleventyConfig.addShortcode("respimg", (data) => {
            const fileName = data.src.slice(0, -4);
            let widths = data.widths.sort((a,b) => a - b);
            if (widths.length < 2) {
                throw new Error("The `widths` array expects atleast 3 string values");
            }
            function bytesToKB(bytes) {
                const kbRatio = 1 * Math.pow(10, -3);
                return (bytes * kbRatio).toFixed(2);
            }
            function smallJpeg(stream, file) {
                return stream
                    .clone()
                    .jpeg({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[0] })
                    .toFile(`${data.imgDir}${file}-small.jpg`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-small.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to a small sized JPEG`, err);
                    })
            };
            function medJpeg(stream, file) {
                return stream
                    .clone()
                    .jpeg({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[1] })
                    .toFile(`${data.imgDir}${file}-med.jpg`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-med.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to a medium sized JPEG`, err);
                    })
            };
            function largeJpeg(stream, file) {
                return stream  
                    .clone()
                    .jpeg({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[2] })
                    .toFile(`${data.imgDir}${file}-large.jpg`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-large.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to a large JPEG format`, err);
                    })
            };
            function smallWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[0] })
                    .toFile(`${data.imgDir}${file}-small.webp`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-small.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to small WebP format`, err);
                    })
            };
            function medWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[1] })
                    .toFile(`${data.imgDir}${file}-med.webp`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-med.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to medium sized webp`, err);
                    })
            };
            function largeWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[2] })
                    .toFile(`${data.imgDir}${file}-large.webp`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-large.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.imgDir}${data.src} to small sized webp`, err);
                    })
            };
            function transform(img) {
                const fileName = img.slice(0, -4);
                const parentStream = sharp(data.imgDir.concat(img));
                
                smallJpeg(parentStream, fileName);
                medJpeg(parentStream, fileName);
                largeJpeg(parentStream, fileName);
                smallWebp(parentStream, fileName);
                medWebp(parentStream, fileName);
                largeWebp(parentStream, fileName);
            }
            const relDir = data.imgDir.slice(1);
            const imgMarkup = 
            `<img 
                srcSet="${relDir}${fileName}-large.jpg ${data.widths.large}w,
                    ${relDir}${fileName}-med.jpg ${data.widths.med}w,
                    ${relDir}${fileName}-small.jpg ${data.widths.small}w"
                sizes="${data.sizes}"
                src="${relDir}${fileName}-small.jpg"
                alt="${data.alt}"
                loading="lazy"
                class="${data.className}"
                width="${data.width}"
                height="${data.height}">`;
            const pictureMarkup =
            `<picture>
                <source 
                    type="image/webp"
                    srcSet="${relDir}${fileName}-large.webp ${data.widths.large}w,
                        ${relDir}${fileName}-med.webp ${data.widths.med}w,
                        ${relDir}${fileName}-small.webp ${data.widths.small}w"
                    sizes="${data.sizes}"
                >
                ${imgMarkup}
            </picture>`
            const files = {
                large_jpg: `${data.imgDir}${fileName}-large.jpg`,
                med_jpg: `${data.imgDir}${fileName}-med.jpg`,
                small_jpg: `${data.imgDir}${fileName}-small.jpg`,
                large_webp: `${data.imgDir}${fileName}-large.webp`,
                med_webp: `${data.imgDir}${fileName}-med.webp`,
                small_webp: `${data.imgDir}${fileName}-small.webp`
            };
            let fileExists = fs.existsSync(data.imgDir.concat(data.src));

            if (!fileExists) {
                throw new Error(`Image doesn't exist! Cannot locate ${data.imgDir.concat(data.src)}`);
            }

            switch (fileExists) {
                case fs.existsSync(files.large_jpg):
                    break;
                case fs.existsSync(files.large_webp): 
                    break;
                case fs.existsSync(files.med_jpg):
                    break;
                case fs.existsSync(files.med_webp):
                    break;
                case fs.existsSync(files.small_jpg):
                    break;
                case fs.existsSync(files.small_webp):
                    break;
                default:
                    console.log(`${data.imgDir}${data.src} exists and can be transformed!`);
                    transform(data.src);
                    break;
            }
            return pictureMarkup; 
        });
   });
};