const sharp = require("sharp");
const fs = require("fs");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPairedShortcode("respimg", (data, src, alt, imgDir, widths, sizes) => {
        const fileName = src.slice(0, -4);

        function bytesToKB(bytes) {
            const kbRatio = 1 * Math.pow(10, -3);
            return (bytes * kbRatio).toFixed(3);
        }

        function smallJpeg(stream, file) {
            return stream
                .clone()
                .jpeg({ quality: 85 })
                .resize({ width: 320 })
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
            return stream
                .clone()
                .jpeg({ quality: 85 })
                .resize({ width: 640 })
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
            return stream  
                .clone()
                .jpeg({ quality: 85 })
                .resize({ width: 1024 })
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
            return stream
                .clone()
                .webp({ quality: 85 })
                .resize({ width: 320 })
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
            return stream
                .clone()
                .webp({ quality: 85 })
                .resize({ width: 640 })
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
            return stream
                .clone()
                .webp({ quality: 85 })
                .resize({ width: 1024 })
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

            console.log("Transforming image, one moment!");
        }

        const path = imgDir.replace(/^[.]/gm, "");
        const imgMarkup = 
        `<img 
            srcSet='${path}${fileName}-large.jpg ${widths.large}w,
                ${path}${fileName}-med.jpg ${widths.med}w,
                ${path}${fileName}-small.jpg ${widths.small}w'
            sizes='${sizes}'
            src='${path}${fileName}-small.jpg' 
            alt='${alt}'
            loading='lazy'>`;

        const pictureMarkup =
        `<picture>
            <source 
                type="image/webp"
                srcSet="${path}${fileName}-large.webp ${widths.large}w,
                    ${path}${fileName}-med.webp ${widths.med}w,
                    ${path}${fileName}-small.webp ${widths.small}w"
                sizes="${sizes}"
            >
            ${imgMarkup}
        </picture>`

        const files = {
            largejpg: `${imgDir}${fileName}-large.jpg`,
            medjpg: `${imgDir}${fileName}-med.jpg`,
            smalljpg: `${imgDir}${fileName}-small.jpg`,
            largewebp: `${imgDir}${fileName}-large.webp`,
            medwebp: `${imgDir}${fileName}-med.webp`,
            smallwebp: `${imgDir}${fileName}-small.webp`
        }

        switch (fs.existsSync(imgDir.concat(src))) {
            case fs.existsSync(files.largejpg):
                break;
            case fs.existsSync(files.largewebp): 
                break;
            case fs.existsSync(files.medjpg):
                break;
            case fs.existsSync(files.medwebp):
                break;
            case fs.existsSync(files.smalljpg):
                break;
            case fs.existsSync(files.smallwebp):
                break;
            default:
                console.log(`${imgDir}${src} can be transformed!`);
                transform(src);
                break;
        }
        return pictureMarkup; 
    });

    eleventyConfig.addPassthroughCopy("images");

    return {
        dir: {
            input: ".",
            output: "_site"
        },
        templateFormats: ["md", "liquid", "njk"]
    }
};