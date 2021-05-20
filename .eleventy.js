const sharp = require("sharp");
const fs = require("fs");

module.exports = (eleventyConfig, pluginNamespace) => {
    eleventyConfig.namespace(pluginNamespace, () => {
        eleventyConfig.addShortcode("respimg", (data) => {
            let extRegex = /[^.]+$/gm;
            let fileRegex = /^\w+[^.]+/gm;
            let format = data.src.match(extRegex);
            let fileName = data.src.match(fileRegex);
            const imgFormats = [
                "png",
                "jpg",
                "jpeg",
                "webp",
                "avif"
            ];

            if (!imgFormats.includes(format[0])) {
                throw new Error("Invalid image format: Accepted formats are png, jpg, jpeg, avif, webp");
            }

            let widths = data.widths
                .sort((a,b) => a - b)
                .map(w => {
                    return typeof w == 'string' ? parseInt(w, 10) : w;
                });
            
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
                    .toFile(`${data.inputDir}${data.imgDir}${file}-small.jpeg`)
                    .then(res => {
                        res.file = `${data.inputDir}${data.imgDir}${file}-small.jpeg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to a small sized JPEG`, err);
                    })
            };
            function medJpeg(stream, file) {
                return stream
                    .clone()
                    .jpeg({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[1] })
                    .toFile(`${data.inputDir}${data.imgDir}${file}-med.jpeg`)
                    .then(res => {
                        res.file = `${data.inputDir}${data.imgDir}${file}-med.jpeg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to a medium sized JPEG`, err);
                    })
            };
            function largeJpeg(stream, file) {
                return stream  
                    .clone()
                    .jpeg({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[2] })
                    .toFile(`${data.inputDir}${data.imgDir}${file}-large.jpeg`)
                    .then(res => {
                        res.file = `${data.inputDir}${data.imgDir}${file}-large.jpeg`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to a large JPEG format`, err);
                    })
            };
            function smallWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[0] })
                    .toFile(`${data.inputDir}${data.imgDir}${file}-small.webp`)
                    .then(res => {
                        res.file = `${data.inputDir}${data.imgDir}${file}-small.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to small WebP format`, err);
                    })
            };
            function medWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[1] })
                    .toFile(`${data.inputDir}${data.imgDir}${file}-med.webp`)
                    .then(res => {
                        res.file = `${data.inputDir}${data.imgDir}${file}-med.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to medium sized webp`, err);
                    })
            };
            function largeWebp(stream, file) {
                return stream
                    .clone()
                    .webp({ quality: data.quality ? data.quality : 85 })
                    .resize({ width: widths[2] })
                    .toFile(`${data.inputDir}${data.imgDir}${file}-large.webp`)
                    .then(res => {
                        res.file = `${data.imgDir}${file}-large.webp`;
                        res.size = `${bytesToKB(res.size)} KB`;
                        res.quality = data.quality;
                        data.debug ? console.log(res) : null;
                    })
                    .catch(err => {
                        console.log(`Error transforming ${data.inputDir}${data.imgDir}${data.src} to small sized webp`, err);
                    })
            };
            function transform(img) {
                let filename = img.match(fileRegex);
                let parentStream = sharp(`${data.inputDir}${data.imgDir.concat(img)}`);
                
                smallJpeg(parentStream, filename[0]);
                medJpeg(parentStream, filename[0]);
                largeJpeg(parentStream, filename[0]);
                smallWebp(parentStream, filename[0]);
                medWebp(parentStream, filename[0]);
                largeWebp(parentStream, filename[0]);
            }

            const imgMarkup = 
            `<img 
                srcSet="${data.imgDir}${fileName}-large.jpeg ${data.widths[2]}w,
                ${data.imgDir}${fileName}-med.jpeg ${data.widths[1]}w,
                ${data.imgDir}${fileName}-small.jpeg ${data.widths[0]}w"
                sizes="${data.sizes}"
                src="${data.imgDir}${fileName}-small.jpeg"
                alt="${data.alt}"
                loading="lazy"
                class="${data.className}"
                width="${data.width}"
                height="${data.height}">`;
            const pictureMarkup =
            `<picture>
                <source 
                    type="image/webp"
                    srcSet="${data.imgDir}${fileName}-large.webp ${data.widths[2]}w,
                    ${data.imgDir}${fileName}-med.webp ${data.widths[1]}w,
                    ${data.imgDir}${fileName}-small.webp ${data.widths[0]}w"
                    sizes="${data.sizes}"
                >
                ${imgMarkup}
            </picture>`
            const files = {
                large_jpg: `${data.inputDir}${data.imgDir}${fileName}-large.jpeg`,
                med_jpg: `${data.inputDir}${data.imgDir}${fileName}-med.jpeg`,
                small_jpg: `${data.inputDir}${data.imgDir}${fileName}-small.jpeg`,
                large_webp: `${data.inputDir}${data.imgDir}${fileName}-large.webp`,
                med_webp: `${data.inputDir}${data.imgDir}${fileName}-med.webp`,
                small_webp: `${data.inputDir}${data.imgDir}${fileName}-small.webp`
            };

            let fileExists = fs.existsSync(`${data.inputDir}${data.imgDir.concat(data.src)}`);

            if (!fileExists) {
                throw new Error(`Image doesn't exist! Cannot locate ${data.inputDir}${data.imgDir.concat(data.src)}`);
            }

            let i = 0;
            if (fileExists) { 
                for (const name in files) {
                    if (fs.existsSync(files[name])) {
                        i += 1;
                    }
                }
                if (!data.overwrite && i !== 6) {
                    transform(data.src);
                }
                if (data.overwrite && i == 6) {
                    transform(data.src);
                } else if (!data.overwrite && i == 6) {
                    // bail
                }
            }
            return pictureMarkup;
        });
   });
};