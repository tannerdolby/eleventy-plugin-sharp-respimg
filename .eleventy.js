const sharp = require("sharp");
const fs = require("fs");

module.exports = (eleventyConfig, pluginNamespace) => {
    eleventyConfig.namespace(pluginNamespace, () => {
        eleventyConfig.addPairedShortcode("respimg", (data, src, alt, imgDir, widths, sizes, className, width, height) => {
            const fileName = src.slice(0, -4);
            function bytesToKB(bytes) {
                const kbRatio = 1 * Math.pow(10, -3);
                return (bytes * kbRatio).toFixed(2);
            }
            function smallJpeg(stream, file) {
                const width = widths.small;
                return stream
                    .clone()
                    .jpeg({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-small.jpg`)
                    .then(res => {
                        res.file = `${imgDir}${file}-small.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to a small sized JPEG`, err);
                    })
            };
            function medJpeg(stream, file) {
                const width = widths.med;
                return stream
                    .clone()
                    .jpeg({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-med.jpg`)
                    .then(res => {
                        res.file = `${imgDir}${file}-med.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to a medium sized JPEG`, err);
                    })
            };
            function largeJpeg(stream, file) {
                const width = widths.large;
                return stream  
                    .clone()
                    .jpeg({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-large.jpg`)
                    .then(res => {
                        res.file = `${imgDir}${file}-large.jpg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to a large JPEG format`, err);
                    })
            };
            function smallWebp(stream, file) {
                const width = widths.small;
                return stream
                    .clone()
                    .webp({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-small.webp`)
                    .then(res => {
                        res.file = `${imgDir}${file}-small.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to small WebP format`, err);
                    })
            };
            function medWebp(stream, file) {
                const width = widths.med;
                return stream
                    .clone()
                    .webp({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-med.webp`)
                    .then(res => {
                        res.file = `${imgDir}${file}-med.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to medium sized webp`, err);
                    })
            };
            function largeWebp(stream, file) {
                const width = widths.large;
                return stream
                    .clone()
                    .webp({ quality: 85 })
                    .resize({ width: width })
                    .toFile(`${imgDir}${file}-large.webp`)
                    .then(res => {
                        res.file = `${imgDir}${file}-large.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(`Error transforming ${imgDir}${src} to small sized webp`, err);
                    })
            };
            function transform(img) {
                const fileName = img.slice(0, -4);
                const parentStream = sharp(imgDir.concat(img));
                
                smallJpeg(parentStream, fileName);
                medJpeg(parentStream, fileName);
                largeJpeg(parentStream, fileName);
                smallWebp(parentStream, fileName);
                medWebp(parentStream, fileName);
                largeWebp(parentStream, fileName);
    
                console.log(`Transforming ${imgDir}${src}, one moment!`);
            }
            const relDir = imgDir.slice(1);
            const imgMarkup = 
            `<img 
                srcSet="${relDir}${fileName}-large.jpg ${widths.large}w,
                    ${relDir}${fileName}-med.jpg ${widths.med}w,
                    ${relDir}${fileName}-small.jpg ${widths.small}w"
                sizes="${sizes}"
                src="${relDir}${fileName}-small.jpg"
                alt="${alt}"
                loading="lazy"
                class="${className}"
                width="${width}"
                height="${height}">`;
            const pictureMarkup =
            `<picture>
                <source 
                    type="image/webp"
                    srcSet="${relDir}${fileName}-large.webp ${widths.large}w,
                        ${relDir}${fileName}-med.webp ${widths.med}w,
                        ${relDir}${fileName}-small.webp ${widths.small}w"
                    sizes="${sizes}"
                >
                ${imgMarkup}
            </picture>`
            const files = {
                large_jpg: `${imgDir}${fileName}-large.jpg`,
                med_jpg: `${imgDir}${fileName}-med.jpg`,
                small_jpg: `${imgDir}${fileName}-small.jpg`,
                large_webp: `${imgDir}${fileName}-large.webp`,
                med_webp: `${imgDir}${fileName}-med.webp`,
                small_webp: `${imgDir}${fileName}-small.webp`
            };
            switch (fs.existsSync(imgDir.concat(src))) {
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
                    console.log(`${imgDir}${src} exists and can be transformed!`);
                    transform(src);
                    break;
            }
            return pictureMarkup; 
        });
    });
};