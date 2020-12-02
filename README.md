# eleventy-plugin-sharp-respimg
An Eleventy [paired shortcode](https://www.11ty.dev/docs/shortcodes/#paired-shortcodes) that performs build-time image transformations with [Sharp](https://sharp.pixelplumbing.com/) to resize large images into `.jpeg` and `.webp` formats with varying dimensions and generates `<picture>` tags for responsive images.

## Installation
In your Eleventy project, [install the plugin](https://www.npmjs.com/package/eleventy-plugin-sharp-respimg) from npm:
```
npm install eleventy-plugin-sharp-respimg
```
Then add it to your [Eleventy Config](https://www.11ty.dev/docs/config/) file:
```js
const respimg = require("eleventy-plugin-sharp-respimg");

module.exports = (eleventyConfig) => {
    eleventyConfig.addPlugin(respimg);
}
```

## What does it do?
It turns paired shortcodes like this:

```js
{% respimg 
    "car.jpg", 
    "Photo of a car", 
    "./images/",
    { small: 320, med: 640, large: 1024 },
    "(min-width: 450px) 33.3vw, 100vw",
%}{% endrespimg %}
```
into responsive image markup using `<picture>` tags like this:
```html
 <picture>
    <source 
        type="image/webp"
        srcSet="/images/car-large.webp 1024w,
                /images/car-med.webp 640w,
                /images/car-small.webp 320w"
        sizes="(min-width: 450px) 33.3vw, 100vw"
    >
    <img 
        srcSet='/images/car-large.jpg 1024w,
                /images/car-med.jpg 640w,
                /images/car-small.jpg 320w'
        sizes='(min-width: 450px) 33.3vw, 100vw'
        src='car-small.jpg'
        alt='Photo of a car'
        loading='lazy'
    >
</picture>
```
- The images are responsive by using a `<picture>` element which contains zero or more `<source>` elements and one `<img>` element to offer alternative versions of an image for different display/device scenarios. 
- Using `srcset` and `sizes`, you can deliver [variable-resolution images](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/), which respond to variable layout widths and screen densities.

## Transform mulitple images
The real power of using this paired shortcode is the ability to use data from [global data files](https://www.11ty.dev/docs/data-global/) or [front matter](https://www.11ty.dev/docs/data-frontmatter/) to transform multiple images at once.

If you have global JSON data `data.json` which is an array of objects like this:

```json
[
    {
        "src": "car.jpg",
        "imgDir": "./images/",
        "alt": "Photo of a car",
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "widths": {
            "small": "320",
            "med": "640",
            "large": "1024"
        }
    },
    {
        "src": "flower.jpg",
        "imgDir": "./images/",
        "alt": "Photo of a flower",
        "sizes": "(min-width: 450px) 33.3vw, 100vw",
        "widths": {
            "small": "320",
            "med": "640",
            "large": "1024"
        }
    }
]
```
you can use the paired shortcode to transform multiple images into responsive image markup using a `for` loop like this:

```js
{% for image in data %}
    {% respimg 
        image.src, 
        image.alt, 
        image.imgDir,
        image.widths, 
        image.sizes 
    %}{% endrespimg %}
{% endfor %}
```

## Paired shortcode options

| Parameter | Description |
| ------    | -------     |
| src       | The filename for an image. |
| alt       | A text description of the image. |
| image directory | The directory where the image file is located. |
| widths    | The desired image widths. Supports 320px, 640px, 1024px. |
| sizes     | The `sizes` attribute which defines a set of media conditions. |

## Notes
- Use `./` when declaring the image directory parameter as Sharp expects this.
- Use `.addPassthroughCopy` to include the images directory in your `_site` output with `eleventyConfig.addPassthroughCopy("imageDirectory");`.
- The `<picture>` and `<img>` tags generated by the paired shortcode don't have any styling out of the box. But they can be manipulated with a bit of CSS to apply different `width` or `height` attributes.

## TODO
- [ ] Add support for more custom widths, currently only supports (1024, 640, 320)
- [ ] If an image is smaller than 1024px, figure out what sizes to resize too or whether images must be larger than 1024px to perform image transformations.
- [ ] Possibly remove widths and make the parameter optional where the default width values are (1024, 640, 320) and once support is added could utilize more widths like (200, 300, 400, etc) if needed.
- [ ] Make the widths parameter an array of values rather than an object.

## Other Responsive Image Plugins
- [eleventy-img](https://github.com/11ty/eleventy-img)
- [eleventy-respimg](https://github.com/eeeps/eleventy-respimg)